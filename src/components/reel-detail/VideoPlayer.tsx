
import React from 'react';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  isYouTube: boolean;
  youtubeId?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  isYouTube,
  youtubeId,
}) => {
  const { 
    videoRef, 
    containerRef, 
    isPlaying, 
    togglePlayback, 
    isMuted, 
    toggleMute, 
    progress, 
    seekTo 
  } = useVideoPlayback(0.3);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      onClick={!isYouTube ? togglePlayback : undefined}
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
      ) : (
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          src={videoUrl}
          poster={thumbnailUrl}
          controls={false}
          loop
          playsInline
          className="w-full h-full object-cover"
        ></video>
      )}
      
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none"></div>
      
      {/* Video Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        style={{ transformOrigin: "left" }}
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width * 100;
          seekTo(percent);
        }}
      >
        <div className="h-full bg-primary"></div>
      </motion.div>
      
      {!isYouTube && (
        <div className="absolute bottom-4 right-4 z-20">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
