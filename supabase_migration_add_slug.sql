-- Add slug-based redirection columns to payment_links table
ALTER TABLE public.payment_links 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS clicks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_clicked_at timestamp with time zone;

-- Create index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_payment_links_slug ON public.payment_links(slug);

-- Add comment
COMMENT ON COLUMN public.payment_links.slug IS 'Unique short slug for custom domain links (e.g., ABC123)';
COMMENT ON COLUMN public.payment_links.clicks IS 'Number of times this payment link was clicked';
COMMENT ON COLUMN public.payment_links.last_clicked_at IS 'Timestamp of the last click on this link';
