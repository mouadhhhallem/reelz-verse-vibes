
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Moon, Sun } from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useTheme } from 'next-themes';

export const TopNavigation: React.FC = () => {
  const { viewMode, toggleViewMode } = useViewMode();
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  // Load hologram preference from localStorage
  const [hologramEnabled, setHologramEnabled] = useState(true);
  
  useEffect(() => {
    const storedHologramPreference = localStorage.getItem('hologramEnabled');
    if (storedHologramPreference !== null) {
      setHologramEnabled(storedHologramPreference === 'true');
    }
    
    // Apply hologram class
    if (hologramEnabled) {
      document.body.classList.add('hologram-enabled');
    } else {
      document.body.classList.remove('hologram-enabled');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.div 
      className="sticky top-0 z-40 backdrop-blur-lg bg-background/40 border-b border-white/10 px-4 py-3"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Mobile Logo - Visible on mobile only */}
          <div className="md:hidden">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/bca827df-e2b6-4764-8e29-be1293c605af.png" 
                alt="Reelz" 
                className="h-8 w-auto" 
              />
            </Link>
          </div>

          {/* View Mode Toggle - Hidden on mobile */}
          <div className="hidden md:flex items-center ml-6 space-x-1">
            <Switch
              checked={viewMode === 'bubble'}
              onCheckedChange={toggleViewMode}
              aria-label="Toggle view mode"
            />
            <span className="text-sm ml-1 text-muted-foreground">{viewMode === 'bubble' ? 'Bubble' : 'Classic'}</span>
          </div>
          
          {/* Theme toggle */}
          <div className="hidden md:flex items-center ml-4 space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-white/10"
              onClick={toggleTheme}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === 'dark' ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </motion.div>
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* App Name */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block"
          >
            <img 
              src="/lovable-uploads/659ed189-01a7-463c-85fe-2467c74338fb.png" 
              alt="Reelz" 
              className="h-8 w-auto" 
            />
          </motion.div>

          <Link to="/search">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-white/10"
            >
              <Search size={20} />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          {isAuthenticated && (
            <>
              {/* Notification Center */}
              <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClearAll={clearAll}
              />
              
              <Link to="/profile">
                <motion.div 
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/50 hover:border-primary transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={user?.avatar || "https://i.pravatar.cc/100"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </Link>
            </>
          )}
          
          {!isAuthenticated && (
            <Link to="/login">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};
