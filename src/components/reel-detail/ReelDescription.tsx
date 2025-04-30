
import React from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

interface ReelDescriptionProps {
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  views: number;
}

const ReelDescription: React.FC<ReelDescriptionProps> = ({ 
  title, 
  description, 
  tags, 
  createdAt, 
  views 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div 
            className="text-xl font-bold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.div>
        </div>
        
        <motion.div 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {new Date(createdAt).toLocaleDateString()} • {views.toLocaleString()} views
        </motion.div>
      </div>
      
      <Separator className="my-4" />
      
      <motion.p 
        className="text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {description}
      </motion.p>
      
      <motion.div 
        className="mt-4 flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {tags.map(tag => (
          <span 
            key={tag} 
            className="text-sm bg-primary/20 px-3 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ReelDescription;
