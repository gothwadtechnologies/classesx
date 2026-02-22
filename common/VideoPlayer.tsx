
import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

// Declaring the YouTube YT object on the window for TypeScript support
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface VideoPlayerProps {
  url?: string;
  title?: string;
}

/**
 * A robust YouTube Video Player component that handles the YouTube IFrame API.
 * This fixes the default export issue and provides actual playback functionality.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  // Extract YouTube ID from various URL formats (standard, short, embed)
  useEffect(() => {
    if (!url) {
      setVideoId(null);
      return;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    
    if (id) {
      setVideoId(id);
      setError(null);
    } else {
      setVideoId(null);
      setError("Invalid YouTube URL provided");
    }
  }, [url]);

  // Load YouTube IFrame API and initialize player
  useEffect(() => {
    if (!videoId) return;

    const loadAPI = () => {
      // Check if API is already loaded or script exists
      if (!window.YT) {
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName('script')[0];
          if (firstScriptTag && firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          }
        }

        window.onYouTubeIframeAPIReady = () => {
          createPlayer();
        };
      } else {
        createPlayer();
      }
    };

    const createPlayer = () => {
      // Destroy previous instance if it exists to prevent memory leaks and container conflicts
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }

      // Check if container exists before creating player
      const containerId = `youtube-player-${videoId}`;
      const container = document.getElementById(containerId);
      if (!container) return;

      playerRef.current = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
          autoplay: 0,
        },
        events: {
          onError: () => {
            setError("Could not load the video. It might be restricted or private.");
          }
        },
      });
    };

    loadAPI();

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {}
      }
    };
  }, [videoId]);

  return (
    <div className="w-full aspect-video bg-slate-900 relative group overflow-hidden shadow-2xl rounded-b-[2rem]">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center bg-slate-900/90 backdrop-blur-md">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-4 border border-rose-500/30">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-2">Playback Error</p>
          <p className="text-xs font-bold text-slate-300 max-w-[200px] leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            Retry
          </button>
        </div>
      ) : videoId ? (
        <div id={`youtube-player-${videoId}`} className="w-full h-full" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center bg-slate-900">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-6 h-6 text-white/20 fill-current" />
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-6 text-blue-400 animate-pulse">Initializing Brain Engine</p>
        </div>
      )}
      
      {/* Overlay Title bar */}
      {title && !error && (
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-10 translate-y-[-10px] group-hover:translate-y-0">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="text-white text-[11px] font-black uppercase tracking-tight truncate drop-shadow-lg">{title}</h3>
          </div>
        </div>
      )}

      {/* Ambient Glow */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
};

export default VideoPlayer;
