/**
 * Graph Connectivity Explorer for Discrete Mathematics (7MA206).
 * Analyzes reachability and connected components step-by-step from a dynamic starting vertex.
 */

import type { Vertex, Edge, GraphConfig } from '../../types/graph';
import type { AlgorithmStep } from '../../types/algorithm';

export function generateConnectivitySteps(
  vertices: Vertex[],
  edges: Edge[],
  config: GraphConfig,
  startVertexId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];

  // Edge Case 1: Empty Graph
  if (vertices.length === 0) {
    steps.push({
      stepIndex: 0,
      title: 'Empty Graph Initialization',
      description: 'The graph has 0 vertices.',
      action: 'No vertices available for connectivity exploration.',
      reason: 'Discrete Math Definition: A graph with 0 vertices has no components to explore.',
      dataStructures: {
        resultSummary: 'Empty Graph: Add vertices to analyze connectivity.',
        finalConclusion: {
          success: false,
          title: 'Empty Graph',
          message: 'Graph contains no vertices.',
        },
      },
    });
    return steps;
  }

  // Edge Case 2: Single Vertex Graph
  if (vertices.length === 1) {
    const single = vertices[0];
    steps.push({
      stepIndex: 0,
      title: 'Single Vertex Graph',
      description: `Graph consists of a single vertex: Node ${single.label}`,
      action: `Examining Node ${single.label}`,
      reason: 'Discrete Math Theorem: A graph with 1 vertex is trivially connected (component count = 1).',
      activeVertexId: single.id,
      visitedVertexIds: [single.id],
      dataStructures: {
        visitedSet: [single.label],
        componentMap: { [single.label]: 1 },
        resultSummary: `Connected Graph (1 / 1 vertex reachable)`,
        finalConclusion: {
          success: true,
          title: 'Trivially Connected',
          message: `All 1 vertex is reachable from Node ${single.label}.`,
          details: [`Reachable: Node ${single.label}`, `Component Count: 1`],
        },
      },
    });
    return steps;
  }

  // Find start vertex object
  const startNode = vertices.find((v) => v.id === startVertexId) || vertices[0];
  const startId = startNode.id;

  // Build Adjacency Map for quick neighbor lookup
  const adjMap = new Map<string, { neighborId: string; edgeId: string }[]>();
  vertices.forEach((v) => adjMap.set(v.id, []));

  edges.forEach((edge) => {
    adjMap.get(edge.source)?.push({ neighborId: edge.target, edgeId: edge.id });
    if (!config.isDirected && edge.source !== edge.target) {
      adjMap.get(edge.target)?.push({ neighborId: edge.source, edgeId: edge.id });
    }
  });

  const vertexMap = new Map<string, Vertex>();
  vertices.forEach((v) => vertexMap.set(v.id, v));

  // Queue-based BFS traversal for reachability tracking
  const queue: string[] = [startId];
  const visited = new Set<string>([startId]);
  const visitedEdges = new Set<string>();

  // Step 0: Start Node Initialization
  steps.push({
    stepIndex: 0,
    title: 'Connectivity Search Initialized',
    description: `Starting connectivity traversal from Node ${startNode.label}.`,
    action: `Mark Node ${startNode.label} as start vertex & enqueue it.`,
    reason: `Discrete Math Reachability Rule: A vertex v is reachable from start node s if there exists a path from s to v.`,
    activeVertexId: startId,
    visitedVertexIds: [startId],
    dataStructures: {
      queue: [startNode.label],
      visitedSet: [startNode.label],
    },
  });

  let stepCounter = 1;

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = vertexMap.get(currentId)!;

    const neighbors = adjMap.get(currentId) || [];

    for (const { neighborId, edgeId } of neighbors) {
      const neighborNode = vertexMap.get(neighborId);
      if (!neighborNode) continue;

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        visitedEdges.add(edgeId);
        queue.push(neighborId);

        const visitedLabels = Array.from(visited).map((id) => vertexMap.get(id)?.label || id);
        const queueLabels = queue.map((id) => vertexMap.get(id)?.label || id);

        steps.push({
          stepIndex: stepCounter++,
          title: `Exploring Connection from Node ${currentNode.label}`,
          description: `Discovered Node ${neighborNode.label} via edge connection.`,
          action: `Reach Node ${neighborNode.label} from Node ${currentNode.label} and add to reachability set.`,
          reason: `Path Existence Rule: Edge (${currentNode.label} ${config.isDirected ? '→' : '—'} ${neighborNode.label}) extends the reachability tree.`,
          activeVertexId: neighborId,
          visitedVertexIds: Array.from(visited),
          highlightEdgeIds: [edgeId],
          visitedEdgeIds: Array.from(visitedEdges),
          dataStructures: {
            queue: queueLabels,
            visitedSet: visitedLabels,
          },
        });
      }
    }
  }

  // Determine reachable vs unreachable sets
  const reachableVertices = vertices.filter((v) => visited.has(v.id));
  const unreachableVertices = vertices.filter((v) => !visited.has(v.id));
  const isFullyConnected = reachableVertices.length === vertices.length;

  const reachableLabels = reachableVertices.map((v) => v.label).join(', ');
  const unreachableLabels = unreachableVertices.map((v) => v.label).join(', ');

  // Final Step: Connectivity Summary
  steps.push({
    stepIndex: stepCounter,
    title: isFullyConnected ? 'Graph is Fully Connected' : 'Graph is Disconnected',
    description: `Exploration complete from start Node ${startNode.label}.`,
    action: isFullyConnected
      ? `All ${vertices.length} vertices are reachable from Node ${startNode.label}.`
      : `${reachableVertices.length} of ${vertices.length} vertices reachable. ${unreachableVertices.length} unreachable.`,
    reason: isFullyConnected
      ? 'Discrete Math Connectivity Theorem: A graph is connected if and only if every pair of vertices has a connecting path.'
      : 'Disconnected Graph Theorem: Vertices not reachable from the start node belong to separate connected components.',
    visitedVertexIds: Array.from(visited),
    visitedEdgeIds: Array.from(visitedEdges),
    dataStructures: {
      visitedSet: reachableVertices.map((v) => v.label),
      unreachableSet: unreachableVertices.map((v) => v.label),
      resultSummary: isFullyConnected
        ? `Connected Graph (${vertices.length} / ${vertices.length} vertices reachable)`
        : `Disconnected Graph (${reachableVertices.length} / ${vertices.length} vertices reachable)`,
      finalConclusion: {
        success: isFullyConnected,
        title: isFullyConnected ? 'Connected Graph' : 'Disconnected Graph',
        message: isFullyConnected
          ? `All ${vertices.length} vertices are reachable from start Node ${startNode.label}.`
          : `${reachableVertices.length} of ${vertices.length} vertices are reachable from Node ${startNode.label}.`,
        details: [
          `Reachable Vertices: {${reachableLabels}}`,
          `Unreachable Vertices: ${unreachableVertices.length > 0 ? `{${unreachableLabels}}` : 'None'}`,
          `Graph Type: ${config.isDirected ? 'Directed' : 'Undirected'}`,
        ],
      },
    },
  });

  return steps;
}
