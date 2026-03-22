import { useRef, useState, useEffect, useCallback } from "react";
import * as d3 from "d3";

import { conceptData } from "../conceptData";
import { conceptMap } from "../utils/graphUtils";
import { getTierColor } from "../utils/colors";

/**
 * hooks/useD3Simulation.js
 * 
 * Encapsulates all D3 simulation logic for the concept graph.
 *
 * @param {object} params
 * @param {React.RefObject} params.svgRef         – ref attached to the <svg> element
 * @param {React.RefObject} params.graphWrapperRef – ref attached to the sizing wrapper <div>
 * @param {boolean}         params.isMobile        – drives node sizes, arrowhead offset, panel offset
 * @param {string|null}     params.highlightId     – id of the currently selected node (drives edge/ring highlight)
 * @param {Function}        params.setSelected     – lifts selected concept object to parent
 * @param {Function}        params.setHighlightId  – lifts selected id to parent
 *
 * @returns {{ selectNode: Function }}
 */
export function useD3Simulation({
  svgRef,
  graphWrapperRef,
  isMobile,
  highlightId,
  fieldHighlight,
  showDepsArrows,
  showUnlockArrows,
  setSelected,
  setHighlightId,
}) {
  // ── D3-private refs ─────────────────────────────────────────────────────
  // None of these need to trigger re-renders; they are only read by D3 effects.
  const simRef       = useRef(null);   // d3 force simulation instance
  const nodesRef     = useRef(null);   // d3 selection of node <g> elements
  const edgesRef     = useRef(null);   // d3 selection of edge <line> elements
  const dims         = useRef({ w: 0, h: 0 }); // latest measured SVG dimensions
  const zoomRef      = useRef(null);   // d3 zoom behaviour
  const nodesDataRef = useRef([]);     // live node objects (mutated by simulation)

  // graphDims is set exactly once — by the ResizeObserver on first mount —
  // to give the build effect real pixel dimensions instead of 0×0.
  // After that, resizes are handled non-destructively inside the observer itself.
  const [graphDims, setGraphDims] = useState(null);

  // ── Resize observer ──────────────────────────────────────────────────────
  // On first paint: no simulation exists yet, so setGraphDims triggers the
  // build effect below.
  //
  // On every subsequent resize: dims.current is updated for pan math, then
  // the existing simulation's forces are nudged and it is restarted gently.
  // This avoids a full teardown/rebuild, which would wipe nodesRef/edgesRef
  // and cause the highlight effect to miss its next run.
  useEffect(() => {
    if (!graphWrapperRef.current) return;

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width <= 0 || height <= 0) return;

      dims.current = { w: width, h: height };

      if (simRef.current) {
        if (width !== prevWidth) {
          // Genuine layout change — nudge forces and re-settle
          simRef.current
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY((d) => (d.tier / 6) * height * 0.8 + height * 0.1).strength(0.45))
            .alpha(0.3)
            .restart();
        }
        // Height-only change (mobile keyboard show/hide): dims.current is updated
        // above for pan math, but the sim is left alone — nodes don't move.
      } else {
        setGraphDims({ w: width, h: height });
  }
    });
    ro.observe(graphWrapperRef.current);
    return () => ro.disconnect();
  }, [graphWrapperRef]);

  // ── selectNode ───────────────────────────────────────────────────────────
  // Defined before the simulation effect so it can be closed over by the
  // node click handler. useCallback keeps its reference stable across renders
  // (only recreated when isMobile changes, which triggers a full rebuild anyway).
  const selectNode = useCallback(
    (id) => {
      const concept = conceptMap.get(id);
      setSelected(concept);
      setHighlightId(id);

      // Pan so the selected node lands at the centre of the visible area,
      // accounting for the detail panel that will slide in.
      const nodeData = nodesDataRef.current.find((n) => n.id === id);
      const svg = d3.select(svgRef.current);
      if (!nodeData || !zoomRef.current || !svg || nodeData.x == null) return;

      const { w, h } = dims.current;
      const currentTransform = d3.zoomTransform(svgRef.current);
      const scale = currentTransform.k;

      // Desktop: detail panel takes 340 px off the right edge.
      // Mobile:  bottom sheet takes 55 vh off the bottom.
      const panelWidth  = !isMobile ? 340 : 0;
      const panelHeight =  isMobile ? h * 0.55 : 0;
      const cx = (w - panelWidth)  / 2;
      const cy = (h - panelHeight) / 2;

      const tx = cx - scale * nodeData.x;
      const ty = cy - scale * nodeData.y;

      svg
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(tx, ty).scale(scale)
        );
    },
    [isMobile, setSelected, setHighlightId, svgRef]
  );

  // ── Simulation build ─────────────────────────────────────────────────────
  // Runs on initial mount (graphDims: null → object) and whenever isMobile
  // flips, since node radius and arrowhead offsets differ between the two modes.
  //
  // dims.current always holds the latest measured size (kept fresh by the
  // ResizeObserver above), so the build always uses real pixel dimensions
  // even if it is triggered by an isMobile change rather than a resize.
  useEffect(() => {
    if (!graphDims) return; // wait for ResizeObserver to give real dimensions

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // full teardown before rebuilding

    // Use dims.current rather than graphDims so an isMobile-triggered rebuild
    // always gets the latest measured size (graphDims is only set once).
    const W = dims.current.w;
    const H = dims.current.h;

    // ── SVG defs: filters and arrowhead markers ──────────────────────────
    const defs = svg.append("defs");

    const glow = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%").attr("y", "-50%")
      .attr("width", "200%").attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge1 = glow.append("feMerge");
    feMerge1.append("feMergeNode").attr("in", "coloredBlur");
    feMerge1.append("feMergeNode").attr("in", "SourceGraphic");

    const selectGlow = defs
      .append("filter")
      .attr("id", "selectGlow")
      .attr("x", "-80%").attr("y", "-80%")
      .attr("width", "260%").attr("height", "260%");
    selectGlow.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "coloredBlur");
    const feMerge2 = selectGlow.append("feMerge");
    feMerge2.append("feMergeNode").attr("in", "coloredBlur");
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

    // refX must match NODE_RING_R so the arrowhead sits at the ring edge.
    const arrowRefX = isMobile ? 34 : 22;

    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", arrowRefX).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#5a6a7a");

    defs.append("marker")
      .attr("id", "arrowHl")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", arrowRefX).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#e2b96f");

    defs.append("marker")
      .attr("id", "arrowBlue")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", arrowRefX).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#4a9ece");

    // ── Zoom ────────────────────────────────────────────────────────────
    const g = svg.append("g");
    const zoom = d3
      .zoom()
      .scaleExtent([0.4, 3])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);
    zoomRef.current = zoom;

    // ── Data preparation ─────────────────────────────────────────────────
    // Shallow-copy so D3 can mutate x/y without touching the source array.
    const nodes = conceptData.map((d) => ({ ...d }));
    nodesDataRef.current = nodes;

    const links = [];
    conceptData.forEach((d) => {
      d.depends_on.forEach((dep) => {
        links.push({ source: dep, target: d.id });
      });
    });

    // ── Force simulation ─────────────────────────────────────────────────
    const NODE_R = isMobile ? 28 : 22;

    const sim = d3
      .forceSimulation(nodes)
      .force("link",      d3.forceLink(links).id((d) => d.id).distance(110).strength(0.8))
      .force("charge",    d3.forceManyBody().strength(-420))
      .force("center",    d3.forceCenter(W / 2, H / 2))
      .force("y",         d3.forceY((d) => (d.tier / 6) * H * 0.8 + H * 0.1).strength(0.45))
      .force("collision", d3.forceCollide(NODE_R + 8));

    simRef.current = sim;

    // ── Edge layer ───────────────────────────────────────────────────────
    const edgeGroup = g.append("g").attr("class", "edges");
    const edge = edgeGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#2a3a4a")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)")
      .attr("opacity", 0.7);
    edgesRef.current = edge;

    // ── Node layer ───────────────────────────────────────────────────────
    const nodeGroup = g.append("g").attr("class", "nodes");
    const node = nodeGroup
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(
        d3.drag()
          .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on("click", (e, d) => { e.stopPropagation(); selectNode(d.id); });

    // Main filled circle
    node.append("circle")
      .attr("class", "main-circle")
      .attr("r", NODE_R)
      .attr("fill",  (d) => `${getTierColor(d.tier)}18`)
      .attr("stroke", (d) => getTierColor(d.tier))
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)");

    // Field-ring — dashed outer ring shown when field grouping is active
    node.append("circle")
      .attr("class", "field-ring")
      .attr("r", NODE_R + 6)
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,3")
      .attr("pointer-events", "none");

    // Label — split into two tspan lines when the name has multiple words
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#d4c5a9")
      .attr("font-size", "8.5px")
      .attr("font-family", "'IM Fell English', Georgia, serif")
      .attr("pointer-events", "none")
      .each(function (d) {
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

    // ── Tick ─────────────────────────────────────────────────────────────
    sim.on("tick", () => {
      edge
        .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Clicking the background deselects
    svg.on("click", () => { setSelected(null); setHighlightId(null); });

    return () => sim.stop();
  }, [selectNode, graphDims, isMobile, svgRef, setSelected, setHighlightId]);

  // ── Highlight update ─────────────────────────────────────────────────────
  // Runs on every highlightId change without rebuilding the simulation.
  // Updates colours, opacities, stroke widths, and arrowhead markers in-place.
  // Because resizes no longer wipe nodesRef/edgesRef, this effect never risks
  // running against stale (null) selections after a keyboard dismiss or resize.
  useEffect(() => {
    if (!nodesRef.current || !edgesRef.current) return;

    const selectedConcept = highlightId
      ? conceptData.find((c) => c.id === highlightId)
      : null;

    // ── Main circle: fill / glow ────────────────────────────────────────────
    nodesRef.current.selectAll("circle.main-circle")
      .attr("fill", (d) =>
        d.id === highlightId
          ? `${getTierColor(d.tier)}55`
          : `${getTierColor(d.tier)}18`
      )
      .attr("stroke-width", (d) => (d.id === highlightId ? 3 : 1.5))
      .attr("filter", (d) =>
        d.id === highlightId ? "url(#selectGlow)" : "url(#glow)"
      );

    // ── Field ring: shown for same-field peers when toggle is on ────────────
    const selectedField = selectedConcept?.field ?? null;
    nodesRef.current.selectAll("circle.field-ring")
      .attr("stroke", (d) => {
        if (!fieldHighlight || !highlightId || !selectedField) return "transparent";
        if (d.id === highlightId || !d.field) return "transparent";
        return d.field === selectedField ? "#d4c5a9" : "transparent";
      })
      .attr("opacity", (d) => {
        if (!fieldHighlight || !highlightId || !selectedField) return 0;
        if (d.id === highlightId || !d.field) return 0;
        return d.field === selectedField ? 0.7 : 0;
      });

    // ── Edges ───────────────────────────────────────────────────────────────
    edgesRef.current
      .attr("stroke", (d) => {
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        const sid = typeof d.source === "object" ? d.source.id : d.source;
        if (tid === highlightId) return "#e2b96f";   // dependency  → yellow
        if (sid === highlightId) return "#4a9ece";   // unlocks     → blue
        return "#2a3a4a";
      })
      .attr("opacity", (d) => {
        if (!highlightId) return 0.7;
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        const sid = typeof d.source === "object" ? d.source.id : d.source;
        const isDep    = tid === highlightId;
        const isUnlock = sid === highlightId;
        if (isDep    && !showDepsArrows)   return 0;
        if (isUnlock && !showUnlockArrows) return 0;
        return isDep || isUnlock ? 1 : 0.15;
      })
      .attr("stroke-width", (d) => {
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        const sid = typeof d.source === "object" ? d.source.id : d.source;
        return tid === highlightId || sid === highlightId ? 2.5 : 1.5;
      })
      .attr("marker-end", (d) => {
        const tid = typeof d.target === "object" ? d.target.id : d.target;
        const sid = typeof d.source === "object" ? d.source.id : d.source;
        if (tid === highlightId) return "url(#arrowHl)";
        if (sid === highlightId) return "url(#arrowBlue)";
        return "url(#arrow)";
      });
  }, [highlightId, fieldHighlight, showDepsArrows, showUnlockArrows]);

  return { selectNode };
}