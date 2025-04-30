
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { extractVideoId } from '@/lib/video-utils';

export interface ClipControlsProps {
  url: string;
  type: string;
}

export const ClipControls: React.FC<ClipControlsProps> = ({ url, type }) => {
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const MAX_DURATION = 60;

  const videoId = extractVideoId(url, type as any);

  if (!videoId) return null;

  return (
    <div className="space-y-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg">
      <div className="aspect-[16/9] w-full bg-black rounded-lg overflow-hidden">
        {type === 'youtube' && (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?start=${startTime}`}
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
            <span className="text-sm text-muted-foreground">{startTime}s</span>
          </div>
          <Slider 
            value={[startTime]} 
            onValueChange={(values) => setStartTime(values[0])}
            min={0}
            max={300}
            step={1}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Clip Duration (seconds)</Label>
            <span className="text-sm text-muted-foreground">{duration}s</span>
          </div>
          <Slider 
            value={[duration]} 
            onValueChange={(values) => setDuration(values[0])}
            min={5}
            max={MAX_DURATION}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};
