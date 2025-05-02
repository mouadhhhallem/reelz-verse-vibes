
import { toast } from "sonner";
import { generateVideoThumbnail } from "@/lib/video-utils";
import { ModalTab, ReelMood } from "@/hooks/useReelUpload";

/**
 * Processes a video file or URL and returns thumbnail and source information
 */
export const processVideoSource = async (
  videoFile: File | null, 
  videoUrl: string, 
  activeTab: ModalTab
): Promise<{thumbnailUrl: string, videoSrc: string}> => {
  let thumbnailUrl = "";
  let videoSrc = "";
  
  if (videoFile) {
    thumbnailUrl = await generateVideoThumbnail(videoFile);
    videoSrc = URL.createObjectURL(videoFile);
  } else if (videoUrl) {
    // For YouTube links, we can get the thumbnail directly
    if (activeTab === 'youtube') {
      const videoId = new URL(videoUrl).searchParams.get('v');
      if (videoId) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        videoSrc = videoUrl;
      }
    } else if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      // Handle direct video URLs
      thumbnailUrl = '/placeholder.svg'; // Placeholder thumbnail for direct video links
      videoSrc = videoUrl;
    } else {
      // For other platforms, use a generic thumbnail
      thumbnailUrl = '/placeholder.svg';
      videoSrc = videoUrl;
    }
  }

  return { thumbnailUrl, videoSrc };
};

/**
 * Creates a reel object with metadata from user input
 */
export const createReelObject = (
  videoSrc: string,
  thumbnailUrl: string,
  activeTab: ModalTab,
  videoUrl: string,
  title: string,
  description: string,
  tags: string[],
  mood: ReelMood,
  user: any
) => {
  return {
    id: `reel-${Date.now()}`,
    title: title || `My Reel ${new Date().toLocaleDateString()}`,
    description: description || "Check out my latest reel!",
    videoUrl: videoSrc,
    thumbnailUrl,
    isYouTube: activeTab === 'youtube',
    youtubeId: activeTab === 'youtube' ? new URL(videoUrl).searchParams.get('v') || '' : '',
    sourceType: activeTab,
    tags: tags.length > 0 ? tags : [mood],
    mood,
    likes: 0,
    views: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    userId: user.id,
    user: {
      name: user.name || user.username,
      username: user.username,
      avatar: user.avatar,
    }
  };
};

/**
 * Simulates upload progress with a smooth animation
 */
export const simulateUploadProgress = (
  setProgress: React.Dispatch<React.SetStateAction<number>>
): ReturnType<typeof setInterval> => {
  const progressInterval = setInterval(() => {
    setProgress(prevProgress => {
      const increment = Math.random() * 15 + 5; // Random increment between 5-20%
      const newProgress = prevProgress + increment;
      
      if (newProgress >= 95) {
        clearInterval(progressInterval);
        return 95; // Hold at 95% until processing completes
      }
      return newProgress;
    });
  }, 300);
  
  return progressInterval;
};

/**
 * Form validation for reel upload
 */
export const validateReelForm = (videoFile: File | null, videoUrl: string): boolean => {
  if (!videoFile && !videoUrl) {
    toast.error("Please upload a video or provide a valid URL");
    return false;
  }
  
  // Validate video URL format
  if (videoUrl && !videoFile) {
    try {
      new URL(videoUrl);
      // Check if it's a YouTube URL
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // Valid YouTube URL
      } else if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
        // Valid direct video URL
      } else {
        toast.error("Please provide a valid YouTube or direct video URL");
        return false;
      }
    } catch {
      toast.error("Please enter a valid URL");
      return false;
    }
  }
  
  return true;
};
