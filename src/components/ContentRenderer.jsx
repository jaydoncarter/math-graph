import { useRef, useEffect } from "react";
import { KatexBlock } from "../utils/katex";

/**
 * components/ContentRenderer.jsx
 *
 * Renders the visual elements of the graph.
 */

// ─── Block registry ──────────────────────────────────────────────────────────
//
// Add a new case here whenever you introduce a new block type.
// Each block object must have at minimum: { type: string, ...rest }
//
// Supported types:
//   definition  – primary descriptive paragraph (slightly larger, full colour)
//   text        – secondary prose paragraph (muted colour)
//   section     – divider with a small uppercase label (for sub-headings)
//   latex       – KaTeX display block inside a dark code card
//   latexInline – single line of KaTeX without the card wrapper
//   svg         – raw SVG string injected into a centred container
//   img         – image from a URL
//   embed       – iframe embed (embedType: 'desmos' | 'geogebra' | 'url')
//   note        – callout box (noteType: 'info' | 'warning' | 'proof')
//   list        – bulleted or numbered list  (ordered: bool, items: MixedContent[])
//   pdf         – styled PDF download / view link button
//
// ─── Mixed content ────────────────────────────────────────────────────────────
//
// The `content` field of definition, text, and note blocks, and each item in a
// list, can be either:
//
//   A plain string (backwards-compatible):
//     content: "The domain is all real numbers."
//
//   An array of segments for interleaved text and inline KaTeX:
//     content: [
//       { type: "text",  content: "Product rule: " },
//       { type: "latex", content: "b^{x+y} = b^x \\cdot b^y" },
//     ]
//
// Use the array form whenever a sentence naturally contains a formula.
// Display-mode LaTeX (full centred equations) still uses the "latex" block type.

// ─── Colour constants (matches the rest of the app) ─────────────────────────
const C = {
  bg:        "#0d1117",
  surface:   "#111820",
  border:    "#1e2d3d",
  borderHov: "#e2b96f44",
  textPrim:  "#d4c5a9",
  textMut:   "#8a9aaa",
  textDim:   "#3a4a5a",
  accent:    "#e2b96f",
  hoverBg:   "#161f2b",
  proof:     "#1a2535",
  proofBdr:  "#2a4060",
  warn:      "#1e1a10",
  warnBdr:   "#5a4510",
  warnText:  "#c49440",
  info:      "#0f1e2e",
  infoBdr:   "#1e3a5a",
  infoText:  "#6a9aba",
};

// ─── Root renderer ───────────────────────────────────────────────────────────

/**
 * Renders an ordered array of typed content blocks.
 *
 * @param {object[]} blocks    – array of block descriptor objects
 * @param {boolean}  katexReady – whether window.katex has loaded
 */
export function ContentRenderer({ blocks, katexReady }) {
  if (!blocks?.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} katexReady={katexReady} />
      ))}
    </div>
  );
}

// ─── Individual block dispatcher ─────────────────────────────────────────────

