
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { ArrowRight, Link, Upload } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { VideoSourceType } from '@/types';
import { extractVideoId } from '@/lib/video-utils';

// Import sub-components
import { VideoPreview } from './VideoPreview';
import { FileUploadArea } from './FileUploadArea';
import { UrlInputField } from './UrlInputField';
import { ClipControls } from './ClipControls';
import { ReelForm } from './ReelForm';
import { UploadProgress } from './UploadProgress';

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'youtube' | 'upload' | 'twitch' | 'vimeo';
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
  
  const queryClient = useQueryClient();
  
  // Reset state when dialog closes or initialTab changes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
      
      // Set appropriate sourceType based on initialTab
      if (initialTab === 'youtube') setSourceType('youtube');
      if (initialTab === 'twitch') setSourceType('twitch');
      if (initialTab === 'vimeo') setSourceType('vimeo');
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
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={tab => setActiveTab(tab as 'youtube' | 'upload' | 'twitch' | 'vimeo')}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="youtube" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link size={16} className="mr-2" /> Add Link
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Upload size={16} className="mr-2" /> Upload Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="youtube" className="space-y-4">
              <UrlInputField 
                videoUrl={videoUrl}
                sourceType={sourceType}
                isValidUrl={isValidUrl}
                onChange={setVideoUrl}
              />
              
              {isValidUrl && (
                <>
                  <div className="rounded-md overflow-hidden border">
                    <VideoPreview 
                      videoFile={null}
                      previewUrl={null}
                      videoUrl={videoUrl}
                      isValidUrl={isValidUrl}
                      sourceType={sourceType}
                      onClearVideo={() => {}}
                    />
                  </div>
                  
                  <ClipControls
                    clipStart={clipStart}
                    clipDuration={clipDuration}
                    onStartChange={setClipStart}
                    onDurationChange={setClipDuration}
                  />
                </>
              )}
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              {!videoFile ? (
                <FileUploadArea onFileChange={handleFileChange} />
              ) : (
                <VideoPreview 
                  videoFile={videoFile}
                  previewUrl={previewUrl}
                  videoUrl=""
                  isValidUrl={false}
                  sourceType="upload"
                  onClearVideo={() => {
                    setVideoFile(null);
                    setPreviewUrl(null);
                  }}
                />
              )}
            </TabsContent>
            
            <div className="space-y-4 mt-6">
              <ReelForm
                title={title}
                description={description}
                tags={tags}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onTagsChange={setTags}
              />
              
              <UploadProgress 
                isUploading={uploadMutation.isPending}
                activeTab={activeTab}
                uploadProgress={uploadProgress}
              />
              
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
