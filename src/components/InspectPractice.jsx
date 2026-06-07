import { useState, useEffect, useRef } from 'react';

// ── Source code (displayed + editable in the right panel) ─────────────────
export const SOURCE = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:wght@400;700&display=swap" rel="stylesheet">
<style>

/* ── Page content (heading + intro) ── */
.page-content {
  padding: 32px 32px 24px;
  background: #FAFAF8;
  border-bottom: 1px solid #e0dede;
}
.page-heading {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 700;
  color: #2A2A2A;
  margin: 0 0 12px;
}
.page-body {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 16px;
  line-height: 1.3;
  color: #525252;
  margin: 0;
}

/* ── Wrapper ── */
.stepper {
  background: #FAFAF8;
  border: 1px solid rgba(246,199,133,0.25);
  border-radius: 10px;
  overflow: hidden;
}

/* ── Header label ── */
.stepper__label {
  background: #E8E6E6;
  color: #2A2A2A;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-bottom: 1px solid #d4d2d2;
}

/* ── Step buttons grid ── */
.stepper__steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

/* ── Individual step button ── */
.stepper__step {
  background: #FAFAF8;
  border: 1px solid #d4d2d2;
  border-radius: 6px;
  padding: 12px 10px;
  text-align: center;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: #2A2A2A;
  cursor: pointer;
}
.stepper__step.is-active {
  background: #5B0606;
  border-color: #5B0606;
  color: #FAFAF8;
}
.stepper__step.is-done {
  background: #2A2A2A;
  border-color: #2A2A2A;
  color: #F6C785;
}

/* ── Detail panel ── */
.stepper__detail {
  background: #E8E6E6;
  border-radius: 8px;
  padding: 22px 24px;
  margin-bottom: 16px;
}
.stepper__detail-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 700;
  color: #5B0606;
  text-transform: uppercase;
  margin: 0 0 10px;
}
.stepper__detail-body {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 17px;
  color: #2A2A2A;
  line-height: 1.65;
  margin: 0;
}

