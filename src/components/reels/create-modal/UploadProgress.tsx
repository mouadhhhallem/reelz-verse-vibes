
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  isUploading: boolean;
  activeTab: string;
  uploadProgress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  activeTab,
  uploadProgress,
}) => {
  if (!isUploading) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm">Uploading {activeTab === 'youtube' ? 'clip' : 'video'}...</p>
        <span className="text-sm font-medium">{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2" />
    </div>
  );
};
