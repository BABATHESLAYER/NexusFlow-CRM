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

        const prevNodeVal = current.val;
        current = current.right;
        
        steps.push({
            action: current ? `Move to right child of ${prevNodeVal}` : `No right child for ${prevNodeVal}`,
            currentNodeId: current?.id ?? null,
            stack: stack.map(n => n.val),
            visitedNodes: [...visitedNodes],
            codeLine: 7,
            explanation: current ? `Moving to the right child of the visited node. The new current node is ${current.val}.` : `The visited node has no right child. The loop will continue, and we'll pop from the stack again.`,
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

const NODE_SEPARATION = 60;
const LEVEL_SEPARATION = 100;
const NODE_RADIUS = 24; // Corresponds to w-12/h-12 which is 3rem = 48px, so radius is 24

// This is a simplified version of the Knuth-Reingold algorithm.
function assignPositions(node: TreeNode | null, depth: number, xPos: { [id: number]: number }, yPos: { [id: number]: number }, xCounter: { val: number }) {
  if (node === null) return;
  
  yPos[node.id] = depth;

  assignPositions(node.left, depth + 1, xPos, yPos, xCounter);
  
  xPos[node.id] = xCounter.val;
  xCounter.val++;
  
  assignPositions(node.right, depth + 1, xPos, yPos, xCounter);
}


export function getTreeLayout(root: TreeNode | null): { nodes: NodeWithPosition[], edges: Edge[], width: number, height: number } {
    if (!root) {
        return { nodes: [], edges: [], width: 0, height: 0 };
    }

    const xPos: { [id: number]: number } = {};
    const yPos: { [id: number]: number } = {};
    
    let xCounter = { val: 0 };
    assignPositions(root, 0, xPos, yPos, xCounter);

    const nodes: NodeWithPosition[] = [];
    const edges: Edge[] = [];
    
    let minX = Infinity, maxX = -Infinity, maxY = -Infinity;

    const nodeMap = new Map<number, NodeWithPosition>();

    const allNodes: TreeNode[] = [];
    const discoverQueue: (TreeNode|null)[] = [root];
    while(discoverQueue.length > 0) {
      const node = discoverQueue.shift();
      if(node) {
        allNodes.push(node);
        discoverQueue.push(node.left);
        discoverQueue.push(node.right);
      }
    }

    for (const node of allNodes) {
        const nx = xPos[node.id] * NODE_SEPARATION;
        const ny = yPos[node.id] * LEVEL_SEPARATION;

        const positionedNode = node as NodeWithPosition;
        positionedNode.x = nx;
        positionedNode.y = ny;
        
        nodes.push(positionedNode);
        nodeMap.set(node.id, positionedNode);

        minX = Math.min(minX, nx);
        maxX = Math.max(maxX, nx);
        maxY = Math.max(maxY, ny);
    }
    
    for (const node of nodes) {
        if (node.left) {
            const childNode = nodeMap.get(node.left.id)!;
            edges.push({ from: { x: node.x, y: node.y }, to: { x: childNode.x, y: childNode.y } });
        }
        if (node.right) {
            const childNode = nodeMap.get(node.right.id)!;
            edges.push({ from: { x: node.x, y: node.y }, to: { x: childNode.x, y: childNode.y } });
        }
    }

    const padding = NODE_RADIUS; // Use node radius for padding
    const width = maxX - minX + (padding * 2);
    const height = maxY + (padding * 2);

    const xOffset = -minX + padding;
    const yOffset = padding;

    nodes.forEach(node => {
        node.x += xOffset;
        node.y += yOffset;
    });

    edges.forEach(edge => {
        edge.from.x += xOffset;
        edge.from.y += yOffset;
        edge.to.x += xOffset;
        edge.to.y += yOffset;
    });

    return { nodes, edges, width, height };
}
