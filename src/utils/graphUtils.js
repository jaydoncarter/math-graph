import { conceptData } from "../conceptData";

/**
 * utils/graphUtils.js
 *
 * Defines computational functions for creating the graph:
 *  assertAcyclic
 *  computeTiers
 */

// ─── Graph algorithms ────────────────────────────────────────────────────────

/**
 * Throws if conceptData contains a directed cycle.
 * Cycles break tier computation and make the layout nonsensical.
 */
export function assertAcyclic(data) {
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

/**
 * Returns a map of { id → tier } where tier = longest dependency chain
 * leading to that node. Roots (no dependencies) get tier 0.
 * Works for any DAG — no manual tier field needed in the data.
 */
export function computeTiers(data) {
  const tierMap = {};
  const inProgress = new Set();

  function longestPath(id) {
    if (tierMap[id] !== undefined) return tierMap[id];
    if (inProgress.has(id)) return 0; // cycle guard (belt-and-suspenders)
    inProgress.add(id);
    const node = data.find(c => c.id === id);
    const tier =
      node.depends_on.length === 0
        ? 0
        : 1 + Math.max(...node.depends_on.map(longestPath));
    inProgress.delete(id);
    tierMap[id] = tier;
    return tier;
  }

  data.forEach(c => longestPath(c.id));
  return tierMap;
}

// ─── Module-level initialisation (runs once at import time) ─────────────────

export const tierMap = computeTiers(conceptData);
export const maxTier = Math.max(...Object.values(tierMap));

// Stamp each concept with its computed tier so the rest of the code can read
// concept.tier directly without re-running the algorithm.
conceptData.forEach(c => { c.tier = tierMap[c.id]; });

// Validate after stamping so the error message can reference tier values.
assertAcyclic(conceptData);

// Fast O(1) lookup by id — used anywhere a single concept is needed by id.
export const conceptMap = new Map(conceptData.map(c => [c.id, c]));
