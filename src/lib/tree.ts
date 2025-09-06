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

const HORIZONTAL_SEPARATION = 60;
const VERTICAL_SEPARATION = 80;
const NODE_RADIUS = 24;

interface IModifier {
    mod: number;
    thread: TreeNode | null;
    ancestor: TreeNode;
}

const setup = (
    node: TreeNode,
    depth: number,
    next: {[key: number]: TreeNode},
    mods: {[key: number]: IModifier}
) => {
    node.x = -1;
    node.y = depth;

    mods[node.id] = { mod: 0, thread: null, ancestor: node };
    if (!next[depth]) {
        next[depth] = node;
    } else {
        const prev = next[depth];
        mods[prev.id].thread = node;
    }
    next[depth] = node;
};

const buchheim = (node: TreeNode, mods: {[key: number]: IModifier}) => {
    let left = node.left;
    let right = node.right;

    if (!left && !right) return;

    if (left) buchheim(left, mods);
    if (right) buchheim(right, mods);
    
    if (!left || !right) return;
    
    let defaultAncestor = mods[node.id].ancestor;
    let leftOuter = left;
    let rightInner = right;
    let leftInner = left;
    let rightOuter = right;

    let a;
    let s;

    while (leftInner.right) leftInner = leftInner.right;
    while (rightOuter.left) rightOuter = rightOuter.left;

    let lo = leftOuter;
    let li = leftInner;
    let ri = rightInner;
    let ro = rightOuter;

    let shift = 0;
    while(li && ri) {
        if (li.y > ri.y) {
            s = li.x + shift + HORIZONTAL_SEPARATION - ri.x;
            if(s > 0) {
                a = mods[ri.id].ancestor;
                moveSubtree(a, node, shift + s);
                shift += s;
            }
            ri = ri.right;
            li = li.left;
        } else {
            s = ri.x - (li.x + shift + HORIZONTAL_SEPARATION);
            if(s > 0) {
                a = mods[li.id].ancestor;
                moveSubtree(a, node, shift - s);
                shift -= s;
            }
            li = li.right;
            ri = ri.left;
        }
    }

    if (li && !ro.right) {
        mods[ro.id].thread = li;
        mods[ro.id].mod += shift;
    }

    if (ri && !lo.left) {
        mods[lo.id].thread = ri;
        mods[lo.id].mod -= shift;
    }
};

const moveSubtree = (
    left: TreeNode,
    right: TreeNode,
    shift: number
) => {
    // move right subtree
    let subtrees = right.y - left.y;
    // mods[right.id].mod += shift / subtrees;
    // mods[right.id].mod += shift;
};

const secondWalk = (node: TreeNode, m: number, mods: {[key: number]: IModifier}) => {
    node.x += m;
    for (let child of [node.left, node.right]) {
        if (child) {
            secondWalk(child, m + mods[child.id].mod, mods);
        }
    }
};

export function getTreeLayout(root: TreeNode | null): { nodes: NodeWithPosition[], edges: Edge[], width: number, height: number } {
    if (!root) {
        return { nodes: [], edges: [], width: 0, height: 0 };
    }
    
    // Using Tidier Tree algorithm by Reingold and Tilford
    // First walk
    const dt: {[key: number]: {x: number, y: number, mod: number, parent: number | null, thread: number | null}} = {};

    function firstWalk(node: TreeNode, level: number) {
      dt[node.id] = { x: -1, y: level, mod: 0, parent: null, thread: null };
      if (!node.left && !node.right) {
          dt[node.id].x = 0;
          return;
      }
      
      let defaultAncestor = node;

      if (node.left) {
          firstWalk(node.left, level + 1);
          dt[node.left.id].parent = node.id;
          defaultAncestor = apportion(node.left, defaultAncestor);
      }
      if (node.right) {
          firstWalk(node.right, level + 1);
          dt[node.right.id].parent = node.id;
          defaultAncestor = apportion(node.right, defaultAncestor);
      }

      const leftChild = node.left;
      const rightChild = node.right;

      if(leftChild && rightChild){
        dt[node.id].x = (dt[leftChild.id].x + dt[rightChild.id].x) / 2;
      } else if (leftChild) {
        dt[node.id].x = dt[leftChild.id].x;
      } else if (rightChild){
        dt[node.id].x = dt[rightChild.id].x;
      }
    }

    function apportion(node: TreeNode, defaultAncestor: TreeNode): TreeNode {
      const w = dt[node.id];
      const parent = dt[w.parent!];
      let sibling;
      if (node === parent.node.left) {
        sibling = parent.node.right;
      }

      if(!sibling) return defaultAncestor;

      let vInnerRight = node;
      let vOuterRight = node;
      let vInnerLeft = sibling;
      let vOuterLeft = sibling;

      let sInnerRight = dt[vInnerRight.id].mod;
      let sOuterRight = dt[vOuterRight.id].mod;
      let sInnerLeft = dt[vInnerLeft.id].mod;
      let sOuterLeft = dt[vOuterLeft.id].mod;

      while(vInnerRight.right && vInnerLeft.left) {
        vInnerRight = vInnerRight.right;
        vInnerLeft = vInnerLeft.left;
        vOuterRight = vOuterRight.left!;
        vOuterLeft = vOuterLeft.right!;
        
        dt[vOuterLeft.id].ancestor = node;

        const shift = (dt[vInnerRight.id].x + sInnerRight) - (dt[vInnerLeft.id].x + sInnerLeft) + HORIZONTAL_SEPARATION;
        if(shift > 0){
          moveSubtree(ancestor(vInnerRight, node, defaultAncestor), sibling, shift);
          sInnerRight += shift;
          sOuterRight += shift;
        }
        sInnerRight += dt[vInnerRight.id].mod;
        sOuterRight += dt[vOuterRight.id].mod;
        sInnerLeft += dt[vInnerLeft.id].mod;
        sOuterLeft += dt[vOuterLeft.id].mod;
      }

      return defaultAncestor;
    }


    const nodes: NodeWithPosition[] = [];
    const nodeMap = new Map<number, NodeWithPosition>();
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    // This is a simplified version of the Knuth-Reingold algorithm.
    function assignPositions(node: TreeNode | null, depth: number, pos: {val: number}) {
      if (!node) return;
      assignPositions(node.left, depth + 1, pos);
      
      const x = pos.val * HORIZONTAL_SEPARATION;
      const y = depth * VERTICAL_SEPARATION;
      
      const positionedNode = node as NodeWithPosition;
      positionedNode.x = x;
      positionedNode.y = y;
      nodes.push(positionedNode);
      nodeMap.set(node.id, positionedNode);
      
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      
      pos.val++;
      
      assignPositions(node.right, depth + 1, pos);
    }

    assignPositions(root, 0, {val: 0});
    
    const edges: Edge[] = [];
    nodes.forEach(node => {
      if (node.left) {
        const childNode = nodeMap.get(node.left.id)!;
        edges.push({ from: { x: node.x, y: node.y }, to: { x: childNode.x, y: childNode.y } });
      }
      if (node.right) {
        const childNode = nodeMap.get(node.right.id)!;
        edges.push({ from: { x: node.x, y: node.y }, to: { x: childNode.x, y: childNode.y } });
      }
    });

    const padding = NODE_RADIUS * 1.5;
    const width = maxX - minX + (padding * 2);
    const height = maxY - minY + (padding * 2);

    const xOffset = -minX + padding;
    const yOffset = -minY + padding;

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