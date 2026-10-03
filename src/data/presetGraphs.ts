/**
 * Preset Discrete Mathematics Graph Examples.
 * Course: Discrete Mathematics (7MA206), S.Y. B.Tech IT, Module V
 */

import type { GraphData } from '../types/graph';

export interface PresetGraphOption {
  id: string;
  name: string;
  description: string;
  data: GraphData;
}

export const PRESET_GRAPHS: PresetGraphOption[] = [
  {
    id: 'binary-tree',
    name: 'Binary Tree (Height 2)',
    description: 'A rooted tree structure illustrating hierarchical graph theory (Module V).',
    data: {
      config: { isDirected: false, isWeighted: false, allowSelfLoops: false },
      vertices: [
        { id: 'v1', label: '1', x: 400, y: 80 },
        { id: 'v2', label: '2', x: 250, y: 180 },
        { id: 'v3', label: '3', x: 550, y: 180 },
        { id: 'v4', label: '4', x: 170, y: 290 },
        { id: 'v5', label: '5', x: 330, y: 290 },
        { id: 'v6', label: '6', x: 470, y: 290 },
        { id: 'v7', label: '7', x: 630, y: 290 },
      ],
      edges: [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v1', target: 'v3' },
        { id: 'e3', source: 'v2', target: 'v4' },
        { id: 'e4', source: 'v2', target: 'v5' },
        { id: 'e5', source: 'v3', target: 'v6' },
        { id: 'e6', source: 'v3', target: 'v7' },
      ],
    },
  },
  {
    id: 'complete-k4',
    name: 'Complete Graph K4',
    description: 'A simple graph where every pair of distinct vertices is connected by a unique edge.',
    data: {
      config: { isDirected: false, isWeighted: false, allowSelfLoops: false },
      vertices: [
        { id: 'v1', label: 'A', x: 400, y: 100 },
        { id: 'v2', label: 'B', x: 580, y: 240 },
        { id: 'v3', label: 'C', x: 400, y: 380 },
        { id: 'v4', label: 'D', x: 220, y: 240 },
      ],
      edges: [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v3' },
        { id: 'e3', source: 'v3', target: 'v4' },
        { id: 'e4', source: 'v4', target: 'v1' },
        { id: 'e5', source: 'v1', target: 'v3' },
        { id: 'e6', source: 'v2', target: 'v4' },
      ],
    },
  },
  {
    id: 'cycle-c5',
    name: 'Cycle Graph C5',
    description: 'A closed cycle consisting of 5 vertices and 5 edges.',
    data: {
      config: { isDirected: false, isWeighted: false, allowSelfLoops: false },
      vertices: [
        { id: 'v1', label: '1', x: 400, y: 90 },
        { id: 'v2', label: '2', x: 570, y: 200 },
        { id: 'v3', label: '3', x: 500, y: 380 },
        { id: 'v4', label: '4', x: 300, y: 380 },
        { id: 'v5', label: '5', x: 230, y: 200 },
      ],
      edges: [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v3' },
        { id: 'e3', source: 'v3', target: 'v4' },
        { id: 'e4', source: 'v4', target: 'v5' },
        { id: 'e5', source: 'v5', target: 'v1' },
      ],
    },
  },
  {
    id: 'weighted-digraph',
    name: 'Weighted Directed Graph',
    description: 'A directed graph with non-negative edge weights for traversal/spanning tree algorithms.',
    data: {
      config: { isDirected: true, isWeighted: true, allowSelfLoops: false },
      vertices: [
        { id: 'v1', label: 'S', x: 200, y: 240 },
        { id: 'v2', label: 'A', x: 380, y: 120 },
        { id: 'v3', label: 'B', x: 380, y: 360 },
        { id: 'v4', label: 'C', x: 560, y: 120 },
        { id: 'v5', label: 'D', x: 560, y: 360 },
        { id: 'v6', label: 'T', x: 740, y: 240 },
      ],
      edges: [
        { id: 'e1', source: 'v1', target: 'v2', weight: 4, isDirected: true },
        { id: 'e2', source: 'v1', target: 'v3', weight: 2, isDirected: true },
        { id: 'e3', source: 'v2', target: 'v4', weight: 5, isDirected: true },
        { id: 'e4', source: 'v2', target: 'v3', weight: 1, isDirected: true },
        { id: 'e5', source: 'v3', target: 'v5', weight: 8, isDirected: true },
        { id: 'e6', source: 'v4', target: 'v6', weight: 6, isDirected: true },
        { id: 'e7', source: 'v5', target: 'v6', weight: 3, isDirected: true },
        { id: 'e8', source: 'v4', target: 'v5', weight: 2, isDirected: true },
      ],
    },
  },
];
