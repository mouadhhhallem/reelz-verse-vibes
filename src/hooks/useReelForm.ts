
import { useState } from "react";
import { ReelMood } from "@/types";

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
  const [clipStart, setClipStart] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<number | null>(null);
  
  const resetForm = () => {
    setVideoFile(null);
    setVideoUrl("");
    setTags([]);
    setTitle("");
    setDescription("");
    setMood("energetic");
    setClipStart(0);
    setClipDuration(null);
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
    clipStart,
    setClipStart,
    clipDuration,
    setClipDuration,
    resetForm
  };
};
