
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Heart, MessageSquare, Share, ArrowLeft, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ReelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { videoRef, containerRef, isPlaying, togglePlayback, isMuted, toggleMute, progress, seekTo } = useVideoPlayback(0.3);
  const [comment, setComment] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);
  
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
  
  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (text: string) => {
      if (!id) throw new Error('No reel ID provided');
      return apiClient.addComment(id, text);
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      toast('Comment added');
    },
  });
  
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
  
  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Link copied to clipboard');
  };
  
  const handleAddReaction = (emoji: string) => {
    setReactions(prev => [...prev, emoji]);
    setShowEmojis(false);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addCommentMutation.mutate(comment);
  };
  
  const getMoodGradient = () => {
    if (!reel) return 'bg-gradient-to-br from-gray-500 to-gray-700';
    
    switch(reel.mood) {
      case 'energetic': return 'bg-gradient-to-br from-orange-500 to-red-500';
      case 'calm': return 'bg-gradient-to-br from-blue-400 to-teal-500';
      case 'happy': return 'bg-gradient-to-br from-yellow-400 to-amber-500';
      case 'sad': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-700';
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
        ref={containerRef}
        className={`${getMoodGradient()} relative h-[100vh] sm:h-[80vh] max-h-[90vh] w-full overflow-hidden`}
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
            controls={false}
            loop
            playsInline
            className="w-full h-full object-cover"
          ></video>
        )}
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none"></div>
        
        {/* Floating Reactions */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {reactions.map((emoji, index) => (
            <motion.div
              key={`${emoji}-${index}`}
              initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 1, scale: 0.5 }}
              animate={{ 
                y: "-100%", 
                opacity: 0, 
                scale: 1.5,
                transition: { 
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut"
                }
              }}
              className="absolute text-4xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
        
        {/* Video Progress Bar */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          style={{ transformOrigin: "left" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width * 100;
            seekTo(percent);
          }}
        >
          <div className="h-full bg-primary"></div>
        </motion.div>

        {/* Back Button */}
        <AnimatedControlButton 
          show={showControls} 
          position="top-4 left-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </AnimatedControlButton>
        
        {/* Control Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
          {/* Left Side Info */}
          <motion.div 
            className="max-w-[70%]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.h1 
              className="text-white text-xl font-bold mb-2"
              animate={{ opacity: showControls ? 1 : 0.6 }}
            >
              {reel.title}
            </motion.h1>
            
            <Link to={`/profile/${reel.user.username}`}>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={reel.user.avatar} 
                  alt={reel.user.name} 
                  className="w-8 h-8 rounded-full border border-white/50"
                />
                <span className="text-sm font-medium text-white">{reel.user.name}</span>
              </motion.div>
            </Link>
          </motion.div>
          
          {/* Right Side Controls */}
          <motion.div 
            className="flex flex-col space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              size="icon" 
              variant="glass"
              className={`rounded-full ${isFavorited ? 'bg-red-500/70' : ''}`}
              onClick={() => toggleFavoriteMutation.mutate()}
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
              variant="glass"
              className="rounded-full"
              onClick={() => {
                const commentsEl = document.getElementById('comments-section');
                if (commentsEl) {
                  commentsEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <MessageSquare size={20} className="text-white" />
            </Button>
            
            <Button 
              size="icon" 
              variant="glass"
              className="rounded-full"
              onClick={() => setShowEmojis(!showEmojis)}
            >
              <ThumbsUp size={20} className="text-white" />
            </Button>
            
            <Button 
              size="icon" 
              variant="glass"
              className="rounded-full"
              onClick={handleShare}
            >
              <Share size={20} className="text-white" />
            </Button>
            
            {!reel.isYouTube && (
              <Button 
                size="icon" 
                variant="glass"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </Button>
            )}
          </motion.div>
        </div>
        
        {/* Emoji Reaction Panel */}
        {showEmojis && (
          <motion.div 
            className="absolute right-16 bottom-32 backdrop-blur-lg bg-black/50 rounded-xl p-3 flex gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {["👍", "❤️", "🔥", "👏", "😂", "😢"].map(emoji => (
              <motion.button
                key={emoji}
                className="text-2xl hover:scale-125 transition-transform"
                whileHover={{ scale: 1.2 }}
                onClick={() => handleAddReaction(emoji)}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Description and Comments Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="text-xl font-bold mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {reel.title}
                </motion.div>
              </div>
              
              <motion.div 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {new Date(reel.createdAt).toLocaleDateString()} • {reel.views.toLocaleString()} views
              </motion.div>
            </div>
            
            <Separator className="my-4" />
            
            <motion.p 
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {reel.description}
            </motion.p>
            
            <motion.div 
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {reel.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-sm bg-primary/20 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          </div>
          
          <Separator className="my-6" />
          
          <motion.div 
            id="comments-section"
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
            </div>
            
            <div className="flex space-x-3 mb-6">
              <img 
                src={reel.user.avatar} 
                alt="Your avatar" 
                className="w-10 h-10 rounded-full"
              />
              <form onSubmit={handleSubmitComment} className="flex-1 flex space-x-2">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-white/5"
                />
                <Button 
                  type="submit" 
                  variant="cosmic" 
                  size="icon"
                  disabled={!comment.trim() || addCommentMutation.isPending}
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
            
            {isLoadingComments ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                      <div className="h-3 w-full bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              <motion.div 
                className="space-y-6"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {comments.map((comment, index) => (
                  <motion.div 
                    key={`${comment.id || index}`}
                    className="flex space-x-3"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <Link to={`/profile/${comment.user.username}`}>
                      <img 
                        src={comment.user.avatar} 
                        alt={comment.user.name} 
                        className="w-10 h-10 rounded-full"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Link to={`/profile/${comment.user.username}`} className="font-medium hover:underline">
                          {comment.user.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1">{comment.text}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <button className="text-sm text-muted-foreground hover:text-foreground flex items-center space-x-1">
                          <ThumbsUp size={12} />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-sm text-muted-foreground hover:text-foreground">
                          Reply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper component for animated controls
const AnimatedControlButton: React.FC<{
  show: boolean;
  position: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ show, position, onClick, children }) => (
  <motion.div
    className={`absolute ${position} z-20`}
    initial={{ opacity: 0 }}
    animate={{ opacity: show ? 1 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <Button 
      variant="glass" 
      size="icon" 
      className="rounded-full"
      onClick={onClick}
    >
      {children}
    </Button>
  </motion.div>
);

export default ReelDetail;
