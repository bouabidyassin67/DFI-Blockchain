
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CalendarDay = {
  day: number;
  isCurrentMonth: boolean;
  events: string[];
};

type CalendarData = {
  month: string;
  days: CalendarDay[][];
};

const CALENDAR_DATA: Record<string, CalendarData> = {
  "May": {
    month: "May",
    days: [
      [
        { day: 28, isCurrentMonth: false, events: [] },
        { day: 29, isCurrentMonth: false, events: [] },
        { day: 30, isCurrentMonth: false, events: [] },
        { day: 31, isCurrentMonth: false, events: [] },
        { day: 1, isCurrentMonth: true, events: [] },
        { day: 2, isCurrentMonth: true, events: [] },
        { day: 3, isCurrentMonth: true, events: ["webinar"] },
      ],
      [
        { day: 4, isCurrentMonth: true, events: [] },
        { day: 5, isCurrentMonth: true, events: [] },
        { day: 6, isCurrentMonth: true, events: [] },
        { day: 7, isCurrentMonth: true, events: [] },
        { day: 8, isCurrentMonth: true, events: [] },
        { day: 9, isCurrentMonth: true, events: ["new-course"] },
        { day: 10, isCurrentMonth: true, events: [] },
      ],
      [
        { day: 11, isCurrentMonth: true, events: [] },
        { day: 12, isCurrentMonth: true, events: [] },
        { day: 13, isCurrentMonth: true, events: [] },
        { day: 14, isCurrentMonth: true, events: ["live-session"] },
        { day: 15, isCurrentMonth: true, events: [] },
        { day: 16, isCurrentMonth: true, events: [] },
        { day: 17, isCurrentMonth: true, events: [] },
      ],
      [
        { day: 18, isCurrentMonth: true, events: [] },
        { day: 19, isCurrentMonth: true, events: [] },
        { day: 20, isCurrentMonth: true, events: ["live-session"] },
        { day: 21, isCurrentMonth: true, events: [] },
        { day: 22, isCurrentMonth: true, events: ["webinar", "new-course"] },
        { day: 23, isCurrentMonth: true, events: [] },
        { day: 24, isCurrentMonth: true, events: [] },
      ],
      [
        { day: 25, isCurrentMonth: true, events: [] },
        { day: 26, isCurrentMonth: true, events: [] },
        { day: 27, isCurrentMonth: true, events: [] },
        { day: 28, isCurrentMonth: true, events: ["live-session"] },
        { day: 29, isCurrentMonth: true, events: [] },
        { day: 30, isCurrentMonth: true, events: [] },
        { day: 31, isCurrentMonth: true, events: [] },
      ]
    ]
  }
};

export function EventCalendar() {
  const [month, setMonth] = useState("May");
  const calendarData = CALENDAR_DATA[month];
  
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Event Calendar</CardTitle>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={month} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="May">May</SelectItem>
            <SelectItem value="June">June</SelectItem>
            <SelectItem value="July">July</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
          
          {calendarData.days.flat().map((day, i) => (
            <Button
              key={i}
              variant="ghost"
              className={`
                h-10 w-10 p-0 text-xs relative
                ${!day.isCurrentMonth ? "text-muted-foreground opacity-50" : ""}
                ${day.events.length > 0 ? "font-semibold" : ""}
              `}
            >
              {day.day}
              {day.events.includes("live-session") && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-500" />
              )}
              {day.events.includes("new-course") && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 translate-x-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
              {day.events.includes("webinar") && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 -translate-x-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-xs">Live Session</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs">New Course</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs">Webinar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-muted-foreground" />
            <span className="text-xs">No event</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
