import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Share, ArrowUp, ArrowDown, ThumbsUp, ThumbsDown, Trash, Edit } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Reel } from '@/types';
import { useBatchSelection } from '@/contexts/BatchSelectionContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getMoodGradient } from '@/utils/mood-utils';
import { getActualVideoSource } from '@/utils/reel-utils';

interface ReelCardProps {
  reel: Reel;
  isFavorited?: boolean;
  showOwnerControls?: boolean;
}

export const ReelCard: React.FC<ReelCardProps> = ({ 
  reel, 
  isFavorited = false,
  showOwnerControls = false
}) => {
  const { videoRef, containerRef, isVisible, isPlaying, togglePlayback } = useVideoPlayback(0.6);
  const { isSelectionMode, toggleReelSelection, isSelected } = useBatchSelection();
  const [showControls, setShowControls] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showPoll, setShowPoll] = useState(false);
  const [pollVote, setPollVote] = useState<'up' | 'down' | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [actualVideoSrc, setActualVideoSrc] = useState('');
  const queryClient = useQueryClient();
  
  const selected = isSelected(reel.id);
  
  // Get the actual video URL (resolving local storage references)
  useEffect(() => {
    if (reel.isLocalVideo || reel.videoUrl.startsWith('local:')) {
      const src = getActualVideoSource(reel.videoUrl);
      setActualVideoSrc(src);
    } else {
      setActualVideoSrc(reel.videoUrl);
    }
  }, [reel.videoUrl, reel.isLocalVideo]);
  
  // Get mood emoji based on the reel's mood
  const getMoodEmoji = () => {
    switch (reel.mood) {
      case 'energetic': return '⚡';
      case 'calm': return '🧘';
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'cosmic': return '🌌';
      case 'nebula': return '🌠';
      case 'aurora': return '✨';
      default: return '😎';
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
      
      toast(isFavorited ? 'Removed from favorites' : 'Added to favorites', {
        description: isFavorited 
          ? 'This reel has been removed from your favorites' 
          : 'This reel has been added to your favorites',
        position: 'bottom-center',
        className: 'glass'
      });
    }
  });

  // Delete reel mutation
  const deleteReelMutation = useMutation({
    mutationFn: () => {
      return apiClient.deleteReel(reel.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-clips'] });
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      
      toast('Reel deleted', {
        description: 'Your reel has been deleted successfully',
        position: 'bottom-center',
      });
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (text: string) => {
      return apiClient.addComment(reel.id, text);
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      queryClient.invalidateQueries({ queryKey: ['comments', reel.id] });
      
      toast('Comment added', {
        description: 'Your comment has been added',
        position: 'bottom-center',
      });
    }
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: (vote: 'up' | 'down') => {
      return apiClient.voteOnReel(reel.id, vote);
    },
    onSuccess: (_, vote) => {
      setPollVote(vote);
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
  
  const handleVideoError = () => {
    console.error("Error loading video for reel:", reel.id);
    setVideoError(true);
  };
  
  const handleSwipe = (direction: 'up' | 'down') => {
    const container = document.querySelector('.reel-feed');
    if (!container) return;
    
    const currentIndex = Array.from(container.children).findIndex(
      (child) => child.contains(containerRef.current)
    );
    
    const targetIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < container.children.length) {
      container.children[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  const handlePollVote = (vote: 'up' | 'down') => {
    if (pollVote === vote) return; // Already voted
    voteMutation.mutate(vote);
    
    // Show floating animation
    setShowReactions(true);
    setEmoji(vote === 'up' ? '👍' : '👎');
    
    setTimeout(() => {
      setShowReactions(false);
      setEmoji(null);
    }, 1500);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addCommentMutation.mutate(comment);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this reel?')) {
      deleteReelMutation.mutate();
    }
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className={cn(
        "reel-card relative aspect-[9/16] w-full h-full max-h-[90vh] mx-auto overflow-hidden",
        getMoodGradient(reel)
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setShowControls(true)}
      onHoverEnd={() => setShowControls(false)}
    >
      {/* Mood 3D Emojis floating in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`mood-emoji-${i}`}
            className="absolute text-5xl sm:text-6xl md:text-7xl opacity-30 filter blur-[1px]"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0.5 + Math.random() * 0.5,
              rotate: Math.random() * 360
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
              scale: [0.7, 0.9, 0.7],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            {getMoodEmoji()}
          </motion.div>
        ))}
      </div>

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
            src={`${actualVideoSrc}?autoplay=${isVisible ? 1 : 0}&mute=1&controls=0&modestbranding=1&loop=1&playlist=${reel.youtubeId}`}
            title={reel.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : videoError ? (
          <div className="flex flex-col items-center justify-center h-full bg-black/30 backdrop-blur-sm">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-white text-center px-4">
              Unable to load video.
              <br />
              <span className="text-sm opacity-70">The video might be unavailable or in an unsupported format.</span>
            </p>
          </div>
        ) : (
          <video
            ref={videoRef as React.RefObject<HTMLVideoElement>}
            src={actualVideoSrc}
            poster={reel.thumbnailUrl || '/placeholder.svg'}
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
            onError={handleVideoError}
          ></video>
        )}
        
        {/* Enhanced mood-based gradient overlay */}
        <div className={cn(
          "absolute inset-0 mix-blend-overlay opacity-40",
          `bg-gradient-to-b from-${reel.mood || 'neutral'}-500/30 via-transparent to-${reel.mood || 'neutral'}-700/50`
        )}></div>
        
        {/* Standard video overlay with gradient */}
        <div className="video-overlay absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
        
        {/* Parallax effect on text */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ y: isPlaying ? 0 : -5 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {!reel.isYouTube && !isPlaying && isVisible && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
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

        {/* Video navigation */}
        <AnimatePresence>
          {showControls && (
            <>
              <motion.div
                className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button
                  size="icon"
                  className="rounded-full bg-white/20 hover:bg-white/30 mb-4"
                  onClick={() => handleSwipe('up')}
                >
                  <ArrowUp size={20} className="text-white" />
                  <span className="sr-only">Next</span>
                </Button>
                <Button
                  size="icon"
                  className="rounded-full bg-white/20 hover:bg-white/30"
                  onClick={() => handleSwipe('down')}
                >
                  <ArrowDown size={20} className="text-white" />
                  <span className="sr-only">Previous</span>
                </Button>
              </motion.div>

              {showOwnerControls && (
                <motion.div
                  className="absolute top-4 right-4 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-8 h-8 rounded-full bg-black/50 border-none hover:bg-black/70"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Edit functionality would go here
                      }}
                    >
                      <Edit size={16} className="text-white" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-8 h-8 rounded-full bg-black/50 border-none hover:bg-black/70"
                      onClick={handleDeleteClick}
                    >
                      <Trash size={16} className="text-white" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
      
      <Link 
        to={`/reel/${reel.id}`} 
        className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white"
        onClick={(e) => isSelectionMode && e.preventDefault()}
      >
        <div className="flex items-end justify-between">
          <div>
            <motion.h3 
              className="font-bold text-lg line-clamp-1"
              animate={{ y: isPlaying ? [0, -2, 0] : 0 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            >
              {reel.title}
            </motion.h3>
            <motion.div 
              className="flex items-center space-x-2 mt-2"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={reel.user.avatar} 
                alt={reel.user.name} 
                className="w-8 h-8 rounded-full border border-white/50"
              />
              <span className="text-sm font-medium">@{reel.user.username}</span>
            </motion.div>
            <div className="mt-2 line-clamp-1">
              {reel.tags.map(tag => (
                <motion.span 
                  key={tag} 
                  className="text-xs mr-1 glass px-2 py-0.5 rounded-full inline-flex"
                  whileHover={{ scale: 1.1 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button 
              size="icon" 
              className={cn(
                "rounded-full", 
                isFavorited 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "glass hover:bg-white/30"
              )}
              onClick={handleFavoriteClick}
            >
              <motion.div 
                animate={isFavorited ? { 
                  scale: [1, 1.3, 1],
                } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  fill={isFavorited ? "white" : "none"} 
                  size={20} 
                  className="text-white" 
                />
              </motion.div>
            </Button>
            
            <Button 
              size="icon" 
              className="rounded-full glass hover:bg-white/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowComments(!showComments);
                setShowPoll(false);
              }}
            >
              <MessageSquare size={20} className="text-white" />
              <span className="sr-only">Comments</span>
            </Button>
            
            <Button 
              size="icon" 
              className="rounded-full glass hover:bg-white/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPoll(!showPoll);
                setShowComments(false);
              }}
            >
              {pollVote ? (
                pollVote === 'up' ? (
                  <ThumbsUp size={20} className="text-white fill-white" />
                ) : (
                  <ThumbsDown size={20} className="text-white fill-white" />
                )
              ) : (
                <ThumbsUp size={20} className="text-white" />
              )}
              <span className="sr-only">Like</span>
            </Button>
            
            <Button 
              size="icon" 
              className="rounded-full glass hover:bg-white/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (navigator.share) {
                  navigator.share({
                    title: reel.title,
                    text: reel.description,
                    url: window.location.origin + `/reel/${reel.id}`
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(
                    window.location.origin + `/reel/${reel.id}`
                  );
                  toast('Link copied to clipboard', {
                    position: 'bottom-center'
                  });
                }
              }}
            >
              <Share size={20} className="text-white" />
              <span className="sr-only">Share</span>
            </Button>
            
            <div className="text-center text-xs glass px-2 py-1 rounded-full">
              <div>{reel.views}</div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Quick poll feature */}
      <AnimatePresence>
        {showPoll && (
          <motion.div 
            className="absolute bottom-24 right-16 glass rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="p-3">
              <p className="text-sm font-medium text-center mb-2">Did you like it?</p>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex-1 px-3", 
                    pollVote === 'up' ? "bg-primary/30" : ""
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePollVote('up');
                  }}
                >
                  <ThumbsUp size={16} className="mr-1" />
                  <span>Yes</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex-1 px-3",
                    pollVote === 'down' ? "bg-primary/30" : ""
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePollVote('down');
                  }}
                >
                  <ThumbsDown size={16} className="mr-1" />
                  <span>No</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quick comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            className="absolute bottom-24 left-4 right-4 glass rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-3 space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
              <p className="text-sm font-medium border-b border-white/10 pb-2">Comments</p>
              
              {reel.comments > 0 ? (
                // This would typically be replaced with actual comments from API
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <img 
                      src="https://i.pravatar.cc/150?img=3" 
                      className="w-6 h-6 rounded-full" 
                      alt="User" 
                    />
                    <div>
                      <p className="text-xs font-medium">@user123</p>
                      <p className="text-xs">This is amazing! 🔥</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-center py-2">No comments yet</p>
              )}
              
              <form onSubmit={handleSubmitComment}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.substring(0, 100))}
                    className="flex-1 h-8 rounded bg-white/20 px-2 text-sm"
                    placeholder="Add a comment..."
                    maxLength={100}
                  />
                  <Button 
                    type="submit"
                    size="sm" 
                    className="h-8 px-2"
                    disabled={!comment.trim() || addCommentMutation.isPending}
                  >
                    {addCommentMutation.isPending ? "..." : "Post"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating reactions */}
      <AnimatePresence>
        {showReactions && emoji && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{ 
                  x: `${Math.random() * 80 + 10}%`, 
                  y: '100%',
                  opacity: 1,
                  scale: 0.5 + Math.random() * 1
                }}
                animate={{ 
                  y: `-${Math.random() * 100 + 50}%`, 
                  x: `${Math.random() * 80 + 10}%`,
                  opacity: 0,
                  scale: 0.8 + Math.random() * 0.8,
                  rotate: Math.random() * 60 - 30
                }}
                transition={{ 
                  duration: 1 + Math.random() * 1.5, 
                  ease: "easeOut" 
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
