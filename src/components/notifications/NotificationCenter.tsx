
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, Settings } from 'lucide-react';
import { NotificationToast, NotificationType } from './NotificationToast';
import { Button } from '@/components/ui/button';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  username?: string;
  userAvatar?: string;
  time: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread notifications
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  // Effect for notification bell animation when new notifications arrive
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-white/10 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={animate ? { 
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
          <span className="sr-only">Notifications</span>
          
          {/* Notification indicator */}
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white"
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.div>
      </Button>

      {/* Notification panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 z-50 rounded-xl backdrop-blur-xl bg-background/80 shadow-xl border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-medium text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Notifications
              </h3>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClearAll}
                  className="h-7 w-7"
                >
                  <Settings size={14} />
                </Button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-2 scrollbar-none">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} onClick={() => onMarkAsRead(notification.id)}>
                    <NotificationToast 
                      {...notification} 
                      onClose={() => onMarkAsRead(notification.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <Bell className="text-muted-foreground mb-2" size={32} />
                    <p className="text-sm text-muted-foreground">
                      No notifications yet
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
