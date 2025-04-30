import { useEffect, useRef } from 'react';

type PreloadOptions = {
  preloadCount?: number;
  preloadThreshold?: number;
};

/**
 * A hook to preload videos for smoother playback
 * 
 * @param videos Array of video URLs to potentially preload
 * @param currentIndex The index of the currently playing video
 * @param options Configuration options
 */
export const useVideoPreloader = (
  videos: string[],
  currentIndex: number,
  options: PreloadOptions = {}
) => {
  const { 
    preloadCount = 2,
    preloadThreshold = 0.5
  } = options;
  
  const preloadedVideos = useRef<Set<string>>(new Set());
  const videoElements = useRef<HTMLVideoElement[]>([]);
  
  useEffect(() => {
    // Cleanup function to remove video elements
    const cleanup = () => {
      videoElements.current.forEach(video => {
        if (document.body.contains(video)) {
          document.body.removeChild(video);
        }
      });
      videoElements.current = [];
    };
    
    // Get the next videos to preload
    const videosToPreload = [];
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < videos.length) {
        const videoUrl = videos[nextIndex];
        // Only preload videos we haven't preloaded yet
        if (videoUrl && !preloadedVideos.current.has(videoUrl)) {
          videosToPreload.push(videoUrl);
        }
      }
    }
    
    // Preload each video
    videosToPreload.forEach(videoUrl => {
      if (videoUrl && videoUrl.trim() !== '') {
        // Skip YouTube/Vimeo/external links - they can't be preloaded this way
        if (
          videoUrl.includes('youtube.com') || 
          videoUrl.includes('youtu.be') || 
          videoUrl.includes('vimeo.com') ||
          videoUrl.includes('twitch.tv')
        ) {
          // Just mark as preloaded
          preloadedVideos.current.add(videoUrl);
          return;
        }
        
        try {
          const video = document.createElement('video');
          video.style.position = 'absolute';
          video.style.left = '-9999px';
          video.style.height = '1px';
          video.style.width = '1px';
          video.setAttribute('preload', 'auto');
          video.setAttribute('muted', 'true');
          video.setAttribute('playsinline', 'true');
          video.src = videoUrl;
          video.load();
          
          // We'll keep track of the video element for cleanup
          videoElements.current.push(video);
          
          // Mark this video URL as preloaded
          preloadedVideos.current.add(videoUrl);
          
          // Append to DOM for preloading to work in some browsers
          document.body.appendChild(video);
          
          // Let it load for a bit and then play a small amount
          setTimeout(() => {
            if (!video.paused) {
              video.pause();
            }
            
            video.currentTime = 0;
            video.play().then(() => {
              // Wait for enough of the video to be loaded
              setTimeout(() => {
                video.pause();
                video.currentTime = 0;
                // Remove from DOM after preloading enough
                if (document.body.contains(video)) {
                  document.body.removeChild(video);
                }
                const index = videoElements.current.indexOf(video);
                if (index > -1) {
                  videoElements.current.splice(index, 1);
                }
              }, 2000); // 2 seconds should be enough to preload the beginning
            }).catch(() => {
              // Ignore errors - this is just preloading
            });
          }, 100);
        } catch (error) {
          console.error('Error preloading video:', error);
        }
      }
    });
    
    return cleanup;
  }, [currentIndex, videos, preloadCount, preloadThreshold]);
  
  return {
    preloadedVideos: Array.from(preloadedVideos.current)
  };
};
