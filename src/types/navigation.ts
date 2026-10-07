/**
 * Navigation Types for GraphLab
 * Supports Graph features, Tree educational & traversal sections, and Resources
 */

export type MainNavSection = 'home' | 'graph' | 'trees' | 'resources';

export type NavItemView =
  | 'home'
  // Graph items
  | 'graph-builder'
  | 'connectivity'
  | 'eulerian'
  | 'hamiltonian'
  // Tree items
  | 'tree-intro'
  | 'tree-terminology'
  | 'tree-traversals'
  // Resource items
  | 'theory'
  | 'about';

export interface NavGroup {
  id: MainNavSection;
  title: string;
  items: {
    id: NavItemView;
    label: string;
    iconName?: string;
    badge?: string;
  }[];
}
