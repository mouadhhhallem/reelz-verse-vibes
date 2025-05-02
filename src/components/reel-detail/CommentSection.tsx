
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MoreVertical, Trash, Edit, Save } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface Comment {
  id: string;
  text: string;
  username: string;
  avatar?: string;
  userId?: string;
  createdAt: Date;
  likes: number;
}

export interface CommentSectionProps {
  reelId: string;
  isLoading?: boolean;
  user?: {
    name: string;
    username: string;
    avatar: string;
    id?: string;
  };
}

export const CommentSection: React.FC<CommentSectionProps> = ({ reelId, isLoading = false, user }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  // Load comments from localStorage
  useEffect(() => {
    try {
      const savedComments = localStorage.getItem(`comments-${reelId}`);
      if (savedComments) {
        // Convert the ISO strings back to Date objects
        const parsedComments = JSON.parse(savedComments).map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        setComments(parsedComments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }, [reelId]);

  // Save comments to localStorage
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments-${reelId}`, JSON.stringify(comments));
    }
  }, [comments, reelId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        text: newComment,
        username: user?.username || 'currentUser',
        avatar: user?.avatar || '/placeholder.svg',
        userId: user?.id,
        createdAt: new Date(),
        likes: 0
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast.success('Comment added successfully!');
    }, 500);
  };

  const handleEdit = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setEditedText(text);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editedText.trim()) return;

    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, text: editedText } 
          : comment
      )
    );
    
    setEditingCommentId(null);
    setEditedText('');
    toast.success('Comment updated successfully!');
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    toast.success('Comment deleted!');
  };

  const isCommentOwner = (userId?: string) => {
    return user?.id === userId;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{(user?.name || "U")[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <Textarea 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none min-h-[80px] glass-input"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting || isLoading || !user}
                size="sm"
                className="cosmic-button"
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
                className="flex gap-3 glass-card p-3 rounded-xl"
              >
                <Avatar>
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{comment.username}</p>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    
                    {isCommentOwner(comment.userId) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(comment.id, comment.text)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(comment.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea 
                        value={editedText} 
                        onChange={(e) => setEditedText(e.target.value)}
                        className="resize-none min-h-[60px] glass-input"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={!editedText.trim()}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1">{comment.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-8 text-center glass-card rounded-xl">
            <p className="text-muted-foreground">Be the first to comment on this reel!</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentSection;
