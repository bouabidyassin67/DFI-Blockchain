
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Podcast, Youtube, Calendar, Clock, Users, Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/components/ui/sonner";

interface PodcastEpisode {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
  date: string;
  time: string;
  hosts: string[];
  isLive: boolean;
}

const LivePodcastPage = () => {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([
    {
      id: 1,
      title: "Mastering Web Development",
      description: "Join us as we talk with industry experts about the latest web development techniques and tools.",
      youtubeId: "dQw4w9WgXcQ", // Sample YouTube ID
      date: "June 15, 2025",
      time: "3:00 PM EST",
      hosts: ["Sarah Johnson", "Michael Chen"],
      isLive: true,
    },
    {
      id: 2,
      title: "Data Science Career Paths",
      description: "Explore various career opportunities in the field of data science with our expert guests.",
      youtubeId: "QH2-TGUlwu4", // Sample YouTube ID
      date: "June 22, 2025",
      time: "2:00 PM EST",
      hosts: ["David Williams", "Lisa Anderson"],
      isLive: false,
    },
    {
      id: 3,
      title: "AI in Education",
      description: "Discover how artificial intelligence is transforming the educational landscape.",
      youtubeId: "9bZkp7q19f0", // Sample YouTube ID
      date: "June 29, 2025",
      time: "4:00 PM EST",
      hosts: ["Robert Garcia", "Jennifer Lee"],
      isLive: false,
    },
  ]);

  const handleJoinLive = (podcastId: number) => {
    toast.success("Joining live podcast session");
    console.log(`Joining podcast ID: ${podcastId}`);
  };

  const handleSetReminder = (podcastId: number) => {
    toast.success("Reminder set for upcoming podcast");
    console.log(`Setting reminder for podcast ID: ${podcastId}`);
  };

  const handleWatchRecording = (podcastId: number) => {
    toast.success("Opening recorded podcast");
    console.log(`Watching recording of podcast ID: ${podcastId}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <Podcast className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Live Podcasts</h1>
              </div>
              
              <p className="text-muted-foreground">
                Join our educational podcast sessions live or watch recordings of past episodes.
              </p>

              {/* Currently Live Podcast */}
              {podcasts.filter(pod => pod.isLive).length > 0 && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <span className="animate-pulse h-3 w-3 rounded-full bg-red-500"></span>
                      <CardTitle>Live Now</CardTitle>
                    </div>
                    <CardDescription>Currently streaming</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {podcasts.filter(pod => pod.isLive).map(podcast => (
                      <div key={podcast.id} className="space-y-4">
                        <h2 className="text-2xl font-bold">{podcast.title}</h2>
                        <p>{podcast.description}</p>
                        
                        <div className="rounded-md overflow-hidden border">
                          <AspectRatio ratio={16 / 9}>
                            <iframe 
                              width="100%" 
                              height="100%" 
                              src={`https://www.youtube.com/embed/${podcast.youtubeId}?autoplay=0`}
                              title={podcast.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="object-cover"
                            ></iframe>
                          </AspectRatio>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{podcast.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{podcast.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{podcast.hosts.join(", ")}</span>
                          </div>
                        </div>
                        
                        <Button onClick={() => handleJoinLive(podcast.id)} className="w-full md:w-auto">
                          <Youtube className="mr-2 h-4 w-4" />
                          Join Live Session
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Podcasts */}
              <h2 className="text-2xl font-bold mt-8">Upcoming Episodes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts.filter(pod => !pod.isLive).map(podcast => (
                  <Card key={podcast.id}>
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={`https://img.youtube.com/vi/${podcast.youtubeId}/hqdefault.jpg`}
                        alt={podcast.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{podcast.title}</CardTitle>
                      <CardDescription>{podcast.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{podcast.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{podcast.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{podcast.hosts.join(", ")}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <Button variant="outline" onClick={() => handleSetReminder(podcast.id)}>
                          Set Reminder
                        </Button>
                        <Button variant="secondary" onClick={() => handleWatchRecording(podcast.id)}>
                          <Play className="mr-2 h-4 w-4" />
                          Watch Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LivePodcastPage;
