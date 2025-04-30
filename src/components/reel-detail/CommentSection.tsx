
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ThumbsUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Comment } from '@/types';

interface CommentSectionProps {
  reelId: string;
  comments: Comment[];
  isLoading: boolean;
  user: {
    avatar: string;
  };
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  reelId,
  comments,
  isLoading,
  user
}) => {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: (text: string) => {
      if (!reelId) throw new Error('No reel ID provided');
      return apiClient.addComment(reelId, text);
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', reelId] });
      toast('Comment added');
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addCommentMutation.mutate(comment);
  };

  return (
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
          src={user.avatar} 
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
      
      {isLoading ? (
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
  );
};

export default CommentSection;
