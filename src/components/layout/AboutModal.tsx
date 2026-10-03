import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, Info } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
          maxWidth: 640,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={20} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              GraphLab — Educational Academic Overview
            </h3>
          </div>
          <button
            className="btn btn-outline btn-sm btn-icon"
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div
          style={{
            padding: 20,
            maxHeight: '75vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              gap: 12,
            }}
          >
            <Info size={24} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>
                ISE-2 Project: Discrete Mathematics (7MA206)
              </strong>
              <p style={{ fontSize: '0.8rem', marginTop: 2 }}>
                S.Y. B.Tech Information Technology • Track B — Interactive Computational Tool / Inference Engine
              </p>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={16} color="var(--accent-purple)" /> Syllabus Alignment (Module V — Graph and Trees)
            </h4>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.83rem' }}>
              <li>Graph definitions, directed vs undirected graphs, edge weights</li>
              <li>Adjacency matrix & adjacency list representations</li>
              <li>Vertex degree distribution & Handshaking Lemma</li>
              <li>Graph traversals: BFS & DFS</li>
              <li>Trees, rooted trees & Minimum Spanning Trees (Kruskal & Prim)</li>
              <li>Eulerian paths/circuits & Hamiltonian cycles</li>
              <li>Vertex coloring & chromatic numbers</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> Phase 1 Foundation Delivered
            </h4>
            <p style={{ fontSize: '0.83rem' }}>
              Phase 1 establishes the complete application architecture, modular React + TypeScript component hierarchy, dynamic SVG graph builder, execution engine interfaces, and Discrete Mathematics metrics calculation system. Algorithm step generation engines will be plugged into Phase 2.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
