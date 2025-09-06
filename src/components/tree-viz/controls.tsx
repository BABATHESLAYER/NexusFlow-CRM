"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, StepBack, StepForward, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ControlsProps {
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  isPlaying: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onPlayPause, onNext, onPrev, onReset, isPlaying, isFirstStep, isLastStep }) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onReset} disabled={isFirstStep}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onPrev} disabled={isFirstStep}>
              <StepBack className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous Step</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={onPlayPause} className="w-12 h-12 bg-primary hover:bg-primary/90">
              {isPlaying ? <Pause className="h-6 w-6 text-primary-foreground" /> : <Play className="h-6 w-6 text-primary-foreground" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Pause" : isLastStep ? "Replay" : "Play"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onNext} disabled={isLastStep}>
              <StepForward className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next Step</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default Controls;
