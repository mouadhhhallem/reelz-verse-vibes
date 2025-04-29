
import React from 'react';
import { TopNavigation } from '../navigation/TopNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation';
import { SideNavigation } from '../navigation/SideNavigation';
import { Outlet } from 'react-router-dom';
import { FloatingAddButton } from '@/components/create/FloatingAddButton';
import { useViewMode } from '@/contexts/ViewModeContext';
import { cn } from '@/lib/utils';

export const Layout: React.FC = () => {
  const { viewMode } = useViewMode();

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden">
      {/* Side Navigation - Desktop Only */}
      <SideNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNavigation />
        <main className={cn(
          "flex-1 w-full pb-20 relative overflow-y-auto scrollbar-hide", 
          viewMode === 'bubble' ? 'bg-gradient-to-br from-background/80 to-background' : 'bg-background/80'
        )}>
          <Outlet />
          <FloatingAddButton />
        </main>
        <MobileNavigation />
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-reelz-purple/5 to-reelz-teal/5 pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-64 -z-10 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-64 -z-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      {/* Animated orbs */}
      <div className="fixed top-10 right-[10%] w-64 h-64 rounded-full bg-reelz-purple/10 blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="fixed bottom-10 left-[5%] w-96 h-96 rounded-full bg-reelz-teal/10 blur-3xl animate-float pointer-events-none"></div>
    </div>
  );
};
