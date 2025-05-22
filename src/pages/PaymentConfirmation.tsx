
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type PaymentStatus = "loading" | "success" | "failed";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [paymentType, setPaymentType] = useState<"course" | "subscription">("course");
  const [itemName, setItemName] = useState<string>("");
  
  // Get payment session ID and type from URL parameters
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type");
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus("failed");
        return;
      }
      
      try {
        // Determine payment type and fetch appropriate data
        if (type === "subscription") {
          setPaymentType("subscription");
          
          // Verify the subscription payment and update user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();
            
          if (profileError) {
            throw new Error("Couldn't fetch profile");
          }
          
          // In a real implementation, you would verify the payment with Stripe API
          // For now, we'll simulate a successful payment
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              subscription_tier: 'premium',
              // Record when the subscription was purchased
              subscription_start: new Date().toISOString(),
              subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            })
            .eq('id', user?.id);
            
          if (updateError) {
            throw new Error("Failed to update subscription");
          }
          
          setItemName("Premium Subscription");
          setStatus("success");
        } else {
          // Assume it's a course purchase
          setPaymentType("course");
          
          // Get the course ID from the session parameter
          const courseId = searchParams.get("course_id");
          
          if (!courseId) {
            throw new Error("Missing course ID");
          }
          
          // Get course details
          const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();
            
          if (courseError) {
            throw new Error("Couldn't fetch course details");
          }
          
          // Record the purchase
          const { error: purchaseError } = await supabase
            .from('purchases')
            .insert({
              user_id: user?.id,
              course_id: courseId,
              amount: course.price,
              status: 'completed'
            });
            
          if (purchaseError) {
            throw new Error("Failed to record purchase");
          }
          
          // Update user's purchased courses
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('purchased_courses')
            .eq('id', user?.id)
            .single();
            
          if (profileError) {
            throw new Error("Couldn't fetch profile");
          }
          
          const purchasedCourses = profile.purchased_courses || [];
          if (!purchasedCourses.includes(courseId)) {
            purchasedCourses.push(courseId);
            
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ purchased_courses: purchasedCourses })
              .eq('id', user?.id);
              
            if (updateError) {
              throw new Error("Failed to update purchased courses");
            }
          }
          
          setItemName(course.title);
          setStatus("success");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
      }
    };
    
    if (user) {
      verifyPayment();
    }
  }, [sessionId, type, user, searchParams]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            )}
            {status === "failed" && (
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Processing Payment..."}
            {status === "success" && "Payment Successful!"}
            {status === "failed" && "Payment Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your payment."}
            {status === "success" && paymentType === "subscription" && 
              "Your premium subscription has been activated."
            }
            {status === "success" && paymentType === "course" && 
              `Your purchase of "${itemName}" was successful.`
            }
            {status === "failed" && "We couldn't verify your payment. Please try again or contact support."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" && (
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">What's next?</h3>
              {paymentType === "subscription" ? (
                <p className="text-sm text-muted-foreground">
                  You now have access to all premium features including premium courses, IQ tests, and advanced quizzes.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You can now start learning the course. Your progress will be saved as you go.
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {status === "success" && (
            <>
              {paymentType === "subscription" ? (
                <Button className="w-full" onClick={() => navigate("/courses")}>
                  Browse Premium Courses
                </Button>
              ) : (
                <Button className="w-full" onClick={() => navigate("/courses")}>
                  Go to My Courses
                </Button>
              )}
            </>
          )}
          
          {status === "failed" && (
            <Button className="w-full" onClick={() => window.history.back()}>
              Try Again
            </Button>
          )}
          
          <Button variant="outline" onClick={() => navigate("/")}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
