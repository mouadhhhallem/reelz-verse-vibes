
import React, { createContext, useContext, useState } from 'react';

interface BatchSelectionContextType {
  selectedReels: string[];
  isSelectionMode: boolean;
  toggleSelectionMode: () => void;
  toggleReelSelection: (reelId: string) => void;
  selectAllReels: (reelIds: string[]) => void;
  clearSelection: () => void;
  isSelected: (reelId: string) => boolean;
}

const BatchSelectionContext = createContext<BatchSelectionContextType | undefined>(undefined);

export function BatchSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedReels, setSelectedReels] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      clearSelection();
    }
    setIsSelectionMode(!isSelectionMode);
  };

  const toggleReelSelection = (reelId: string) => {
    setSelectedReels(current => 
      current.includes(reelId)
        ? current.filter(id => id !== reelId)
        : [...current, reelId]
    );
  };

  const selectAllReels = (reelIds: string[]) => {
    setSelectedReels(reelIds);
  };

  const clearSelection = () => {
    setSelectedReels([]);
  };

  const isSelected = (reelId: string) => {
    return selectedReels.includes(reelId);
  };

  return (
    <BatchSelectionContext.Provider
      value={{
        selectedReels,
        isSelectionMode,
        toggleSelectionMode,
        toggleReelSelection,
        selectAllReels,
        clearSelection,
        isSelected,
      }}
    >
      {children}
    </BatchSelectionContext.Provider>
  );
}

export const useBatchSelection = () => {
  const context = useContext(BatchSelectionContext);
  if (context === undefined) {
    throw new Error('useBatchSelection must be used within a BatchSelectionProvider');
  }
  return context;
};
