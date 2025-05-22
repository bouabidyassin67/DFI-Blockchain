
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, Search, Plus, ArrowUp, ArrowDown, MoreHorizontal, Video, FileText, Image, File } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const AdminContent = () => {
  // Sample content data
  const modules = [
    {
      id: 1,
      title: "Introduction to Programming",
      course: "Introduction to Computer Science",
      items: 8,
      visible: true,
    },
    {
      id: 2,
      title: "Control Structures",
      course: "Introduction to Computer Science",
      items: 5,
      visible: true,
    },
    {
      id: 3,
      title: "Data Structures",
      course: "Advanced Web Development",
      items: 6,
      visible: true,
    },
    {
      id: 4,
      title: "React Fundamentals",
      course: "Advanced Web Development",
      items: 10,
      visible: false,
    },
    {
      id: 5,
      title: "Python Basics",
      course: "Data Science Fundamentals",
      items: 7,
      visible: true,
    },
  ];

  // Sample items for a module
  const moduleItems = [
    {
      id: 1,
      title: "Welcome to Programming",
      type: "Video",
      icon: <Video className="h-4 w-4" />,
      duration: "10:30",
      visible: true,
    },
    {
      id: 2,
      title: "Programming History",
      type: "Text",
      icon: <FileText className="h-4 w-4" />,
      duration: "5 min read",
      visible: true,
    },
    {
      id: 3,
      title: "Your First Program",
      type: "Video",
      icon: <Video className="h-4 w-4" />,
      duration: "15:45",
      visible: true,
    },
    {
      id: 4,
      title: "Programming Concepts Diagram",
      type: "Image",
      icon: <Image className="h-4 w-4" />,
      duration: "",
      visible: true,
    },
    {
      id: 5,
      title: "Variables and Data Types",
      type: "Text",
      icon: <FileText className="h-4 w-4" />,
      duration: "8 min read",
      visible: true,
    },
    {
      id: 6,
      title: "Understanding Variables",
      type: "Video",
      icon: <Video className="h-4 w-4" />,
      duration: "12:20",
      visible: false,
    },
    {
      id: 7,
      title: "Practice Exercises",
      type: "PDF",
      icon: <File className="h-4 w-4" />,
      duration: "10 pages",
      visible: true,
    },
    {
      id: 8,
      title: "Module Assessment",
      type: "Quiz",
      icon: <File className="h-4 w-4" />,
      duration: "10 questions",
      visible: true,
    },
  ];

  // Sample media assets
  const mediaAssets = [
    {
      id: 1,
      name: "intro_to_programming.mp4",
      type: "Video",
      size: "45.2 MB",
      added: "Apr 10, 2024",
      courses: 2,
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=100&h=60",
    },
    {
      id: 2,
      name: "web_development_basics.mp4",
      type: "Video",
      size: "65.7 MB",
      added: "Apr 12, 2024",
      courses: 1,
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=100&h=60",
    },
    {
      id: 3,
      name: "data_structures_diagram.png",
      type: "Image",
      size: "2.3 MB",
      added: "Apr 15, 2024",
      courses: 3,
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&h=60",
    },
    {
      id: 4,
      name: "python_guide.pdf",
      type: "Document",
      size: "1.8 MB",
      added: "Apr 18, 2024",
      courses: 1,
      thumbnail: "",
    },
    {
      id: 5,
      name: "machine_learning_intro.mp4",
      type: "Video",
      size: "78.5 MB",
      added: "Apr 20, 2024",
      courses: 1,
      thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=100&h=60",
    },
  ];

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
                  <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="modules" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="modules">Course Modules</TabsTrigger>
                  <TabsTrigger value="module-items">Module Items</TabsTrigger>
                  <TabsTrigger value="media">Media Assets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="modules" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Course Modules</CardTitle>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Module
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-4">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search modules..."
                            className="pl-8"
                          />
                        </div>

                        <div className="relative overflow-x-auto rounded-md border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50">
                              <tr>
                                <th scope="col" className="px-6 py-3">Module Name</th>
                                <th scope="col" className="px-6 py-3">Course</th>
                                <th scope="col" className="px-6 py-3">Items</th>
                                <th scope="col" className="px-6 py-3">Visibility</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {modules.map((module) => (
                                <tr key={module.id} className="border-b bg-background hover:bg-muted/50">
                                  <td className="px-6 py-4 font-medium">
                                    {module.title}
                                  </td>
                                  <td className="px-6 py-4">
                                    {module.course}
                                  </td>
                                  <td className="px-6 py-4">
                                    {module.items}
                                  </td>
                                  <td className="px-6 py-4">
                                    <Badge variant={module.visible ? "default" : "secondary"}>
                                      {module.visible ? 'Visible' : 'Hidden'}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ArrowUp className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ArrowDown className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        Edit
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="module-items" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Introduction to Programming</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">8 items in this module</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Back to Modules
                        </Button>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative overflow-x-auto rounded-md border">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-muted/50">
                            <tr>
                              <th scope="col" className="px-6 py-3">Order</th>
                              <th scope="col" className="px-6 py-3">Item</th>
                              <th scope="col" className="px-6 py-3">Type</th>
                              <th scope="col" className="px-6 py-3">Duration</th>
                              <th scope="col" className="px-6 py-3">Visibility</th>
                              <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {moduleItems.map((item) => (
                              <tr key={item.id} className="border-b bg-background hover:bg-muted/50">
                                <td className="px-6 py-4">
                                  {item.id}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                  {item.title}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <span className="bg-primary/10 p-1 rounded-full mr-2">
                                      {item.icon}
                                    </span>
                                    {item.type}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {item.duration}
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant={item.visible ? "default" : "secondary"}>
                                    {item.visible ? 'Visible' : 'Hidden'}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="media" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Media Library</CardTitle>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Media
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search media assets..."
                              className="pl-8"
                            />
                          </div>
                          <div className="flex gap-2">
                            <select className="px-2 py-1 rounded-md border bg-background">
                              <option>All Types</option>
                              <option>Video</option>
                              <option>Image</option>
                              <option>Document</option>
                            </select>
                          </div>
                        </div>

                        <div className="relative overflow-x-auto rounded-md border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50">
                              <tr>
                                <th scope="col" className="px-6 py-3">Media</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Size</th>
                                <th scope="col" className="px-6 py-3">Added</th>
                                <th scope="col" className="px-6 py-3">Used In</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mediaAssets.map((asset) => (
                                <tr key={asset.id} className="border-b bg-background hover:bg-muted/50">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      {asset.thumbnail ? (
                                        <img 
                                          src={asset.thumbnail} 
                                          alt={asset.name} 
                                          className="w-16 h-10 object-cover rounded"
                                        />
                                      ) : (
                                        <div className="w-16 h-10 bg-muted flex items-center justify-center rounded">
                                          <FileText className="h-6 w-6" />
                                        </div>
                                      )}
                                      <div className="font-medium">{asset.name}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    {asset.type}
                                  </td>
                                  <td className="px-6 py-4">
                                    {asset.size}
                                  </td>
                                  <td className="px-6 py-4">
                                    {asset.added}
                                  </td>
                                  <td className="px-6 py-4">
                                    {asset.courses} courses
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      <Button variant="ghost" size="sm">
                                        View
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        Replace
                                      </Button>
                                      <Button variant="ghost" size="icon">
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
                            Showing 1-5 of 5 media assets
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
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminContent;
