let nodeIdCounter = 0;

export class TreeNode {
  id: number;
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number = 0;
  y: number = 0;

  constructor(val: number) {
    this.id = nodeIdCounter++;
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

export function buildTree(values: (number | null)[]): TreeNode | null {
  nodeIdCounter = 0;
  if (!values || values.length === 0 || values[0] === null) {
    return null;
  }

  const root = new TreeNode(values[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;

  while (i < values.length) {
    const currentNode = queue.shift();
    if (currentNode) {
      if (values[i] !== null && values[i] !== undefined) {
        currentNode.left = new TreeNode(values[i]!);
        queue.push(currentNode.left);
      }
      i++;
      if (i < values.length && values[i] !== null && values[i] !== undefined) {
        currentNode.right = new TreeNode(values[i]!);
        queue.push(currentNode.right);
      }
      i++;
    }
  }
  return root;
}

export type TraversalStep = {
  action: string;
  currentNodeId: number | null;
  stack: number[];
  visitedNodes: number[];
  codeLine: number;
  explanation: string;
};

export function generateInorderTraversalSteps(root: TreeNode | null): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;
  const visitedNodes: number[] = [];

  const initialExplanation = "Starting the traversal. The current node is the root, and the stack is empty.";
  steps.push({
    action: "Start",
    currentNodeId: root?.id ?? null,
    stack: [],
    visitedNodes: [...visitedNodes],
    codeLine: 2,
    explanation: initialExplanation,
  });

  while (current !== null || stack.length > 0) {
    while (current !== null) {
      steps.push({
        action: `Push ${current.val}`,
        currentNodeId: current.id,
        stack: stack.map(n => n.val),
        visitedNodes: [...visitedNodes],
        codeLine: 3,
        explanation: `Current node (${current.val}) is not null. Pushing it to the stack and moving to its left child.`,
      });
      stack.push(current);
      current = current.left;
    }

    if (stack.length > 0) {
        current = stack.pop()!;

        steps.push({
            action: `Pop ${current.val}`,
            currentNodeId: current.id,
            stack: stack.map(n => n.val).concat(current.val), // Show stack before pop
            visitedNodes: [...visitedNodes],
            codeLine: 5,
            explanation: `Current node is null, so we pop a node from the stack. The popped node is ${current.val}.`
        });

        visitedNodes.push(current.id);
        steps.push({
            action: `Visit ${current.val}`,
            currentNodeId: current.id,
            stack: stack.map(n => n.val),
            visitedNodes: [...visitedNodes],
            codeLine: 6,
            explanation: `Visiting the popped node ${current.val}. Its value is added to the result.`,
        });

        current = current.right;
        steps.push({
            action: current ? `Move to right child of ${stack[stack.length - 1]?.val ?? 'popped node'}` : `No right child`,
            currentNodeId: current?.id ?? null,
            stack: stack.map(n => n.val),
            visitedNodes: [...visitedNodes],
            codeLine: 7,
            explanation: current ? `Moving to the right child of the visited node. The new current node is ${current.val}.` : `Moving to the right child of the visited node. The new current node is null.`,
        });
    }
  }

  steps.push({
    action: "End",
    currentNodeId: null,
    stack: [],
    visitedNodes: [...visitedNodes],
    codeLine: 8,
    explanation: 'Traversal complete. The current node is null and the stack is empty.',
  });

  return steps;
}

export type NodeWithPosition = TreeNode & { x: number, y: number };
export type Edge = { from: { x: number, y: number }, to: { x: number, y: number } };

export function getTreeLayout(root: TreeNode | null): { nodes: NodeWithPosition[], edges: Edge[], width: number, height: number } {
    const nodes: NodeWithPosition[] = [];
    const edges: Edge[] = [];
    
    function traverse(node: TreeNode | null, depth: number, x: number, xOffset: number) {
        if (!node) return;

        node.x = x;
        node.y = depth * 100 + 50; // Vertical spacing
        nodes.push(node as NodeWithPosition);

        if (node.left) {
            const childX = x - xOffset;
            edges.push({ from: { x: node.x, y: node.y }, to: { x: childX, y: (depth + 1) * 100 + 50 } });
            traverse(node.left, depth + 1, childX, xOffset / 1.7);
        }
        if (node.right) {
            const childX = x + xOffset;
            edges.push({ from: { x: node.x, y: node.y }, to: { x: childX, y: (depth + 1) * 100 + 50 } });
            traverse(node.right, depth + 1, childX, xOffset / 1.7);
        }
    }

    const initialWidth = 600;
    traverse(root, 0, 0, initialWidth / 4);

    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    const padding = 50;

    if (nodes.length > 0) {
        minX = Math.min(...nodes.map(n => n.x));
        maxX = Math.max(...nodes.map(n => n.x));
        minY = Math.min(...nodes.map(n => n.y));
        maxY = Math.max(...nodes.map(n => n.y));
        
        nodes.forEach(node => {
            node.x += Math.abs(minX) + padding;
            node.y += Math.abs(minY) + padding;
        });
        edges.forEach(edge => {
            edge.from.x += Math.abs(minX) + padding;
            edge.from.y += Math.abs(minY) + padding;
            edge.to.x += Math.abs(minX) + padding;
            edge.to.y += Math.abs(minY) + padding;
        });
    }

    const width = maxX - minX + (padding * 2);
    const height = maxY - minY + (padding * 2);

    return { nodes, edges, width, height };
}
