-- ============================================
-- PROVIDER CREDENTIALS TABLE
-- ============================================

-- Create provider_credentials table
CREATE TABLE IF NOT EXISTS public.provider_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('stripe', 'mercadopago', 'kirvano', 'asaas', 'gerencianet', 'pagarme', 'pushinpay')),
  api_key_encrypted text NOT NULL,
  secret_key_encrypted text NOT NULL,
  environment text DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, provider, environment)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_provider_credentials_user_id ON public.provider_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_credentials_provider ON public.provider_credentials(provider);

-- Enable Row Level Security
ALTER TABLE public.provider_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own credentials"
  ON public.provider_credentials
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credentials"
  ON public.provider_credentials
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials"
  ON public.provider_credentials
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials"
  ON public.provider_credentials
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE public.provider_credentials IS 'Encrypted payment provider credentials for each user';
COMMENT ON COLUMN public.provider_credentials.api_key_encrypted IS 'Encrypted API key or client ID';
COMMENT ON COLUMN public.provider_credentials.secret_key_encrypted IS 'Encrypted secret key or token';
