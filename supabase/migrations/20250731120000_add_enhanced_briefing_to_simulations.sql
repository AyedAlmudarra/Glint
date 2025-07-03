ALTER TABLE public.simulations
ADD COLUMN enhanced_briefing jsonb;

ALTER TABLE public.simulations
DROP COLUMN briefing_content;

ALTER TABLE public.simulations
DROP COLUMN day_in_the_life; 