
import React from 'react';
import { motion } from 'framer-motion';

interface ReactionPanelProps {
  show: boolean;
  onAddReaction: (emoji: string) => void;
}

const ReactionPanel: React.FC<ReactionPanelProps> = ({ show, onAddReaction }) => {
  if (!show) return null;

  return (
    <motion.div 
      className="absolute right-16 bottom-32 backdrop-blur-lg bg-black/50 rounded-xl p-3 flex gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {["👍", "❤️", "🔥", "👏", "😂", "😢"].map(emoji => (
        <motion.button
          key={emoji}
          className="text-2xl hover:scale-125 transition-transform"
          whileHover={{ scale: 1.2 }}
          onClick={() => onAddReaction(emoji)}
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default ReactionPanel;
