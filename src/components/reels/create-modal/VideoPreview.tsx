
import React, { useEffect, useRef } from 'react';

export interface VideoPreviewProps {
  file: File | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ file }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!file || !videoRef.current) return;
    
    const videoUrl = URL.createObjectURL(file);
    videoRef.current.src = videoUrl;
    
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [file]);

  if (!file) return null;

  return (
    <div className="relative w-full aspect-[9/16] max-h-64 rounded-lg overflow-hidden bg-black/30">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        muted
      />
    </div>
  );
};
