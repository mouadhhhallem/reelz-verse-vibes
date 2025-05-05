
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMoodTheme } from "@/components/ui/mood-theme-provider";
import { useReelForm } from "./useReelForm";
import { processVideoSource, createReelObject, simulateUploadProgress, validateReelForm } from "@/utils/reel-utils";
import { ReelMood } from "@/types";

export type ModalTab = "upload" | "youtube" | "twitch" | "vimeo";

export const useReelUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const formState = useReelForm();
  const [clipStart, setClipStart] = useState(0);
  const [clipDuration, setClipDuration] = useState<number | null>(30);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setMood: setGlobalMood } = useMoodTheme();

  const handleSubmit = async (activeTab: ModalTab) => {
    if (!validateReelForm(formState.videoFile, formState.videoUrl)) return;
    
    if (!user) {
      toast.error("You must be logged in to upload videos");
      return;
    }

    setIsUploading(true);
    
    // Update global mood based on selected mood
    setGlobalMood(formState.mood as any);
    
    // Simulate upload progress
    const interval = simulateUploadProgress(setUploadProgress);

    try {
      // Process video source
      const { thumbnailUrl, videoSrc, videoId } = await processVideoSource(
        formState.videoFile, 
        formState.videoUrl, 
        activeTab
      );
      
      // Create new reel object
      const newReel = createReelObject(
        videoSrc,
        thumbnailUrl,
        activeTab,
        formState.videoUrl,
        formState.title,
        formState.description,
        formState.tags,
        formState.mood,
        user,
        videoId
      );
      
      // Add clip start and duration if they exist
      if (clipStart > 0) {
        newReel.clipStart = clipStart;
      }
      
      if (clipDuration !== null) {
        newReel.clipDuration = clipDuration;
      }
      
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
        formState.resetForm();
        setIsUploading(false);
        setUploadProgress(0);
        setClipStart(0);
        setClipDuration(30);
        
        // Dispatch custom event to notify listeners about new reel
        window.dispatchEvent(new CustomEvent('reel-created', { detail: { reel: newReel } }));
        
        // Navigate to the reel page after a small delay
        setTimeout(() => {
          navigate(`/reel/${newReel.id}`);
        }, 500);
        
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload the reel. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
      clearInterval(interval);
    }
  };

  return {
    ...formState,
    clipStart,
    setClipStart,
    clipDuration,
    setClipDuration,
    isUploading,
    uploadProgress,
    handleSubmit
  };
};
