import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function TooltipTerm({ term, desc, status, statusType }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0 });
  const ref = useRef(null);
  const closeTimer = useRef(null);

  const getPos = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.bottom + 8 });
    }
  };

  const show = () => { clearTimeout(closeTimer.current); getPos(); setOpen(true); };
  const hide = () => { closeTimer.current = setTimeout(() => setOpen(false), 100); };
  const cancelHide = () => clearTimeout(closeTimer.current);

  const onTouchStart = (e) => { e.preventDefault(); clearTimeout(closeTimer.current); getPos(); setOpen(true); };
  const onTouchEnd = (e) => { e.preventDefault(); setOpen(false); };

  return (
    <>
      <span
        ref={ref}
        className={`tooltip-term${open ? ' tooltip-term--active' : ''}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {term}
      </span>
      {open && createPortal(
        <>
          <div className="tooltip-overlay" onMouseDown={() => setOpen(false)} />
          <div
            className="tooltip-panel"
            style={{ top: pos.top }}
            onMouseEnter={cancelHide}
            onMouseLeave={hide}
          >
            <div className="tooltip-panel__top">
              <span className="tooltip-panel__label">{term}</span>
              {status && (
                <span className={`project-status-tag project-status-tag--${statusType}`}>
                  {status}
                </span>
              )}
            </div>
            <span className="tooltip-panel__desc">{desc}</span>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
