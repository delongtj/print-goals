-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create goal_lists table
CREATE TABLE IF NOT EXISTS public.goal_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_list_id UUID REFERENCES public.goal_lists(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('checkbox', 'steps')),
  step_count INTEGER,
  label_style TEXT CHECK (label_style IN ('numeric', 'monthly')),
  category TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Goal lists policies
CREATE POLICY "Users can view own goal lists" ON public.goal_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goal lists" ON public.goal_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goal lists" ON public.goal_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goal lists" ON public.goal_lists FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.goal_lists WHERE id = goal_list_id));
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.goal_lists WHERE id = goal_list_id));
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.goal_lists WHERE id = goal_list_id));
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.goal_lists WHERE id = goal_list_id));

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();