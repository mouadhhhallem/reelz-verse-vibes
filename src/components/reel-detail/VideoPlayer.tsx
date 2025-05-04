
import React, { useState, useEffect } from 'react';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Loader } from 'lucide-react';
import { formatDuration } from '@/lib/video-utils';
import { getActualVideoSource } from '@/utils/reel-utils';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  isYouTube: boolean;
  youtubeId?: string;
  nextVideoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  isYouTube,
  youtubeId,
  nextVideoUrl,
}) => {
  const { 
    videoRef, 
    containerRef, 
    isPlaying, 
    togglePlayback, 
    isMuted, 
    toggleMute, 
    progress,
    isBuffering,
    volume,
    duration,
    currentTime,
    hasError,
    seekTo,
    changeVolume,
    preloadNextVideo,
    setHasError
  } = useVideoPlayback(0.3);

  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [actualVideoSrc, setActualVideoSrc] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Get the actual video source for local videos
  useEffect(() => {
    const loadVideo = async () => {
      console.log("Loading video from URL:", videoUrl);
      
      if (!videoUrl) {
        console.error("No video URL provided");
        setError(true);
        setHasError(true);
        return;
      }
      
      // Check if it's a local video (stored in localStorage)
      if (!isYouTube && videoUrl.startsWith('local:')) {
        try {
          console.log("Getting local video source");
          const videoId = videoUrl.split(':')[1];
          console.log("Video ID for local video:", videoId);
          
          if (!videoId) {
            console.error("Invalid local video URL format");
            setError(true);
            setHasError(true);
            return;
          }
          
          // Get video data from localStorage
          const storedVideos = localStorage.getItem('reelz_videos');
          if (!storedVideos) {
            console.error("No videos found in localStorage");
            setError(true);
            setHasError(true);
            return;
          }
          
          const videos = JSON.parse(storedVideos);
          const videoData = videos[videoId]?.data;
          
          if (!videoData) {
            console.error(`Video data not found for ID: ${videoId}`);
            setError(true);
            setHasError(true);
            return;
          }
          
          console.log("Local video data retrieved successfully");
          setActualVideoSrc(videoData);
          setError(false);
        } catch (err) {
          console.error("Error getting local video source:", err);
          setError(true);
          setHasError(true);
        }
      } else if (videoUrl.indexOf('data:') === 0) {
        // It's already a data URL
        setActualVideoSrc(videoUrl);
        setError(false);
      } else {
        // Regular URL
        setActualVideoSrc(videoUrl);
      }
    };
    
    loadVideo();
  }, [videoUrl, isYouTube, loadAttempts, setHasError]);

  // Preload next video when component mounts
  React.useEffect(() => {
    if (nextVideoUrl) {
      preloadNextVideo(nextVideoUrl);
    }
  }, [nextVideoUrl, preloadNextVideo]);

  // Hide controls after 3 seconds of inactivity
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleMouseMove, { passive: true });
    }
    
    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleMouseMove);
      }
    };
  }, [isPlaying]);

  const handleVideoError = () => {
    console.error("Error loading video:", videoUrl);
    setError(true);
    
    // Try reloading once
    if (loadAttempts === 0 && videoUrl.startsWith('local:')) {
      console.log("Attempting to reload local video");
      setLoadAttempts(1);
    }
  };

  const handleRetry = () => {
    setError(false);
    setHasError(false);
    setLoadAttempts(prev => prev + 1);
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      onClick={!isYouTube ? togglePlayback : undefined}
      onMouseEnter={() => setShowControls(true)}
    >
      {isYouTube ? (
        <iframe
          ref={videoRef as React.RefObject<HTMLIFrameElement>}
          src={`${videoUrl}?autoplay=1&mute=0&controls=1&modestbranding=1&loop=1&playlist=${youtubeId}`}
          title="YouTube video player"
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full bg-black/30 backdrop-blur-sm">
          <div className="text-6xl mb-6">😕</div>
          <p className="text-white text-xl mb-4 text-center">Unable to load video</p>
          <p className="text-white/70 text-center max-w-md mb-6">
            The video might be unavailable or in an unsupported format.
          </p>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/20"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          src={actualVideoSrc}
          poster={thumbnailUrl}
          controls={false}
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          onError={handleVideoError}
        ></video>
      )}
      
      {/* Video Overlay with enhanced mood effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none"></div>
      
      {/* Buffering Indicator */}
      <AnimatePresence>
        {isBuffering && !error && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 1.5, ease: "linear", repeat: Infinity },
                scale: { duration: 1, repeat: Infinity }
              }}
            >
              <Loader size={48} className="text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Play/Pause Overlay */}
      <AnimatePresence>
        {!isPlaying && !isYouTube && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayback();
              }}
            >
              <Play size={32} className="text-white" fill="white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Video Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width * 100;
          seekTo(percent);
        }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${progress}%` }}
        />
        
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 border-primary"
          style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          animate={{ scale: showControls ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      
      {/* Time Display */}
      <motion.div 
        className="absolute bottom-4 left-4 text-xs text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </motion.div>
      
      {!isYouTube && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2">
          {/* Volume Control */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: 20 }}
                  animate={{ opacity: 1, width: 80, x: 0 }}
                  exit={{ opacity: 0, width: 0, x: 20 }}
                  className="absolute right-full mr-2 top-1/2 -translate-y-1/2 h-8 bg-black/60 backdrop-blur-md rounded-full px-3 flex items-center"
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-full h-1 appearance-none bg-white/30 rounded-full outline-none"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) ${volume * 100}%, white 0%)`,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button 
              size="icon" 
              variant="glass"
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              {isMuted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} className="text-white" />
              )}
            </Button>
          </motion.div>
          
          {/* Play/Pause Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              size="icon" 
              variant="glass"
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayback();
              }}
            >
              {isPlaying ? (
                <Pause size={18} className="text-white" />
              ) : (
                <Play size={18} className="text-white" />
              )}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
