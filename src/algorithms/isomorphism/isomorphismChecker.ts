/**
 * Graph Isomorphism Checker for Discrete Mathematics (7MA206).
 * Unit V: Graph Theory & Trees.
 * Compares Graph A and Graph B invariant properties (vertices, edges, degree sequence)
 * and verifies candidate vertex bijection mappings step-by-step.
 */

import type { Vertex, Edge, GraphConfig } from '../../types/graph';
import type { AlgorithmStep } from '../../types/algorithm';
import { calculateVertexDegrees } from '../../utils/graphUtils';

const MAX_PERMUTATION_STEPS = 100; // Search safety limit to prevent browser freeze

export function generateIsomorphismSteps(
  graphA: { vertices: Vertex[]; edges: Edge[]; config: GraphConfig },
  graphB: { vertices: Vertex[]; edges: Edge[]; config: GraphConfig }
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];

  const verticesA = graphA.vertices;
  const edgesA = graphA.edges;
  const verticesB = graphB.vertices;
  const edgesB = graphB.edges;

  // Step 0: Initial Comparison Setup
  steps.push({
    stepIndex: 0,
    title: 'Graph Isomorphism Analysis Initialized',
    description: `Comparing Graph A (${verticesA.length} nodes, ${edgesA.length} edges) and Graph B (${verticesB.length} nodes, ${edgesB.length} edges).`,
    action: 'Initializing Graph Isomorphism invariant checks.',
    reason: 'Discrete Math Isomorphism Definition: Two graphs G_A and G_B are isomorphic (G_A ≅ G_B) iff there exists a bijection f: V(G_A) → V(G_B) preserving adjacency (u ~ v ⟺ f(u) ~ f(v)).',
    dataStructures: {
      resultSummary: `Graph A: |V|=${verticesA.length}, |E|=${edgesA.length} | Graph B: |V|=${verticesB.length}, |E|=${edgesB.length}`,
    },
  });

  // Pre-Check 1: Vertex Count Invariant
  if (verticesA.length !== verticesB.length) {
    const errorMsg = `Graph A has ${verticesA.length} vertices, while Graph B has ${verticesB.length} vertices.`;
    steps.push({
      stepIndex: 1,
      title: 'Invariant Check Failed: Vertex Count Mismatch',
      description: errorMsg,
      action: 'Isomorphism comparison failed at Vertex Count invariant.',
      reason: 'Graph Invariant Theorem: Isomorphic graphs MUST have identical vertex counts (|V_A| = |V_B|). A bijection cannot exist between sets of different cardinalities.',
      dataStructures: {
        resultSummary: 'NOT ISOMORPHIC (Vertex Count Mismatch)',
        finalConclusion: {
          success: false,
          title: 'Not Isomorphic',
          message: errorMsg,
          details: [
            `Graph A Vertex Count: ${verticesA.length}`,
            `Graph B Vertex Count: ${verticesB.length}`,
            `Reason: One-to-one vertex bijection is impossible.`,
          ],
        },
      },
    });
    return steps;
  }

  // Pre-Check 2: Edge Count Invariant
  if (edgesA.length !== edgesB.length) {
    const errorMsg = `Graph A has ${edgesA.length} edges, while Graph B has ${edgesB.length} edges.`;
    steps.push({
      stepIndex: 1,
      title: 'Invariant Check Failed: Edge Count Mismatch',
      description: errorMsg,
      action: 'Isomorphism comparison failed at Edge Count invariant.',
      reason: 'Graph Invariant Theorem: Isomorphic graphs MUST have identical total edge counts (|E_A| = |E_B|).',
      dataStructures: {
        resultSummary: 'NOT ISOMORPHIC (Edge Count Mismatch)',
        finalConclusion: {
          success: false,
          title: 'Not Isomorphic',
          message: errorMsg,
          details: [
            `Graph A Edge Count: ${edgesA.length}`,
            `Graph B Edge Count: ${edgesB.length}`,
            `Reason: Edge count invariant violated.`,
          ],
        },
      },
    });
    return steps;
  }

  // Pre-Check 3: Degree Sequence Invariant
  const degreesA = calculateVertexDegrees(verticesA, edgesA, graphA.config.isDirected);
  const degreesB = calculateVertexDegrees(verticesB, edgesB, graphB.config.isDirected);

  const seqA = verticesA.map((v) => degreesA[v.id]?.totalDegree || 0).sort((a, b) => b - a);
  const seqB = verticesB.map((v) => degreesB[v.id]?.totalDegree || 0).sort((a, b) => b - a);

  const isDegSeqMatch = seqA.length === seqB.length && seqA.every((val, i) => val === seqB[i]);

  if (!isDegSeqMatch) {
    const errorMsg = `Degree sequence mismatch. Graph A: [${seqA.join(', ')}], Graph B: [${seqB.join(', ')}].`;
    steps.push({
      stepIndex: 1,
      title: 'Invariant Check Failed: Degree Sequence Mismatch',
      description: errorMsg,
      action: 'Isomorphism comparison failed at Degree Sequence invariant.',
      reason: 'Graph Invariant Theorem: Isomorphic graphs MUST have identical multiset degree sequences.',
      dataStructures: {
        resultSummary: 'NOT ISOMORPHIC (Degree Sequence Mismatch)',
        finalConclusion: {
          success: false,
          title: 'Not Isomorphic',
          message: errorMsg,
          details: [
            `Graph A Degree Sequence: [${seqA.join(', ')}]`,
            `Graph B Degree Sequence: [${seqB.join(', ')}]`,
            `Reason: Degree sequence multiset invariant violated.`,
          ],
        },
      },
    });
    return steps;
  }

  // Zero Vertices Edge Case
  if (verticesA.length === 0) {
    steps.push({
      stepIndex: 1,
      title: 'Empty Graph Isomorphism',
      description: 'Both graphs are empty (0 vertices, 0 edges).',
      action: 'Empty graphs are trivially isomorphic.',
      reason: 'Discrete Math Axiom: Two null/empty graphs are trivially isomorphic.',
      dataStructures: {
        resultSummary: 'ISOMORPHIC (Trivial Empty Graphs)',
        finalConclusion: {
          success: true,
          title: 'Isomorphic Graphs',
          message: 'Both Graph A and Graph B are empty (0 vertices).',
        },
      },
    });
    return steps;
  }

  // Invariant Pre-checks Passed!
  steps.push({
    stepIndex: 1,
    title: 'Invariant Pre-Checks Passed',
    description: 'Vertex counts, edge counts, and degree sequences match between Graph A and Graph B.',
    action: 'Proceeding to test candidate vertex bijection mappings.',
    reason: 'Invariant Verification: Identical cardinalities & degree sequences satisfy necessary conditions for isomorphism.',
    dataStructures: {
      resultSummary: `Invariants Passed: |V|=${verticesA.length}, |E|=${edgesA.length}, Degree Seq=[${seqA.join(', ')}]`,
    },
  });

  // Adjacency Matrix check for candidate bijections
  const adjA = getAdjacencyMatrix(verticesA, edgesA, graphA.config.isDirected);
  const adjB = getAdjacencyMatrix(verticesB, edgesB, graphB.config.isDirected);

  const bIndexMap = new Map<string, number>();
  verticesB.forEach((v, idx) => bIndexMap.set(v.id, idx));

  let stepCounter = 2;
  let bijectionFound: Record<string, string> | null = null;
  let limitReached = false;

  // Generate permutations of Graph B vertices to test bijection f: A -> B
  const p = permutations(verticesB);

  for (const perm of p) {
    if (stepCounter >= MAX_PERMUTATION_STEPS) {
      limitReached = true;
      break;
    }

    const mapping: Record<string, string> = {};
    verticesA.forEach((vA, i) => {
      mapping[vA.label] = perm[i].label;
    });

    let isCompatible = true;

    for (let i = 0; i < verticesA.length; i++) {
      for (let j = 0; j < verticesA.length; j++) {
        const edgeValA = adjA[i][j];
        const mappedTargetI = bIndexMap.get(perm[i].id)!;
        const mappedTargetJ = bIndexMap.get(perm[j].id)!;

        const edgeValB = adjB[mappedTargetI][mappedTargetJ];

        if (edgeValA !== edgeValB) {
          isCompatible = false;
          break;
        }
      }
      if (!isCompatible) break;
    }

    const mappingString = Object.entries(mapping)
      .map(([a, b]) => `${a} ↦ ${b}`)
      .join(', ');

    if (isCompatible) {
      bijectionFound = mapping;
      steps.push({
        stepIndex: stepCounter++,
        title: 'Valid Isomorphism Bijection Found',
        description: `Tested mapping: {${mappingString}}.`,
        action: `Adjacency check PASSED for all vertex pairs under mapping f.`,
        reason: 'Bijection Preserves Adjacency: For every u, v ∈ V(G_A), u ~ v if and only if f(u) ~ f(v) in G_B.',
        dataStructures: {
          isomorphismMapping: mapping,
          resultSummary: `Bijection: {${mappingString}}`,
        },
      });
      break;
    } else {
      steps.push({
        stepIndex: stepCounter++,
        title: 'Candidate Mapping Rejected',
        description: `Tested candidate mapping: {${mappingString}}.`,
        action: 'Mapping rejected due to adjacency inconsistency.',
        reason: 'Adjacency Preserving Condition: Edge relationships in G_A were not preserved under this candidate mapping in G_B.',
        dataStructures: {
          isomorphismMapping: mapping,
          resultSummary: `Rejected Mapping: {${mappingString}}`,
        },
      });
    }
  }

  if (bijectionFound) {
    const finalMappingStr = Object.entries(bijectionFound)
      .map(([a, b]) => `${a} ↦ ${b}`)
      .join(', ');

    steps.push({
      stepIndex: stepCounter,
      title: 'Graph A ≅ Graph B (Isomorphic)',
      description: 'Found explicit adjacency-preserving vertex isomorphism bijection.',
      action: `Graph A and Graph B are ISOMORPHIC under mapping: {${finalMappingStr}}`,
      reason: 'Graph Isomorphism Theorem: A structural bijection f: V(G_A) → V(G_B) exists preserving all edge adjacencies.',
      dataStructures: {
        isomorphismMapping: bijectionFound,
        resultSummary: `ISOMORPHIC (G_A ≅ G_B)`,
        finalConclusion: {
          success: true,
          title: 'Graphs Are Isomorphic (G_A ≅ G_B)',
          message: 'Graph A and Graph B are structurally isomorphic.',
          details: [
            `Bijection Mapping: {${finalMappingStr}}`,
            `Vertices: ${verticesA.length} | Edges: ${edgesA.length}`,
            `Adjacency Structure: 100% Preserved`,
          ],
        },
      },
    });
  } else if (limitReached) {
    steps.push({
      stepIndex: stepCounter,
      title: 'Search Safety Limit Reached',
      description: `Tested ${MAX_PERMUTATION_STEPS} candidate mappings without finding isomorphism.`,
      action: `Search stopped at configured permutation threshold (${MAX_PERMUTATION_STEPS} steps).`,
      reason: 'Computational Safety Limit: Candidate search space exceeded step threshold. No conclusion was made about isomorphism.',
      dataStructures: {
        resultSummary: `Search stopped at safety limit (${MAX_PERMUTATION_STEPS} steps).`,
        finalConclusion: {
          success: false,
          title: 'Search Safety Limit Reached',
          message: `Permutation search stopped at safety limit (${MAX_PERMUTATION_STEPS} candidate mappings tested). No conclusion was made about isomorphism.`,
        },
      },
    });
  } else {
    steps.push({
      stepIndex: stepCounter,
      title: 'Graph A ≇ Graph B (Not Isomorphic)',
      description: 'Tested all candidate bijections and none preserved adjacency relationships.',
      action: 'Graph A and Graph B are NOT isomorphic.',
      reason: 'Exhaustive Bijection Search: All candidate bijections f: V(G_A) → V(G_B) failed edge adjacency preservation.',
      dataStructures: {
        resultSummary: 'NOT ISOMORPHIC (G_A ≇ G_B)',
        finalConclusion: {
          success: false,
          title: 'Graphs Are Not Isomorphic',
          message: 'No adjacency-preserving bijection exists between Graph A and Graph B.',
        },
      },
    });
  }

  return steps;
}

// Helper: Matrix generator for adjacency check
function getAdjacencyMatrix(vertices: Vertex[], edges: Edge[], isDirected: boolean): number[][] {
  const n = vertices.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const vMap = new Map<string, number>();
  vertices.forEach((v, idx) => vMap.set(v.id, idx));

  edges.forEach((e) => {
    const i = vMap.get(e.source);
    const j = vMap.get(e.target);
    if (i !== undefined && j !== undefined) {
      matrix[i][j] = 1;
      if (!isDirected) matrix[j][i] = 1;
    }
  });

  return matrix;
}

// Helper: Permutation generator for array
function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const remPerms = permutations(remaining);
    for (const p of remPerms) {
      result.push([current, ...p]);
    }
  }
  return result;
}
