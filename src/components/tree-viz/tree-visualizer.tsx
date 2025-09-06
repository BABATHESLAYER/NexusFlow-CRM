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
  if (width === 0 || height === 0) {
    return null;
  }
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
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
          </g>
        </svg>
        <div className="relative z-10">
          {nodes.map((node) => {
            const isCurrent = currentStep?.currentNodeId === node.id;
            const isVisited = currentStep?.visitedNodes.includes(node.id);

            return (
              <motion.div
                key={node.id}
                className="absolute flex items-center justify-center w-12 h-12"
                style={{
                  left: node.x,
                  top: node.y,
                  //
                  // --- MANUAL FIX ---
                  // You can manually adjust the horizontal alignment here.
                  // To move the node LEFT, make the percentage MORE NEGATIVE (e.g., -60%, -70%).
                  // To move the node RIGHT, make the percentage LESS NEGATIVE (e.g., -40%, -30%).
                  // The default is -50% to center the node.
                  //
                  transform: `translateX(-50%) translateY(-50%)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div className={cn(
                  "flex items-center justify-center w-full h-full rounded-full border-2 shadow-lg transition-all duration-300",
                  isVisited ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border",
                  isCurrent && "border-primary ring-4 ring-primary/30 shadow-[0_0_20px_8px] shadow-primary/30"
                )}>
                  <span className="text-lg font-bold">{node.val}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;