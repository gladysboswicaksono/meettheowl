import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent } from '../utils/tracker';

const SECTION_IDS = {
  '/': ['artifacts', 'testimonials', 'expertise'],
};

export default function Analytics() {
  const location = useLocation();

  // Page view — fires on every route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Section views — observe sections relevant to the current page
  useEffect(() => {
    const ids = SECTION_IDS[location.pathname] || [];
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          trackEvent('section_view', location.pathname, id);
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs?.disconnect());
  }, [location.pathname]);

  return null;
}
