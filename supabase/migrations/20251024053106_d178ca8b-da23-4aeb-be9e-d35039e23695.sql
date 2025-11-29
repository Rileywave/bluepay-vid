-- Add account upgrade status and tax/join tracking to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS account_upgraded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tax_join_completed_at TIMESTAMP WITH TIME ZONE;

-- Add payment screenshot field to withdrawal requests
ALTER TABLE withdrawal_requests
ADD COLUMN IF NOT EXISTS payment_screenshot TEXT;

-- Create function to reset tax/join bonus after 24 hours
CREATE OR REPLACE FUNCTION reset_tax_join_bonus()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset referral rate for users whose tax_join bonus expired (>24 hours)
  UPDATE profiles
  SET referral_rate = 15000,
      tax_join_completed_at = NULL
  WHERE tax_join_completed_at IS NOT NULL
    AND tax_join_completed_at < NOW() - INTERVAL '24 hours'
    AND referral_rate > 15000;
END;
$$;