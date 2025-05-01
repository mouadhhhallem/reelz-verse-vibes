
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SubmitButtonProps {
  isUploading: boolean;
  disabled: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isUploading,
  disabled,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-background/80 backdrop-blur-md p-4">
      <Button variant="outline" onClick={onCancel} disabled={isUploading}>
        Cancel
      </Button>
      <Button 
        variant="cosmic" 
        onClick={onSubmit}
        disabled={disabled || isUploading}
        className="relative overflow-hidden group min-w-32"
      >
        <span className="relative z-10">
          {isUploading ? "Uploading..." : "Create Reel"}
        </span>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
          initial={{ x: '-100%' }}
          animate={{ 
            x: isUploading ? '100%' : '-100%',
          }}
          transition={{ 
            duration: isUploading ? 1.5 : 0.5,
            repeat: isUploading ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </Button>
    </div>
  );
};
