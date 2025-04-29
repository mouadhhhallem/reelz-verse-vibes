
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, Upload, ArrowRight, X, Youtube, Link, 
  Twitch, Play, Clock, VideoIcon 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { VideoSourceType } from '@/types';
import { extractVideoId } from '@/lib/video-utils';

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'youtube' | 'upload';
}

export const CreateReelModal: React.FC<CreateReelModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'youtube'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<VideoSourceType>('youtube');
  const [clipStart, setClipStart] = useState('0');
  const [clipDuration, setClipDuration] = useState('30');
  const [isValidUrl, setIsValidUrl] = useState(false);
  
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
  
  // Reset state when dialog closes or initialTab changes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  const resetForm = () => {
    setVideoUrl('');
    setVideoFile(null);
    setTitle('');
    setDescription('');
    setTags('');
    setUploadProgress(0);
    setPreviewUrl(null);
    setSourceType('youtube');
    setClipStart('0');
    setClipDuration('30');
    setIsValidUrl(false);
  };
  
  // Check URL validity and detect platform
  useEffect(() => {
    if (!videoUrl) {
      setIsValidUrl(false);
      return;
    }
    
    let validUrl = false;
    
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      setSourceType('youtube');
      validUrl = !!extractVideoId(videoUrl, 'youtube');
    } else if (videoUrl.includes('twitch.tv')) {
      setSourceType('twitch');
      validUrl = !!extractVideoId(videoUrl, 'twitch');
    } else if (videoUrl.includes('vimeo.com')) {
      setSourceType('vimeo');
      validUrl = !!extractVideoId(videoUrl, 'vimeo');
    } else if (
      videoUrl.includes('tiktok.com') || 
      videoUrl.includes('vm.tiktok.com')
    ) {
      setSourceType('tiktok');
      validUrl = true; // Basic validation, would need proper regex for production
    } else {
      setSourceType('other');
      validUrl = videoUrl.startsWith('http') || videoUrl.startsWith('https');
    }
    
    setIsValidUrl(validUrl);
  }, [videoUrl]);
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (activeTab === 'youtube') {
        // Simulate progress for external link uploads
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(i);
        }
        
        return apiClient.uploadVideo(videoUrl, {
          title: title || `Shared ${sourceType} clip`,
          description: description || `Clip starts at ${clipStart}s for ${clipDuration}s`,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : ['shared'],
          sourceType,
          clipStart: parseInt(clipStart, 10),
          clipDuration: parseInt(clipDuration, 10)
        });
      } else if (videoFile) {
        // Simulate upload progress for files
        for (let i = 0; i <= 100; i += 5) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(i);
        }
        
        return apiClient.uploadVideo(videoFile, {
          title: title || videoFile.name,
          description: description || 'Uploaded video clip',
          tags: tags ? tags.split(',').map(tag => tag.trim()) : ['original'],
          sourceType: 'upload',
          clipStart: 0,
          clipDuration: 0
        });
      }
      throw new Error('No valid video source');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      queryClient.invalidateQueries({ queryKey: ['my-clips'] });
      
      toast.success('Reel added successfully', {
        description: 'Your new clip has been uploaded!'
      });
      
      onClose();
    },
    onError: (error) => {
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('video/')) {
        toast.error('Invalid file type', { 
          description: 'Please upload a video file'
        });
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File too large', { 
          description: 'Video size should be under 50MB'
        });
        return;
      }
      
      setVideoFile(file);
      setTitle(file.name.split('.').slice(0, -1).join('.'));
      
      // Create preview URL for video
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'youtube' && !isValidUrl) {
      toast.error('Invalid URL', {
        description: 'Please enter a valid video URL'
      });
      return;
    }
    
    if (activeTab === 'upload' && !videoFile) {
      toast.error('Missing video', {
        description: 'Please select a video file to upload'
      });
      return;
    }
    
    uploadMutation.mutate();
  };
  
  const getPlatformIcon = () => {
    switch (sourceType) {
      case 'youtube': return <Youtube size={20} className="text-red-500" />;
      case 'twitch': return <Twitch size={20} className="text-purple-500" />;
      case 'vimeo': return <VideoIcon size={20} className="text-blue-500" />;
      case 'tiktok': return <Play size={20} className="text-black" />;
      default: return <Link size={20} />;
    }
  };
  
  const getPreviewEmbed = () => {
    if (!isValidUrl) return null;
    
    const videoId = extractVideoId(videoUrl, sourceType);
    if (!videoId) return null;
    
    switch (sourceType) {
      case 'youtube':
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video rounded-md"
            allowFullScreen
          ></iframe>
        );
      case 'twitch':
        return (
          <iframe
            src={`https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`}
            className="w-full aspect-video rounded-md"
            allowFullScreen
          ></iframe>
        );
      case 'vimeo':
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            className="w-full aspect-video rounded-md"
            allowFullScreen
          ></iframe>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-muted w-full aspect-video rounded-md">
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">{getPlatformIcon()}</div>
              <p className="text-sm text-muted-foreground">Preview not available</p>
              <p className="text-xs text-muted-foreground mt-1">{videoUrl}</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create New Reel
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share amazing moments with the Reelz community
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={tab => setActiveTab(tab as 'youtube' | 'upload')}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="youtube" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link size={16} className="mr-2" /> Add Link
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Upload size={16} className="mr-2" /> Upload Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="youtube" className="space-y-4">
              <div className="relative">
                <Input 
                  placeholder="Paste YouTube, Twitch, Vimeo or TikTok URL" 
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute left-3 top-3">
                  {getPlatformIcon()}
                </div>
                {videoUrl && !isValidUrl && (
                  <p className="text-xs text-destructive mt-1">
                    URL format not recognized. Please check and try again.
                  </p>
                )}
              </div>
              
              {isValidUrl && (
                <>
                  <div className="rounded-md overflow-hidden border">
                    {getPreviewEmbed()}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Start time (seconds)</p>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-muted-foreground" />
                        <Input 
                          type="number" 
                          value={clipStart}
                          min="0"
                          onChange={e => setClipStart(e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Duration (seconds)</p>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-muted-foreground" />
                        <Input 
                          type="number" 
                          value={clipDuration}
                          min="1"
                          max="60"
                          onChange={e => setClipDuration(e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max 60 seconds (fair use)
                      </p>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              {!videoFile ? (
                <motion.div 
                  className="border-2 border-dashed rounded-md overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="file"
                    id="videoUpload"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center py-10">
                    <motion.div 
                      className="bg-primary/10 p-4 rounded-full mb-3"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload size={40} className="text-primary mb-2" />
                    </motion.div>
                    <p className="font-medium text-lg">Click to upload</p>
                    <p className="text-sm text-muted-foreground mt-1">MP4, WebM or MOV (max. 50MB)</p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Only upload content you own or have rights to use
                    </p>
                  </label>
                </motion.div>
              ) : (
                <div className="rounded-md overflow-hidden border relative">
                  <button 
                    type="button" 
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1 z-10"
                    onClick={() => {
                      setVideoFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <X size={16} className="text-white" />
                  </button>
                  
                  {previewUrl && (
                    <video 
                      src={previewUrl} 
                      className="w-full aspect-video" 
                      controls
                    ></video>
                  )}
                  <div className="bg-muted/30 backdrop-blur-sm px-3 py-2">
                    <p className="text-sm truncate font-medium">{videoFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <div className="space-y-4 mt-6">
              <div className="space-y-1">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input 
                  id="title"
                  placeholder="Add a catchy title" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="description"
                  placeholder="Add some details about this clip" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={500}
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="tags" className="text-sm font-medium">Tags</label>
                <Input 
                  id="tags"
                  placeholder="funny, gaming, music (comma separated)" 
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
              
              {uploadMutation.isPending && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Uploading {activeTab === 'youtube' ? 'clip' : 'video'}...</p>
                    <span className="text-sm font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  disabled={uploadMutation.isPending || (activeTab === 'youtube' && !isValidUrl) || (activeTab === 'upload' && !videoFile)}
                >
                  {uploadMutation.isPending ? 'Processing...' : 'Add to Reelz'} 
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </motion.div>
            </div>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};
