-- Add admin policies for withdrawal management
CREATE POLICY "Admins can view all withdrawal requests"
ON public.withdrawal_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update withdrawal requests"
ON public.withdrawal_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add column to track withdrawal amount separately if needed
ALTER TABLE public.withdrawal_requests
ADD COLUMN IF NOT EXISTS withdrawal_amount NUMERIC NOT NULL DEFAULT 0;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_status ON public.withdrawal_requests(user_id, status);