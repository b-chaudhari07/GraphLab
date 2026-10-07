import React from 'react';
import { Sun, Moon, Info, RotateCcw } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
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
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          GraphLab <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>| Discrete Mathematics 7MA206</span>
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Reset Action */}
        <button
          className="btn btn-outline btn-sm"
          onClick={onReset}
          title="Reset Canvas & Execution"
        >
          <RotateCcw size={14} /> Reset
        </button>

        {/* Theme Switch Pill (Sun/Moon switch) */}
        <div
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px',
            borderRadius: 9999,
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          <Sun size={14} color={theme === 'light' ? 'var(--accent-amber)' : 'var(--text-muted)'} />
          <div
            style={{
              width: 28,
              height: 14,
              borderRadius: 10,
              backgroundColor: theme === 'dark' ? 'var(--accent-blue)' : '#cbd5e1',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: 2,
                left: theme === 'dark' ? 16 : 2,
                transition: 'all 0.2s ease',
              }}
            />
          </div>
          <Moon size={14} color={theme === 'dark' ? 'var(--accent-indigo)' : 'var(--text-muted)'} />
        </div>

        {/* About Info Icon Button */}
        <button
          className="btn btn-outline btn-sm btn-icon"
          onClick={onOpenAbout}
          title="Educational Information"
          style={{ borderRadius: '50%' }}
        >
          <Info size={16} />
        </button>
      </div>
    </header>
  );
};
