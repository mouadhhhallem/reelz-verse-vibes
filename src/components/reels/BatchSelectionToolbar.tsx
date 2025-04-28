
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, X, Share } from 'lucide-react';
import { useBatchSelection } from '@/contexts/BatchSelectionContext';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export const BatchSelectionToolbar: React.FC = () => {
  const { selectedReels, isSelectionMode, toggleSelectionMode, clearSelection } = useBatchSelection();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const addToFavoritesMutation = useMutation({
    mutationFn: () => apiClient.addMultipleToFavorites(selectedReels),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: 'Success',
        description: `${selectedReels.length} reels added to favorites`,
      });
      toggleSelectionMode();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add reels to favorites',
        variant: 'destructive',
      });
    },
  });
  
  const shareReels = () => {
    // In a real app, this would open a share dialog
    toast({
      title: 'Share',
      description: `Sharing ${selectedReels.length} reels`,
    });
  };
  
  if (!isSelectionMode) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50 glass rounded-xl p-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={toggleSelectionMode}
            >
              <X size={20} />
            </Button>
            <span>{selectedReels.length} selected</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={shareReels}
              className="flex items-center space-x-1"
            >
              <Share size={16} />
              <span>Share</span>
            </Button>
            
            <Button 
              size="sm"
              onClick={() => addToFavoritesMutation.mutate()}
              className="flex items-center space-x-1"
              disabled={addToFavoritesMutation.isPending}
            >
              <Heart size={16} />
              <span>Favorite</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
