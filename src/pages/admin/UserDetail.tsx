
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
import {
  ArrowLeft,
  User,
  Book,
  Calendar,
  BarChart2,
  Settings,
  Save,
  Lock,
  CreditCard,
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample user data - in a real app, this would be fetched based on the ID
  const [userData, setUserData] = useState({
    id: id || "1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Student",
    status: "Active",
    joinDate: "Jan 15, 2024",
    courses: 3,
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    enrolledCourses: [
      { id: "1", name: "Introduction to Computer Science", progress: 85, status: "In Progress" },
      { id: "2", name: "Web Development Fundamentals", progress: 100, status: "Completed" },
      { id: "3", name: "Data Science Basics", progress: 25, status: "In Progress" },
    ]
  });
  
  const handleSave = () => {
    toast.success("User information updated successfully");
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
                onClick={() => navigate('/admin/users')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" /> 
                  User Profile: {userData.name}
                </h1>
                <p className="text-muted-foreground">
                  User ID: {userData.id} • Joined: {userData.joinDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarFallback className="text-2xl bg-primary">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-center">{userData.name}</CardTitle>
                    <CardDescription className="text-center mt-1">{userData.email}</CardDescription>
                    <div className="mt-2">
                      <Badge variant={userData.status === "Active" ? "default" : "secondary"}>
                        {userData.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium">{userData.role}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="font-medium">{userData.joinDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enrolled Courses:</span>
                    <span className="font-medium">{userData.courses}</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="lg:col-span-3">
                <Tabs defaultValue="general" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update the user's personal details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input 
                              value={userData.name} 
                              onChange={(e) => setUserData({...userData, name: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input 
                              type="email"
                              value={userData.email} 
                              onChange={(e) => setUserData({...userData, email: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input 
                              value={userData.phone} 
                              onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">User Role</label>
                            <Select 
                              value={userData.role} 
                              onValueChange={(value) => setUserData({...userData, role: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Instructor">Instructor</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Address</label>
                          <Input 
                            value={userData.address} 
                            onChange={(e) => setUserData({...userData, address: e.target.value})}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="status" 
                            checked={userData.status === "Active"} 
                            onCheckedChange={(checked) => setUserData({
                              ...userData, 
                              status: checked ? "Active" : "Inactive"
                            })}
                          />
                          <label htmlFor="status" className="text-sm font-medium">
                            Account Status: {userData.status}
                          </label>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button onClick={handleSave}>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="courses" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Enrolled Courses</CardTitle>
                        <CardDescription>
                          Manage courses this user is enrolled in
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userData.enrolledCourses.map(course => (
                            <div key={course.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{course.name}</h4>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <div className="flex items-center mr-4">
                                      <Book className="h-3 w-3 mr-1" />
                                      <span>Course ID: {course.id}</span>
                                    </div>
                                    <Badge variant={course.status === "Completed" ? "outline" : "default"}>
                                      {course.status}
                                    </Badge>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </div>
                              <div className="mt-3">
                                <div className="text-xs text-muted-foreground mb-1">
                                  Progress: {course.progress}%
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="w-full">
                            Enroll in New Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>
                          Manage user's security and access settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full">
                          <Lock className="mr-2 h-4 w-4" /> Reset Password
                        </Button>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <label className="text-sm font-medium">Two-factor Authentication</label>
                              <p className="text-xs text-muted-foreground">
                                Add an extra layer of security to the account
                              </p>
                            </div>
                            <Switch id="2fa" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="billing" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>
                          Manage payment methods and billing history
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                          <p className="text-muted-foreground mb-4">
                            This user has no payment methods on file.
                          </p>
                          <Button>Add Payment Method</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDetail;
