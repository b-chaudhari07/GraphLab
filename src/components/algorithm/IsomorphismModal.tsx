import React, { useState } from 'react';
import type { Vertex, Edge, GraphConfig } from '../../types/graph';
import { X, Network, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateIsomorphismSteps } from '../../algorithms/isomorphism/isomorphismChecker';
import type { AlgorithmStep } from '../../types/algorithm';

interface IsomorphismModalProps {
  isOpen: boolean;
  onClose: () => void;
  graphA: { vertices: Vertex[]; edges: Edge[]; config: GraphConfig };
}

export const IsomorphismModal: React.FC<IsomorphismModalProps> = ({
  isOpen,
  onClose,
  graphA,
}) => {
  // Graph B internal builder state
  const [verticesB, setVerticesB] = useState<Vertex[]>([
    { id: 'vb1', label: '1', x: 100, y: 80 },
    { id: 'vb2', label: '2', x: 250, y: 80 },
    { id: 'vb3', label: '3', x: 175, y: 200 },
  ]);

  const [edgesB, setEdgesB] = useState<Edge[]>([
    { id: 'eb1', source: 'vb1', target: 'vb2', isDirected: false },
    { id: 'eb2', source: 'vb2', target: 'vb3', isDirected: false },
    { id: 'eb3', source: 'vb3', target: 'vb1', isDirected: false },
  ]);

  const [configB] = useState<GraphConfig>({
    isDirected: graphA.config.isDirected,
    isWeighted: false,
    allowSelfLoops: false,
  });

  const [srcB, setSrcB] = useState<string>('');
  const [tgtB, setTgtB] = useState<string>('');
  const [labelB, setLabelB] = useState<string>('');

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  if (!isOpen) return null;

  const handleAddVertexB = (e: React.FormEvent) => {
    e.preventDefault();
    const label = labelB.trim() || `${verticesB.length + 1}`;
    if (verticesB.some((v) => v.label.toLowerCase() === label.toLowerCase())) {
      alert(`Vertex label "${label}" already exists in Graph B.`);
      return;
    }

    const newV: Vertex = {
      id: `vb_${Date.now()}`,
      label,
      x: 100 + Math.floor(Math.random() * 150),
      y: 80 + Math.floor(Math.random() * 120),
    };
    setVerticesB((prev) => [...prev, newV]);
    setLabelB('');
  };

  const handleAddEdgeB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srcB || !tgtB) return;
    if (edgesB.some((e) => e.source === srcB && e.target === tgtB)) return;

    const newE: Edge = {
      id: `eb_${Date.now()}`,
      source: srcB,
      target: tgtB,
      isDirected: configB.isDirected,
    };
    setEdgesB((prev) => [...prev, newE]);
  };

  const handleRunComparison = () => {
    const generatedSteps = generateIsomorphismSteps(graphA, {
      vertices: verticesB,
      edges: edgesB,
      config: configB,
    });
    setSteps(generatedSteps);
    setCurrentStepIdx(0);
  };

  const currentStep = steps[currentStepIdx] || null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Network size={20} color="var(--accent-purple)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Dual Graph Isomorphism Comparison Engine (Graph A ≅ Graph B)
            </h3>
          </div>
          <button className="btn btn-outline btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div style={{ padding: 16, display: 'flex', gap: 16, flex: 1, overflowY: 'auto' }}>
          {/* Graph A Column */}
          <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>Graph A (Canvas Graph)</strong>
              <span className="badge badge-blue">|V|={graphA.vertices.length}, |E|={graphA.edges.length}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Vertices: {graphA.vertices.map((v) => v.label).join(', ') || 'None'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Edges: {graphA.edges.map((e) => {
                const s = graphA.vertices.find((v) => v.id === e.source)?.label;
                const t = graphA.vertices.find((v) => v.id === e.target)?.label;
                return `${s}→${t}`;
              }).join(', ') || 'None'}
            </div>
          </div>

          {/* Graph B Builder Column */}
          <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'var(--accent-purple)', fontSize: '0.9rem' }}>Graph B (Target Graph)</strong>
              <span className="badge badge-purple">|V|={verticesB.length}, |E|={edgesB.length}</span>
            </div>

            <form onSubmit={handleAddVertexB} style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                className="input-field"
                placeholder={`Node Label (e.g. ${verticesB.length + 1})`}
                value={labelB}
                onChange={(e) => setLabelB(e.target.value)}
                style={{ flex: 1, padding: '4px 8px', fontSize: '0.8rem' }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <Plus size={12} /> Add Node
              </button>
            </form>

            <form onSubmit={handleAddEdgeB} style={{ display: 'flex', gap: 6 }}>
              <select className="select-field" value={srcB} onChange={(e) => setSrcB(e.target.value)} style={{ flex: 1, padding: '4px 6px', fontSize: '0.78rem' }}>
                <option value="">Src Node</option>
                {verticesB.map((v) => (
                  <option key={v.id} value={v.id}>Node {v.label}</option>
                ))}
              </select>
              <select className="select-field" value={tgtB} onChange={(e) => setTgtB(e.target.value)} style={{ flex: 1, padding: '4px 6px', fontSize: '0.78rem' }}>
                <option value="">Tgt Node</option>
                {verticesB.map((v) => (
                  <option key={v.id} value={v.id}>Node {v.label}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-outline btn-sm" disabled={!srcB || !tgtB}>
                Connect
              </button>
            </form>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Vertices: {verticesB.map((v) => v.label).join(', ') || 'None'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Edges: {edgesB.map((e) => {
                const s = verticesB.find((v) => v.id === e.source)?.label;
                const t = verticesB.find((v) => v.id === e.target)?.label;
                return `${s}→${t}`;
              }).join(', ') || 'None'}
            </div>
          </div>
        </div>

        {/* Isomorphism Execution Steps Output Area */}
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="btn btn-primary btn-sm" onClick={handleRunComparison}>
              <RefreshCw size={14} /> Run Isomorphism Bijection Check
            </button>
            {steps.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentStepIdx === 0}
                  onClick={() => setCurrentStepIdx((prev) => Math.max(prev - 1, 0))}
                >
                  Previous
                </button>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Step {currentStepIdx + 1} / {steps.length}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentStepIdx >= steps.length - 1}
                  onClick={() => setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1))}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {currentStep && (
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--accent-purple)' }}>
                <span>{currentStep.title}</span>
              </div>
              <p style={{ color: 'var(--text-primary)' }}>{currentStep.action}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{currentStep.reason}</p>

              {currentStep.dataStructures?.isomorphismMapping && (
                <div style={{ marginTop: 4, padding: 8, backgroundColor: 'rgba(99, 102, 241, 0.12)', borderRadius: 6, color: 'var(--text-primary)', fontWeight: 600 }}>
                  Bijection Mapping: {Object.entries(currentStep.dataStructures.isomorphismMapping).map(([a, b]) => `A(${a}) ↦ B(${b})`).join(' | ')}
                </div>
              )}

              {currentStep.dataStructures?.finalConclusion && (
                <div style={{ marginTop: 6, padding: 10, borderRadius: 6, backgroundColor: currentStep.dataStructures.finalConclusion.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)', border: `1px solid ${currentStep.dataStructures.finalConclusion.success ? 'var(--accent-emerald)' : 'var(--accent-rose)'}` }}>
                  <div style={{ fontWeight: 700, color: currentStep.dataStructures.finalConclusion.success ? 'var(--accent-emerald)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {currentStep.dataStructures.finalConclusion.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {currentStep.dataStructures.finalConclusion.title}
                  </div>
                  <p style={{ marginTop: 4, color: 'var(--text-primary)' }}>{currentStep.dataStructures.finalConclusion.message}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.05)' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
