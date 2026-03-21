/**
 * content/fourier_transform.js
 *
 * Rich content for the Fourier Transform node.
 * Activate by adding  hasRichContent: true  to its entry in conceptData.js.
 *
 * This file demonstrates: definition, multiple latex blocks, section
 * dividers, a note callout, a list, a Desmos embed, and a PDF link.
 * Delete or comment out any blocks you don't need.
 */

export const blocks = [

  // ── Overview ─────────────────────────────────────────────────────────────
  {
    type: "definition",
    content:
      "The Fourier Transform decomposes a function of time (or space) into "
      + "the frequencies that make it up — much like a prism splits white "
      + "light into its constituent colours. The result F(ω) encodes the "
      + "amplitude and phase of each frequency component present in f(t).",
  },

  // ── Definition ───────────────────────────────────────────────────────────
  { type: "section", title: "Definition" },
  {
    type: "latex",
    content:
      "\\hat{f}(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-2\\pi i \\omega t}\\, dt",
  },

  // ── Inverse transform ────────────────────────────────────────────────────
  { type: "section", title: "Inverse Transform" },
  {
    type: "text",
    content:
      "The original function can be perfectly reconstructed from its "
      + "transform — no information is lost in either direction.",
  },
  {
    type: "latex",
    content:
      "f(t) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\omega)\\, e^{2\\pi i \\omega t}\\, d\\omega",
  },

  // ── Key properties ───────────────────────────────────────────────────────
  { type: "section", title: "Key Properties" },
  {
    type: "list",
    ordered: false,
    items: [
      "Linearity: the transform of a sum is the sum of the transforms.",
      "Time-shift: shifting f(t) by t₀ multiplies F(ω) by e^{−2πiωt₀}.",
      "Frequency-shift: multiplying f(t) by e^{2πiω₀t} shifts F(ω) by ω₀.",
      "Parseval's theorem: total energy is preserved.",
    ],
  },

  // ── Parseval / Plancherel ────────────────────────────────────────────────
  {
    type: "latex",
    content: "\\int_{-\\infty}^{\\infty} |f(t)|^2\\, dt = \\int_{-\\infty}^{\\infty} |\\hat{f}(\\omega)|^2\\, d\\omega",
  },

  // ── Convolution theorem ──────────────────────────────────────────────────
  { type: "section", title: "Convolution Theorem" },
  {
    type: "text",
    content:
      "Convolution in the time domain corresponds to pointwise multiplication "
      + "in the frequency domain. This is the key identity behind fast filtering "
      + "and the FFT algorithm.",
  },
  {
    type: "latex",
    content: "\\mathcal{F}\\{f * g\\}(\\omega) = \\hat{f}(\\omega) \\cdot \\hat{g}(\\omega)",
  },

  // ── Proof sketch ─────────────────────────────────────────────────────────
  { type: "section", title: "Proof of Convolution Theorem" },
  {
    type: "note",
    noteType: "proof",
    content:
      "Expand (f * g)(t) = ∫ f(τ)g(t − τ) dτ, substitute into the Fourier "
      + "integral, and exchange the order of integration (Fubini). The inner "
      + "integral becomes ĝ(ω) after the substitution u = t − τ, leaving "
      + "∫ f(τ) e^{−2πiωτ} dτ = f̂(ω) on the outside.",
  },

  // ── Caution ──────────────────────────────────────────────────────────────
  {
    type: "note",
    noteType: "warning",
    content:
      "Several normalisation conventions exist (1, 1/√2π, 1/2π split between "
      + "the forward and inverse transforms). Always check which convention a "
      + "source uses before combining results.",
  },

  // ── Interactive Desmos graph ──────────────────────────────────────────────
  // Replace the id with the hash from your own Desmos share URL.
  // Example public graph showing a square-wave Fourier approximation:
  // {
  //   type: "embed",
  //   embedType: "desmos",
  //   id: "YOUR_DESMOS_GRAPH_ID",
  //   height: 320,
  //   title: "Fourier series approximation",
  // },

  // ── Reference PDF ────────────────────────────────────────────────────────
  // {
  //   type: "pdf",
  //   url: "/docs/stein_shakarchi_fourier.pdf",
  //   label: "Stein & Shakarchi — Fourier Analysis (Ch. 1–2)",
  // },

];
