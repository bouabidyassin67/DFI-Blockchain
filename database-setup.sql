
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up storage for user avatars and course materials
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('courses', 'courses', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  purchased_courses UUID[] DEFAULT '{}',
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  highlight BOOLEAN DEFAULT false,
  tier TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  instructor_id UUID REFERENCES auth.users(id),
  price DECIMAL(10, 2),
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER, -- in minutes
  modules_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  subscription_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create course modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration INTEGER, -- in minutes
  content_type TEXT DEFAULT 'video',
  content_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create enrollments table to track user progress
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_modules INTEGER DEFAULT 0,
  total_modules INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_date TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

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

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  certificate_url TEXT,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  verification_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table for communication
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  room_id TEXT, -- For group messages like 'class'
  read BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create purchases table to track payments
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  product_type TEXT CHECK (product_type IN ('course', 'subscription')),
  product_id UUID, -- Could be course_id or subscription plan id
  status TEXT DEFAULT 'completed',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security Policies --

-- Profiles: Users can read all profiles but only update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
  ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Subscription Plans: Viewable by everyone
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscription plans viewable by everyone"
  ON public.subscription_plans FOR SELECT USING (true);

-- Courses: Public courses viewable by everyone, unpublished only by creator or admin
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public courses viewable by everyone"
  ON public.courses FOR SELECT USING (published = true);

CREATE POLICY "Course creators can view their own courses"
  ON public.courses FOR SELECT USING (auth.uid() = instructor_id);

CREATE POLICY "Course creators can update their own courses"
  ON public.courses FOR UPDATE USING (auth.uid() = instructor_id);

CREATE POLICY "Course creators can delete their own courses"
  ON public.courses FOR DELETE USING (auth.uid() = instructor_id);

-- Course Modules: Follow same access rules as courses
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public course modules viewable by everyone"
  ON public.course_modules FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.course_modules.course_id 
    AND public.courses.published = true
  ));

CREATE POLICY "Course creators can view their own modules"
  ON public.course_modules FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE public.courses.id = public.course_modules.course_id 
    AND public.courses.instructor_id = auth.uid()
  ));

-- Enrollments: Users can only view and manage their own enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Quizzes: Published quizzes are viewable by enrolled users
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

-- Quiz Questions: Same access as quizzes
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions viewable with quiz access"
  ON public.quiz_questions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.quizzes 
    WHERE public.quizzes.id = public.quiz_questions.quiz_id 
    AND public.quizzes.published = true
  ));

-- Quiz Attempts: Users can only view and manage their own attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts"
  ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);

-- IQ Tests: Published tests viewable by everyone, premium ones need subscription check
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

-- IQ Test Questions: Same access as tests
ALTER TABLE public.iq_test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "IQ test questions viewable with test access"
  ON public.iq_test_questions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.iq_tests 
    WHERE public.iq_tests.id = public.iq_test_questions.test_id 
    AND public.iq_tests.published = true
  ));

-- IQ Test Attempts: Users can only view and manage their own attempts
ALTER TABLE public.iq_test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own IQ test attempts"
  ON public.iq_test_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own IQ test attempts"
  ON public.iq_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own IQ test attempts"
  ON public.iq_test_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Certificates: Users can view their own certificates, all can verify public ones
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
  ON public.certificates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public certificates are verifiable by everyone"
  ON public.certificates FOR SELECT USING (verification_code IS NOT NULL);

-- Messages: Users can view messages they sent or received
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent or received"
  ON public.messages FOR SELECT 
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id OR 
    room_id IS NOT NULL OR  -- Room messages are visible to all
    is_system = true        -- System announcements are visible to all
  );

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Purchases: Users can only view and manage their own purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON public.purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data for testing --

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (name, price, period, description, features, highlight, tier)
VALUES
  ('Basic Plan', 9.99, 'month', 'Access to basic courses and quizzes', 
   ARRAY['Basic courses access', 'Basic quizzes', 'Limited certificates', 'Basic gamification features'], 
   false, 'basic'),
  ('Premium Plan', 19.99, 'month', 'Full access to all platform features', 
   ARRAY['All courses access', 'All quizzes and IQ tests', 'Unlimited certificates', 'Full gamification features', 'Priority support', 'Exclusive content'], 
   true, 'premium');
