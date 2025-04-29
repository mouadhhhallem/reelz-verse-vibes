
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, Settings } from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';

export const TopNavigation: React.FC = () => {
  const { viewMode, toggleViewMode } = useViewMode();
  const { user, isAuthenticated } = useAuth();

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
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-reelz-teal bg-clip-text text-transparent">Reelz</span>
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
        </div>

        <div className="flex items-center space-x-4">
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
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-white/10 relative"
              >
                <Bell size={20} />
                <span className="sr-only">Notifications</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              
              <Link to="/profile">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/50 hover:border-primary transition-all duration-300">
                  <img 
                    src={user?.avatar || "https://i.pravatar.cc/100"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
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
