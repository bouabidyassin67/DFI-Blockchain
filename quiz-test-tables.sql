
-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE SET NULL,
  passing_score INTEGER DEFAULT 70,
  time_limit INTEGER, -- in minutes
  attempts_allowed INTEGER DEFAULT 3,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT CHECK (type IN ('multiple_choice', 'true_false', 'free_text')),
  options JSONB,
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER,
  passed BOOLEAN,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  answers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create IQ tests table
CREATE TABLE public.iq_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  time_limit INTEGER, -- in minutes
  question_count INTEGER,
  premium_required BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create IQ test questions table
CREATE TABLE public.iq_test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES public.iq_tests(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('pattern', 'sequence', 'verbal', 'spatial', 'logical')),
  options JSONB,
  correct_answer TEXT,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  order_index INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create IQ test attempts table
CREATE TABLE public.iq_test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES public.iq_tests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER,
  iq_score INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  answers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables

-- Quizzes RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public quizzes viewable by everyone"
  ON public.quizzes FOR SELECT USING (published = true);

CREATE POLICY "Course creators can view their own quizzes"
  ON public.quizzes FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.quizzes.course_id 
    AND public.courses.instructor_id = auth.uid()
  ));

CREATE POLICY "Course creators can update their own quizzes"
  ON public.quizzes FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.quizzes.course_id 
    AND public.courses.instructor_id = auth.uid()
  ));

CREATE POLICY "Course creators can insert quizzes for their courses"
  ON public.quizzes FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = course_id 
    AND public.courses.instructor_id = auth.uid()
  ));

-- Quiz Questions RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions viewable with quiz access"
  ON public.quiz_questions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.quizzes 
    WHERE public.quizzes.id = public.quiz_questions.quiz_id 
    AND public.quizzes.published = true
  ));

CREATE POLICY "Quiz creators can view their own questions"
  ON public.quiz_questions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.quizzes 
    JOIN public.courses ON public.quizzes.course_id = public.courses.id
    WHERE public.quiz_questions.quiz_id = public.quizzes.id 
    AND public.courses.instructor_id = auth.uid()
  ));

CREATE POLICY "Quiz creators can insert questions for their quizzes"
  ON public.quiz_questions FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quizzes 
    JOIN public.courses ON public.quizzes.course_id = public.courses.id
    WHERE quiz_id = public.quizzes.id 
    AND public.courses.instructor_id = auth.uid()
  ));

-- Quiz Attempts RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts"
  ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);

-- IQ Tests RLS
ALTER TABLE public.iq_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public IQ tests viewable by everyone"
  ON public.iq_tests FOR SELECT 
  USING (published = true AND (
    premium_required = false OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() 
      AND (public.profiles.subscription_tier = 'premium' OR public.profiles.subscription_tier = 'basic')
    )
  ));

CREATE POLICY "Admin can manage all IQ tests"
  ON public.iq_tests FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE public.profiles.id = auth.uid() 
    AND public.profiles.role = 'admin'
  ));

-- IQ Test Questions RLS
ALTER TABLE public.iq_test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "IQ test questions viewable with test access"
  ON public.iq_test_questions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.iq_tests 
    WHERE public.iq_tests.id = public.iq_test_questions.test_id 
    AND public.iq_tests.published = true
  ));

CREATE POLICY "Admin can manage all IQ test questions"
  ON public.iq_test_questions FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE public.profiles.id = auth.uid() 
    AND public.profiles.role = 'admin'
  ));

-- IQ Test Attempts RLS
ALTER TABLE public.iq_test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own IQ test attempts"
  ON public.iq_test_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own IQ test attempts"
  ON public.iq_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own IQ test attempts"
  ON public.iq_test_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Sample data for quizzes
INSERT INTO public.quizzes (title, description, passing_score, time_limit, attempts_allowed, published)
VALUES 
('Blockchain Basics Quiz', 'Test your knowledge of blockchain fundamentals', 70, 15, 3, true),
('Smart Contracts Assessment', 'Advanced test on smart contract development', 80, 30, 2, true),
('DeFi Concepts Quiz', 'Understanding decentralized finance applications', 75, 20, 3, true);

-- Sample data for IQ tests
INSERT INTO public.iq_tests (title, description, time_limit, question_count, premium_required, published)
VALUES 
('Logic and Pattern Recognition', 'Test your pattern recognition and logical reasoning abilities', 30, 20, false, true),
('Advanced Spatial Reasoning', 'Premium test for spatial intelligence and visualization', 45, 30, true, true),
('Verbal Intelligence Assessment', 'Test your verbal reasoning and comprehension', 40, 25, false, true);
