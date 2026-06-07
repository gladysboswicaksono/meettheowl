import { useCallback, useRef, useState, useEffect } from 'react';

// ── Virtual file system ─────────────────────────────────────────────────────
const EDIT_FILES = {
  index: {
    name: 'index.html',
    readOnly: true,
    content: `<div class="course-card">
  <h2 class="course-heading">Introduction to Owllocate</h2>
  <p class="course-meta">Module 1 · 15 min</p>
</div>`,
  },
  style: {
    name: 'style.css',
    readOnly: false,
    content: `.course-heading {
  color: #2563eb;
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.course-meta {
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #4b5563;
}`,
  },
};

const TARGET_COLOR   = 'rgb(91, 6, 6)';
const ORIGINAL_COLOR = 'rgb(37, 99, 235)';

// ── Inject hidden element, read computed color, clean up ───────────────────
function checkHeadingColor(userCSS) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
  const el = document.createElement('div');
  el.className = 'course-heading-check';
  wrapper.appendChild(el);
  document.body.appendChild(wrapper);

  const base = document.createElement('style');
  base.dataset.colorCheck = 'base';
  base.textContent = '.course-heading-check { color: #2563eb; }';
  document.head.appendChild(base);

  // Re-map the user's .course-heading rule onto .course-heading-check
  const remapped = userCSS.replace(/\.course-heading\b/g, '.course-heading-check');
  const user = document.createElement('style');
  user.dataset.colorCheck = 'user';
  user.textContent = remapped;
  document.head.appendChild(user);

  const computed = getComputedStyle(el).color;

  document.body.removeChild(wrapper);
  document.querySelectorAll('style[data-color-check]').forEach(s => s.remove());
  return computed;
}

// ── Tab-indent helper ───────────────────────────────────────────────────────
function handleTab(e) {
  if (e.key !== 'Tab') return;
  e.preventDefault();
  const el = e.target;
  const start = el.selectionStart;
  const end   = el.selectionEnd;
  el.value = el.value.substring(0, start) + '  ' + el.value.substring(end);
  el.selectionStart = el.selectionEnd = start + 2;
}

// ── Feedback type → CSS modifier ────────────────────────────────────────────
const TYPE_CLASS = {
  MATCH: 'is-match',
  PARTIAL: 'is-partial',
};

