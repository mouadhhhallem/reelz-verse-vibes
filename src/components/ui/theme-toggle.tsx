
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Create the transition circle element
    const circle = document.createElement('div');
    circle.className = `theme-transition-circle ${resolvedTheme === 'dark' ? 'theme-transition-light' : 'theme-transition-dark'}`;
    
    // Calculate position based on click location (center of screen for now)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    circle.style.left = `${centerX}px`;
    circle.style.top = `${centerY}px`;
    
    document.body.appendChild(circle);
    
    // Animate the circle
    requestAnimationFrame(() => {
      circle.style.transform = 'scale(2)';
      circle.style.transition = 'transform 1000ms cubic-bezier(0.86, 0, 0.07, 1)';
    });
    
    // Switch theme after animation starts
    setTimeout(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, 200);
    
    // Remove the circle after transition completes
    setTimeout(() => {
      if (document.body.contains(circle)) {
        document.body.removeChild(circle);
      }
      setIsTransitioning(false);
    }, 1000);
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-muted/30 hover:bg-muted/50"
      disabled={isTransitioning}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {resolvedTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.div>
      </AnimatePresence>
      
      {/* Orbital rings */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-[-3px] rounded-full border border-secondary/20 animate-[spin_15s_linear_infinite_reverse]"></div>
        <div className="absolute inset-[-6px] rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]"></div>
      </div>
    </Button>
  );
}
