-- Update default activation fee from 13400 to 13450
ALTER TABLE withdrawal_requests 
ALTER COLUMN activation_fee SET DEFAULT 13450;

-- Update any existing records that have the old default fee
UPDATE withdrawal_requests 
SET activation_fee = 13450 
WHERE activation_fee = 13400;