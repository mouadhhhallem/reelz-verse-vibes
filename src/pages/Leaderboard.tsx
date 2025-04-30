
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Trophy, Flame, Star, Heart, Eye, Users, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Leaderboard = () => {
  const { data: topUsers, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => apiClient.getLeaderboard(),
  });

  const categories = [
    { id: 'views', label: 'Most Views', icon: Eye, color: 'from-blue-400 to-indigo-600' },
    { id: 'likes', label: 'Most Likes', icon: Heart, color: 'from-red-400 to-pink-600' },
    { id: 'followers', label: 'Most Followers', icon: Users, color: 'from-green-400 to-teal-600' },
  ];

  const [activeCategory, setActiveCategory] = React.useState('views');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Get the correct rank icon based on position
  const getRankIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy size={24} className="text-yellow-500" />;
      case 1:
        return <Flame size={24} className="text-orange-500" />;
      case 2:
        return <Star size={24} className="text-purple-500" />;
      default:
        return <ArrowUp size={24} className="text-blue-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12 relative"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" />
      </div>

      <motion.h1 
        className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Leaderboard
      </motion.h1>

      <motion.div 
        className="flex flex-wrap justify-center gap-4 mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "cosmic" : "glass"}
            size="pill"
            onClick={() => setActiveCategory(category.id)}
            className="space-x-2"
          >
            <category.icon size={16} />
            <span>{category.label}</span>
          </Button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="backdrop-blur-xl bg-white/5 border-white/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-40 animate-pulse bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {topUsers?.filter(user => user.stats[activeCategory as keyof typeof user.stats] > 0)
            .sort((a, b) => {
              return (b.stats[activeCategory as keyof typeof b.stats] as number) - 
                     (a.stats[activeCategory as keyof typeof a.stats] as number);
            })
            .slice(0, 9)
            .map((user, index) => (
              <motion.div key={user.id} variants={itemVariants}>
                <Link to={`/profile/${user.username}`}>
                  <Card className="overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
                    <div className={`h-24 bg-gradient-to-r ${index < 3 ? categories.find(c => c.id === activeCategory)?.color : 'from-gray-400 to-gray-600'}`}>
                      <div className="h-full w-full flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 backdrop-blur-md rounded-full p-2">
                            {getRankIcon(index)}
                          </div>
                          <div className="text-white">
                            <p className="font-bold text-2xl">#{index + 1}</p>
                          </div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md rounded-full px-4 py-2">
                          <p className="text-white font-medium">
                            {user.stats[activeCategory as keyof typeof user.stats].toLocaleString()}
                            {' '}
                            {activeCategory === 'views' ? 'views' : activeCategory === 'likes' ? 'likes' : 'followers'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-xs">
                              <Heart size={12} />
                              <span>{user.stats.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Eye size={12} />
                              <span>{user.stats.views}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Users size={12} />
                              <span>{user.stats.followers}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Leaderboard;
