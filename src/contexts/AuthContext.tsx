
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// Define user types
type UserRole = "user" | "admin";
type SubscriptionTier = "free" | "basic" | "premium";

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  hasPurchasedCourses: boolean;
  purchasedCourseIds: string[];
  avatar_url?: string;
  phone?: string;
  bio?: string;
  address?: string;
  progress?: {
    total: number;
    completed: number;
    percentage: number;
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremiumUser: boolean;
  hasPurchasedCourse: (courseId: string) => boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<UserProfile, 'id'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      // Check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      if (!data) {
        return null;
      }

      // Get course progress
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId);
        
      if (enrollmentsError) {
        console.error("Error fetching enrollments:", enrollmentsError);
      }
      
      // Calculate progress
      let totalModules = 0;
      let completedModules = 0;
      
      if (enrollments && enrollments.length > 0) {
        enrollments.forEach(enrollment => {
          if (enrollment.total_modules) totalModules += enrollment.total_modules;
          if (enrollment.completed_modules) completedModules += enrollment.completed_modules;
        });
      }
      
      const progressPercentage = totalModules > 0 
        ? Math.round((completedModules / totalModules) * 100) 
        : 0;
      
      return {
        id: data.id,
        name: data.name || '',
        role: (data.role || 'user') as UserRole,
        subscriptionTier: (data.subscription_tier || 'free') as SubscriptionTier,
        hasPurchasedCourses: Array.isArray(data.purchased_courses) && data.purchased_courses.length > 0,
        purchasedCourseIds: Array.isArray(data.purchased_courses) ? data.purchased_courses : [],
        avatar_url: data.avatar_url,
        phone: data.phone,
        bio: data.bio,
        address: data.address,
        progress: {
          total: totalModules,
          completed: completedModules,
          percentage: progressPercentage
        }
      };
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };
  
  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const userProfile = await fetchUserProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  // Function to update user profile
  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id'>>) => {
    if (!user) throw new Error("User not authenticated");
    
    setIsLoading(true);
    
    try {
      // Prepare the data to update
      const updateData: any = {};
      
      // Map our frontend keys to database column names
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.avatar_url !== undefined) updateData.avatar_url = updates.avatar_url;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.address !== undefined) updateData.address = updates.address;
      
      // Add updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Refresh the profile data
      await refreshProfile();
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Create profile in database
  const createUserProfile = async (userId: string, name: string) => {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (!checkError && existingProfile) {
        console.log("Profile already exists, skipping creation");
        return;
      }
      
      // Create a new profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: name,
          role: 'user',
          subscription_tier: 'free',
          purchased_courses: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error("Error creating profile:", error);
        
        // Try to check if the profiles table exists
        const { error: tableCheckError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
          
        if (tableCheckError) {
          console.error("Error checking profiles table:", tableCheckError);
          
          // Try to create the profiles table
          const { error: createTableError } = await supabase.rpc('execute_sql', {
            sql: `
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
              
              CREATE POLICY "Public profiles are viewable by everyone"
                ON public.profiles FOR SELECT USING (true);
              
              CREATE POLICY "Users can update own profile"
                ON public.profiles FOR UPDATE USING (auth.uid() = id);
            `
          });
          
          if (createTableError) {
            console.error("Error creating profiles table:", createTableError);
            toast.error("Database setup issue. Please contact support.");
            return;
          }
          
          // Try creating profile again
          const { error: retryError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: name,
              role: 'user',
              subscription_tier: 'free',
              purchased_courses: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (retryError) {
            console.error("Error creating profile after table creation:", retryError);
            toast.error("Failed to create user profile. Please try again.");
            return;
          }
        }
      } else {
        console.log("Profile created successfully");
      }
    } catch (error) {
      console.error("Unexpected error creating profile:", error);
    }
  };

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Check current auth session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Try to get existing profile
          const userProfile = await fetchUserProfile(session.user.id);
          
          // If profile doesn't exist yet, create a basic one
          if (!userProfile) {
            console.log("No profile found, creating one");
            
            // Get name from user metadata or use email
            const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
            
            // Create profile in database
            await createUserProfile(session.user.id, name);
            
            // Set initial profile in state
            const newProfile = {
              id: session.user.id,
              name: name,
              role: 'user' as UserRole,
              subscriptionTier: 'free' as SubscriptionTier,
              hasPurchasedCourses: false,
              purchasedCourseIds: [],
              progress: {
                total: 0,
                completed: 0,
                percentage: 0
              }
            };
            setProfile(newProfile);
          } else {
            setProfile(userProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Session verification error:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchUserProfile(session.user.id);
          
          if (!userProfile) {
            // Get name from user metadata or use email
            const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
            
            // Create profile in database
            await createUserProfile(session.user.id, name);
            
            // Set initial profile in state
            const newProfile = {
              id: session.user.id,
              name: name,
              role: 'user' as UserRole,
              subscriptionTier: 'free' as SubscriptionTier,
              hasPurchasedCourses: false,
              purchasedCourseIds: [],
              progress: {
                total: 0,
                completed: 0,
                percentage: 0
              }
            };
            setProfile(newProfile);
          } else {
            setProfile(userProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.user) {
        // Try to get existing profile
        const userProfile = await fetchUserProfile(data.user.id);
        
        // If no profile exists, create one
        if (!userProfile) {
          // Get name from user metadata or use email
          const name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
          
          // Create profile in database
          await createUserProfile(data.user.id, name);
          
          const newProfile = {
            id: data.user.id,
            name: name,
            role: 'user' as UserRole,
            subscriptionTier: 'free' as SubscriptionTier,
            hasPurchasedCourses: false,
            purchasedCourseIds: [],
            progress: {
              total: 0,
              completed: 0,
              percentage: 0
            }
          };
          setProfile(newProfile);
        } else {
          setProfile(userProfile);
        }
        
        toast.success(`Welcome back, ${userProfile?.name || 'User'}!`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification`,
          data: {
            name,
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.user) {
        // Create a profile for the new user
        await createUserProfile(data.user.id, name);
        
        const newProfile = {
          id: data.user.id,
          name,
          role: 'user' as UserRole,
          subscriptionTier: 'free' as SubscriptionTier,
          hasPurchasedCourses: false,
          purchasedCourseIds: [],
          progress: {
            total: 0,
            completed: 0,
            percentage: 0
          }
        };
        
        setProfile(newProfile);
        toast.success("Registration successful! Please verify your email.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Error signing out");
        return;
      }
      
      setUser(null);
      setProfile(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out");
    }
  };

  // Check if user has purchased a specific course
  const hasPurchasedCourse = (courseId: string) => {
    if (!profile) return false;
    return profile.purchasedCourseIds.includes(courseId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: profile?.role === "admin",
        isPremiumUser: profile?.subscriptionTier === "premium" || profile?.subscriptionTier === "basic",
        hasPurchasedCourse,
        refreshProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
