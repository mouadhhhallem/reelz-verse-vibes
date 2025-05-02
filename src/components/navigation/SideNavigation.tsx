
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Heart, Trophy, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Switch } from '@/components/ui/switch';

export const SideNavigation: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { viewMode, toggleViewMode } = useViewMode();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Discover', path: '/search' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="hidden md:flex flex-col w-64 h-screen p-6 border-r border-white/10 backdrop-blur-sm"
    >
      {/* Logo */}
      <motion.div
        variants={itemVariants}
        className="mb-10"
      >
        <NavLink to="/" className="flex items-center">
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/40821c9b-79e6-4345-8b22-4be616510c32.png" 
              alt="Reelz" 
              className="h-14 w-auto" 
            />
          </div>
        </NavLink>
      </motion.div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          // Check if this nav item is active
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div key={item.path} variants={itemVariants}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-r-full"
                    layoutId="activeNavIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* View Mode Toggle */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 p-4 rounded-xl bg-white/5 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">View Mode</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Classic</span>
            <Switch
              checked={viewMode === 'bubble'}
              onCheckedChange={toggleViewMode}
            />
            <span className="text-xs text-muted-foreground">Bubble</span>
          </div>
        </div>
      </motion.div>

      {/* User Profile Section */}
      {isAuthenticated && user && (
        <motion.div 
          variants={itemVariants}
          className="mt-6 flex items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm leading-tight">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </motion.div>
      )}

      {/* App Version */}
      <motion.div variants={itemVariants} className="mt-8 text-xs text-muted-foreground text-center">
        Reelz v2.0.0
      </motion.div>
    </motion.div>
  );
};
