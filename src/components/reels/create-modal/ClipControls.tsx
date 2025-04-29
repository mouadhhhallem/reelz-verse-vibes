
import React from 'react';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface ClipControlsProps {
  clipStart: string;
  clipDuration: string;
  onStartChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}

export const ClipControls: React.FC<ClipControlsProps> = ({
  clipStart,
  clipDuration,
  onStartChange,
  onDurationChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Start time (seconds)</p>
        <div className="flex items-center">
          <Clock size={16} className="mr-2 text-muted-foreground" />
          <Input 
            type="number" 
            value={clipStart}
            min="0"
            onChange={e => onStartChange(e.target.value)}
            className="h-8"
          />
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Duration (seconds)</p>
        <div className="flex items-center">
          <Clock size={16} className="mr-2 text-muted-foreground" />
          <Input 
            type="number" 
            value={clipDuration}
            min="1"
            max="60"
            onChange={e => onDurationChange(e.target.value)}
            className="h-8"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Max 60 seconds (fair use)
        </p>
      </div>
    </div>
  );
};
