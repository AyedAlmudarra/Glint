-- 12. Create the final 'handle_new_user' function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, full_name, date_of_birth, education_level, fields_of_interest)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    (NEW.raw_user_meta_data ->> 'first_name') || ' ' || (NEW.raw_user_meta_data ->> 'last_name'),
    (NEW.raw_user_meta_data ->> 'date_of_birth')::DATE,
    NEW.raw_user_meta_data ->> 'education_level',
    (SELECT array_agg(interest) FROM jsonb_array_elements_text(NEW.raw_user_meta_data -> 'fields_of_interest') AS t(interest))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create the trigger for the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then create your trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();