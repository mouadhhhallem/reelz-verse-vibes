
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';

export interface UrlInputFieldProps {
  value: string;
  onChange: (url: string) => void;
  placeholder: string;
  type: string;
}

export const UrlInputField: React.FC<UrlInputFieldProps> = ({ value, onChange, placeholder, type }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`${type}-url`}>
        {type === 'youtube' ? 'YouTube URL' : 
         type === 'twitch' ? 'Twitch Clip URL' : 
         type === 'vimeo' ? 'Vimeo Video URL' : 'Video URL'}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-muted-foreground">
          <Link size={16} />
        </div>
        <Input 
          id={`${type}-url`}
          type="url"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-10 bg-white/5"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {type === 'youtube' && 'Paste a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=xxxx)'}
        {type === 'twitch' && 'Paste a valid Twitch clip URL (e.g., https://clips.twitch.tv/xxxx)'}
        {type === 'vimeo' && 'Paste a valid Vimeo video URL (e.g., https://vimeo.com/xxxx)'}
      </p>
    </div>
  );
};
