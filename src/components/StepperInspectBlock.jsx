import { useState, useRef, useEffect } from 'react';
import AiCourseStepper from './AiCourseStepper';
import { SOURCE, SECTION_MAP } from './InspectPractice';

// ── Class → section-map key (React DOM classes) ──────────────────────────────
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

function generateFeedback(userCode) {
  if (userCode.trim() === SOURCE.trim()) {
    return 'No changes detected — try editing something before running.';
  }
  const origLines = SOURCE.split('\n');
  const userLines = userCode.split('\n');
  const changed = userLines.filter((l, i) => l !== origLines[i]).length
                + Math.abs(userLines.length - origLines.length);
  if (changed <= 2) return 'Precise — minimal, targeted edit.';
  if (changed <= 8) return `${changed} lines changed. Solid edit.`;
  return `Major rework — ${changed}+ lines touched.`;
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
  const [expandOpen,       setExpandOpen]       = useState(false);
  const [activeEx,         setActiveEx]         = useState(0);
  const [completedExs,     setCompletedExs]     = useState([]); // [{idx, feedback}]
  const [searchOpen,       setSearchOpen]       = useState(false);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [matchIdx,         setMatchIdx]         = useState(0);
  const [matchCount,       setMatchCount]       = useState(0);

  const stepperRef  = useRef(null);
  const overlayRef  = useRef(null);
  const hoveredEl   = useRef(null);
  const selectedEl  = useRef(null);
  const editorRef   = useRef(null);
  const expandRef   = useRef(null);
  const mirrorRef   = useRef(null);
  const searchRef   = useRef(null);
  const matchesRef  = useRef([]); // [{start, end}]

  // Keyboard: ESC + Ctrl/Cmd+F when expand modal is open
  useEffect(() => {
    function onKey(e) {
      if (!expandOpen) return;
      if (e.key === 'Escape') {
        if (searchOpen) { closeSearch(); }
        else { closeExpand(); }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault(); // stop browser's own find bar
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === 'Enter' && searchOpen && document.activeElement === searchRef.current) {
        e.preventDefault();
        jumpMatch(e.shiftKey ? -1 : 1);
      }
    }
    document.addEventListener('keydown', onKey, true); // capture phase beats browser shortcut
    return () => document.removeEventListener('keydown', onKey, true);
  }, [expandOpen, searchOpen]);

  function findMatches(query, text) {
    if (!query) return [];
    const results = [];
    const lower   = text.toLowerCase();
    const q       = query.toLowerCase();
    let i = 0;
    while ((i = lower.indexOf(q, i)) !== -1) {
      results.push({ start: i, end: i + q.length });
      i += q.length;
    }
    return results;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function updateMirror(text, query, currentIdx) {
    const mirror = mirrorRef.current;
    if (!mirror) return;
    if (!query || matchesRef.current.length === 0) {
      mirror.innerHTML = escapeHtml(text) + '\n';
      return;
    }
    let html = '', last = 0;
    for (let i = 0; i < matchesRef.current.length; i++) {
      const m   = matchesRef.current[i];
      const cls = i === currentIdx ? 'find-highlight find-highlight--current' : 'find-highlight';
      html += escapeHtml(text.slice(last, m.start));
      html += `<span class="${cls}">${escapeHtml(text.slice(m.start, m.end))}</span>`;
      last  = m.end;
    }
    html += escapeHtml(text.slice(last));
    mirror.innerHTML = html + '\n';
  }

  function syncMirrorScroll() {
    if (mirrorRef.current && expandRef.current) {
      mirrorRef.current.scrollTop  = expandRef.current.scrollTop;
      mirrorRef.current.scrollLeft = expandRef.current.scrollLeft;
    }
  }

  function handleEditorInput() {
    const ta = expandRef.current;
    if (ta) updateMirror(ta.value, searchQuery, matchIdx);
  }

  function applySearch(query, currentIdx = 0) {
    const ta = expandRef.current;
    if (!ta) return;
    const matches = findMatches(query, ta.value);
    matchesRef.current = matches;
    setMatchCount(matches.length);
    const idx = matches.length > 0 ? Math.min(currentIdx, matches.length - 1) : 0;
    setMatchIdx(idx);
    updateMirror(ta.value, query, idx);
    if (matches.length > 0) scrollToMatch(idx);
  }

  // Scroll to line of match — never focuses or selects textarea
  function scrollToMatch(idx) {
    const ta = expandRef.current;
    if (!ta || matchesRef.current.length === 0) return;
    const m     = matchesRef.current[idx];
    const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 20;
    const line  = ta.value.substring(0, m.start).split('\n').length;
    ta.scrollTop = Math.max(0, (line - 4)) * lineH;
    syncMirrorScroll();
  }

  function jumpMatch(dir) {
    if (matchesRef.current.length === 0) return;
    const next = (matchIdx + dir + matchesRef.current.length) % matchesRef.current.length;
    setMatchIdx(next);
    const ta = expandRef.current;
    if (ta) updateMirror(ta.value, searchQuery, next);
    scrollToMatch(next);
    searchRef.current?.focus(); // keep focus on search bar
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
    setMatchIdx(0);
    setMatchCount(0);
    matchesRef.current = [];
    const ta = expandRef.current;
    if (ta) updateMirror(ta.value, '', 0); // clear all highlights
    expandRef.current?.focus();
  }

  // Sync expand editor on open; initialize mirror
  useEffect(() => {
    if (expandOpen && expandRef.current && editorRef.current) {
      expandRef.current.value = editorRef.current.value;
      expandRef.current.focus();
      if (mirrorRef.current) updateMirror(expandRef.current.value, '', 0);
    }
  }, [expandOpen]);

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

  function runCode(sourceEl) {
    const code = (sourceEl ?? editorRef.current)?.value ?? SOURCE;
    setIframeSrc(code);
    setPreviewMode('iframe');
    stopInspect();

    // Advance exercise on each Run
    if (exercises.length > 0 && activeEx < exercises.length) {
      const feedback = generateFeedback(code);
      setCompletedExs(prev => [...prev, { idx: activeEx, feedback }]);
      setActiveEx(prev => prev + 1);
    }
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
                    srcDoc={iframeSrc}
                    className="stepper-inspect-block__iframe"
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
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="expand-search-hint">Ctrl+F to search</span>
                <button
                  className="inspect-btn inspect-btn--run"
                  onClick={() => { runCode(expandRef.current); closeExpand(); }}
                >
                  Run ▶
                </button>
                <button className="expand-modal__close" onClick={closeExpand}>✕ close</button>
              </div>
            </div>

            {/* Find bar — shown only when Ctrl+F pressed */}
            {searchOpen && (
              <div className="expand-findbar">
                <input
                  ref={searchRef}
                  className="expand-findbar__input"
                  placeholder="Find in editor…"
                  value={searchQuery}
                  onChange={e => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    applySearch(q, 0);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Escape') { e.stopPropagation(); closeSearch(); }
                    if (e.key === 'Enter')  { e.preventDefault(); jumpMatch(e.shiftKey ? -1 : 1); }
                  }}
                />
                <span className="expand-findbar__count">
                  {matchCount === 0 && searchQuery ? 'no results' : matchCount > 0 ? `${matchIdx + 1} / ${matchCount}` : ''}
                </span>
                <button className="expand-findbar__nav" onClick={() => jumpMatch(-1)} title="Previous (Shift+Enter)">↑</button>
                <button className="expand-findbar__nav" onClick={() => jumpMatch(1)}  title="Next (Enter)">↓</button>
                <button className="expand-findbar__close" onClick={closeSearch}>✕</button>
              </div>
            )}

            <div className="expand-editor-wrap">
              <div ref={mirrorRef} className="expand-mirror" aria-hidden="true" />
              <textarea
                ref={expandRef}
                className="expand-editor"
                spellCheck={false}
                onKeyDown={handleTab}
                onInput={handleEditorInput}
                onScroll={syncMirrorScroll}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
