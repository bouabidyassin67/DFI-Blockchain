
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { RecentLearning } from "@/components/dashboard/recent-learning";
import { EventCalendar } from "@/components/dashboard/calendar";
import { ProgressStats } from "@/components/dashboard/progress-stats";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { useSidebarStore } from "@/lib/store";

const Dashboard = () => {
  const { isOpen, toggle } = useSidebarStore();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                <p className="text-muted-foreground mt-1">
                  What do you want to learn today?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecentLearning />
                <EventCalendar />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProgressStats />
                <UpcomingEvents />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
