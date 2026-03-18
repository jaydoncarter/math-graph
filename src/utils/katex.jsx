import { useRef, useEffect } from "react";

const KATEX_CSS =
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
const KATEX_JS =
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";

/**
 * Dynamically injects the KaTeX stylesheet and script if they haven't been
 * loaded yet, then resolves. Safe to call multiple times — bails early if
 * window.katex already exists.
 */
export function loadKatex() {
  return new Promise((resolve) => {
    if (window.katex) return resolve();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = KATEX_CSS;
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = KATEX_JS;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

/**
 * Renders a LaTeX string into a container div using KaTeX display mode.
 * Expects window.katex to already be loaded (call loadKatex() first).
 */
export function KatexBlock({ latex }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.katex) return;
    try {
      window.katex.render(latex, ref.current, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (_) {
      // Silently ignore render errors so a bad LaTeX string doesn't crash the panel.
    }
  }, [latex]);

  return <div ref={ref} />;
}
