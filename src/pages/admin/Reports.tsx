
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  Download, 
  Calendar,
  Users,
  Clock,
  BookOpen,
  TrendingUp,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const AdminReports = () => {
  // Sample user engagement data for charts
  const monthlyUserData = [
    { month: 'Jan', active: 450, new: 120 },
    { month: 'Feb', active: 520, new: 150 },
    { month: 'Mar', active: 580, new: 170 },
    { month: 'Apr', active: 650, new: 200 },
    { month: 'May', active: 720, new: 180 }
  ];
  
  // Sample course performance data
  const courseData = [
    { name: "Introduction to Computer Science", enrollment: 320, completion: 85, satisfaction: 4.8 },
    { name: "Advanced Web Development", enrollment: 230, completion: 75, satisfaction: 4.6 },
    { name: "Data Science Fundamentals", enrollment: 280, completion: 70, satisfaction: 4.7 },
    { name: "Machine Learning Essentials", enrollment: 150, completion: 60, satisfaction: 4.5 },
    { name: "UX/UI Design Principles", enrollment: 180, completion: 65, satisfaction: 4.3 },
  ];
  
  // Sample learning time data
  const timeSpentData = [
    { name: 'Videos', value: 45 },
    { name: 'Quizzes', value: 20 },
    { name: 'Reading', value: 25 },
    { name: 'Exercises', value: 10 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Sample demographics data
  const demographicsData = [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 40 },
    { name: '35-44', value: 20 },
    { name: '45+', value: 15 },
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
                  <BarChart2 className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Last 30 Days
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </div>
              
              {/* Key Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                        <h3 className="text-2xl font-bold mt-1">1,245</h3>
                        <p className="text-xs text-green-500 font-medium">+12% from last month</p>
                      </div>
                      <div className="bg-blue-500/10 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Completion Rate</p>
                        <h3 className="text-2xl font-bold mt-1">72%</h3>
                        <p className="text-xs text-green-500 font-medium">+5% from last month</p>
                      </div>
                      <div className="bg-green-500/10 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Course Enrollments</p>
                        <h3 className="text-2xl font-bold mt-1">3,842</h3>
                        <p className="text-xs text-green-500 font-medium">+8% from last month</p>
                      </div>
                      <div className="bg-purple-500/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Learning Time</p>
                        <h3 className="text-2xl font-bold mt-1">4.2 hrs</h3>
                        <p className="text-xs text-green-500 font-medium">+0.5 hrs from last month</p>
                      </div>
                      <div className="bg-amber-500/10 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="engagement" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="engagement">User Engagement</TabsTrigger>
                  <TabsTrigger value="courses">Course Performance</TabsTrigger>
                  <TabsTrigger value="learning">Learning Insights</TabsTrigger>
                  <TabsTrigger value="demographics">Demographics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="engagement" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center">
                        <LineChartIcon className="mr-2 h-5 w-5" />
                        User Engagement Trends
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={monthlyUserData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="active" name="Active Users" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="new" name="New Users" stroke="#82ca9d" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium">Daily Active Users</p>
                            <h4 className="text-2xl font-bold mt-1">428</h4>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium">Weekly Active Users</p>
                            <h4 className="text-2xl font-bold mt-1">685</h4>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium">Bounce Rate</p>
                            <h4 className="text-2xl font-bold mt-1">24%</h4>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium">Avg. Session Duration</p>
                            <h4 className="text-2xl font-bold mt-1">18m 32s</h4>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="courses" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center">
                        <BarChartIcon className="mr-2 h-5 w-5" />
                        Course Performance
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={courseData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar name="Enrollments" dataKey="enrollment" fill="#8884d8" />
                            <Bar name="Completion Rate (%)" dataKey="completion" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="relative overflow-x-auto rounded-md border">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-muted/50">
                            <tr>
                              <th scope="col" className="px-6 py-3">Course</th>
                              <th scope="col" className="px-6 py-3">Enrollments</th>
                              <th scope="col" className="px-6 py-3">Completion Rate</th>
                              <th scope="col" className="px-6 py-3">Satisfaction</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courseData.map((course, index) => (
                              <tr key={index} className="border-b bg-background hover:bg-muted/50">
                                <td className="px-6 py-4 font-medium">
                                  {course.name}
                                </td>
                                <td className="px-6 py-4">
                                  {course.enrollment}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="w-full bg-muted h-2 rounded-full mr-2">
                                      <div 
                                        className="h-2 rounded-full bg-green-500" 
                                        style={{ width: `${course.completion}%` }}
                                      ></div>
                                    </div>
                                    <span>{course.completion}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    {course.satisfaction}
                                    <svg className="w-4 h-4 ml-1 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
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
                
                <TabsContent value="learning" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChartIcon className="mr-2 h-5 w-5" />
                        Learning Time Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0">
                        <div className="h-80 w-full md:w-1/2">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={timeSpentData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {timeSpentData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="w-full md:w-1/2 space-y-4 p-4">
                          <h3 className="text-lg font-medium">Learning Insights</h3>
                          <ul className="space-y-2">
                            <li className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#0088FE] mr-2"></div>
                              <span>Video content drives the highest engagement at 45%</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#00C49F] mr-2"></div>
                              <span>Quiz and assessment time has increased by 5%</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#FFBB28] mr-2"></div>
                              <span>Reading material consumption is consistent</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#FF8042] mr-2"></div>
                              <span>Practical exercises need more engagement</span>
                            </li>
                          </ul>
                          
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">Recommendations</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Increase interactive video content</li>
                              <li>• Introduce more gamified exercises</li>
                              <li>• Create shorter reading segments</li>
                              <li>• Add more real-world practical assignments</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="demographics" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Age Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={demographicsData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                              >
                                {demographicsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Demographics Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Gender Distribution</h4>
                            <div className="flex items-center">
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Male</span>
                                  <span>58%</span>
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "58%" }}></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center mt-2">
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Female</span>
                                  <span>40%</span>
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                  <div className="h-2 rounded-full bg-pink-500" style={{ width: "40%" }}></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center mt-2">
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Other</span>
                                  <span>2%</span>
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                  <div className="h-2 rounded-full bg-purple-500" style={{ width: "2%" }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Geographic Distribution</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>North America</span>
                                <span>45%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Europe</span>
                                <span>25%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Asia</span>
                                <span>20%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Other Regions</span>
                                <span>10%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Education Level</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Bachelor's Degree</span>
                                <span>40%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Master's Degree</span>
                                <span>30%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>High School</span>
                                <span>20%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>PhD/Doctorate</span>
                                <span>10%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReports;
