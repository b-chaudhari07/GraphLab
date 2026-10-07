/**
 * Tree Domain Types for Discrete Mathematics (7MA206).
 * Unit V: Graph Theory & Trees.
 */

export interface TreeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  leftId?: string | null;
  rightId?: string | null;
  parentId?: string | null;
}

export type TreeTraversalMode = 'preorder' | 'inorder' | 'postorder';

export interface TreeData {
  nodes: TreeNode[];
  rootId: string;
}

export interface TreeTermDetail {
  term: string;
  definition: string;
  exampleNodes: string[];
}
