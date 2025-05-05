
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModalHeader } from './ModalHeader';
import { FileUploadArea } from './FileUploadArea';
import { UrlInputField } from './UrlInputField';
import { VideoPreview } from './VideoPreview';
import { ReelForm } from './ReelForm';
import { SubmitButton } from './SubmitButton';
import { UploadProgress } from './UploadProgress';
import { ModalTab } from '@/hooks/useReelUpload';
import { ReelMood } from '@/types';
import { ClipControls } from './ClipControls';

export interface CreateReelModalContentProps {
  activeTab: ModalTab;
  onTabChange: (value: ModalTab) => void;
  videoFile: File | null;
  videoUrl: string;
  onVideoFileChange: (file: File | null) => void;
  onVideoUrlChange: (url: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  tags: string[];
  onTagsChange: (value: string[]) => void;
  mood: ReelMood;
  onMoodChange: (value: ReelMood) => void;
  clipStart: number;
  onClipStartChange: (value: number) => void;
  clipDuration: number | null;
  onClipDurationChange: (value: number | null) => void;
  isUploading: boolean;
  uploadProgress: number;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CreateReelModalContent: React.FC<CreateReelModalContentProps> = ({
  activeTab,
  onTabChange,
  videoFile,
  videoUrl,
  onVideoFileChange,
  onVideoUrlChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
  mood,
  onMoodChange,
  clipStart,
  onClipStartChange,
  clipDuration,
  onClipDurationChange,
  isUploading,
  uploadProgress,
  onSubmit,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  
  const handleNext = () => {
    if (step === 1 && (videoFile || videoUrl)) {
      setStep(2);
    }
  };
  
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <div className="flex flex-col h-full">
      <ModalHeader title="Create new Reel" onCancel={onCancel} />
      
      {isUploading ? (
        <UploadProgress progress={uploadProgress} />
      ) : (
        <form className="flex flex-col h-full" onSubmit={handleSubmit}>
          <ScrollArea className="flex-1 px-6">
            {step === 1 && (
              <>
                <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ModalTab)} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="upload">Upload Video</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                    <TabsTrigger value="twitch">Twitch</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-6">
                    <FileUploadArea 
                      onChange={onVideoFileChange}
                      file={videoFile}
                    />
                    
                    {videoFile && (
                      <VideoPreview file={videoFile} />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="youtube" className="space-y-6">
                    <UrlInputField 
                      value={videoUrl} 
                      onChange={onVideoUrlChange}
                      placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
                    />
                    
                    {videoUrl && (
                      <VideoPreview url={videoUrl} type="youtube" />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="twitch" className="space-y-6">
                    <UrlInputField 
                      value={videoUrl} 
                      onChange={onVideoUrlChange}
                      placeholder="Enter Twitch clip URL"
                    />
                    
                    {videoUrl && (
                      <VideoPreview url={videoUrl} type="twitch" />
                    )}
                  </TabsContent>
                </Tabs>
                
                {/* Video Clip Controls */}
                {(videoFile || videoUrl) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Customize Clip</h3>
                    <ClipControls 
                      url={videoUrl} 
                      type={activeTab}
                      clipStart={clipStart}
                      onClipStartChange={onClipStartChange}
                      clipDuration={clipDuration}
                      onClipDurationChange={onClipDurationChange}
                    />
                  </div>
                )}
              </>
            )}
            
            {step === 2 && (
              <ReelForm 
                title={title}
                onTitleChange={onTitleChange}
                description={description}
                onDescriptionChange={onDescriptionChange}
                tags={tags}
                onTagsChange={onTagsChange}
                mood={mood}
                onMoodChange={onMoodChange}
              />
            )}
          </ScrollArea>
          
          <div className="p-6 border-t">
            <div className="flex justify-between">
              {step === 2 ? (
                <>
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <SubmitButton type="submit" />
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    disabled={!videoFile && !videoUrl}
                  >
                    Next
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
