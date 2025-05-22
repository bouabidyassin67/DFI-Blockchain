
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Define Quiz interface
interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  questions: number;
  time_limit: string;
  is_premium: boolean;
}

// Fetch quizzes from Supabase
const fetchQuizzes = async (): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

// Start a quiz
const startQuiz = async (quizId: number, userId: string): Promise<{ quizUrl: string }> => {
  // In a real app, you would create a quiz session in the database
  // Here we'll just simulate it
  
  // Record that the user started the quiz
  const { error } = await supabase
    .from('user_quiz_sessions')
    .insert({
      quiz_id: quizId,
      user_id: userId,
      status: 'in_progress',
      start_time: new Date().toISOString()
    });
  
  if (error) {
    console.error("Error recording quiz start:", error);
    // Continue anyway since this is just for tracking
  }
  
  return {
    quizUrl: `/quiz/${quizId}`
  };
};

const Quizzes = () => {
  const { user, isPremiumUser } = useAuth();
  const navigate = useNavigate();
  
  // Use React Query for data fetching
  const { data: quizzes, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: fetchQuizzes,
    // Only fetch if user is authenticated
    enabled: !!user
  });
  
  const handleStartQuiz = async (quiz: Quiz) => {
    if (!user) {
      toast.error("Please login to take a quiz");
      navigate("/login");
      return;
    }
    
    if (quiz.is_premium && !isPremiumUser) {
      toast.error("This is a premium quiz. Please upgrade to premium to access it.", {
        action: {
          label: "Upgrade",
          onClick: () => navigate("/subscription")
        }
      });
      return;
    }
    
    try {
      toast.success(`Starting ${quiz.title} quiz`);
      
      const result = await startQuiz(quiz.id, user.id);
      
      // Navigate to the quiz page
      navigate(result.quizUrl);
    } catch (error) {
      toast.error("Failed to start the quiz. Please try again.");
      console.error("Quiz start error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-full">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (error || !quizzes) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto text-center">
              <h2 className="text-xl font-bold mb-2">Failed to load quizzes</h2>
              <p className="text-muted-foreground">Please try again later</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground mt-1">
              Test your knowledge with our interactive quizzes
            </p>
            
            {!isPremiumUser && (
              <div className="bg-muted/50 border rounded-md p-4 mt-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Premium Quizzes Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Some of our advanced quizzes require a premium subscription. Upgrade to premium to access all quizzes.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate("/subscription")}
                  >
                    View Subscription Plans
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const isLocked = quiz.is_premium && !isPremiumUser;
                
                return (
                <Card key={quiz.id} className={`dashboard-card ${isLocked ? 'border-amber-500/30' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{quiz.title}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${quiz.is_premium 
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400" 
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"}
                        `}
                      >
                        {quiz.is_premium ? "Premium" : quiz.category}
                      </Badge>
                    </div>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Questions:</span>
                        <span className="text-sm font-medium">{quiz.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time limit:</span>
                        <span className="text-sm font-medium">{quiz.time_limit}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isLocked ? (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate("/subscription")}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Upgrade to Unlock
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleStartQuiz(quiz)}
                      >
                        Take Quiz
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )})}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Quizzes;
