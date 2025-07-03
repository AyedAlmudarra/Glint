-- Enable RLS for the users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they are too restrictive
-- It's often safer to be explicit and drop what you want to replace.
-- For example: DROP POLICY IF EXISTS "Users can view their own data." ON public.users;
-- For example: DROP POLICY IF EXISTS "Users can insert their own data." ON public.users;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile."
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own record."
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile."
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id); 