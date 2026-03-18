import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

import { conceptData } from "./conceptData";


const KATEX_CSS = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
const KATEX_JS  = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";

function loadKatex() {
  return new Promise((resolve) => {
    if (window.katex) return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = KATEX_CSS;
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = KATEX_JS;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

function KatexBlock({ latex }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.katex) return;
    try {
      window.katex.render(latex, ref.current, { displayMode: true, throwOnError: false });
    } catch (e) {}
  }, [latex]);
  return <div ref={ref} />;
}

// Ensure the graph is a DAG — cycles would break the tier computation and make the visualization confusing.
function assertAcyclic(data) {
  const state = {}; // "visiting" | "done"
  function dfs(id) {
    if (state[id] === "visiting") throw new Error(`Cycle detected at: ${id}`);
    if (state[id] === "done") return;
    state[id] = "visiting";
    data.find(c => c.id === id).depends_on.forEach(dfs);
    state[id] = "done";
  }
  data.forEach(c => dfs(c.id));
}

// Automatically compute tier = longest dependency chain from any root.
// Works for any graph — no manual tier field needed.
function computeTiers(data) {
  const tierMap = {};
  const inProgress = new Set();

  function longestPath(id) {
    if (tierMap[id] !== undefined) return tierMap[id];
    if (inProgress.has(id)) return 0; // cycle guard
    inProgress.add(id);
    const node = data.find(c => c.id === id);
    const tier = node.depends_on.length === 0
      ? 0
      : 1 + Math.max(...node.depends_on.map(longestPath));
    inProgress.delete(id);
    tierMap[id] = tier;
    return tier;
  }

  data.forEach(c => longestPath(c.id));
  return tierMap;
}

const tierMap = computeTiers(conceptData);
const maxTier = Math.max(...Object.values(tierMap));
// Stamp each concept with its auto-computed tier so the rest of the code is unchanged
conceptData.forEach(c => { c.tier = tierMap[c.id]; });
assertAcyclic(conceptData);

const TIER_COLORS = [
  "#e2b96f", "#d4a853", "#c49440", "#b07f2e",
  "#9c6b1e", "#875810", "#744806",
];

