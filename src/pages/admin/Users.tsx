
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Search, Plus, MoreHorizontal, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
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

const AdminUsers = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Student",
      status: "Active",
      joinDate: "Jan 15, 2024",
      courses: 3,
    },
    {
      id: 2,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Student",
      status: "Active",
      joinDate: "Feb 20, 2024",
      courses: 2,
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "Student",
      status: "Inactive",
      joinDate: "Dec 10, 2023",
      courses: 1,
    },
    {
      id: 4,
      name: "Robert Williams",
      email: "robert.williams@example.com",
      role: "Instructor",
      status: "Active",
      joinDate: "Nov 05, 2023",
      courses: 4,
    },
    {
      id: 5,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "Aug 18, 2023",
      courses: 0,
    },
    {
      id: 6,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "Student",
      status: "Pending",
      joinDate: "Mar 25, 2024",
      courses: 0,
    },
  ]);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Student",
  });
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const user = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      courses: 0
    };
    
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "Student" });
    setIsDialogOpen(false);
    toast.success("User added successfully");
  };
  
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <User className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new user account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                        <Input 
                          id="name"
                          placeholder="Enter user's full name" 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                        <Input 
                          id="email"
                          type="email" 
                          placeholder="Enter user's email address" 
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium">User Role</label>
                        <select 
                          id="role"
                          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                          <option value="Student">Student</option>
                          <option value="Instructor">Instructor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddUser}>Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search users..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" className="flex items-center space-x-1">
                        <Filter className="h-4 w-4 mr-1" /> Filters
                      </Button>
                    </div>

                    <div className="relative overflow-x-auto rounded-md border">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted/50">
                          <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Joined</th>
                            <th scope="col" className="px-6 py-3">Courses</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b bg-background hover:bg-muted/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={user.role === "Admin" ? "default" : user.role === "Instructor" ? "outline" : "secondary"}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className={`h-2.5 w-2.5 rounded-full mr-2 
                                    ${user.status === 'Active' ? 'bg-green-500' : 
                                      user.status === 'Inactive' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                  </div>
                                  {user.status}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {user.joinDate}
                              </td>
                              <td className="px-6 py-4">
                                {user.courses}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => navigate(`/admin/users/${user.id}`)}
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
                                      <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                                        View Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        Delete User
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
                    
                    <div className="flex justify-between items-center pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredUsers.length} of {users.length} users
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
