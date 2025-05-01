
import { useState } from "react";
import { ReelMood } from "./useReelUpload";

/**
 * Hook for managing reel form state
 */
export const useReelForm = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState<ReelMood>("energetic");
  
  const resetForm = () => {
    setVideoFile(null);
    setVideoUrl("");
    setTags([]);
    setTitle("");
    setDescription("");
    setMood("energetic");
  };
  
  return {
    videoFile,
    setVideoFile,
    videoUrl,
    setVideoUrl,
    tags,
    setTags,
    title,
    setTitle,
    description,
    setDescription,
    mood,
    setMood,
    resetForm
  };
};

