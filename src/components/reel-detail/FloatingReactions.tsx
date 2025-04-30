
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingReactionsProps {
  reactions: string[];
}

const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {reactions.map((emoji, index) => (
        <motion.div
          key={`${emoji}-${index}`}
          initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 1, scale: 0.5 }}
          animate={{ 
            y: "-100%", 
            opacity: 0, 
            scale: 1.5,
            transition: { 
              duration: 2 + Math.random() * 2,
              ease: "easeOut"
            }
          }}
          className="absolute text-4xl"
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingReactions;
