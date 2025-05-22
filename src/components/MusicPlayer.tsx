import React, { useEffect, useRef } from 'react';
import { useMusicPlayerStore } from '@/lib/store';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    loadTrack,
 setPlaybackState, // Assuming you add this action to your store
  } = useMusicPlayerStore();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null); // To store the YouTube player instance

  // Effect to control playback
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
 playerRef.current.playVideo();
      } else {
 playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, currentTrack?.embedUrl]);

  useEffect(() => {
    if (currentTrack?.embedUrl && iframeRef.current) {
      // Load the YouTube Iframe API if not already loaded
      if (!window.YT || !window.YT.Player) {
        const tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 const firstScriptTag = document.getElementsByTagName('script')[0];
 if (firstScriptTag && firstScriptTag.parentNode) {
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 } else {
 document.head.appendChild(tag); // Fallback if no scripts are present
 }

        window.onYouTubeIframeAPIReady = () => {
 createPlayer();
        };
      } else {
 createPlayer();
      }
    }

    function createPlayer() {
 playerRef.current = new window.YT.Player(iframeRef.current, {
 events: {
            'onStateChange': onPlayerStateChange,
 },
      });
    }

    function onPlayerStateChange(event: any) {
      if (event.data === window.YT.PlayerState.PLAYING) {
 setPlaybackState(true);
      } else {
 setPlaybackState(false);
      }
    }

    // Cleanup function
 return () => {
      if (playerRef.current) {
 playerRef.current.destroy();
 playerRef.current = null;
      }
 window.onYouTubeIframeAPIReady = undefined; // Clean up the global function
 };
  }, [currentTrack?.embedUrl]); // Re-run when the embed URL changes

  if (!currentTrack?.embedUrl) {
    return null;
  }

  return (
    <div id="music-player-container" className="fixed bottom-0 left-0 w-1 h-1 overflow-hidden pointer-events-none">
      {/* We hide the iframe completely as it's controlled by the global state
          and the UI is in the popup. Using w-1 h-1 makes it technically visible
          for the YouTube API but practically hidden. */}
      <iframe
        ref={iframeRef}
 id="youtube-iframe" // Add an ID for the API
 width="1" // Make it minimally sized
 height="1" // Make it minimally sized
        src={currentTrack.embedUrl}
        title="YouTube music player (hidden)"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="border-0"
      ></iframe>
    </div>
  );
};

export default MusicPlayer;
