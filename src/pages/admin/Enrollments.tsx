
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Plus, MoreHorizontal, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminEnrollments = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newEnrollment, setNewEnrollment] = useState({
    student: "",
    email: "",
    course: "",
    startDate: "",
    endDate: "",
  });
  
  // Sample enrollments data
  const [enrollments, setEnrollments] = useState([
    {
      id: "ENR-2024-001",
      student: "Jane Smith",
      email: "jane.smith@example.com",
      course: "Introduction to Computer Science",
      startDate: "Jan 15, 2024",
      endDate: "Apr 15, 2024",
      progress: 85,
      status: "Active",
    },
    {
      id: "ENR-2024-002",
      student: "John Doe",
      email: "john.doe@example.com",
      course: "Advanced Web Development",
      startDate: "Feb 10, 2024",
      endDate: "May 10, 2024",
      progress: 45,
      status: "Active",
    },
    {
      id: "ENR-2024-003",
      student: "Alice Johnson",
      email: "alice.johnson@example.com",
      course: "Data Science Fundamentals",
      startDate: "Dec 10, 2023",
      endDate: "Mar 10, 2024",
      progress: 100,
      status: "Completed",
    },
    {
      id: "ENR-2024-004",
      student: "Michael Brown",
      email: "michael.brown@example.com",
      course: "Introduction to Computer Science",
      startDate: "Mar 25, 2024",
      endDate: "Jun 25, 2024",
      progress: 10,
      status: "Active",
    },
    {
      id: "ENR-2024-005",
      student: "Linda Davis",
      email: "linda.davis@example.com",
      course: "Data Science Fundamentals",
      startDate: "Feb 20, 2024",
      endDate: "May 20, 2024",
      progress: 0,
      status: "Inactive",
    },
  ]);

  // Sample access requests data
  const [accessRequests, setAccessRequests] = useState([
    {
      id: "REQ-2024-001",
      student: "David Wilson",
      email: "david.wilson@example.com",
      course: "Machine Learning Essentials",
      requestDate: "Apr 22, 2024",
      status: "Pending",
    },
    {
      id: "REQ-2024-002",
      student: "Sarah Miller",
      email: "sarah.miller@example.com",
      course: "UX/UI Design Principles",
      requestDate: "Apr 21, 2024",
      status: "Pending",
    },
  ]);
  
  const handleCreateEnrollment = () => {
    if (!newEnrollment.student || !newEnrollment.email || !newEnrollment.course) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const enrollment = {
      id: `ENR-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      student: newEnrollment.student,
      email: newEnrollment.email,
      course: newEnrollment.course,
      startDate: newEnrollment.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: newEnrollment.endDate || new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      progress: 0,
      status: "Active",
    };
    
    setEnrollments([...enrollments, enrollment]);
    setNewEnrollment({
      student: "",
      email: "",
      course: "",
      startDate: "",
      endDate: "",
    });
    setIsCreateDialogOpen(false);
    toast.success("Enrollment created successfully");
  };
  
  const handleEditEnrollment = (id: string) => {
    toast.success(`Editing enrollment ${id}`);
    // In a real app, this would open an edit dialog or navigate to an edit page
  };
  
  const handleDeleteEnrollment = (id: string) => {
    setEnrollments(enrollments.filter(enrollment => enrollment.id !== id));
    toast.success("Enrollment deleted successfully");
  };
  
  const handleApproveRequest = (id: string) => {
    // Find the request
    const request = accessRequests.find(req => req.id === id);
    if (!request) return;
    
    // Create a new enrollment from the request
    const newEnrollment = {
      id: `ENR-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      student: request.student,
      email: request.email,
      course: request.course,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      progress: 0,
      status: "Active",
    };
    
    // Add the new enrollment and remove the request
    setEnrollments([...enrollments, newEnrollment]);
    setAccessRequests(accessRequests.filter(req => req.id !== id));
    toast.success(`Access request approved for ${request.student}`);
  };
  
  const handleDeclineRequest = (id: string) => {
    // Simply remove the request
    setAccessRequests(accessRequests.filter(req => req.id !== id));
    toast.success("Access request declined");
  };
  
  // Filter enrollments based on search query
  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight">Enrollment & Access Control</h1>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Enrollment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create New Enrollment</DialogTitle>
                      <DialogDescription>
                        Enroll a student in a course
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="student" className="text-sm font-medium">Student Name</label>
                        <Input 
                          id="student"
                          placeholder="Enter student name" 
                          value={newEnrollment.student}
                          onChange={(e) => setNewEnrollment({...newEnrollment, student: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                        <Input 
                          id="email"
                          type="email" 
                          placeholder="Enter student email" 
                          value={newEnrollment.email}
                          onChange={(e) => setNewEnrollment({...newEnrollment, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="course" className="text-sm font-medium">Course</label>
                        <Select 
                          value={newEnrollment.course} 
                          onValueChange={(value) => setNewEnrollment({...newEnrollment, course: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Introduction to Computer Science">Introduction to Computer Science</SelectItem>
                            <SelectItem value="Advanced Web Development">Advanced Web Development</SelectItem>
                            <SelectItem value="Data Science Fundamentals">Data Science Fundamentals</SelectItem>
                            <SelectItem value="Machine Learning Essentials">Machine Learning Essentials</SelectItem>
                            <SelectItem value="UX/UI Design Principles">UX/UI Design Principles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                          <Input 
                            id="startDate"
                            type="date" 
                            value={newEnrollment.startDate}
                            onChange={(e) => setNewEnrollment({...newEnrollment, startDate: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                          <Input 
                            id="endDate"
                            type="date"
                            value={newEnrollment.endDate}
                            onChange={(e) => setNewEnrollment({...newEnrollment, endDate: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateEnrollment}>Create Enrollment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs defaultValue="enrollments" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                  <TabsTrigger value="access">Access Requests</TabsTrigger>
                </TabsList>
                
                <TabsContent value="enrollments" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search enrollments..."
                              className="pl-8 w-full"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </Button>
                          </div>
                        </div>

                        <div className="relative overflow-x-auto rounded-md border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50">
                              <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Student</th>
                                <th scope="col" className="px-6 py-3">Course</th>
                                <th scope="col" className="px-6 py-3">Start Date</th>
                                <th scope="col" className="px-6 py-3">End Date</th>
                                <th scope="col" className="px-6 py-3">Progress</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredEnrollments.map((enrollment) => (
                                <tr key={enrollment.id} className="border-b bg-background hover:bg-muted/50">
                                  <td className="px-6 py-4 font-medium">
                                    {enrollment.id}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div>
                                      <div className="font-medium">{enrollment.student}</div>
                                      <div className="text-xs text-muted-foreground">{enrollment.email}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">{enrollment.course}</td>
                                  <td className="px-6 py-4">{enrollment.startDate}</td>
                                  <td className="px-6 py-4">{enrollment.endDate}</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <div className="w-full bg-muted h-2 rounded-full mr-2">
                                        <div 
                                          className={`h-2 rounded-full ${
                                            enrollment.status === "Completed" ? "bg-green-500" : 
                                            enrollment.status === "Active" ? "bg-blue-500" : 
                                            "bg-gray-500"
                                          }`} 
                                          style={{ width: `${enrollment.progress}%` }}
                                        ></div>
                                      </div>
                                      <span>{enrollment.progress}%</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <Badge variant={
                                      enrollment.status === "Active" ? "default" : 
                                      enrollment.status === "Completed" ? "outline" : 
                                      "secondary"
                                    }>
                                      {enrollment.status}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleEditEnrollment(enrollment.id)}
                                      >
                                        Edit
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleDeleteEnrollment(enrollment.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4">
                          <div className="text-sm text-muted-foreground">
                            Showing {filteredEnrollments.length} of {enrollments.length} enrollments
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled>
                              Previous
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="access" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Access Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-4">
                        {accessRequests.length > 0 ? (
                          <div className="relative overflow-x-auto rounded-md border">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs uppercase bg-muted/50">
                                <tr>
                                  <th scope="col" className="px-6 py-3">Request ID</th>
                                  <th scope="col" className="px-6 py-3">Student</th>
                                  <th scope="col" className="px-6 py-3">Course</th>
                                  <th scope="col" className="px-6 py-3">Request Date</th>
                                  <th scope="col" className="px-6 py-3">Status</th>
                                  <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {accessRequests.map((request) => (
                                  <tr key={request.id} className="border-b bg-background hover:bg-muted/50">
                                    <td className="px-6 py-4 font-medium">
                                      {request.id}
                                    </td>
                                    <td className="px-6 py-4">
                                      <div>
                                        <div className="font-medium">{request.student}</div>
                                        <div className="text-xs text-muted-foreground">{request.email}</div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">{request.course}</td>
                                    <td className="px-6 py-4">{request.requestDate}</td>
                                    <td className="px-6 py-4">
                                      <Badge variant="secondary">
                                        {request.status}
                                      </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center space-x-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                          onClick={() => handleApproveRequest(request.id)}
                                        >
                                          Approve
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                          onClick={() => handleDeclineRequest(request.id)}
                                        >
                                          Decline
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-8 bg-muted/20 rounded-md">
                            <div className="text-center">
                              <p className="text-muted-foreground">No pending access requests.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEnrollments;
