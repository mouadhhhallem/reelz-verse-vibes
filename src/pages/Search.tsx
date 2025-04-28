
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api-client';
import { ReelCard } from '@/components/reels/ReelCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon } from 'lucide-react';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [submittedTags, setSubmittedTags] = useState<string[]>([]);
  
  // Fetch trending tags
  const { data: trendingTags } = useQuery({
    queryKey: ['trending-tags'],
    queryFn: () => apiClient.getTrendingTags(),
  });
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });
  
  // Search reels
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search-reels', submittedQuery, submittedTags],
    queryFn: () => apiClient.searchReels(submittedQuery, submittedTags),
    enabled: submittedQuery !== '' || submittedTags.length > 0,
  });
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setSubmittedTags([...selectedTags]);
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="py-4 px-4">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Search reels..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <SearchIcon size={20} className="mr-2" />
            Search
          </Button>
        </div>
      </form>
      
      {(submittedQuery === '' && submittedTags.length === 0) ? (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Trending Tags</h2>
            <div className="flex flex-wrap gap-2">
              {trendingTags?.map(({ tag, count }) => (
                <Badge 
                  key={tag} 
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1 px-3"
                  onClick={() => toggleTag(tag)}
                >
                  #{tag} <span className="ml-1 opacity-70">{count}</span>
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories?.map(category => (
                <motion.div
                  key={category.id}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ backgroundColor: category.color }}
                  onClick={() => toggleTag(category.name.toLowerCase())}
                >
                  <div className="aspect-square flex flex-col items-center justify-center p-4 text-white">
                    <span className="text-4xl">{category.icon}</span>
                    <span className="mt-2 font-medium">{category.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {isLoading ? 'Searching...' : `${searchResults?.length || 0} results`}
            </h2>
            
            {(submittedQuery !== '' || submittedTags.length > 0) && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSubmittedQuery('');
                  setSubmittedTags([]);
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
              >
                Clear search
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {submittedQuery && (
              <Badge variant="secondary" className="text-sm py-1 px-3">
                "{submittedQuery}"
              </Badge>
            )}
            
            {submittedTags.map(tag => (
              <Badge key={tag} className="text-sm py-1 px-3">
                #{tag}
              </Badge>
            ))}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[9/16] bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : searchResults?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(reel => (
                <div key={reel.id} className="aspect-[9/16] h-[400px] sm:h-[350px]">
                  <ReelCard reel={reel} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSubmittedQuery('');
                  setSubmittedTags([]);
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
