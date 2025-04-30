
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface VideoControlsProps {
  reel: {
    id: string;
    title: string;
    user: {
      name: string;
      username: string;
      avatar: string;
    };
  };
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onShowEmojis: () => void;
  onShare: () => void;
  onNavigateToComments: () => void;
  showControls: boolean;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  reel,
  isFavorited,
  onToggleFavorite,
  onShowEmojis,
  onShare,
  onNavigateToComments,
  showControls,
}) => {
  return (
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
          onClick={onToggleFavorite}
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
          onClick={onNavigateToComments}
        >
          <MessageSquare size={20} className="text-white" />
        </Button>
        
        <Button 
          size="icon" 
          variant="glass"
          className="rounded-full"
          onClick={onShowEmojis}
        >
          <ThumbsUp size={20} className="text-white" />
        </Button>
        
        <Button 
          size="icon" 
          variant="glass"
          className="rounded-full"
          onClick={onShare}
        >
          <Share size={20} className="text-white" />
        </Button>
      </motion.div>
    </div>
  );
};

export default VideoControls;
