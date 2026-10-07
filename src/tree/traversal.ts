/**
 * Binary Tree Traversal Algorithm Step Generator
 * Computes Preorder, Inorder, and Postorder steps for Discrete Mathematics (7MA206).
 */

import type { TreeData, TreeTraversalMode, TreeNode } from './types';
import type { AlgorithmStep } from '../types/algorithm';

export function generateTreeTraversalSteps(
  tree: TreeData,
  mode: TreeTraversalMode = 'preorder'
): { steps: AlgorithmStep[]; finalResultString: string } {
  const nodeMap = new Map<string, TreeNode>();
  tree.nodes.forEach((n) => nodeMap.set(n.id, n));

  const steps: AlgorithmStep[] = [];
  const visitedOrder: string[] = [];
  let stepIndex = 0;

  function getTitle(): string {
    switch (mode) {
      case 'preorder':
        return 'Preorder Traversal (Node → Left → Right)';
      case 'inorder':
        return 'Inorder Traversal (Left → Node → Right)';
      case 'postorder':
        return 'Postorder Traversal (Left → Right → Node)';
    }
  }

  // Initial Step
  steps.push({
    stepIndex: stepIndex++,
    title: `${getTitle()} Initialized`,
    description: `Target: Traverse binary tree rooted at node ${tree.rootId}.`,
    action: `Initialize ${mode} traversal traversal stack/recursion.`,
    reason: `Discrete Math Rule: ${
      mode === 'preorder'
        ? 'Preorder visits the current Node first, then Left subtree, then Right subtree.'
        : mode === 'inorder'
        ? 'Inorder visits Left subtree first, then current Node, then Right subtree.'
        : 'Postorder visits Left subtree first, then Right subtree, then current Node.'
    }`,
    activeVertexId: tree.rootId,
    visitedVertexIds: [],
    dataStructures: {
      resultSummary: 'Traversal started',
      visitedSet: [],
    },
  });

  function traverse(nodeId: string | null | undefined) {
    if (!nodeId) return;
    const node = nodeMap.get(nodeId);
    if (!node) return;

    if (mode === 'preorder') {
      // Visit Node
      visitedOrder.push(node.label);
      steps.push({
        stepIndex: stepIndex++,
        title: `Visit Node ${node.label}`,
        description: `In Preorder traversal, we first visit the current node (${node.label}), then traverse the left subtree, and then the right subtree.`,
        action: `Visit node ${node.label}. Append to traversal sequence.`,
        reason: 'Preorder Order: Node → Left → Right',
        activeVertexId: node.id,
        visitedVertexIds: tree.nodes.filter((n) => visitedOrder.includes(n.label)).map((n) => n.id),
        dataStructures: {
          traversalPath: [...visitedOrder],
          visitedSet: [...visitedOrder],
        },
      });

      traverse(node.leftId);
      traverse(node.rightId);
    } else if (mode === 'inorder') {
      traverse(node.leftId);

      // Visit Node
      visitedOrder.push(node.label);
      steps.push({
        stepIndex: stepIndex++,
        title: `Visit Node ${node.label}`,
        description: `In Inorder traversal, we first traverse the left subtree, then visit the current node (${node.label}), and then the right subtree.`,
        action: `Visit node ${node.label}. Append to traversal sequence.`,
        reason: 'Inorder Order: Left → Node → Right',
        activeVertexId: node.id,
        visitedVertexIds: tree.nodes.filter((n) => visitedOrder.includes(n.label)).map((n) => n.id),
        dataStructures: {
          traversalPath: [...visitedOrder],
          visitedSet: [...visitedOrder],
        },
      });

      traverse(node.rightId);
    } else {
      // Postorder
      traverse(node.leftId);
      traverse(node.rightId);

      // Visit Node
      visitedOrder.push(node.label);
      steps.push({
        stepIndex: stepIndex++,
        title: `Visit Node ${node.label}`,
        description: `In Postorder traversal, we first traverse the left subtree, then the right subtree, and finally visit the current node (${node.label}).`,
        action: `Visit node ${node.label}. Append to traversal sequence.`,
        reason: 'Postorder Order: Left → Right → Node',
        activeVertexId: node.id,
        visitedVertexIds: tree.nodes.filter((n) => visitedOrder.includes(n.label)).map((n) => n.id),
        dataStructures: {
          traversalPath: [...visitedOrder],
          visitedSet: [...visitedOrder],
        },
      });
    }
  }

  traverse(tree.rootId);

  const finalResultString = `${mode.charAt(0).toUpperCase() + mode.slice(1)} Traversal:\n${visitedOrder.join(' → ')}`;

  // Summary Step
  steps.push({
    stepIndex: stepIndex,
    title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Traversal Complete`,
    description: `Successfully visited all ${tree.nodes.length} tree nodes.`,
    action: `Final sequence: ${visitedOrder.join(' → ')}`,
    reason: 'Discrete Math Tree Theorem: Binary tree traversal completed.',
    visitedVertexIds: tree.nodes.map((n) => n.id),
    dataStructures: {
      traversalPath: visitedOrder,
      resultSummary: finalResultString,
      finalConclusion: {
        success: true,
        title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Traversal Completed`,
        message: visitedOrder.join(' → '),
      },
    },
  });

  return { steps, finalResultString };
}
