
import { Reel } from '@/types';

export const getMoodGradient = (reel: Reel | null) => {
  if (!reel) return 'bg-gradient-to-br from-gray-500 to-gray-700';
  
  switch(reel.mood) {
    case 'energetic': return 'bg-gradient-to-br from-orange-500 to-red-500';
    case 'calm': return 'bg-gradient-to-br from-blue-400 to-teal-500';
    case 'happy': return 'bg-gradient-to-br from-yellow-400 to-amber-500';
    case 'sad': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
    default: return 'bg-gradient-to-br from-gray-500 to-gray-700';
  }
};
