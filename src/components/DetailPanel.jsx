import { conceptData } from "../conceptData";
import { KatexBlock } from "../utils/katex";

// ─── Inner content (shared between mobile and desktop layouts) ───────────────

function ConceptContent({ selected, katexReady, deps, dependents, selectNode, getTierColor }) {
  return (
    <>
      {/* Tier badge */}
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

      {/* Name */}
      <h2 style={{
        fontSize: "22px", fontWeight: 600, color: "#d4c5a9", margin: "0 0 12px",
        fontFamily: "'IM Fell English', Georgia, serif", lineHeight: 1.3,
      }}>
        {selected.name}
      </h2>

      {/* Definition */}
      <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#8a9aaa", margin: "0 0 24px" }}>
        {selected.definition}
      </p>

      {/* LaTeX block */}
      <div style={{
        background: "#0d1117", borderRadius: "8px", padding: "20px",
        border: "1px solid #1e2d3d", marginBottom: "24px", overflowX: "auto",
      }}>
        {katexReady
          ? <KatexBlock key={selected.id} latex={selected.latex} />
          : <code style={{ color: "#e2b96f", fontSize: "13px" }}>{selected.latex}</code>
        }
      </div>

      {/* Dependencies — concepts this one requires */}
      {deps.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
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

      {/* Dependents — concepts this one unlocks */}
      {dependents.length > 0 && (
        <div>
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

// Small clickable concept row used in both "Requires" and "Unlocks" lists
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
        e.currentTarget.style.background = "#161f2b";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e2d3d";
        e.currentTarget.style.background = "transparent";
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

// ─── Exported panel ──────────────────────────────────────────────────────────

/**
 * Renders the concept detail panel.
 * - On desktop: a side drawer that slides in from the right.
 * - On mobile:  a bottom sheet that slides up from the bottom.
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
    : [];

  const dependents = selected
    ? conceptData.filter((c) => (c.depends_on ?? []).includes(selected.id))
    : [];

  const onClose = () => { setSelected(null); setHighlightId(null); };

  const sharedContentProps = {
    selected, katexReady, deps, dependents, selectNode, getTierColor,
  };

  // ── Mobile: bottom sheet ─────────────────────────────────────────────
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

  // ── Desktop: side drawer ─────────────────────────────────────────────
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