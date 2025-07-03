-- First, drop the existing incorrect constraint.
-- Note: The constraint name 'chat_messages_sender_check' is the default name. 
-- If you named it differently, you might need to adjust this script.
ALTER TABLE public.chat_messages
DROP CONSTRAINT IF EXISTS chat_messages_sender_check;

-- Then, add the new, correct constraint.
ALTER TABLE public.chat_messages
ADD CONSTRAINT chat_messages_sender_check CHECK (sender IN ('user', 'assistant'));

-- Add a comment to clarify the purpose of this change.
COMMENT ON CONSTRAINT chat_messages_sender_check ON public.chat_messages IS 'Ensures sender is either "user" or "assistant" to align with Cohere API roles.';
