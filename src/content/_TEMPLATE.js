/**
 * content/_TEMPLATE.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Copy this file to content/{your_concept_id}.js and fill it in.
 *
 * The exported `blocks` array is rendered top-to-bottom by ContentRenderer.
 * Every block has a required `type` field; all other fields depend on the type.
 *
 * To activate rich content for a node, add  hasRichContent: true  to its entry
 * in conceptData.js. The panel will automatically load this file when that node
 * is selected, and fall back to the simple layout if the file is missing.
 *
 * ─── Block type reference ────────────────────────────────────────────────────
 *
 *  definition   Primary description paragraph (slightly brighter text).
 *               { type, content: string }
 *
 *  text         Secondary prose (dimmer text). Good for elaboration.
 *               { type, content: string }
 *
 *  section      Horizontal rule with an uppercase label. Use to separate
 *               logical sections within the panel.
 *               { type, title: string }
 *
 *  latex        KaTeX display-mode block inside a dark code card.
 *               { type, content: string }   (raw LaTeX, no $$ delimiters)
 *
 *  latexInline  KaTeX rendered inline without a card wrapper.
 *               { type, content: string }
 *
 *  note         Callout box. noteType controls colour scheme.
 *               { type, noteType: 'info'|'warning'|'proof',
 *                 content: string, label?: string }
 *               Set label: false to hide the label row entirely.
 *
 *  list         Bulleted or numbered list.
 *               { type, ordered?: boolean, items: MixedContent[] }
 *               Each item is either a plain string or a mixed-content array:
 *                 Plain:   "The domain is all real numbers."
 *                 Mixed:   [
 *                            { type: "text",  content: "Product rule: " },
 *                            { type: "latex", content: "b^{x+y} = b^x \\cdot b^y" },
 *                          ]
 *               definition, text, and note blocks accept the same mixed format
 *               for their `content` field.
 *
 *  svg          Raw SVG markup injected into a centred div. Useful for
 *               hand-crafted commutative diagrams, small figures, etc.
 *               { type, content: string }   (the full <svg>…</svg> string)
 *
 *  img          Image from a URL (hosted locally or externally).
 *               { type, url: string, alt?: string }
 *
 *  embed        iframe embed for interactive graphs and applets.
 *               embedType 'desmos'    – { type, embedType, id, height?, title? }
 *                 `id` is the hash in the Desmos share URL:
 *                   https://www.desmos.com/calculator/XXXXXX  →  id: "XXXXXX"
 *               embedType 'geogebra' – { type, embedType, id, height?, title? }
 *                 `id` is the material id from the GeoGebra share URL.
 *               embedType 'url'      – { type, embedType, url, height?, title? }
 *                 Generic URL (note: many sites block cross-origin iframes).
 *
 *  pdf          Styled link button that opens a PDF in a new tab.
 *               { type, url: string, label?: string }
 */

export const blocks = [

  // ── Definition / overview ────────────────────────────────────────────────
  {
    type: "definition",
    content:
      "Replace this with a clear, self-contained description of the concept. "
      + "This is the first thing the reader sees after the title.",
  },

  // ── Primary formula ──────────────────────────────────────────────────────
  {
    type: "latex",
    content: "f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi)\\, e^{2\\pi i x \\xi}\\, d\\xi",
  },

  // ── Section divider ──────────────────────────────────────────────────────
  { type: "section", title: "Key Properties" },

  // ── Secondary prose ──────────────────────────────────────────────────────
  {
    type: "text",
    content:
      "Use 'text' blocks for supporting detail that isn't the primary definition.",
  },

  // ── Bulleted list ────────────────────────────────────────────────────────
  {
    type: "list",
    ordered: false,
    items: [
      "First property or fact.",
      "Second property or fact.",
      "Third property or fact.",
    ],
  },

  // ── Proof note ───────────────────────────────────────────────────────────
  { type: "section", title: "Proof Sketch" },
  {
    type: "note",
    noteType: "proof",
    content:
      "Sketch the proof idea here. For a full derivation you can follow up "
      + "with latex blocks below.",
  },

  // ── Additional LaTeX ─────────────────────────────────────────────────────
  { type: "latex", content: "\\|f\\|_{L^2} = \\|\\hat{f}\\|_{L^2}" },

  // ── Warning callout ──────────────────────────────────────────────────────
  {
    type: "note",
    noteType: "warning",
    content:
      "Flag a common misconception or edge case here.",
  },

  // ── Interactive graph (Desmos) ───────────────────────────────────────────
  // Create a graph at desmos.com/calculator, click Share → Copy Link.
  // The ID is the alphanumeric code at the end of the URL.
  // { type: "embed", embedType: "desmos", id: "REPLACE_WITH_GRAPH_ID", height: 300 },

  // ── Interactive applet (GeoGebra) ────────────────────────────────────────
  // { type: "embed", embedType: "geogebra", id: "REPLACE_WITH_MATERIAL_ID", height: 300 },

  // ── Reference PDF ────────────────────────────────────────────────────────
  // { type: "pdf", url: "/docs/your-file.pdf", label: "Author — Title" },

];