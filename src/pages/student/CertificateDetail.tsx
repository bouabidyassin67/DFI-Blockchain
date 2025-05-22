
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, ArrowLeft, Calendar, Trophy } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const CertificateDetail = () => {
  const { id } = useParams();
  
  // In a real app, you would fetch the certificate data based on the ID
  // This is simulated certificate data
  const certificate = {
    id: Number(id),
    title: "Introduction to Computer Science",
    issueDate: "March 15, 2024",
    expiry: "No expiry",
    credentialId: "CS101-2024-78945",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=600",
    description: "This certificate is awarded for successfully completing the Introduction to Computer Science course with a grade of 'A'. The course covers fundamental concepts in computer science including algorithms, data structures, and basic programming principles.",
    issuer: "DFI Blockchain Academy",
    skills: ["Programming Basics", "Algorithms", "Computer Architecture", "Problem Solving"],
    hours: 45
  };

  const handleDownload = () => {
    toast.success(`Downloading "${certificate.title}" certificate`);
  };

  const handleShare = () => {
    toast.success(`Share dialog opened for "${certificate.title}" certificate`);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-4xl">
            <Link to="/certificates" className="flex items-center text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Certificates
            </Link>
            
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Certificate Details</h1>
              </div>
              
              <Card className="overflow-hidden">
                <div className="h-64 overflow-hidden bg-black">
                  <img 
                    src={certificate.image} 
                    alt={certificate.title} 
                    className="w-full h-full object-cover object-center opacity-80"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center p-6">
                    <Award className="h-16 w-16 text-primary mb-4" />
                    <h2 className="text-3xl font-bold text-white">{certificate.title}</h2>
                    <p className="text-gray-200 mt-2">Awarded by {certificate.issuer}</p>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl">{certificate.title}</CardTitle>
                  <CardDescription>Credential ID: {certificate.credentialId}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Certificate Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Issue Date</p>
                              <p className="text-sm text-muted-foreground">{certificate.issueDate}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Trophy className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Course Duration</p>
                              <p className="text-sm text-muted-foreground">{certificate.hours} learning hours</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-2">Description</h3>
                        <p className="text-muted-foreground">{certificate.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Skills Earned</h3>
                        <div className="flex flex-wrap gap-2">
                          {certificate.skills.map((skill, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-2">Verification</h3>
                        <p className="text-muted-foreground">
                          This certificate can be verified online using the credential ID. Employers can validate this
                          certificate through our verification portal.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Certificate
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CertificateDetail;
