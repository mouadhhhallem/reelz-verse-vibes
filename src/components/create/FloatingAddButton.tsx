import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, ExternalLink, Twitch, Tv2 } from 'lucide-react';
import { CreateReelModal } from '@/components/reels/CreateReelModal';

export const FloatingAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'youtube' | 'upload' | 'twitch' | 'vimeo'>('youtube');

  const handleOpenModal = (type: 'youtube' | 'upload' | 'twitch' | 'vimeo') => {
    setModalType(type);
    setIsModalOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed right-6 bottom-20 z-40 hidden md:block">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute bottom-16 right-0 mb-4 space-y-3 flex flex-col items-end"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                className="flex items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-full pr-4 pl-2 py-2 shadow-xl"
                whileHover={{ scale: 1.05, x: -5 }}
                onClick={() => handleOpenModal('upload')}
              >
                <div className="bg-gradient-to-br from-reelz-purple to-reelz-purple-dark rounded-full p-2">
                  <Video size={20} className="text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">Upload Video</span>
              </motion.div>
              
              <motion.div
                className="flex items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-full pr-4 pl-2 py-2 shadow-xl"
                whileHover={{ scale: 1.05, x: -5 }}
                onClick={() => handleOpenModal('youtube')}
              >
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-full p-2">
                  <ExternalLink size={20} className="text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">YouTube Link</span>
              </motion.div>

              <motion.div
                className="flex items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-full pr-4 pl-2 py-2 shadow-xl"
                whileHover={{ scale: 1.05, x: -5 }}
                onClick={() => handleOpenModal('twitch')}
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2">
                  <Twitch size={20} className="text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">Twitch Clip</span>
              </motion.div>

              <motion.div
                className="flex items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-full pr-4 pl-2 py-2 shadow-xl"
                whileHover={{ scale: 1.05, x: -5 }}
                onClick={() => handleOpenModal('vimeo')}
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2">
                  <Tv2 size={20} className="text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">Vimeo Video</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          className="relative bg-gradient-to-r from-primary to-secondary rounded-full w-14 h-14 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          whileHover={{ scale: 1.1, boxShadow: "0 8px 30px rgba(124, 58, 237, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-reelz-purple to-reelz-teal opacity-70"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          
          <motion.div 
            className="relative z-10"
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
