/**
 * Hamiltonian Path / Cycle Pathfinder for Discrete Mathematics (7MA206).
 * Backtracking search visualizer showing candidate evaluation, backtracking on dead-ends, and path/cycle verification.
 */

import type { Vertex, Edge, GraphConfig } from '../../types/graph';
import type { AlgorithmStep, HamiltonianMode } from '../../types/algorithm';

const MAX_SEARCH_STEPS = 400; // Safety limit for step generation to prevent browser freeze

export function generateHamiltonianSteps(
  vertices: Vertex[],
  edges: Edge[],
  config: GraphConfig,
  startVertexId: string | null,
  mode: HamiltonianMode = 'cycle'
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];

  // Edge Case 1: Empty or 0 Vertices Graph
  if (vertices.length === 0) {
    steps.push({
      stepIndex: 0,
      title: 'Empty Graph Initialization',
      description: 'The graph contains 0 vertices.',
      action: 'Cannot perform Hamiltonian search on an empty graph.',
      reason: 'Discrete Math Definition: A Hamiltonian path/cycle requires a non-empty set of vertices.',
      dataStructures: {
        resultSummary: 'Empty Graph: Add vertices to search for Hamiltonian paths.',
        finalConclusion: {
          success: false,
          title: 'Empty Graph',
          message: 'Graph contains no vertices.',
        },
      },
    });
    return steps;
  }

  const vertexMap = new Map<string, Vertex>();
  vertices.forEach((v) => vertexMap.set(v.id, v));

  // Determine user start vertex
  const startNode = vertices.find((v) => v.id === startVertexId) || vertices[0];
  const startId = startNode.id;

  // Build adjacency lookup map
  const adjMap = new Map<string, string[]>();
  vertices.forEach((v) => adjMap.set(v.id, []));

  const edgeIdMap = new Map<string, string>(); // "src->tgt" -> edgeId

  edges.forEach((e) => {
    adjMap.get(e.source)?.push(e.target);
    edgeIdMap.set(`${e.source}->${e.target}`, e.id);

    if (!config.isDirected && e.source !== e.target) {
      adjMap.get(e.target)?.push(e.source);
      edgeIdMap.set(`${e.target}->${e.source}`, e.id);
    }
  });

  // Edge Case 2: Insufficient Vertices for Cycle
  if (mode === 'cycle' && vertices.length < 3) {
    steps.push({
      stepIndex: 0,
      title: 'Insufficient Vertices for Hamiltonian Cycle',
      description: `Graph has ${vertices.length} vertex/vertices. A simple Hamiltonian cycle requires at least 3 vertices.`,
      action: 'Hamiltonian cycle search terminated.',
      reason: 'Discrete Math Theorem: A simple cycle in a graph requires at least 3 distinct vertices.',
      activeVertexId: startId,
      dataStructures: {
        resultSummary: 'No Hamiltonian Cycle Possible (|V| < 3).',
        finalConclusion: {
          success: false,
          title: 'Insufficient Vertices',
          message: `Graph has only ${vertices.length} vertex/vertices. At least 3 vertices are required for a Hamiltonian cycle.`,
        },
      },
    });
    return steps;
  }

  // Step 0: Search Initialized
  steps.push({
    stepIndex: 0,
    title: `Hamiltonian ${mode === 'cycle' ? 'Cycle' : 'Path'} Search Initialized`,
    description: `Target: Find a ${mode === 'cycle' ? 'cycle' : 'path'} visiting all ${vertices.length} vertices starting at Node ${startNode.label}.`,
    action: `Initialize backtracking search at start Node ${startNode.label}.`,
    reason: `Discrete Math Definition: A Hamiltonian ${mode === 'cycle' ? 'cycle' : 'path'} visits every vertex in V(G) exactly once${mode === 'cycle' ? ' and returns to the starting vertex' : ''}.`,
    activeVertexId: startId,
    visitedVertexIds: [startId],
    dataStructures: {
      traversalPath: [startNode.label],
      visitedSet: [startNode.label],
    },
  });

  const currentPath: string[] = [startId];
  const pathEdgeIds: string[] = [];
  const visitedSet = new Set<string>([startId]);

  let stepCounter = 1;
  let solutionFound = false;
  let limitReached = false;

  // Recursive Backtracking function
  function solveHamiltonian(uId: string): boolean {
    if (steps.length >= MAX_SEARCH_STEPS) {
      limitReached = true;
      return false;
    }

    const uNode = vertexMap.get(uId)!;

    // Base Case: All vertices visited!
    if (currentPath.length === vertices.length) {
      if (mode === 'path') {
        solutionFound = true;
        return true;
      } else {
        // Cycle mode: Check if last vertex connects back to start vertex
        const neighbors = adjMap.get(uId) || [];
        if (neighbors.includes(startId)) {
          const closingEdgeId = edgeIdMap.get(`${uId}->${startId}`) || '';
          if (closingEdgeId) pathEdgeIds.push(closingEdgeId);
          currentPath.push(startId);
          solutionFound = true;
          return true;
        }
        return false;
      }
    }

    const neighbors = adjMap.get(uId) || [];

    for (const neighborId of neighbors) {
      if (steps.length >= MAX_SEARCH_STEPS) {
        limitReached = true;
        return false;
      }

      const neighborNode = vertexMap.get(neighborId);
      if (!neighborNode) continue;

      const edgeId = edgeIdMap.get(`${uId}->${neighborId}`);

      if (!visitedSet.has(neighborId)) {
        // Valid Candidate Node
        visitedSet.add(neighborId);
        currentPath.push(neighborId);
        if (edgeId) pathEdgeIds.push(edgeId);

        const currentPathLabels = currentPath.map((id) => vertexMap.get(id)?.label || id);

        steps.push({
          stepIndex: stepCounter++,
          title: `Testing Candidate Node ${neighborNode.label}`,
          description: `Node ${neighborNode.label} is unvisited. Advancing path from Node ${uNode.label}.`,
          action: `Candidate Node ${neighborNode.label} accepted. Move to Node ${neighborNode.label} (${currentPath.length} / ${vertices.length} nodes visited).`,
          reason: `Hamiltonian Condition: Node ${neighborNode.label} has not been visited yet in the current path sequence.`,
          activeVertexId: neighborId,
          visitedVertexIds: Array.from(visitedSet),
          highlightEdgeIds: edgeId ? [edgeId] : [],
          visitedEdgeIds: [...pathEdgeIds],
          dataStructures: {
            traversalPath: currentPathLabels,
            visitedSet: currentPathLabels,
          },
        });

        if (solveHamiltonian(neighborId)) {
          return true;
        }

        // Backtrack step
        const poppedId = currentPath.pop();
        if (poppedId) visitedSet.delete(poppedId);
        if (edgeId) pathEdgeIds.pop();

        const backPathLabels = currentPath.map((id) => vertexMap.get(id)?.label || id);

        steps.push({
          stepIndex: stepCounter++,
          title: `Dead End at Node ${neighborNode.label} — Backtracking`,
          description: `No remaining valid unvisited neighbors from Node ${neighborNode.label}.`,
          action: `Backtrack from Node ${neighborNode.label} back to Node ${uNode.label}.`,
          reason: `Backtracking Principle: Search space exhausted along branch (${neighborNode.label}). Reverting node state to explore alternative paths.`,
          activeVertexId: uId,
          visitedVertexIds: Array.from(visitedSet),
          visitedEdgeIds: [...pathEdgeIds],
          dataStructures: {
            traversalPath: backPathLabels,
            visitedSet: backPathLabels,
          },
        });
      }
    }

    return false;
  }

  solveHamiltonian(startId);

  const finalPathLabels = currentPath.map((id) => vertexMap.get(id)?.label || id);
  const pathString = finalPathLabels.join(' → ');

  if (solutionFound) {
    steps.push({
      stepIndex: stepCounter,
      title: `Hamiltonian ${mode === 'cycle' ? 'Cycle' : 'Path'} Found`,
      description: `Search successfully found a Hamiltonian ${mode} starting from Node ${startNode.label}.`,
      action: `Finalized Hamiltonian ${mode}: ${pathString}`,
      reason: `Discrete Math Proof: Path visits all ${vertices.length} vertices exactly once${mode === 'cycle' ? ' and closes back at start vertex' : ''}.`,
      visitedVertexIds: Array.from(visitedSet),
      visitedEdgeIds: pathEdgeIds,
      dataStructures: {
        traversalPath: finalPathLabels,
        resultSummary: `Hamiltonian ${mode === 'cycle' ? 'Cycle' : 'Path'}: ${pathString}`,
        finalConclusion: {
          success: true,
          title: `Hamiltonian ${mode === 'cycle' ? 'Cycle' : 'Path'} Found`,
          message: `Successfully found a valid Hamiltonian ${mode} starting from Node ${startNode.label}.`,
          details: [
            `Sequence: ${pathString}`,
            `Vertices Visited: ${vertices.length} / ${vertices.length}`,
            `Start Node: Node ${startNode.label}`,
          ],
        },
      },
    });
  } else if (limitReached) {
    steps.push({
      stepIndex: stepCounter,
      title: 'Search Safety Limit Reached',
      description: `Search stopped after ${MAX_SEARCH_STEPS} steps to ensure application performance.`,
      action: `Search stopped at configured step limit (${MAX_SEARCH_STEPS} steps).`,
      reason: 'Computational Limit: Search exceeded step threshold. No conclusion made about existence.',
      dataStructures: {
        resultSummary: `Search stopped at limit (${MAX_SEARCH_STEPS} steps).`,
        finalConclusion: {
          success: false,
          title: 'Search Limit Reached',
          message: `Search stopped at configured search limit (${MAX_SEARCH_STEPS} steps). No conclusion was made about existence.`,
        },
      },
    });
  } else {
    steps.push({
      stepIndex: stepCounter,
      title: `No Hamiltonian ${mode === 'cycle' ? 'Cycle' : 'Path'} Exists`,
      description: `Exhaustive search starting from Node ${startNode.label} yielded no valid Hamiltonian ${mode}.`,
      action: `No Hamiltonian ${mode} exists originating from Node ${startNode.label}.`,
      reason: `Discrete Math Exhaustive Proof: All combinatorial paths from Node ${startNode.label} resulted in dead ends without visiting all vertices.`,
      dataStructures: {
        resultSummary: `No Hamiltonian ${mode === 'cycle' ? 'Cycle' : 'Path'} exists from Node ${startNode.label}.`,
        finalConclusion: {
          success: false,
          title: `No Hamiltonian ${mode === 'cycle' ? 'Cycle' : 'Path'} Found`,
          message: `No Hamiltonian ${mode} exists from start Node ${startNode.label}.`,
          details: [
            `Start Node: Node ${startNode.label}`,
            `Target Vertices: ${vertices.length}`,
            `Search Status: Exhausted without full coverage.`,
          ],
        },
      },
    });
  }

  return steps;
}
