
import { useEffect, useRef, useState } from 'react';

export const useVideoPlayback = (threshold = 0.7) => {
  const videoRef = useRef<HTMLVideoElement | HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentVideo = videoRef.current;
    const currentContainer = containerRef.current;
    
    if (!currentContainer || !currentVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        if (isIntersecting) {
          if (currentVideo.tagName === 'VIDEO') {
            const videoElement = currentVideo as HTMLVideoElement;
            videoElement.play().catch(error => {
              console.error('Autoplay failed:', error);
            });
            setIsPlaying(true);
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
        }
      };
      
      videoElement.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      if (currentVideo?.tagName === 'VIDEO') {
        const videoElement = currentVideo as HTMLVideoElement;
        videoElement.pause();
        videoElement.removeEventListener('timeupdate', () => {});
      }
    };
  }, [threshold]);

  const togglePlayback = () => {
    const currentVideo = videoRef.current;
    
    if (!currentVideo || currentVideo.tagName !== 'VIDEO') return;
    
    const videoElement = currentVideo as HTMLVideoElement;
    
    if (videoElement.paused) {
      videoElement.play().catch(error => {
        console.error('Play failed:', error);
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
  };

  return {
    videoRef,
    containerRef,
    isVisible,
    isPlaying,
    isMuted,
    progress,
    togglePlayback,
    toggleMute,
    seekTo
  };
};
