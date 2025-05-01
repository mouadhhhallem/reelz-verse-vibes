
import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useNotifications } from '@/contexts/NotificationContext';
import { WowButton } from '@/components/ui/wow-button';
import { CosmicAvatar } from '@/components/avatar/CosmicAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export function NavbarExtras() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { user } = useAuth();
  
  return (
    <div className="flex items-center gap-3">
      {/* WOW button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <WowButton size="sm" />
      </motion.div>
    
      {/* Notification Center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearAll}
        />
      </motion.div>
      
      {/* Theme toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <ThemeToggle />
      </motion.div>
      
      {/* User avatar */}
      {user && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="ml-2"
        >
          <CosmicAvatar size="sm" />
        </motion.div>
      )}
      
      {/* Magic sparkles */}
      <motion.div 
        className="absolute -z-10 top-0 right-0 text-primary/10 opacity-30"
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <Sparkles size={120} />
      </motion.div>
    </div>
  );
}
