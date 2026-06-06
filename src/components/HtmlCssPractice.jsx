import { useRef, useState, useEffect } from 'react';
import { classify, normalizeHTML, buildFeedbackText } from '../utils/htmlClassifier';

// ── Iframe baseline styles ──────────────────────────────────────────────────
const SANDBOX_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Crimson+Pro:ital,wght@0,200..900;1,200..900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: transparent; padding: 12px; font-family: 'Crimson Pro', Georgia, serif; color: #E8E6E6; font-size: 16px; line-height: 1.5; }
  h1 { font-size: 26px; font-weight: 900; color: #E8E6E6; font-family: 'Cinzel', serif; }
  h2 { font-size: 21px; font-weight: 700; color: #E8E6E6; font-family: 'Cinzel', serif; }
  h3 { font-size: 19px; color: #E8E6E6; font-family: 'Cinzel', serif; }
  p  { font-size: 16px; color: #E8E6E6; }
  a  { color: #F6C785; }
  strong { font-weight: 700; color: #FAFAF8; }
  hr { border: none; border-top: 1px solid #525252; margin: 6px 0; }
  pre, code { font-family: monospace; font-size: 13px; color: #F6C785; }
  img { max-width: 100%; }
`;

const PLACEHOLDER_SRCDOC = `<!DOCTYPE html><html><head><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Georgia, serif; }
  p { font-size: 13px; color: rgba(232,230,230,0.35); font-style: italic; }
</style></head><body><p>Write your code and press Run</p></body></html>`;

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

// ── Feedback type → CSS modifier class ─────────────────────────────────────
const TYPE_CLASS = {
  MATCH: 'is-match',
  SUPERSET: 'is-superset',
  PARTIAL: 'is-partial',
  DIVERGENT: 'is-divergent',
};

// ── Component ───────────────────────────────────────────────────────────────
export default function HtmlCssPractice() {
  const textareaRef  = useRef(null);
  const iframeRef    = useRef(null);
  const expandRef    = useRef(null);
  const attemptCount = useRef(0);

  const [feedbackType, setFeedbackType] = useState(null);   // 'MATCH' | 'PARTIAL' | ...
  const [feedbackText, setFeedbackText] = useState(null);   // HTML string or null
  const [showNudge,    setShowNudge]    = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [expandOpen,   setExpandOpen]   = useState(false);

  // Set placeholder on mount
  useEffect(() => {
    if (iframeRef.current) iframeRef.current.srcdoc = PLACEHOLDER_SRCDOC;
  }, []);

  // Sync value into expanded editor when modal opens
  useEffect(() => {
    if (expandOpen && expandRef.current && textareaRef.current) {
      expandRef.current.value = textareaRef.current.value;
      expandRef.current.focus();
    }
  }, [expandOpen]);

  // Escape closes modal
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && expandOpen) closeExpand();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expandOpen]);

  // ── Expand modal ──────────────────────────────────────────────────────────
  function openExpand() { setExpandOpen(true); }

  function closeExpand() {
    // Write expanded content back to the main textarea before closing
    if (textareaRef.current && expandRef.current) {
      textareaRef.current.value = expandRef.current.value;
    }
    setExpandOpen(false);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) closeExpand();
  }

  // ── Run code ──────────────────────────────────────────────────────────────
  async function runCode() {
    const userHTML = textareaRef.current?.value?.trim() ?? '';

    // Render to output iframe
    if (iframeRef.current) {
      iframeRef.current.srcdoc = userHTML
        ? `<!DOCTYPE html><html><head><style>${SANDBOX_CSS}</style></head><body>${userHTML}</body></html>`
        : PLACEHOLDER_SRCDOC;
    }

    if (!userHTML) {
      setFeedbackType(null);
      setFeedbackText(null);
      setShowNudge(false);
      return;
    }

    const nodes  = normalizeHTML(userHTML);
    const result = classify(nodes, 'html-text-tags');
    attemptCount.current++;

    if (result.type === 'DIVERGENT') {
      setFeedbackType('DIVERGENT');
      setFeedbackText('Checking your code…');
      setIsLoading(true);
      try {
        const resp = await fetch('https://meettheowl-com-api.vercel.app/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exerciseId: 'html-text-tags', structure: nodes }),
        });
        setFeedbackText(resp.ok
          ? await resp.text()
          : 'Your structure looks different from what the exercise asks for. Try starting with the five tags listed in the instructions.');
      } catch {
        setFeedbackText('Your structure looks different from what the exercise asks for. Try starting with the five tags listed in the instructions.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setFeedbackType(result.type);
      setFeedbackText(buildFeedbackText(result));
    }

    const isWrong = result.type !== 'MATCH' && result.type !== 'SUPERSET';
    if (isWrong && attemptCount.current >= 3) {
      setShowNudge(true);
    } else if (!isWrong) {
      setShowNudge(false);
      attemptCount.current = 0; // reset on success
    }
  }

  // ── Derived UI ────────────────────────────────────────────────────────────
  const feedbackClass = [
    'lesson-feedback',
    feedbackType ? TYPE_CLASS[feedbackType] : '',
  ].filter(Boolean).join(' ');

  const bodyClass = [
    'lesson-feedback__body',
    feedbackText ? 'has-content' : '',
  ].filter(Boolean).join(' ');

  const defaultMsg = 'Run your code to see feedback.';

  return (
    <>
      <div className="lesson__divider">&#9997;&#65039; Write it yourself<hr /></div>

      <div className="practice">
        {/* Prompt */}
        <div className="practice__prompt">
          Recreate the expected output. Write an <code>&lt;h1&gt;</code> for the title, an{' '}
          <code>&lt;h2&gt;</code> and <code>&lt;h3&gt;</code> beneath it, then two{' '}
          <code>&lt;p&gt;</code> paragraphs. Run it — the five lines stack, headings largest at the
          top.
        </div>

        {/* Expected output (left) | Your output iframe (right) */}
        <div className="practice__top">
          <div className="practice__panel">
            <div className="practice__head">
              <span className="practice__label">Expected output</span>
            </div>
            <div className="practice__expected">
              <div className="res-h1">Meet me!</div>
              <div className="res-h2">I am {'{Name}'}</div>
              <div className="res-h3">My interest</div>
              <div className="res-p">I like learning new things.</div>
              <div className="res-p">Right now, I&rsquo;m learning HTML fundamentals.</div>
            </div>
          </div>
          <div className="practice__panel">
            <div className="practice__head">
              <span className="practice__label">Your output</span>
            </div>
            <iframe
              ref={iframeRef}
              className="practice__iframe"
              sandbox="allow-same-origin"
              title="Your output"
            />
          </div>
        </div>

        {/* Code editor (below, full width) */}
        <div className="practice__output">
          <div className="practice__output-head">
            <span className="practice__label">Your code</span>
            <div className="practice__actions">
              <button className="practice__btn" onClick={openExpand}>
                &#10562; expand
              </button>
              <button
                className="practice__btn practice__btn--run"
                onClick={runCode}
                disabled={isLoading}
              >
                run &#9654;
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className="practice__editor"
            spellCheck={false}
            placeholder="Write your HTML here..."
            onKeyDown={handleTab}
          />
        </div>

        {/* Feedback */}
        <div className={feedbackClass}>
          <span className="lesson-feedback__label">Feedback</span>
          <div
            className={bodyClass}
            dangerouslySetInnerHTML={feedbackText ? { __html: feedbackText } : undefined}
          >
            {!feedbackText && defaultMsg}
          </div>
          {showNudge && feedbackText && (
            <a className="lesson-feedback__nudge" href="#section-text-tags">
              Review the Text tags section &rarr;
            </a>
          )}
        </div>
      </div>

      {/* ── Expand modal ────────────────────────────────────── */}
      {expandOpen && (
        <div
          className="expand-overlay open"
          onClick={handleOverlayClick}
        >
          <div className="expand-modal">
            <div className="expand-modal__header">
              <span className="expand-modal__title">Your Code — HTML Exercise</span>
              <button className="expand-modal__close" onClick={closeExpand}>
                &#10005; close
              </button>
            </div>
            <textarea
              ref={expandRef}
              className="expand-editor"
              spellCheck={false}
              onKeyDown={handleTab}
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
