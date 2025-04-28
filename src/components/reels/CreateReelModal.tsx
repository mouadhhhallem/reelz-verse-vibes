
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, ArrowRight, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateReelModal: React.FC<CreateReelModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Reset state when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setYoutubeUrl('');
      setVideoFile(null);
      setTitle('');
      setDescription('');
      setTags('');
      setUploadProgress(0);
      setPreviewUrl(null);
    }
  }, [isOpen]);
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (activeTab === 'youtube') {
        return apiClient.uploadVideo(youtubeUrl, {
          title,
          description,
          tags: tags.split(',').map(tag => tag.trim())
        });
      } else if (videoFile) {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadProgress(i);
        }
        
        return apiClient.uploadVideo(videoFile, {
          title,
          description,
          tags: tags.split(',').map(tag => tag.trim())
        });
      }
      throw new Error('No video source selected');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      toast({
        title: 'Success',
        description: 'Your reel has been uploaded successfully',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to upload your reel',
        variant: 'destructive',
      });
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Create preview URL for video
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'youtube' && !youtubeUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a YouTube URL',
        variant: 'destructive',
      });
      return;
    }
    
    if (activeTab === 'upload' && !videoFile) {
      toast({
        title: 'Error',
        description: 'Please select a video file',
        variant: 'destructive',
      });
      return;
    }
    
    if (!title) {
      toast({
        title: 'Error',
        description: 'Please enter a title',
        variant: 'destructive',
      });
      return;
    }
    
    uploadMutation.mutate();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Reel</DialogTitle>
          <DialogDescription>
            Share your moments with the world
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="youtube" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
            </TabsList>
            
            <TabsContent value="youtube" className="space-y-4">
              <Input 
                placeholder="Paste YouTube URL here" 
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
              />
              
              {youtubeUrl && (
                <div className="rounded-md overflow-hidden border">
                  <iframe
                    src={`https://www.youtube.com/embed/${apiClient.extractYouTubeId(youtubeUrl)}`}
                    className="w-full aspect-video"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              {!videoFile ? (
                <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    id="videoUpload"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center">
                    <Upload size={40} className="text-muted-foreground mb-2" />
                    <p className="font-medium text-lg">Click to upload</p>
                    <p className="text-sm text-muted-foreground">MP4, WebM or MOV (max. 30MB)</p>
                  </label>
                </div>
              ) : (
                <div className="rounded-md overflow-hidden border relative">
                  <button 
                    type="button" 
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                    onClick={() => {
                      setVideoFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                  
                  {previewUrl && (
                    <video 
                      src={previewUrl} 
                      className="w-full aspect-video" 
                      controls
                    ></video>
                  )}
                  <p className="text-sm px-2 py-1 truncate">{videoFile.name}</p>
                </div>
              )}
            </TabsContent>
            
            <div className="space-y-4 mt-4">
              <Input 
                placeholder="Title" 
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              
              <Textarea 
                placeholder="Description" 
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              
              <Input 
                placeholder="Tags (comma separated)" 
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
              
              {uploadMutation.isPending && (
                <div className="space-y-2">
                  <p className="text-sm">Uploading your reel...</p>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Create Reel'} 
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};
