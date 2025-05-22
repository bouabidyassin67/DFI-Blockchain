
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gift, Award, Star, Trophy, Zap, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Gamification = () => {
  // Sample gamification data
  const userLevel = {
    current: 12,
    xp: 3450,
    nextLevel: 4000,
    title: "Knowledge Explorer",
  };
  
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first course",
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      completed: true,
      date: "Jan 15, 2024",
    },
    {
      id: 2,
      name: "Perfect Score",
      description: "Achieve 100% on a quiz",
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      completed: true,
      date: "Feb 10, 2024",
    },
    {
      id: 3,
      name: "Fast Learner",
      description: "Complete a course in under a week",
      icon: <Flame className="h-6 w-6 text-red-500" />,
      completed: true,
      date: "Mar 01, 2024",
    },
    {
      id: 4,
      name: "Knowledge Master",
      description: "Complete 10 courses",
      icon: <Award className="h-6 w-6 text-purple-500" />,
      completed: false,
      progress: 5,
    },
    {
      id: 5,
      name: "Dedicated Student",
      description: "Study for 50 hours total",
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      completed: false,
      progress: 32,
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Emma Thompson", points: 9870, avatar: "ET" },
    { rank: 2, name: "Michael Chen", points: 9350, avatar: "MC" },
    { rank: 3, name: "Sarah Johnson", points: 9120, avatar: "SJ" },
    { rank: 4, name: "You", points: 8740, avatar: "YO", isCurrentUser: true },
    { rank: 5, name: "David Miller", points: 8510, avatar: "DM" },
    { rank: 6, name: "Lisa Garcia", points: 8120, avatar: "LG" },
  ];

  const rewards = [
    {
      id: 1,
      name: "Free Course Voucher",
      description: "Unlock any premium course for free",
      cost: 5000,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=100&h=100",
    },
    {
      id: 2,
      name: "1 Month Pro Subscription",
      description: "Get Pro features free for a month",
      cost: 10000,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=100&h=100",
    },
    {
      id: 3,
      name: "Exclusive Webinar Access",
      description: "Access to industry expert webinars",
      cost: 3000,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&h=100",
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
              <div className="flex items-center space-x-2">
                <Gift className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Gamification</h1>
              </div>
              <p className="text-muted-foreground">
                Track your progress, earn achievements, and claim rewards as you learn.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Your Level</CardTitle>
                    <CardDescription>Current progress and status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold">
                          {userLevel.current}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-2 py-1">
                          {userLevel.title}
                        </div>
                      </div>
                      <div className="w-full space-y-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{userLevel.xp} XP</span>
                          <span className="text-sm">{userLevel.nextLevel} XP</span>
                        </div>
                        <Progress value={(userLevel.xp / userLevel.nextLevel) * 100} className="h-2" />
                        <p className="text-center text-sm text-muted-foreground">
                          {userLevel.nextLevel - userLevel.xp} XP until level {userLevel.current + 1}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <Tabs defaultValue="achievements">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Learning Journey</CardTitle>
                        <TabsList>
                          <TabsTrigger value="achievements">Achievements</TabsTrigger>
                          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                          <TabsTrigger value="rewards">Rewards</TabsTrigger>
                        </TabsList>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TabsContent value="achievements" className="space-y-4">
                        {achievements.map((achievement) => (
                          <div key={achievement.id} className="flex items-center p-3 rounded-lg bg-muted/50">
                            <div className={`p-2 mr-4 rounded-full ${achievement.completed ? "bg-primary/10" : "bg-muted"}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{achievement.name}</h3>
                                {achievement.completed ? (
                                  <span className="text-xs text-green-500">Completed on {achievement.date}</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">In progress</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              {!achievement.completed && achievement.progress && (
                                <div className="mt-2 space-y-1">
                                  <Progress value={(achievement.progress / 10) * 100} className="h-1" />
                                  <p className="text-xs text-right">{achievement.progress}/10 completed</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="leaderboard">
                        <div className="relative overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                              <tr>
                                <th scope="col" className="px-6 py-3">Rank</th>
                                <th scope="col" className="px-6 py-3">Student</th>
                                <th scope="col" className="px-6 py-3">Points</th>
                              </tr>
                            </thead>
                            <tbody>
                              {leaderboard.map((student) => (
                                <tr 
                                  key={student.rank} 
                                  className={`${student.isCurrentUser ? "bg-primary/10 font-medium" : "bg-muted/20"} border-b`}
                                >
                                  <td className="px-6 py-4 font-medium">
                                    {student.rank <= 3 ? (
                                      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                                        ${student.rank === 1 ? "bg-amber-200 text-amber-700" : 
                                          student.rank === 2 ? "bg-gray-200 text-gray-700" : 
                                            "bg-orange-200 text-orange-700"}`}
                                      >
                                        {student.rank}
                                      </div>
                                    ) : student.rank}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <Avatar className="h-6 w-6 mr-2">
                                        <AvatarFallback>{student.avatar}</AvatarFallback>
                                      </Avatar>
                                      {student.name}
                                      {student.isCurrentUser && (
                                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">You</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">{student.points.toLocaleString()} XP</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="rewards" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rewards.map((reward) => (
                          <Card key={reward.id} className="overflow-hidden">
                            <div className="flex">
                              <div className="w-24 h-24">
                                <img 
                                  src={reward.image} 
                                  alt={reward.name} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div className="p-4 flex-1">
                                <h3 className="font-medium">{reward.name}</h3>
                                <p className="text-sm text-muted-foreground">{reward.description}</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-primary font-semibold">{reward.cost.toLocaleString()} XP</span>
                                  <button 
                                    className={`px-3 py-1 text-xs rounded-full ${userLevel.xp >= reward.cost ? 
                                      "bg-primary text-primary-foreground" : 
                                      "bg-muted text-muted-foreground cursor-not-allowed"}`}
                                    disabled={userLevel.xp < reward.cost}
                                  >
                                    {userLevel.xp >= reward.cost ? "Claim Reward" : "Not enough XP"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Gamification;
