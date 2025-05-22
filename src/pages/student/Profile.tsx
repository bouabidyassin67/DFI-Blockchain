
import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Phone, MapPin, School, Calendar, BookOpen, Clock, Trophy, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  lastAccessedAt: string;
}

interface EnrollmentWithCourse {
  id: string;
  course_id: string;
  completed_modules: number;
  total_modules: number;
  last_accessed_at: string | null;
  courses: {
    id: string;
    title: string;
  } | null;
}

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = React.useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Refresh profile to get latest data
        await refreshProfile();
        
        // Check if enrollments table exists
        const { error: tableCheckError } = await supabase
          .from('enrollments')
          .select('count')
          .limit(1);
          
        if (tableCheckError) {
          console.log("Enrollments table may not exist yet:", tableCheckError);
          setIsLoading(false);
          return;
        }
        
        // Fetch user's enrolled courses with progress
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            course_id,
            completed_modules,
            total_modules,
            last_accessed_at,
            courses (
              id,
              title
            )
          `)
          .eq('user_id', user.id);
          
        if (enrollmentsError) {
          console.error("Error fetching enrollments:", enrollmentsError);
          toast.error("Failed to load course data");
          setIsLoading(false);
          return;
        }
        
        if (enrollments && enrollments.length > 0) {
          const coursesWithProgress = enrollments.map((enrollment: any) => ({
            id: enrollment.course_id,
            title: enrollment.courses?.title || "Unknown Course",
            progress: enrollment.total_modules > 0 
              ? Math.round((enrollment.completed_modules / enrollment.total_modules) * 100) 
              : 0,
            totalModules: enrollment.total_modules || 0,
            completedModules: enrollment.completed_modules || 0,
            lastAccessedAt: enrollment.last_accessed_at || "Never"
          }));
          
          setCourses(coursesWithProgress);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, refreshProfile]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "Never") return "Never";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please log in</h1>
          <p className="mb-4">You must be logged in to view your profile</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
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
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                    <p>Loading your profile...</p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="info">Personal Info</TabsTrigger>
                    <TabsTrigger value="academic">Learning History</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          <Avatar className="h-24 w-24 border">
                            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User"} />
                            <AvatarFallback className="bg-primary/20 text-primary text-xl">
                              {profile?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-2xl">{profile?.name || user.email?.split('@')[0]}</CardTitle>
                            <CardDescription>
                              {profile?.role === "admin" ? "Administrator" : "Student"} | {profile?.subscriptionTier?.charAt(0).toUpperCase() + profile?.subscriptionTier?.slice(1) || "Free"} tier
                            </CardDescription>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => navigate("/settings")}
                            >
                              Edit Profile
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4">
                          {user?.email && (
                            <div className="flex items-center">
                              <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span>{user.email}</span>
                            </div>
                          )}
                          
                          {profile?.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span>{profile.phone}</span>
                            </div>
                          )}
                          
                          {profile?.address && (
                            <div className="flex items-center">
                              <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span>{profile.address}</span>
                            </div>
                          )}
                          
                          {profile?.bio && (
                            <div className="flex items-start pt-2">
                              <User className="mr-3 h-4 w-4 text-muted-foreground mt-1" />
                              <div>
                                <h3 className="font-medium mb-1">Bio</h3>
                                <p className="text-sm text-muted-foreground">{profile.bio}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center">
                            <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
                            <span>Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="academic" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Courses</CardTitle>
                        <CardDescription>Your enrolled courses and learning progress</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {courses.length > 0 ? (
                          <div className="space-y-6">
                            {courses.map((course) => (
                              <div key={course.id} className="space-y-2">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">{course.title}</h3>
                                  <span className="text-sm text-muted-foreground">
                                    {course.completedModules}/{course.totalModules} modules
                                  </span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{course.progress}% completed</span>
                                  <span>Last accessed: {formatDate(course.lastAccessedAt)}</span>
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex justify-center pt-4">
                              <Button 
                                variant="outline"
                                onClick={() => navigate("/progress")}
                              >
                                View Detailed Progress
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                            <h3 className="font-medium text-lg mb-1">No courses yet</h3>
                            <p className="text-muted-foreground mb-4">You haven't enrolled in any courses</p>
                            <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Learning Statistics</CardTitle>
                        <CardDescription>Track your learning achievements</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                          <div className="space-y-2 p-4 bg-muted rounded-lg">
                            <BookOpen className="h-8 w-8 mx-auto text-primary" />
                            <h3 className="text-2xl font-bold">{courses.length}</h3>
                            <p className="text-muted-foreground">Enrolled Courses</p>
                          </div>
                          
                          <div className="space-y-2 p-4 bg-muted rounded-lg">
                            <Clock className="h-8 w-8 mx-auto text-primary" />
                            <h3 className="text-2xl font-bold">{profile?.progress?.percentage || 0}%</h3>
                            <p className="text-muted-foreground">Overall Progress</p>
                          </div>
                          
                          <div className="space-y-2 p-4 bg-muted rounded-lg">
                            <Trophy className="h-8 w-8 mx-auto text-primary" />
                            <h3 className="text-2xl font-bold">{profile?.progress?.completed || 0}</h3>
                            <p className="text-muted-foreground">Modules Completed</p>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <h3 className="font-medium mb-4">Overall Learning Progress</h3>
                          <Progress 
                            value={profile?.progress?.percentage || 0} 
                            className="h-3" 
                          />
                          <p className="text-center text-sm text-muted-foreground mt-2">
                            You've completed {profile?.progress?.completed || 0} out of {profile?.progress?.total || 0} total modules
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
