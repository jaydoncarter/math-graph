import { useState, useEffect, useRef } from "react";
import { conceptData } from "../conceptData";

/**
 * components/Sidebar.jsx
 * 
 * The left-side panel containing:
 *   - App header ("Mathematical Concepts")
 *   - Concept search box with live dropdown results
 *   - Scrollable concept list (sorted by tier)
 *   - Depth colour legend
 *
 * On mobile it becomes a slide-in drawer controlled by sidebarOpen/setSidebarOpen.
 *
 * @param {object}   props
 * @param {string}   props.highlightId     – id of the currently selected node
 * @param {boolean}  props.isMobile
 * @param {boolean}  props.sidebarOpen     – mobile-only: whether the drawer is open
 * @param {Function} props.setSidebarOpen  – mobile-only: toggle the drawer
 * @param {Function} props.selectNode      – navigate to a concept by id
 * @param {Function} props.getTierColor
 * @param {string[]} props.TIER_COLORS     – palette array (used for the legend)
 */
export function Sidebar({
  highlightId,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  selectNode,
  getTierColor,
  TIER_COLORS,
}) {
  const [search, setSearch]               = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeIndex, setActiveIndex]     = useState(0);
  const sidebarListRef                    = useRef(null);

  // ── Search ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const q = search.toLowerCase();
    setSearchResults(conceptData.filter((c) => c.name.toLowerCase().includes(q)));
    setActiveIndex(0);
  }, [search]);

  // ── Auto-scroll the concept list to the selected item ─────────────────
  useEffect(() => {
    if (!highlightId || !sidebarListRef.current) return;
    const el = sidebarListRef.current.querySelector(`[data-id="${highlightId}"]`);
    if (!el) return;
    const container = sidebarListRef.current;
    const scrollTarget =
      el.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2;
    container.scrollTo({ top: scrollTarget, behavior: "smooth" });
  }, [highlightId]);

  // Shared handler: select a concept, clear search, close mobile drawer
  function handleSelect(id) {
    selectNode(id);
    setSearch("");
    setSearchResults([]);
    if (isMobile) setSidebarOpen(false);
  }

  return (
    <div style={{
      ...(isMobile
        ? {
            position: "fixed", left: 0, top: 0, bottom: 0,
            width: "80vw", maxWidth: "320px",
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 50,
          }
        : {
            width: "320px", minWidth: "280px",
          }),
      background: "#111820",
      borderRight: "1px solid #1e2d3d",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: "24px 20px 16px", borderBottom: "1px solid #1e2d3d",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontSize: "11px", letterSpacing: "3px", color: "#5a6a7a",
            textTransform: "uppercase", marginBottom: "4px",
          }}>
            Knowledge Atlas
          </div>
          <div style={{
            fontSize: "22px", fontWeight: 600, color: "#d4c5a9", lineHeight: 1.2,
            fontFamily: "'IM Fell English', Georgia, serif",
          }}>
            Mathematical Concepts
          </div>
        </div>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "none", border: "none", color: "#5a6a7a",
              cursor: "pointer", fontSize: "22px", lineHeight: 1,
              padding: "4px", marginTop: "2px",
            }}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid #1e2d3d", position: "relative",
      }}>
        <div style={{ position: "relative" }}>
          {/* Search icon */}
          <svg
            style={{
              position: "absolute", left: "12px", top: "50%",
              transform: "translateY(-50%)", opacity: 0.4,
            }}
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="#d4c5a9" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchResults.length > 0) {
                handleSelect(searchResults[activeIndex].id);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, searchResults.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Escape") {
                setSearch("");
                setSearchResults([]);
              }
            }}
            placeholder="Search concepts…"
            style={{
              width: "100%", padding: "9px 12px 9px 34px", boxSizing: "border-box",
              background: "#0d1117", border: "1px solid #1e2d3d", borderRadius: "6px",
              color: "#d4c5a9", fontSize: "14px",
              fontFamily: "'Crimson Pro', Georgia, serif",
              outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={(e)  => { e.target.style.borderColor = "#e2b96f44"; }}
            onBlur={(e)   => { e.target.style.borderColor = "#1e2d3d"; }}
          />
        </div>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div style={{
            position: "absolute", left: "20px", right: "20px", top: "calc(100% - 4px)",
            background: "#111820", border: "1px solid #1e2d3d", borderRadius: "6px",
            zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}>
            {searchResults.map((r, index) => (
              <div
                key={r.id}
                onClick={() => handleSelect(r.id)}
                style={{
                  padding: "9px 14px", cursor: "pointer", color: "#d4c5a9",
                  fontSize: "14px", transition: "background 0.15s",
                  borderBottom: "1px solid #1e2d3d10",
                  background: index === activeIndex ? "#1e2d3d" : "transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1e2d3d"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ color: getTierColor(r.tier), marginRight: "8px", fontSize: "10px" }}>◆</span>
                {r.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Concept list ───────────────────────────────────────────────── */}
      <div ref={sidebarListRef} style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {[...conceptData].sort((a, b) => a.tier - b.tier).map((c) => (
          <div
            key={c.id}
            data-id={c.id}
            onClick={() => { selectNode(c.id); if (isMobile) setSidebarOpen(false); }}
            style={{
              padding: "10px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "10px",
              transition: "background 0.15s",
              background: highlightId === c.id ? "#1a2535" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (highlightId !== c.id) e.currentTarget.style.background = "#161f2b";
            }}
            onMouseLeave={(e) => {
              if (highlightId !== c.id) e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
              background: getTierColor(c.tier),
              boxShadow: highlightId === c.id ? `0 0 8px ${getTierColor(c.tier)}` : "none",
            }} />
            <span style={{
              fontSize: "13.5px",
              color: highlightId === c.id ? "#d4c5a9" : "#8a9aaa",
            }}>
              {c.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── Depth legend ───────────────────────────────────────────────── */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2d3d" }}>
        <div style={{
          fontSize: "10px", letterSpacing: "2px", color: "#3a4a5a",
          textTransform: "uppercase", marginBottom: "8px",
        }}>
          Depth
        </div>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {TIER_COLORS.map((c, i) => (
            <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: c }} />
          ))}
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: "4px", fontSize: "10px", color: "#3a4a5a",
        }}>
          <span>Foundation</span>
          <span>Advanced</span>
        </div>
      </div>
    </div>
  );
}