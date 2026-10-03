# GraphLab — Interactive Graph Algorithm Visualizer

> **Course:** Discrete Mathematics (7MA206) | S.Y. B.Tech Information Technology  
> **Project Track:** Track B — Interactive Computational Tool / Inference Engine  
> **Syllabus Target:** Module V — Graph and Trees  
> **Development Status:** Phase 1 (Foundation, Domain Model, UI Shell & Architecture)

---

## 📌 Project Overview

**GraphLab** is an interactive educational web tool designed for visualizing graph-theory algorithms and analyzing discrete mathematical structures step-by-step. Built specifically according to the Discrete Mathematics (7MA206) Module V syllabus, GraphLab enables students and faculty to construct arbitrary graphs, inspect mathematical properties (Adjacency Matrix, Adjacency List, Degree Distributions), and observe state-by-state execution of graph algorithms.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 / 19
- **Type System:** TypeScript (Strict Mode)
- **Build Tooling:** Vite
- **Graph Renderer:** Scalable Vector Graphics (SVG)
- **Styling & Theme:** Vanilla CSS Modern Tokens (Glassmorphism, Dark/Light Modes)
- **Icons:** Lucide React

---

## 🚀 Current Status — Phase 1 Complete

In **Phase 1**, the application foundation, UI shell, TypeScript domain model, SVG canvas rendering, and animation execution architecture have been established:

- ✅ **Project Foundation & Clean Architecture:** React + TypeScript + Vite project set up with clean module separation (`components`, `types`, `hooks`, `utils`, `algorithms`, `data`, `styles`).
- ✅ **Domain Model (`src/types/`):** Generic TypeScript types representing `Vertex`, `Edge`, `GraphData`, `GraphConfig`, `GraphMetrics`, `AlgorithmConfig`, and `AlgorithmStep`.
- ✅ **Interactive SVG Graph Canvas (`src/components/graph/`):** Full SVG graph builder supporting vertex creation, drag-and-drop node placement, 2-click edge creation, directed arrows, weight badges, and visual selection states.
- ✅ **Graph Builder Panel (`src/components/controls/`):** Controls for toggling Directed/Undirected mode, Weighted/Unweighted edges, manual node/edge forms, canvas reset, and preset graph loading.
- ✅ **Discrete Math Metrics System (`src/utils/graphUtils.ts`):** Real-time mathematical computation of vertex degree distributions (In/Out/Total degree), Adjacency Matrix, and Adjacency List representations.
- ✅ **Algorithm Panel & Metadata Registry (`src/components/algorithm/` & `src/algorithms/`):** Interface for selecting syllabus-supported Module V algorithms and dynamically choosing valid starting vertices.
- ✅ **Execution Architecture (`src/hooks/useExecutionState.ts`):** Timer-driven execution state engine providing Play, Pause, Step Next, Step Prev, Restart, and Speed configuration (0.5x to 5x).
- ✅ **Math Explanation Panel (`src/components/panels/`):** Component shell for displaying Discrete Mathematics step justifications, actions, and active data structures.
- ✅ **Academic Header & Syllabus Modal (`src/components/layout/`):** Course metadata, theme switcher (Dark/Light), canvas reset, and syllabus guide modal.

> *Note:* Graph algorithms (BFS, DFS, MST, Euler/Hamiltonian paths, Coloring) are intentionally **NOT** implemented in Phase 1 and will be added in Phase 2.

---

## 📐 Project Architecture

```
GraphLab/
├── src/
│   ├── algorithms/       # Syllabus algorithm registry and metadata definitions
│   ├── components/
│   │   ├── algorithm/    # Algorithm selection panel & playback controls
│   │   ├── controls/     # Graph builder, preset loader, configuration toggles
│   │   ├── graph/        # SVG Graph Canvas, SvgVertex, and SvgEdge renderers
│   │   ├── layout/       # Application Header, Main Layout, and About Modal
│   │   └── panels/       # Graph Info Metrics panel & Math Explanation panel
│   ├── data/             # Preset Discrete Math graph examples (Binary Tree, K4, Digraph, etc.)
│   ├── hooks/            # Custom hooks (useGraphState, useExecutionState, useTheme)
│   ├── pages/            # Main application page layout (GraphLabPage.tsx)
│   ├── styles/           # Modern CSS variables, themes, and global layout resets
│   ├── types/            # TypeScript domain interfaces (graph, algorithm, visualization)
│   ├── utils/            # Geometry SVG helpers and graph mathematical metric calculators
│   ├── App.tsx           # Main application entry component
│   └── main.tsx          # React DOM render entry point
├── index.html            # Web page container with SEO metadata
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── package.json          # Dependency manifest
```

---

## 💻 How to Install and Run

### Prerequisites

Ensure you have **Node.js** (v18.0 or higher) installed on your system.

### 1. Installation

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available locally at `http://localhost:5173/` (or the URL printed by Vite).

### 3. Build for Production

```bash
npm run build
```

---

## 🗺️ Planned Development Roadmap

| Phase | Scope / Milestone | Status |
| :--- | :--- | :---: |
| **Phase 1** | Foundation, Domain Models, SVG Canvas Builder, Execution Architecture, UI Shell | **Completed** |
| **Phase 2** | Implementation of Syllabus Graph Algorithms (BFS, DFS, Prim, Kruskal, Euler, Hamiltonian, Coloring) | Upcoming |
| **Phase 3** | Advanced Visual Effects, Algorithm Step Generators, Edge Cases & Verification | Upcoming |
| **Phase 4** | Final Educational Polish & Demonstration Preparation | Upcoming |
