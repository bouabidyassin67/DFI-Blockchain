
import { Link, useLocation } from "react-router-dom";
import { 
  Award, 
  Book, 
  BarChart2, 
  Calendar, 
  BrainCircuit, 
  CreditCard, 
  Gift, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  User,
  TestTube,
  Podcast,
  FileText,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebarStore } from "@/lib/store";

export function Sidebar() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isOpen = useSidebarStore((state) => state.isOpen);
  
  // Student navigation items
  const studentItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      href: "/courses",
      icon: Book,
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: Calendar,
    },
    {
      title: "IQ Tests",
      href: "/iq-tests",
      icon: BrainCircuit,
    },
    {
      title: "Quizzes",
      href: "/quizzes",
      icon: TestTube,
    },
    {
      title: "Live Podcast",
      href: "/live-podcast",
      icon: Podcast,
    },
    {
      title: "Certificates",
      href: "/certificates",
      icon: Award,
    },
    {
      title: "Progress Tracking",
      href: "/progress",
      icon: TrendingUp,
    },
    {
      title: "Communication",
      href: "/communication",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Payment History",
      href: "/payments",
      icon: CreditCard,
    },
    {
      title: "Gamification",
      href: "/gamification",
      icon: Gift,
    },
  ];

  // Admin-only navigation items
  const adminItems = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Course Management",
      href: "/admin/courses",
      icon: Book,
    },
    {
      title: "IQ Test Management",
      href: "/admin/iq-test-management",
      icon: BrainCircuit,
    },
    {
      title: "Enrollment & Access",
      href: "/admin/enrollments",
      icon: Users,
    },
    {
      title: "Calendar Management",
      href: "/admin/calendar",
      icon: Calendar,
    },
    {
      title: "Payments & Finance",
      href: "/admin/finance",
      icon: CreditCard,
    },
    {
      title: "Content Management",
      href: "/admin/content",
      icon: FileText,
    },
    {
      title: "Reports & Analytics",
      href: "/admin/reports",
      icon: BarChart2,
    },
  ];

  return (
    <div 
      className={cn(
        "h-screen sticky top-0 bg-sidebar border-r border-border shrink-0 overflow-y-auto transition-all duration-300",
        isOpen ? "w-16 md:w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full py-4">
        <div className={cn(
          "flex justify-center mb-8", 
          isOpen && "md:justify-start md:px-6"
        )}>
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            {isOpen && (
              <span className="hidden md:block ml-2 text-xl font-semibold">DFI Blockchain</span>
            )}
          </Link>
        </div>
        
        <div className="flex-1 px-2 md:px-4 space-y-1">
          {/* Student Navigation */}
          {studentItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center py-2 px-2 md:px-4 rounded-md transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
                !isOpen ? "justify-center" : "",
                location.pathname === item.href 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0 text-white" style={{ opacity: 1 }} />
              {isOpen && <span className="hidden md:block ml-3 text-white">{item.title}</span>}
            </Link>
          ))}

          {/* Show admin navigation items if user is admin */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-700">
              <div className="px-2 mb-2">
                {isOpen && <span className="hidden md:block text-xs uppercase text-gray-400 font-semibold">Admin Area</span>}
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center py-2 px-2 md:px-4 rounded-md transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
                    !isOpen ? "justify-center" : "",
                    location.pathname === item.href || location.pathname.startsWith(item.href + '/') 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0 text-white" style={{ opacity: 1 }} />
                  {isOpen && <span className="hidden md:block ml-3 text-white">{item.title}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-2 md:px-4 mt-auto pt-2 border-t border-border">
          <Link
            to="/settings"
            className={cn(
              "flex items-center py-2 px-2 md:px-4 rounded-md transition-colors text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              !isOpen ? "justify-center" : "",
              location.pathname === "/settings" 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-sidebar-foreground"
            )}
          >
            <Settings className="h-5 w-5 text-white" style={{ opacity: 1 }} />
            {isOpen && <span className="hidden md:block ml-3">Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
