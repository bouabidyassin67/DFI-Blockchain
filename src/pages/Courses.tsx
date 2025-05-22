
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Define course interface
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  lessons: number;
  duration: string;
  price: number;
  is_premium: boolean;
}

// Fetch courses from Supabase
const fetchCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

// Purchase a course
const purchaseCourse = async (courseId: string, userId: string, amount: number): Promise<boolean> => {
  // Insert into purchases table
  const { error } = await supabase
    .from('purchases')
    .insert({
      course_id: courseId,
      user_id: userId,
      amount,
      status: 'completed'
    });
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Update the user's purchased courses
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('purchased_courses')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    throw new Error(profileError.message);
  }
  
  const purchasedCourses = profile.purchased_courses || [];
  if (!purchasedCourses.includes(courseId)) {
    purchasedCourses.push(courseId);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ purchased_courses: purchasedCourses })
      .eq('id', userId);
    
    if (updateError) {
      throw new Error(updateError.message);
    }
  }
  
  return true;
};

// Enroll in a course
const enrollInCourse = async (courseId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('enrollments')
    .insert({
      course_id: courseId,
      user_id: userId,
      progress: 0,
      completed: false
    });
  
  if (error) {
    // If it's a duplicate enrollment, don't treat it as an error
    if (error.code === '23505') {
      return true;
    }
    throw new Error(error.message);
  }
  
  return true;
};

const Courses = () => {
  const { user, profile, isAdmin, isPremiumUser, hasPurchasedCourse } = useAuth();
  const navigate = useNavigate();
  
  // Using React Query for data fetching with caching and state management
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
  
  const handlePurchase = async (courseId: string, title: string, price: number) => {
    if (!user) {
      toast.error("Please login to purchase this course");
      navigate("/login");
      return;
    }
    
    toast.success(`Processing purchase for "${title}"...`);
    
    try {
      await purchaseCourse(courseId, user.id, price);
      toast.success(`Successfully purchased "${title}"!`);
      
      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
      console.error("Purchase error:", error);
    }
  };

  const handleEnroll = async (courseId: string, title: string, isPremiumCourse: boolean) => {
    if (!user) {
      toast.error("Please login to enroll in this course");
      navigate("/login");
      return;
    }
    
    if (isPremiumCourse && !isPremiumUser && !hasPurchasedCourse(courseId)) {
      toast.error("This is a premium course. Please upgrade your subscription or purchase this course individually.");
      return;
    }
    
    if (!isPremiumUser && !hasPurchasedCourse(courseId)) {
      toast.error("Please purchase this course to enroll");
      return;
    }
    
    try {
      await enrollInCourse(courseId, user.id);
      toast.success(`Enrolled in "${title}" course!`);
      
      // In a real implementation, navigate to the course content page
      // navigate(`/courses/${courseId}/learn`);
    } catch (error) {
      toast.error("Enrollment failed. Please try again.");
      console.error("Enrollment error:", error);
    }
  };
  
  // Safe check for hasPurchasedCourse to prevent errors
  const safeHasPurchasedCourse = (courseId: string) => {
    try {
      return hasPurchasedCourse(courseId);
    } catch (error) {
      console.error("Error checking purchased course:", error);
      return false;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-full">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (error || !courses) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto text-center">
              <h2 className="text-xl font-bold mb-2">Failed to load courses</h2>
              <p className="text-muted-foreground">Please try again later</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                <p className="text-muted-foreground mt-1">
                  Browse all available courses
                </p>
              </div>
              
              {isAdmin && (
                <Button onClick={() => navigate('/admin/courses')}>
                  Manage Courses
                </Button>
              )}

              {!isPremiumUser && (
                <Button variant="outline" onClick={() => navigate('/subscription')}>
                  Upgrade to Premium
                </Button>
              )}
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const isPurchased = safeHasPurchasedCourse(course.id);
                const canAccess = isPremiumUser || isPurchased;
                const isPremiumLocked = course.is_premium && !canAccess;
                
                return (
                <Card key={course.id} className={`overflow-hidden ${isPremiumLocked ? 'border-amber-500/30' : ''}`}>
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${isPremiumLocked ? 'opacity-60' : ''}`}
                    />
                    {isPremiumLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-amber-500/80 p-2 rounded-full">
                          <Lock className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <div className="flex items-center gap-2">
                            <span>{course.category}</span>
                            {course.is_premium && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                                Premium
                              </Badge>
                            )}
                            {isPurchased && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Purchased
                              </Badge>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <div className="flex justify-between mt-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Lessons: </span>
                        <span className="ml-1 font-medium">{course.lessons}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Duration: </span>
                        <span className="ml-1 font-medium">{course.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    {isPurchased || isPremiumUser ? (
                      <Button 
                        className="w-full" 
                        onClick={() => handleEnroll(course.id, course.title, course.is_premium)}
                      >
                        Start Learning
                      </Button>
                    ) : (
                      <>
                        <div className="w-full text-center font-bold">${course.price}</div>
                        <Button 
                          className="w-full" 
                          onClick={() => handlePurchase(course.id, course.title, course.price)}
                        >
                          Purchase
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              )})}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Courses;
