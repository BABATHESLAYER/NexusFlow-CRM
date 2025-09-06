"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildTree, generateInorderTraversalSteps, getTreeLayout, TraversalStep, TreeNode } from '@/lib/tree';
import TreeVisualizer from './tree-visualizer';
import StackVisualizer from './stack-visualizer';
import Controls from './controls';

const DEFAULT_TREE = "[4, 2, 7, 1, 3, 6, 9]";

export function TreeVizContainer() {
  const [userInput, setUserInput] = useState(DEFAULT_TREE);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { nodes, edges, width, height } = useMemo(() => {
    if (!tree) return { nodes: [], edges: [], width: 0, height: 0 };
    return getTreeLayout(tree);
  }, [tree]);

  const traversalSteps = useMemo(() => {
    return tree ? generateInorderTraversalSteps(tree) : [];
  }, [tree]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const currentStep = traversalSteps[currentStepIndex];
  
  const handleBuildTree = useCallback(() => {
    try {
      const parsedInput = JSON.parse(userInput.replace(/,(\s*])/, '$1')); // Tolerate trailing commas
      if (!Array.isArray(parsedInput)) {
        throw new Error("Input must be a valid JSON array.");
      }
      const newTree = buildTree(parsedInput);
      setTree(newTree);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid input format.");
      setTree(null);
    }
  }, [userInput]);

  useEffect(() => {
    handleBuildTree();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < traversalSteps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1000);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, traversalSteps.length]);

  const handlePlayPause = () => {
    if (currentStepIndex >= traversalSteps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < traversalSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };
  
  const visitedOutput = useMemo(() => {
    if (!currentStep) return [];
    return currentStep.visitedNodes.map(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      return node ? node.val : '';
    });
  }, [currentStep, nodes]);

  return (
    <div className="grid md:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-6 p-4 md:p-6 h-full">
      <div className="flex flex-col gap-6">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Tree Visualization</CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[300px] md:min-h-[400px] w-full overflow-auto">
            {tree ? (
              <TreeVisualizer
                nodes={nodes}
                edges={edges}
                width={width}
                height={height}
                currentStep={currentStep}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>{error || "Build a tree to begin."}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <StackVisualizer stack={currentStep?.stack ?? []} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Visited Nodes (Inorder)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md min-h-[50px] items-center">
                {visitedOutput.map((val, i) => (
                  <div key={i} className="flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-md font-bold text-lg shadow-md">
                    {val}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tree Definition</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <Textarea
              placeholder="e.g., [1, 2, 3, null, 4]"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="font-code"
              rows={3}
            />
             {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleBuildTree}>Build Tree</Button>
            <Controls 
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
              isPlaying={isPlaying}
              isFirstStep={currentStepIndex === 0}
              isLastStep={currentStepIndex === traversalSteps.length - 1}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
