
import React from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface FileUploadAreaProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileChange }) => {
  return (
    <motion.div 
      className="border-2 border-dashed rounded-md overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        type="file"
        id="videoUpload"
        className="hidden"
        accept="video/*"
        onChange={onFileChange}
      />
      <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center py-10">
        <motion.div 
          className="bg-primary/10 p-4 rounded-full mb-3"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Upload size={40} className="text-primary mb-2" />
        </motion.div>
        <p className="font-medium text-lg">Click to upload</p>
        <p className="text-sm text-muted-foreground mt-1">MP4, WebM or MOV (max. 50MB)</p>
        <p className="text-xs text-muted-foreground mt-3">
          Only upload content you own or have rights to use
        </p>
      </label>
    </motion.div>
  );
};
