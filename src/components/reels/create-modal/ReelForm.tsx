
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ReelFormProps {
  title: string;
  description: string;
  tags: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

export const ReelForm: React.FC<ReelFormProps> = ({
  title,
  description,
  tags,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input 
          id="title"
          placeholder="Add a catchy title" 
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          maxLength={100}
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea 
          id="description"
          placeholder="Add some details about this clip" 
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          maxLength={500}
          className="resize-none"
          rows={3}
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="tags" className="text-sm font-medium">Tags</label>
        <Input 
          id="tags"
          placeholder="funny, gaming, music (comma separated)" 
          value={tags}
          onChange={e => onTagsChange(e.target.value)}
        />
      </div>
    </div>
  );
};
