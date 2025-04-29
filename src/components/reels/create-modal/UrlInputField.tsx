
import React from 'react';
import { Input } from '@/components/ui/input';
import { VideoSourceType } from '@/types';

interface UrlInputFieldProps {
  videoUrl: string;
  sourceType: VideoSourceType;
  isValidUrl: boolean;
  onChange: (url: string) => void;
}

export const UrlInputField: React.FC<UrlInputFieldProps> = ({ 
  videoUrl, 
  sourceType, 
  isValidUrl, 
  onChange 
}) => {
  return (
    <div className="relative">
      <Input 
        placeholder="Paste YouTube, Twitch, Vimeo or TikTok URL" 
        value={videoUrl}
        onChange={e => onChange(e.target.value)}
        className="pl-10"
      />
      <div className="absolute left-3 top-3">
        {getPlatformIcon(sourceType)}
      </div>
      {videoUrl && !isValidUrl && (
        <p className="text-xs text-destructive mt-1">
          URL format not recognized. Please check and try again.
        </p>
      )}
    </div>
  );
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
