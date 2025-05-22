
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Play, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const ProgressTrackingPage = () => {
  // Sample progress data
  const progressData = [
    {
      id: 1,
      course: "Introduction to Computer Science",
      progress: 85,
      modules: [
        { id: 101, name: "Module 1: Fundamentals", completed: true, totalLessons: 5, completedLessons: 5 },
        { id: 102, name: "Module 2: Data Structures", completed: true, totalLessons: 4, completedLessons: 4 },
        { id: 103, name: "Module 3: Algorithms", completed: false, totalLessons: 6, completedLessons: 4 },
        { id: 104, name: "Module 4: Object-Oriented Programming", completed: false, totalLessons: 5, completedLessons: 2 },
      ]
    },
    {
      id: 2,
      course: "Advanced Web Development",
      progress: 45,
      modules: [
        { id: 201, name: "Module 1: HTML & CSS", completed: true, totalLessons: 5, completedLessons: 5 },
        { id: 202, name: "Module 2: JavaScript Basics", completed: true, totalLessons: 4, completedLessons: 4 },
        { id: 203, name: "Module 3: Advanced JavaScript", completed: false, totalLessons: 6, completedLessons: 1 },
        { id: 204, name: "Module 4: Frameworks", completed: false, totalLessons: 5, completedLessons: 0 },
      ]
    },
    {
      id: 3,
      course: "Data Science Fundamentals",
      progress: 22,
      modules: [
        { id: 301, name: "Module 1: Introduction to Data Science", completed: true, totalLessons: 3, completedLessons: 3 },
        { id: 302, name: "Module 2: Data Analysis", completed: false, totalLessons: 6, completedLessons: 2 },
        { id: 303, name: "Module 3: Data Visualization", completed: false, totalLessons: 4, completedLessons: 0 },
        { id: 304, name: "Module 4: Machine Learning Basics", completed: false, totalLessons: 5, completedLessons: 0 },
      ]
    },
  ];

  const handleContinueLearning = (courseId: number, courseName: string) => {
    // In a real app, this would redirect to the course learning page
    toast.success(`Continuing ${courseName}`);
    console.log(`Continuing course with ID: ${courseId}`);
  };

  const handleStartModule = (courseId: number, moduleId: number, moduleName: string) => {
    // In a real app, this would start the specific module
    toast.success(`Starting ${moduleName}`);
    console.log(`Starting module ID: ${moduleId} for course ID: ${courseId}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
              </div>
              <p className="text-muted-foreground">
                Track your progress across all enrolled courses.
              </p>

              <div className="grid gap-6">
                {progressData.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>{course.course}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.progress}% completed
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleContinueLearning(course.id, course.course)}
                          className="shrink-0"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Continue Learning
                        </Button>
                        <Link to={`/progress/${course.id}`}>
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Detailed Progress
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="space-y-4">
                          {course.modules.map((module) => (
                            <div key={module.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-4 h-4 rounded-full ${module.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    {module.completed && <CheckCircle className="h-4 w-4 text-white" />}
                                  </div>
                                  <span className="text-sm">{module.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">
                                    {module.completedLessons}/{module.totalLessons} lessons
                                  </span>
                                  {!module.completed && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleStartModule(course.id, module.id, module.name)}
                                    >
                                      {module.completedLessons > 0 ? "Continue" : "Start"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <Progress 
                                value={(module.completedLessons / module.totalLessons) * 100} 
                                className="h-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProgressTrackingPage;
