/**
 * resize-reporter.js — include in any animation/iframe HTML file.
 * Reports its document height to the parent course page so the iframe
 * can auto-size without a fixed height attribute.
 *
 * Usage (in the animation file, before </body>):
 *   <script src="../shared/resize-reporter.js"></script>
 *
 * Retries a few times so the parent's message listener is guaranteed
 * to be ready even if sidenav.js loads after this iframe does.
 */
(function () {
  function report() {
    window.parent.postMessage(
      { type: 'courseIframeResize', h: document.documentElement.scrollHeight },
      '*'
    );
  }

  // Fire immediately, on load, and on any content size changes
  report();
  window.addEventListener('load', report);
  new ResizeObserver(report).observe(document.documentElement);

  // Retry a few times to cover the race where the parent listener loads after this iframe
  [100, 300, 700].forEach(function (ms) { setTimeout(report, ms); });
})();