function getTierColor(tier) {
  // Interpolate across the palette regardless of how many tiers exist
  const idx = maxTier === 0 ? 0 : (tier / maxTier) * (TIER_COLORS.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return TIER_COLORS[Math.min(hi, TIER_COLORS.length - 1)];
}

function DetailPanelContent({ selected, katexReady, deps, dependents, selectNode, getTierColor }) {
  return (
    <>
      {/* Tier badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "3px 10px", borderRadius: "20px", marginBottom: "16px",
        border: `1px solid ${getTierColor(selected.tier)}44`,
        background: `${getTierColor(selected.tier)}11`
      }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getTierColor(selected.tier) }} />
        <span style={{ fontSize: "11px", color: getTierColor(selected.tier), letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Tier {selected.tier}
        </span>
      </div>

      <h2 style={{
        fontSize: "22px", fontWeight: 600, color: "#d4c5a9", margin: "0 0 12px",
        fontFamily: "'IM Fell English', Georgia, serif", lineHeight: 1.3
      }}>{selected.name}</h2>

      <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#8a9aaa", margin: "0 0 24px" }}>
        {selected.definition}
      </p>

      {/* LaTeX block */}
      <div style={{
        background: "#0d1117", borderRadius: "8px", padding: "20px",
        border: "1px solid #1e2d3d", marginBottom: "24px", overflowX: "auto"
      }}>
        {katexReady
          ? <KatexBlock key={selected.id} latex={selected.latex} />
          : <code style={{ color: "#e2b96f", fontSize: "13px" }}>{selected.latex}</code>
        }
      </div>

      {/* Dependencies */}
      {deps.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#3a4a5a", textTransform: "uppercase", marginBottom: "10px" }}>
            Requires
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {deps.map(d => (
              <div
                key={d.id}
                onClick={() => selectNode(d.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 12px", borderRadius: "6px", cursor: "pointer",
                  border: "1px solid #1e2d3d", transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = getTierColor(d.tier) + "66"; e.currentTarget.style.background = "#161f2b"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d3d"; e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getTierColor(d.tier), flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "#8a9aaa" }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dependents */}
      {dependents.length > 0 && (
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#3a4a5a", textTransform: "uppercase", marginBottom: "10px" }}>
            Unlocks
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {dependents.map(d => (
              <div
                key={d.id}
                onClick={() => selectNode(d.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 12px", borderRadius: "6px", cursor: "pointer",
                  border: "1px solid #1e2d3d", transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = getTierColor(d.tier) + "66"; e.currentTarget.style.background = "#161f2b"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d3d"; e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getTierColor(d.tier), flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "#8a9aaa" }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function MathConceptGraph() {
  const svgRef = useRef(null);
  const graphWrapperRef = useRef(null);
  const simRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [katexReady, setKatexReady] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [graphDims, setGraphDims] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nodesRef = useRef(null);
  const edgesRef = useRef(null);
  const dims = useRef({ w: 0, h: 0 });
  const zoomRef = useRef(null);
  const nodesDataRef = useRef([]);

  // Track mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = e => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => { loadKatex().then(() => setKatexReady(true)); }, []);

  // Observe the wrapper div so D3 always gets the real rendered size
  useEffect(() => {
    if (!graphWrapperRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setGraphDims({ w: width, h: height });
    });
    ro.observe(graphWrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const selectNode = useCallback((id) => {
    const concept = conceptData.find(c => c.id === id);
    setSelected(concept);
    setHighlightId(id);

    // Pan the graph so the selected node lands in the center of the visible area
    const nodeData = nodesDataRef.current.find(n => n.id === id);
    const svg = d3.select(svgRef.current);
    if (!nodeData || !zoomRef.current || !svg || nodeData.x == null) return;

    const { w, h } = dims.current;
    const currentTransform = d3.zoomTransform(svgRef.current);
    const scale = currentTransform.k;

    // On desktop the detail panel takes 340px off the right — centre within the remaining space.
    // On mobile the bottom sheet takes 55vh — centre within the remaining vertical space.
    const panelWidth = !isMobile ? 340 : 0;
    const panelHeight = isMobile ? h * 0.55 : 0;
    const cx = (w - panelWidth) / 2;
    const cy = (h - panelHeight) / 2;

    const tx = cx - scale * nodeData.x;
    const ty = cy - scale * nodeData.y;

    svg.transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }, [isMobile]);

  useEffect(() => {
    if (!graphDims) return;   // wait until ResizeObserver has real dimensions
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const W = graphDims.w;
    const H = graphDims.h;
    dims.current = { w: W, h: H };

    const defs = svg.append("defs");

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const selectGlow = defs.append("filter").attr("id", "selectGlow").attr("x", "-80%").attr("y", "-80%").attr("width", "260%").attr("height", "260%");
    selectGlow.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "coloredBlur");
    const feMerge2 = selectGlow.append("feMerge");
    feMerge2.append("feMergeNode").attr("in", "coloredBlur");
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrowhead marker
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", isMobile ? 34 : 22).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#5a6a7a");

    defs.append("marker")
      .attr("id", "arrowHl")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", isMobile ? 34 : 22).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#e2b96f");

    const g = svg.append("g");

    const zoom = d3.zoom().scaleExtent([0.4, 3]).on("zoom", e => g.attr("transform", e.transform));
    svg.call(zoom);
    zoomRef.current = zoom;

    const nodes = conceptData.map(d => ({ ...d }));
    nodesDataRef.current = nodes;
    const links = [];
    conceptData.forEach(d => {
      d.depends_on.forEach(dep => {
        links.push({ source: dep, target: d.id });
      });
    });

    const NODE_R = isMobile ? 28 : 22;
    const NODE_RING_R = isMobile ? 36 : 28;

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(110).strength(0.8))
      .force("charge", d3.forceManyBody().strength(-420))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("y", d3.forceY(d => (d.tier / 6) * H * 0.8 + H * 0.1).strength(0.45))
      .force("collision", d3.forceCollide(NODE_RING_R + 8));

    simRef.current = sim;

    const edgeGroup = g.append("g").attr("class", "edges");
    const nodeGroup = g.append("g").attr("class", "nodes");

    const edge = edgeGroup.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#2a3a4a")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)")
      .attr("opacity", 0.7);

    edgesRef.current = edge;

    const node = nodeGroup.selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on("click", (e, d) => { e.stopPropagation(); selectNode(d.id); });

    // Outer ring
    node.append("circle")
      .attr("r", NODE_RING_R)
      .attr("fill", "none")
      .attr("stroke", d => getTierColor(d.tier))
      .attr("stroke-width", 1)
      .attr("opacity", 0.4);

    // Node circle
    node.append("circle")
      .attr("r", NODE_R)
      .attr("fill", d => `${getTierColor(d.tier)}18`)
      .attr("stroke", d => getTierColor(d.tier))
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)");

    // Node label
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#d4c5a9")
      .attr("font-size", "8.5px")
      .attr("font-family", "'IM Fell English', Georgia, serif")
      .attr("pointer-events", "none")
      .each(function(d) {
        const words = d.name.split(" ");
        const el = d3.select(this);
        if (words.length <= 1) {
          el.append("tspan").attr("x", 0).attr("dy", 0).text(d.name);
        } else if (words.length === 2) {
          el.append("tspan").attr("x", 0).attr("dy", "-5").text(words[0]);
          el.append("tspan").attr("x", 0).attr("dy", "11").text(words[1]);
        } else {
          const mid = Math.ceil(words.length / 2);
          el.append("tspan").attr("x", 0).attr("dy", "-5").text(words.slice(0, mid).join(" "));
          el.append("tspan").attr("x", 0).attr("dy", "11").text(words.slice(mid).join(" "));
        }
      });

    nodesRef.current = node;

    sim.on("tick", () => {
      edge
        .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    svg.on("click", () => { setSelected(null); setHighlightId(null); });

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=IM+Fell+English&family=Crimson+Pro:wght@300;400;600&display=swap";
    document.head.appendChild(link);

    return () => sim.stop();
  }, [selectNode, graphDims, isMobile]);

  // Update visual highlight whenever highlightId changes
  useEffect(() => {
    if (!nodesRef.current || !edgesRef.current) return;

    const depIds = highlightId
      ? new Set(conceptData.find(c => c.id === highlightId)?.depends_on || [])
      : new Set();

    nodesRef.current.selectAll("circle:nth-child(2)")
      .attr("fill", d => {
        if (d.id === highlightId) return `${getTierColor(d.tier)}55`;
        return `${getTierColor(d.tier)}18`;
      })
      .attr("stroke-width", d => d.id === highlightId ? 3 : 1.5)
      .attr("filter", d => d.id === highlightId ? "url(#selectGlow)" : "url(#glow)");

    nodesRef.current.selectAll("circle:nth-child(1)")
      .attr("opacity", d => {
        if (!highlightId) return 0.4;
        return (d.id === highlightId || depIds.has(d.id)) ? 0.9 : 0.15;
      });

    edgesRef.current
      .attr("stroke", d => {
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        const sid = typeof d.source === "object" ? d.source.id : d.source;
        return (tid === highlightId) ? "#e2b96f" : "#2a3a4a";
      })
      .attr("opacity", d => {
        if (!highlightId) return 0.7;
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        return tid === highlightId ? 1 : 0.15;
      })
      .attr("stroke-width", d => {
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        return tid === highlightId ? 2.5 : 1.5;
      })
      .attr("marker-end", d => {
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        return tid === highlightId ? "url(#arrowHl)" : "url(#arrow)";
      });
  }, [highlightId]);

  // Search handler
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const q = search.toLowerCase();
    const results = conceptData.filter(c => c.name.toLowerCase().includes(q));
    setSearchResults(results);
  }, [search]);

  const deps = selected
    ? selected.depends_on.map(d => conceptData.find(c => c.id === d)).filter(Boolean)
    : [];

  const dependents = selected
    ? conceptData.filter(c => c.depends_on.includes(selected.id))
    : [];

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      background: "#0d1117", fontFamily: "'Crimson Pro', Georgia, serif",
      overflow: "hidden", flexDirection: isMobile ? "column" : "row"
    }}>

      {/* ── Mobile: hamburger button ── */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(v => !v)}
          style={{
            position: "absolute", top: "12px", left: "12px", zIndex: 100,
            background: "#111820", border: "1px solid #1e2d3d", borderRadius: "8px",
            color: "#d4c5a9", cursor: "pointer", padding: "8px 10px",
            display: "flex", flexDirection: "column", gap: "4px", lineHeight: 0
          }}
          aria-label="Toggle concept list"
        >
          <span style={{ display: "block", width: "18px", height: "2px", background: "#d4c5a9", borderRadius: "1px" }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "#d4c5a9", borderRadius: "1px" }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "#d4c5a9", borderRadius: "1px" }} />
        </button>
      )}

      {/* ── Mobile: overlay backdrop ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.5)"
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        ...(isMobile ? {
          position: "fixed", left: 0, top: 0, bottom: 0,
          width: "80vw", maxWidth: "320px",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 50,
        } : {
          width: "320px", minWidth: "280px",
        }),
        background: "#111820",
        borderRight: "1px solid #1e2d3d", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #1e2d3d", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#5a6a7a", textTransform: "uppercase", marginBottom: "4px" }}>
              Knowledge Atlas
            </div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "#d4c5a9", lineHeight: 1.2, fontFamily: "'IM Fell English', Georgia, serif" }}>
              Mathematical Concepts
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: "none", border: "none", color: "#5a6a7a", cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "4px", marginTop: "2px" }}
              aria-label="Close"
            >×</button>
          )}
        </div>

        {/* Search */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e2d3d", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4c5a9" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && searchResults.length > 0) {
                  selectNode(searchResults[0].id);
                  setSearch("");
                  setSearchResults([]);
                  setSidebarOpen(false);
                }
              }}
              placeholder="Search concepts…"
              style={{
                width: "100%", padding: "9px 12px 9px 34px", boxSizing: "border-box",
                background: "#0d1117", border: "1px solid #1e2d3d", borderRadius: "6px",
                color: "#d4c5a9", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif",
                outline: "none", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "#e2b96f44"}
              onBlur={e => e.target.style.borderColor = "#1e2d3d"}
            />
          </div>
          {searchResults.length > 0 && (
            <div style={{
              position: "absolute", left: "20px", right: "20px", top: "calc(100% - 4px)",
              background: "#111820", border: "1px solid #1e2d3d", borderRadius: "6px",
              zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
            }}>
              {searchResults.map(r => (
                <div
                  key={r.id}
                  onClick={() => { selectNode(r.id); setSearch(""); setSearchResults([]); setSidebarOpen(false); }}
                  style={{
                    padding: "9px 14px", cursor: "pointer", color: "#d4c5a9", fontSize: "14px",
                    transition: "background 0.15s", borderBottom: "1px solid #1e2d3d10"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1e2d3d"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ color: getTierColor(r.tier), marginRight: "8px", fontSize: "10px" }}>◆</span>
                  {r.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Concept list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {conceptData.map(c => (
            <div
              key={c.id}
              onClick={() => { selectNode(c.id); if (isMobile) setSidebarOpen(false); }}
              style={{
                padding: "10px 20px", cursor: "pointer", display: "flex", alignItems: "center",
                gap: "10px", transition: "background 0.15s",
                background: highlightId === c.id ? "#1a2535" : "transparent"
              }}
              onMouseEnter={e => { if (highlightId !== c.id) e.currentTarget.style.background = "#161f2b"; }}
              onMouseLeave={e => { if (highlightId !== c.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                background: getTierColor(c.tier),
                boxShadow: highlightId === c.id ? `0 0 8px ${getTierColor(c.tier)}` : "none"
              }} />
              <span style={{ fontSize: "13.5px", color: highlightId === c.id ? "#d4c5a9" : "#8a9aaa" }}>
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2d3d" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#3a4a5a", textTransform: "uppercase", marginBottom: "8px" }}>
            Depth
          </div>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {TIER_COLORS.map((c, i) => (
              <div key={i} style={{
                flex: 1, height: "4px", borderRadius: "2px", background: c
              }} />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", position: "absolute", left: 0 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "10px", color: "#3a4a5a" }}>
            <span>Foundation</span><span>Advanced</span>
          </div>
        </div>
      </div>

      {/* Main graph area */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        {/* Wrapper div — ResizeObserver measures this to give D3 real pixel dimensions */}
        <div ref={graphWrapperRef} style={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative" }}>
          <svg
            ref={svgRef}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", display: "block",
              touchAction: "none"   // ← lets D3 capture touch drag/pinch without page scroll
            }}
          />
        </div>

        {/* Concept detail panel — side drawer on desktop, bottom sheet on mobile */}
        {isMobile ? (
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0,
            height: selected ? "55vh" : "0px",
            background: "#111820", borderTop: "1px solid #1e2d3d",
            transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden", display: "flex", flexDirection: "column",
            zIndex: 30, borderRadius: "16px 16px 0 0"
          }}>
            {selected && (
              <>
                {/* Drag handle */}
                <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
                  <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#2a3a4a" }} />
                </div>
                <div style={{ padding: "0 24px 24px", overflowY: "auto", flex: 1 }}>
                  <button
                    onClick={() => { setSelected(null); setHighlightId(null); }}
                    style={{
                      position: "absolute", top: "12px", right: "16px",
                      background: "none", border: "none", color: "#3a4a5a", cursor: "pointer",
                      fontSize: "22px", lineHeight: 1, padding: "4px"
                    }}
                  >×</button>
                  <DetailPanelContent
                    selected={selected} katexReady={katexReady} deps={deps}
                    dependents={dependents} selectNode={selectNode} getTierColor={getTierColor}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0,
            width: selected ? "340px" : "0px",
            background: "#111820", borderLeft: "1px solid #1e2d3d",
            transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden", display: "flex", flexDirection: "column"
          }}>
            {selected && (
              <div style={{ padding: "28px 24px", overflowY: "auto", flex: 1 }}>
                <button
                  onClick={() => { setSelected(null); setHighlightId(null); }}
                  style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: "none", border: "none", color: "#3a4a5a", cursor: "pointer",
                    fontSize: "18px", lineHeight: 1, padding: "4px"
                  }}
                >×</button>
                <DetailPanelContent
                  selected={selected} katexReady={katexReady} deps={deps}
                  dependents={dependents} selectNode={selectNode} getTierColor={getTierColor}
                />
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {!selected && (
          <div style={{
            position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)",
            color: "#2a3a4a", fontSize: "13px", letterSpacing: "1px", pointerEvents: "none",
            fontFamily: "'Crimson Pro', Georgia, serif", whiteSpace: "nowrap"
          }}>
            {isMobile
              ? "tap a node · drag to explore · pinch to zoom"
              : "click a node · drag to explore · scroll to zoom"}
          </div>
        )}
      </div>
    </div>
  );}