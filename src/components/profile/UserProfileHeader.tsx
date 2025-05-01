
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types';

interface UserProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  onFollow?: () => void;
  isFollowing?: boolean;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  isCurrentUser,
  onFollow,
  isFollowing = false
}) => {
  // Use displayName or fallback to name or username
  const displayName = user.displayName || user.name || user.username;
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-lg border border-white/10 p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background overlay with cosmic animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 cosmic-grid -z-10"></div>
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i} 
            className="star"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar with glow effect */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-xl opacity-50"></div>
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 border-white/20">
            <AvatarImage src={user.avatar} alt={displayName} />
            <AvatarFallback className="bg-primary/20 text-xl">
              {displayName?.substring(0, 2).toUpperCase() || user.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        
        {/* User info */}
        <div className="flex-1 flex flex-col items-center md:items-start gap-2">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {displayName}
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            @{user.username}
          </motion.p>
          
          {user.bio && (
            <motion.p 
              className="mt-2 text-sm text-center md:text-left max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {user.bio}
            </motion.p>
          )}
          
          <motion.div 
            className="flex gap-4 mt-2 w-full md:w-auto justify-center md:justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{user.reelsCount ?? 0}</span>
              <span className="text-xs text-muted-foreground">Reels</span>
            </div>
            
            <Separator orientation="vertical" className="h-10" />
            
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{user.followersCount ?? 0}</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            
            <Separator orientation="vertical" className="h-10" />
            
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{user.followingCount ?? 0}</span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
          </motion.div>
        </div>
        
        {/* Action buttons */}
        <motion.div 
          className="flex items-center gap-2 mt-4 md:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {!isCurrentUser && (
            <Button
              variant={isFollowing ? "outline" : "cosmic"}
              onClick={onFollow}
              className="min-w-[100px]"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
