
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, ExternalLink, Lock, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Define Certificate interface
interface Certificate {
  id: number;
  user_id: string;
  title: string;
  issue_date: string;
  expiry: string;
  credential_id: string;
  image: string;
  description: string;
  issuer: string;
  skills: string[];
  hours: number;
  is_premium: boolean;
}

const Certificates = () => {
  const { user, isPremiumUser } = useAuth();
  const navigate = useNavigate();

  // Fetch certificates from Supabase
  const fetchCertificates = async (): Promise<Certificate[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  };

  // Use React Query to fetch certificates
  const { data: certificates, isLoading, error } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: fetchCertificates,
    enabled: !!user
  });

  const handleDownload = (id: number, title: string) => {
    // In a real app, this would trigger a download of the certificate PDF
    toast.success(`Downloading "${title}" certificate`);
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

  if (error) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto text-center">
              <h2 className="text-xl font-bold mb-2">Failed to load certificates</h2>
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
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Your Certificates</h1>
              </div>
              
              <p className="text-muted-foreground">
                View and manage all your earned certificates. You can download or share them with potential employers.
              </p>

              {!isPremiumUser && (
                <div className="bg-muted/50 border rounded-md p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Premium Feature</h3>
                    <p className="text-sm text-muted-foreground">
                      Some certificates are only available with a premium subscription or after purchasing specific courses.
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

              {certificates && certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate) => {
                    const isLocked = certificate.is_premium && !isPremiumUser;
                    
                    return (
                    <Card key={certificate.id} className={`overflow-hidden ${isLocked ? 'border-amber-500/30' : ''}`}>
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={certificate.image} 
                          alt={certificate.title} 
                          className={`w-full h-full object-cover object-center ${isLocked ? 'opacity-60' : ''}`}
                        />
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="bg-amber-500/80 p-2 rounded-full">
                              <Lock className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle>{certificate.title}</CardTitle>
                        <CardDescription>
                          {isLocked ? "Premium Certificate" : `Issued on ${certificate.issue_date}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isLocked ? (
                          <p className="text-sm text-muted-foreground">
                            This certificate is only available with a premium subscription.
                          </p>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Expires:</span>
                              <span>{certificate.expiry}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Credential ID:</span>
                              <span className="font-mono">{certificate.credential_id}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        {isLocked ? (
                          <Button 
                            className="w-full"
                            variant="outline"
                            onClick={() => navigate("/subscription")}
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Upgrade to Premium
                          </Button>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownload(certificate.id, certificate.title)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Link to={`/certificates/${certificate.id}`}>
                              <Button size="sm" variant="default">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </Link>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  )})}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete courses to earn certificates that will appear here
                  </p>
                  <Button onClick={() => navigate("/courses")}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Certificates;
