
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateVideoThumbnail } from "@/lib/video-utils";
import { useMoodTheme } from "@/components/ui/mood-theme-provider";

export type ReelMood = "energetic" | "calm" | "happy" | "sad" | "neutral";
export type ModalTab = "upload" | "youtube" | "twitch" | "vimeo";

export const useReelUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState<ReelMood>("energetic");
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setMood: setGlobalMood } = useMoodTheme();

  const resetForm = () => {
    setVideoFile(null);
    setVideoUrl("");
    setTags([]);
    setTitle("");
    setDescription("");
    setMood("energetic");
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleSubmit = async (activeTab: ModalTab) => {
    if (!videoFile && !videoUrl) return;
    if (!user) {
      toast.error("You must be logged in to upload videos");
      return;
    }

    setIsUploading(true);
    
    // Update global mood based on selected mood
    setGlobalMood(mood);
    
    // Simulate upload progress with smoother animation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const increment = Math.random() * 15 + 5; // Random increment between 5-20%
        const newProgress = prev + increment;
        
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95; // Hold at 95% until processing completes
        }
        return newProgress;
      });
    }, 300);

    try {
      // Generate a thumbnail if it's a file upload
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
        } else {
          // For other platforms, use a generic thumbnail
          thumbnailUrl = '/placeholder.svg';
          videoSrc = videoUrl;
        }
      }

      // Create new reel object
      const newReel = {
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
      
      // Complete the upload
      setTimeout(() => {
        setUploadProgress(100);
        
        // Add the new reel to the cache
        queryClient.setQueryData(['reels'], (oldData: any) => {
          return oldData ? [newReel, ...oldData] : [newReel];
        });
        
        // Invalidate queries to refetch the data
        queryClient.invalidateQueries({ queryKey: ['reels'] });
        
        toast.success("Reel uploaded successfully!", {
          description: "Your reel is now live and can be viewed by others.",
          icon: "🚀",
        });
        
        // Reset the form
        resetForm();
        
        // Navigate to the reel page after a small delay
        setTimeout(() => {
          navigate(`/reel/${newReel.id}`);
        }, 500);
        
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload the reel. Please try again.");
      setIsUploading(false);
      clearInterval(interval);
    }
  };

  return {
    videoFile,
    setVideoFile,
    videoUrl,
    setVideoUrl,
    isUploading,
    uploadProgress,
    tags,
    setTags,
    title,
    setTitle,
    description,
    setDescription,
    mood,
    setMood,
    handleSubmit,
    resetForm
  };
};
