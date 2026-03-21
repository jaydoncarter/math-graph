/**
 * content/exponential_function.js
 *
 * Rich content for the Exponential Function node.
 * Activate by adding  hasRichContent: true  to its entry in conceptData.js.
 *
 * Block types demonstrated here:
 *   definition, section, latex, text, list, note (info + warning), embed, pdf
 */

export const blocks = [

  // ── Overview ─────────────────────────────────────────────────────────────
  {
    type: "definition",
    content:
      "An exponential function has a constant base raised to a variable exponent. "
      + "Unlike a power function — where the variable is the base — the variable "
      + "here lives in the exponent, giving the function its characteristic rapid growth "
      + "(or decay) behaviour.",
  },

  // ── General form ─────────────────────────────────────────────────────────
  { type: "section", title: "General Form" },
  {
    type: "latex",
    content: "f(x) = b^{x}, \\quad b > 0,\\; b \\neq 1",
  },
  {
    type: "list",
    ordered: false,
    items: [
      "If b > 1, the function grows without bound as x → +∞ (exponential growth).",
      "If 0 < b < 1, the function decays toward 0 as x → +∞ (exponential decay).",
      "b = 1 is excluded because 1^x = 1 is a constant, not an exponential.",
      "The domain is all real numbers; the range is (0, ∞) for any valid base.",
    ],
  },

  // ── The natural base ─────────────────────────────────────────────────────
  { type: "section", title: "The Natural Base e" },
  {
    type: "text",
    content:
      "Among all possible bases, e ≈ 2.718… is uniquely distinguished: it is the "
      + "only base for which the exponential function is its own derivative. "
      + "This self-referential property makes it indispensable in calculus and "
      + "differential equations.",
  },
  {
    type: "latex",
    content: "\\frac{d}{dx}\\, e^{x} = e^{x}",
  },
  {
    type: "text",
    content:
      "For a general base b, the chain rule introduces a logarithmic factor:",
  },
  {
    type: "latex",
    content: "\\frac{d}{dx}\\, b^{x} = b^{x} \\ln b",
  },

  // ── Key identities ───────────────────────────────────────────────────────
  { type: "section", title: "Key Identities" },
  {
    type: "list",
    ordered: false,
    items: [
      [
        { type: "text",  content: "Product rule:   " },
        { type: "latex", content: "\\quad b^{x+y} = b^x \\cdot b^y" },
      ],
      [
        { type: "text",  content: "Quotient rule: " },
        { type: "latex", content: "\\quad b^{x-y} = b^x / b^y" },
      ],
      [
        { type: "text",  content: "Power rule:    " },
        { type: "latex", content: "\\quad (b^x)^y = b^{xy}" },
      ],
      [
        { type: "text",  content: "Reciprocal:    " },
        { type: "latex", content: "\\quad b^{-x} = 1 / b^x" },
      ],
    ],
  },

  // ── Limit definition of e ────────────────────────────────────────────────
  { type: "section", title: "Limit Definition of e" },
  {
    type: "note",
    noteType: "proof",
    label: "Derivation",
    content:
      "Consider continuous compounding: invest $1 at 100% annual interest, "
      + "compounded n times per year. After one year you have (1 + 1/n)^n. "
      + "As compounding becomes continuous (n → ∞), this converges to e. "
      + "The same limit appears in the power-series definition "
      + "e = Σ (1/k!) = 1 + 1 + 1/2 + 1/6 + ···",
  },
  {
    type: "latex",
    content:
      "e = \\lim_{n \\to \\infty}\\left(1 + \\frac{1}{n}\\right)^{\\!n} "
      + "= \\sum_{k=0}^{\\infty} \\frac{1}{k!}",
  },

  // ── Common misconception ─────────────────────────────────────────────────
  {
    type: "note",
    noteType: "warning",
    content:
      "Do not confuse f(x) = x^n (a power function, polynomial degree n) "
      + "with f(x) = b^x (an exponential function). "
      + "The former grows polynomially; the latter eventually dominates any "
      + "polynomial — for any fixed n and b > 1, b^x / x^n → ∞ as x → ∞.",
  },

  // ── Interactive graph ─────────────────────────────────────────────────────
  // To embed your own Desmos graph:
  //   1. Go to desmos.com/calculator and build the graph.
  //   2. Click Share → Copy Link.  The URL ends in /calculator/XXXXXX.
  //   3. Replace the id below with that XXXXXX code.
  { type: "section", title: "Interactive Graph" },
  {
    type: "embed",
    embedType: "desmos",
    id: "e4pu417pxc",   // ← replace with your Desmos share ID
    height: 320,
    title: "Exponential function — adjust the base b with a slider",
  },

  // ── Reference ────────────────────────────────────────────────────────────
  // {
  //   type: "pdf",
  //   url: "/docs/exponential_functions.pdf",
  //   label: "Rudin — Principles of Mathematical Analysis (Ch. 8)",
  // },

];