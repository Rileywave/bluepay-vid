-- Create storage buckets for withdrawal and upgrade proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('withdrawal-proofs', 'withdrawal-proofs', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('upgrade-proofs', 'upgrade-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies for withdrawal proofs bucket
CREATE POLICY "Users can upload their own withdrawal proofs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'withdrawal-proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own withdrawal proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'withdrawal-proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policies for upgrade proofs bucket
CREATE POLICY "Users can upload their own upgrade proofs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'upgrade-proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own upgrade proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'upgrade-proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);