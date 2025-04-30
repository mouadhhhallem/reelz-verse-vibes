
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ReelFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  mood: "energetic" | "calm" | "happy" | "sad" | "neutral";
  onMoodChange: (mood: "energetic" | "calm" | "happy" | "sad" | "neutral") => void;
}

export const ReelForm: React.FC<ReelFormProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
  mood,
  onMoodChange
}) => {
  const [tagInput, setTagInput] = React.useState("");

  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    onTagsChange([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const moodOptions: { value: "energetic" | "calm" | "happy" | "sad" | "neutral"; label: string; color: string }[] = [
    { value: "energetic", label: "Energetic", color: "from-orange-500 to-red-500" },
    { value: "calm", label: "Calm", color: "from-blue-400 to-teal-500" },
    { value: "happy", label: "Happy", color: "from-yellow-400 to-amber-500" },
    { value: "sad", label: "Sad", color: "from-indigo-500 to-purple-600" },
    { value: "neutral", label: "Neutral", color: "from-gray-500 to-gray-700" }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          placeholder="Add a title for your reel"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-1.5 bg-white/5"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          placeholder="Add a description for your reel"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="mt-1.5 min-h-20 bg-white/5"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2 mt-1.5">
          <Input 
            id="tags"
            placeholder="Add tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white/5"
          />
          <Button 
            onClick={handleAddTag} 
            type="button" 
            variant="outline"
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1 bg-white/10">
                <span>#{tag}</span>
                <button 
                  onClick={() => handleRemoveTag(tag)} 
                  type="button"
                  aria-label={`Remove ${tag} tag`}
                  className="ml-1 hover:bg-white/10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label>Mood</Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1.5">
          {moodOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              className={`h-full relative bg-gradient-to-br ${option.color} hover:shadow-lg transition-shadow ${
                mood === option.value ? 'ring-2 ring-white' : ''
              }`}
              onClick={() => onMoodChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
