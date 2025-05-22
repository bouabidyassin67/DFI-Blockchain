
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    type: "live-session",
    date: "May 20 • 2:00 PM",
    instructor: "Jane Smith",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    type: "webinar",
    date: "May 22 • 11:00 AM",
    instructor: "Michael Johnson",
  },
  {
    id: 3,
    title: "UX/UI Design Principles",
    type: "new-course",
    date: "May 22 • 3:30 PM",
    instructor: "Sarah Williams",
  },
];

export function UpcomingEvents() {
  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg border">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  {event.type === "live-session" && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                      Live Session
                    </Badge>
                  )}
                  {event.type === "webinar" && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                      Webinar
                    </Badge>
                  )}
                  {event.type === "new-course" && (
                    <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400">
                      New Course
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{event.date}</div>
                <div className="text-sm">{event.instructor}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View all events</Button>
      </CardFooter>
    </Card>
  );
}
