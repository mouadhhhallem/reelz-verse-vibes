
import React from 'react';
import { X } from 'lucide-react';
import { VideoSourceType } from '@/types';
import { extractVideoId } from '@/lib/video-utils';

interface VideoPreviewProps {
  videoFile: File | null;
  previewUrl: string | null;
  videoUrl: string;
  isValidUrl: boolean;
  sourceType: VideoSourceType;
  onClearVideo: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoFile,
  previewUrl,
  videoUrl,
  isValidUrl,
  sourceType,
  onClearVideo,
}) => {
  // For uploaded files
  if (videoFile && previewUrl) {
    return (
      <div className="rounded-md overflow-hidden border relative">
        <button 
          type="button" 
          className="absolute top-2 right-2 bg-black/60 rounded-full p-1 z-10"
          onClick={onClearVideo}
        >
          <X size={16} className="text-white" />
        </button>
        
        <video 
          src={previewUrl} 
          className="w-full aspect-video" 
          controls
        ></video>
        <div className="bg-muted/30 backdrop-blur-sm px-3 py-2">
          <p className="text-sm truncate font-medium">{videoFile.name}</p>
          <p className="text-xs text-muted-foreground">
            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
    );
  }

  // For external URLs
  if (isValidUrl) {
    const videoId = extractVideoId(videoUrl, sourceType);
    if (!videoId) return null;
    
    switch (sourceType) {
      case 'youtube':
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video rounded-md"
            allowFullScreen
            title="YouTube video"
          ></iframe>
        );
      case 'twitch':
        return (
          <iframe
            src={`https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`}
            className="w-full aspect-video rounded-md"
            allowFullScreen
            title="Twitch video"
          ></iframe>
        );
      case 'vimeo':
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            className="w-full aspect-video rounded-md"
            allowFullScreen
            title="Vimeo video"
          ></iframe>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-muted w-full aspect-video rounded-md">
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                {getPlatformIcon(sourceType)}
              </div>
              <p className="text-sm text-muted-foreground">Preview not available</p>
              <p className="text-xs text-muted-foreground mt-1">{videoUrl}</p>
            </div>
          </div>
        );
    }
  }
  
  return null;
};

const getPlatformIcon = (sourceType: VideoSourceType) => {
  const { Youtube, Twitch, VideoIcon, Play, Link } = require('lucide-react');
  
  switch (sourceType) {
    case 'youtube': return <Youtube size={20} className="text-red-500" />;
    case 'twitch': return <Twitch size={20} className="text-purple-500" />;
    case 'vimeo': return <VideoIcon size={20} className="text-blue-500" />;
    case 'tiktok': return <Play size={20} className="text-black" />;
    default: return <Link size={20} />;
  }
};
