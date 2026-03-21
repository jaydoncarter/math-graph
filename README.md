# Math Concept Graph

An interactive, visual map of mathematical concepts and their dependencies, built with React, D3, and KaTeX.

**[Live Demo →](https://jaydoncarter.github.io/math-graph/)**

---

## Overview

Math Concept Graph renders a force-directed dependency graph where each node represents a mathematical concept. Clicking a node displays its definition and LaTeX formula, and highlights the concepts it depends on and supports. Designed to answer the question: _"Why does this work?"_ in math.

## Features

- **Force-directed graph** — nodes naturally arrange themselves by dependency depth using a D3 physics simulation
- **Dependency highlighting** — selecting a node dims unrelated edges and illuminates its prerequisite chain
- **LaTeX rendering** — every concept includes a properly typeset formula via KaTeX
- **Live search** — filter nodes by name as you type; press Enter to jump to the first result
- **Depth-encoded color** — an amber-to-bronze gradient communicates how foundational vs. advanced each concept is
- **Draggable nodes** — rearrange the graph freely; zoom and pan to explore
- **Mobile compatible** — responsive layout works on touch screens
- **Auto-computed tiers** — concept depth is calculated automatically from the dependency graph; no manual ordering needed

## Tech Stack

| Library                     | Purpose                                   |
| --------------------------- | ----------------------------------------- |
| [React](https://react.dev)  | UI components and state                   |
| [D3](https://d3js.org)      | Force simulation, SVG rendering, zoom/pan |
| [KaTeX](https://katex.org)  | LaTeX math typesetting                    |
| [Vite](https://vitejs.dev)  | Build tool and dev server                 |
| [Git](https://git-scm.com/) | Version control and management            |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/jaydoncarter/math-graph.git
cd math-graph

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Adding Concepts

All concepts live in the `conceptData` array in `conceptData.js`. Add a new entry in this form:

```js
{
  id: "taylor_series",
  name: "Taylor Series",
  definition: "An infinite sum of terms expressing a function as a polynomial centered at a point.",
  latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
  depends_on: ["derivative", "sequences"]
}
```

- `id` — unique snake_case identifier, used in `depends_on` references
- `depends_on` — array of `id` strings; can be empty `[]` for root concepts
- `tier` — **do not set manually**, it is computed automatically from the dependency chain

The graph, colors, and layout all update automatically. Note that **the graph must be acyclic**; it will fail to render otherwise.

## Rich Node Content

For concepts that warrant more depth — extended proofs, multiple LaTeX blocks, interactive graphs, or PDF references — you can attach a content module that replaces the default definition/formula layout in the detail panel. Regardless, every item in the array must abide by the contract defined at the top of conceptData, even if the base data is overwritten by the rich content.

### 1. Mark the node in `conceptData.js`

Add `hasRichContent: true` to the node's entry:

```js
{
  id: "fourier_transform",
  name: "Fourier Transform",
  definition: "...",
  latex: "...",
  depends_on: ["..."],
  hasRichContent: true   // ← add this
}
```

### 2. Create a content file

Create `src/content/{node_id}.js` (copy `src/content/_TEMPLATE.js` as a starting point) and export a `blocks` array:

```js
// src/content/fourier_transform.js
export const blocks = [
  {
    type: "definition",
    content: "Decomposes a function into its constituent frequencies...",
  },
  {
    type: "latex",
    content:
      "\\hat{f}(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-2\\pi i \\omega t}\\, dt",
  },
  { type: "section", title: "Inverse Transform" },
  {
    type: "latex",
    content:
      "f(t) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\omega)\\, e^{2\\pi i \\omega t}\\, d\\omega",
  },
  {
    type: "note",
    noteType: "warning",
    content:
      "Several normalisation conventions exist — always check which a source uses.",
  },
  {
    type: "embed",
    embedType: "desmos",
    id: "YOUR_GRAPH_ID",
    height: 300,
  },
  {
    type: "pdf",
    url: "/docs/fourier_analysis.pdf",
    label: "Stein & Shakarchi — Fourier Analysis",
  },
];
```

Content modules are **lazy-loaded** — they are only fetched when a node is clicked, so unused files have no impact on initial load time. Nodes without a content file always fall back to the standard definition + formula layout.

### Available block types

| Type          | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `definition`  | Primary description paragraph                                    |
| `text`        | Secondary prose (dimmer styling)                                 |
| `section`     | Horizontal divider with an uppercase label                       |
| `latex`       | KaTeX display block in a dark card                               |
| `latexInline` | KaTeX rendered inline, no card                                   |
| `note`        | Callout box — `noteType`: `proof`, `info`, or `warning`          |
| `list`        | Bulleted or numbered list — set `ordered: true` for numbers      |
| `svg`         | Raw SVG markup injected into a centred container                 |
| `img`         | Image from a URL                                                 |
| `embed`       | Interactive iframe — `embedType`: `desmos`, `geogebra`, or `url` |
| `pdf`         | Styled link button that opens a PDF in a new tab                 |

The **Requires** and **Unlocks** dependency links are always rendered at the bottom of the panel automatically — you never need to include them in a content file.

See `src/content/_TEMPLATE.js` for a fully annotated example of every block type.

## Deployment

```bash
npm run deploy
```

Builds the project and pushes to the `gh-pages` branch. Requires the `gh-pages` package and the `base` path set in `vite.config.js`:

```js
export default {
  base: "/math-graph/",
};
```

## Contact

Feel free to reach out through any of the methods on [my website](https://jaydoncarter.github.io/contact.html) or directly at [jaydoncarter898@gmail.com](jaydoncarter898@gmail.com).

## License

MIT
