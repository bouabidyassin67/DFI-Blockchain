
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Search, 
  Download, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const AdminFinance = () => {
  // Sample sales data for chart
  const salesData = [
    { month: 'Jan', revenue: 12500, refunds: 450 },
    { month: 'Feb', revenue: 15000, refunds: 600 },
    { month: 'Mar', revenue: 18000, refunds: 500 },
    { month: 'Apr', revenue: 22000, refunds: 750 },
    { month: 'May', revenue: 20000, refunds: 650 }
  ];

  // Sample transactions data
  const transactions = [
    {
      id: "TRX-2024-001",
      date: "May 1, 2024",
      student: "Jane Smith",
      course: "Introduction to Computer Science",
      amount: 99.99,
      status: "Completed",
      type: "Purchase",
    },
    {
      id: "TRX-2024-002",
      date: "May 1, 2024",
      student: "John Doe",
      course: "Advanced Web Development",
      amount: 149.99,
      status: "Completed",
      type: "Purchase",
    },
    {
      id: "TRX-2024-003",
      date: "Apr 30, 2024",
      student: "Alice Johnson",
      course: "Machine Learning Essentials",
      amount: 199.99,
      status: "Pending",
      type: "Purchase",
    },
    {
      id: "TRX-2024-004",
      date: "Apr 29, 2024",
      student: "Michael Brown",
      course: "UX/UI Design Principles",
      amount: 89.99,
      status: "Refunded",
      type: "Refund",
    },
    {
      id: "TRX-2024-005",
      date: "Apr 29, 2024",
      student: "Linda Davis",
      course: "Learning Pro Monthly",
      amount: 19.99,
      status: "Completed",
      type: "Subscription",
    },
  ];

  // Sample course revenue data
  const courseRevenue = [
    { name: "Introduction to Computer Science", revenue: 5499.45, students: 55 },
    { name: "Advanced Web Development", revenue: 4499.70, students: 30 },
    { name: "Data Science Fundamentals", revenue: 3899.67, students: 30 },
    { name: "Machine Learning Essentials", revenue: 3799.81, students: 19 },
    { name: "UX/UI Design Principles", revenue: 1799.80, students: 20 },
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
                  <CreditCard className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight">Payment & Finance</h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    May 1-31, 2024
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </div>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-2xl font-bold">$19,500</h3>
                          <p className="ml-2 text-xs text-green-500 font-medium flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            12%
                          </p>
                        </div>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-2xl font-bold">342</h3>
                          <p className="ml-2 text-xs text-green-500 font-medium flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            8%
                          </p>
                        </div>
                      </div>
                      <div className="bg-purple-500/10 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Refunds</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-2xl font-bold">$650</h3>
                          <p className="ml-2 text-xs text-red-500 font-medium flex items-center">
                            <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            3%
                          </p>
                        </div>
                      </div>
                      <div className="bg-red-500/10 p-2 rounded-full">
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">New Students</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-2xl font-bold">127</h3>
                          <p className="ml-2 text-xs text-green-500 font-medium flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            15%
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="refunds" stroke="#ff5050" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="transactions" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="courses">Course Revenue</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transactions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search transactions..."
                              className="pl-8 w-full"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              Filter
                            </Button>
                          </div>
                        </div>

                        <div className="relative overflow-x-auto rounded-md border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50">
                              <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Student</th>
                                <th scope="col" className="px-6 py-3">Course/Item</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b bg-background hover:bg-muted/50">
                                  <td className="px-6 py-4 font-mono text-xs">
                                    {transaction.id}
                                  </td>
                                  <td className="px-6 py-4">
                                    {transaction.date}
                                  </td>
                                  <td className="px-6 py-4">
                                    {transaction.student}
                                  </td>
                                  <td className="px-6 py-4">
                                    {transaction.course}
                                  </td>
                                  <td className="px-6 py-4 font-medium">
                                    ${transaction.amount.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                      ${transaction.type === 'Purchase' ? 'bg-blue-100 text-blue-800' : 
                                      transaction.type === 'Refund' ? 'bg-red-100 text-red-800' :
                                      'bg-purple-100 text-purple-800'}`}>
                                      {transaction.type}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                      ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'}`}>
                                      {transaction.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4">
                          <div className="text-sm text-muted-foreground">
                            Showing 1-5 of 5 transactions
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
                
                <TabsContent value="courses" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={courseRevenue}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar name="Revenue ($)" dataKey="revenue" fill="#8884d8" />
                            <Bar name="Students" dataKey="students" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="relative overflow-x-auto rounded-md border">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-muted/50">
                            <tr>
                              <th scope="col" className="px-6 py-3">Course</th>
                              <th scope="col" className="px-6 py-3">Revenue</th>
                              <th scope="col" className="px-6 py-3">Students</th>
                              <th scope="col" className="px-6 py-3">Avg. Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courseRevenue.map((course, index) => (
                              <tr key={index} className="border-b bg-background hover:bg-muted/50">
                                <td className="px-6 py-4 font-medium">
                                  {course.name}
                                </td>
                                <td className="px-6 py-4">
                                  ${course.revenue.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                  {course.students}
                                </td>
                                <td className="px-6 py-4">
                                  ${(course.revenue / course.students).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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

export default AdminFinance;
