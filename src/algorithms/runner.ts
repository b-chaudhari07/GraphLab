/**
 * Unified Algorithm Execution Runner for GraphLab.
 * Executes syllabus-confirmed step generators and returns AlgorithmStep[] sequences.
 */

import type { Vertex, Edge, GraphConfig } from '../types/graph';
import type { AlgorithmConfig, AlgorithmStep } from '../types/algorithm';
import { generateConnectivitySteps } from './connectivity/connectivityExplorer';
import { generateEulerianSteps } from './eulerian/eulerianAnalyzer';
import { generateHamiltonianSteps } from './hamiltonian/hamiltonianPathfinder';
import { generateIsomorphismSteps } from './isomorphism/isomorphismChecker';

export function runAlgorithm(
  config: AlgorithmConfig,
  graphA: { vertices: Vertex[]; edges: Edge[]; config: GraphConfig },
  graphB?: { vertices: Vertex[]; edges: Edge[]; config: GraphConfig }
): AlgorithmStep[] {
  const { selectedAlgorithmId, startVertexId, hamiltonianMode = 'cycle' } = config;

  if (!selectedAlgorithmId) return [];

  switch (selectedAlgorithmId) {
    case 'connectivity':
      return generateConnectivitySteps(graphA.vertices, graphA.edges, graphA.config, startVertexId);

    case 'eulerian':
      return generateEulerianSteps(graphA.vertices, graphA.edges, graphA.config, startVertexId);

    case 'hamiltonian':
      return generateHamiltonianSteps(graphA.vertices, graphA.edges, graphA.config, startVertexId, hamiltonianMode);

    case 'isomorphism':
      if (!graphB) {
        return generateIsomorphismSteps(graphA, graphA);
      }
      return generateIsomorphismSteps(graphA, graphB);

    default:
      return [];
  }
}
