
import React, { createContext, useContext, useState, useEffect } from 'react';

export type MoodTheme = 'energetic' | 'calm' | 'happy' | 'sad' | 'neutral' | 'cosmic' | 'nebula' | 'aurora';

interface MoodThemeContextType {
  mood: MoodTheme;
  setMood: (mood: MoodTheme) => void;
  getMoodColor: () => string;
  getMoodGradient: () => string;
  getNebulaEffect: () => string;
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

// Enhanced color themes based on cosmic moods
const moodColors = {
  energetic: '#F97316', // Orange
  calm: '#0EA5E9',     // Blue
  happy: '#FACC15',    // Yellow
  sad: '#6D28D9',      // Purple
  neutral: '#94A3B8',  // Slate
  cosmic: '#8B5CF6',   // Vivid Purple
  nebula: '#D6BCFA',   // Light Purple
  aurora: '#7C3AED',   // Deep Purple
};

// Enhanced gradients with cosmic themes
const moodGradients = {
  energetic: 'bg-gradient-to-br from-orange-500 to-rose-500',
  calm: 'bg-gradient-to-br from-blue-500 to-cyan-400',
  happy: 'bg-gradient-to-br from-yellow-400 to-amber-500',
  sad: 'bg-gradient-to-br from-purple-600 to-indigo-600',
  neutral: 'bg-gradient-to-br from-slate-600 to-slate-400',
  cosmic: 'bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-700',
  nebula: 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600',
  aurora: 'bg-gradient-to-br from-green-400 via-cyan-500 to-blue-600',
};

// New nebula effects for cosmic UI
const nebulaEffects = {
  energetic: 'animate-pulse-slow bg-gradient-radial from-orange-500/20 via-rose-500/10 to-transparent',
  calm: 'animate-float bg-gradient-radial from-blue-500/20 via-cyan-400/10 to-transparent',
  happy: 'animate-bounce-soft bg-gradient-radial from-yellow-400/20 via-amber-500/10 to-transparent',
  sad: 'animate-pulse bg-gradient-radial from-purple-600/20 via-indigo-600/10 to-transparent',
  neutral: 'bg-gradient-radial from-slate-600/20 via-slate-400/10 to-transparent',
  cosmic: 'animate-cosmic-shimmer bg-gradient-radial from-violet-600/30 via-purple-500/20 to-transparent',
  nebula: 'animate-float bg-gradient-radial from-pink-400/30 via-purple-500/20 to-indigo-600/10',
  aurora: 'animate-pulse-slow bg-gradient-radial from-green-400/30 via-cyan-500/20 to-blue-600/10',
};

interface MoodThemeProviderProps {
  children: React.ReactNode;
  initialMood?: MoodTheme;
}

export const MoodThemeProvider: React.FC<MoodThemeProviderProps> = ({ 
  children,
  initialMood = 'cosmic' // Default to cosmic theme
}) => {
  const [mood, setMood] = useState<MoodTheme>(initialMood);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  
  // Detect time of day for adaptive theming
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 10) setTimeOfDay('morning');
      else if (hour >= 10 && hour < 17) setTimeOfDay('day');
      else if (hour >= 17 && hour < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };
    
    updateTimeOfDay();
    const intervalId = setInterval(updateTimeOfDay, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Apply time-based theme adjustments
  useEffect(() => {
    const root = document.documentElement;
    
    // Adjust theme based on time of day
    switch(timeOfDay) {
      case 'morning':
        root.style.setProperty('--theme-intensity', '0.8');
        root.style.setProperty('--theme-warmth', '1.1');
        break;
      case 'day':
        root.style.setProperty('--theme-intensity', '1');
        root.style.setProperty('--theme-warmth', '1');
        break;
      case 'evening':
        root.style.setProperty('--theme-intensity', '0.9');
        root.style.setProperty('--theme-warmth', '1.2');
        break;
      case 'night':
        root.style.setProperty('--theme-intensity', '0.7');
        root.style.setProperty('--theme-warmth', '0.9');
        break;
    }
  }, [timeOfDay]);
  
  // Update CSS variables when mood changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mood-color', moodColors[mood]);
    
    // Add a class to the body to allow for different CSS selectors
    document.body.className = document.body.className
      .replace(/mood-\w+/g, '')
      .trim();
    document.body.classList.add(`mood-${mood}`);
  }, [mood]);
  
  // Get the color for current mood
  const getMoodColor = () => moodColors[mood];
  
  // Get the gradient class for current mood
  const getMoodGradient = () => moodGradients[mood];
  
  // Get the nebula effect for current mood
  const getNebulaEffect = () => nebulaEffects[mood];
  
  return (
    <MoodThemeContext.Provider value={{ 
      mood, 
      setMood, 
      getMoodColor, 
      getMoodGradient, 
      getNebulaEffect 
    }}>
      {children}
    </MoodThemeContext.Provider>
  );
};

// Custom hook for using the mood theme
export const useMoodTheme = () => {
  const context = useContext(MoodThemeContext);
  
  if (context === undefined) {
    throw new Error('useMoodTheme must be used within a MoodThemeProvider');
  }
  
  return context;
};
