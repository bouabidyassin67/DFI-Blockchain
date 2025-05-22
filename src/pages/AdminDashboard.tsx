
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

// Define the course type to ensure consistent structure
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  category: z.string().min(2, { message: "Category must be at least 2 characters long" }),
  image: z.string().url({ message: "Please enter a valid URL" }).optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image: "https://via.placeholder.com/300x200",
    },
  });

  // Check for courses table and create if it doesn't exist
  const ensureCoursesTableExists = async () => {
    try {
      // Check if courses table exists by attempting a query
      const { error } = await supabase
        .from('courses')
        .select('count')
        .limit(1);
        
      if (error) {
        console.error("Error checking courses table:", error);
        toast.error("Database not properly configured. Please contact the administrator.");
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Failed to check courses table:", err);
      return false;
    }
  };
  
  // Load courses from database
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin && !isLoading) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }
    
    const fetchCourses = async () => {
      setIsLoading(true);
      
      try {
        // First check if the table exists
        const tableExists = await ensureCoursesTableExists();
        
        if (!tableExists) {
          setIsLoading(false);
          setCourses([]);
          return;
        }
        
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [isAdmin, navigate, isLoading]);

  const onSubmit = async (values: CourseFormValues) => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const tableExists = await ensureCoursesTableExists();
      
      if (!tableExists) {
        toast.error("Course management is currently unavailable");
        return;
      }
      
      if (isEditing) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: values.title,
            description: values.description,
            category: values.category,
            image: values.image || "https://via.placeholder.com/300x200",
            updated_at: new Date().toISOString()
          })
          .eq('id', isEditing);
          
        if (error) throw error;
        
        // Update local state
        setCourses(
          courses.map((course) =>
            course.id === isEditing 
              ? { 
                  ...course, 
                  title: values.title,
                  description: values.description,
                  category: values.category,
                  image: values.image || course.image 
                } 
              : course
          )
        );
        
        toast.success("Course updated successfully!");
        setIsEditing(null);
      } else {
        // Add new course
        const newCourse = {
          id: crypto.randomUUID(),
          title: values.title,
          description: values.description,
          category: values.category,
          image: values.image || "https://via.placeholder.com/300x200",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: user.id
        };
        
        const { error, data } = await supabase
          .from('courses')
          .insert(newCourse)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          setCourses([data[0], ...courses]);
          toast.success("Course added successfully!");
        }
      }
      
      form.reset();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (id: string) => {
    const courseToEdit = courses.find((course) => course.id === id);
    if (courseToEdit) {
      form.reset(courseToEdit);
      setIsEditing(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setCourses(courses.filter((course) => course.id !== id));
      toast.success("Course deleted successfully!");
      
      if (isEditing === id) {
        setIsEditing(null);
        form.reset();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    form.reset();
  };

  // Redirect if not admin
  if (!isAdmin && !isLoading) {
    return null; // Navigate is called in useEffect
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage courses and content
            </p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Form */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    {isEditing ? "Edit Course" : "Add New Course"}
                  </CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Update the course details below"
                      : "Fill in the details to add a new course"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter course title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter category" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter course description"
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex space-x-2 pt-2">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {isEditing ? "Updating..." : "Adding..."}
                            </>
                          ) : (
                            isEditing ? "Update Course" : "Add Course"
                          )}
                        </Button>
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Course List */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Courses</CardTitle>
                  <CardDescription>
                    Manage existing courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : courses.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">
                              {course.title}
                            </TableCell>
                            <TableCell>{course.category}</TableCell>
                            <TableCell className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(course.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(course.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No courses found. Add your first course!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
