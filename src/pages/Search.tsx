
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent } from '@/components/ui/tabs';
import { ReelCard } from '@/components/reels/ReelCard';
import { Search as SearchIcon, Flame, Clock, Hash, Film, Gamepad2, Music, Rocket, Camera, Code } from 'lucide-react';

// Define a proper type for trending tags
interface TrendingTag {
  tag: string;
  count: number;
}

// Define a proper type for categories
interface Category {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

const Search: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get trending tags
  const { data: trendingTags } = useQuery({
    queryKey: ['trending-tags'],
    queryFn: () => apiClient.getTrendingTags().then(tags => 
      // Convert string[] to TrendingTag[]
      tags.map((tag): TrendingTag => ({
        tag,
        count: Math.floor(Math.random() * 5000) + 1000
      }))
    ),
  });
  
  // Get categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories().then(categories => categories),
  });
  
  // Define categories with proper typing
  const categories: Category[] = [
    { id: 'gaming', name: 'Gaming', color: 'bg-indigo-500/20', icon: <Gamepad2 size={16} /> },
    { id: 'music', name: 'Music', color: 'bg-rose-500/20', icon: <Music size={16} /> },
    { id: 'tech', name: 'Technology', color: 'bg-blue-500/20', icon: <Code size={16} /> },
    { id: 'space', name: 'Space', color: 'bg-violet-500/20', icon: <Rocket size={16} /> },
    { id: 'art', name: 'Art', color: 'bg-amber-500/20', icon: <Camera size={16} /> },
    { id: 'comedy', name: 'Comedy', color: 'bg-green-500/20', icon: <Film size={16} /> },
  ];
  
  // Search for reels
  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['search-reels', searchQuery, activeTab, selectedCategory],
    queryFn: () => {
      if (!searchQuery && activeTab !== 'trending') return [];
      return apiClient.searchReels(searchQuery, activeTab === 'categories' ? selectedCategory || undefined : activeTab);
    },
    enabled: searchQuery !== '' || activeTab === 'trending',
  });
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      toast({
        title: "Search query empty",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    refetch();
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Discover Content
        </h1>
        
        <form onSubmit={handleSearch} className="relative mb-8">
          <Input
            type="text"
            placeholder="Search reels, tags, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 pr-12 bg-background/50 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          
          {searchQuery && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <span className="sr-only">Clear search</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          )}
        </form>
        
        <AnimatedTabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AnimatedTabsList className="w-full mb-8">
            <AnimatedTabsTrigger value="trending" icon={<Flame size={16} />}>
              Trending
            </AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="recent" icon={<Clock size={16} />}>
              Recent
            </AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="tags" icon={<Hash size={16} />}>
              Tags
            </AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="categories" icon={<Film size={16} />}>
              Categories
            </AnimatedTabsTrigger>
          </AnimatedTabsList>
          
          <AnimatedTabsContent value="trending">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-muted rounded-lg animate-pulse"></div>
                ))
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map(reel => (
                  <div key={reel.id} className="aspect-[9/16] h-[300px]">
                    <ReelCard reel={reel} isFavorited={false} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground">No trending videos found</p>
                </div>
              )}
            </div>
          </AnimatedTabsContent>
          
          <AnimatedTabsContent value="recent">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-muted rounded-lg animate-pulse"></div>
                ))
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map(reel => (
                  <div key={reel.id} className="aspect-[9/16] h-[300px]">
                    <ReelCard reel={reel} isFavorited={false} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground">No recent videos found</p>
                </div>
              )}
            </div>
          </AnimatedTabsContent>
          
          <AnimatedTabsContent value="tags">
            <div className="mb-8 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags ? trendingTags.map((item: TrendingTag) => (
                  <Button
                    key={item.tag}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
                    onClick={() => setSearchQuery(item.tag)}
                  >
                    <span className="text-xs text-muted-foreground mr-1">#</span>
                    {item.tag}
                    <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-foreground">
                      {(item.count / 1000).toFixed(1)}k
                    </span>
                  </Button>
                )) : (
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse"></div>
                  ))
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-muted rounded-lg animate-pulse"></div>
                ))
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map(reel => (
                  <div key={reel.id} className="aspect-[9/16] h-[300px]">
                    <ReelCard reel={reel} isFavorited={false} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground">Search for a tag or select from popular tags</p>
                </div>
              )}
            </div>
          </AnimatedTabsContent>
          
          <AnimatedTabsContent value="categories">
            <div className="mb-8 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Browse Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className={`${selectedCategory === category.id ? 'bg-primary' : category.color + ' bg-opacity-20'} backdrop-blur-sm transition-all`}
                    onClick={() => setSelectedCategory(prevCat => prevCat === category.id ? null : category.id)}
                  >
                    <span className="mr-1.5">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-muted rounded-lg animate-pulse"></div>
                ))
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map(reel => (
                  <div key={reel.id} className="aspect-[9/16] h-[300px]">
                    <ReelCard reel={reel} isFavorited={false} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground">Select a category to view videos</p>
                </div>
              )}
            </div>
          </AnimatedTabsContent>
        </AnimatedTabs>
      </motion.div>
    </div>
  );
};

export default Search;
