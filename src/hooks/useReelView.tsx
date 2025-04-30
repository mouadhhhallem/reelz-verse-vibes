
import { useState, useEffect } from 'react';

export const useReelView = () => {
  const [showControls, setShowControls] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);

  // Show/hide controls on mouse movement
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);
  
  // Animate reactions
  useEffect(() => {
    if (reactions.length > 0) {
      const timeout = setTimeout(() => {
        setReactions([]);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [reactions]);

  const addReaction = (emoji: string) => {
    setReactions(prev => [...prev, emoji]);
    setShowEmojis(false);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  return {
    showControls,
    showEmojis,
    reactions,
    addReaction,
    toggleEmojis,
    setShowEmojis
  };
};
