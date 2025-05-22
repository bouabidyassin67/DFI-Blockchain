
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Globe, Users, Check } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header Section */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">DB</span>
          </div>
          <span className="ml-2 font-bold text-xl">DFI Blockchain</span>
        </div>
        <div className="space-x-2">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Welcome to DFI Blockchain Learning Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Enhance your knowledge and skills with our comprehensive courses
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Courses</h3>
                <p className="text-muted-foreground">Access detailed lessons on blockchain technology, DeFi applications, and more.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Community</h3>
                <p className="text-muted-foreground">Join a worldwide network of blockchain enthusiasts and professionals.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Certifications</h3>
                <p className="text-muted-foreground">Receive verifiable certificates upon completion of courses.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-muted">
                <p className="italic mb-4">"This platform completely transformed my understanding of blockchain. The courses are well-structured and easy to follow."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-muted-foreground">Blockchain Developer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-muted">
                <p className="italic mb-4">"As someone new to the crypto world, I found these courses incredibly accessible. The community support is amazing!"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">AS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Alice Smith</p>
                    <p className="text-sm text-muted-foreground">Financial Analyst</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Blockchain Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Join thousands of students already learning on our platform and take your first step into the world of blockchain technology.</p>
            <Button asChild size="lg" className="text-lg">
              <Link to="/register">Start Learning Today</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <span className="ml-2 font-bold">DFI Blockchain</span>
            </div>
            <div className="flex gap-6">
              <Link to="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
              <Link to="/register" className="text-muted-foreground hover:text-foreground">Register</Link>
              <Link to="/courses" className="text-muted-foreground hover:text-foreground">Courses</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} DFI Blockchain Learning Platform. All rights reserved.</p>
          </div>
          
          {/* Admin setup - only visible at the bottom of the page */}
          <div className="mt-8 text-center">
            <Button asChild variant="link" className="text-xs text-muted-foreground/50 hover:text-muted-foreground">
              <Link to="/admin-setup">Admin Setup</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
