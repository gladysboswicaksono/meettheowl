import { useState, useEffect, useRef } from 'react';

// ── Change this number to swap which project is featured ──────────
// 0 = Owllocate  1 = Training Impact  2 = Needs Analysis  3 = Onboarding
const FEATURED_INDEX = 1;

const projects = [
  {
    image: '/images/card-owllocate.png',
    imageAlt: 'Owllocate app on desktop and mobile',
    category: ['Customer Education'],
    title: 'Getting Started with Owllocate',
    featuredTitle: 'Getting Started with Owllocate',
    href: '/owllocate-get-started',
    tagline: 'Decrease support ticket volume by addressing knowledge gap',
    stats: [
      { value: 'THE GAP', label: 'Knowing where to click was not enough when the workflow had stakes, exceptions, and room for mistakes.' },
      { value: 'THE WORK', label: 'A hands-on simulation series built with character-led scenarios, progressive practice, and contextual feedback.' },
      { value: 'THE SHIFT', label: 'Trained users submitted 27% fewer support tickets on the topics they practiced.' },
    ],
  },
  {
    image: '/images/card-training-effectiveness.png',
    imageAlt: 'Report mock-up',
    category: ['AI, Data & Measurement', 'Customer Education'],
    title: 'Measuring Training Effectiveness',
    featuredTitle: 'Measuring Training Effectiveness',
    href: '/training-effectiveness',
    tagline: 'Increase team impact visibility by getting more data literate',
    stats: [
      { value: 'THE GAP', label: 'Would someone outside the team keep investing in education?' },
      { value: 'THE WORK', label: <>Training status mapped to product usage and behavior in SQL and Power BI.</> },
      { value: 'THE SHIFT', label: 'Learning projects now start with measurement targets tied to company goals.' },
    ],
  },
  {
    image: '/images/card-needs-analysis.png',
    imageAlt: 'Owl eye close-up with data overlay',
    category: ['AI, Data & Measurement'],
    title: 'Data & AI for Needs Analysis',
    featuredTitle: 'Data & AI for Needs Analysis',
    href: '/needs-analysis',
    tagline: 'Solve the right problem by accurately analyze qualitative data using AI',
    stats: [
      { value: 'The gap', label: 'AI findings look so credible that checking them felt unnecessary.' },
      { value: 'The work', label: 'A structured, source-verified approach to AI analysis of large-scale qualitative data.' },
      { value: 'The Shift', label: 'Learning design became more grounded in real user behavior and training effort focus on where training was needed. ' },
    ],
  },
  {
    image: '/images/card-onboarding.png',
    imageAlt: 'Welcome Onboard presentation on laptop',
    category: ['Internal Training'],
    title: 'Making Remote Onboarding Work',
    featuredTitle: 'Making Remote\nOnboarding Work',
    description: 'A two-day in-person orientation crucial for transferring essential knowledge — redesigned for virtual delivery when COVID made the traditional format impossible.',
    href: '/virtual-onboarding',
    tagline: 'Keep trainees job-ready and confident without in-person onboarding',
    stats: [
      { value: '>75%', label: 'Course\ncompletion rate' },
      { value: 'H5P', label: 'Interactive\nvideo format' },
      { value: 'Retained', label: 'Program kept\npost-COVID' },
    ],
  },
];

