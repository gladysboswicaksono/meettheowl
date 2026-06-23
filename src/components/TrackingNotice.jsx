import { useCallback, useEffect, useRef, useState } from 'react';
import { getFirstTrackingResult } from '../utils/tracker';

const STORAGE_KEY = 'tracking-notice-seen';
export const DISMISS_TRACKING_NOTICE = 'dismiss-tracking-notice';

export default function TrackingNotice() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const showTimer = useRef(null);
  const closeTimer = useRef(null);
  const unmountTimer = useRef(null);
  const dismissed = useRef(false);

  const dismiss = useCallback(() => {
    dismissed.current = true;
    window.localStorage.setItem(STORAGE_KEY, '1');
    window.clearTimeout(showTimer.current);
    window.clearTimeout(closeTimer.current);
    setVisible(false);
    unmountTimer.current = window.setTimeout(() => setMounted(false), 350);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === '1') return undefined;

    let cancelled = false;
    const delay = new Promise((resolve) => {
      showTimer.current = window.setTimeout(resolve, 2000);
    });

    Promise.all([getFirstTrackingResult(), delay]).then(([trackingResult]) => {
      if (cancelled || dismissed.current || trackingResult === 'failed') return;

      window.localStorage.setItem(STORAGE_KEY, '1');
      setMounted(true);
      window.requestAnimationFrame(() => setVisible(true));
      closeTimer.current = window.setTimeout(dismiss, 20000);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(showTimer.current);
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(unmountTimer.current);
    };
  }, [dismiss]);

  useEffect(() => {
    window.addEventListener(DISMISS_TRACKING_NOTICE, dismiss);
    return () => window.removeEventListener(DISMISS_TRACKING_NOTICE, dismiss);
  }, [dismiss]);

  if (!mounted) return null;

  return (
    <aside
      className={`tracking-dialog${visible ? ' tracking-dialog--visible' : ''}`}
      role="dialog"
      aria-labelledby="tracking-dialog-title"
      aria-describedby="tracking-dialog-description"
    >
      <div id="tracking-dialog-description">
        <p>
          This portfolio uses a <strong>temporary site tracking</strong> to understand which pages and sections people click through,
          how long they spend there, and what device type they use.
        </p>
        <p>
          <strong>No IP address, location, or any personal data are tracked</strong>. I use the data to keep improving
          the portfolio.
        </p>
      </div>
      <button type="button" onClick={dismiss}>GOT IT</button>
    </aside>
  );
}
