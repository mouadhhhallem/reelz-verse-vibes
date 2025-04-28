
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api-client';
import { ReelCard } from '@/components/reels/ReelCard';
import { Button } from '@/components/ui/button';
import { BatchSelectionToolbar } from '@/components/reels/BatchSelectionToolbar';
import { useBatchSelection } from '@/contexts/BatchSelectionContext';

const Favorites: React.FC = () => {
  const { isSelectionMode, toggleSelectionMode, selectAllReels } = useBatchSelection();
  
  // Fetch favorites
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiClient.getFavorites(),
  });
  
  // Select all reels
  const handleSelectAll = () => {
    if (favorites) {
      selectAllReels(favorites.map(reel => reel.id));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-bold">Favorites</h1>
        
        <div className="flex items-center space-x-2">
          {isSelectionMode && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant={isSelectionMode ? "default" : "outline"}
            onClick={toggleSelectionMode}
          >
            {isSelectionMode ? 'Cancel' : 'Select'}
          </Button>
        </div>
      </div>
      
      {favorites?.length ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {favorites.map(reel => (
            <motion.div 
              key={reel.id} 
              className="aspect-[9/16] h-[400px] sm:h-[350px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ReelCard reel={reel} isFavorited={true} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Start adding reels to your favorites to see them here
          </p>
          <Button>Explore Reels</Button>
        </div>
      )}
      
      <BatchSelectionToolbar />
    </div>
  );
};

export default Favorites;
