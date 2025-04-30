
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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';
import { useQueryClient } from "@tanstack/react-query";
import { generateVideoThumbnail } from "@/lib/video-utils";
import { useNavigate } from "react-router-dom";

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
  const [mood, setMood] = useState<"energetic" | "calm" | "happy" | "sad" | "neutral">("energetic");
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    if (!videoFile && !videoUrl) return;
    if (!user) {
      toast.error("You must be logged in to upload videos");
      return;
    }

    setIsUploading(true);
    
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
        tags: tags.length > 0 ? tags : [mood],
        mood,
        likes: 0,
        views: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
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
        
        toast.success("Reel uploaded successfully!");
        
        // Reset the form and close the modal
        resetForm();
        onClose();
        
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
                  onMoodChange={(newMood) => setMood(newMood)}
                />

                <UploadProgress 
                  isUploading={isUploading}
                  activeTab={activeTab}
                  uploadProgress={uploadProgress}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={onClose} disabled={isUploading}>
                    Cancel
                  </Button>
                  <Button 
                    variant="cosmic" 
                    onClick={handleSubmit}
                    disabled={(!videoFile && !videoUrl) || isUploading}
                    className="relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {isUploading ? "Uploading..." : "Create Reel"}
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
                      initial={{ x: '-100%' }}
                      animate={{ 
                        x: isUploading ? '100%' : '-100%',
                      }}
                      transition={{ 
                        duration: isUploading ? 1.5 : 0.5,
                        repeat: isUploading ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    />
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
