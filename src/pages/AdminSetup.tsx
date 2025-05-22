
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import AdminSetup from "@/components/AdminSetup";
import { setupDatabaseTables } from "@/lib/supabase";

const AdminSetupPage = () => {
  const [isDbSetup, setIsDbSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
        // Make sure database tables are set up
        const result = await setupDatabaseTables();
        setIsDbSetup(result.success || false);
        
        if (result.success) {
          console.log("Database tables set up successfully");
        } else {
          console.error("Database setup error:", result.error);
        }
      } catch (error) {
        console.error("Database setup error:", error);
        setIsDbSetup(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeDatabase();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white">
            <GraduationCap className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold">DFI Blockchain Admin Setup</CardTitle>
          <CardDescription>Initialize your admin account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Checking database setup...</p>
            </div>
          ) : isDbSetup ? (
            <AdminSetup />
          ) : (
            <div className="text-center space-y-4">
              <p className="text-destructive">Database not properly configured.</p>
              <p className="text-sm text-muted-foreground">There was an issue connecting to the database. Please try again later.</p>
              <Button asChild variant="outline">
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link to="/login">Return to Login Page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetupPage;
