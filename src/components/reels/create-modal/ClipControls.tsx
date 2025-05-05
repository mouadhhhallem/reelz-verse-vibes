
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { extractVideoId } from '@/lib/video-utils';

export interface ClipControlsProps {
  url: string;
  type: string;
  clipStart: number;
  onClipStartChange: (value: number) => void;
  clipDuration: number | null;
  onClipDurationChange: (value: number | null) => void;
}

export const ClipControls: React.FC<ClipControlsProps> = ({ 
  url, 
  type, 
  clipStart, 
  onClipStartChange, 
  clipDuration, 
  onClipDurationChange 
}) => {
  const MAX_DURATION = 60;

  const videoId = extractVideoId(url, type as any);

  // Initialize duration with clipDuration or default value
  useEffect(() => {
    if (clipDuration === null) {
      onClipDurationChange(30); // Default duration
    }
  }, []);

  if (!videoId) return null;

  return (
    <div className="space-y-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg">
      <div className="aspect-[16/9] w-full bg-black rounded-lg overflow-hidden">
        {type === 'youtube' && (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?start=${clipStart}`}
            className="w-full h-full"
            allowFullScreen
          />
        )}
        {type === 'vimeo' && (
          <iframe 
            src={`https://player.vimeo.com/video/${videoId}`}
            className="w-full h-full"
            allowFullScreen
          />
        )}
        {type === 'twitch' && (
          <iframe 
            src={`https://clips.twitch.tv/embed?clip=${videoId}&parent=${window.location.hostname}`}
            className="w-full h-full"
            allowFullScreen
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Start Time (seconds)</Label>
            <span className="text-sm text-muted-foreground">{clipStart}s</span>
          </div>
          <Slider 
            value={[clipStart]} 
            onValueChange={(values) => onClipStartChange(values[0])}
            min={0}
            max={300}
            step={1}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Clip Duration (seconds)</Label>
            <span className="text-sm text-muted-foreground">{clipDuration || 0}s</span>
          </div>
          <Slider 
            value={[clipDuration || 0]} 
            onValueChange={(values) => onClipDurationChange(values[0])}
            min={5}
            max={MAX_DURATION}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};
