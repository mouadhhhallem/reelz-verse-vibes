
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CommentSectionProps {
  reelId: string;
  comments: Comment[];
  onAddComment?: (comment: Comment) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  reelId,
  comments = [],
  onAddComment
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the comment object
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        reelId,
        userId: user.id,
        user: {
          name: user.name || user.username,
          username: user.username,
          avatar: user.avatar,
        },
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      // Add the comment to the local cache
      queryClient.setQueryData(['comments', reelId], (oldData: Comment[] = []) => {
        return [comment, ...oldData];
      });

      // Trigger notification if we're not the reel creator
      const reel = queryClient.getQueryData(['reel', reelId]) as any;
      if (reel && reel.userId !== user.id) {
        addNotification({
          type: 'comment',
          message: `commented on your reel: "${newComment.slice(0, 30)}${newComment.length > 30 ? '...' : ''}"`,
          username: user.name || user.username,
          userAvatar: user.avatar,
        });
      }

      // Show toast notification
      toast.success('Comment added!', {
        description: 'Your comment has been posted.',
        icon: '✨'
      });

      // Call the onAddComment callback if provided
      if (onAddComment) {
        onAddComment(comment);
      }

      // Reset the form
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 px-4">
      <h3 className="text-lg font-semibold">
        Comments ({comments.length})
      </h3>

      {/* Add comment form */}
      {user ? (
        <div className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.name || user.username} />
            <AvatarFallback>
              {(user.name || user.username)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <Textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[60px] resize-none bg-muted/30 focus:bg-muted/50 transition-colors"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/500
              </span>
              <Button
                variant="cosmic"
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </span>
                {isSubmitting && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-4 bg-muted/10 rounded-lg">
          <p className="text-muted-foreground">
            Log in to add a comment
          </p>
        </div>
      )}

      {/* Comments list */}
      <AnimatePresence>
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3 pb-4 border-b border-white/10 last:border-0"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback>
                {comment.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {comment.user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{comment.text}</p>
              
              {/* Comment actions */}
              <div className="flex gap-4 pt-1">
                <button className="text-xs text-muted-foreground hover:text-white transition-colors">
                  Like
                </button>
                <button className="text-xs text-muted-foreground hover:text-white transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {comments.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No comments yet. Be the first!</p>
        </div>
      )}
    </div>
  );
};
