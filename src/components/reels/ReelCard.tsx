
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Reel } from '@/types';
import { useBatchSelection } from '@/contexts/BatchSelectionContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ReelCardProps {
  reel: Reel;
  isFavorited?: boolean;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, isFavorited = false }) => {
  const { videoRef, containerRef, isVisible, isPlaying, togglePlayback } = useVideoPlayback(0.6);
  const { isSelectionMode, toggleReelSelection, isSelected } = useBatchSelection();
  const queryClient = useQueryClient();
  
  const selected = isSelected(reel.id);
  
  // Get mood-based background gradient
  const getMoodGradient = () => {
    switch(reel.mood) {
      case 'energetic': return 'bg-gradient-to-br from-orange-500 to-red-500';
      case 'calm': return 'bg-gradient-to-br from-blue-400 to-teal-500';
      case 'happy': return 'bg-gradient-to-br from-yellow-400 to-amber-500';
      case 'sad': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-700';
    }
  };
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: () => {
      return isFavorited 
        ? apiClient.removeFromFavorites(reel.id)
        : apiClient.addToFavorites(reel.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    }
  });
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate();
  };
  
  const handleCardClick = () => {
    if (isSelectionMode) {
      toggleReelSelection(reel.id);
    } else if (!reel.isYouTube) {
      togglePlayback();
    }
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className={`reel-card relative aspect-[9/16] w-full h-full max-h-[90vh] mx-auto ${getMoodGradient()} overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {isSelectionMode && (
        <div className="absolute top-4 left-4 z-30">
          <Checkbox 
            checked={selected}
            onCheckedChange={() => toggleReelSelection(reel.id)}
            className="h-6 w-6 bg-white/80"
          />
        </div>
      )}
      
      <div className="absolute inset-0" onClick={handleCardClick}>
        {reel.isYouTube ? (
          <iframe
            ref={videoRef as React.RefObject<HTMLIFrameElement>}
            src={`${reel.videoUrl}?autoplay=${isVisible ? 1 : 0}&mute=1&controls=0&modestbranding=1&loop=1&playlist=${reel.youtubeId}`}
            title={reel.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video
            ref={videoRef as React.RefObject<HTMLVideoElement>}
            src={reel.videoUrl}
            poster={reel.thumbnailUrl}
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
          ></video>
        )}
        
        <div className="video-overlay"></div>
        
        {!reel.isYouTube && !isPlaying && isVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/30 rounded-full p-4"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" fill="white" />
              </svg>
            </motion.div>
          </div>
        )}
      </div>
      
      <Link 
        to={`/reel/${reel.id}`} 
        className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white"
        onClick={(e) => isSelectionMode && e.preventDefault()}
      >
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">{reel.title}</h3>
            <div className="flex items-center space-x-2 mt-2">
              <img 
                src={reel.user.avatar} 
                alt={reel.user.name} 
                className="w-8 h-8 rounded-full border border-white/50"
              />
              <span className="text-sm font-medium">@{reel.user.username}</span>
            </div>
            <div className="mt-2 line-clamp-1">
              {reel.tags.map(tag => (
                <span key={tag} className="text-xs mr-1 bg-white/20 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button 
              size="icon" 
              className={`rounded-full ${isFavorited ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={handleFavoriteClick}
            >
              <Heart fill={isFavorited ? "white" : "none"} size={20} className="text-white" />
            </Button>
            <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
              <MessageSquare size={20} className="text-white" />
              <span className="sr-only">Comments</span>
            </Button>
            <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
              <Share size={20} className="text-white" />
              <span className="sr-only">Share</span>
            </Button>
            <div className="text-center text-xs">
              <div>{reel.views}</div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
