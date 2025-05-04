
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadArea } from "./FileUploadArea";
import { UrlInputField } from "./UrlInputField";
import { VideoPreview } from "./VideoPreview";
import { ClipControls } from "./ClipControls";
import { ReelForm } from "./ReelForm";
import { UploadProgress } from "./UploadProgress";
import { SubmitButton } from "./SubmitButton";
import { ReelMood } from "@/types";

export type ModalTab = "upload" | "youtube" | "twitch" | "vimeo";

interface CreateReelModalContentProps {
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
  onTagsChange: (tags: string[]) => void;
  mood: ReelMood;
  onMoodChange: (mood: ReelMood) => void;
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
  onCancel,
}) => {
  const handleTabChange = (value: string) => {
    onTabChange(value as ModalTab);
  };

  return (
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

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TabsContent value="upload" className="m-0">
              <FileUploadArea onChange={onVideoFileChange} file={videoFile} />
            </TabsContent>

            <TabsContent value="youtube" className="m-0">
              <UrlInputField 
                value={videoUrl}
                onChange={onVideoUrlChange}
                placeholder="Paste YouTube video URL"
                type="youtube"
              />
            </TabsContent>
            
            <TabsContent value="twitch" className="m-0">
              <UrlInputField 
                value={videoUrl}
                onChange={onVideoUrlChange}
                placeholder="Paste Twitch clip URL"
                type="twitch"
              />
            </TabsContent>
            
            <TabsContent value="vimeo" className="m-0">
              <UrlInputField 
                value={videoUrl}
                onChange={onVideoUrlChange}
                placeholder="Paste Vimeo video URL"
                type="vimeo"
              />
            </TabsContent>
            
            {/* Preview container with fixed height */}
            <div className="h-52 overflow-hidden">
              {videoFile && <VideoPreview file={videoFile} />}
              {videoUrl && <VideoPreview url={videoUrl} type={activeTab} />}
            </div>
            
            {/* Show clip controls for both uploaded videos and external links */}
            {(videoFile || videoUrl) && (
              <ClipControls 
                url={videoFile ? URL.createObjectURL(videoFile) : videoUrl} 
                type={activeTab}
                clipStart={clipStart}
                onClipStartChange={onClipStartChange}
                clipDuration={clipDuration}
                onClipDurationChange={onClipDurationChange} 
              />
            )}
          </div>
          
          <div className="space-y-6">
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
          </div>
        </div>

        <UploadProgress 
          isUploading={isUploading}
          activeTab={activeTab}
          uploadProgress={uploadProgress}
        />

        <SubmitButton 
          isUploading={isUploading}
          disabled={(!videoFile && !videoUrl)}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </Tabs>
    </div>
  );
};
