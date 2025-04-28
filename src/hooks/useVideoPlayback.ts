
import { useEffect, useRef, useState } from 'react';

export const useVideoPlayback = (threshold = 0.7) => {
  const videoRef = useRef<HTMLVideoElement | HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      if (currentVideo?.tagName === 'VIDEO') {
        const videoElement = currentVideo as HTMLVideoElement;
        videoElement.pause();
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

  return {
    videoRef,
    containerRef,
    isVisible,
    isPlaying,
    togglePlayback,
  };
};
