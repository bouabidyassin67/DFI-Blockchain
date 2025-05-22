
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const audioRef = useRef<HTMLIFrameElement>(null);
  
  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('music-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse music history", e);
      }
    }
  }, []);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('music-history', JSON.stringify(history));
  }, [history]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // In a real implementation, we would use the YouTube iframe API to control playback
    // For now, this is just toggling the state
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleYoutubeLink = () => {
    if (!youtubeUrl) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    
    try {
      // Extract video ID from YouTube URL
      const videoId = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
      
      if (videoId) {
        const newEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        setEmbedUrl(newEmbedUrl);
        setIsPlaying(true);
        
        // Add to history if not already there
        if (!history.includes(youtubeUrl)) {
          setHistory(prev => [youtubeUrl, ...prev.slice(0, 4)]);
        }
        
        toast.success("Now playing from YouTube");
      } else {
        toast.error("Invalid YouTube URL. Please enter a valid YouTube video link.");
      }
    } catch (error) {
      console.error("Invalid YouTube URL", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  // Handle pressing Enter in the input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleYoutubeLink();
    }
  };
  
  const playFromHistory = (url: string) => {
    setYoutubeUrl(url);
    setTimeout(() => {
      handleYoutubeLink();
    }, 100);
  };
  
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Paste YouTube URL here" 
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleYoutubeLink} size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          {embedUrl && (
            <div className="w-full rounded-md overflow-hidden bg-black/10">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  ref={audioRef}
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  title="YouTube music player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                ></iframe>
              </AspectRatio>
            </div>
          )}
          
          {!embedUrl && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                No track playing
              </div>
              <div className="flex items-center space-x-2">
                <button className="music-player-button" disabled>
                  <SkipBack className="h-4 w-4" />
                </button>
                <button 
                  className="music-player-button h-10 w-10"
                  onClick={togglePlayPause}
                  disabled={!embedUrl}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button className="music-player-button" disabled>
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
              <button className="music-player-button" disabled={!embedUrl}>
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {!embedUrl && (
            <div className="space-y-2">
              <div className="music-player-progress">
                <div className="music-player-progress-bar" style={{ width: '0%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0:00</span>
                <span>0:00</span>
              </div>
            </div>
          )}
          
          {/* Recently played tracks */}
          {history.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recently played</h4>
              <div className="space-y-2">
                {history.map((url, index) => (
                  <div 
                    key={index} 
                    className="text-xs truncate cursor-pointer hover:text-primary flex items-center gap-1"
                    onClick={() => playFromHistory(url)}
                  >
                    <Youtube className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{url}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
