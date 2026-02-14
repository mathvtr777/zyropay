import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================
// ENCRYPTION/DECRYPTION UTILITIES
// ============================================

const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY')!

async function decrypt(encryptedText: string): Promise<string> {
    try {
        const [ivHex, encryptedHex] = encryptedText.split(':')
        const iv = hexToUint8Array(ivHex)
        const encrypted = hexToUint8Array(encryptedHex)

        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        )

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encrypted
        )

        return new TextDecoder().decode(decrypted)
    } catch (error) {
        console.error('Decryption error:', error)
        throw new Error('Failed to decrypt credentials')
    }
}

function hexToUint8Array(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes
}

// ============================================
// PROVIDER ADAPTERS
// ============================================

interface PaymentLinkResult {
    url: string
    externalId?: string
}

// ============================================
// SLUG GENERATION
// ============================================

const SLUG_LENGTH = 6
const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No ambiguous chars

function generateSlug(): string {
    let slug = ''
    for (let i = 0; i < SLUG_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length)
        slug += CHARACTERS[randomIndex]
    }
    return slug
}

async function generateUniqueSlug(supabaseClient: any): Promise<string> {
    const maxAttempts = 10

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const slug = generateSlug()

        // Check if slug exists
        const { data } = await supabaseClient
            .from('payment_links')
            .select('id')
            .eq('slug', slug)
            .single()

        if (!data) {
            return slug
        }
    }

    throw new Error('Failed to generate unique slug')
}


class StripeAdapter {
    private apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    async createPaymentLink(amount: number, description: string): Promise<PaymentLinkResult> {
        const response = await fetch('https://api.stripe.com/v1/payment_links', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'line_items[0][price_data][currency]': 'brl',
                'line_items[0][price_data][product_data][name]': description || 'Pagamento',
                'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
                'line_items[0][quantity]': '1',
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Stripe API error: ${error}`)
        }

        const data = await response.json()
        return {
            url: data.url,
            externalId: data.id,
        }
    }
}

class MercadoPagoAdapter {
    private accessToken: string

    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    async createPaymentLink(amount: number, description: string): Promise<PaymentLinkResult> {
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [{
                    title: description || 'Pagamento',
                    unit_price: amount,
                    quantity: 1,
                }],
                back_urls: {
                    success: 'https://priva.app/payment/success',
                    failure: 'https://priva.app/payment/failure',
                    pending: 'https://priva.app/payment/pending',
                },
                auto_return: 'approved',
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Mercado Pago API error: ${error}`)
        }

        const data = await response.json()
        return {
            url: data.init_point,
            externalId: data.id,
        }
    }
}

class AsaasAdapter {
    private apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    async createPaymentLink(amount: number, description: string): Promise<PaymentLinkResult> {
        const response = await fetch('https://www.asaas.com/api/v3/paymentLinks', {
            method: 'POST',
            headers: {
                'access_token': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: description || 'Pagamento',
                description: description,
                chargeType: 'DETACHED',
                billingType: 'UNDEFINED',
                value: amount,
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Asaas API error: ${error}`)
        }

        const data = await response.json()
        return {
            url: data.url,
            externalId: data.id,
        }
    }
}

class PushinPayAdapter {
    private apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    async createPaymentLink(amount: number, description: string): Promise<PaymentLinkResult> {
        const response = await fetch('https://api.pushinpay.com.br/api/pix/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                description: description || 'Pagamento',
                expiresIn: 3600, // 1 hora
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Pushin Pay API error: ${error}`)
        }

        const data = await response.json()
        return {
            url: data.paymentUrl || data.qrCodeUrl,
            externalId: data.id || data.transactionId,
        }
    }
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // Get authenticated user
        const {
            data: { user },
            error: userError,
        } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // Parse request body
        const { provider, amount, description } = await req.json()

        if (!provider || !amount) {
            throw new Error('Missing required fields: provider, amount')
        }

        // Get provider credentials
        const { data: credentials, error: credError } = await supabaseClient
            .from('provider_credentials')
            .select('*')
            .eq('user_id', user.id)
            .eq('provider', provider)
            .eq('is_active', true)
            .single()

        if (credError || !credentials) {
            throw new Error(`Provider ${provider} not configured. Please add your credentials first.`)
        }

        // Decrypt credentials
        const apiKey = await decrypt(credentials.api_key_encrypted)
        const secretKey = await decrypt(credentials.secret_key_encrypted)

        // Create payment link based on provider
        let result: PaymentLinkResult

        switch (provider) {
            case 'stripe':
                result = await new StripeAdapter(secretKey).createPaymentLink(amount, description)
                break
            case 'mercadopago':
                result = await new MercadoPagoAdapter(secretKey).createPaymentLink(amount, description)
                break
            case 'asaas':
                result = await new AsaasAdapter(apiKey).createPaymentLink(amount, description)
                break
            case 'pushinpay':
                // Pushin Pay usa apenas o token (pode estar em apiKey ou secretKey)
                result = await new PushinPayAdapter(secretKey || apiKey).createPaymentLink(amount, description)
                break
            default:
                throw new Error(`Provider ${provider} not supported yet`)
        }

        // Generate unique slug
        const slug = await generateUniqueSlug(supabaseClient)

        // Save payment link to database
        const { data: paymentLink, error: linkError } = await supabaseClient
            .from('payment_links')
            .insert({
                user_id: user.id,
                provider,
                amount,
                description,
                payment_url: result.url,
                external_id: result.externalId,
                slug,
                status: 'active',
            })
            .select()
            .single()

        if (linkError) {
            console.error('Error saving payment link:', linkError)
            // Still return the URL even if saving fails
        }

        // Return custom domain link
        const customDomainLink = `https://zyrocheckout.com.br/p/${slug}`

        return new Response(
            JSON.stringify({
                success: true,
                paymentLink: customDomainLink,
                slug,
                id: paymentLink?.id,
                gatewayUrl: result.url, // Include gateway URL for reference
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
