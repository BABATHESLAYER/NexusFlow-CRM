"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { NodeWithPosition, Edge, TraversalStep } from '@/lib/tree';

interface TreeVisualizerProps {
  nodes: NodeWithPosition[];
  edges: Edge[];
  width: number;
  height: number;
  currentStep: TraversalStep | undefined;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ nodes, edges, width, height, currentStep }) => {
  return (
    <div className="absolute inset-0 grid place-content-center">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible absolute inset-0 z-0">
          <g>
            {edges.map((edge, i) => (
              <motion.line
                key={i}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
          </g>
        </svg>
        {nodes.map((node) => {
          const isCurrent = currentStep?.currentNodeId === node.id;
          const isVisited = currentStep?.visitedNodes.includes(node.id);

          return (
            <motion.div
              key={node.id}
              className="absolute z-10 flex items-center justify-center w-12 h-12 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                left: node.x,
                top: node.y,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className={cn(
                "flex items-center justify-center w-full h-full rounded-full border-2 shadow-lg transition-all duration-300",
                isVisited ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border",
                isCurrent && "border-primary ring-4 ring-primary/50 shadow-2xl shadow-primary/50"
              )}>
                <span className="text-lg font-bold">{node.val}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TreeVisualizer;
