
import { toast } from "sonner";
import { generateVideoThumbnail } from "@/lib/video-utils";
import { ModalTab } from "@/hooks/useReelUpload";
import { ReelMood } from "@/types";
import { nanoid } from "nanoid";

// Storage key for videos in localStorage
const VIDEO_STORAGE_KEY = 'reelz_videos';

/**
 * Save video to localStorage
 */
export const saveVideoToStorage = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(videoFile);
      reader.onload = () => {
        const videoId = `video-${nanoid(8)}`;
        const videos = getStoredVideos();
        
        // Store video with metadata
        videos[videoId] = {
          id: videoId,
          name: videoFile.name,
          type: videoFile.type,
          size: videoFile.size,
          data: reader.result,
          createdAt: new Date().toISOString()
        };
        
        // Save to consolidated storage
        localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(videos));
        
        // Also save individual video for quick access
        try {
          localStorage.setItem(`reelz_video_${videoId}`, reader.result as string);
        } catch (storageError) {
          console.warn("Could not store individual video entry, using consolidated only:", storageError);
        }
        
        // Dispatch event to notify components that a new video was added
        window.dispatchEvent(new CustomEvent('reel-added', { detail: { videoId } }));
        
        resolve(videoId);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Get video from localStorage by ID
 */
export const getVideoFromStorage = (videoId: string): string | null => {
  try {
    // First try direct access
    let videoData = localStorage.getItem(`reelz_video_${videoId}`);
    
    // If not found, try the consolidated storage
    if (!videoData) {
      console.log("Video not found in direct storage, checking consolidated storage");
      const videos = getStoredVideos();
      videoData = videos[videoId]?.data || null;
    }
    
    return videoData;
  } catch (error) {
    console.error('Error retrieving video:', error);
    return null;
  }
};

/**
 * Get all stored videos
 */
export const getStoredVideos = () => {
  try {
    const videos = localStorage.getItem(VIDEO_STORAGE_KEY);
    return videos ? JSON.parse(videos) : {};
  } catch (error) {
    console.error('Error parsing stored videos:', error);
    return {};
  }
};

/**
 * Processes a video file or URL and returns thumbnail and source information
 */
export const processVideoSource = async (
  videoFile: File | null, 
  videoUrl: string, 
  activeTab: ModalTab
): Promise<{thumbnailUrl: string, videoSrc: string, videoId?: string}> => {
  let thumbnailUrl = "";
  let videoSrc = "";
  let videoId = undefined;
  
  if (videoFile) {
    try {
      thumbnailUrl = await generateVideoThumbnail(videoFile);
      
      // Save video to localStorage and get its ID
      videoId = await saveVideoToStorage(videoFile);
      
      // Set the source as a special URL format that our system recognizes
      videoSrc = `local:${videoId}`;
    } catch (error) {
      console.error('Error processing video file:', error);
      toast.error('Failed to process video file');
      throw error;
    }
  } else if (videoUrl) {
    // For YouTube links, we can get the thumbnail directly
    if (activeTab === 'youtube') {
      const youtubeId = new URL(videoUrl).searchParams.get('v');
      if (youtubeId) {
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
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

  return { thumbnailUrl, videoSrc, videoId };
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
  user: any,
  videoId?: string
) => {
  return {
    id: `reel-${Date.now()}`,
    title: title || `My Reel ${new Date().toLocaleDateString()}`,
    description: description || "Check out my latest reel!",
    videoUrl: videoSrc,
    videoId: videoId, // Store the local video ID if it exists
    thumbnailUrl,
    isYouTube: activeTab === 'youtube',
    youtubeId: activeTab === 'youtube' ? new URL(videoUrl).searchParams.get('v') || '' : '',
    sourceType: activeTab,
    isLocalVideo: videoSrc.startsWith('local:'),
    tags: tags.length > 0 ? tags : [mood],
    mood,
    likes: 0,
    views: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    clipStart: 0, // Default clip start
    clipDuration: null, // Default clip duration
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

/**
 * Get the actual video source URL (handles local storage videos)
 */
export const getActualVideoSource = (videoUrl: string): string => {
  // Add debug logs to trace the issue
  console.log("Getting actual video source for:", videoUrl);
  
  if (!videoUrl) {
    console.error("Empty video URL provided");
    return '';
  }
  
  if (videoUrl.startsWith('local:')) {
    const videoId = videoUrl.split(':')[1];
    console.log("Video ID extracted:", videoId);
    
    if (!videoId) {
      console.error("Invalid local video URL format");
      return '';
    }
    
    // Try direct access first
    let videoData = localStorage.getItem(`reelz_video_${videoId}`);
    
    // If not found, try the consolidated storage
    if (!videoData) {
      console.log("Video not found in direct storage, checking consolidated storage");
      const storedVideos = localStorage.getItem('reelz_videos');
      if (storedVideos) {
        try {
          const videos = JSON.parse(storedVideos);
          videoData = videos[videoId]?.data || null;
        } catch (error) {
          console.error("Error parsing stored videos:", error);
        }
      }
    }
    
    if (!videoData) {
      console.error(`Video data not found for ID: ${videoId}`);
      return '';
    }
    
    console.log("Video data retrieved successfully");
    return videoData;
  }
  
  return videoUrl;
};
