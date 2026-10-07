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
    id: 'connectivity-example',
    name: 'Connected Graph Example',
    description: 'A connected 4-node graph (A-B-C-D).',
    data: {
      config: { isDirected: false, isWeighted: false, allowSelfLoops: false },
      vertices: [
        { id: 'v1', label: 'A', x: 200, y: 140 },
        { id: 'v2', label: 'B', x: 400, y: 140 },
        { id: 'v3', label: 'C', x: 200, y: 300 },
        { id: 'v4', label: 'D', x: 400, y: 300 },
      ],
      edges: [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v4' },
        { id: 'e3', source: 'v4', target: 'v3' },
        { id: 'e4', source: 'v3', target: 'v1' },
      ],
    },
  },
  {
    id: 'eulerian-example',
    name: 'Eulerian Circuit Example (Triangle K3)',
    description: 'A connected graph where every vertex has degree 2 (Eulerian Circuit exists).',
    data: {
      config: { isDirected: false, isWeighted: false, allowSelfLoops: false },
      vertices: [
        { id: 'v1', label: 'A', x: 300, y: 100 },
        { id: 'v2', label: 'B', x: 180, y: 280 },
        { id: 'v3', label: 'C', x: 420, y: 280 },
      ],
      edges: [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v3' },
        { id: 'e3', source: 'v3', target: 'v1' },
      ],
    },
  },
  {
    id: 'hamiltonian-example',
    name: 'Hamiltonian Cycle Example (Cycle C4)',
    description: 'A 4-cycle graph where a Hamiltonian cycle visits every node exactly once.',
    data: {
      config: { isDirected: false, isWeighted: false, allowSelfLoops: false },
      vertices: [
        { id: 'v1', label: 'A', x: 200, y: 140 },
        { id: 'v2', label: 'B', x: 400, y: 140 },
        { id: 'v3', label: 'C', x: 400, y: 300 },
        { id: 'v4', label: 'D', x: 200, y: 300 },
      ],
      edges: [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v3' },
        { id: 'e3', source: 'v3', target: 'v4' },
        { id: 'e4', source: 'v4', target: 'v1' },
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
];