/* ── Navigation controls ── */
.stepper__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stepper__btn {
  background: #2A2A2A;
  color: #FAFAF8;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}
.stepper__btn.ghost {
  background: transparent;
  color: #2A2A2A;
  border: 1px solid #2A2A2A;
}
.stepper__btn:disabled { opacity: 0.35; cursor: not-allowed; }
.stepper__counter {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: #525252;
  letter-spacing: 0.04em;
}

</style>
</head>

<!-- ═══ HTML Structure ══════════════════════════════════════════════════ -->
<body style="margin: 0; background: #FAFAF8;">

<div class="page-content">
  <h3 class="page-heading">Tips to work with AI to build your course</h3>
  <p class="page-body">The output quality depends almost entirely on what you give AI upfront. Without a design system to reference, it defaults to generic styles. Without a defined pattern, it creates something that works in isolation but is a nightmare to reuse and maintain.</p>
  <br>
  <p class="page-body">These <strong>five steps</strong> are not only gonna help you produce something <strong>more consistent</strong> but also <strong>scalable</strong> and <strong>maintainable</strong>.</p>
</div>

<div style="padding: 20px; background: #1C253C;">
<div class="stepper">
  <div class="stepper__label">
    Tips to work with AI to build your course
  </div>
  <div style="padding: 24px;">
    <div class="stepper__steps" id="steps"></div>
    <div class="stepper__detail">
      <h4 class="stepper__detail-title" id="detail-title"></h4>
      <p  class="stepper__detail-body"  id="detail-body"></p>
    </div>
    <div class="stepper__controls">
      <button class="stepper__btn ghost" id="btn-prev" onclick="go(-1)">← Previous</button>
      <span   class="stepper__counter"   id="counter"></span>
      <button class="stepper__btn"       id="btn-next" onclick="go(1)">Next step →</button>
    </div>
  </div>
</div>
</div>

<!-- ═══ JavaScript ══════════════════════════════════════════════════════ -->
<script>
const steps = [
  { label:'Step 1', title:'Point it to your design system',     body:"Have a file with your themes, colors, and fonts that AI can reference." },
  { label:'Step 2', title:'Design the pattern',                  body:'Name the interaction: stepper, accordion, hotspot, knowledge check.' },
  { label:'Step 3', title:'Specify the output',                  body:'Single HTML or separated files — be explicit about what you need.' },
  { label:'Step 4', title:'Ask for readable names and comments', body:'Tell it to name classes descriptively and add comments above each section.' },
  { label:'Step 5', title:'Create reusable components',          body:'Ask it to save reusable components in a centralized folder.' },
];
let active = 0;

function render() {
  document.getElementById('steps').innerHTML = steps.map((s, i) => \`
    <button class="stepper__step\${i===active?' is-active':i<active?' is-done':''}"
            onclick="setStep(\${i})">
      <span style="display:block;font-size:10px;opacity:0.7">\${s.label}</span>
      \${s.title}
    </button>\`).join('');
  document.getElementById('detail-title').textContent = steps[active].title;
  document.getElementById('detail-body').textContent  = steps[active].body;
  document.getElementById('counter').textContent = \`\${active+1} of \${steps.length}\`;
  document.getElementById('btn-prev').disabled = active === 0;
  document.getElementById('btn-next').disabled = active === steps.length - 1;
}

function setStep(i) { active = i; render(); }
function go(dir) {
  active = Math.max(0, Math.min(steps.length-1, active+dir));
  render();
}

render();
</script>

</body>
</html>`;

// ── Section map: class → search anchors in the source ────────────────────
// startSearch: text to find (start of selection)
// endSearch: text that marks end of the region (exclusive)
export const SECTION_MAP = {
  'stepper-wrapper': {
    startSearch: '/* ── Wrapper ── */',
    endSearch:   '/* ── Header label ── */',
    label: '.stepper',
    desc: 'The outer container — sets the white background, rounded corners, and gold border.',
  },
  'stepper-label': {
    startSearch: '/* ── Header label ── */',
    endSearch:   '/* ── Step buttons grid ── */',
    label: '.stepper__label',
    desc: 'The gray header bar at the top. Cinzel font, uppercase, bordered bottom.',
  },
  'stepper-steps': {
    startSearch: '/* ── Step buttons grid ── */',
    endSearch:   '/* ── Individual step button ── */',
    label: '.stepper__steps',
    desc: 'CSS Grid — repeat(5, 1fr) splits the 5 step buttons into equal columns.',
  },
  'stepper-step': {
    startSearch: '/* ── Individual step button ── */',
    endSearch:   '/* ── Detail panel ── */',
    label: '.stepper__step',
    desc: 'Each step button. State variants .is-active (red) and .is-done (dark) are added by the JS render() function.',
  },
  'stepper-detail': {
    startSearch: '/* ── Detail panel ── */',
    endSearch:   '/* ── Navigation controls ── */',
    label: '.stepper__detail',
    desc: 'The content panel that shows the active step title and body. JS writes into it on every step change.',
  },
  'stepper-controls': {
    startSearch: '/* ── Navigation controls ── */',
    endSearch:   '</style>',
    label: '.stepper__controls',
    desc: 'Flex row that pushes the Previous button, counter, and Next button to the left, center, and right.',
  },
  'stepper-btn': {
    startSearch: '.stepper__btn {',
    endSearch:   '.stepper__counter',
    label: '.stepper__btn',
    desc: 'The dark pill button. .ghost flips to transparent with a border. :disabled lowers opacity.',
  },
};

// ── Inspect script injected into the live iframe ──────────────────────────
const CLASS_SECTIONS = {
  stepper:                 'stepper-wrapper',
  stepper__label:          'stepper-label',
  stepper__steps:          'stepper-steps',
  stepper__step:           'stepper-step',
  stepper__detail:         'stepper-detail',
  'stepper__detail-title': 'stepper-detail',
  'stepper__detail-body':  'stepper-detail',
  stepper__controls:       'stepper-controls',
  stepper__btn:            'stepper-btn',
  stepper__counter:        'stepper-controls',
};

const INSPECT_SCRIPT = `<script>
(function() {
  const CS = ${JSON.stringify(CLASS_SECTIONS)};
  function findSection(el) {
    let curr = el;
    while (curr && curr !== document.body) {
      for (let i = 0; i < curr.classList.length; i++) {
        if (CS[curr.classList[i]]) return { section: CS[curr.classList[i]], el: curr };
      }
      curr = curr.parentElement;
    }
    return null;
  }
  let inspectMode = false, hovered = null, selected = null;
  function clearHover() {
    if (hovered && hovered !== selected) { hovered.style.outline = ''; hovered.style.outlineOffset = ''; }
    hovered = null;
  }
  function clearSelected() {
    if (selected) { selected.style.outline = ''; selected.style.outlineOffset = ''; selected = null; }
  }
  window.addEventListener('message', function(e) {
    if (!e.data) return;
    if (e.data.type === 'inspect-on')  { inspectMode = true;  document.body.style.cursor = 'crosshair'; }
    if (e.data.type === 'inspect-off') { inspectMode = false; document.body.style.cursor = ''; clearHover(); clearSelected(); }
  });
  document.addEventListener('mouseover', function(e) {
    if (!inspectMode) return;
    clearHover();
    const f = findSection(e.target);
    if (f && f.el !== selected) { hovered = f.el; hovered.style.outline = '2px dashed #F6C785'; hovered.style.outlineOffset = '2px'; }
  });
  document.addEventListener('mouseout', function(e) { if (inspectMode) clearHover(); });
  document.addEventListener('click', function(e) {
    if (!inspectMode) return;
    e.stopPropagation(); e.preventDefault();
    const f = findSection(e.target);
    if (f) {
      clearHover(); clearSelected();
      selected = f.el; selected.style.outline = '2px solid #F6C785'; selected.style.outlineOffset = '2px';
      window.parent.postMessage({ type: 'inspect-click', section: f.section }, '*');
    }
  }, true);
})();
<\/script>`;

function buildIframeSrc(code) {
  return code.includes('</body>')
    ? code.replace('</body>', INSPECT_SCRIPT + '\n</body>')
    : code + INSPECT_SCRIPT;
}

function handleTab(e) {
  if (e.key !== 'Tab') return;
  e.preventDefault();
  const ta = e.target;
  const s = ta.selectionStart, end = ta.selectionEnd;
  ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(end);
  ta.selectionStart = ta.selectionEnd = s + 2;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function InspectPractice() {
  const [inspectOn, setInspectOn]           = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState(null);
  const [iframeSrc, setIframeSrc]           = useState(() => buildIframeSrc(SOURCE));
  const [expandOpen, setExpandOpen]         = useState(false);

  const iframeRef       = useRef(null);
  const editorRef       = useRef(null);
  const expandEditorRef = useRef(null);

  // Sync expand editor when modal opens
  useEffect(() => {
    if (expandOpen && expandEditorRef.current && editorRef.current) {
      expandEditorRef.current.value = editorRef.current.value;
      expandEditorRef.current.focus();
    }
  }, [expandOpen]);

  // ESC closes expand
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && expandOpen) closeExpand(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expandOpen]);

  // Listen for inspect clicks from iframe
  useEffect(() => {
    function onMessage(e) {
      if (e.data?.type !== 'inspect-click') return;
      const key = e.data.section;
      if (!SECTION_MAP[key]) return;
      setActiveSectionKey(key);
      selectInEditor(key, editorRef.current);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function selectInEditor(key, ta) {
    if (!ta) return;
    const info = SECTION_MAP[key];
    const text = ta.value;
    const start = text.indexOf(info.startSearch);
    if (start === -1) return;
    const rawEnd = info.endSearch ? text.indexOf(info.endSearch, start) : -1;
    const end = rawEnd === -1 ? Math.min(start + 500, text.length) : rawEnd;
    ta.focus();
    ta.setSelectionRange(start, end);
    // Scroll the textarea so the selection is visible
    const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 20;
    const line = text.substring(0, start).split('\n').length;
    ta.scrollTop = Math.max(0, (line - 4)) * lineH;
  }

  function toggleInspect() {
    const next = !inspectOn;
    setInspectOn(next);
    if (!next) setActiveSectionKey(null);
    iframeRef.current?.contentWindow?.postMessage(
      { type: next ? 'inspect-on' : 'inspect-off' }, '*'
    );
  }

  function run(sourceEl) {
    const code = (sourceEl ?? editorRef.current)?.value ?? SOURCE;
    setIframeSrc(buildIframeSrc(code));
    setActiveSectionKey(null);
    if (inspectOn) {
      // Re-activate inspect after the iframe reloads
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'inspect-on' }, '*');
      }, 300);
    }
  }

  function openExpand() { setExpandOpen(true); }

  function closeExpand() {
    if (editorRef.current && expandEditorRef.current) {
      editorRef.current.value = expandEditorRef.current.value;
    }
    setExpandOpen(false);
  }

  const sectionInfo = activeSectionKey ? SECTION_MAP[activeSectionKey] : null;

  return (
    <>
      <div className="inspect-practice">

        {/* ── Left: live preview ───────────────────────── */}
        <div className="inspect-practice__preview">
          <div className="inspect-practice__toolbar">
            <span className="inspect-practice__filename">stepper.html</span>
            <button
              className={`inspect-btn${inspectOn ? ' is-active' : ''}`}
              onClick={toggleInspect}
            >
              {inspectOn ? '✕ Stop' : '⬚ Inspect'}
            </button>
          </div>
          {inspectOn && (
            <div className="inspect-practice__hint">
              Click any element to jump to its code
            </div>
          )}
          <iframe
            ref={iframeRef}
            className="inspect-practice__iframe"
            srcDoc={iframeSrc}
            sandbox="allow-scripts"
            title="Stepper preview"
          />
        </div>

        {/* ── Right: editable code panel ───────────────── */}
        <div className="inspect-practice__code">
          <div className="inspect-practice__code-header">
            <span className="inspect-practice__filename">stepper.html</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {sectionInfo
                ? <span className="inspect-tag">{sectionInfo.label}</span>
                : <span className="inspect-tag inspect-tag--muted">
                    {inspectOn ? 'click an element ↑' : 'edit + run'}
                  </span>
              }
              <button className="inspect-btn" onClick={openExpand} title="Expand editor">⤢</button>
              <button className="inspect-btn inspect-btn--run" onClick={() => run()}>Run ▶</button>
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

      {/* ── Expand modal ─────────────────────────────── */}
      {expandOpen && (
        <div className="expand-overlay open" onClick={e => { if (e.target === e.currentTarget) closeExpand(); }}>
          <div className="expand-modal">
            <div className="expand-modal__header">
              <span className="expand-modal__title">stepper.html</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="inspect-btn inspect-btn--run"
                  onClick={() => { run(expandEditorRef.current); }}
                >
                  Run ▶
                </button>
                <button className="expand-modal__close" onClick={closeExpand}>
                  ✕ close
                </button>
              </div>
            </div>
            <textarea
              ref={expandEditorRef}
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
