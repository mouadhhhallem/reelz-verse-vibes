
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/components/notifications/NotificationCenter';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Simulate fetching notifications when user changes
  useEffect(() => {
    if (user) {
      // In a real app, fetch from server
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'like',
          message: 'liked your reel',
          username: 'John Doe',
          userAvatar: 'https://i.pravatar.cc/150?img=1',
          time: '2 minutes ago',
          isRead: false,
        },
        {
          id: '2',
          type: 'comment',
          message: 'commented on your reel: "This is awesome!"',
          username: 'Jane Smith',
          userAvatar: 'https://i.pravatar.cc/150?img=2',
          time: '15 minutes ago',
          isRead: false,
        },
        {
          id: '3',
          type: 'follow',
          message: 'started following you',
          username: 'Mike Johnson',
          userAvatar: 'https://i.pravatar.cc/150?img=3',
          time: '2 hours ago',
          isRead: true,
        },
      ];
      
      setNotifications(mockNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'Just now',
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notifications
    toast({
      title: `New ${notification.type}`,
      description: notification.message,
      duration: 5000,
    });
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
