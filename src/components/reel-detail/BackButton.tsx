
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  show: boolean;
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ show, onClick }) => {
  return (
    <motion.div
      className="absolute top-4 left-4 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button 
        variant="glass" 
        size="icon" 
        className="rounded-full"
        onClick={onClick}
      >
        <ArrowLeft size={20} />
      </Button>
    </motion.div>
  );
};

export default BackButton;
