import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Clock } from 'lucide-react';

const Dashboard = () => {
  // Dummy data for recent learning
  const recentCourse = {
    title: "Freelance Mastery",
    description: "Freelance Mastery is a comprehensive, step-by-step course designed to equip aspiring and existing freelancers with the essential tools, strategies, and insights needed to thrive in today's competitive gig economy.",
    progress: 15,
    totalLessons: 18,
    completedLessons: 1
  };

  // Dummy data for calendar events
  const currentMonth = "May";
  const calendarData = {
    days: Array.from({ length: 31 }, (_, i) => i + 1),
    events: [
      { day: 3, type: 'live' },
      { day: 9, type: 'webinar' },
      { day: 22, type: 'course' },
    ]
  };

  // Dummy data for upcoming events
  const upcomingEvents = [
    { 
      title: "JavaScript Fundamentals",
      date: "May 20",
      time: "2:00 PM",
      instructor: "Jane Smith",
      type: "live"
    },
    { 
      title: "Advanced React Patterns",
      date: "May 22",
      time: "11:00 AM",
      instructor: "John Doe",
      type: "webinar"
    }
  ];

  // Dummy data for progress statistics
  const progressStats = {
    lessonsInProgress: 1,
    upcomingLessons: 2,
    lessonsComplete: 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-gray-400 mt-1">What do you want to learn today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Learning Section */}
        <Card className="bg-lms-card border-lms-card">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{recentCourse.title}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-3">{recentCourse.description}</p>
              </div>
              
              <div className="bg-lms-darker rounded-lg p-4 flex items-center justify-between">
                <div className="text-lms-purple text-center">
                  <span className="text-xl font-bold">{recentCourse.completedLessons}/{recentCourse.totalLessons}</span>
                  <p className="text-xs">Lessons</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-500">Entry level</span>
                  <span>Course finished: {recentCourse.progress}%</span>
                </div>
                <Progress value={recentCourse.progress} className="h-1.5 bg-lms-darker" />
              </div>
              
              <button className="bg-lms-darker hover:bg-gray-800 text-white py-2 px-4 rounded-lg w-full text-sm transition">
                Go to course
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Event Calendar Section */}
        <Card className="bg-lms-card border-lms-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Event Calendar</CardTitle>
            <div className="flex items-center">
              <span>{currentMonth}</span>
              <button className="ml-2 text-gray-400">
                <CalendarIcon className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <div className="text-gray-500">Su</div>
              <div className="text-gray-500">Mo</div>
              <div className="text-gray-500">Tu</div>
              <div className="text-gray-500">We</div>
              <div className="text-gray-500">Th</div>
              <div className="text-gray-500">Fr</div>
              <div className="text-gray-500">Sa</div>
              
              {calendarData.days.map((day) => {
                const event = calendarData.events.find(e => e.day === day);
                const eventColor = event 
                  ? event.type === 'live' 
                    ? 'bg-purple-500' 
                    : event.type === 'webinar' 
                      ? 'bg-amber-500' 
                      : 'bg-blue-500'
                  : '';
                
                return (
                  <div 
                    key={day} 
                    className={`aspect-square flex items-center justify-center ${
                      event ? 'relative' : ''
                    }`}
                  >
                    {day}
                    {event && (
                      <span className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${eventColor}`}></span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-purple-500 mr-1"></span>
                <span>Live Session</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                <span>New Course</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                <span>Webinar</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-gray-500 mr-1"></span>
                <span>No event</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Statistics Section */}
        <Card className="bg-lms-card border-lms-card">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Progress Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-4 border-lms-purple">
                  <span className="text-2xl font-bold">{progressStats.lessonsInProgress}</span>
                </div>
                <p className="text-sm text-gray-400">Lessons in progress</p>
              </div>
              
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-4 border-gray-700">
                  <span className="text-2xl font-bold">{progressStats.upcomingLessons}</span>
                </div>
                <p className="text-sm text-gray-400">Upcoming lessons</p>
              </div>
              
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-4 border-gray-700">
                  <span className="text-2xl font-bold">{progressStats.lessonsComplete}</span>
                </div>
                <p className="text-sm text-gray-400">Lessons complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Section */}
        <Card className="bg-lms-card border-lms-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
            <div className="flex gap-1">
              <button className="text-gray-400 rounded-full p-1 hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button className="text-gray-400 rounded-full p-1 hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-lms-darker rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{event.instructor}</p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.type === 'live' 
                        ? 'bg-purple-900/50 text-purple-300' 
                        : 'bg-amber-900/50 text-amber-300'
                    }`}>
                      {event.type === 'live' ? 'Live Session' : 'Webinar'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