function Block({ block, katexReady }) {
  switch (block.type) {

    // ── Prose ──────────────────────────────────────────────────────────────

    case "definition":
      return (
        <p style={{
          fontSize: "15px", lineHeight: 1.75,
          color: C.textMut, margin: 0,
        }}>
          <MixedContent content={block.content} katexReady={katexReady} />
        </p>
      );

    case "text":
      return (
        <p style={{
          fontSize: "14px", lineHeight: 1.7,
          color: C.textDim, margin: 0,
        }}>
          <MixedContent content={block.content} katexReady={katexReady} />
        </p>
      );

    // ── Section divider ────────────────────────────────────────────────────

    case "section":
      return (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginTop: "6px",
        }}>
          <div style={{
            fontSize: "10px", letterSpacing: "2px", color: C.textDim,
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            {block.title}
          </div>
          <div style={{ flex: 1, height: "1px", background: C.border }} />
        </div>
      );

    // ── LaTeX ──────────────────────────────────────────────────────────────

    case "latex":
      return (
        <div style={{
          background: C.bg, borderRadius: "8px", padding: "18px 20px",
          border: `1px solid ${C.border}`, overflowX: "auto",
        }}>
          {katexReady
            ? <KatexBlock latex={block.content} />
            : <code style={{ color: C.accent, fontSize: "13px", fontFamily: "monospace" }}>
                {block.content}
              </code>
          }
        </div>
      );

    case "latexInline":
      // Renders KaTeX without the dark card — for small expressions mid-paragraph.
      return (
        <InlineKatex latex={block.content} katexReady={katexReady} />
      );

    // ── Visual ─────────────────────────────────────────────────────────────

    case "svg":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: block.content }}
          style={{
            overflowX: "auto", textAlign: "center",
            padding: "12px 0",
          }}
        />
      );

    case "img":
      return (
        <img
          src={block.url}
          alt={block.alt ?? ""}
          style={{
            maxWidth: "100%", borderRadius: "6px",
            border: `1px solid ${C.border}`,
            display: "block", margin: "0 auto",
          }}
        />
      );

    // ── Embeds ─────────────────────────────────────────────────────────────

    case "embed": {
      const h = block.height ?? 300;

      // Desmos: pass a public graph ID from the Desmos share URL
      if (block.embedType === "desmos") {
        return (
          <iframe
            src={`https://www.desmos.com/calculator/${block.id}?embed`}
            style={iframeStyle(h)}
            title={block.title ?? "Desmos graph"}
            allowFullScreen
          />
        );
      }

      // GeoGebra: pass the material ID from the GeoGebra share URL
      if (block.embedType === "geogebra") {
        return (
          <iframe
            src={`https://www.geogebra.org/material/iframe/id/${block.id}/width/600/height/${h}/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/true/ctl/false`}
            style={iframeStyle(h)}
            title={block.title ?? "GeoGebra applet"}
            allowFullScreen
          />
        );
      }

      // Generic URL embed (use sparingly — many sites block iframes)
      if (block.embedType === "url") {
        return (
          <iframe
            src={block.url}
            style={iframeStyle(h)}
            title={block.title ?? "Embedded content"}
            allowFullScreen
          />
        );
      }

      return null;
    }

    // ── Callout / note ─────────────────────────────────────────────────────

    case "note": {
      const noteType = block.noteType ?? "info";
      const styles = {
        proof:   { bg: C.proof,  border: C.proofBdr,  color: C.textMut,  label: "Proof"   },
        info:    { bg: C.info,   border: C.infoBdr,   color: C.infoText, label: "Note"    },
        warning: { bg: C.warn,   border: C.warnBdr,   color: C.warnText, label: "Warning" },
      }[noteType] ?? { bg: C.info, border: C.infoBdr, color: C.infoText, label: "Note" };

      return (
        <div style={{
          background: styles.bg, border: `1px solid ${styles.border}`,
          borderRadius: "8px", padding: "14px 16px",
        }}>
          {block.label !== false && (
            <div style={{
              fontSize: "10px", letterSpacing: "2px",
              color: styles.color, textTransform: "uppercase",
              marginBottom: "8px", fontWeight: 600,
            }}>
              {block.label ?? styles.label}
            </div>
          )}
          <p style={{
            fontSize: "13.5px", lineHeight: 1.7,
            color: C.textMut, margin: 0,
          }}>
            <MixedContent content={block.content} katexReady={katexReady} />
          </p>
        </div>
      );
    }

    // ── List ───────────────────────────────────────────────────────────────

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag style={{
          margin: 0, paddingLeft: "20px",
          display: "flex", flexDirection: "column", gap: "6px",
        }}>
          {(block.items ?? []).map((item, i) => (
            <li key={i} style={{
              fontSize: "13.5px", lineHeight: 1.65,
              color: C.textMut,
            }}>
              <MixedContent content={item} katexReady={katexReady} />
            </li>
          ))}
        </Tag>
      );
    }

    // ── PDF link ───────────────────────────────────────────────────────────

    case "pdf":
      return (
        <PdfButton url={block.url} label={block.label} />
      );

    // ── Unknown block ──────────────────────────────────────────────────────

    default:
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[ContentRenderer] Unknown block type: "${block.type}"`);
      }
      return null;
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Renders either a plain string or an array of {type, content} segments.
 * Use this wherever a prose field might contain interleaved inline LaTeX.
 *
 *   Plain string:  "The domain is all real numbers."
 *   Mixed array:   [
 *     { type: "text",  content: "Product rule: " },
 *     { type: "latex", content: "b^{x+y} = b^x \\cdot b^y" },
 *   ]
 */
function MixedContent({ content, katexReady }) {
  // Plain string — render as-is (backwards-compatible)
  if (typeof content === "string") return <>{content}</>;

  // Array of segments
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((seg, i) => {
          if (seg.type === "latex") {
            return (
              <InlineKatex key={i} latex={seg.content} katexReady={katexReady} />
            );
          }
          // "text" segment or any unknown type — render as a plain span
          return <span key={i}>{seg.content}</span>;
        })}
      </>
    );
  }

  return null;
}

/** Inline KaTeX (no card wrapper). */
function InlineKatex({ latex, katexReady }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.katex) return;
    try {
      window.katex.render(latex, ref.current, {
        displayMode: false,
        throwOnError: false,
      });
    } catch (_) {}
  }, [latex]);

  if (!katexReady) {
    return <code style={{ color: C.accent, fontSize: "13px" }}>{latex}</code>;
  }
  return (
    <span
      ref={ref}
      style={{ color: C.textPrim, fontSize: "14px" }}
    />
  );
}

/** Styled PDF / reference link button. */
function PdfButton({ url, label }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "9px 16px", borderRadius: "6px", alignSelf: "flex-start",
        border: `1px solid ${C.border}`, color: C.accent,
        textDecoration: "none", fontSize: "13px",
        fontFamily: "'Crimson Pro', Georgia, serif",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderHov;
        e.currentTarget.style.background  = C.hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.background  = "transparent";
      }}
    >
      <PdfIcon />
      {label ?? "Reference PDF"}
    </a>
  );
}

function PdfIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function iframeStyle(height) {
  return {
    width: "100%", height,
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    display: "block",
    background: C.bg,
  };
}