import { supabase } from './supabase';

/**
 * Helper function to call Supabase Edge Functions with proper authentication headers.
 * This resolves issues with 401 (Unauthorized) and 406 (Not Acceptable) errors.
 * 
 * @param functionName The name of the Edge Function to call
 * @param body The JSON body to send
 * @returns The JSON response from the function
 */
export async function callEdgeFunction<T = any>(functionName: string, body: any): Promise<{ data: T | null; error: any }> {
    try {
        // Get current user session to ensure we have a valid token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Error getting session:', sessionError);
            return { data: null, error: sessionError };
        }

        if (!session) {
            console.error('No active session found');
            return { data: null, error: new Error('User not authenticated') };
        }

        // Call the function using supabase.functions.invoke which handles headers automatically,
        // but we can enforce strict headers if needed. 
        // Ideally, supabase-js handles the Bearer token automatically if the client is configured correctly.
        // However, to be absolutely sure and follow the user's request for a robust solution:

        const { data, error } = await supabase.functions.invoke(functionName, {
            body: body,
            headers: {
                // Enforce JSON content type
                'Content-Type': 'application/json',
                // Start with Authorization header from session (supabase-js does this, but being explicit helps debug)
                'Authorization': `Bearer ${session.access_token}`
            }
        });

        if (error) {
            console.error(`Error calling function ${functionName}:`, error);
            // Validar se é um erro retornado pela função (ex: 400 Bad Request com mensagem)
            // As vezes o invoke retorna o erro como objeto simples
            return { data: null, error };
        }

        return { data, error: null };

    } catch (err: any) {
        console.error(`Unexpected error calling ${functionName}:`, err);
        return { data: null, error: err };
    }
}
