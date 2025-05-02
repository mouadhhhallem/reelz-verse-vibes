
import React, { createContext, useContext, useState, useEffect } from 'react';

interface HologramContextType {
  hologramEnabled: boolean;
  toggleHologram: () => void;
}

const HologramContext = createContext<HologramContextType | undefined>(undefined);

export function HologramProvider({ children }: { children: React.ReactNode }) {
  const [hologramEnabled, setHologramEnabled] = useState<boolean>(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem('hologramEnabled');
    setHologramEnabled(storedPreference !== 'false'); // Default to true
  }, []);

  // Update DOM and localStorage when changed
  useEffect(() => {
    if (hologramEnabled) {
      document.body.classList.add('hologram-enabled');
    } else {
      document.body.classList.remove('hologram-enabled');
    }
    localStorage.setItem('hologramEnabled', hologramEnabled.toString());
  }, [hologramEnabled]);

  const toggleHologram = () => {
    setHologramEnabled(prev => !prev);
  };

  return (
    <HologramContext.Provider
      value={{
        hologramEnabled,
        toggleHologram
      }}
    >
      {children}
    </HologramContext.Provider>
  );
}

export const useHologram = () => {
  const context = useContext(HologramContext);
  if (context === undefined) {
    throw new Error('useHologram must be used within a HologramProvider');
  }
  return context;
};
