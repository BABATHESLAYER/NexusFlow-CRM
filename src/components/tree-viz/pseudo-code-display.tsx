"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface PseudoCodeDisplayProps {
  currentLine: number;
}

const codeLines = [
  { line: 1, text: "function inorderTraversal(root):" },
  { line: 2, text: "  stack = []" },
  { line: 3, text: "  while current ?? stack:" },
  { line: 4, text: "    while current:" },
  { line: 5, text: "      stack.push(current)" },
  { line: 6, text: "      current = current.left" },
  { line: 7, text: "    current = stack.pop()" },
  { line: 8, text: "    visit(current)" },
  { line: 9, text: "    current = current.right" },
];

export const PseudoCodeDisplay: React.FC<PseudoCodeDisplayProps> = ({ currentLine }) => {
  // The line numbers in traversal steps are a bit different
  // Let's map them to the lines in `codeLines`
  const lineMap: {[key: number]: number} = {
      2: 2, // stack = []
      3: 5, // stack.push(current)
      5: 7, // current = stack.pop()
      6: 8, // visit(current)
      7: 9, // current = current.right
      8: 3, // end of loop check
  }
  const displayLine = lineMap[currentLine] || 0;

  return (
    <div className="bg-muted p-4 rounded-md font-code text-sm">
      {codeLines.map(({line, text}) => (
        <pre
          key={line}
          className={cn(
            "transition-colors duration-300 rounded-sm -mx-2 px-2",
            displayLine === line ? "bg-primary/20 text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {text}
        </pre>
      ))}
    </div>
  );
};
