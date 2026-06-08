import { useEffect, useState, useRef } from 'react';
import AiCourseStepper from './AiCourseStepper';
import { SOURCE, SECTION_MAP } from './stepperInspectData';
// exercises prop shape: { title, desc, validate(code) -> { pass, feedback } }
import CodeEditor from './CodeEditor';

// ── Class → section-map key (React DOM classes) ──────────────────────────────
const CLASS_SECTIONS = {
  'stepper-mock':          'stepper-wrapper',
  'stepper-mock__body':    'stepper-wrapper',
  'stepper__steps':        'stepper-steps',
  'stepper__step':         'stepper-step',
  'stepper__detail':       'stepper-detail',
  'stepper__detail-title': 'stepper-detail',
  'stepper__detail-body':  'stepper-detail',
  'stepper__controls':     'stepper-controls',
  'stepper__btn':          'stepper-btn',
  'stepper__counter':      'stepper-controls',
};

const PREVIEW_RESIZE_MESSAGE = 'stepper-preview-resize';
const PREVIEW_RESIZE_SCRIPT = `<script>
(function () {
  function reportHeight() {
    window.parent.postMessage({
      type: '${PREVIEW_RESIZE_MESSAGE}',
      height: document.documentElement.scrollHeight
    }, '*');
  }

  window.addEventListener('load', reportHeight);
  new ResizeObserver(reportHeight).observe(document.documentElement);
  reportHeight();
})();
</script>`;

function addPreviewResizeScript(code) {
  return code.includes('</body>')
    ? code.replace('</body>', `${PREVIEW_RESIZE_SCRIPT}\n</body>`)
    : `${code}\n${PREVIEW_RESIZE_SCRIPT}`;
}

function findSection(el, container) {
  let curr = el;
  while (curr && curr !== container && curr !== document.body) {
    for (const cls of (curr.classList || [])) {
      if (CLASS_SECTIONS[cls]) return { section: CLASS_SECTIONS[cls], el: curr };
    }
    curr = curr.parentElement;
  }
  return null;
}

function getChildren(el) {
  return [...el.childNodes].slice(0, 7).map(c => {
    if (c.nodeType === 3) {
      const t = c.textContent.trim();
      return t ? { type: 'text', text: t.slice(0, 80) } : null;
    }
    if (c.nodeType === 1) {
      return {
        type: 'el',
        tag:  c.tagName.toLowerCase(),
        cls:  c.className || '',
        text: c.textContent.trim().replace(/\s+/g, ' ').slice(0, 50),
      };
    }
    return null;
  }).filter(Boolean);
}

function buildLocalPath(target, container) {
  const levels = [];
  let el = target;
  for (let i = 0; i < 4 && el && el !== container && el !== document.body; i++) {
    levels.unshift(el);
    el = el.parentElement;
  }
  return levels.map(el => ({
    tag:      el.tagName.toLowerCase(),
    cls:      el.className || '',
    isTarget: el === target,
    children: el === target ? getChildren(el) : null,
  }));
}

