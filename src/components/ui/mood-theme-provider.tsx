
import React, { createContext, useContext, useState, useEffect } from 'react';

export type MoodTheme = 'energetic' | 'calm' | 'happy' | 'sad' | 'neutral';

interface MoodThemeContextType {
  mood: MoodTheme;
  setMood: (mood: MoodTheme) => void;
  getMoodColor: () => string;
  getMoodGradient: () => string;
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

// Color themes based on moods
const moodColors = {
  energetic: '#F97316', // Orange
  calm: '#0EA5E9',     // Blue
  happy: '#FACC15',    // Yellow
  sad: '#6D28D9',      // Purple
  neutral: '#94A3B8'   // Slate
};

// Gradient themes based on moods
const moodGradients = {
  energetic: 'bg-gradient-to-br from-orange-500 to-rose-500',
  calm: 'bg-gradient-to-br from-blue-500 to-cyan-400',
  happy: 'bg-gradient-to-br from-yellow-400 to-amber-500',
  sad: 'bg-gradient-to-br from-purple-600 to-indigo-600',
  neutral: 'bg-gradient-to-br from-slate-600 to-slate-400'
};

interface MoodThemeProviderProps {
  children: React.ReactNode;
  initialMood?: MoodTheme;
}

export const MoodThemeProvider: React.FC<MoodThemeProviderProps> = ({ 
  children,
  initialMood = 'neutral'
}) => {
  const [mood, setMood] = useState<MoodTheme>(initialMood);
  
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
  
  return (
    <MoodThemeContext.Provider value={{ mood, setMood, getMoodColor, getMoodGradient }}>
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
