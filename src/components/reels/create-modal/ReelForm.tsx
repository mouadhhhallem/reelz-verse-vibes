
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { ReelMood } from '@/types';
import { getAllMoods, getMoodGradient, getMoodEmoji } from '@/utils/mood-utils';

interface ReelFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  mood: ReelMood;
  onMoodChange: (mood: ReelMood) => void;
}

export const ReelForm: React.FC<ReelFormProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
  mood,
  onMoodChange,
}) => {
  const [tagInput, setTagInput] = React.useState('');
  
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };
  
  const availableMoods = getAllMoods();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          placeholder="Give your reel a catchy title" 
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe what's in your reel" 
          className="resize-none h-28"
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mood">Mood</Label>
        <div className="grid grid-cols-4 gap-2">
          {availableMoods.map(moodItem => (
            <button
              key={moodItem.id}
              type="button"
              onClick={() => onMoodChange(moodItem.id as ReelMood)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                mood === moodItem.id
                  ? 'border-primary bg-primary/10 shadow-md transform scale-105'
                  : 'border-border bg-card/50 hover:bg-card/80'
              }`}
            >
              <span className="text-2xl mb-1">{moodItem.emoji}</span>
              <span className="text-xs font-medium">{moodItem.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Add tags and press Enter"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleTagInput}
        />
        
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {tag}
              <button 
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-destructive/20"
              >
                <X size={12} />
                <span className="sr-only">Remove tag</span>
              </button>
            </Badge>
          ))}
          {!tags.length && (
            <span className="text-xs text-muted-foreground">
              No tags added yet. Tags help others discover your reel.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReelForm;
