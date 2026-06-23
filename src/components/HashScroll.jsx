import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function HashScroll() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (!hash) return undefined;

    const id = decodeURIComponent(hash.slice(1));
    const scrollToTarget = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    };

    scrollToTarget();
    const frame = window.requestAnimationFrame(scrollToTarget);

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
