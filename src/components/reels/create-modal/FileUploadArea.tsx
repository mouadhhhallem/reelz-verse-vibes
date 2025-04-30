
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileUp } from 'lucide-react';

export interface FileUploadAreaProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({ file, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  return (
    <div 
      className={`w-full h-48 border-2 border-dashed rounded-lg overflow-hidden ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-400 bg-white/5'
      } relative transition-colors duration-200 flex flex-col justify-center items-center`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <p className="text-sm text-muted-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <button 
            className="absolute top-2 right-2 rounded-full bg-black/40 backdrop-blur-sm p-1 text-white"
            onClick={handleRemoveFile}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <motion.div 
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input 
            type="file" 
            accept="video/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileInput}
          />
          <FileUp size={32} className="text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Drop your video here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">
            MP4, WebM, or MOV (max. 100MB)
          </p>
        </motion.div>
      )}
    </div>
  );
};
