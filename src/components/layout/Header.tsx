import React from 'react';
import { Sun, Moon, HelpCircle, RefreshCw, Network } from 'lucide-react';
import type { ThemeMode } from '../../types/visualization';

interface HeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  onReset: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  onReset,
  onOpenAbout,
}) => {
  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Title & Course Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
          }}
        >
          <Network size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #f8fafc, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GraphLab
            </h1>
            <span className="badge badge-purple">Discrete Math (7MA206)</span>
            <span className="badge badge-blue">S.Y. B.Tech IT</span>
            <span className="badge badge-emerald">Module V</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Interactive Graph Algorithm Visualizer • Track B Computational Tool
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={onReset}
          title="Reset Graph Canvas"
        >
          <RefreshCw size={14} /> Clear / Reset
        </button>

        <button
          className="btn btn-outline btn-sm"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>

        <button
          className="btn btn-outline btn-sm"
          onClick={onOpenAbout}
          title="Project & Syllabus Information"
        >
          <HelpCircle size={14} /> About / Syllabus
        </button>
      </div>
    </header>
  );
};
