import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useGraphState } from '../hooks/useGraphState';
import { useExecutionState } from '../hooks/useExecutionState';
import type { NavItemView } from '../types/navigation';
import type { TreeTraversalMode } from '../tree/types';
import type { HamiltonianMode, SyllabusAlgorithmId } from '../types/algorithm';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { AboutModal } from '../components/layout/AboutModal';
import { GraphCanvas } from '../components/graph/GraphCanvas';
import { TreeCanvas } from '../components/tree/TreeCanvas';
import { TreeEducationalView } from '../components/tree/TreeEducationalView';
import { ExecutionControls } from '../components/algorithm/ExecutionControls';
import { OfficialOutput } from '../components/output/OfficialOutput';
import { IsomorphismModal } from '../components/algorithm/IsomorphismModal';
import { AdjacencyOverlayModal } from '../components/graph/AdjacencyOverlayModal';
import { SAMPLE_BINARY_TREE } from '../tree/educationalData';
import { generateTreeTraversalSteps } from '../tree/traversal';
import { runAlgorithm } from '../algorithms/runner';
import { Share2, Layers, GitBranch, Play, BookOpen } from 'lucide-react';

export const GraphLabPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Navigation State
  const [currentView, setCurrentView] = useState<NavItemView>('tree-traversals');
  const [treeTraversalMode, setTreeTraversalMode] = useState<TreeTraversalMode>('preorder');
  const [hamiltonianMode] = useState<HamiltonianMode>('cycle');

  // Modal States
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isIsomorphismOpen, setIsIsomorphismOpen] = useState<boolean>(false);
  const [adjacencyModalType, setAdjacencyModalType] = useState<'list' | 'matrix' | null>(null);

  // Core Graph State
  const {
    vertices,
    edges,
    config,
    canvasMode,
    setCanvasMode,
    selection,
    setSelection,
    validationError,
    setValidationError,
    clearValidationError,
    addVertex,
    moveVertex,
    addEdge,
    deleteVertex,
    deleteEdge,
    clearGraph,
    resetGraph,
    loadPreset,
  } = useGraphState();

  // Execution Engine State
  const {
    status,
    currentStepIndex,
    totalSteps,
    currentStep,
    config: executionConfig,
    play,
    pause,
    stepForward,
    stepBackward,
    restart,
    setAlgorithm,
    setStartVertex,
    setAnimationSpeed,
    loadSteps,
    resetExecution,
    syncWithVertices,
  } = useExecutionState();

  // Sync execution engine start node when vertices change
  useEffect(() => {
    syncWithVertices(vertices);
  }, [vertices, syncWithVertices]);

  // Sync active view with execution algorithm selection
  const handleSelectView = (view: NavItemView) => {
    setCurrentView(view);

    if (view === 'connectivity' || view === 'eulerian' || view === 'hamiltonian' || view === 'isomorphism') {
      setAlgorithm(view as SyllabusAlgorithmId);
    }
  };

  // Run Graph Algorithm Handler
  const handleRunGraphAlgorithm = useCallback(() => {
    if (!executionConfig.selectedAlgorithmId) return;

    if (executionConfig.selectedAlgorithmId === 'isomorphism') {
      setIsIsomorphismOpen(true);
      return;
    }

    const fullConfig = {
      ...executionConfig,
      hamiltonianMode,
    };

    const generatedSteps = runAlgorithm(fullConfig, { vertices, edges, config });
    if (generatedSteps.length > 0) {
      loadSteps(generatedSteps, true);
    }
  }, [executionConfig, hamiltonianMode, vertices, edges, config, loadSteps]);

  // Run Tree Traversal Handler
  const handleRunTreeTraversal = useCallback(
    (mode: TreeTraversalMode) => {
      setTreeTraversalMode(mode);
      const { steps } = generateTreeTraversalSteps(SAMPLE_BINARY_TREE, mode);
      if (steps.length > 0) {
        loadSteps(steps, true);
      }
    },
    [loadSteps]
  );

  // Auto-initialize tree traversal on view switch
  useEffect(() => {
    if (currentView === 'tree-traversals') {
      const { steps } = generateTreeTraversalSteps(SAMPLE_BINARY_TREE, treeTraversalMode);
      loadSteps(steps, false);
    }
  }, [currentView, treeTraversalMode, loadSteps]);

  // Computed Official Output String & Conclusion Status
  const computedOfficialOutput = useMemo(() => {
    if (currentView === 'tree-traversals') {
      const { finalResultString } = generateTreeTraversalSteps(SAMPLE_BINARY_TREE, treeTraversalMode);
      if (currentStep?.dataStructures?.traversalPath) {
        return `${treeTraversalMode.toUpperCase()} Traversal:\n${currentStep.dataStructures.traversalPath.join(' → ')}`;
      }
      return finalResultString;
    }

    if (currentStep?.dataStructures?.finalConclusion) {
      const conc = currentStep.dataStructures.finalConclusion;
      const detailsStr = conc.details ? conc.details.join('\n') : '';
      return `${conc.title}\n${conc.message}\n\n${detailsStr}`.trim();
    }

    if (currentStep?.dataStructures?.resultSummary) {
      return currentStep.dataStructures.resultSummary;
    }

    if (currentView === 'graph-builder') {
      return `Graph State:\nVertices: ${vertices.length}\nEdges: ${edges.length}\nType: ${config.isDirected ? 'Directed' : 'Undirected'}\nWeights: ${config.isWeighted ? 'Weighted' : 'Unweighted'}`;
    }

    return null;
  }, [currentView, treeTraversalMode, currentStep, vertices.length, edges.length, config.isDirected, config.isWeighted]);

  return (
    <div className="app-layout">
      {/* Scrollable Left Navigation Sidebar */}
      <Sidebar currentView={currentView} onSelectView={handleSelectView} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Top Header */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onReset={() => {
            resetGraph();
            resetExecution();
          }}
          onOpenAbout={() => setIsAboutOpen(true)}
        />

        {/* View Header & Context Controls Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Breadcrumb & Title */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{currentView.startsWith('tree') ? 'Trees' : currentView === 'home' || currentView === 'theory' || currentView === 'about' ? 'Resources' : 'Graph'}</span>
              <span>&gt;</span>
              <span style={{ color: 'var(--accent-blue)' }}>
                {currentView === 'tree-traversals'
                  ? 'Tree Traversals'
                  : currentView === 'connectivity'
                  ? 'Connectivity Explorer'
                  : currentView === 'eulerian'
                  ? 'Eulerian Path / Circuit'
                  : currentView === 'hamiltonian'
                  ? 'Hamiltonian Pathfinder'
                  : currentView === 'isomorphism'
                  ? 'Graph Isomorphism'
                  : currentView === 'graph-builder'
                  ? 'Graph Builder'
                  : currentView}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <div style={{ padding: 6, borderRadius: 8, backgroundColor: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent-blue)' }}>
                {currentView.startsWith('tree') ? <GitBranch size={20} /> : <Share2 size={20} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {currentView === 'tree-traversals'
                    ? 'Tree Traversals'
                    : currentView === 'connectivity'
                    ? 'Connectivity Explorer'
                    : currentView === 'eulerian'
                    ? 'Eulerian Path & Circuit Analysis'
                    : currentView === 'hamiltonian'
                    ? 'Hamiltonian Pathfinder'
                    : currentView === 'isomorphism'
                    ? 'Graph Isomorphism Checker'
                    : currentView === 'graph-builder'
                    ? 'Interactive Graph Builder'
                    : 'GraphLab Dashboard'}
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {currentView === 'tree-traversals'
                    ? 'Visualize and understand Inorder, Preorder and Postorder traversal on a binary tree.'
                    : currentView === 'connectivity'
                    ? 'Explore whether a graph is connected using a step-by-step traversal visualization.'
                    : currentView === 'eulerian'
                    ? 'Verify Euler Theorem degree parities and construct edge-traversing paths.'
                    : currentView === 'hamiltonian'
                    ? 'Search for paths or cycles visiting every vertex exactly once.'
                    : currentView === 'isomorphism'
                    ? 'Compare structural equivalence and adjacency preservation between two graphs.'
                    : 'Construct, modify, and test custom graph structures.'}
                </p>
              </div>
            </div>
          </div>

          {/* Context Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {currentView === 'tree-traversals' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Select Traversal</span>
                <div style={{ display: 'flex', gap: 4, backgroundColor: 'var(--bg-primary)', padding: 3, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                  <button
                    className={`btn btn-sm ${treeTraversalMode === 'preorder' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleRunTreeTraversal('preorder')}
                  >
                    Preorder
                  </button>
                  <button
                    className={`btn btn-sm ${treeTraversalMode === 'inorder' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleRunTreeTraversal('inorder')}
                  >
                    Inorder
                  </button>
                  <button
                    className={`btn btn-sm ${treeTraversalMode === 'postorder' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleRunTreeTraversal('postorder')}
                  >
                    Postorder
                  </button>
                </div>
              </div>
            )}

            {(currentView === 'connectivity' || currentView === 'eulerian' || currentView === 'hamiltonian') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)' }}>Start Vertex</label>
                  <select
                    className="select-field"
                    value={executionConfig.startVertexId || ''}
                    onChange={(e) => setStartVertex(e.target.value || null)}
                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                  >
                    <option value="">-- Node A (Default) --</option>
                    {vertices.map((v) => (
                      <option key={v.id} value={v.id}>Node {v.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-success btn-sm"
                  onClick={handleRunGraphAlgorithm}
                  disabled={status === 'running' || vertices.length === 0}
                  style={{ marginTop: 14, fontWeight: 600 }}
                >
                  <Play size={14} /> Run Algorithm
                </button>
              </div>
            )}

            {currentView === 'isomorphism' && (
              <button className="btn btn-primary btn-sm" onClick={() => setIsIsomorphismOpen(true)}>
                <Layers size={14} /> Open Dual Graph Editor
              </button>
            )}

            {currentView === 'graph-builder' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-outline btn-sm" onClick={() => loadPreset('binary-tree')}>Preset Tree</button>
                <button className="btn btn-outline btn-sm" onClick={() => loadPreset('complete-k4')}>Preset K4</button>
                <button className="btn btn-danger btn-sm" onClick={() => { clearGraph(); resetExecution(); }}>Clear</button>
              </div>
            )}
          </div>
        </div>

        {/* Central Visualization Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
          {currentView === 'tree-traversals' ? (
            <TreeCanvas
              tree={SAMPLE_BINARY_TREE}
              activeNodeId={currentStep?.activeVertexId}
              visitedNodeIds={currentStep?.visitedVertexIds}
              onOpenAdjacency={(type) => setAdjacencyModalType(type)}
            />
          ) : currentView.startsWith('tree-') ? (
            <TreeEducationalView view={currentView} />
          ) : currentView === 'home' || currentView === 'theory' || currentView === 'about' ? (
            <div style={{ padding: 24, overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 20, borderRadius: 12, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={20} /> Discrete Mathematics (7MA206) — Module V: Graph Theory & Trees
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  GraphLab is an interactive educational tool designed for Discrete Mathematics (7MA206), S.Y. B.Tech IT. It allows users to visually analyze graph properties, construct graph models, and observe step-by-step algorithm executions.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 8 }}>
                  <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <strong style={{ color: 'var(--accent-blue)' }}>1. Connectivity Explorer</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>BFS reachability and component analysis.</p>
                  </div>
                  <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <strong style={{ color: 'var(--accent-purple)' }}>2. Eulerian Analysis</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>Euler's Theorem degree parities & connectivity.</p>
                  </div>
                  <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <strong style={{ color: 'var(--accent-emerald)' }}>3. Hamiltonian Pathfinder</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>Backtracking path & cycle discovery.</p>
                  </div>
                  <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <strong style={{ color: 'var(--accent-amber)' }}>4. Graph Isomorphism</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>Invariants and adjacency matrix bijection check.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <GraphCanvas
              vertices={vertices}
              edges={edges}
              config={config}
              canvasMode={canvasMode}
              setCanvasMode={setCanvasMode}
              selection={selection}
              setSelection={setSelection}
              addVertex={addVertex}
              moveVertex={moveVertex}
              addEdge={addEdge}
              deleteVertex={deleteVertex}
              deleteEdge={deleteEdge}
              startVertexId={executionConfig.startVertexId}
              activeVertexId={currentStep?.activeVertexId}
              visitedVertexIds={currentStep?.visitedVertexIds}
              highlightEdgeIds={currentStep?.highlightEdgeIds}
              onLoadPreset={loadPreset}
              validationError={validationError}
              clearValidationError={clearValidationError}
              setValidationError={setValidationError}
              onOpenAdjacency={(type) => setAdjacencyModalType(type)}
            />
          )}
        </div>

        {/* Bottom Area: Controls + Official Output Box (Matching Mockups) */}
        {!currentView.startsWith('tree-') || currentView === 'tree-traversals' ? (
          <div
            style={{
              height: 140,
              backgroundColor: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-color)',
              padding: '10px 16px',
              display: 'grid',
              gridTemplateColumns: '1fr 280px 320px',
              gap: 14,
              alignItems: 'center',
            }}
          >
            {/* Step Information Panel */}
            <div
              style={{
                height: '100%',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentStep?.title || 'Step Information'}
                </span>
                <span className="badge badge-blue">
                  {totalSteps > 0 ? `${currentStepIndex + 1} / ${totalSteps}` : '0 / 0'}
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentStep?.description || 'Select an algorithm or traversal and click Run to begin playback.'}
              </p>

              <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 500 }}>
                {currentStep?.action || ''}
              </div>
            </div>

            {/* Playback Controls Panel */}
            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <ExecutionControls
                status={status}
                currentStepIndex={currentStepIndex}
                totalSteps={totalSteps}
                animationSpeed={executionConfig.animationSpeed}
                onPlay={play}
                onPause={pause}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onRestart={restart}
                onSpeedChange={setAnimationSpeed}
              />
            </div>

            {/* Official Output Terminal Panel */}
            <div style={{ height: '100%' }}>
              <OfficialOutput
                title="Official Output"
                outputContent={computedOfficialOutput}
                statusSuccess={currentStep?.dataStructures?.finalConclusion?.success ?? true}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Educational Information Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Dual Graph Isomorphism Modal */}
      <IsomorphismModal
        isOpen={isIsomorphismOpen}
        onClose={() => setIsIsomorphismOpen(false)}
        graphA={{ vertices, edges, config }}
      />

      {/* Adjacency List & Matrix Popover Modal */}
      <AdjacencyOverlayModal
        isOpen={!!adjacencyModalType}
        type={adjacencyModalType}
        onClose={() => setAdjacencyModalType(null)}
        vertices={vertices}
        edges={edges}
        config={config}
      />
    </div>
  );
};
