import { useState, useRef, useEffect } from 'react';
import AiCourseStepper from './AiCourseStepper';
import { SOURCE, SECTION_MAP } from './InspectPractice';

// ── Class → section-map key (for the React component's actual DOM classes) ──
const CLASS_SECTIONS = {
  'stepper-mock':          'stepper-wrapper',
  'stepper-mock__body':    'stepper-wrapper',
  'stepper__steps':        'stepper-steps',
  'stepper__step':         'stepper-step',
  'stepper__step-num':     'stepper-step',
  'stepper__detail':       'stepper-detail',
  'stepper__detail-title': 'stepper-detail',
  'stepper__detail-body':  'stepper-detail',
  'stepper__controls':     'stepper-controls',
  'stepper__btn':          'stepper-btn',
  'stepper__counter':      'stepper-controls',
};

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

// Collect up to 4 ancestor levels from target up to (but not including) container
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

function handleTab(e) {
  if (e.key !== 'Tab') return;
  e.preventDefault();
  const ta = e.target;
  const s  = ta.selectionStart, end = ta.selectionEnd;
  ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(end);
  ta.selectionStart = ta.selectionEnd = s + 2;
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
export default function StepperInspectBlock() {
  const [inspectOn,       setInspectOn]       = useState(false);
  const [elementPath,     setElementPath]     = useState([]);
  const [activeSectionKey, setActiveSectionKey] = useState(null);
  const [previewMode,     setPreviewMode]     = useState('react'); // 'react' | 'iframe'
  const [iframeSrc,       setIframeSrc]       = useState('');
  const [expandOpen,      setExpandOpen]      = useState(false);

  const stepperRef = useRef(null);   // .stepper-inspect-block__stepper-wrap
  const overlayRef = useRef(null);   // transparent inspect overlay
  const hoveredEl  = useRef(null);   // currently hover-outlined element
  const selectedEl = useRef(null);   // currently click-selected element
  const editorRef  = useRef(null);
  const expandRef  = useRef(null);

  // ESC closes expand
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && expandOpen) closeExpand(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expandOpen]);

  // Sync expand editor on open
  useEffect(() => {
    if (expandOpen && expandRef.current && editorRef.current) {
      expandRef.current.value = editorRef.current.value;
      expandRef.current.focus();
    }
  }, [expandOpen]);

  // Momentarily hide overlay so elementFromPoint returns the element below it
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
    // Clear previous hover (leave selected alone)
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

    // Clear previous outlines
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
      setInspectOn(true);
    }
  }

  function runCode(sourceEl) {
    const code = (sourceEl ?? editorRef.current)?.value ?? SOURCE;
    setIframeSrc(code);
    setPreviewMode('iframe');
    stopInspect();
  }

  function resetToReact() {
    setPreviewMode('react');
    stopInspect();
    if (editorRef.current) editorRef.current.value = SOURCE;
  }

  function openExpand()  { setExpandOpen(true); }
  function closeExpand() {
    if (editorRef.current && expandRef.current) {
      editorRef.current.value = expandRef.current.value;
    }
    setExpandOpen(false);
  }

  const sectionInfo = activeSectionKey ? SECTION_MAP[activeSectionKey] : null;

  return (
    <>
      <div className="stepper-inspect-block">

        {/* ── Topbar ───────────────────────────────────────── */}
        <div className="stepper-inspect-block__topbar">
          {previewMode === 'react' ? (
            <button
              className={`inspect-btn${inspectOn ? ' is-active' : ''}`}
              onClick={toggleInspect}
            >
              {inspectOn ? '✕ Stop' : '⬚ Inspect'}
            </button>
          ) : (
            <button className="inspect-btn" onClick={resetToReact}>↺ Reset to original</button>
          )}
          {inspectOn && (
            <span className="inspect-practice__hint">Click any element to see where it comes from</span>
          )}
        </div>

        {/* ── Preview row ──────────────────────────────────── */}
        <div className={`stepper-inspect-block__preview-row${inspectOn ? ' is-inspecting' : ''}`}>

          {/* Left: AiCourseStepper (React) or iframe (after Run) */}
          <div className="stepper-inspect-block__preview">
            {previewMode === 'react' ? (
              <div className="stepper-inspect-block__stepper-wrap" ref={stepperRef}>
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
              </div>
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
                  srcDoc={iframeSrc}
                  className="stepper-inspect-block__iframe"
                  sandbox="allow-scripts"
                  title="Edited stepper preview"
                />
              </div>
            )}
          </div>

          {/* Right: DevTools panel (only when inspect is active) */}
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
        <div className="stepper-inspect-block__editor">
          <div className="stepper-inspect-block__editor-header">
            <span className="inspect-practice__filename">stepper.html</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {sectionInfo
                ? <span className="inspect-tag">{sectionInfo.label}</span>
                : <span className="inspect-tag inspect-tag--muted">
                    {inspectOn ? 'click an element ↑' : 'edit + run'}
                  </span>
              }
              <button className="inspect-btn" onClick={openExpand} title="Expand editor">⤢</button>
              <button className="inspect-btn inspect-btn--run" onClick={() => runCode()}>Run ▶</button>
            </div>
          </div>
          {sectionInfo && (
            <div className="inspect-practice__code-desc">{sectionInfo.desc}</div>
          )}
          <textarea
            ref={editorRef}
            className="inspect-practice__editor"
            defaultValue={SOURCE}
            spellCheck={false}
            onKeyDown={handleTab}
          />
        </div>

      </div>

      {/* ── Expand modal ─────────────────────────────────── */}
      {expandOpen && (
        <div
          className="expand-overlay open"
          onClick={e => { if (e.target === e.currentTarget) closeExpand(); }}
        >
          <div className="expand-modal">
            <div className="expand-modal__header">
              <span className="expand-modal__title">stepper.html</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="inspect-btn inspect-btn--run"
                  onClick={() => { runCode(expandRef.current); closeExpand(); }}
                >
                  Run ▶
                </button>
                <button className="expand-modal__close" onClick={closeExpand}>✕ close</button>
              </div>
            </div>
            <textarea
              ref={expandRef}
              className="expand-editor"
              spellCheck={false}
              onKeyDown={handleTab}
            />
          </div>
        </div>
      )}
    </>
  );
}
