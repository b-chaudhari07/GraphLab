import React, { useState } from 'react';
import type { NavItemView } from '../../types/navigation';
import { SAMPLE_BINARY_TREE, TREE_TERMINOLOGY, TREE_PROPERTIES, TREE_TYPES } from '../../tree/educationalData';
import { TreeCanvas } from './TreeCanvas';
import { GitBranch, BookMarked, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface TreeEducationalViewProps {
  view: NavItemView;
}

export const TreeEducationalView: React.FC<TreeEducationalViewProps> = ({ view }) => {
  const [selectedTermKey, setSelectedTermKey] = useState<string>('root');

  if (view === 'tree-intro') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, height: '100%', overflowY: 'auto' }}>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitBranch size={24} color="var(--accent-blue)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Introduction to Trees</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Discrete Mathematics (7MA206) — Unit V: Graph Theory & Trees
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 300 }}>
          <div style={{ flex: 1, padding: 20, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-blue)' }}>Mathematical Definition</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              In Discrete Mathematics, a <strong>Tree</strong> is defined as a connected, undirected graph with <strong>no simple cycles</strong>.
            </p>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
              T = (V, E) where T is connected and acyclic.
            </div>
            <ul style={{ paddingLeft: 18, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text-secondary)' }}>
              <li><strong>Connectedness:</strong> Every pair of vertices has at least one path connecting them.</li>
              <li><strong>Acyclic Nature:</strong> There are no loops or closed paths that return to the same vertex.</li>
              <li><strong>Edge Fundamental Property:</strong> For any tree with |V| = n vertices, it has exactly |E| = n - 1 edges.</li>
            </ul>
          </div>

          <div style={{ flex: 1, minHeight: 280, borderRadius: 10, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <TreeCanvas tree={SAMPLE_BINARY_TREE} />
          </div>
        </div>
      </div>
    );
  }

  if (view === 'tree-terminology') {
    const activeTerm = TREE_TERMINOLOGY[selectedTermKey] || TREE_TERMINOLOGY.root;
    const highlightedNodes = activeTerm.exampleNodes;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, height: '100%', overflowY: 'auto' }}>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookMarked size={24} color="var(--accent-purple)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Tree Terminology Explorer</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Click any term to highlight its corresponding nodes in the tree diagram below.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flex: 1 }}>
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(TREE_TERMINOLOGY).map(([key, item]) => (
              <button
                key={key}
                className={`btn ${selectedTermKey === key ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedTermKey(key)}
                style={{ justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                {item.term}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-purple)' }}>{activeTerm.term}</h3>
              <p style={{ fontSize: '0.88rem', marginTop: 4, color: 'var(--text-primary)' }}>{activeTerm.definition}</p>
              <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Highlighted Nodes: <strong>{highlightedNodes.join(', ')}</strong>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 260, borderRadius: 10, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
              <TreeCanvas tree={SAMPLE_BINARY_TREE} visitedNodeIds={highlightedNodes} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'tree-properties') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, height: '100%', overflowY: 'auto' }}>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="var(--accent-emerald)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Mathematical Properties of Trees</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Core theorems and properties tested in 7MA206 Unit V.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {TREE_PROPERTIES.map((prop, idx) => (
            <div key={idx} style={{ padding: 16, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{prop.title}</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{prop.summary}</p>
              <div style={{ marginTop: 'auto', padding: '6px 10px', borderRadius: 6, backgroundColor: 'var(--bg-primary)', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
                {prop.formula}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'tree-types') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, height: '100%', overflowY: 'auto' }}>
        <div style={{ padding: 16, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} color="var(--accent-amber)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Types of Trees</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Standard tree structures in graph theory & computer science.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {TREE_TYPES.map((type, idx) => (
            <div key={idx} style={{ padding: 16, borderRadius: 10, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--accent-amber)' }}>{type.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{type.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
