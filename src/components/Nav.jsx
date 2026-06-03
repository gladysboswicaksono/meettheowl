import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ARTIFACT_PAGES = [
  { label: 'Getting Started with Owllocate', href: '/owllocate-get-started' },
  { label: 'Measuring Training Impact', href: '/training-impact' },
  { label: 'Data & AI for Needs Analysis', href: '/needs-analysis' },
  { label: 'Making Remote Onboarding Work', href: '/virtual-onboarding' },
];

const SECTIONS = [
  { label: "Others' Eyes", id: 'testimonials' },
  { label: "What You'd Get", id: 'expertise' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  // Scroll-spy: highlight the section currently crossing the viewport's center.
  useEffect(() => {
    if (!onHome) { setActive(''); return; }
    const ids = ['artifacts', 'testimonials', 'expertise'];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="/" className="nav__brand">
          <img src="/images/logo-navigation.png" alt="MeetTheOwl" className="nav__logo" />
          <span className="nav__name">
            Gladys Bos-Wicaksono&nbsp;&nbsp;|&nbsp;&nbsp;meettheowl.com
          </span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>

        <nav className={`nav__links${open ? ' nav__links--open' : ''}`} aria-label="Sections">
          {/* The Artifacts — section link with a dropdown of its detail pages */}
          <div className="nav__item nav__item--dropdown">
            <a
              href="/#artifacts"
              className={`nav__link${active === 'artifacts' ? ' active' : ''}`}
              onClick={close}
            >
              The Artifacts
              <span className="nav__caret" aria-hidden="true">▾</span>
            </a>
            <div className="nav__dropdown">
              {ARTIFACT_PAGES.map((p) => (
                <a key={p.href} href={p.href} className="nav__dropdown-link" onClick={close}>
                  {p.label}
                </a>
              ))}
            </div>
          </div>

          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`/#${s.id}`}
              className={`nav__link${active === s.id ? ' active' : ''}`}
              onClick={close}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
