
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Define IQ test interface
interface IQTest {
  id: number;
  title: string;
  description: string;
  questions: number;
  time_limit: string;
  difficulty: string;
  is_premium: boolean;
}

// Fetch IQ tests from Supabase
const fetchIQTests = async (): Promise<IQTest[]> => {
  const { data, error } = await supabase
    .from('iq_tests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

// Start an IQ test
const startIQTest = async (testId: number, userId: string): Promise<{ testUrl: string }> => {
  // In a real app, you would create a test session in the database
  // Here we'll just simulate it
  
  // Record that the user started the test
  const { error } = await supabase
    .from('user_test_sessions')
    .insert({
      test_id: testId,
      user_id: userId,
      status: 'in_progress',
      start_time: new Date().toISOString()
    });
  
  if (error) {
    console.error("Error recording test start:", error);
    // Continue anyway since this is just for tracking
  }
  
  return {
    testUrl: `/iq-test/${testId}`
  };
};

const IQTests = () => {
  const { user, isPremiumUser } = useAuth();
  const navigate = useNavigate();
  
  // Use React Query for data fetching
  const { data: iqTests, isLoading, error } = useQuery({
    queryKey: ['iqTests'],
    queryFn: fetchIQTests,
    // Only fetch if user is authenticated
    enabled: !!user
  });
  
  const handleStartTest = async (test: IQTest) => {
    if (!user) {
      toast.error("Please login to take an IQ test");
      navigate("/login");
      return;
    }
    
    if (test.is_premium && !isPremiumUser) {
      toast.error("This is a premium IQ test. Please upgrade to premium to access it.", {
        action: {
          label: "Upgrade",
          onClick: () => navigate("/subscription")
        }
      });
      return;
    }
    
    try {
      toast.success(`Starting ${test.title}`);
      
      const result = await startIQTest(test.id, user.id);
      
      // Navigate to the test page (in a real implementation)
      navigate(result.testUrl);
    } catch (error) {
      toast.error("Failed to start the test. Please try again.");
      console.error("Test start error:", error);
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
  
  if (error || !iqTests) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto text-center">
              <h2 className="text-xl font-bold mb-2">Failed to load IQ tests</h2>
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
            <h1 className="text-3xl font-bold tracking-tight">IQ Tests</h1>
            <p className="text-muted-foreground mt-1">
              Take an IQ test to measure your cognitive abilities
            </p>
            
            {!isPremiumUser && (
              <div className="bg-muted/50 border rounded-md p-4 mt-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Premium Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Most of our IQ tests require a premium subscription. Upgrade to premium to access all IQ tests.
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
              {iqTests.map((test) => {
                const isLocked = test.is_premium && !isPremiumUser;
                
                return (
                <Card key={test.id} className={`dashboard-card ${isLocked ? 'border-amber-500/30' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{test.title}</CardTitle>
                      {test.is_premium && (
                        <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                          Premium
                        </div>
                      )}
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Questions:</span>
                        <span className="text-sm font-medium">{test.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time limit:</span>
                        <span className="text-sm font-medium">{test.time_limit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Difficulty:</span>
                        <span className="text-sm font-medium">{test.difficulty}</span>
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
                      <Button className="w-full" onClick={() => handleStartTest(test)}>
                        Start Test
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

export default IQTests;
