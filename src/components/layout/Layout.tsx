
import React, { useEffect, useState } from 'react';
import { TopNavigation } from '../navigation/TopNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation';
import { SideNavigation } from '../navigation/SideNavigation';
import { Outlet } from 'react-router-dom';
import { FloatingAddButton } from '@/components/create/FloatingAddButton';
import { useViewMode } from '@/contexts/ViewModeContext';
import { useMoodTheme } from '@/components/ui/mood-theme-provider';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Layout: React.FC = () => {
  const { viewMode } = useViewMode();
  const { mood, getNebulaEffect } = useMoodTheme();
  const [starryNight, setStarryNight] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);
  
  // Generate starry background effect
  useEffect(() => {
    const generateStars = () => {
      const stars = [];
      const starCount = Math.floor(window.innerWidth / 10); // Responsive star count
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
      
      setStarryNight(stars);
    };
    
    generateStars();
    window.addEventListener('resize', generateStars);
    
    return () => window.removeEventListener('resize', generateStars);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden">
      {/* Cosmic Background Layer */}
      <div className="fixed inset-0 -z-20 bg-background overflow-hidden">
        {/* Nebula effect */}
        <div className={cn(
          "absolute inset-0 opacity-30 transition-opacity duration-1000",
          getNebulaEffect()
        )}></div>
        
        {/* Stars */}
        {starryNight.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 1.5, star.opacity],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
        
        {/* Orbital rings */}
        <div className="absolute left-1/4 top-1/4 w-[500px] h-[500px] rounded-full border border-white/5 animate-rotate-slow"></div>
        <div className="absolute right-1/4 bottom-1/4 w-[300px] h-[300px] rounded-full border border-white/3 animate-rotate-slow"></div>
        
        {/* Aurora glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-primary/10 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {/* Side Navigation - Desktop Only */}
      <SideNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNavigation />
        <main className={cn(
          "flex-1 w-full pb-20 relative overflow-y-auto scrollbar-hide", 
          viewMode === 'bubble' ? 'bg-background/5 backdrop-blur-sm' : 'bg-background/20'
        )}>
          <Outlet />
          <FloatingAddButton />
        </main>
        <MobileNavigation />
      </div>

      {/* Frosted Glass Overlays */}
      <div className="fixed top-0 left-0 right-0 h-20 -z-10 bg-gradient-to-b from-background/70 to-transparent backdrop-blur-sm pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-24 -z-10 bg-gradient-to-t from-background/70 to-transparent backdrop-blur-sm pointer-events-none" />
    </div>
  );
};
