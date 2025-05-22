
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// Define subscription plan interface
interface SubscriptionPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  tier: string;
}

const Subscription = () => {
  const { user, profile, isPremiumUser } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        // In a real application, fetch subscription plans from the database
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPlans(data);
        } else {
          // Fallback to static plans if no data in database
          setPlans([
            {
              name: "Basic Plan",
              price: 9.99,
              period: "month",
              description: "Access to basic courses and quizzes",
              features: [
                "Basic courses access",
                "Basic quizzes",
                "Limited certificates",
                "Basic gamification features",
              ],
              highlight: false,
              tier: "basic",
            },
            {
              name: "Premium Plan",
              price: 19.99,
              period: "month",
              description: "Full access to all platform features",
              features: [
                "All courses access",
                "All quizzes and IQ tests",
                "Unlimited certificates",
                "Full gamification features",
                "Priority support",
                "Exclusive content",
              ],
              highlight: true,
              tier: "premium",
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading subscription plans:", error);
        toast.error("Failed to load subscription plans. Please try again.");
        
        // Fallback to static plans
        setPlans([
          {
            name: "Basic Plan",
            price: 9.99,
            period: "month",
            description: "Access to basic courses and quizzes",
            features: [
              "Basic courses access",
              "Basic quizzes",
              "Limited certificates",
              "Basic gamification features",
            ],
            highlight: false,
            tier: "basic",
          },
          {
            name: "Premium Plan",
            price: 19.99,
            period: "month",
            description: "Full access to all platform features",
            features: [
              "All courses access",
              "All quizzes and IQ tests",
              "Unlimited certificates",
              "Full gamification features",
              "Priority support",
              "Exclusive content",
            ],
            highlight: true,
            tier: "premium",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlans();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }
    
    setIsProcessing(plan.tier);
    
    try {
      toast.success(`Processing subscription to ${plan.name} plan`);
      
      // In a real implementation, this would connect to a payment gateway
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          planId: plan.tier,
          userId: user.id,
          amount: plan.price,
          name: plan.name
        }
      });
      
      if (error) throw error;
      
      // Update the user's subscription in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          subscription_tier: plan.tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast.success(`Successfully subscribed to ${plan.name} plan!`);
      
      // Force reload the auth context to reflect new subscription
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setIsProcessing(null);
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

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
            </div>
            
            <p className="text-muted-foreground mb-8">
              Choose the plan that's right for you and get access to premium courses, quizzes, and features.
            </p>

            {isPremiumUser && (
              <Card className="mb-8 border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">You're subscribed!</h3>
                      <p className="text-muted-foreground">
                        You currently have a {profile?.subscriptionTier === "premium" ? "Premium" : "Basic"} subscription.
                        Enjoy your access to all the features.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`${plan.highlight ? 'border-primary shadow-md' : ''} ${profile?.subscriptionTier === plan.tier ? 'bg-muted/30' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {plan.name}
                      {profile?.subscriptionTier === plan.tier && (
                        <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                          Current Plan
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.highlight ? "default" : "outline"}
                      disabled={profile?.subscriptionTier === plan.tier || isProcessing !== null}
                      onClick={() => handleSubscribe(plan)}
                    >
                      {isProcessing === plan.tier ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        profile?.subscriptionTier === plan.tier ? 'Current Plan' : 'Subscribe Now'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-12 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Individual Course Purchases</h2>
              <p className="text-muted-foreground mb-4">
                Don't want to commit to a subscription? You can also purchase individual courses.
              </p>
              <Button onClick={() => navigate("/courses")}>
                Browse Courses
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subscription;
