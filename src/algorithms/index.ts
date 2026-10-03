/**
 * Algorithm Registry for Discrete Mathematics (7MA206) - Module V: Graph and Trees.
 *
 * NOTE FOR PHASE 1:
 * Algorithm execution logic is intentionally NOT implemented in Phase 1.
 * This registry defines the metadata, syllabus mappings, and interfaces required
 * for plugging in algorithm step-generators in Phase 2.
 */

import type { AlgorithmInfo, SyllabusAlgorithmId } from '../types/algorithm';

export const SYLLABUS_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    moduleSection: 'Module V — Graph Traversals',
    description: 'Explores graph vertices layer-by-layer using a First-In-First-Out (FIFO) queue.',
    syllabusTopic: 'Graph Traversals & Shortest Path in Unweighted Graphs',
    requiresStartVertex: true,
    timeComplexity: 'O(|V| + |E|)',
    spaceComplexity: 'O(|V|)',
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    moduleSection: 'Module V — Graph Traversals',
    description: 'Explores graph vertices along each branch as deep as possible before backtracking using a LIFO stack.',
    syllabusTopic: 'Graph Traversals & Backtracking',
    requiresStartVertex: true,
    timeComplexity: 'O(|V| + |E|)',
    spaceComplexity: 'O(|V|)',
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST Algorithm",
    moduleSection: 'Module V — Spanning Trees',
    description: 'Greedy algorithm that builds a Minimum Spanning Tree by adding edges of minimum weight that do not form a cycle.',
    syllabusTopic: 'Trees, Spanning Trees & Minimum Spanning Trees (MST)',
    requiresStartVertex: false,
    timeComplexity: 'O(|E| log |E|)',
    spaceComplexity: 'O(|V| + |E|)',
  },
  {
    id: 'prim',
    name: "Prim's MST Algorithm",
    moduleSection: 'Module V — Spanning Trees',
    description: 'Greedy algorithm that grows a Minimum Spanning Tree from a starting vertex by attaching the cheapest edge connecting to an unvisited vertex.',
    syllabusTopic: 'Minimum Spanning Trees & Cut Property',
    requiresStartVertex: true,
    timeComplexity: 'O(|E| + |V| log |V|)',
    spaceComplexity: 'O(|V|)',
  },
  {
    id: 'euler',
    name: 'Eulerian Path & Circuit',
    moduleSection: 'Module V — Graph Paths',
    description: 'Verifies degree parity rules (Euler Theorem) and constructs Eulerian circuits visiting every edge exactly once.',
    syllabusTopic: 'Eulerian Graphs, Handshaking Lemma & Fleury Algorithm',
    requiresStartVertex: true,
    timeComplexity: 'O(|E|)',
    spaceComplexity: 'O(|E|)',
  },
  {
    id: 'hamiltonian',
    name: 'Hamiltonian Path & Cycle',
    moduleSection: 'Module V — Graph Paths',
    description: 'Determines paths that visit every vertex in the graph exactly once (Dirac Theorem & Ore Theorem criteria).',
    syllabusTopic: 'Hamiltonian Graphs & Backtracking Search',
    requiresStartVertex: true,
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
  },
  {
    id: 'coloring',
    name: 'Greedy Graph Coloring',
    moduleSection: 'Module V — Graph Coloring',
    description: 'Assigns minimum colors (Chromatic Number χ(G)) to vertices such that no two adjacent vertices share the same color.',
    syllabusTopic: 'Vertex Coloring, Chromatic Number & Planar Graphs',
    requiresStartVertex: false,
    timeComplexity: 'O(|V|^2 + |E|)',
    spaceComplexity: 'O(|V|)',
  },
  {
    id: 'tree-traversal',
    name: 'Binary Tree Traversals',
    moduleSection: 'Module V — Trees',
    description: 'Visualizes Inorder, Preorder, and Postorder tree traversal sequences on binary trees.',
    syllabusTopic: 'Trees, Rooted Trees & Tree Traversals',
    requiresStartVertex: true,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
  },
];

export function getAlgorithmById(id: SyllabusAlgorithmId | null): AlgorithmInfo | undefined {
  if (!id) return undefined;
  return SYLLABUS_ALGORITHMS.find((algo) => algo.id === id);
}
