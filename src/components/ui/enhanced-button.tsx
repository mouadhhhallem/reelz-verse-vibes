
import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  glowColor?: string;
  hoverScale?: number;
  pulseEffect?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, glowColor = "rgba(124, 58, 237, 0.5)", hoverScale = 1.05, pulseEffect = false, children, ...props }, ref) => {
    return (
      <motion.div
        className="relative inline-block"
        whileHover={{ 
          scale: hoverScale,
          z: 10, 
          filter: `drop-shadow(0 10px 15px ${glowColor})`
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden shadow-md transition-all duration-300", 
            className
          )}
          {...props}
        >
          {/* Inner shadow effect */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
          
          {/* Glow effect */}
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
