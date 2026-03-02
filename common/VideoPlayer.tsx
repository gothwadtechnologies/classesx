
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Minimize, 
  Square, 
  ZoomIn, 
  ZoomOut,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
 * Enhanced with custom Android-style controls and playback features.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube ID from various URL formats
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
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }

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
          controls: 0, // Hide default controls
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
            // Start time tracking
            const interval = setInterval(() => {
              if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
              }
            }, 1000);
            return () => clearInterval(interval);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            setIsPlaying(event.data === 1);
          },
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

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const stopVideo = () => {
    if (!playerRef.current) return;
    playerRef.current.stopVideo();
    setIsPlaying(false);
  };

  const seek = (seconds: number) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + seconds, true);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full aspect-video bg-black relative group overflow-hidden shadow-2xl ${!isFullscreen ? 'rounded-b-[2rem]' : ''}`}
      onMouseMove={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center bg-slate-900/90 backdrop-blur-md z-50">
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
        <div 
          className={`w-full h-full transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          style={{ pointerEvents: 'none' }} // Let our custom overlay handle clicks
        >
          <div id={`youtube-player-${videoId}`} className="w-full h-full" />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center bg-slate-900 z-50">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-6 h-6 text-white/20 fill-current" />
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-6 text-blue-400 animate-pulse">Initializing Brain Engine</p>
        </div>
      )}
      
      {/* Custom Controls Overlay */}
      <AnimatePresence>
        {showControls && !error && videoId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 flex flex-col justify-between z-40"
          >
            {/* Top Bar */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <h3 className="text-white text-[11px] font-black uppercase tracking-tight truncate max-w-[200px]">{title || 'Lecture Video'}</h3>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={toggleZoom} className="text-white/80 hover:text-white transition-colors">
                  {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                </button>
                <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors">
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center justify-center gap-8 md:gap-16">
              <button 
                onClick={(e) => { e.stopPropagation(); seek(-10); }} 
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
                <span className="absolute mt-12 text-[8px] font-black">10s</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
                className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/40 active:scale-90 transition-all"
              >
                {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); seek(10); }} 
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
              >
                <RotateCw className="w-6 h-6" />
                <span className="absolute mt-12 text-[8px] font-black">10s</span>
              </button>
            </div>

            {/* Bottom Bar */}
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent space-y-4">
              {/* Progress Bar */}
              <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white text-[10px] font-mono font-black">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); stopVideo(); }} 
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-rose-500 transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Glow */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
};

export default VideoPlayer;
