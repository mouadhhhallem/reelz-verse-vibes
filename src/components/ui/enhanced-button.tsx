
import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';
import { useMoodTheme } from './mood-theme-provider';

interface EnhancedButtonProps extends ButtonProps {
  glowColor?: string;
  hoverScale?: number;
  pulseEffect?: boolean;
  cosmic?: boolean;
  neumorphic?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    glowColor,
    hoverScale = 1.05, 
    pulseEffect = false,
    cosmic = false,
    neumorphic = false,
    children, 
    ...props 
  }, ref) => {
    const { mood, getMoodColor } = useMoodTheme();
    
    // Get the mood-specific glow color if not provided
    const moodGlowColor = glowColor || `rgba(${getMoodColor().replace('#', '')}, 0.5)`;

    return (
      <motion.div
        className={cn(
          "relative inline-block",
          neumorphic && "neumorphic-button"
        )}
        whileHover={{ 
          scale: hoverScale,
          z: 10, 
          filter: `drop-shadow(0 10px 15px ${moodGlowColor})`
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden shadow-md transition-all duration-300", 
            cosmic && "cosmic-button",
            className
          )}
          {...props}
        >
          {/* Inner shadow effect for depth */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
          
          {/* Glow effect - animates based on mood */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={pulseEffect ? { 
              x: ['100%', '-100%'], 
              opacity: [0, 1, 0],
            } : {}}
            transition={pulseEffect ? { 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            } : {}}
          />
          
          {/* Cosmic particles effect */}
          {cosmic && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  initial={{ 
                    x: Math.random() * 100, 
                    y: Math.random() * 100, 
                    scale: 0.5,
                    opacity: 0.5 
                  }}
                  animate={{ 
                    x: Math.random() * 100, 
                    y: Math.random() * 100,
                    scale: [0.5, 1, 0.5],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Content */}
          <span className="relative z-10">{children}</span>
        </Button>
        
        {/* Background shadow for 3D effect */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300 -z-10" />
      </motion.div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
