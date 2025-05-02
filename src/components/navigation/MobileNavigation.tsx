
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  User, 
  Heart, 
  Trophy,
  Plus 
} from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export const MobileNavigation: React.FC = () => {
  const { viewMode, toggleViewMode } = useViewMode();

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/40 border-t border-white/10 px-2 py-2 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center">
        <NavLink to="/" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <Search size={22} />
          <span className="text-xs mt-1">Discover</span>
        </NavLink>

        <Sheet>
          <SheetTrigger asChild>
            <Button 
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus size={24} className="text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl backdrop-blur-xl bg-background/60">
            <div className="flex flex-col items-center pt-6">
              <img 
                src="/lovable-uploads/40821c9b-79e6-4345-8b22-4be616510c32.png" 
                alt="Reelz" 
                className="h-12 w-auto mb-6" 
              />
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Create New Reel
              </h2>
              <div className="grid gap-4 w-full">
                <Button className="h-20 text-lg gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10">
                  <Plus size={24} /> Upload Video
                </Button>
                <Button className="h-20 text-lg gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10">
                  <Plus size={24} /> YouTube Link
                </Button>
                <Button className="h-20 text-lg gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10">
                  <Plus size={24} /> Twitch Clip
                </Button>
                <Button className="h-20 text-lg gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10">
                  <Plus size={24} /> Vimeo Video
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <NavLink to="/leaderboard" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <Trophy size={22} />
          <span className="text-xs mt-1">Trending</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <User size={22} />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>
      </div>
    </motion.div>
  );
};
