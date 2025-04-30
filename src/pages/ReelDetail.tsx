
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

// Import refactored components
import VideoPlayer from '@/components/reel-detail/VideoPlayer';
import VideoControls from '@/components/reel-detail/VideoControls';
import ReactionPanel from '@/components/reel-detail/ReactionPanel';
import FloatingReactions from '@/components/reel-detail/FloatingReactions';
import ReelDescription from '@/components/reel-detail/ReelDescription';
import CommentSection from '@/components/reel-detail/CommentSection';
import BackButton from '@/components/reel-detail/BackButton';

// Import custom hooks
import { useReelView } from '@/hooks/useReelView';
import { getMoodGradient } from '@/utils/mood-utils';

const ReelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { 
    showControls, 
    showEmojis, 
    reactions, 
    addReaction, 
    toggleEmojis, 
    setShowEmojis 
  } = useReelView();
  
  // Fetch reel data
  const { data: reel, isLoading } = useQuery({
    queryKey: ['reel', id],
    queryFn: () => id ? apiClient.getReelById(id) : null,
    enabled: !!id,
  });
  
  // Fetch favorites to check if this reel is favorited
  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiClient.getFavorites(),
  });
  
  // Fetch comments
  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => id ? apiClient.getComments(id) : [],
    enabled: !!id,
  });
  
  const isFavorited = favorites?.some(fav => fav.id === id);
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error('No reel ID provided');
      return isFavorited 
        ? apiClient.removeFromFavorites(id)
        : apiClient.addToFavorites(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    },
  });
  
  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Link copied to clipboard');
  };

  const handleNavigateToComments = () => {
    const commentsEl = document.getElementById('comments-section');
    if (commentsEl) {
      commentsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (isLoading || !reel) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-muted mb-4"></div>
          <div className="h-4 w-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="min-h-screen pb-20 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Video Section */}
      <div 
        className={`${getMoodGradient(reel)} relative h-[100vh] sm:h-[80vh] max-h-[90vh] w-full overflow-hidden`}
      >
        <VideoPlayer 
          videoUrl={reel.videoUrl}
          thumbnailUrl={reel.thumbnailUrl}
          isYouTube={reel.isYouTube}
          youtubeId={reel.youtubeId}
        />
        
        {/* Back Button */}
        <BackButton show={showControls} onClick={() => navigate(-1)} />
        
        {/* Floating Reactions */}
        <FloatingReactions reactions={reactions} />
        
        {/* Video Controls */}
        <VideoControls 
          reel={reel}
          isFavorited={isFavorited}
          onToggleFavorite={() => toggleFavoriteMutation.mutate()}
          onShowEmojis={toggleEmojis}
          onShare={handleShare}
          onNavigateToComments={handleNavigateToComments}
          showControls={showControls}
        />
        
        {/* Emoji Reaction Panel */}
        <ReactionPanel 
          show={showEmojis}
          onAddReaction={addReaction}
        />
      </div>
      
      {/* Description and Comments Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <ReelDescription 
            title={reel.title}
            description={reel.description}
            tags={reel.tags}
            createdAt={reel.createdAt}
            views={reel.views}
          />
          
          <Separator className="my-6" />
          
          <CommentSection 
            reelId={id || ''}
            comments={comments}
            isLoading={isLoadingComments}
            user={reel.user}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ReelDetail;
