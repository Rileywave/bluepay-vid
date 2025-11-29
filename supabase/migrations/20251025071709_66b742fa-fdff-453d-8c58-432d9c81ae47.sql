-- Fix critical security issue: profiles table data exposure

-- Remove public read access and add owner-only policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);