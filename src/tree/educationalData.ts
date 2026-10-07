/**
 * Educational Data for Discrete Mathematics (7MA206) - Unit V: Graph Theory & Trees
 */

import type { TreeData, TreeTermDetail } from './types';

// Standard educational Binary Tree matching mockup layout:
//        A
//       / \
//      B   C
//     / \   \
//    D   E   F
export const SAMPLE_BINARY_TREE: TreeData = {
  rootId: 'A',
  nodes: [
    { id: 'A', label: 'A', x: 250, y: 60, leftId: 'B', rightId: 'C', parentId: null },
    { id: 'B', label: 'B', x: 150, y: 150, leftId: 'D', rightId: 'E', parentId: 'A' },
    { id: 'C', label: 'C', x: 350, y: 150, leftId: null, rightId: 'F', parentId: 'A' },
    { id: 'D', label: 'D', x: 100, y: 240, leftId: null, rightId: null, parentId: 'B' },
    { id: 'E', label: 'E', x: 200, y: 240, leftId: null, rightId: null, parentId: 'B' },
    { id: 'F', label: 'F', x: 400, y: 240, leftId: null, rightId: null, parentId: 'C' },
  ],
};

export const TREE_TERMINOLOGY: Record<string, TreeTermDetail> = {
  root: {
    term: 'Root',
    definition: 'The top-most node of a tree with no parent.',
    exampleNodes: ['A'],
  },
  parent: {
    term: 'Parent',
    definition: 'An immediate ancestor node connected directly above a child.',
    exampleNodes: ['A', 'B', 'C'],
  },
  child: {
    term: 'Child',
    definition: 'A node connected directly below a parent node.',
    exampleNodes: ['B', 'C', 'D', 'E', 'F'],
  },
  sibling: {
    term: 'Sibling',
    definition: 'Nodes sharing the exact same parent node.',
    exampleNodes: ['B', 'C', 'D', 'E'],
  },
  leaf: {
    term: 'Leaf (Terminal Node)',
    definition: 'A node with zero children (degree 1 in undirected tree).',
    exampleNodes: ['D', 'E', 'F'],
  },
  internal: {
    term: 'Internal Node',
    definition: 'A non-leaf node having at least one child node.',
    exampleNodes: ['A', 'B', 'C'],
  },
  height: {
    term: 'Height / Depth',
    definition: 'Height is the length of the longest path from root to leaf (here, Height = 2).',
    exampleNodes: ['A', 'B', 'D'],
  },
};

export const TREE_PROPERTIES = [
  {
    title: 'Connected & Acyclic',
    summary: 'A tree is an undirected connected graph with no simple cycles.',
    formula: 'G = (V, E) is connected and cycle-free',
  },
  {
    title: 'Edge Theorem',
    summary: 'Every tree with n vertices contains exactly n - 1 edges.',
    formula: '|E| = |V| - 1',
  },
  {
    title: 'Unique Simple Path',
    summary: 'There exists exactly one unique simple path between any pair of vertices in a tree.',
    formula: '∀ u, v ∈ V, ∃! path(u, v)',
  },
  {
    title: 'Minimal Connectivity',
    summary: 'Removing any single edge from a tree disconnects it into two subtrees.',
    formula: '∀ e ∈ E, G - e is disconnected',
  },
  {
    title: 'Maximal Acyclicity',
    summary: 'Adding a new edge between any two non-adjacent vertices creates exactly one cycle.',
    formula: '∀ u ≁ v, G + (u, v) contains 1 cycle',
  },
];

export const TREE_TYPES = [
  {
    name: 'Rooted Tree',
    description: 'A tree with one designated vertex designated as the root.',
    iconName: 'GitBranch',
  },
  {
    name: 'Binary Tree',
    description: 'A rooted tree where every node has at most 2 children (left and right).',
    iconName: 'Network',
  },
  {
    name: 'Full Binary Tree',
    description: 'A binary tree where every node has either 0 or 2 children.',
    iconName: 'Workflow',
  },
  {
    name: 'Complete Binary Tree',
    description: 'A binary tree where every level is completely filled except possibly the last.',
    iconName: 'Grid',
  },
  {
    name: 'Spanning Tree',
    description: 'A subgraph of a connected graph G that includes all vertices and forms a tree.',
    iconName: 'Share2',
  },
];