export default function ArtifactsShowcase() {
  const [selected, setSelected] = useState(FEATURED_INDEX);
  const [showBio, setShowBio] = useState(false);
  const [hasBeenUsed, setHasBeenUsed] = useState(false);
  const bioPanelRef = useRef(null);
  const p = projects[selected];

  useEffect(() => {
    if (showBio && bioPanelRef.current) {
      bioPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showBio]);

  return (
    <>
      <section className="showcase" id="artifacts">
        <div className="showcase__inner">

          {/* ── Left: sidebar ── */}
          <div className="showcase__sidebar">
            <div className="showcase__sidebar-header">
              <span className="showcase__sidebar-label">all artifacts</span>
            </div>

            <div className="showcase__sidebar-projects">
              {projects.map((proj, i) => (
                <div
                  key={proj.href}
                  className={`showcase__proj-item${selected === i ? ' showcase__proj-item--active' : ''}`}
                  onClick={() => setSelected(i)}
                >
                  <div className={`showcase__proj-thumb${selected === i ? ' showcase__proj-thumb--active' : ''}`}>
                    <img src={proj.image} alt={proj.imageAlt} />
                  </div>
                  <div className="showcase__proj-info">
                    <div className="showcase__proj-tags">
                      {proj.category.map(tag => (
                        <span key={tag} className="showcase__proj-tag">{tag}</span>
                      ))}
                    </div>
                    <span className="showcase__proj-title">{proj.title}</span>
                    <span className="showcase__proj-proof">
                      <img src="/icons/target.svg" aria-hidden="true" style={{ width: '11px', height: '11px', verticalAlign: 'middle', marginRight: '5px', marginBottom: '2px', opacity: 0.7 }} />
                      {proj.tagline}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── Right: full-bleed image + vignette + copy overlay ── */}
          <div className="showcase__left" key={selected}>
            <div className="showcase__bg">
              <img src={p.image} alt={p.imageAlt} />
            </div>
            <div className="showcase__vignette" />
            <div className="showcase__copy">
              {selected === FEATURED_INDEX && (
                <div className="showcase__featured-tag">Featured</div>
              )}
              <div className="showcase__eyebrow">{p.category.join(' · ')}</div>
              <h2 className="showcase__title">{p.featuredTitle}</h2>
              <p className="showcase__desc">{p.description}</p>
              <div className="showcase__stats">
                {p.stats.map(s => (
                  <div key={s.value} className="showcase__stat">
                    <span className="showcase__stat-value">{s.value}</span>
                    <span className="showcase__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <a href={p.href} className="btn-secondary">View Case Study →</a>
            </div>
          </div>

        </div>

        {/* ── Seam ribbon: floats over the showcase / testimonials boundary ── */}
        <div className="showcase__seam-ribbon">
          <span className="showcase__seam-meta"><span style={{ color: 'var(--gold)' }}>Product-minded</span> Learning Designer</span>
          <div className="showcase__seam-divider" />
          <span className="showcase__seam-meta">+7 years</span>
          <div className="showcase__seam-divider" />
          <span className="showcase__seam-meta">Mews</span>
          <div className="showcase__seam-divider" />
          <button
            type="button"
            className={`showcase__sidebar-more${!hasBeenUsed && !showBio ? ' showcase__sidebar-more--pulsing' : ''}`}
            onClick={() => {
              const next = !showBio;
              setShowBio(next);
              if (!next) setHasBeenUsed(true);
            }}
          >
            {showBio ? 'Close ↑' : "MEET ME ↓"}
          </button>
        </div>
      </section>

      {/* ── Bio panel: revealed on "Meet me" click ── */}
      {showBio && (
        <section className="bio-panel" id="bio" ref={bioPanelRef}>
          <div className="bio-panel__inner">

            {/* Left: portrait as vague bg, only left border, H1 overlay */}
            <div className="bio-panel__left">
              <div className="bio-panel__portrait">
                <img src="/images/hero-portrait.png" alt="" aria-hidden="true" />
              </div>
              <div className="bio-panel__vignette" />
              <div className="bio-panel__copy">
                <h2 className="bio-panel__heading">
                  I thrive on challenges that start in the dark, where solutions hide in patterns waiting to be seen.
                </h2>
              </div>
            </div>

            {/* Right: paragraphs with dividers */}
            <div className="bio-panel__right">
              <p className="bio-panel__para">
                Seven years and counting, I've turned complex learning challenges into measurable wins:{' '}
                <strong>faster onboarding</strong>,{' '}
                <strong>higher adoption</strong>, and{' '}
                <strong>significant cost savings</strong>.
              </p>
              <hr className="bio-panel__divider" />
              <p className="bio-panel__para">
                I've chosen depth in the craft over the ladder climb, growing as an{' '}
                <strong>Individual Contributor</strong>{' '}
                fluent in technical execution while building the business lens to create strategic value.
              </p>
              <hr className="bio-panel__divider" />
              <p className="bio-panel__para">
                Some people call me a self-starter, others call me a systems thinker. But you can just{' '}
                <strong>call me Gladys</strong>.
              </p>
            </div>

          </div>
        </section>
      )}
    </>
  );
}
