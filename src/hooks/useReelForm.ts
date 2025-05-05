
import { useState } from "react";
import { ReelMood } from "@/types";

export const useReelForm = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState<ReelMood>("energetic");

  const resetForm = () => {
    setVideoFile(null);
    setVideoUrl("");
    setTitle("");
    setDescription("");
    setTags([]);
    setMood("energetic");
  };

  return {
    videoFile,
    setVideoFile,
    videoUrl,
    setVideoUrl,
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    mood,
    setMood,
    resetForm,
  };
};
