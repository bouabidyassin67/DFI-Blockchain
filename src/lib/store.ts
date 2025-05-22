import { create } from 'zustand';

type SidebarState = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
}));

type UserState = {
  user: {
    name: string;
    avatar: string;
    role: string;
  } | null;
  setUser: (user: UserState['user']) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: {
    name: 'Jane Smith',
    avatar: 'US',
    role: 'Student',
  },
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

type MusicPlayerState = {
  player: YT.Player | null;
  setPlayer: (player: YT.Player) => void;
  currentTrack: {
    youtubeUrl: string;
    embedUrl: string;
  } | null;
  isPlaying: boolean;
  loadTrack: (youtubeUrl: string) => boolean;
  togglePlayPause: () => void;
  clearTrack: () => void;
  setPlaybackState: (playing: boolean) => void; // ✅ Added
};

export const useMusicPlayerStore = create<MusicPlayerState>((set, get) => ({
  player: null,
  setPlayer: (player) => set({ player }),
  currentTrack: null,
  isPlaying: false,
  loadTrack: (youtubeUrl) => {
    const videoIdMatch = youtubeUrl.match(
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!videoIdMatch) return false;

    const videoId = videoIdMatch[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;

    set({
      currentTrack: { youtubeUrl, embedUrl },
      isPlaying: true,
    });

    const player = get().player;
    if (player) player.loadVideoById(videoId);

    return true;
  },
  togglePlayPause: () => {
    const player = get().player;
    if (player) {
      const playerState = player.getPlayerState();
      if (
        playerState === YT.PlayerState.PLAYING ||
        playerState === YT.PlayerState.BUFFERING
      ) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  clearTrack: () => {
    const player = get().player;
    if (player) player.stopVideo();
  },
  setPlaybackState: (playing) => set({ isPlaying: playing }), // ✅ Added
}));
