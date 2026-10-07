import React, { useState } from 'react';
import type { NavItemView } from '../../types/navigation';
import {
  Home,
  Network,
  Share2,
  Workflow,
  Sparkles,
  GitBranch,
  Info,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Layers,
  HelpCircle,
  BookMarked,
} from 'lucide-react';

interface SidebarProps {
  currentView: NavItemView;
  onSelectView: (view: NavItemView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const [graphOpen, setGraphOpen] = useState(true);
  const [treesOpen, setTreesOpen] = useState(true);

  const getItemClass = (view: NavItemView) => {
    const isSelected = currentView === view;
    return `sidebar-item ${isSelected ? 'active' : ''}`;
  };

  return (
    <aside className="sidebar-container">
      {/* Sidebar Header / Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Share2 size={22} color="var(--accent-blue)" />
          <div>
            <h1 className="brand-title">GraphLab</h1>
            <p className="brand-subtitle">Interactive Graph Algorithm Visualizer</p>
          </div>
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="sidebar-nav">
        {/* HOME Section */}
        <div className="sidebar-group">
          <div className="sidebar-group-title">HOME</div>
          <button className={getItemClass('home')} onClick={() => onSelectView('home')}>
            <Home size={16} />
            <span>Overview & Dashboard</span>
          </button>
        </div>

        {/* GRAPH Section */}
        <div className="sidebar-group">
          <div
            className="sidebar-group-title clickable"
            onClick={() => setGraphOpen(!graphOpen)}
          >
            <span>GRAPH</span>
            {graphOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>

          {graphOpen && (
            <div className="sidebar-items">
              <button
                className={getItemClass('graph-builder')}
                onClick={() => onSelectView('graph-builder')}
              >
                <Network size={16} />
                <span>Graph Builder</span>
              </button>

              <button
                className={getItemClass('connectivity')}
                onClick={() => onSelectView('connectivity')}
              >
                <Share2 size={16} />
                <span>Connectivity Explorer</span>
              </button>

              <button
                className={getItemClass('eulerian')}
                onClick={() => onSelectView('eulerian')}
              >
                <Workflow size={16} />
                <span>Eulerian Path / Circuit</span>
              </button>

              <button
                className={getItemClass('hamiltonian')}
                onClick={() => onSelectView('hamiltonian')}
              >
                <Sparkles size={16} />
                <span>Hamiltonian Pathfinder</span>
              </button>

              <button
                className={getItemClass('isomorphism')}
                onClick={() => onSelectView('isomorphism')}
              >
                <Layers size={16} />
                <span>Graph Isomorphism</span>
              </button>
            </div>
          )}
        </div>

        {/* TREES Section */}
        <div className="sidebar-group">
          <div
            className="sidebar-group-title clickable"
            onClick={() => setTreesOpen(!treesOpen)}
          >
            <span>TREES</span>
            {treesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>

          {treesOpen && (
            <div className="sidebar-items">
              <button
                className={getItemClass('tree-intro')}
                onClick={() => onSelectView('tree-intro')}
              >
                <GitBranch size={16} />
                <span>Introduction</span>
              </button>

              <button
                className={getItemClass('tree-terminology')}
                onClick={() => onSelectView('tree-terminology')}
              >
                <BookMarked size={16} />
                <span>Terminology</span>
              </button>

              <button
                className={getItemClass('tree-properties')}
                onClick={() => onSelectView('tree-properties')}
              >
                <BookOpen size={16} />
                <span>Properties</span>
              </button>

              <button
                className={getItemClass('tree-types')}
                onClick={() => onSelectView('tree-types')}
              >
                <Layers size={16} />
                <span>Types of Trees</span>
              </button>

              <button
                className={getItemClass('tree-traversals')}
                onClick={() => onSelectView('tree-traversals')}
              >
                <GitBranch size={16} />
                <span>Tree Traversals</span>
              </button>
            </div>
          )}
        </div>

        {/* RESOURCES Section */}
        <div className="sidebar-group">
          <div className="sidebar-group-title">RESOURCES</div>
          <button className={getItemClass('theory')} onClick={() => onSelectView('theory')}>
            <BookOpen size={16} />
            <span>Theory & Formulas</span>
          </button>
          <button className={getItemClass('about')} onClick={() => onSelectView('about')}>
            <Info size={16} />
            <span>About Project</span>
          </button>
        </div>
      </div>

      {/* Unit V Bottom Badge */}
      <div className="sidebar-footer">
        <div className="unit-badge">
          <HelpCircle size={16} color="var(--accent-blue)" />
          <div>
            <div className="unit-title">Unit V</div>
            <div className="unit-sub">Graph Theory & Trees</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
