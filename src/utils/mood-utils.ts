
import { Reel, ReelMood } from '@/types';

export const getMoodGradient = (reel: Reel | null) => {
  if (!reel) return 'bg-gradient-to-br from-gray-500 to-gray-700';
  
  switch(reel.mood) {
    case 'energetic': return 'bg-gradient-to-br from-orange-500 to-red-500';
    case 'calm': return 'bg-gradient-to-br from-blue-400 to-teal-500';
    case 'happy': return 'bg-gradient-to-br from-yellow-400 to-amber-500';
    case 'sad': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
    case 'cosmic': return 'bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-700';
    case 'nebula': return 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600';
    case 'aurora': return 'bg-gradient-to-br from-green-400 via-cyan-500 to-blue-600';
    default: return 'bg-gradient-to-br from-gray-500 to-gray-700';
  }
};

export const getAllMoods = () => [
  { id: 'energetic', name: 'Energetic', emoji: '⚡', 
    description: 'High energy and excitement' },
  { id: 'calm', name: 'Calm', emoji: '🧘', 
    description: 'Peaceful and serene' },
  { id: 'happy', name: 'Happy', emoji: '😊', 
    description: 'Joyful and uplifting' },
  { id: 'sad', name: 'Sad', emoji: '😢', 
    description: 'Emotional and reflective' },
  { id: 'cosmic', name: 'Cosmic', emoji: '🌌', 
    description: 'Otherworldly and mystical' },
  { id: 'nebula', name: 'Nebula', emoji: '✨', 
    description: 'Dreamy and ethereal' },
  { id: 'aurora', name: 'Aurora', emoji: '🌠', 
    description: 'Vibrant and colorful' },
  { id: 'neutral', name: 'Neutral', emoji: '😎', 
    description: 'Balanced and standard' }
];

export const getMoodEmoji = (mood: string): string => {
  const foundMood = getAllMoods().find(m => m.id === mood);
  return foundMood ? foundMood.emoji : '😎';
};

export const getMoodName = (mood: string): string => {
  const foundMood = getAllMoods().find(m => m.id === mood);
  return foundMood ? foundMood.name : 'Neutral';
};
