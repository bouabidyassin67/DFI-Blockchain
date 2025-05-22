
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  BrainCircuit, 
  FileQuestion, 
  Music, 
  Settings,
  HelpCircle 
} from 'lucide-react';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  active = false 
}) => {
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
        active 
          ? "bg-lms-purple text-white" 
          : "text-lms-text-light hover:bg-lms-card"
      )}
    >
      <Icon className="h-5 w-5" />
      {isOpen && <span>{label}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const pathname = window.location.pathname;
  
  const routes = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Courses', href: '/courses' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: BrainCircuit, label: 'IQ Tests', href: '/iq-test' },
    { icon: FileQuestion, label: 'Quizzes', href: '/quiz' },
    { icon: Music, label: 'Music', href: '/music' },
    { icon: HelpCircle, label: 'Support', href: '/support' },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-lms-darker border-r border-lms-card transition-all duration-200",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center gap-2 p-4 h-16">
        <div className="h-8 w-8 rounded-full bg-lms-purple flex items-center justify-center">
          <span className="text-white font-medium">LMS</span>
        </div>
        {isOpen && <span className="font-bold text-white">LMS Platform</span>}
      </div>
      
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-hidden">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            active={pathname === route.href}
          />
        ))}
      </div>
      
      {/* Settings button at the bottom that's always visible */}
      <div className="py-4 px-2 border-t border-lms-card">
        <Link
          to="/settings"
          className={cn(
            "flex items-center justify-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
            pathname === '/settings' 
              ? "bg-lms-purple text-white" 
              : "text-white hover:bg-lms-card"
          )}
        >
          <Settings className="h-5 w-5 text-white" style={{ opacity: 1 }} />
          {isOpen && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
