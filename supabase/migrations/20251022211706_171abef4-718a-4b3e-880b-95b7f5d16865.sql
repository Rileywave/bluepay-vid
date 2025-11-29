-- Add referral earnings and rate fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(10, 2) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS referral_rate DECIMAL(10, 2) DEFAULT 15000 NOT NULL;

-- Update the process_referral function to credit earnings
CREATE OR REPLACE FUNCTION public.process_referral(referrer_code text, new_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  referrer_id uuid;
  referrer_rate DECIMAL(10, 2);
BEGIN
  -- Find the referrer by code (case-insensitive)
  SELECT id, referral_rate INTO referrer_id, referrer_rate
  FROM profiles
  WHERE upper(referral_code) = upper(referrer_code);
  
  IF referrer_id IS NOT NULL THEN
    -- Update the new user's referred_by
    UPDATE profiles
    SET referred_by = referrer_id
    WHERE id = new_user_id;
    
    -- Increment referrer's count and add earnings
    UPDATE profiles
    SET 
      referral_count = referral_count + 1,
      referral_earnings = referral_earnings + referrer_rate
    WHERE id = referrer_id;
  END IF;
END;
$$;

-- Create a withdrawal_requests table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on withdrawal_requests
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for withdrawal_requests
CREATE POLICY "Users can view their own withdrawal requests"
ON public.withdrawal_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own withdrawal requests"
ON public.withdrawal_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger for withdrawal_requests updated_at
CREATE TRIGGER update_withdrawal_requests_updated_at
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create a referral_upgrades table to track upgrade payments
CREATE TABLE IF NOT EXISTS public.referral_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  previous_rate DECIMAL(10, 2) NOT NULL,
  new_rate DECIMAL(10, 2) NOT NULL,
  payment_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
  payment_proof TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on referral_upgrades
ALTER TABLE public.referral_upgrades ENABLE ROW LEVEL SECURITY;

-- Create policies for referral_upgrades
CREATE POLICY "Users can view their own referral upgrades"
ON public.referral_upgrades
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral upgrades"
ON public.referral_upgrades
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger for referral_upgrades updated_at
CREATE TRIGGER update_referral_upgrades_updated_at
BEFORE UPDATE ON public.referral_upgrades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();