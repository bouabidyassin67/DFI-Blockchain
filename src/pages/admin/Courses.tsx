
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, Search, Plus, MoreHorizontal, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const AdminCourses = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample courses data
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Computer Science",
      instructor: "Dr. Robert Williams",
      category: "Computer Science",
      students: 156,
      rating: 4.8,
      status: "Published",
      created: "Jan 15, 2024",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200",
    },
    {
      id: 2,
      title: "Advanced Web Development",
      instructor: "Sarah Johnson",
      category: "Web Development",
      students: 89,
      rating: 4.6,
      status: "Published",
      created: "Feb 10, 2024",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&h=200",
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Dr. Michael Chen",
      category: "Data Science",
      students: 124,
      rating: 4.7,
      status: "Published",
      created: "Mar 05, 2024",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=200",
    },
    {
      id: 4,
      title: "Machine Learning for Beginners",
      instructor: "Dr. Robert Williams",
      category: "Artificial Intelligence",
      students: 0,
      rating: 0,
      status: "Draft",
      created: "Apr 20, 2024",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=200",
    },
    {
      id: 5,
      title: "UX/UI Design Principles",
      instructor: "Emma Thompson",
      category: "Design",
      students: 0,
      rating: 0,
      status: "Draft",
      created: "Apr 15, 2024",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=200",
    },
  ]);
  
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    category: "",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200",
  });
  
  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor || !newCourse.category) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const course = {
      id: courses.length + 1,
      title: newCourse.title,
      instructor: newCourse.instructor,
      category: newCourse.category,
      students: 0,
      rating: 0,
      status: "Draft",
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      price: newCourse.price,
      image: newCourse.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200",
    };
    
    setCourses([...courses, course]);
    setNewCourse({
      title: "",
      instructor: "",
      category: "",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200",
    });
    setIsDialogOpen(false);
    toast.success("Course created successfully");
  };
  
  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("Course deleted successfully");
  };
  
  const handlePublishCourse = (id: number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, status: "Published" } : course
    ));
    toast.success("Course published successfully");
  };
  
  const handleArchiveCourse = (id: number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, status: "Archived" } : course
    ));
    toast.success("Course archived successfully");
  };
  
  // Filter courses based on search query and active tab
  const getFilteredCourses = (status: string | null) => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchQuery.toLowerCase());
                           
      if (status === null) return matchesSearch;
      return matchesSearch && course.status.toLowerCase() === status.toLowerCase();
    });
  };

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
                  <Book className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Create New Course</DialogTitle>
                      <DialogDescription>
                        Add the basic information to create a new course.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Course Title</label>
                        <Input 
                          id="title"
                          placeholder="Enter course title" 
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="instructor" className="text-sm font-medium">Instructor</label>
                        <Input 
                          id="instructor"
                          placeholder="Enter instructor name" 
                          value={newCourse.instructor}
                          onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <Input 
                          id="category"
                          placeholder="Enter course category" 
                          value={newCourse.category}
                          onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                        <Input 
                          id="price"
                          type="number" 
                          placeholder="99.99" 
                          value={newCourse.price.toString()}
                          onChange={(e) => setNewCourse({...newCourse, price: parseFloat(e.target.value) || 0})}
                          step="0.01"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="image" className="text-sm font-medium">Cover Image URL</label>
                        <Input 
                          id="image"
                          placeholder="Enter image URL" 
                          value={newCourse.image}
                          onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                        />
                        {newCourse.image && (
                          <div className="mt-2 h-32 rounded-md overflow-hidden">
                            <img 
                              src={newCourse.image} 
                              alt="Course cover" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddCourse}>Create Course</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                      <TabsList>
                        <TabsTrigger value="all">All Courses</TabsTrigger>
                        <TabsTrigger value="published">Published</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger value="archived">Archived</TabsTrigger>
                      </TabsList>
                      
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search courses..."
                            className="pl-8 w-[200px] md:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" className="flex items-center space-x-1">
                          <Filter className="h-4 w-4 mr-1" /> Filters
                        </Button>
                      </div>
                    </div>
                    
                    <TabsContent value="all" className="m-0">
                      {renderCourseTable(getFilteredCourses(null))}
                    </TabsContent>
                    
                    <TabsContent value="published" className="m-0">
                      {renderCourseTable(getFilteredCourses("published"))}
                    </TabsContent>
                    
                    <TabsContent value="draft" className="m-0">
                      {renderCourseTable(getFilteredCourses("draft"))}
                    </TabsContent>
                    
                    <TabsContent value="archived" className="m-0">
                      {getFilteredCourses("archived").length > 0 ? (
                        renderCourseTable(getFilteredCourses("archived"))
                      ) : (
                        <div className="p-4 text-center bg-muted/20 rounded-md">
                          <p className="text-muted-foreground">No archived courses found.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <div className="flex justify-between items-center pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {getFilteredCourses(null).length} of {courses.length} courses
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
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  function renderCourseTable(coursesToRender: typeof courses) {
    return coursesToRender.length > 0 ? (
      <div className="relative overflow-x-auto rounded-md border">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3">Course</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Students</th>
              <th scope="col" className="px-6 py-3">Rating</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coursesToRender.map((course) => (
              <tr key={course.id} className="border-b bg-background hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={course.image} alt={course.title} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs text-muted-foreground">{course.instructor}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{course.category}</td>
                <td className="px-6 py-4">{course.students}</td>
                <td className="px-6 py-4">
                  {course.rating > 0 ? (
                    <div className="flex items-center">
                      {course.rating}
                      <svg className="w-4 h-4 ml-1 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No ratings</span>
                  )}
                </td>
                <td className="px-6 py-4">${course.price}</td>
                <td className="px-6 py-4">
                  <Badge variant={
                    course.status === "Published" ? "default" : 
                    course.status === "Archived" ? "outline" : "secondary"
                  }>
                    {course.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/admin/courses/${course.id}`)}
                    >
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/admin/courses/${course.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        {course.status === "Draft" && (
                          <DropdownMenuItem onClick={() => handlePublishCourse(course.id)}>
                            Publish
                          </DropdownMenuItem>
                        )}
                        {course.status === "Published" && (
                          <DropdownMenuItem onClick={() => handleArchiveCourse(course.id)}>
                            Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="p-4 text-center bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No courses found matching your criteria.</p>
      </div>
    );
  }
};

export default AdminCourses;
