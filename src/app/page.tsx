import { TreeVizContainer } from '@/components/tree-viz/tree-viz-container';
import { Network } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Network className="h-6 w-6 text-primary" />
          <span className="font-headline">TreeViz</span>
        </h1>
        <p className="hidden md:block text-muted-foreground">
          Visualize Non-Recursive Inorder Traversal in a Binary Tree
        </p>
      </header>
      <main className="flex-1">
        <TreeVizContainer />
      </main>
    </div>
  );
}
