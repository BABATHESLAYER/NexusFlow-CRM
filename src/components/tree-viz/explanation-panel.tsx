"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { TraversalStep } from '@/lib/tree';
import { explainTraversalStep } from '@/ai/flows/explain-traversal-step';
import { cn } from '@/lib/utils';

interface ExplanationPanelProps {
  currentStep: TraversalStep | undefined;
}

const pseudocode = [
  "procedure Inorder(node):",
  "  stack = empty stack",
  "  while node is not null or stack is not empty:",
  "    while node is not null:",
  "      stack.push(node)",
  "      node = node.left",
  "    node = stack.pop()",
  "    visit(node)",
  "    node = node.right",
];

const lineMapping: { [key: number]: number } = {
  2: 3, 
  3: 4, 
  5: 7, 
  6: 8, 
  7: 9, 
  8: 3,
};

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ currentStep }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!currentStep) return;

    startTransition(async () => {
      try {
        setError(null);
        setExplanation('');
        const res = await explainTraversalStep({
          stepDescription: currentStep.explanation,
          currentNode: currentStep.currentNodeId?.toString() ?? 'null',
          stackContents: JSON.stringify(currentStep.stack),
        });
        setExplanation(res.explanation);
      } catch (err) {
        console.error("AI explanation failed:", err);
        setError("Could not load explanation from AI.");
        setExplanation('');
      }
    });
  }, [currentStep]);

  const activeLine = currentStep ? (lineMapping[currentStep.codeLine] || 0) : 0;

  return (
    <Card className="flex-grow flex flex-col">
      <CardHeader>
        <CardTitle>Step-by-Step Explanation</CardTitle>
        <CardDescription>{currentStep?.action ?? "Waiting for traversal..."}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-grow">
        <div>
          <h3 className="font-semibold mb-2 text-sm">Pseudocode</h3>
          <div className="p-3 bg-muted rounded-md font-code text-xs">
            {pseudocode.map((line, index) => (
                <p key={index} className={cn('transition-colors', activeLine === index + 1 ? 'text-accent-foreground bg-accent/20 rounded -mx-1 px-1' : '')}>
                    {line}
                </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-grow">
            <h3 className="font-semibold mb-2 text-sm">AI Tutor</h3>
            <div className="p-4 border rounded-md min-h-[150px] font-code text-sm prose prose-sm max-w-none prose-p:my-2 prose-pre:my-2 prose-pre:bg-muted prose-pre:p-2 prose-pre:rounded-md flex-grow">
              {isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }} />
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplanationPanel;
