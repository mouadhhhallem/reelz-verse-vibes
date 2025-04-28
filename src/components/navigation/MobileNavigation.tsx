
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  User, 
  Heart, 
  Plus 
} from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export const MobileNavigation: React.FC = () => {
  const { viewMode, toggleViewMode } = useViewMode();

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 px-2 py-2 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center">
        <NavLink to="/" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </NavLink>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full w-14 h-14 p-0 flex items-center justify-center hover:bg-primary hover:text-white border-2 border-primary">
              <Plus size={24} className="text-primary hover:text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <CreateReelContent />
          </SheetContent>
        </Sheet>

        <NavLink to="/favorites" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <Heart size={24} />
          <span className="text-xs mt-1">Favorites</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => 
          `flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
        }>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>
      </div>
    </motion.div>
  );
};

// Placeholder for CreateReelContent component
const CreateReelContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center pt-6">
      <h2 className="text-2xl font-bold mb-6">Create New Reel</h2>
      <div className="grid gap-4 w-full">
        <Button className="h-20 text-lg gap-2">
          <Plus size={24} /> Upload Video
        </Button>
        <Button className="h-20 text-lg gap-2" variant="outline">
          <Plus size={24} /> YouTube Link
        </Button>
      </div>
    </div>
  );
};
