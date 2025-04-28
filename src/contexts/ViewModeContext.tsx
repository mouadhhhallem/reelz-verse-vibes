
import React, { createContext, useContext, useState } from 'react';
import { ViewMode } from '@/types';

interface ViewModeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('bubble');

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'bubble' ? 'classic' : 'bubble');
    document.body.classList.toggle('bubble-view');
  };
  
  // Initialize body class
  React.useEffect(() => {
    if (viewMode === 'bubble') {
      document.body.classList.add('bubble-view');
    } else {
      document.body.classList.remove('bubble-view');
    }
  }, []);

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        toggleViewMode,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};
