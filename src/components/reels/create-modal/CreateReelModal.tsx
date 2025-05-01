
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ModalHeader } from "./ModalHeader";
import { CreateReelModalContent, ModalTab } from "./CreateReelModalContent";
import { useReelUpload } from "@/hooks/useReelUpload";

export interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ModalTab;
}

export const CreateReelModal: React.FC<CreateReelModalProps> = ({
  isOpen,
  onClose,
  initialTab = "upload",
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);
  const {
    videoFile,
    setVideoFile,
    videoUrl,
    setVideoUrl,
    isUploading,
    uploadProgress,
    tags,
    setTags,
    title,
    setTitle,
    description,
    setDescription,
    mood,
    setMood,
    handleSubmit,
    resetForm
  } = useReelUpload();

  const handleTabChange = (value: ModalTab) => {
    setActiveTab(value);
    // Reset form when changing tabs
    setVideoFile(null);
    setVideoUrl("");
  };

  const handleVideoFileChange = (file: File | null) => {
    setVideoFile(file);
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  const handleFormSubmit = () => {
    handleSubmit(activeTab);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-background/90 backdrop-blur-xl border border-white/10 rounded-xl p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ ease: "easeOut" }}
              className="relative"
            >
              <ModalHeader onClose={handleClose} />

              <CreateReelModalContent 
                activeTab={activeTab}
                onTabChange={handleTabChange}
                videoFile={videoFile}
                videoUrl={videoUrl}
                onVideoFileChange={handleVideoFileChange}
                onVideoUrlChange={handleVideoUrlChange}
                title={title}
                onTitleChange={setTitle}
                description={description}
                onDescriptionChange={setDescription}
                tags={tags}
                onTagsChange={setTags}
                mood={mood}
                onMoodChange={setMood}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                onSubmit={handleFormSubmit}
                onCancel={handleClose}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
