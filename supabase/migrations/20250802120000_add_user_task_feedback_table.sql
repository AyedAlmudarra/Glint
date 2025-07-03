CREATE TABLE public.user_task_feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id BIGINT NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, task_id)
);

-- Enable RLS
ALTER TABLE public.user_task_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow users to submit and view their own feedback"
ON public.user_task_feedback
FOR ALL
USING (auth.uid() = user_id); 