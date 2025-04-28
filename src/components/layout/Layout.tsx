
import React from 'react';
import { TopNavigation } from '../navigation/TopNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      <main className="flex-1 container mx-auto pb-20">
        <Outlet />
      </main>
      <MobileNavigation />
    </div>
  );
};