// ── DevTools tree row ────────────────────────────────────────────────────────
function DevTreeRow({ node, depth }) {
  const cls = (node.cls || '').split(' ').filter(Boolean).slice(0, 3).join(' ');
  return (
    <>
      <div
        className={`devtools__row${node.isTarget ? ' devtools__row--target' : ''}`}
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        <span className="devtools__tri">{node.isTarget ? '▼ ' : '▶ '}</span>
        <span className="devtools__lt">&lt;</span>
        <span className="devtools__tag-name">{node.tag}</span>
        {cls && (
          <>
            {' '}
            <span className="devtools__attr-name">class</span>
            =<span className="devtools__attr-val">"{cls}"</span>
          </>
        )}
        <span className="devtools__lt">&gt;</span>
      </div>

      {node.isTarget && node.children?.length > 0 && (
        <>
          {node.children.map((c, i) =>
            c.type === 'text' ? (
              <div key={i} className="devtools__text-node" style={{ paddingLeft: (depth + 1) * 16 + 8 }}>
                &quot;{c.text}&quot;
              </div>
            ) : (
              <div key={i} className="devtools__child-row" style={{ paddingLeft: (depth + 1) * 16 + 8 }}>
                <span className="devtools__tri-sm">▶ </span>
                <span className="devtools__lt">&lt;</span>
                <span className="devtools__tag-name">{c.tag}</span>
                {c.cls && (
                  <>
                    {' '}
                    <span className="devtools__attr-name">class</span>
                    =<span className="devtools__attr-val">
                      &quot;{c.cls.split(' ').slice(0, 2).join(' ')}&quot;
                    </span>
                  </>
                )}
                <span className="devtools__lt">&gt;</span>
                {c.text && <span className="devtools__inline-text"> {c.text.slice(0, 40)}</span>}
                <span className="devtools__lt">&lt;/</span>
                <span className="devtools__tag-name">{c.tag}</span>
                <span className="devtools__lt">&gt;</span>
              </div>
            )
          )}
          <div className="devtools__close-row" style={{ paddingLeft: depth * 16 + 8 }}>
            <span className="devtools__lt">&lt;/</span>
            <span className="devtools__tag-name">{node.tag}</span>
            <span className="devtools__lt">&gt;</span>
          </div>
        </>
      )}
    </>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function StepperInspectBlock({ exercises = [] }) {
  const [inspectOn,        setInspectOn]        = useState(false);
  const [elementPath,      setElementPath]      = useState([]);
  const [activeSectionKey, setActiveSectionKey] = useState(null);
  const [previewMode,      setPreviewMode]      = useState('react'); // 'react' | 'iframe'
  const [iframeSrc,        setIframeSrc]        = useState('');
  const [iframeHeight,     setIframeHeight]     = useState(480);
  const [activeEx,         setActiveEx]         = useState(0);
  const [completedExs,     setCompletedExs]     = useState([]); // [{idx, feedback}]
  const [runFeedback,      setRunFeedback]      = useState(null);

  const stepperRef  = useRef(null);
  const overlayRef  = useRef(null);
  const hoveredEl   = useRef(null);
  const selectedEl  = useRef(null);
  const editorRef   = useRef(null);
  const iframeRef   = useRef(null);
  const minimumIframeHeight = useRef(480);

  useEffect(() => {
    function handlePreviewResize(event) {
      if (
        event.source !== iframeRef.current?.contentWindow
        || event.data?.type !== PREVIEW_RESIZE_MESSAGE
      ) {
        return;
      }

      const nextHeight = Number(event.data.height);
      if (Number.isFinite(nextHeight) && nextHeight > 0) {
        setIframeHeight(Math.max(minimumIframeHeight.current, Math.ceil(nextHeight)));
      }
    }

    window.addEventListener('message', handlePreviewResize);
    return () => window.removeEventListener('message', handlePreviewResize);
  }, []);

  function getElBehindOverlay(clientX, clientY) {
    const ov = overlayRef.current;
    if (!ov) return null;
    try {
      ov.style.visibility = 'hidden';
      return document.elementFromPoint(clientX, clientY);
    } finally {
      ov.style.visibility = 'visible';
    }
  }

  function handleOverlayMove(e) {
    const el        = getElBehindOverlay(e.clientX, e.clientY);
    const container = stepperRef.current;
    if (hoveredEl.current && hoveredEl.current !== selectedEl.current) {
      hoveredEl.current.style.outline      = '';
      hoveredEl.current.style.outlineOffset = '';
      hoveredEl.current = null;
    }
    if (el && container?.contains(el)) {
      const match = findSection(el, container);
      if (match && match.el !== selectedEl.current) {
        match.el.style.outline      = '2px dashed #F6C785';
        match.el.style.outlineOffset = '2px';
        hoveredEl.current = match.el;
      }
    }
  }

  function handleOverlayLeave() {
    if (hoveredEl.current && hoveredEl.current !== selectedEl.current) {
      hoveredEl.current.style.outline      = '';
      hoveredEl.current.style.outlineOffset = '';
      hoveredEl.current = null;
    }
  }

  function handleOverlayClick(e) {
    e.preventDefault();
    const el        = getElBehindOverlay(e.clientX, e.clientY);
    const container = stepperRef.current;
    if (!el || !container?.contains(el)) return;

    if (hoveredEl.current)  { hoveredEl.current.style.outline  = ''; hoveredEl.current.style.outlineOffset  = ''; hoveredEl.current  = null; }
    if (selectedEl.current) { selectedEl.current.style.outline = ''; selectedEl.current.style.outlineOffset = ''; }

    const match  = findSection(el, container);
    const target = match?.el ?? el;
    target.style.outline      = '2px solid #F6C785';
    target.style.outlineOffset = '2px';
    selectedEl.current = target;

    setElementPath(buildLocalPath(target, container));

    if (match) {
      setActiveSectionKey(match.section);
      selectInEditor(match.section, editorRef.current);
    }
  }

  function selectInEditor(key, ta) {
    if (!ta) return;
    const info  = SECTION_MAP[key];
    if (!info)  return;
    const text  = ta.value;
    const start = text.indexOf(info.startSearch);
    if (start === -1) return;
    const rawEnd = info.endSearch ? text.indexOf(info.endSearch, start) : -1;
    const end    = rawEnd === -1 ? Math.min(start + 500, text.length) : rawEnd;
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(start, end);
    const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 20;
    const line  = text.substring(0, start).split('\n').length;
    ta.scrollTop = Math.max(0, (line - 4)) * lineH;
  }

  function stopInspect() {
    if (hoveredEl.current) {
      hoveredEl.current.style.outline = '';
      hoveredEl.current.style.outlineOffset = '';
      hoveredEl.current = null;
    }
    if (selectedEl.current) {
      selectedEl.current.style.outline = '';
      selectedEl.current.style.outlineOffset = '';
      selectedEl.current = null;
    }
    setInspectOn(false);
    setElementPath([]);
    setActiveSectionKey(null);
  }

  function toggleInspect() {
    if (inspectOn) {
      stopInspect();
    } else {
      // If viewing custom output, reset to React first so there's something to inspect
      if (previewMode === 'iframe') {
        setPreviewMode('react');
        if (editorRef.current) editorRef.current.value = SOURCE;
      }
      setInspectOn(true);
    }
  }

  function runCode(code) {
    const startingBodyHeight = stepperRef.current
      ?.querySelector('.browser-window__body')
      ?.getBoundingClientRect().height;

    if (startingBodyHeight) {
      minimumIframeHeight.current = startingBodyHeight;
      setIframeHeight(startingBodyHeight);
    }

    setIframeSrc(addPreviewResizeScript(code));
    setPreviewMode('iframe');
    stopInspect();

    if (exercises.length > 0 && activeEx < exercises.length) {
      const { pass, feedback } = exercises[activeEx].validate(code);
      if (pass) {
        setCompletedExs(prev => [...prev, { idx: activeEx, feedback }]);
        setActiveEx(prev => prev + 1);
        setRunFeedback(null);
      } else {
        setRunFeedback(feedback);
      }
    }
  }

  function resetToReact() {
    setPreviewMode('react');
    stopInspect();
    if (editorRef.current) editorRef.current.value = SOURCE;
  }

  const sectionInfo  = activeSectionKey ? SECTION_MAP[activeSectionKey] : null;
  const hasExercises = exercises.length > 0;
  const allDone      = hasExercises && activeEx >= exercises.length;

  return (
    <>
      <div className="stepper-inspect-block">

        {/* ── Exercise cards ───────────────────────────────── */}
        {hasExercises && (
          <div className="exercise-stack">

            {/* Completed exercises */}
            {completedExs.map((ex) => (
              <div key={ex.idx} className="exercise-card exercise-card--done">
                <div className="exercise-card__header">
                  <span className="exercise-card__check">✓</span>
                  <span className="exercise-card__title">{exercises[ex.idx].title}</span>
                </div>
                <p className="exercise-card__desc">{exercises[ex.idx].desc}</p>
                <div className="exercise-card__feedback">{ex.feedback}</div>
              </div>
            ))}

            {/* Active exercise */}
            {!allDone && (
              <div className="exercise-card exercise-card--active">
                <div className="exercise-card__header">
                  <span className="exercise-card__num">{activeEx + 1} / {exercises.length}</span>
                  <span className="exercise-card__title">{exercises[activeEx].title}</span>
                </div>
                <p className="exercise-card__desc">{exercises[activeEx].desc}</p>
                {runFeedback && (
                  <div className="exercise-card__feedback">{runFeedback}</div>
                )}
              </div>
            )}

            {/* All done */}
            {allDone && (
              <div className="exercise-card exercise-card--complete">
                <span className="exercise-card__title">
                  🎉 All {exercises.length} exercises done.
                </span>
              </div>
            )}

          </div>
        )}

        {/* ── Preview row ──────────────────────────────────── */}
        <div className={`stepper-inspect-block__preview-row${inspectOn ? ' is-inspecting' : ''}`}>

          {/* Left: AiCourseStepper (React) or iframe (after Run) */}
          <div className="stepper-inspect-block__preview">
            <div className="stepper-inspect-block__stepper-wrap" ref={stepperRef}>
              {previewMode === 'react' ? (
                <>
                  <AiCourseStepper />
                  {inspectOn && (
                    <div
                      ref={overlayRef}
                      className="stepper-inspect-block__overlay"
                      onMouseMove={handleOverlayMove}
                      onMouseLeave={handleOverlayLeave}
                      onClick={handleOverlayClick}
                    />
                  )}
                </>
              ) : (
                <div className="browser-window" style={{ marginTop: 0, borderRadius: 0, boxShadow: 'none' }}>
                  <div className="browser-window__chrome">
                    <div className="browser-window__dots">
                      <span className="browser-window__dot browser-window__dot--red" />
                      <span className="browser-window__dot browser-window__dot--yellow" />
                      <span className="browser-window__dot browser-window__dot--green" />
                    </div>
                    <div className="browser-window__tab">
                      <span className="browser-window__tab-title">stepper.html — your version</span>
                      <button className="browser-window__tab-close">✕</button>
                    </div>
                  </div>
                  <div className="browser-window__navbar">
                    <button className="browser-window__nav-btn">←</button>
                    <button className="browser-window__nav-btn">→</button>
                    <button className="browser-window__nav-btn">↺</button>
                    <div className="browser-window__urlbar">
                      <span className="browser-window__urlbar-icon">🔍</span>
                      <span className="browser-window__urlbar-text">file:///stepper.html</span>
                    </div>
                  </div>
                  <iframe
                    ref={iframeRef}
                    srcDoc={iframeSrc}
                    className="stepper-inspect-block__iframe"
                    style={{ height: `${iframeHeight}px` }}
                    sandbox="allow-scripts"
                    title="Edited stepper preview"
                  />
                </div>
              )}
            </div>

            {/* ── Bottom button bar (always visible) ── */}
            <div className="stepper-inspect-block__preview-footer">
              <button
                className={`inspect-btn${inspectOn ? ' is-active' : ''}`}
                onClick={toggleInspect}
                title={
                  previewMode === 'iframe'
                    ? 'Inspect — resets to original to enable inspection'
                    : inspectOn
                      ? 'Stop inspecting'
                      : 'Inspect elements'
                }
              >
                {inspectOn ? '✕ Stop inspecting' : '⬚ Inspect'}
              </button>
              {previewMode === 'iframe' && (
                <button className="inspect-btn" onClick={resetToReact}>
                  ↺ Revert to original
                </button>
              )}
              {inspectOn && (
                <span className="inspect-practice__hint">Click any element to see where it comes from</span>
              )}
            </div>
          </div>

          {/* Right: DevTools panel (when inspect is active) */}
          {inspectOn && (
            <div className="inspect-devtools">
              <div className="inspect-devtools__header">Elements</div>
              <div className="inspect-devtools__body">
                {elementPath.length === 0 ? (
                  <div className="inspect-devtools__empty">← Click any element</div>
                ) : (
                  <div className="inspect-devtools__tree">
                    {elementPath.map((node, i) => (
                      <DevTreeRow key={i} node={node} depth={i} />
                    ))}
                  </div>
                )}
              </div>
              {sectionInfo && (
                <div className="inspect-devtools__footer">
                  <span className="inspect-tag">{sectionInfo.label}</span>
                  <p>{sectionInfo.desc}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Editor ───────────────────────────────────────── */}
        <CodeEditor
          editorRef={editorRef}
          defaultValue={SOURCE}
          label="Your code"
          expandedTitle="stepper.html"
          onRun={runCode}
          status={sectionInfo
            ? <span className="inspect-tag">{sectionInfo.label}</span>
            : (
              <span className="inspect-tag inspect-tag--muted">
                {inspectOn ? 'click an element ↑' : 'edit + run'}
              </span>
            )}
          description={sectionInfo
            ? <div className="inspect-practice__code-desc">{sectionInfo.desc}</div>
            : null}
        />

      </div>
    </>
  );
}
