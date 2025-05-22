import React, { useState, useEffect } from 'react';
import {
  Music,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ExternalLink,
  Youtube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useMusicPlayerStore } from '@/lib/store';

const getEmbedUrl = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const MusicPlayerPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const { currentTrack, isPlaying, loadTrack, togglePlayPause } =
    useMusicPlayerStore();

  useEffect(() => {
    const savedHistory = localStorage.getItem('music-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse music history', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('music-history', JSON.stringify(history));
  }, [history]);

  const handleYoutubeLink = () => {
    if (!youtubeUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    const embedUrl = getEmbedUrl(youtubeUrl);

    if (!embedUrl) {
      toast.error('Invalid YouTube URL format.');
      return;
    }

    try {
      loadTrack(youtubeUrl);

      if (!history.includes(youtubeUrl)) {
        setHistory((prev) => [youtubeUrl, ...prev.slice(0, 4)]);
      }

      toast.success('Now playing from YouTube');
    } catch (error) {
      console.error('Invalid YouTube URL', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

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

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-20 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="fixed bottom-20 right-20 w-72 h-96 bg-card border border-border rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in duration-300 slide-in-from-bottom-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card text-card-foreground">
            <h3 className="text-md font-semibold flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-500" />
              Music Player
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClosePopup}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
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

            <div className="flex items-center justify-between">
              {currentTrack && currentTrack.embedUrl ? (
                <div className="text-sm text-primary truncate max-w-[50%]">
                  Now Playing
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No track playing
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!currentTrack || !currentTrack.embedUrl}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                  disabled={!currentTrack || !currentTrack.embedUrl}
                  className="h-10 w-10 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!currentTrack || !currentTrack.embedUrl}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">History</h4>
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
        </div>
      )}

      <Button
        className="rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Music className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MusicPlayerPopup;