// ── Component ───────────────────────────────────────────────────────────────
export default function HtmlCssApplyIt() {
  const editorRef  = useRef(null);
  const expandRef  = useRef(null);

  // Which files have been opened (tabs) + which is active
  const [openTabs,     setOpenTabs]     = useState({ style: true });
  const [activeFile,   setActiveFile]   = useState('style');
  const [isReadOnly,   setIsReadOnly]   = useState(false);

  // Live preview heading color (starts as original blue)
  const [headingColor, setHeadingColor] = useState('#2563eb');
  const [inspectOpen,  setInspectOpen]  = useState(false);

  // Feedback
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackText, setFeedbackText] = useState(null);

  // Expand modal
  const [expandOpen,   setExpandOpen]   = useState(false);

  const closeExpand = useCallback(() => {
    if (editorRef.current && expandRef.current && !isReadOnly) {
      editorRef.current.value = expandRef.current.value;
    }
    setExpandOpen(false);
  }, [isReadOnly]);

  // Auto-focus editor and set initial value on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.value = EDIT_FILES.style.content;
    }
  }, []);

  // Sync expand editor value on open
  useEffect(() => {
    if (expandOpen && expandRef.current && editorRef.current) {
      expandRef.current.value = editorRef.current.value;
      expandRef.current.readOnly = isReadOnly;
      expandRef.current.dataset.readonly = isReadOnly ? 'true' : 'false';
      if (!isReadOnly) expandRef.current.focus();
    }
  }, [expandOpen, isReadOnly]);

  // Escape closes modal
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && expandOpen) closeExpand();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expandOpen, closeExpand]);

  // ── File navigation ────────────────────────────────────────────────────────
  function openFile(key) {
    const file = EDIT_FILES[key];
    if (!file) return;

    // Save current content back before switching
    if (editorRef.current && activeFile) {
      EDIT_FILES[activeFile].content = editorRef.current.value;
    }

    setOpenTabs(prev => ({ ...prev, [key]: true }));
    setActiveFile(key);
    setIsReadOnly(file.readOnly);

    if (editorRef.current) {
      editorRef.current.value = file.content;
      editorRef.current.readOnly = file.readOnly;
      editorRef.current.dataset.readonly = file.readOnly ? 'true' : 'false';
    }
  }

  // ── Apply CSS edit ─────────────────────────────────────────────────────────
  function applyEdit() {
    const css = editorRef.current?.value ?? '';
    const color = checkHeadingColor(css);

    // Always update the live preview
    setHeadingColor(color);

    if (color === TARGET_COLOR) {
      setFeedbackType('MATCH');
      setFeedbackText(
        <>That's it. The heading is now <code>#5B0606</code> — matching the brand red.</>,
      );
    } else if (color === ORIGINAL_COLOR) {
      setFeedbackType('PARTIAL');
      setFeedbackText(
        <>The color hasn't changed yet — it's still the original blue. Find the <code>color</code> property inside <code>.course-heading</code> and update its value.</>,
      );
    } else {
      setFeedbackType('PARTIAL');
      setFeedbackText(
        <>The color updated, but it's not quite right. The target is <code>#5B0606</code> — check the hex value and try again.</>,
      );
    }
  }

  // ── Expand modal ───────────────────────────────────────────────────────────
  function openExpand() { setExpandOpen(true); }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) closeExpand();
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const feedbackClass = [
    'lesson-feedback',
    feedbackType ? TYPE_CLASS[feedbackType] : '',
  ].filter(Boolean).join(' ');

  const bodyClass = [
    'lesson-feedback__body',
    feedbackText ? 'has-content' : '',
  ].filter(Boolean).join(' ');

  const activeFile_obj = EDIT_FILES[activeFile];
  const expandTitle = activeFile_obj
    ? (isReadOnly ? `Viewing — ${activeFile_obj.name}` : `Editing — ${activeFile_obj.name}`)
    : 'Editor';

  return (
    <>
      <div className="lesson__divider" id="section-edit-files">&#127912; Apply It<hr /></div>

      <div className="apply-section">
        {/* Prompt */}
        <div className="apply-section__prompt">
          The heading color needs to match the brand. Open <code>style.css</code>, find the{' '}
          <code>.course-heading</code> rule, and change the <code>color</code> property to the brand
          red: <code>#5B0606</code>. Press Apply when ready.
        </div>

        <div className="apply-section__body">

          {/* Side-by-side previews */}
          <div className="edit-previews">
            <div>
              <div className="edit-preview-label">
                Current Output
                <button
                  className="inspect-btn"
                  onClick={() => setInspectOpen(v => !v)}
                >
                  Inspect
                </button>
              </div>
              <div className="course-card-sim">
                <div
                  className="course-card-sim__heading"
                  style={{ color: headingColor }}
                >
                  Introduction to Owllocate
                </div>
                <div className="course-card-sim__body">Module 1 · 15 min</div>
              </div>
              {inspectOpen && (
                <div className="inspect-callout">
                  &lt;div class="course-heading"&gt;<br />
                  &nbsp;&nbsp;color: <span style={{ color: '#86efac' }}>{headingColor}</span>;<br />
                  &lt;/div&gt;
                </div>
              )}
            </div>
            <div>
              <div className="edit-preview-label">Target Output</div>
              <div className="course-card-sim">
                <div className="course-card-sim__heading" style={{ color: '#5B0606' }}>
                  Introduction to Owllocate
                </div>
                <div className="course-card-sim__body">Module 1 · 15 min</div>
              </div>
            </div>
          </div>

          {/* File explorer */}
          <div className="file-explorer">
            <span className="file-explorer__label">Files</span>
            <button className="file-btn" onClick={() => openFile('index')}>
              &#128196; index.html
            </button>
            <button className="file-btn" onClick={() => openFile('style')}>
              &#127912; style.css
            </button>
          </div>

          {/* Tab strip */}
          <div className="editor-tab-strip">
            {Object.keys(openTabs).map(key => {
              const f = EDIT_FILES[key];
              return (
                <button
                  key={key}
                  className={`editor-tab-strip__tab${key === activeFile ? ' active' : ''}`}
                  onClick={() => openFile(key)}
                >
                  {f.readOnly ? '' : '● '}{f.name}
                </button>
              );
            })}
          </div>

          {/* Code editor */}
          <textarea
            ref={editorRef}
            className="edit-editor"
            spellCheck={false}
            placeholder="Open a file to edit…"
            onKeyDown={handleTab}
            data-readonly={isReadOnly ? 'true' : 'false'}
          />

          {/* Actions */}
          <div className="apply-actions">
            <button className="practice__btn" onClick={openExpand}>
              &#10562; expand
            </button>
            <button className="practice__btn practice__btn--run" onClick={applyEdit}>
              apply &#9654;
            </button>
          </div>

          {/* Feedback */}
          <div className={feedbackClass} style={{ marginTop: '14px', borderRadius: '4px' }}>
            <span className="lesson-feedback__label">Feedback</span>
            <div className={bodyClass}>
              {feedbackText || 'Apply your changes to see feedback.'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Expand modal ──────────────────────────────────── */}
      {expandOpen && (
        <div className="expand-overlay open" onClick={handleOverlayClick}>
          <div className="expand-modal">
            <div className="expand-modal__header">
              <span className="expand-modal__title">{expandTitle}</span>
              <button className="expand-modal__close" onClick={closeExpand}>
                &#10005; close
              </button>
            </div>
            <textarea
              ref={expandRef}
              className="expand-editor"
              spellCheck={false}
              onKeyDown={handleTab}
              data-readonly={isReadOnly ? 'true' : 'false'}
            />
            <div className="expand-modal__footer">
              <button className="practice__btn practice__btn--run" onClick={closeExpand}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
