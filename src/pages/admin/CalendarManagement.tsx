
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Plus, Clock, Users, Trash } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: string;
  type: string;
  attendees: number;
}

const CalendarManagement = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    duration: "1 hour",
    type: "class",
    attendees: 0
  });
  
  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Introduction to React",
      description: "Learn the basics of React framework and component-based architecture.",
      date: new Date(),
      time: "10:00",
      duration: "1 hour",
      type: "class",
      attendees: 24
    },
    {
      id: "2",
      title: "Python for Data Science",
      description: "Explore how Python is used in data science applications.",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "14:00",
      duration: "2 hours",
      type: "workshop",
      attendees: 18
    },
    {
      id: "3",
      title: "End of Term Exam",
      description: "Final examination for the current semester.",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: "09:00",
      duration: "3 hours",
      type: "exam",
      attendees: 150
    }
  ]);
  
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const event: Event = {
      id: Math.random().toString(36).substring(2, 9),
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: newEvent.date || new Date(),
      time: newEvent.time || "",
      duration: newEvent.duration || "1 hour",
      type: newEvent.type || "class",
      attendees: newEvent.attendees || 0
    };
    
    setEvents([...events, event]);
    toast.success("Event created successfully");
    setIsDialogOpen(false);
    resetNewEvent();
  };
  
  const resetNewEvent = () => {
    setNewEvent({
      title: "",
      description: "",
      date: new Date(),
      time: "09:00",
      duration: "1 hour",
      type: "class",
      attendees: 0
    });
  };
  
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast.success("Event deleted successfully");
  };
  
  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    event.date.toDateString() === date.toDateString()
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <CalendarIcon className="h-6 w-6 text-primary" /> 
                  Calendar Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Schedule and manage events, classes, and exams
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Calendar Event</DialogTitle>
                    <DialogDescription>
                      Add a new event to the academic calendar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Event Title</label>
                      <Input 
                        value={newEvent.title} 
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Enter event title"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <div className="border rounded-md p-2">
                          <Calendar 
                            mode="single" 
                            selected={newEvent.date} 
                            onSelect={(date) => setNewEvent({...newEvent, date: date || new Date()})}
                            className="p-0"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time</label>
                          <Input 
                            type="time" 
                            value={newEvent.time} 
                            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Duration</label>
                          <Select 
                            value={newEvent.duration} 
                            onValueChange={(value) => setNewEvent({...newEvent, duration: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30 minutes">30 minutes</SelectItem>
                              <SelectItem value="1 hour">1 hour</SelectItem>
                              <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                              <SelectItem value="2 hours">2 hours</SelectItem>
                              <SelectItem value="3 hours">3 hours</SelectItem>
                              <SelectItem value="Full day">Full day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Event Type</label>
                          <Select 
                            value={newEvent.type} 
                            onValueChange={(value) => setNewEvent({...newEvent, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="class">Class</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                              <SelectItem value="exam">Exam</SelectItem>
                              <SelectItem value="holiday">Holiday</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={newEvent.description} 
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Enter event description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expected Attendees</label>
                      <Input 
                        type="number" 
                        value={newEvent.attendees?.toString()} 
                        onChange={(e) => setNewEvent({...newEvent, attendees: parseInt(e.target.value) || 0})}
                        min="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      resetNewEvent();
                      setIsDialogOpen(false);
                    }}>Cancel</Button>
                    <Button onClick={handleCreateEvent}>Create Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => setDate(newDate || new Date())}
                    className="rounded-md border shadow"
                  />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Events for {format(date, "MMMM d, yyyy")}</CardTitle>
                  <CardDescription>
                    {selectedDateEvents.length} events scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEvents.map((event) => (
                        <div key={event.id} className="border rounded-md p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{event.time} · {event.duration}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>{event.attendees} attendees</span>
                                </div>
                              </div>
                              {event.description && (
                                <p className="mt-2 text-sm">{event.description}</p>
                              )}
                            </div>
                            <div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No events for this date</h3>
                      <p className="text-muted-foreground mb-4">
                        Create an event to see it here.
                      </p>
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Event
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarManagement;
