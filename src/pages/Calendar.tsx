
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

const Calendar = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your schedule
            </p>
            <div className="mt-8">
              <div className="bg-card border border-border rounded-xl h-96 flex items-center justify-center">
                <p className="text-muted-foreground">Calendar view coming soon</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
