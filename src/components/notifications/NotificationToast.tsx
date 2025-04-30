
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageSquare, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'system';

interface NotificationToastProps {
  id: string;
  type: NotificationType;
  message: string;
  username?: string;
  userAvatar?: string;
  time: string;
  isRead?: boolean;
  onClose?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  message,
  username,
  userAvatar,
  time,
  isRead = false,
  onClose,
}) => {
  // Icon mapping based on notification type
  const iconMap = {
    like: <Heart className="text-red-400" size={18} />,
    comment: <MessageSquare className="text-blue-400" size={18} />,
    follow: <Users className="text-green-400" size={18} />,
    mention: <Star className="text-amber-400" size={18} />,
    system: <Bell className="text-purple-400" size={18} />,
  };
  
  // Background styles based on notification type
  const bgStyles = {
    like: 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20',
    comment: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    follow: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20',
    mention: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20',
    system: 'bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-purple-500/20',
  };
  
  // Animation effects for particles
  const particles = Array(10).fill(0).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    scale: Math.random() * 0.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={cn(
          "relative rounded-xl border backdrop-blur-md shadow-lg p-4 overflow-hidden",
          bgStyles[type],
          isRead ? "opacity-75" : ""
        )}
      >
        {/* Animated particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0 
            }}
            animate={{ 
              x: particle.x, 
              y: particle.y, 
              opacity: particle.opacity,
              scale: [particle.scale, particle.scale * 2, 0]
            }}
            transition={{ 
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Notification content */}
        <div className="flex items-start gap-3 relative z-10">
          {/* Icon with animated ring */}
          <div className="relative">
            {userAvatar ? (
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 rounded-full opacity-60"
                  animate={{ 
                    boxShadow: [
                      `0 0 0 2px ${type === 'like' ? '#f87171' : type === 'comment' ? '#60a5fa' : type === 'follow' ? '#4ade80' : type === 'mention' ? '#fbbf24' : '#a78bfa'}`,
                      `0 0 0 0px ${type === 'like' ? '#f87171' : type === 'comment' ? '#60a5fa' : type === 'follow' ? '#4ade80' : type === 'mention' ? '#fbbf24' : '#a78bfa'}`
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <img
                  src={userAvatar}
                  alt={username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <motion.div
                  className="absolute -bottom-1 -right-1 rounded-full p-0.5 bg-background"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {iconMap[type]}
                </motion.div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {iconMap[type]}
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-medium">
              {username && (
                <span className="font-bold text-foreground">{username} </span>
              )}
              <motion.span
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {message}
              </motion.span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{time}</p>
          </div>
          
          {/* Close button */}
          {onClose && (
            <motion.button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
