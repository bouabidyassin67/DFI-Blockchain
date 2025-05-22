
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createAdminUser } from "@/lib/admin-setup";
import { toast } from "@/components/ui/sonner";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    credentials?: { email: string; password: string };
    error?: any;
  }>({});

  const handleCreateAdmin = async () => {
    setIsLoading(true);
    try {
      const setupResult = await createAdminUser();
      setResult(setupResult);
      
      if (setupResult.success) {
        toast.success(setupResult.message || "Admin user created successfully!");
      } else {
        toast.error("Failed to create admin user");
      }
    } catch (error) {
      console.error("Error in admin setup:", error);
      setResult({ success: false, error });
      toast.error("Unexpected error during admin setup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Admin Setup</h2>
        <p className="text-muted-foreground">
          Create an admin user to access the administration features.
        </p>
      </div>

      <Button 
        onClick={handleCreateAdmin} 
        disabled={isLoading || result.success}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Admin User...
          </>
        ) : result.success ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" /> Admin Created
          </>
        ) : (
          "Create Admin User"
        )}
      </Button>

      {result.success && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Admin user created successfully!</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              <p>Use these credentials to log in as an admin:</p>
              <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-3">
                <p><strong>Email:</strong> {result.credentials?.email}</p>
                <p><strong>Password:</strong> {result.credentials?.password}</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {result.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error creating admin user</AlertTitle>
          <AlertDescription>
            {result.error.message || "An unexpected error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminSetup;
