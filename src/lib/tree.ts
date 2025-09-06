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

// New layout logic based on https://rachel53461.wordpress.com/2014/04/20/algorithm-for-drawing-a-binary-tree/
// With modifications for our use case.

type NodeLayoutData = {
  x: number;
  y: number;
  modifier: number;
  node: TreeNode;
};

const NODE_SEPARATION = 60;
const LEVEL_SEPARATION = 100;

export function getTreeLayout(root: TreeNode | null): { nodes: NodeWithPosition[], edges: Edge[], width: number, height: number } {
  if (!root) {
    return { nodes: [], edges: [], width: 0, height: 0 };
  }

  const layoutMap = new Map<number, NodeLayoutData>();
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  function firstPass(node: TreeNode, depth: number) {
    const layoutData: NodeLayoutData = { x: 0, y: depth * LEVEL_SEPARATION, modifier: 0, node };
    layoutMap.set(node.id, layoutData);

    if (node.left) {
      firstPass(node.left, depth + 1);
    }
    if (node.right) {
      firstPass(node.right, depth + 1);
    }

    if (!node.left && !node.right) { // isLeaf
      layoutData.x = 0;
    } else if (node.left && node.right) {
      const leftChildLayout = layoutMap.get(node.left.id)!;
      const rightChildLayout = layoutMap.get(node.right.id)!;
      layoutData.x = (leftChildLayout.x + rightChildLayout.x) / 2;
    } else if (node.left) {
      const leftChildLayout = layoutMap.get(node.left.id)!;
      layoutData.x = leftChildLayout.x + NODE_SEPARATION / 2;
    } else { // only right child
      const rightChildLayout = layoutMap.get(node.right.id)!;
      layoutData.x = rightChildLayout.x - NODE_SEPARATION / 2;
    }
    
    // Check for conflicts and apply modifier
    if (node.left && node.right) {
      // This is a simplified conflict check. A more robust solution
      // would check all nodes at the same level.
      const leftChildLayout = layoutMap.get(node.left.id)!;
      const rightChildLayout = layoutMap.get(node.right.id)!;
      const distance = rightChildLayout.x - leftChildLayout.x;
      if (distance < NODE_SEPARATION) {
        const shift = (NODE_SEPARATION - distance) / 2;
        leftChildLayout.x -= shift;
        rightChildLayout.x += shift;
      }
    }
    
    // Apply modifier from children
    if(node.left) {
        layoutData.modifier += layoutMap.get(node.left.id)!.modifier;
    }
    if(node.right) {
        layoutData.modifier += layoutMap.get(node.right.id)!.modifier;
    }
    layoutData.x += layoutData.modifier;
  }
  
  function secondPass(node: TreeNode, mod: number) {
      const layoutData = layoutMap.get(node.id)!;
      layoutData.x += mod;

      minX = Math.min(minX, layoutData.x);
      maxX = Math.max(maxX, layoutData.x);
      minY = Math.min(minY, layoutData.y);
      maxY = Math.max(maxY, layoutData.y);

      if (node.left) {
          secondPass(node.left, mod + layoutData.modifier);
      }
      if (node.right) {
          secondPass(node.right, mod + layoutData.modifier);
      }
  }


  function calculateInitialPositions(node: TreeNode | null, depth = 0, pos = 0): { [key: number]: number } {
    if (!node) return {};
    
    const leftPositions = calculateInitialPositions(node.left, depth + 1);
    const rightPositions = calculateInitialPositions(node.right, depth + 1);
    
    let positions = { ...leftPositions, ...rightPositions };
    
    let leftMost = Infinity;
    let rightMost = -Infinity;

    function findBounds(n: TreeNode | null) {
        if(!n) return;
        if(positions[n.id] < leftMost) leftMost = positions[n.id];
        if(positions[n.id] > rightMost) rightMost = positions[n.id];
        findBounds(n.left);
        findBounds(n.right);
    }


    if (node.left && node.right) {
        const leftSubtreePositions = getSubtreePositions(node.left, positions);
        const rightSubtreePositions = getSubtreePositions(node.right, positions);
        const leftMax = Math.max(...Object.values(leftSubtreePositions));
        const rightMin = Math.min(...Object.values(rightSubtreePositions));
        const shift = leftMax - rightMin + 1;

        Object.keys(rightSubtreePositions).forEach(id => {
            positions[Number(id)] += shift;
        });

        positions[node.id] = (leftMax + rightMin + shift) / 2;
    } else if (node.left) {
        positions[node.id] = positions[node.left.id] + 0.5;
    } else if (node.right) {
        positions[node.id] = positions[node.right.id] - 0.5;
    } else {
        positions[node.id] = pos;
    }

    return positions;
  }
  
  function getSubtreePositions(node: TreeNode, allPositions: { [key: number]: number }): { [key: number]: number } {
      if (!node) return {};
      const positions: { [key: number]: number } = { [node.id]: allPositions[node.id] };
      Object.assign(positions, getSubtreePositions(node.left, allPositions));
      Object.assign(positions, getSubtreePositions(node.right, allPositions));
      return positions;
  }


  const xPositions = calculateInitialPositions(root);

  const nodes: NodeWithPosition[] = [];
  const edges: Edge[] = [];
  const padding = 50;

  let finalLayout = new Map<number, {x: number, y: number}>();
  let minFinalX = Infinity;
  let maxFinalX = -Infinity;
  let maxFinalY = -Infinity;

  function traverseAndSet(node: TreeNode, depth: number) {
      const x = xPositions[node.id] * NODE_SEPARATION;
      const y = depth * LEVEL_SEPARATION;
      
      finalLayout.set(node.id, { x, y });

      minFinalX = Math.min(minFinalX, x);
      maxFinalX = Math.max(maxFinalX, x);
      maxFinalY = Math.max(maxFinalY, y);

      if (node.left) traverseAndSet(node.left, depth + 1);
      if (node.right) traverseAndSet(node.right, depth + 1);
  }

  traverseAndSet(root, 0);

  const width = maxFinalX - minFinalX + (padding * 2);
  const height = maxFinalY + (padding * 2);

  const xOffset = -minFinalX + padding;
  const yOffset = padding;

  function buildFinalLayout(node: TreeNode) {
    const layout = finalLayout.get(node.id)!;
    const finalNode = node as NodeWithPosition;
    finalNode.x = layout.x + xOffset;
    finalNode.y = layout.y + yOffset;
    nodes.push(finalNode);

    if (node.left) {
      const leftLayout = finalLayout.get(node.left.id)!;
      edges.push({
        from: { x: finalNode.x, y: finalNode.y },
        to: { x: leftLayout.x + xOffset, y: leftLayout.y + yOffset }
      });
      buildFinalLayout(node.left);
    }
    if (node.right) {
      const rightLayout = finalLayout.get(node.right.id)!;
      edges.push({
        from: { x: finalNode.x, y: finalNode.y },
        to: { x: rightLayout.x + xOffset, y: rightLayout.y + yOffset }
      });
      buildFinalLayout(node.right);
    }
  }

  buildFinalLayout(root);
  return { nodes, edges, width, height };
}
