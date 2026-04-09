-- Create the education_stage enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'education_stage') THEN
        CREATE TYPE education_stage AS ENUM (
            'after_10th', 
            'after_12th_science', 
            'after_12th_commerce', 
            'after_12th_arts', 
            'after_diploma', 
            'after_graduation'
        );
    END IF;
END
$$;

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS public.quiz_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- You can add 'REFERENCES auth.users(id) ON DELETE CASCADE' but keeping it flexible to avoid foreign key errors if auth schema is strictly managed
    answers JSONB NOT NULL,
    results JSONB,
    education_stage education_stage,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own responses
DROP POLICY IF EXISTS "Users can insert their own quiz responses" ON public.quiz_responses;
CREATE POLICY "Users can insert their own quiz responses" 
ON public.quiz_responses 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own responses
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON public.quiz_responses;
CREATE POLICY "Users can view their own quiz responses" 
ON public.quiz_responses 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
