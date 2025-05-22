
import { supabase } from "./supabase";
import { toast } from "@/components/ui/sonner";

export const createAdminUser = async () => {
  try {
    // First check if the admin user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();
      
    if (!checkError && existingUsers) {
      console.log('Admin user already exists');
      return { 
        success: true, 
        message: 'Admin user already exists', 
        credentials: {
          email: 'admin@example.com',
          password: 'Admin123!'
        }
      };
    }
    
    // Create new admin user through Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'Admin123!',
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error };
    }
    
    if (!data.user) {
      return { success: false, error: 'Failed to create admin user' };
    }
    
    // Set user role to admin in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: data.user.id,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        subscription_tier: 'premium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (profileError) {
      console.error('Error updating admin profile:', profileError);
      return { success: false, error: profileError };
    }
    
    return { 
      success: true, 
      message: 'Admin user created successfully', 
      credentials: {
        email: 'admin@example.com',
        password: 'Admin123!'
      }
    };
  } catch (err) {
    console.error('Unexpected error creating admin user:', err);
    return { success: false, error: err };
  }
};

// Convenience function to create admin through the console
export const setupAdmin = async () => {
  const result = await createAdminUser();
  if (result.success) {
    console.log('Admin setup successful!');
    console.log('Email: admin@example.com');
    console.log('Password: Admin123!');
    return true;
  } else {
    console.error('Admin setup failed:', result.error);
    return false;
  }
};
