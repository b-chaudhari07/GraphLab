/**
 * Eulerian Path & Circuit Analyzer for Discrete Mathematics (7MA206).
 * Unit V: Graph Theory & Trees.
 * Evaluates degree parities and graph connectivity among non-isolated vertices.
 */

import type { Vertex, Edge, GraphConfig } from '../../types/graph';
import type { AlgorithmStep } from '../../types/algorithm';
import { calculateVertexDegrees } from '../../utils/graphUtils';

export function generateEulerianSteps(
  vertices: Vertex[],
  edges: Edge[],
  config: GraphConfig,
  startVertexId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];

  // Edge Case 1: Empty Graph or 0 Edges
  if (vertices.length === 0 || edges.length === 0) {
    steps.push({
      stepIndex: 0,
      title: 'Eulerian Analysis Initialized',
      description: 'The graph has no edges to traverse.',
      action: 'No edges available for Eulerian analysis.',
      reason: 'Discrete Math Definition: An Eulerian path/circuit requires a non-empty set of edges.',
      dataStructures: {
        resultSummary: 'No Eulerian Traversal (Graph has 0 edges).',
        finalConclusion: {
          success: false,
          title: 'No Eulerian Traversal',
          message: 'Graph contains 0 edges to traverse.',
        },
      },
    });
    return steps;
  }

  const vertexMap = new Map<string, Vertex>();
  vertices.forEach((v) => vertexMap.set(v.id, v));

  const degreesMap = calculateVertexDegrees(vertices, edges, config.isDirected);

  // 1. Connectivity Check among non-isolated vertices (vertices with degree > 0)
  const activeVertices = vertices.filter((v) => (degreesMap[v.id]?.totalDegree || 0) > 0);

  if (activeVertices.length > 0) {
    const activeSet = new Set(activeVertices.map((v) => v.id));
    const visitedActive = new Set<string>([activeVertices[0].id]);
    const activeQueue = [activeVertices[0].id];

    while (activeQueue.length > 0) {
      const curr = activeQueue.shift()!;
      edges.forEach((e) => {
        let nxt: string | null = null;
        if (e.source === curr) nxt = e.target;
        else if (e.target === curr) nxt = e.source;

        if (nxt && activeSet.has(nxt) && !visitedActive.has(nxt)) {
          visitedActive.add(nxt);
          activeQueue.push(nxt);
        }
      });
    }

    if (visitedActive.size < activeVertices.length) {
      const unreachedActive = activeVertices
        .filter((v) => !visitedActive.has(v.id))
        .map((v) => v.label);

      steps.push({
        stepIndex: 0,
        title: 'No Eulerian Traversal: Disconnected Edge Components',
        description: 'Graph contains multiple disconnected components containing edges.',
        action: 'Eulerian analysis failed connectivity check.',
        reason: 'Eulerian Connectivity Theorem: All edges in an Eulerian graph MUST belong to a single connected component. Vertices {' + unreachedActive.join(', ') + '} belong to a separate disconnected component.',
        dataStructures: {
          resultSummary: 'No Eulerian Traversal (Disconnected Edge Components).',
          finalConclusion: {
            success: false,
            title: 'Disconnected Edge Components',
            message: `Graph contains disconnected components with edges. Vertices {${unreachedActive.join(', ')}} cannot be reached from Node ${activeVertices[0].label}.`,
            details: [
              `Non-Isolated Vertices: ${activeVertices.length}`,
              `Connected Component Vertices: ${visitedActive.size}`,
              `Disconnected Component Vertices: {${unreachedActive.join(', ')}}`,
            ],
          },
        },
      });
      return steps;
    }
  }

  // 2. Analyze degree conditions according to Euler's Theorem
  const oddDegreeNodes: Vertex[] = [];
  const inOutMismatchNodes: Vertex[] = [];
  let startCandidates: Vertex[] = [];

  if (!config.isDirected) {
    // Undirected Graph Euler Theorem
    vertices.forEach((v) => {
      const deg = degreesMap[v.id]?.totalDegree || 0;
      if (deg % 2 !== 0) {
        oddDegreeNodes.push(v);
      }
    });

    if (oddDegreeNodes.length === 0) {
      startCandidates = [...activeVertices];
    } else if (oddDegreeNodes.length === 2) {
      startCandidates = [...oddDegreeNodes];
    }
  } else {
    // Directed Graph Euler Theorem
    vertices.forEach((v) => {
      const deg = degreesMap[v.id];
      if (deg && deg.inDegree !== deg.outDegree) {
        inOutMismatchNodes.push(v);
      }
    });
  }

  // Determine user start vertex
  const selectedStartNode = vertices.find((v) => v.id === startVertexId) || vertices[0];

  // Check Euler Theorem Conditions
  const isUndirectedEulerCircuit = !config.isDirected && oddDegreeNodes.length === 0;
  const isUndirectedEulerPath = !config.isDirected && oddDegreeNodes.length === 2;

  const isEulerianPossible = config.isDirected
    ? inOutMismatchNodes.length === 0 || inOutMismatchNodes.length === 2
    : isUndirectedEulerCircuit || isUndirectedEulerPath;

  // Step 0: Degree Parity Analysis
  steps.push({
    stepIndex: 0,
    title: 'Eulerian Theorem Degree Parity Check',
    description: `Analyzing vertex degrees according to Euler's Theorem.`,
    action: `Calculated degree sequence for all ${vertices.length} vertices.`,
    reason: config.isDirected
      ? 'Directed Euler Theorem: An Eulerian circuit exists iff in-degree = out-degree for all vertices.'
      : 'Euler Theorem: An undirected graph has an Eulerian circuit iff every vertex has EVEN degree. It has an Eulerian path iff exactly 0 or 2 vertices have ODD degree.',
    dataStructures: {
      resultSummary: `Odd degree vertices: ${oddDegreeNodes.map((v) => v.label).join(', ') || 'None'}`,
    },
  });

  // If Euler theorem conditions fail, report mathematical explanation and stop cleanly
  if (!isEulerianPossible) {
    const reasonText = !config.isDirected
      ? `Graph has ${oddDegreeNodes.length} odd-degree vertices ({${oddDegreeNodes.map((v) => v.label).join(', ')}}). Euler Theorem states an Eulerian path requires 0 or 2 odd vertices.`
      : `In-degree and out-degree mismatch at ${inOutMismatchNodes.length} vertices ({${inOutMismatchNodes.map((v) => v.label).join(', ')}}).`;

    steps.push({
      stepIndex: 1,
      title: 'No Eulerian Traversal Possible',
      description: 'Euler Theorem degree parity conditions violated.',
      action: 'Eulerian traversal search terminated.',
      reason: reasonText,
      dataStructures: {
        resultSummary: 'No Eulerian Path / Circuit Exists.',
        finalConclusion: {
          success: false,
          title: 'No Eulerian Traversal Exists',
          message: reasonText,
          details: [
            `Odd Degree Count: ${oddDegreeNodes.length}`,
            `Vertices with Odd Degree: {${oddDegreeNodes.map((v) => v.label).join(', ') || 'None'}}`,
            `Euler Theorem Condition: Exactly 0 or 2 odd-degree vertices required.`,
          ],
        },
      },
    });
    return steps;
  }

  // 3. Validate start node choice for Eulerian Path
  if (isUndirectedEulerPath && startCandidates.length === 2) {
    const isStartValid = startCandidates.some((v) => v.id === selectedStartNode.id);
    if (!isStartValid) {
      const oddLabels = startCandidates.map((v) => v.label).join(' or ');
      steps.push({
        stepIndex: 1,
        title: 'Invalid Start Vertex for Eulerian Path',
        description: `Node ${selectedStartNode.label} has EVEN degree, but an Eulerian path must start at an ODD degree vertex.`,
        action: `Requested start Node ${selectedStartNode.label} cannot form an Eulerian path.`,
        reason: `Euler Path Theorem: If a graph has exactly 2 odd-degree vertices, any Eulerian path MUST originate at one of the odd-degree vertices (Node ${oddLabels}).`,
        activeVertexId: selectedStartNode.id,
        dataStructures: {
          resultSummary: `Invalid Start Node ${selectedStartNode.label}. Must start at Node ${oddLabels}.`,
          finalConclusion: {
            success: false,
            title: 'Invalid Start Vertex Selection',
            message: `Node ${selectedStartNode.label} has even degree (${degreesMap[selectedStartNode.id]?.totalDegree}). Please select Node ${oddLabels} as the starting vertex.`,
            details: [
              `Selected Start Node: ${selectedStartNode.label} (deg = ${degreesMap[selectedStartNode.id]?.totalDegree})`,
              `Valid Path Start Nodes: Node ${oddLabels}`,
            ],
          },
        },
      });
      return steps;
    }
  }

  // 4. Eulerian Traversal Construction
  const startId = selectedStartNode.id;
  const edgeList = edges.map((e) => ({ ...e }));
  const unusedEdgeIds = new Set<string>(edgeList.map((e) => e.id));

  // Build mutable adjacency map
  const adjMap = new Map<string, { neighborId: string; edgeId: string }[]>();
  vertices.forEach((v) => adjMap.set(v.id, []));

  edgeList.forEach((e) => {
    adjMap.get(e.source)?.push({ neighborId: e.target, edgeId: e.id });
    if (!config.isDirected && e.source !== e.target) {
      adjMap.get(e.target)?.push({ neighborId: e.source, edgeId: e.id });
    }
  });

  const path: string[] = [startId];
  const pathEdgeIds: string[] = [];
  const pathLabels: string[] = [selectedStartNode.label];

  let currentId = startId;
  let stepCounter = 1;

  steps.push({
    stepIndex: stepCounter++,
    title: `Traversal Originated at Node ${selectedStartNode.label}`,
    description: `Eulerian traversal initialized at Node ${selectedStartNode.label}. Total edges to traverse: ${edges.length}.`,
    action: `Begin edge-traversing walk from Node ${selectedStartNode.label}.`,
    reason: `Eulerian Traversal Rule: Traverse unused incident edges without isolating unvisited edge components.`,
    activeVertexId: startId,
    visitedVertexIds: [startId],
    dataStructures: {
      traversalPath: [...pathLabels],
      resultSummary: `Path: ${pathLabels.join(' → ')}`,
    },
  });

  // Edge consumption walk
  while (unusedEdgeIds.size > 0) {
    const incident = adjMap.get(currentId) || [];
    const available = incident.filter((item) => unusedEdgeIds.has(item.edgeId));

    if (available.length === 0) break;

    const chosen = available[0];
    unusedEdgeIds.delete(chosen.edgeId);
    pathEdgeIds.push(chosen.edgeId);

    const nextId = chosen.neighborId;
    const nextNode = vertexMap.get(nextId)!;
    currentId = nextId;

    path.push(currentId);
    pathLabels.push(nextNode.label);

    steps.push({
      stepIndex: stepCounter++,
      title: `Traversing Edge to Node ${nextNode.label}`,
      description: `Traversed edge to Node ${nextNode.label}. Remaining unvisited edges: ${unusedEdgeIds.size}.`,
      action: `Traverse edge and append Node ${nextNode.label} to Eulerian path sequence.`,
      reason: `Edge Traversal Rule: Consume incident edge and advance path sequence.`,
      activeVertexId: nextId,
      visitedVertexIds: Array.from(new Set(path)),
      highlightEdgeIds: [chosen.edgeId],
      visitedEdgeIds: [...pathEdgeIds],
      dataStructures: {
        traversalPath: [...pathLabels],
        resultSummary: `Path: ${pathLabels.join(' → ')}`,
      },
    });
  }

  // Verify full edge traversal completeness
  if (pathEdgeIds.length < edges.length) {
    steps.push({
      stepIndex: stepCounter,
      title: 'No Eulerian Traversal Possible: Disconnected Edge Components',
      description: `Traversed ${pathEdgeIds.length} of ${edges.length} edges. Could not traverse all edges.`,
      action: 'Eulerian traversal incomplete due to disconnected edge components.',
      reason: 'Eulerian Graph Theorem: A graph cannot have an Eulerian traversal if edges belong to disconnected components.',
      visitedVertexIds: Array.from(new Set(path)),
      visitedEdgeIds: [...pathEdgeIds],
      dataStructures: {
        traversalPath: [...pathLabels],
        resultSummary: 'No Eulerian Traversal Possible (Disconnected Edges).',
        finalConclusion: {
          success: false,
          title: 'Disconnected Edge Components',
          message: `Could only traverse ${pathEdgeIds.length} of ${edges.length} edges. Graph contains disconnected edge components.`,
        },
      },
    });
    return steps;
  }

  const isCompleteCircuit = isUndirectedEulerCircuit || (config.isDirected && inOutMismatchNodes.length === 0);
  const titleText = isCompleteCircuit ? 'Eulerian Circuit Constructed' : 'Eulerian Path Constructed';
  const pathString = pathLabels.join(' → ');

  steps.push({
    stepIndex: stepCounter,
    title: titleText,
    description: `Eulerian traversal successfully completed. All ${edges.length} edges traversed exactly once.`,
    action: `Finalized ${isCompleteCircuit ? 'Eulerian Circuit' : 'Eulerian Path'}: ${pathString}`,
    reason: `Discrete Math Eulerian Conclusion: Traversed every edge in the graph exactly once without repetition.`,
    visitedVertexIds: Array.from(new Set(path)),
    visitedEdgeIds: [...pathEdgeIds],
    dataStructures: {
      traversalPath: [...pathLabels],
      resultSummary: `${isCompleteCircuit ? 'Eulerian Circuit' : 'Eulerian Path'}: ${pathString}`,
      finalConclusion: {
        success: true,
        title: titleText,
        message: `${isCompleteCircuit ? 'Eulerian Circuit' : 'Eulerian Path'} found starting from Node ${selectedStartNode.label}.`,
        details: [
          `Sequence: ${pathString}`,
          `Total Edges Traversed: ${pathEdgeIds.length} / ${edges.length}`,
          `Type: ${isCompleteCircuit ? 'Closed Circuit (Starts & Ends at same vertex)' : 'Open Path'}`,
        ],
      },
    },
  });

  return steps;
}
