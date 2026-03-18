import { useState, useEffect, useRef } from "react";

import { loadKatex }              from "./utils/katex.jsx";
import { getTierColor, TIER_COLORS } from "./utils/colors";
import { useD3Simulation }        from "./hooks/useD3Simulation";
import { Sidebar }                from "./components/Sidebar";
import { DetailPanel }            from "./components/DetailPanel";

/**
 * Root component. Owns only the shared cross-component state:
 *   selected, highlightId, katexReady, isMobile, sidebarOpen
 *
 * Everything else lives in the hook or the child components.
 */
export default function MathConceptGraph() {
  // ── Refs attached to DOM elements ─────────────────────────────────────
  // These are defined here because the SVG and wrapper elements are rendered
  // in this component's JSX. They are passed into the D3 hook.
  const svgRef          = useRef(null);
  const graphWrapperRef = useRef(null);

  // ── Shared state ──────────────────────────────────────────────────────
  const [selected,     setSelected]     = useState(null);
  const [highlightId,  setHighlightId]  = useState(null);
  const [katexReady,   setKatexReady]   = useState(false);
  const [isMobile,     setIsMobile]     = useState(() => window.innerWidth < 768);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  // ── Mobile breakpoint listener ────────────────────────────────────────
  useEffect(() => {
    const mq      = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── One-time asset loading ────────────────────────────────────────────
  useEffect(() => {
    loadKatex().then(() => setKatexReady(true));

    const link  = document.createElement("link");
    link.rel    = "stylesheet";
    link.href   =
      "https://fonts.googleapis.com/css2?family=IM+Fell+English&family=Crimson+Pro:wght@300;400;600&display=swap";
    document.head.appendChild(link);
  }, []);

  // ── D3 simulation ─────────────────────────────────────────────────────
  // The hook owns all D3 refs, the ResizeObserver, the simulation effect,
  // and the highlight effect. It receives shared state it needs to read or
  // write, and returns selectNode which is needed by both child components.
  const { selectNode } = useD3Simulation({
    svgRef,
    graphWrapperRef,
    isMobile,
    highlightId,
    setSelected,
    setHighlightId,
  });

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#0d1117",
      fontFamily: "'Crimson Pro', Georgia, serif",
      overflow: "hidden",
      flexDirection: isMobile ? "column" : "row",
    }}>

      {/* ── Mobile: hamburger button ──────────────────────────────────── */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            position: "absolute", top: "12px", left: "12px", zIndex: 100,
            background: "#111820", border: "1px solid #1e2d3d", borderRadius: "8px",
            color: "#d4c5a9", cursor: "pointer", padding: "8px 10px",
            display: "flex", flexDirection: "column", gap: "4px", lineHeight: 0,
          }}
          aria-label="Toggle concept list"
        >
          <span style={{ display: "block", width: "18px", height: "2px", background: "#d4c5a9", borderRadius: "1px" }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "#d4c5a9", borderRadius: "1px" }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "#d4c5a9", borderRadius: "1px" }} />
        </button>
      )}

      {/* ── Mobile: overlay backdrop ──────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)" }}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <Sidebar
        highlightId={highlightId}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectNode={selectNode}
        getTierColor={getTierColor}
        TIER_COLORS={TIER_COLORS}
      />

      {/* ── Main graph area ───────────────────────────────────────────── */}
      <div style={{
        flex: 1, position: "relative",
        display: "flex", flexDirection: "column",
        minWidth: 0, minHeight: 0,
      }}>
        {/* Wrapper div — ResizeObserver in useD3Simulation measures this */}
        <div
          ref={graphWrapperRef}
          style={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative" }}
        >
          <svg
            ref={svgRef}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", display: "block",
              touchAction: "none", // lets D3 capture touch drag/pinch without page scroll
            }}
          />
        </div>

        {/* ── Detail panel (side drawer / bottom sheet) ─────────────── */}
        <DetailPanel
          selected={selected}
          setSelected={setSelected}
          setHighlightId={setHighlightId}
          katexReady={katexReady}
          isMobile={isMobile}
          selectNode={selectNode}
          getTierColor={getTierColor}
        />

        {/* ── Interaction hint (shown when nothing is selected) ─────── */}
        {!selected && (
          <div style={{
            position: "absolute", bottom: "24px", left: "50%",
            transform: "translateX(-50%)",
            color: "#2a3a4a", fontSize: "13px", letterSpacing: "1px",
            pointerEvents: "none",
            fontFamily: "'Crimson Pro', Georgia, serif",
            whiteSpace: "nowrap",
          }}>
            {isMobile
              ? "tap a node · drag to explore · pinch to zoom"
              : "click a node · drag to explore · scroll to zoom"}
          </div>
        )}
      </div>
    </div>
  );
}
