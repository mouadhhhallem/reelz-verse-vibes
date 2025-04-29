
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, ExternalLink } from 'lucide-react';
import { CreateReelModal } from '@/components/reels/CreateReelModal';

export const FloatingAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'youtube' | 'upload'>('youtube');

  const handleOpenModal = (type: 'youtube' | 'upload') => {
    setModalType(type);
    setIsModalOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed right-6 bottom-20 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute bottom-16 right-0 mb-4 space-y-3 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                className="flex items-center glass rounded-full pr-4 pl-2 py-2"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleOpenModal('upload')}
              >
                <div className="bg-gradient-to-r from-secondary to-primary rounded-full p-2">
                  <Video size={20} className="text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">Upload Video</span>
              </motion.div>
              
              <motion.div
                className="flex items-center glass rounded-full pr-4 pl-2 py-2"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleOpenModal('youtube')}
              >
                <div className="bg-gradient-to-r from-primary to-secondary rounded-full p-2">
                  <ExternalLink size={20} className="text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">Add Link</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          className="bg-gradient-to-r from-primary to-secondary rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div 
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="text-white" size={28} />
          </motion.div>
        </motion.button>
      </div>
      
      <CreateReelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={modalType}
      />
    </>
  );
};
