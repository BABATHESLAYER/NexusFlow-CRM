"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StackVisualizerProps {
  stack: number[];
}

const StackVisualizer: React.FC<StackVisualizerProps> = ({ stack }) => {
  return (
    <div className="flex flex-col-reverse items-center gap-1 bg-muted rounded-md p-2 min-h-[200px]">
      <AnimatePresence>
        {stack.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground text-sm"
          >
            Stack is empty
          </motion.div>
        )}
        {stack.map((value, index) => (
          <motion.div
            key={`${value}-${index}`}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex items-center justify-center w-full h-10 bg-secondary text-secondary-foreground rounded-md font-mono font-bold text-lg shadow"
          >
            {value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StackVisualizer;
