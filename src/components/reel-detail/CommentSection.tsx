
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Comment {
  id: string;
  text: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  likes: number;
}

interface CommentSectionProps {
  reelId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ reelId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        text: newComment,
        username: 'currentUser',
        avatar: '/placeholder.svg',
        createdAt: new Date(),
        likes: 0
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast.success('Comment added successfully!');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <Textarea 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {comments.length > 0 ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Avatar>
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{comment.username}</p>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Be the first to comment on this reel!</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentSection;
