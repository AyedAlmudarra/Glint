-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.users;

-- Create a more secure policy that only allows users to read their own profile
CREATE POLICY "Users can view their own profile." ON public.users
  FOR SELECT USING (auth.uid() = id); 