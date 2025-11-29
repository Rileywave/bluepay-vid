-- Update withdrawal_requests table for new withdrawal flow
-- Add new fields for activation fee and notes
ALTER TABLE withdrawal_requests
ADD COLUMN IF NOT EXISTS activation_fee numeric DEFAULT 13400,
ADD COLUMN IF NOT EXISTS notes text;

-- Update status field to handle more statuses (keeping as text for flexibility)
-- Possible values: pending, awaiting_activation_payment, receipt_uploaded, under_review, approved, paid, rejected

-- Add comment to document status values
COMMENT ON COLUMN withdrawal_requests.status IS 'Status values: pending, awaiting_activation_payment, receipt_uploaded, under_review, approved, paid, rejected';