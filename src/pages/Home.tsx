
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';
import { ReelCard } from '@/components/reels/ReelCard';
import { CreateReelModal } from '@/components/reels/CreateReelModal';
import { BatchSelectionToolbar } from '@/components/reels/BatchSelectionToolbar';
import { useBatchSelection } from '@/contexts/BatchSelectionContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Home: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { isSelectionMode, toggleSelectionMode } = useBatchSelection();
  
  // Fetch reels
  const { data: reels, isLoading, error } = useQuery({
    queryKey: ['reels'],
    queryFn: () => apiClient.getReels(),
  });
  
  // Fetch favorites for comparison
  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiClient.getFavorites(),
  });
  
  // Create a Set of favorite reel IDs for O(1) lookup
  const favoriteIds = new Set((favorites || []).map(reel => reel.id));
  
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
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Failed to load reels</h2>
          <p className="text-muted-foreground">Please try again later</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <h1 className="text-2xl font-bold">For You</h1>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={isSelectionMode ? "default" : "outline"}
            onClick={toggleSelectionMode}
          >
            {isSelectionMode ? 'Cancel' : 'Select'}
          </Button>
          
          <Button 
            size="icon"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
      
      <div className="reel-feed pb-20">
        {reels?.map(reel => (
          <div 
            key={reel.id}
            className="h-screen max-h-[calc(100vh-8rem)] w-full px-0 sm:px-4 mb-4"
          >
            <ReelCard 
              reel={reel} 
              isFavorited={favoriteIds.has(reel.id)} 
            />
          </div>
        ))}
      </div>
      
      <BatchSelectionToolbar />
      <CreateReelModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
};

export default Home;
