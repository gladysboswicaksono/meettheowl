import { useState, useEffect, useRef } from 'react';

// ── Change this number to swap which project is featured ──────────
// 0 = Owllocate  1 = Training Impact  2 = Needs Analysis  3 = Onboarding
const FEATURED_INDEX = 1;

const projects = [
  {
    image: '/images/card-owllocate.png',
    imageAlt: 'Owllocate app on desktop and mobile',
    category: 'Customer Education',
    title: 'Getting Started with Owllocate',
    featuredTitle: 'Getting Started\nwith Owllocate',
    description: 'When work takes over, self-care and wellbeing slip through the cracks. This course bridges personal wellbeing and financial responsibility through habit formation that pays — literally.',
    href: '/owllocate-get-started',
    tagline: '~27% fewer support cases',
    stats: [
      { value: '~27%', label: 'Fewer support\ncases post-training' },
      { value: 'Storyline', label: 'Interactive\nsimulations' },
      { value: 'Live', label: 'Active\ncourse' },
    ],
  },
  {
    image: '/images/card-training-impact.png',
    imageAlt: 'Report mock-up',
    category: 'AI, Data & Measurement',
    title: 'Measuring Training Impact',
    featuredTitle: 'Measuring\nTraining Impact',
    description: '"Is training driving results?" is the question every stakeholder asks and most learning teams struggle to answer. This is the framework built so that question always has a data-backed answer.',
    href: '/training-impact',
    tagline: 'Trained rate entered OKRs',
    stats: [
      { value: 'OKR', label: 'Trained-user rate became\na company-wide KR.' },
      { value: 'SQL, Power BI & Claude API', label: 'Impact reporting with an\nAI interpreter for stakeholder questions.' },
      { value: 'Defensible Framework', label: 'Three-method framework for\nmeasuring training impact.' },
    ],
  },
  {
    image: '/images/card-needs-analysis.png',
    imageAlt: 'Owl eye close-up with data overlay',
    category: 'AI, Data & Measurement',
    title: 'Data & AI for Needs Analysis',
    featuredTitle: 'Data & AI for\nNeeds Analysis',
    description: "AI pattern-matches toward plausibility, not truth. That's why I treat it as a probabilistic assistant under audit — not a magic eight ball.",
    href: '/needs-analysis',
    tagline: '6-step audited methodology',
    stats: [
      { value: '6-step', label: 'Audited AI\nmethodology' },
      { value: 'Claude API', label: 'AI-assisted\nanalysis' },
      { value: 'Verified', label: 'Source-checked\noutput' },
    ],
  },
  {
    image: '/images/card-onboarding.png',
    imageAlt: 'Welcome Onboard presentation on laptop',
    category: 'Internal Enablement',
    title: 'Making Remote Onboarding Work',
    featuredTitle: 'Making Remote\nOnboarding Work',
    description: 'A two-day in-person orientation crucial for transferring essential knowledge — redesigned for virtual delivery when COVID made the traditional format impossible.',
    href: '/virtual-onboarding',
    tagline: '>75% completion, kept post-COVID',
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

          {/* ── Left: full-bleed image + vignette + copy overlay ── */}
          <div className="showcase__left">
            <div className="showcase__bg">
              <img src={p.image} alt={p.imageAlt} />
            </div>
            <div className="showcase__vignette" />
            <div className="showcase__copy">
              {selected === FEATURED_INDEX && (
                <div className="showcase__featured-tag">Featured</div>
              )}
              <div className="showcase__eyebrow">{p.category}</div>
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

          {/* ── Right: sidebar, full width to right edge ── */}
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
                    <span className="showcase__proj-tag">{proj.category}</span>
                    <span className="showcase__proj-title">{proj.title}</span>
                    <span className="showcase__proj-proof">{proj.tagline}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="showcase__sidebar-footer">
              <p className="showcase__sidebar-about">
                Product-minded Learning Designer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+7 years&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mews
              </p>
              <button
                type="button"
                className="showcase__sidebar-more"
                onClick={() => setShowBio(b => !b)}
              >
                {showBio ? 'Close ↑' : 'Meet me ↓'}
              </button>
            </div>
          </div>

        </div>
        <div className="showcase__bottom-bar" />
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
