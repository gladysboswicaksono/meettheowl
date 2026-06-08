import { useEffect, useRef, useState } from 'react';

function handleTab(e) {
  if (e.key !== 'Tab') return;
  e.preventDefault();
  const editor = e.target;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  editor.value = `${editor.value.substring(0, start)}  ${editor.value.substring(end)}`;
  editor.selectionStart = editor.selectionEnd = start + 2;
}

function findMatches(query, text) {
  if (!query) return [];
  const results = [];
  const lower = text.toLowerCase();
  const target = query.toLowerCase();
  let index = 0;

  while ((index = lower.indexOf(target, index)) !== -1) {
    results.push({ start: index, end: index + target.length });
    index += target.length;
  }
  return results;
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function CodeEditor({
  editorRef,
  defaultValue = '',
  placeholder,
  label = 'Your code',
  expandedTitle = label,
  status,
  description,
  onRun,
  runDisabled = false,
}) {
  const expandRef = useRef(null);
  const mirrorRef = useRef(null);
  const searchRef = useRef(null);
  const matchesRef = useRef([]);
  const backdropPressRef = useRef(false);

  const [expandOpen, setExpandOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchIdx, setMatchIdx] = useState(0);
  const [matchCount, setMatchCount] = useState(0);

  function updateMirror(text, query, currentIdx) {
    const mirror = mirrorRef.current;
    if (!mirror) return;
    if (!query || matchesRef.current.length === 0) {
      mirror.innerHTML = `${escapeHtml(text)}\n`;
      return;
    }

    let html = '';
    let last = 0;
    matchesRef.current.forEach((match, index) => {
      const className = index === currentIdx
        ? 'find-highlight find-highlight--current'
        : 'find-highlight';
      html += escapeHtml(text.slice(last, match.start));
      html += `<span class="${className}">${escapeHtml(text.slice(match.start, match.end))}</span>`;
      last = match.end;
    });
    mirror.innerHTML = `${html}${escapeHtml(text.slice(last))}\n`;
  }

  function syncMirrorScroll() {
    if (mirrorRef.current && expandRef.current) {
      mirrorRef.current.scrollTop = expandRef.current.scrollTop;
      mirrorRef.current.scrollLeft = expandRef.current.scrollLeft;
    }
  }

  function scrollToMatch(index) {
    const editor = expandRef.current;
    if (!editor || matchesRef.current.length === 0) return;
    const match = matchesRef.current[index];
    const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 20;
    const line = editor.value.substring(0, match.start).split('\n').length;
    editor.scrollTop = Math.max(0, line - 4) * lineHeight;
    syncMirrorScroll();
  }

  function applySearch(query, currentIdx = 0) {
    const editor = expandRef.current;
    if (!editor) return;
    const matches = findMatches(query, editor.value);
    matchesRef.current = matches;
    setMatchCount(matches.length);
    const nextIdx = matches.length > 0 ? Math.min(currentIdx, matches.length - 1) : 0;
    setMatchIdx(nextIdx);
    updateMirror(editor.value, query, nextIdx);
    if (matches.length > 0) scrollToMatch(nextIdx);
  }

  function jumpMatch(direction) {
    if (matchesRef.current.length === 0) return;
    const next = (matchIdx + direction + matchesRef.current.length) % matchesRef.current.length;
    setMatchIdx(next);
    updateMirror(expandRef.current?.value ?? '', searchQuery, next);
    scrollToMatch(next);
    searchRef.current?.focus();
  }

  function closeSearch(focusEditor = true) {
    setSearchOpen(false);
    setSearchQuery('');
    setMatchIdx(0);
    setMatchCount(0);
    matchesRef.current = [];
    const editor = expandRef.current;
    if (editor) updateMirror(editor.value, '', 0);
    if (focusEditor) editor?.focus();
  }

  function openExpand() {
    setExpandOpen(true);
  }

  function syncExpandedValue() {
    if (editorRef.current && expandRef.current) {
      editorRef.current.value = expandRef.current.value;
    }
  }

  function closeExpand() {
    syncExpandedValue();
    closeSearch(false);
    setExpandOpen(false);
  }

  function run(value = editorRef.current?.value ?? '') {
    if (editorRef.current) editorRef.current.value = value;
    onRun?.(value);
  }

  function runExpanded() {
    const value = expandRef.current?.value ?? '';
    run(value);
    closeExpand();
  }

  function handleEditorInput() {
    const editor = expandRef.current;
    if (!editor) return;
    const matches = findMatches(searchQuery, editor.value);
    matchesRef.current = matches;
    setMatchCount(matches.length);
    const nextIdx = matches.length > 0 ? Math.min(matchIdx, matches.length - 1) : 0;
    setMatchIdx(nextIdx);
    updateMirror(editor.value, searchQuery, nextIdx);
  }

  useEffect(() => {
    if (!expandOpen || !expandRef.current || !editorRef.current) return;
    expandRef.current.value = editorRef.current.value;
    expandRef.current.focus();
    updateMirror(expandRef.current.value, '', 0);
  }, [expandOpen, editorRef]);

  useEffect(() => {
    function onKey(e) {
      if (!expandOpen) return;
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery('');
          setMatchIdx(0);
          setMatchCount(0);
          matchesRef.current = [];
          const expandedEditor = expandRef.current;
          if (expandedEditor && mirrorRef.current) {
            mirrorRef.current.innerHTML = `${escapeHtml(expandedEditor.value)}\n`;
          }
          expandedEditor?.focus();
        } else {
          if (editorRef.current && expandRef.current) {
            editorRef.current.value = expandRef.current.value;
          }
          setExpandOpen(false);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
    }

    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [expandOpen, searchOpen, editorRef]);

  return (
    <>
      <div className="practice__output">
        <div className="practice__output-head">
          <span className="practice__label">{label}</span>
          <div className="practice__actions">
            {status}
            <button className="practice__btn" onClick={openExpand}>
              &#10562; expand
            </button>
            <button
              className="practice__btn practice__btn--run"
              onClick={() => run()}
              disabled={runDisabled}
            >
              run &#9654;
            </button>
          </div>
        </div>
        {description}
        <textarea
          ref={editorRef}
          className="practice__editor"
          defaultValue={defaultValue}
          spellCheck={false}
          placeholder={placeholder}
          onKeyDown={handleTab}
        />
      </div>

      {expandOpen && (
        <div
          className="expand-overlay open"
          onPointerDown={e => {
            backdropPressRef.current = e.target === e.currentTarget;
          }}
          onPointerUp={e => {
            if (backdropPressRef.current && e.target === e.currentTarget) closeExpand();
            backdropPressRef.current = false;
          }}
          onPointerCancel={() => {
            backdropPressRef.current = false;
          }}
        >
          <div className="expand-modal">
            <div className="expand-modal__header">
              <span className="expand-modal__title">{expandedTitle}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="expand-search-hint">Ctrl+F to search</span>
                <button
                  className="expand-modal__close"
                  onClick={closeExpand}
                  aria-label="Close expanded editor"
                  title="Close"
                >
                  &#10005;
                </button>
              </div>
            </div>

            {searchOpen && (
              <div className="expand-findbar">
                <input
                  ref={searchRef}
                  className="expand-findbar__input"
                  placeholder="Find in editor..."
                  value={searchQuery}
                  onChange={e => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    applySearch(query, 0);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      e.stopPropagation();
                      closeSearch();
                    }
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      jumpMatch(e.shiftKey ? -1 : 1);
                    }
                  }}
                />
                <span className="expand-findbar__count">
                  {matchCount === 0 && searchQuery
                    ? 'no results'
                    : matchCount > 0
                      ? `${matchIdx + 1} / ${matchCount}`
                      : ''}
                </span>
                <button className="expand-findbar__nav" onClick={() => jumpMatch(-1)} title="Previous (Shift+Enter)">&#8593;</button>
                <button className="expand-findbar__nav" onClick={() => jumpMatch(1)} title="Next (Enter)">&#8595;</button>
                <button className="expand-findbar__close" onClick={() => closeSearch()} aria-label="Close search">&#10005;</button>
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

            <div className="expand-modal__footer">
              <button className="practice__btn practice__btn--run" onClick={runExpanded}>
                run &#9654;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
