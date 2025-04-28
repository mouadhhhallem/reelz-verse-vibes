
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Heart, MessageSquare, Share, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const ReelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { videoRef, containerRef, isPlaying, togglePlayback } = useVideoPlayback(0.3);
  
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
      toast({
        title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      });
    },
  });
  
  // Handle share
  const handleShare = () => {
    // In a real app, this would use the Web Share API or show a share dialog
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied',
      description: 'Share link copied to clipboard',
    });
  };
  
  if (isLoading || !reel) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  const getMoodGradient = () => {
    switch(reel.mood) {
      case 'energetic': return 'bg-gradient-to-br from-orange-500 to-red-500';
      case 'calm': return 'bg-gradient-to-br from-blue-400 to-teal-500';
      case 'happy': return 'bg-gradient-to-br from-yellow-400 to-amber-500';
      case 'sad': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-700';
    }
  };
  
  return (
    <motion.div 
      className="pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sticky top-16 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 z-20 rounded-full bg-black/50 text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
      </div>
      
      <div 
        ref={containerRef}
        className={`${getMoodGradient()} aspect-[9/16] max-h-[80vh] relative mx-auto overflow-hidden rounded-b-3xl`}
        onClick={!reel.isYouTube ? togglePlayback : undefined}
      >
        {reel.isYouTube ? (
          <iframe
            ref={videoRef as React.RefObject<HTMLIFrameElement>}
            src={`${reel.videoUrl}?autoplay=1&mute=0&controls=1&modestbranding=1&loop=1&playlist=${reel.youtubeId}`}
            title={reel.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <video
            ref={videoRef as React.RefObject<HTMLVideoElement>}
            src={reel.videoUrl}
            poster={reel.thumbnailUrl}
            controls
            loop
            playsInline
            className="w-full h-full object-cover"
          ></video>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4 p-4 z-10">
          <Button 
            variant="outline" 
            className={`rounded-full bg-white/20 hover:bg-white/30 ${isFavorited ? 'text-red-500' : 'text-white'}`}
            onClick={() => toggleFavoriteMutation.mutate()}
          >
            <Heart fill={isFavorited ? "currentColor" : "none"} size={20} className="mr-2" />
            {reel.likes + (isFavorited ? 1 : 0)}
          </Button>
          
          <Button 
            variant="outline" 
            className="rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <MessageSquare size={20} className="mr-2" />
            {reel.comments}
          </Button>
          
          <Button 
            variant="outline" 
            className="rounded-full bg-white/20 hover:bg-white/30 text-white"
            onClick={handleShare}
          >
            <Share size={20} className="mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold">{reel.title}</h1>
        
        <div className="flex items-center space-x-2 mt-4">
          <img 
            src={reel.user.avatar} 
            alt={reel.user.name} 
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="font-medium">{reel.user.name}</p>
            <p className="text-sm text-muted-foreground">@{reel.user.username}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-muted-foreground">
            {new Date(reel.createdAt).toLocaleDateString()} • {reel.views.toLocaleString()} views
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h2 className="font-medium mb-2">Description</h2>
          <p>{reel.description}</p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {reel.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-secondary/20 px-2 py-1 rounded-full text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h2 className="font-medium mb-4">Comments ({reel.comments})</h2>
          <div className="space-y-4">
            {/* In a real app, fetch and display comments here */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-muted"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Comment User</p>
                <p className="text-sm">This is a placeholder comment</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-muted"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Another User</p>
                <p className="text-sm">This is another placeholder comment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReelDetail;
