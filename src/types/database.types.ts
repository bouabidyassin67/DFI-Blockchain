
// Define the database schema types for TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: "user" | "admin";
          subscription_tier: "free" | "basic" | "premium";
          purchased_courses: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: "user" | "admin";
          subscription_tier?: "free" | "basic" | "premium";
          purchased_courses?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: "user" | "admin";
          subscription_tier?: "free" | "basic" | "premium";
          purchased_courses?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          image: string;
          lessons: number;
          duration: string;
          price: number;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          image: string;
          lessons: number;
          duration: string;
          price: number;
          is_premium: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          image?: string;
          lessons?: number;
          duration?: string;
          price?: number;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          progress?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      iq_tests: {
        Row: {
          id: number;
          title: string;
          description: string;
          questions: number;
          time_limit: string;
          difficulty: string;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          questions: number;
          time_limit: string;
          difficulty: string;
          is_premium: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          questions?: number;
          time_limit?: string;
          difficulty?: string;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: number;
          title: string;
          description: string;
          category: string;
          questions: number;
          time_limit: string;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          category: string;
          questions: number;
          time_limit: string;
          is_premium: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          category?: string;
          questions?: number;
          time_limit?: string;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      certificates: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          issue_date: string;
          expiry: string;
          credential_id: string;
          image: string;
          description: string;
          issuer: string;
          skills: string[];
          hours: number;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          issue_date: string;
          expiry: string;
          credential_id: string;
          image: string;
          description: string;
          issuer: string;
          skills: string[];
          hours: number;
          is_premium: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          issue_date?: string;
          expiry?: string;
          credential_id?: string;
          image?: string;
          description?: string;
          issuer?: string;
          skills?: string[];
          hours?: number;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          amount: number;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          amount?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
