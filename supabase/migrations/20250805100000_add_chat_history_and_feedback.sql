-- Create the table for storing chat messages
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    content TEXT NOT NULL
);

-- Add comments to the chat_messages table and its columns
COMMENT ON TABLE public.chat_messages IS 'Stores the history of chat conversations between users and the AI assistant.';
COMMENT ON COLUMN public.chat_messages.user_id IS 'The ID of the user who participated in the chat.';
COMMENT ON COLUMN public.chat_messages.sender IS 'Indicates whether the message was sent by the "user" or the "ai".';
COMMENT ON COLUMN public.chat_messages.content IS 'The text content of the chat message.';

-- Enable Row Level Security for the chat_messages table
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the chat_messages table
CREATE POLICY "Allow users to see their own chat messages"
ON public.chat_messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own chat history"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);


-- Create the table for storing feedback on AI messages
CREATE TABLE public.message_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add comments to the message_feedback table and its columns
COMMENT ON TABLE public.message_feedback IS 'Stores user feedback (positive/negative) for specific AI-generated messages.';
COMMENT ON COLUMN public.message_feedback.message_id IS 'The ID of the AI message that received feedback.';
COMMENT ON COLUMN public.message_feedback.user_id IS 'The ID of the user who provided the feedback.';
COMMENT ON COLUMN public.message_feedback.rating IS 'The feedback rating, either "positive" or "negative".';

-- Enable Row Level Security for the message_feedback table
ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the message_feedback table
CREATE POLICY "Allow users to see their own feedback"
ON public.message_feedback
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own feedback"
ON public.message_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id); 