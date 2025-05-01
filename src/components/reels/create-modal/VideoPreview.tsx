
import React from 'react';
import { motion } from 'framer-motion';
import { extractVideoId } from '@/lib/video-utils';

interface VideoPreviewProps {
  file?: File;
  url?: string;
  type?: 'youtube' | 'twitch' | 'vimeo' | 'upload';
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ file, url, type }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  
  React.useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);
  
  if (!file && !url) {
    return null;
  }

  // Extract video ID based on platform
  const videoId = url ? extractVideoId(url, type as any) : null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-h-64 overflow-hidden rounded-lg"
    >
      <div className="aspect-video w-full max-w-md mx-auto bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden">
        {file ? (
          <video 
            src={previewUrl} 
            className="w-full h-full object-contain" 
            controls 
          />
        ) : url && type === 'youtube' && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : url && type === 'vimeo' && videoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            className="w-full aspect-video"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : url && type === 'twitch' && videoId ? (
          <iframe
            src={`https://clips.twitch.tv/embed?clip=${videoId}&parent=${window.location.hostname}`}
            className="w-full aspect-video"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Preview not available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
