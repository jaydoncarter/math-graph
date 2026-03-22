import { useState, useEffect } from "react";

import { conceptData }      from "../conceptData";
import { KatexBlock }       from "../utils/katex";
import { ContentRenderer }  from "./ContentRenderer";

/**
 * components/DetailPanel.jsx
 *
 * The description sidebar for a selected node. Displayed on the right side of 
 * the screen on desktop, and on the bottom on mobile.
 */

// ─── Inner content ────────────────────────────────────────────────────────────
//
// Owns the dynamic import of per-node content modules.
// The panel shell (tier badge, title, deps/unlocks, close button) is always
// rendered by the parent layouts below — this component only controls the body.

function ConceptContent({
  selected, katexReady, deps, dependents, selectNode, getTierColor,
}) {
  // "idle" → "loading" → "ready" | "fallback"
  const [loadState,  setLoadState]  = useState("idle");
  const [richBlocks, setRichBlocks] = useState(null);

  // ── Dynamic import ─────────────────────────────────────────────────────
  // Fires whenever the selected node changes.
  // If the node has hasRichContent: true we try to import its module.
  // Any failure (file not found, parse error) silently falls back to the
  // default simple layout so a missing file never breaks the panel.
  useEffect(() => {
    if (!selected) return;

    if (!selected.hasRichContent) {
      setRichBlocks(null);
      setLoadState("fallback");
      return;
    }

    setLoadState("loading");
    setRichBlocks(null);

    import(`../content/${selected.id}.js`)
      .then((mod) => {
        if (Array.isArray(mod.blocks) && mod.blocks.length > 0) {
          setRichBlocks(mod.blocks);
          setLoadState("ready");
        } else {
          // Module exists but exported nothing usable
          setLoadState("fallback");
        }
      })
      .catch(() => {
        // File doesn't exist yet — degrade gracefully
        setLoadState("fallback");
      });
  }, [selected?.id, selected?.hasRichContent]);

  if (!selected) return null;

  return (
    <>
      {/* ── Tier badge ──────────────────────────────────────────────── */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "3px 10px", borderRadius: "20px", marginBottom: "16px",
        border: `1px solid ${getTierColor(selected.tier)}44`,
        background: `${getTierColor(selected.tier)}11`,
      }}>
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: getTierColor(selected.tier),
        }} />
        <span style={{
          fontSize: "11px", color: getTierColor(selected.tier),
          letterSpacing: "1.5px", textTransform: "uppercase",
        }}>
          Tier {selected.tier}
        </span>
      </div>

      {selected.field && (
         <div style={{
           display: "inline-flex", alignItems: "center", gap: "6px",
           padding: "3px 10px", borderRadius: "20px", marginBottom: "16px",
           marginLeft: "8px",
           border: "1px solid #d4c5a955",
           background: "#d4c5a918",
         }}>
           <span style={{
             fontSize: "11px", color: "#d4c5a9",
             letterSpacing: "1.5px", textTransform: "uppercase",
           }}>
            {selected.field.replace(/_/g, " ")}
          </span>
         </div>
     )}

      {/* ── Name ────────────────────────────────────────────────────── */}
      <h2 style={{
        fontSize: "22px", fontWeight: 600, color: "#d4c5a9", margin: "0 0 20px",
        fontFamily: "'IM Fell English', Georgia, serif", lineHeight: 1.3,
      }}>
        {selected.name}
      </h2>

      {/* ── Body: three possible states ─────────────────────────────── */}

      {/* 1. Loading spinner / placeholder */}
      {loadState === "loading" && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "16px 0", color: "#3a4a5a", fontSize: "13px",
        }}>
          <LoadingDots />
          Loading content…
        </div>
      )}

      {/* 2. Rich content from the per-node module */}
      {loadState === "ready" && richBlocks && (
        <ContentRenderer blocks={richBlocks} katexReady={katexReady} />
      )}

      {/* 3. Simple fallback (default layout, same as original DetailPanel) */}
      {(loadState === "fallback" || loadState === "idle") && (
        <>
          <p style={{
            fontSize: "15px", lineHeight: 1.7, color: "#8a9aaa", margin: "0 0 24px",
          }}>
            {selected.definition}
          </p>
          <div style={{
            background: "#0d1117", borderRadius: "8px", padding: "20px",
            border: "1px solid #1e2d3d", marginBottom: "24px", overflowX: "auto",
          }}>
            {katexReady
              ? <KatexBlock key={selected.id} latex={selected.latex} />
              : <code style={{ color: "#e2b96f", fontSize: "13px" }}>{selected.latex}</code>
            }
          </div>
        </>
      )}

      {/* ── Requires ────────────────────────────────────────────────── */}
      {deps.length > 0 && (
        <div style={{ marginTop: "28px", marginBottom: "20px" }}>
          <div style={{
            fontSize: "10px", letterSpacing: "2px", color: "#3a4a5a",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            Requires
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {deps.map((d) => (
              <ConceptLink key={d.id} concept={d} selectNode={selectNode} getTierColor={getTierColor} />
            ))}
          </div>
        </div>
      )}

      {/* ── Unlocks ─────────────────────────────────────────────────── */}
      {dependents.length > 0 && (
        <div style={{ marginTop: deps.length > 0 ? 0 : "28px" }}>
          <div style={{
            fontSize: "10px", letterSpacing: "2px", color: "#3a4a5a",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            Unlocks
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {dependents.map((d) => (
              <ConceptLink key={d.id} concept={d} selectNode={selectNode} getTierColor={getTierColor} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Concept link row ─────────────────────────────────────────────────────────

function ConceptLink({ concept, selectNode, getTierColor }) {
  return (
    <div
      onClick={() => selectNode(concept.id)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "8px 12px", borderRadius: "6px", cursor: "pointer",
        border: "1px solid #1e2d3d", transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = getTierColor(concept.tier) + "66";
        e.currentTarget.style.background  = "#161f2b";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e2d3d";
        e.currentTarget.style.background  = "transparent";
      }}
    >
      <div style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: getTierColor(concept.tier), flexShrink: 0,
      }} />
      <span style={{ fontSize: "13px", color: "#8a9aaa" }}>{concept.name}</span>
    </div>
  );
}

// ─── Loading indicator ────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "3px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "4px", height: "4px", borderRadius: "50%",
            background: "#3a4a5a", display: "inline-block",
            animation: "detailPanelPulse 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes detailPanelPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </span>
  );
}

// ─── Exported panel ───────────────────────────────────────────────────────────

/**
 * Renders the concept detail panel.
 * - On desktop: a side drawer that slides in from the right.
 * - On mobile:  a bottom sheet that slides up from the bottom.
 *
 * Unchanged from the original except that ConceptContent now dynamically
 * imports per-node content modules when selected.hasRichContent is true.
 *
 * @param {object}   props
 * @param {object}   props.selected        – selected concept object (or null)
 * @param {Function} props.setSelected     – setter to clear selection
 * @param {Function} props.setHighlightId  – setter to clear highlight
 * @param {boolean}  props.katexReady      – whether KaTeX has finished loading
 * @param {boolean}  props.isMobile
 * @param {Function} props.selectNode      – navigate to another concept by id
 * @param {Function} props.getTierColor
 */
export function DetailPanel({
  selected,
  setSelected,
  setHighlightId,
  katexReady,
  isMobile,
  selectNode,
  getTierColor,
}) {
  // Derive deps and dependents here so ConceptContent receives plain arrays.
  const deps = selected
    ? (selected.depends_on ?? [])
        .map((id) => conceptData.find((c) => c.id === id))
        .filter(Boolean)
        .sort((a, b) => a.tier - b.tier)
    : [];

  const dependents = selected
    ? conceptData.filter((c) => (c.depends_on ?? []).includes(selected.id))
      .sort((a, b) => a.tier - b.tier)
    : [];

  const onClose = () => { setSelected(null); setHighlightId(null); };

  const sharedContentProps = {
    selected, katexReady, deps, dependents, selectNode, getTierColor,
  };

  // ── Mobile: bottom sheet ───────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        height: selected ? "55vh" : "0px",
        background: "#111820", borderTop: "1px solid #1e2d3d",
        transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        zIndex: 30, borderRadius: "16px 16px 0 0",
      }}>
        {selected && (
          <>
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#2a3a4a" }} />
            </div>
            <div style={{ padding: "0 24px 24px", overflowY: "auto", flex: 1 }}>
              <button
                onClick={onClose}
                style={{
                  position: "absolute", top: "12px", right: "16px",
                  background: "none", border: "none", color: "#3a4a5a",
                  cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "4px",
                }}
              >
                ×
              </button>
              <ConceptContent {...sharedContentProps} />
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Desktop: side drawer ───────────────────────────────────────────────
  return (
    <div style={{
      position: "absolute", right: 0, top: 0, bottom: 0,
      width: selected ? "340px" : "0px",
      background: "#111820", borderLeft: "1px solid #1e2d3d",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {selected && (
        <div style={{ padding: "28px 24px", overflowY: "auto", flex: 1 }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "none", border: "none", color: "#3a4a5a",
              cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: "4px",
            }}
          >
            ×
          </button>
          <ConceptContent {...sharedContentProps} />
        </div>
      )}
    </div>
  );
}
