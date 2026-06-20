const workLinks = [
  { label: 'Getting Started with Owllocate',     href: '/owllocate-get-started' },
  { label: 'Measuring Training Effectiveness', href: '/training-effectiveness' },
  { label: 'Data & AI for Needs Analysis',  href: '/needs-analysis' },
  { label: 'Making Remote Onboarding Work', href: '/virtual-onboarding' },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--dark)', color: 'var(--gray)', position: 'relative', overflow: 'hidden' }}>

      {/* Ghost owl watermark — large, top-right, bleeds off edge */}
      <img
        src="/images/owl-outline.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', right: 0, top: '50%',
          transform: 'translateY(-50%)',
          height: '85%', width: 'auto', opacity: 0.15, pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem 2rem' }}>

        {/* Gold bar + tagline */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ width: '64px', height: '2px', backgroundColor: 'var(--gold)', marginBottom: '1rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '22px', fontWeight: '600', color: 'var(--gray)', letterSpacing: '0.08em' }}>
            Rooted in truth, driven by possibility, adaptable in motion.
          </p>
        </div>

        {/* Work links */}
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', marginBottom: '2.5rem' }}>
          {workLinks.map(link => (
            <a key={link.href} href={link.href} className="footer-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <hr style={{ borderColor: 'rgba(232,230,230,0.15)', marginBottom: '1.5rem' }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 0.75rem' }}>
          {['Gladys Bos-Wicaksono', 'meettheowl.com'].map((item, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(232,230,230,0.7)' }}>
              {item}
              <span style={{ opacity: 0.4 }}>•</span>
            </span>
          ))}
          <a
            href="https://www.linkedin.com/in/gladys-bos-wicaksono/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-cta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Get in Touch
          </a>
        </div>

      </div>
    </footer>
  );
}
