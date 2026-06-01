import { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    name: "Brenna O'Neil, Instructional Design Manager at Mews",
    tenure: 'My tenure: 2024 - present',
    highlight: 'She has proven to work quickly, meeting all deadlines, while also maintaining a high standard.',
    body: [
      "Gladys quickly immersed herself after her New Hire Orientation and began making significant contributions immediately. She introduced innovative ideas for incorporating storytelling and developed engaging hands-on activities, enhancing the overall learner experience.",
      "Beyond Instructional Design tasks, Gladys developed trained user levels and established metrics for measuring the number of active users. Her work has been instrumental in setting two of our departmental OKRs, reflecting her impact on our strategic goals.",
      "Gladys' achievements over her first six months at Mews demonstrate what an asset she is to our team and the company, we are very fortunate to have her on our team!",
    ],
  },
  {
    name: 'Monika Anderova, Former Head of Global Education at Mews',
    tenure: 'My tenure: 2024 - present',
    highlight: 'Her strategic thinking has been invaluable, particularly in identifying what needs to be measured and why.',
    body: [
      "Gladys has done an outstanding job leading the Data and Measurement workstream within the Global Education team at Mews. She took the initiative to redefine our trained user levels, which provide a much more granular and effective way to track how prepared our clients are to use Mews products.",
      "Beyond expectations, Gladys demonstrated incredible proactiveness and technical ability by building a dashboard herself. These efforts have provided new, actionable insights that were previously unavailable to the team.",
      "Collaborating with her on this project has been a true pleasure, as her foresight and clarity have made the process smooth and impactful.",
    ],
  },
  {
    name: 'Tianyi Tian, Former Academy Program Manager at Mendix',
    tenure: 'My tenure: 2022 - 2024',
    highlight: 'She has a talent for always asking the right questions.',
    body: [
      "Throughout my work with Gladys, she has consistently demonstrated an exceptional dedication to customer satisfaction. She has a talent for always asking the right questions, which not only ensures that the team does not miss out on important ideas to address the needs of our wide range of customers, but also uncovers latent customer desires, which helped us drive innovation and tailored solutions.",
      "Her commitment to excellence sets a standard of service that positively impacts both our clients and our team.",
    ],
  },
  {
    name: 'Audrey, Former Senior Practical Facilitator at NHL Stenden Hospitality Group',
    tenure: 'My tenure: 2018 - 2022',
    highlight: 'Her approachability and willingness to share knowledge have made her a go-to person for collaboration and support.',
    body: [
      "I had the pleasure of collaborating with Gladys on various L&D projects, and her insights and efforts have undoubtedly elevated our initiatives. She not only met deadlines and deliver high-quality work but also fostered a positive and inclusive working environment.",
      "Gladys is a hard-working and memorable professional, and an invaluable member of our organization who brings dedication and expertise to every project. I am confident that she will continue to make meaningful contributions in any future endeavors.",
    ],
  },
  {
    name: 'La Verne York, Former Human Capital Manager at NHL Stenden Hospitality Group',
    tenure: 'My tenure: 2018 - 2022',
    highlight: 'I have no doubt that her contributions will continue to elevate our educational initiatives in the future.',
    body: [
      "I wholeheartedly recommend Gladys for her outstanding skills, creativity, and dedication to delivering high-quality learning experiences. She is an invaluable asset to our team, and I have no doubt that her contributions will continue to elevate our educational initiatives in the future.",
      "In addition to her technical proficiency and collaborative mindset, her reasoning ability stands out. She has a knack to grasp and turn complex concepts into digestible information that resonate well with our trainees, the team, and the stakeholders she works with.",
    ],
  },
];

function renderWithHighlight(text, highlight) {
  if (!text.includes(highlight)) return text;
  const [before, after] = text.split(highlight);
  return <>{before}<strong style={{ color: 'var(--gold)', fontWeight: 600 }}>{highlight}</strong>{after}</>;
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notDesktop, setNotDesktop] = useState(false);
  const total = testimonials.length;
  const t = testimonials[current];

  useEffect(() => {
    const phoneMq = window.matchMedia('(max-width: 600px)');
    const tabletMq = window.matchMedia('(max-width: 900px)');
    const update = () => { setIsMobile(phoneMq.matches); setNotDesktop(tabletMq.matches); };
    update();
    phoneMq.addEventListener('change', update);
    tabletMq.addEventListener('change', update);
    return () => {
      phoneMq.removeEventListener('change', update);
      tabletMq.removeEventListener('change', update);
    };
  }, []);

  const go = (i) => { setCurrent((i + total) % total); setExpanded(false); };

  // Swipe navigation
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const paraStyle = { fontFamily: 'var(--font-body)', color: 'var(--gray)', fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '1rem' };
  const readMoreStyle = { fontFamily: 'var(--font-body)', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem 1.25rem', fontSize: '0.9375rem', cursor: 'pointer', marginTop: '0.5rem' };
  const arrowBase = {
    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
    color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flex: '0 0 auto', padding: 0,
  };

  return (
    <section style={{ backgroundColor: 'var(--blue-bg)', padding: '5rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '3rem' }}>
          Others' Eyes
        </h2>

        {/* Card */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ backgroundColor: 'var(--blue-card)', position: 'relative' }}>

          {/* Prev — on card side (desktop only) */}
          {!notDesktop && (
            <button onClick={() => go(current - 1)} aria-label="Previous" style={{
              ...arrowBase, position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
            }}>‹</button>
          )}

          {/* Slide */}
          <div style={{ borderLeft: '4px solid var(--gold)', paddingLeft: '2rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.125rem', textAlign: 'center', fontVariant: 'small-caps', marginBottom: '0.25rem' }}>
              {t.name}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'rgba(232,230,230,0.6)', fontSize: '0.9375rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              {t.tenure}
            </p>
            <div style={{ width: '5rem', height: '1px', backgroundColor: 'var(--gold)', margin: '0 auto 1.5rem' }} />
            {isMobile && !expanded ? (
              <>
                <p style={{ ...paraStyle, color: 'var(--gold)', fontWeight: 600 }}>
                  {t.highlight}
                </p>
                <button onClick={() => setExpanded(true)} style={readMoreStyle}>
                  Read more ↓
                </button>
              </>
            ) : (
              <>
                {t.body.map((para, i) => (
                  <p key={i} style={paraStyle}>
                    {renderWithHighlight(para, t.highlight)}
                  </p>
                ))}
                {isMobile && (
                  <button onClick={() => setExpanded(false)} style={readMoreStyle}>
                    Read less ↑
                  </button>
                )}
              </>
            )}
          </div>

          {/* Next — on card side (desktop only) */}
          {!notDesktop && (
            <button onClick={() => go(current + 1)} aria-label="Next" style={{
              ...arrowBase, position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
            }}>›</button>
          )}
        </div>

        {/* Dots — flanked by arrows on non-desktop */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
          {notDesktop && (
            <button onClick={() => go(current - 1)} aria-label="Previous" style={{ ...arrowBase, marginRight: '0.5rem' }}>‹</button>
          )}
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Testimonial ${i + 1}`} style={{
              height: '6px', width: i === current ? '2rem' : '0.5rem',
              borderRadius: '9999px', border: 'none', cursor: 'pointer',
              backgroundColor: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease', padding: 0,
            }} />
          ))}
          {notDesktop && (
            <button onClick={() => go(current + 1)} aria-label="Next" style={{ ...arrowBase, marginLeft: '0.5rem' }}>›</button>
          )}
        </div>

      </div>
    </section>
  );
}
