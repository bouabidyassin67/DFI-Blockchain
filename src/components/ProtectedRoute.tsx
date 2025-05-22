
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  premiumOnly?: boolean;
  requiresEmailVerification?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false,
  premiumOnly = false,
  requiresEmailVerification = false
}: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading, isPremiumUser } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const verifyPermissions = async () => {
      // Don't verify if auth is still loading
      if (isLoading) return;

      try {
        let canAccess = !!user;
        
        // Check if user's email is verified
        if (user) {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            throw error;
          }
          
          setIsEmailVerified(data.user.email_confirmed_at !== null);
        }
        
        if (adminOnly) {
          canAccess = canAccess && isAdmin;
        }
        
        if (premiumOnly) {
          canAccess = canAccess && isPremiumUser;
        }
        
        setHasPermission(canAccess);
      } catch (error) {
        console.error('Permission verification error:', error);
        setHasPermission(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyPermissions();
  }, [isLoading, user, isAdmin, isPremiumUser, adminOnly, premiumOnly, location.pathname]);

  // Show loading state if auth is being checked
  if (isLoading || isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  if (!user) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  // If email verification is required but not verified
  if (requiresEmailVerification && !isEmailVerified) {
    // Store the attempted URL to redirect back after verification
    localStorage.setItem('redirectAfterVerification', location.pathname);
    return <Navigate to="/email-verification" replace />;
  }

  // Redirect to dashboard if admin-only and user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Redirect to subscription page if premium-only and user is not premium
  if (premiumOnly && !isPremiumUser) {
    return <Navigate to="/subscription" replace state={{ from: location }} />;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
