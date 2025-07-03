-- Final, robust version of the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Temporarily bypass RLS by switching to the 'postgres' role
  SET LOCAL ROLE 'postgres';

  INSERT INTO public.users (id, full_name, first_name, last_name, date_of_birth, education_level, fields_of_interest)
  VALUES (
    NEW.id,
    -- Safely construct full_name, handling potential nulls
    TRIM(COALESCE(NEW.raw_user_meta_data ->> 'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    -- Safely convert date string, turning empty strings into NULL
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'date_of_birth'), '')::DATE,
    NEW.raw_user_meta_data ->> 'education_level',
    -- Safely process the interests array, handling null or non-array values
    (
      SELECT array_agg(interest)
      FROM jsonb_array_elements_text(
        CASE
          WHEN jsonb_typeof(NEW.raw_user_meta_data -> 'fields_of_interest') = 'array' THEN NEW.raw_user_meta_data -> 'fields_of_interest'
          ELSE '[]'::jsonb
        END
      ) AS t(interest)
    )
  );
  
  -- Revert the role change at the end of the transaction
  RESET ROLE;
  
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists to ensure it's re-linked to the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Re-create the trigger to link it to the new function logic
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();