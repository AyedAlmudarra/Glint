ALTER TABLE public.simulations
ADD COLUMN day_in_the_life TEXT,
ADD COLUMN core_responsibilities JSONB,
ADD COLUMN salary_low INTEGER,
ADD COLUMN salary_high INTEGER,
ADD COLUMN guide_name TEXT,
ADD COLUMN guide_image_url TEXT; 