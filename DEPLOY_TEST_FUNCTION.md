# 🚀 Deploy Rápido - Edge Function de Teste

## Código para Deploy

Copie o código abaixo e cole no Supabase Dashboard ao criar a Edge Function `test-provider-connection`:

\`\`\`typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

async function testPushinPay(token: string): Promise<{ success: boolean, message: string }> {
    try {
        const response = await fetch('https://api.pushinpay.com.br/api/account/balance', {
            method: 'GET',
            headers: {
                'Authorization': \`Bearer \${token}\`,
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            const data = await response.json()
            return { 
                success: true, 
                message: \`✅ Conexão bem-sucedida! Saldo: R$ \${data.balance || '0.00'}\` 
            }
        } else if (response.status === 401) {
            return { 
                success: false, 
                message: '❌ Token inválido ou expirado. Verifique suas credenciais.' 
            }
        } else {
            const errorText = await response.text()
            return { 
                success: false, 
                message: \`❌ Erro \${response.status}: \${errorText}\` 
            }
        }
    } catch (error) {
        console.error('Pushin Pay test error:', error)
        return { 
            success: false, 
            message: \`❌ Erro de conexão: \${error.message}\` 
        }
    }
}

async function testStripe(apiKey: string): Promise<{ success: boolean, message: string }> {
    try {
        const response = await fetch('https://api.stripe.com/v1/balance', {
            method: 'GET',
            headers: {
                'Authorization': \`Bearer \${apiKey}\`,
            },
        })

        if (response.ok) {
            return { success: true, message: '✅ Conexão com Stripe bem-sucedida!' }
        } else {
            return { success: false, message: '❌ Credenciais Stripe inválidas.' }
        }
    } catch (error) {
        return { success: false, message: \`❌ Erro: \${error.message}\` }
    }
}

async function testMercadoPago(accessToken: string): Promise<{ success: boolean, message: string }> {
    try {
        const response = await fetch('https://api.mercadopago.com/v1/account/settings', {
            method: 'GET',
            headers: {
                'Authorization': \`Bearer \${accessToken}\`,
            },
        })

        if (response.ok) {
            return { success: true, message: '✅ Conexão com Mercado Pago bem-sucedida!' }
        } else {
            return { success: false, message: '❌ Token Mercado Pago inválido.' }
        }
    } catch (error) {
        return { success: false, message: \`❌ Erro: \${error.message}\` }
    }
}

serve(async (req) => {
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

        const {
            data: { user },
            error: userError,
        } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        const { provider } = await req.json()

        if (!provider) {
            throw new Error('Missing required field: provider')
        }

        const { data: credentials, error: credError } = await supabaseClient
            .from('provider_credentials')
            .select('*')
            .eq('user_id', user.id)
            .eq('provider', provider)
            .eq('is_active', true)
            .single()

        if (credError || !credentials) {
            throw new Error(\`Provider \${provider} not configured. Please add your credentials first.\`)
        }

        const apiKey = await decrypt(credentials.api_key_encrypted)

        let result: { success: boolean, message: string }

        switch (provider) {
            case 'pushinpay':
                result = await testPushinPay(apiKey)
                break
            case 'stripe':
                result = await testStripe(apiKey)
                break
            case 'mercadopago':
                result = await testMercadoPago(apiKey)
                break
            default:
                result = { 
                    success: false, 
                    message: \`Provider \${provider} não suporta teste de conexão ainda.\` 
                }
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Test provider error:', error)
        return new Response(
            JSON.stringify({ 
                success: false, 
                message: error.message 
            }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        )
    }
})
\`\`\`

## Passo a Passo

1. Acesse: https://rhesplerpuaibdvyoety.supabase.co
2. Edge Functions → Create a new function
3. Name: `test-provider-connection`
4. Cole o código acima
5. Deploy

Pronto! 🚀
