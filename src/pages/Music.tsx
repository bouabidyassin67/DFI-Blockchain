
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { MusicPlayer } from "@/components/dashboard/music-player";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music as MusicIcon, Youtube } from "lucide-react";

const Music = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">DFI Blockchain Music</h1>
                <p className="text-muted-foreground mt-1">
                  Listen to your favorite tracks while exploring DFI Blockchain
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MusicPlayer />

                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-500" />
                      How to use
                    </CardTitle>
                    <CardDescription>Instructions for using the music player</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold">1</span>
                        </div>
                        <div>
                          <p>Copy a YouTube video link</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold">2</span>
                        </div>
                        <div>
                          <p>Paste it into the input field</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold">3</span>
                        </div>
                        <div>
                          <p>Press the button or Enter key to play the music</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center p-6">
                        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                          <MusicIcon className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Music;
