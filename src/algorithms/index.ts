/**
 * Syllabus-Confirmed Algorithm Registry for Discrete Mathematics (7MA206).
 * Module V: Graph Theory & Trees
 */

import type { AlgorithmInfo, SyllabusAlgorithmId } from '../types/algorithm';

export const SYLLABUS_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'connectivity',
    name: 'Graph Connectivity Explorer',
    moduleSection: 'Module V — Graph Theory',
    description: 'Analyzes reachability from a start vertex and determines connected components.',
    syllabusTopic: 'Graph Connectivity & Component Exploration',
    requiresStartVertex: true,
    supportsDirected: true,
    supportsWeighted: true,
    timeComplexity: 'O(|V| + |E|)',
    spaceComplexity: 'O(|V|)',
  },
  {
    id: 'eulerian',
    name: 'Eulerian Path & Circuit Analysis',
    moduleSection: 'Module V — Graph Paths',
    description: 'Verifies Handshaking degree parities (Euler Theorem) and constructs edge-traversing paths.',
    syllabusTopic: 'Eulerian Graphs, Handshaking Lemma & Fleury Construction',
    requiresStartVertex: true,
    supportsDirected: true,
    supportsWeighted: true,
    timeComplexity: 'O(|E|)',
    spaceComplexity: 'O(|E|)',
  },
  {
    id: 'hamiltonian',
    name: 'Hamiltonian Path / Cycle Pathfinder',
    moduleSection: 'Module V — Graph Paths',
    description: 'Searches for paths or cycles visiting every vertex exactly once with backtracking step visualization.',
    syllabusTopic: 'Hamiltonian Graphs & Backtracking Search',
    requiresStartVertex: true,
    supportsDirected: true,
    supportsWeighted: true,
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
  },
  {
    id: 'isomorphism',
    name: 'Graph Isomorphism Checker',
    moduleSection: 'Module V — Graph Theory',
    description: 'Checks structural equivalence between Graph A and Graph B via invariant checks and candidate vertex bijections.',
    syllabusTopic: 'Graph Isomorphism & Invariants',
    requiresStartVertex: false,
    supportsDirected: true,
    supportsWeighted: false,
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
  },
];

export function getAlgorithmById(id: SyllabusAlgorithmId | null): AlgorithmInfo | undefined {
  if (!id) return undefined;
  return SYLLABUS_ALGORITHMS.find((algo) => algo.id === id);
}
