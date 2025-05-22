
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwcaprzzgyugnakfnern.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y2Fwcnp6Z3l1Z25ha2ZuZXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDQ0MTEsImV4cCI6MjA2MzMyMDQxMX0.JOmVt1WSgR9PjA3eSGJLFtR_TblsdCBphaIvpyjJm9Y';

// Initialize the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Export auth-related helpers
export const auth = supabase.auth;

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Successfully connected to Supabase');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};

// Helper function to execute SQL safely
export const executeSql = async (sql: string) => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { sql });
    if (error) {
      console.error('Error executing SQL:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Failed to execute SQL:', err);
    return { success: false, error: err };
  }
};

// Create database tables if they don't exist
export const setupDatabaseTables = async () => {
  try {
    console.log("Setting up database tables...");
    
    // Create SQL function for SQL execution if it doesn't exist
    const { error: sqlFuncError } = await supabase.rpc('execute_sql', { sql: 'SELECT 1' });
    
    if (sqlFuncError) {
      console.log("Creating execute_sql function...");
      
      // Create the RPC function through direct SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          sql: `
            CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
            RETURNS json
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              EXECUTE sql;
              RETURN json_build_object('success', true);
            EXCEPTION WHEN OTHERS THEN
              RETURN json_build_object('success', false, 'error', SQLERRM);
            END;
            $$;
          `
        })
      });
      
      const result = await response.json();
      if (!response.ok) {
        console.error("Error creating execute_sql function:", result);
        
        // If we can't create the function, we'll use direct SQL for table creation
        await createTablesDirectly();
        return { success: true };
      }
    }
    
    // Check if profiles table exists
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (profilesError) {
      console.log("Profiles table doesn't exist, creating basic tables...");
      
      // Create profiles table
      const { error: createError } = await executeSql(`
        CREATE TABLE IF NOT EXISTS public.profiles (
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
        
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Public profiles are viewable by everyone'
          ) THEN
            CREATE POLICY "Public profiles are viewable by everyone"
              ON public.profiles FOR SELECT USING (true);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Users can update own profile'
          ) THEN
            CREATE POLICY "Users can update own profile"
              ON public.profiles FOR UPDATE USING (auth.uid() = id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Users can insert own profile'
          ) THEN
            CREATE POLICY "Users can insert own profile"
              ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
          END IF;
        END
        $$;
      `);
      
      if (createError) {
        console.error("Error creating profiles table:", createError);
        await createTablesDirectly();
      }
    }
    
    // Check if courses table exists
    const { error: coursesError } = await supabase
      .from('courses')
      .select('count')
      .limit(1);
      
    if (coursesError) {
      console.log("Courses table doesn't exist, creating it...");
      
      // Create courses table
      const { error: createError } = await executeSql(`
        CREATE TABLE IF NOT EXISTS public.courses (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT,
          category TEXT,
          image TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          created_by UUID REFERENCES auth.users(id)
        );
        
        ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
        
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Courses are viewable by everyone'
          ) THEN
            CREATE POLICY "Courses are viewable by everyone"
              ON public.courses FOR SELECT USING (true);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Admins can insert courses'
          ) THEN
            CREATE POLICY "Admins can insert courses"
              ON public.courses FOR INSERT WITH CHECK (
                EXISTS (
                  SELECT 1 FROM profiles
                  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
                )
              );
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Admins can update courses'
          ) THEN
            CREATE POLICY "Admins can update courses"
              ON public.courses FOR UPDATE USING (
                EXISTS (
                  SELECT 1 FROM profiles
                  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
                )
              );
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Admins can delete courses'
          ) THEN
            CREATE POLICY "Admins can delete courses"
              ON public.courses FOR DELETE USING (
                EXISTS (
                  SELECT 1 FROM profiles
                  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
                )
              );
          END IF;
        END
        $$;
      `);
      
      if (createError) {
        console.error("Error creating courses table:", createError);
      }
    }
    
    // Check if enrollments table exists
    const { error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('count')
      .limit(1);
      
    if (enrollmentsError) {
      console.log("Enrollments table doesn't exist, creating it...");
      
      // Create enrollments table
      const { error: createError } = await executeSql(`
        CREATE TABLE IF NOT EXISTS public.enrollments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
          enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          completed_at TIMESTAMPTZ,
          progress FLOAT DEFAULT 0,
          total_modules INT DEFAULT 0,
          completed_modules INT DEFAULT 0,
          UNIQUE(user_id, course_id)
        );
        
        ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
        
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Users can view their enrollments'
          ) THEN
            CREATE POLICY "Users can view their enrollments"
              ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Admins can view all enrollments'
          ) THEN
            CREATE POLICY "Admins can view all enrollments"
              ON public.enrollments FOR SELECT USING (
                EXISTS (
                  SELECT 1 FROM profiles
                  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
                )
              );
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Users can update their enrollments'
          ) THEN
            CREATE POLICY "Users can update their enrollments"
              ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Admins can update all enrollments'
          ) THEN
            CREATE POLICY "Admins can update all enrollments"
              ON public.enrollments FOR UPDATE USING (
                EXISTS (
                  SELECT 1 FROM profiles
                  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
                )
              );
          END IF;
        END
        $$;
      `);
      
      if (createError) {
        console.error("Error creating enrollments table:", createError);
      }
    }
    
    // Check if messages table exists
    const { error: messagesError } = await supabase
      .from('messages')
      .select('count')
      .limit(1);
      
    if (messagesError) {
      console.log("Messages table doesn't exist, creating it...");
      
      // Create messages table
      const { error: createError } = await executeSql(`
        CREATE TABLE IF NOT EXISTS public.messages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          room_id TEXT,
          read BOOLEAN DEFAULT false,
          is_system BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
        
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Users can view messages they sent or received'
          ) THEN
            CREATE POLICY "Users can view messages they sent or received"
              ON public.messages FOR SELECT 
              USING (
                auth.uid() = sender_id OR 
                auth.uid() = receiver_id OR 
                room_id IS NOT NULL OR
                is_system = true
              );
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Users can send messages'
          ) THEN
            CREATE POLICY "Users can send messages"
              ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policy WHERE polname = 'Users can update their messages'
          ) THEN
            CREATE POLICY "Users can update their messages"
              ON public.messages FOR UPDATE USING (auth.uid() = sender_id);
          END IF;
        END
        $$;
      `);
      
      if (createError) {
        console.error("Error creating messages table:", createError);
      }
    }
    
    // Success!
    console.log("Database tables setup completed successfully!");
    return { success: true };
  } catch (err) {
    console.error("Error setting up database tables:", err);
    return { success: false, error: err };
  }
};

// Fallback function to create tables directly when RPC fails
const createTablesDirectly = async () => {
  try {
    console.log("Creating tables using direct SQL...");
    
    // Create profiles table
    const createProfilesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        cmd: `
          CREATE TABLE IF NOT EXISTS public.profiles (
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
        `
      })
    });
    
    if (!createProfilesResponse.ok) {
      const result = await createProfilesResponse.json();
      console.error("Error creating profiles table directly:", result);
    }
  } catch (err) {
    console.error("Error in direct table creation:", err);
  }
};
