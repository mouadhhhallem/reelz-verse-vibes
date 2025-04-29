
import React from 'react';
import { TopNavigation } from '../navigation/TopNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation';
import { Outlet } from 'react-router-dom';
import { FloatingAddButton } from '@/components/create/FloatingAddButton';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      <main className="flex-1 container mx-auto pb-20 relative">
        <Outlet />
        <FloatingAddButton />
      </main>
      <MobileNavigation />
    </div>
  );
};
