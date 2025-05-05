
import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { apiClient } from '@/lib/api-client';
import { ReelCard } from '@/components/reels/ReelCard';
import { BatchSelectionToolbar } from '@/components/reels/BatchSelectionToolbar';
import { useBatchSelection } from '@/contexts/BatchSelectionContext';
import { FloatingAddButton } from '@/components/create/FloatingAddButton';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('for-you');
  const { isSelectionMode, toggleSelectionMode } = useBatchSelection();
  const { viewMode } = useViewMode();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: feedRef
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Fetch reels
  const { data: reels, isLoading, error, refetch } = useQuery({
    queryKey: ['reels', currentTab],
    queryFn: () => apiClient.getReels(1, 10, currentTab === 'following' ? 'following' : 'for-you'),
  });
  
  // Fetch following reels
  const { data: followingReels, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['reels', 'following'],
    queryFn: () => apiClient.getReels(1, 10, 'following'),
    enabled: currentTab === 'following',
  });
  
  // Fetch favorites for comparison
  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiClient.getFavorites(),
  });
  
  // Listen for new reels being created
  useEffect(() => {
    const handleReelCreated = () => {
      console.log('New reel created, refreshing data');
      refetch();
    };
    
    window.addEventListener('reel-created', handleReelCreated);
    return () => {
      window.removeEventListener('reel-created', handleReelCreated);
    };
  }, [refetch]);
  
  // Create a Set of favorite reel IDs for O(1) lookup
  const favoriteIds = new Set((favorites || []).map(reel => reel.id));
  
  // Update current reel index based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      
      const children = Array.from(feedRef.current.children);
      const containerTop = feedRef.current.scrollTop;
      const containerHeight = feedRef.current.clientHeight;
      
      let bestVisibleIndex = 0;
      let maxVisibleArea = 0;
      
      children.forEach((child, index) => {
        const element = child as HTMLElement;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Calculate the visible area of this element
        const visibleTop = Math.max(0, elementTop);
        const visibleBottom = Math.min(containerHeight, elementTop + elementHeight);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          bestVisibleIndex = index;
        }
      });
      
      setCurrentReelIndex(bestVisibleIndex);
    };
    
    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
      // Initial calculation
      handleScroll();
      
      return () => {
        feedElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [reels, followingReels]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-4"></div>
          <div className="h-4 w-40 bg-muted rounded"></div>
          <motion.div 
            className="mt-8 text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading amazing content...
          </motion.div>
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

  const currentReels = currentTab === 'following' ? followingReels : reels;
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <div className="glass sticky top-0 z-30 py-2 px-4">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            Reelz
          </motion.h1>
          
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant={isSelectionMode ? "default" : "outline"}
              onClick={toggleSelectionMode}
              className={isSelectionMode ? "" : "glass"}
            >
              {isSelectionMode ? 'Cancel' : 'Select'}
            </Button>
          </div>
        </div>
        
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab} 
          className="mt-2"
        >
          <TabsList className="glass w-full">
            <TabsTrigger 
              value="for-you" 
              className="flex-1 data-[state=active]:bg-primary/20"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="following" 
              className="flex-1 data-[state=active]:bg-primary/20"
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Scroll progress indicator */}
        <motion.div
          className="h-1 bg-gradient-to-r from-primary to-secondary mt-1"
          style={{ scaleX, transformOrigin: "0%" }}
        />
      </div>
      
      {/* Reel Feed */}
      <div 
        ref={feedRef}
        className={`reel-feed overflow-y-auto pb-20 overscroll-y-contain snap-y snap-mandatory scrollbar-hide h-[calc(100vh-10rem)]`}
      >
        <AnimatePresence>
          {currentReels?.map((reel, index) => (
            <motion.div 
              key={reel.id}
              className={`h-[calc(100vh-10rem)] w-full px-0 sm:px-4 snap-start snap-always`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReelCard 
                reel={reel} 
                isFavorited={favoriteIds.has(reel.id)} 
              />
              
              {/* Reel Counter */}
              <div className="absolute right-4 top-20 z-20">
                <div className="glass px-3 py-1 rounded-full text-xs font-medium">
                  {index + 1} / {currentReels.length}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Floating Add Button */}
      <FloatingAddButton />
      
      {/* Batch Selection Toolbar */}
      <BatchSelectionToolbar />
    </div>
  );
};

export default Home;
