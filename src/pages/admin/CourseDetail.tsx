
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Book,
  Video,
  FileText,
  Users,
  Calendar,
  BarChart2,
  Settings,
  Save,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample course data - in a real app, this would be fetched based on the ID
  const [course, setCourse] = useState({
    id: id || "1",
    title: "Introduction to Computer Science",
    description: "Learn the basics of computer science and programming concepts. This course covers algorithms, data structures, and programming fundamentals.",
    instructor: "Dr. Robert Williams",
    category: "Computer Science",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500",
    students: 156,
    rating: 4.8,
    price: 99.99,
    status: "Published",
    created: "Jan 15, 2024",
    modules: [
      { id: "m1", title: "Introduction to Programming", lessons: 5, duration: "45 min" },
      { id: "m2", title: "Data Types and Variables", lessons: 4, duration: "35 min" },
      { id: "m3", title: "Control Flow and Logic", lessons: 6, duration: "55 min" },
      { id: "m4", title: "Functions and Methods", lessons: 5, duration: "50 min" },
      { id: "m5", title: "Data Structures Overview", lessons: 7, duration: "60 min" },
    ]
  });
  
  const handleSave = () => {
    toast.success("Course updated successfully");
  };
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate('/admin/courses')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" /> 
                  {course.title}
                </h1>
                <p className="text-muted-foreground">
                  Course ID: {course.id} • Last updated: {course.created}
                </p>
              </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 md:w-auto md:inline-flex">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                    <CardDescription>
                      Update the basic information about this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Course Title</label>
                        <Input 
                          value={course.title} 
                          onChange={(e) => setCourse({...course, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input 
                          value={course.category} 
                          onChange={(e) => setCourse({...course, category: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={course.description} 
                        onChange={(e) => setCourse({...course, description: e.target.value})}
                        rows={5}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Instructor</label>
                        <Input 
                          value={course.instructor} 
                          onChange={(e) => setCourse({...course, instructor: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price ($)</label>
                        <Input 
                          type="number" 
                          value={course.price} 
                          onChange={(e) => setCourse({...course, price: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Thumbnail URL</label>
                      <Input 
                        value={course.thumbnail} 
                        onChange={(e) => setCourse({...course, thumbnail: e.target.value})}
                      />
                      {course.thumbnail && (
                        <div className="mt-2 border rounded-lg overflow-hidden">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate('/admin/courses')}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      Manage modules and lessons for this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Modules</h3>
                        <Button>
                          Add Module
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {course.modules.map((module) => (
                          <div 
                            key={module.id} 
                            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{module.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {module.lessons} lessons • {module.duration}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="students" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>
                      View and manage students enrolled in this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8">
                      Current enrollment: {course.students} students
                    </p>
                    <Button className="w-full">Manage Students</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Schedule</CardTitle>
                    <CardDescription>
                      Manage course timing and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8">
                      Schedule management interface will be available here
                    </p>
                    <Button className="w-full">Set Up Schedule</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Analytics</CardTitle>
                    <CardDescription>
                      View detailed analytics for this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8">
                      Analytics dashboard will be available here
                    </p>
                    <Button className="w-full">View Detailed Analytics</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
