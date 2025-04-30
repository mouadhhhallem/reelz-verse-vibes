
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FileUploadArea } from "./FileUploadArea";
import { UrlInputField } from "./UrlInputField";
import { VideoPreview } from "./VideoPreview";
import { ClipControls } from "./ClipControls";
import { ReelForm } from "./ReelForm";
import { UploadProgress } from "./UploadProgress";

export type ModalTab = "upload" | "youtube" | "twitch" | "vimeo";

export interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ModalTab;
}

export const CreateReelModal: React.FC<CreateReelModalProps> = ({
  isOpen,
  onClose,
  initialTab = "upload",
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Update the type here to match what's in ReelForm
  const [mood, setMood] = useState<"energetic" | "calm" | "happy" | "sad" | "neutral">("energetic");

  const handleTabChange = (value: string) => {
    setActiveTab(value as ModalTab);
    // Reset form when changing tabs
    setVideoFile(null);
    setVideoUrl("");
  };

  const handleVideoFileChange = (file: File | null) => {
    setVideoFile(file);
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
  };

  const handleSubmit = async () => {
    if (!videoFile && !videoUrl) return;

    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      onClose();
      
      // Reset form
      setVideoFile(null);
      setVideoUrl("");
      setTags([]);
      setTitle("");
      setDescription("");
      setMood("energetic");
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl w-full bg-background/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden p-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative"
            >
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Create New Reel
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogHeader>

              <div className="p-6 space-y-6">
                <Tabs
                  defaultValue={activeTab}
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 w-full bg-white/5 backdrop-blur-md">
                    <TabsTrigger value="upload" className="data-[state=active]:bg-primary/20">
                      Upload Video
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="data-[state=active]:bg-primary/20">
                      YouTube Link
                    </TabsTrigger>
                    <TabsTrigger value="twitch" className="data-[state=active]:bg-primary/20">
                      Twitch Clip
                    </TabsTrigger>
                    <TabsTrigger value="vimeo" className="data-[state=active]:bg-primary/20">
                      Vimeo Video
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-6 space-y-6">
                    <FileUploadArea onChange={handleVideoFileChange} file={videoFile} />
                    
                    {videoFile && (
                      <VideoPreview file={videoFile} />
                    )}
                  </TabsContent>

                  <TabsContent value="youtube" className="mt-6 space-y-6">
                    <UrlInputField 
                      value={videoUrl}
                      onChange={handleVideoUrlChange}
                      placeholder="Paste YouTube video URL"
                      type="youtube"
                    />
                    
                    {videoUrl && (
                      <ClipControls url={videoUrl} type="youtube" />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="twitch" className="mt-6 space-y-6">
                    <UrlInputField 
                      value={videoUrl}
                      onChange={handleVideoUrlChange}
                      placeholder="Paste Twitch clip URL"
                      type="twitch"
                    />
                    
                    {videoUrl && (
                      <ClipControls url={videoUrl} type="twitch" />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="vimeo" className="mt-6 space-y-6">
                    <UrlInputField 
                      value={videoUrl}
                      onChange={handleVideoUrlChange}
                      placeholder="Paste Vimeo video URL"
                      type="vimeo"
                    />
                    
                    {videoUrl && (
                      <ClipControls url={videoUrl} type="vimeo" />
                    )}
                  </TabsContent>
                </Tabs>

                <ReelForm
                  title={title}
                  onTitleChange={setTitle}
                  description={description}
                  onDescriptionChange={setDescription}
                  tags={tags}
                  onTagsChange={setTags}
                  mood={mood}
                  onMoodChange={setMood}
                />

                <UploadProgress 
                  isUploading={isUploading}
                  activeTab={activeTab}
                  uploadProgress={uploadProgress}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    variant="cosmic" 
                    onClick={handleSubmit}
                    disabled={(!videoFile && !videoUrl) || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Create Reel"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
