
import { useEffect, useRef, useState, useCallback } from 'react';

export const useVideoPlayback = (threshold = 0.7) => {
  const videoRef = useRef<HTMLVideoElement | HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const preloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Preload the next video when current video is 70% complete
  const preloadNextVideo = useCallback((nextVideoSrc?: string) => {
    if (!nextVideoSrc) return;
    
    const preloadVideo = document.createElement('video');
    preloadVideo.src = nextVideoSrc;
    preloadVideo.preload = 'auto';
    preloadVideo.muted = true;
    preloadVideo.style.display = 'none';
    preloadVideo.load();
    
    // Cleanup
    if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    
    // Remove after 30 seconds if not used
    preloadTimerRef.current = setTimeout(() => {
      if (document.body.contains(preloadVideo)) {
        document.body.removeChild(preloadVideo);
      }
    }, 30000);
    
    document.body.appendChild(preloadVideo);
    
    return () => {
      if (document.body.contains(preloadVideo)) {
        document.body.removeChild(preloadVideo);
      }
      if (preloadTimerRef.current) {
        clearTimeout(preloadTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const currentVideo = videoRef.current;
    const currentContainer = containerRef.current;
    
    if (!currentContainer || !currentVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        if (isIntersecting && !hasError) {
          if (currentVideo.tagName === 'VIDEO') {
            const videoElement = currentVideo as HTMLVideoElement;
            // Only attempt to play if video has a valid source
            if (videoElement.src) {
              videoElement.play().catch(error => {
                console.error('Autoplay failed:', error);
                setHasError(true);
              });
              setIsPlaying(true);
            }
          }
        } else {
          if (currentVideo.tagName === 'VIDEO') {
            const videoElement = currentVideo as HTMLVideoElement;
            videoElement.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold }
    );

    observer.observe(currentContainer);

    // Set up progress tracking for video elements
    if (currentVideo.tagName === 'VIDEO') {
      const videoElement = currentVideo as HTMLVideoElement;
      
      const updateProgress = () => {
        if (videoElement.duration) {
          setProgress((videoElement.currentTime / videoElement.duration) * 100);
          setCurrentTime(videoElement.currentTime);
        }
      };
      
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
        setHasError(false); // Reset error state when video loads successfully
      };
      
      const handleWaiting = () => {
        setIsBuffering(true);
      };
      
      const handlePlaying = () => {
        setIsBuffering(false);
        setHasError(false); // Reset error state when video starts playing
      };
      
      const handleError = (e: Event) => {
        console.error('Video playback error:', e);
        setHasError(true);
        setIsPlaying(false);
      };
      
      videoElement.addEventListener('timeupdate', updateProgress);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('waiting', handleWaiting);
      videoElement.addEventListener('playing', handlePlaying);
      videoElement.addEventListener('error', handleError);
      
      // If video is 70% complete, preload next video if available
      videoElement.addEventListener('timeupdate', () => {
        if (videoElement.currentTime / videoElement.duration > 0.7) {
          // This is where we'd get the next video URL from a context/state
          const nextVideoElement = document.querySelector('[data-next-video]');
          if (nextVideoElement && nextVideoElement.getAttribute('data-src')) {
            preloadNextVideo(nextVideoElement.getAttribute('data-src') || undefined);
          }
        }
      });
      
      // Return cleanup function
      return () => {
        if (currentContainer) {
          observer.unobserve(currentContainer);
        }
        videoElement.removeEventListener('timeupdate', updateProgress);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('waiting', handleWaiting);
        videoElement.removeEventListener('playing', handlePlaying);
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('timeupdate', () => {});
      };
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [threshold, preloadNextVideo, hasError]);

  const togglePlayback = () => {
    const currentVideo = videoRef.current;
    
    if (!currentVideo || currentVideo.tagName !== 'VIDEO' || hasError) return;
    
    const videoElement = currentVideo as HTMLVideoElement;
    
    if (videoElement.paused) {
      videoElement.play().catch(error => {
        console.error('Play failed:', error);
        setHasError(true);
      });
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const currentVideo = videoRef.current;
    
    if (!currentVideo || currentVideo.tagName !== 'VIDEO') return;
    
    const videoElement = currentVideo as HTMLVideoElement;
    
    if (videoElement.muted) {
      videoElement.muted = false;
      setIsMuted(false);
    } else {
      videoElement.muted = true;
      setIsMuted(true);
    }
  };

  const seekTo = (percentage: number) => {
    const currentVideo = videoRef.current;
    
    if (!currentVideo || currentVideo.tagName !== 'VIDEO') return;
    
    const videoElement = currentVideo as HTMLVideoElement;
    const targetTime = (percentage / 100) * videoElement.duration;
    videoElement.currentTime = targetTime;
    setCurrentTime(targetTime);
  };
  
  const changeVolume = (value: number) => {
    const currentVideo = videoRef.current;
    
    if (!currentVideo || currentVideo.tagName !== 'VIDEO') return;
    
    const videoElement = currentVideo as HTMLVideoElement;
    const volumeValue = Math.max(0, Math.min(1, value));
    
    videoElement.volume = volumeValue;
    setVolume(volumeValue);
    
    if (volumeValue === 0) {
      videoElement.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoElement.muted = false;
      setIsMuted(false);
    }
  };

  return {
    videoRef,
    containerRef,
    isVisible,
    isPlaying,
    isMuted,
    progress,
    isBuffering,
    volume,
    duration,
    currentTime,
    hasError,
    togglePlayback,
    toggleMute,
    seekTo,
    changeVolume,
    preloadNextVideo,
    setHasError
  };
};
