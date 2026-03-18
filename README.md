# Math Concept Graph

An interactive, visual map of mathematical concepts and their dependencies, built with React, D3, and KaTeX.

**[Live Demo →](https://jaydoncarter.github.io/math-graph/)**

---

## Overview

Math Concept Graph renders a force-directed dependency graph where each node represents a mathematical concept. Clicking a node displays its definition and LaTeX formula, and highlights the concepts it depends on and supports. Designed to answer the question: *"Why does this work?"* in math.

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

| Library | Purpose |
|---|---|
| [React](https://react.dev) | UI components and state |
| [D3](https://d3js.org) | Force simulation, SVG rendering, zoom/pan |
| [KaTeX](https://katex.org) | LaTeX math typesetting |
| [Vite](https://vitejs.dev) | Build tool and dev server |
| [Git](https://git-scm.com/) | Version control and management |

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

All concepts live in the `conceptData` array in `conceptData.js`. Add a new entry in this shape:

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

## Deployment

```bash
npm run deploy
```

Builds the project and pushes to the `gh-pages` branch. Requires the `gh-pages` package and the `base` path set in `vite.config.js`:

```js
export default {
  base: "/math-graph/",
}
```

## Contact

Feel free to reach out through any of the methods on [my website](https://jaydoncarter.github.io/contact.html) or directly at [jaydoncarter898@gmail.com](jaydoncarter898@gmail.com).

## License

MIT
