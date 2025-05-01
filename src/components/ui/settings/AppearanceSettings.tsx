
import React from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from 'next-themes';
import { useMoodTheme } from '@/components/ui/mood-theme-provider';

interface AppearanceSettingsProps {
  className?: string;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const { mood, setMood } = useMoodTheme();
  
  // Local state for UI settings (these would typically be stored in a context or localStorage)
  const [reducedMotion, setReducedMotion] = React.useState(() => {
    return localStorage.getItem('reducedMotion') === 'true';
  });
  
  const [highContrast, setHighContrast] = React.useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  // Handle dark mode toggle
  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  // Handle reduced motion toggle
  const handleReducedMotionChange = (checked: boolean) => {
    setReducedMotion(checked);
    localStorage.setItem('reducedMotion', String(checked));
    
    // Apply reduced motion to HTML element
    if (checked) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };
  
  // Handle high contrast toggle
  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem('highContrast', String(checked));
    
    // Apply high contrast to HTML element
    if (checked) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  // Apply settings on mount
  React.useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    // Clean up on unmount
    return () => {
      // Only remove if we added them
      if (reducedMotion) {
        document.documentElement.classList.remove('reduce-motion');
      }
      
      if (highContrast) {
        document.documentElement.classList.remove('high-contrast');
      }
    };
  }, [reducedMotion, highContrast]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Appearance</h2>
      
      <div className="space-y-4">
        {/* Dark Mode */}
        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
          <div>
            <Label className="text-base font-medium">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark themes
            </p>
          </div>
          <Switch 
            checked={theme === 'dark'}
            onCheckedChange={handleThemeChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        {/* Reduced Motion */}
        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
          <div>
            <Label className="text-base font-medium">Reduced Motion</Label>
            <p className="text-sm text-muted-foreground">
              Minimize animations and motion effects
            </p>
          </div>
          <Switch 
            checked={reducedMotion}
            onCheckedChange={handleReducedMotionChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        {/* High Contrast */}
        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
          <div>
            <Label className="text-base font-medium">High Contrast</Label>
            <p className="text-sm text-muted-foreground">
              Enhance visibility with higher contrast
            </p>
          </div>
          <Switch 
            checked={highContrast}
            onCheckedChange={handleHighContrastChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-semibold">Mood Settings</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {["energetic", "calm", "happy", "sad", "neutral"].map((moodOption) => (
            <button
              key={moodOption}
              onClick={() => setMood(moodOption as any)}
              className={`p-3 rounded-lg transition-all ${
                mood === moodOption 
                  ? 'ring-2 ring-primary bg-primary/20' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-xl mb-1">
                  {moodOption === "energetic" && "⚡"}
                  {moodOption === "calm" && "🌊"}
                  {moodOption === "happy" && "😄"}
                  {moodOption === "sad" && "💜"}
                  {moodOption === "neutral" && "✨"}
                </span>
                <span className="text-sm font-medium capitalize">{moodOption}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
