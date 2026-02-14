/**
 * Application configuration
 */

export const config = {
    appDomain: import.meta.env.VITE_APP_DOMAIN || 'http://localhost:5173',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

/**
 * Get the full payment link URL for a given slug
 */
export function getPaymentLinkUrl(slug: string): string {
    return `${config.appDomain}/p/${slug}`;
}
