
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  
  useEffect(() => {
    const verifyEmail = async () => {
      // If no token is provided, show an error
      if (!token) {
        // Get user's email from storage for resend functionality
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          setEmail(data.session.user.email);
        }
        setVerificationStatus("error");
        return;
      }
      
      try {
        // For Supabase, the token should be automatically handled by the URL
        // We just need to check if the user is verified now
        
        // Refresh the session
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          throw new Error('Verification failed');
        }
        
        if (data.user?.email_confirmed_at) {
          setVerificationStatus("success");
        } else {
          setVerificationStatus("error");
        }
        
        if (data.user?.email) {
          setEmail(data.user.email);
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus("error");
      }
    };
    
    verifyEmail();
  }, [token]);
  
  const handleReturnHome = () => {
    // If there's a stored redirect path, use that
    const redirectPath = localStorage.getItem('redirectAfterVerification');
    if (redirectPath && verificationStatus === "success") {
      localStorage.removeItem('redirectAfterVerification');
      navigate(redirectPath);
    } else {
      navigate(verificationStatus === "success" ? "/login" : "/home");
    }
  };
  
  const handleResendVerification = async () => {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Verification email has been resent. Please check your inbox.");
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("Failed to resend verification email. Please try again.");
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {verificationStatus === "loading" && (
              <div className="rounded-full bg-primary/20 p-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            )}
            {verificationStatus === "success" && (
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
              </div>
            )}
            {verificationStatus === "error" && (
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-center">
            {verificationStatus === "loading" && "Verifying Email..."}
            {verificationStatus === "success" && "Email Verified"}
            {verificationStatus === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "loading" && "Please wait while we verify your email address."}
            {verificationStatus === "success" && "Your email has been verified successfully. You can now log in."}
            {verificationStatus === "error" && "We couldn't verify your email. The link may have expired or is invalid."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === "error" && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {email ? 
                  `If you believe this is an error, you can request a new verification email for ${email}.` :
                  "If you believe this is an error, you can request a new verification email."
                }
              </p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={handleResendVerification}
                disabled={!email}
              >
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleReturnHome}
          >
            {verificationStatus === "success" ? "Go to Login" : "Return to Home"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerification;
