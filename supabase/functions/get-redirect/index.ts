import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        // Get slug from query params
        const url = new URL(req.url)
        const slug = url.searchParams.get('slug')

        if (!slug) {
            throw new Error('Slug parameter is required')
        }

        // Fetch payment link by slug
        const { data: paymentLink, error: fetchError } = await supabaseClient
            .from('payment_links')
            .select('*')
            .eq('slug', slug)
            .single()

        if (fetchError || !paymentLink) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Payment link not found',
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404,
                }
            )
        }

        // Increment clicks counter
        const { error: updateError } = await supabaseClient
            .from('payment_links')
            .update({
                clicks: (paymentLink.clicks || 0) + 1,
                last_clicked_at: new Date().toISOString(),
            })
            .eq('id', paymentLink.id)

        if (updateError) {
            console.error('Error updating clicks:', updateError)
            // Don't fail the request if click tracking fails
        }

        return new Response(
            JSON.stringify({
                success: true,
                redirectUrl: paymentLink.payment_url,
                provider: paymentLink.provider,
                amount: paymentLink.amount,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error: any) {
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
