
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeft, Calendar, Clock, CheckCircle, LineChart, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CourseProgressDetail = () => {
  const { id } = useParams();
  
  // Sample course data - in a real app, you would fetch this based on the ID
  const course = {
    id: Number(id),
    title: "Introduction to Computer Science",
    progress: 85,
    startDate: "Jan 10, 2024",
    estimatedCompletion: "May 20, 2024",
    totalHours: 60,
    completedHours: 51,
    grade: "A",
    instructor: "Dr. Alan Turing",
    modules: [
      { 
        id: 101, 
        name: "Module 1: Fundamentals", 
        completed: true, 
        totalLessons: 5, 
        completedLessons: 5,
        lessons: [
          { id: 1001, name: "Introduction to Computing", completed: true, duration: "45 min" },
          { id: 1002, name: "Binary Number System", completed: true, duration: "60 min" },
          { id: 1003, name: "Computer Architecture", completed: true, duration: "75 min" },
          { id: 1004, name: "Operating Systems Basics", completed: true, duration: "60 min" },
          { id: 1005, name: "Introduction to Programming", completed: true, duration: "90 min" }
        ]
      },
      { 
        id: 102, 
        name: "Module 2: Data Structures", 
        completed: true, 
        totalLessons: 4, 
        completedLessons: 4,
        lessons: [
          { id: 1006, name: "Arrays and Lists", completed: true, duration: "60 min" },
          { id: 1007, name: "Stacks and Queues", completed: true, duration: "75 min" },
          { id: 1008, name: "Trees and Graphs", completed: true, duration: "90 min" },
          { id: 1009, name: "Hash Tables", completed: true, duration: "60 min" }
        ]
      },
      { 
        id: 103, 
        name: "Module 3: Algorithms", 
        completed: false, 
        totalLessons: 6, 
        completedLessons: 4,
        lessons: [
          { id: 1010, name: "Algorithm Analysis", completed: true, duration: "60 min" },
          { id: 1011, name: "Sorting Algorithms", completed: true, duration: "90 min" },
          { id: 1012, name: "Searching Algorithms", completed: true, duration: "75 min" },
          { id: 1013, name: "Dynamic Programming", completed: true, duration: "90 min" },
          { id: 1014, name: "Greedy Algorithms", completed: false, duration: "75 min" },
          { id: 1015, name: "Graph Algorithms", completed: false, duration: "90 min" }
        ]
      },
      { 
        id: 104, 
        name: "Module 4: Object-Oriented Programming", 
        completed: false, 
        totalLessons: 5, 
        completedLessons: 2,
        lessons: [
          { id: 1016, name: "OOP Concepts", completed: true, duration: "75 min" },
          { id: 1017, name: "Classes and Objects", completed: true, duration: "60 min" },
          { id: 1018, name: "Inheritance and Polymorphism", completed: false, duration: "90 min" },
          { id: 1019, name: "Encapsulation and Abstraction", completed: false, duration: "75 min" },
          { id: 1020, name: "Design Patterns", completed: false, duration: "90 min" }
        ]
      }
    ],
    assessments: [
      { id: 201, name: "Quiz 1: Fundamentals", score: "95%", date: "Jan 20, 2024", status: "Passed" },
      { id: 202, name: "Assignment 1: Binary Conversion", score: "90%", date: "Jan 25, 2024", status: "Passed" },
      { id: 203, name: "Quiz 2: Data Structures", score: "88%", date: "Feb 10, 2024", status: "Passed" },
      { id: 204, name: "Mid-term Exam", score: "92%", date: "Mar 01, 2024", status: "Passed" },
      { id: 205, name: "Quiz 3: Algorithms", score: "85%", date: "Mar 15, 2024", status: "Passed" },
      { id: 206, name: "Final Project", score: "In Progress", date: "Due May 15, 2024", status: "In Progress" }
    ]
  };

  // Calculate weekly study hours (simulated data)
  const weeklyProgress = [
    { week: "Week 1", hours: 8 },
    { week: "Week 2", hours: 6 },
    { week: "Week 3", hours: 10 },
    { week: "Week 4", hours: 5 },
    { week: "Week 5", hours: 7 },
    { week: "Week 6", hours: 8 },
    { week: "Week 7", hours: 4 },
    { week: "Week 8", hours: 3 },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            <Link to="/progress" className="flex items-center text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Progress
            </Link>
            
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Course Progress</h1>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">Started: {course.startDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{course.completedHours} of {course.totalHours} hours completed</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">Current Grade: {course.grade}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <Tabs defaultValue="modules">
                    <TabsList className="mb-4">
                      <TabsTrigger value="modules">Modules & Lessons</TabsTrigger>
                      <TabsTrigger value="assessments">Assessments</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="modules" className="space-y-6">
                      {course.modules.map((module) => (
                        <Card key={module.id} className="bg-background">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${module.completed ? 'bg-green-500' : 'bg-muted'}`}>
                                  {module.completed && <CheckCircle className="h-4 w-4 text-white" />}
                                </div>
                                <CardTitle className="text-lg">{module.name}</CardTitle>
                              </div>
                              <span className="text-sm font-medium">
                                {module.completedLessons}/{module.totalLessons} lessons
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <Progress 
                              value={(module.completedLessons / module.totalLessons) * 100} 
                              className="h-1 mb-4"
                            />
                            
                            <div className="space-y-3">
                              {module.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                  <div className="flex items-center">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                                      {lesson.completed && <CheckCircle className="h-3 w-3 text-white" />}
                                    </div>
                                    <span className={`${lesson.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {lesson.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">
                                      {lesson.duration}
                                    </span>
                                    {!lesson.completed && (
                                      <Button size="sm" variant="outline">
                                        Start
                                      </Button>
                                    )}
                                    {lesson.completed && (
                                      <Button size="sm" variant="ghost">
                                        Review
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="assessments">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs uppercase bg-muted/50">
                                <tr>
                                  <th scope="col" className="px-6 py-3">Assessment</th>
                                  <th scope="col" className="px-6 py-3">Date</th>
                                  <th scope="col" className="px-6 py-3">Score</th>
                                  <th scope="col" className="px-6 py-3">Status</th>
                                  <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {course.assessments.map((assessment) => (
                                  <tr key={assessment.id} className="bg-muted/20 border-b">
                                    <td className="px-6 py-4 font-medium">{assessment.name}</td>
                                    <td className="px-6 py-4">{assessment.date}</td>
                                    <td className="px-6 py-4">{assessment.score}</td>
                                    <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        assessment.status === 'Passed' 
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {assessment.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      {assessment.status === 'Passed' ? (
                                        <Button variant="ghost" size="sm">
                                          View Results
                                        </Button>
                                      ) : (
                                        <Button variant="default" size="sm">
                                          Start
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="analytics">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium text-lg mb-3">Weekly Study Activity</h3>
                              <div className="h-64 w-full bg-muted/50 rounded-lg p-4 flex items-end justify-between gap-2">
                                {weeklyProgress.map((week, index) => (
                                  <div key={index} className="flex flex-col items-center">
                                    <div 
                                      className="bg-primary rounded-t-sm w-10" 
                                      style={{ height: `${(week.hours / 10) * 160}px` }}
                                    ></div>
                                    <p className="text-xs mt-2">{week.week.split(' ')[1]}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Card>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm">Average Time Per Lesson</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold text-center">
                                    45 min
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm">Quiz Average Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold text-center">
                                    89%
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm">Estimated Completion</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold text-center">
                                    {course.estimatedCompletion}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseProgressDetail;
