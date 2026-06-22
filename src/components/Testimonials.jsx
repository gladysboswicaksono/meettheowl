import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../utils/tracker';

const testimonials = [
  {
    id: 'brenna-oneil',
    name: "Brenna O'Neil, Instructional Design Manager at Mews",
    tenure: 'My tenure: 2024 - present',
    text: `Gladys quickly immersed herself after her New Hire Orientation and began making significant contributions immediately. She introduced innovative ideas for incorporating storytelling and developed engaging hands-on activities, enhancing the overall learner experience. She has proven to <span style="color: #f6c785"><strong>work quickly, meeting all deadlines, while also maintaining a high standard.</strong></span><br><br>Beyond Instructional Design tasks, Gladys developed trained user levels and established metrics for measuring the number of active users. Her work has been instrumental in setting two of our departmental OKRs, reflecting her impact on our strategic goals.<br><br>Gladys' achievements over her first six months at Mews demonstrate what an asset she is to our team and the company, and we are very fortunate to have her on our team!`,
    keyQuote: `[Gladys] introduced innovative ideas for incorporating storytelling and developed engaging hands-on activities, enhancing the overall learner experience. She has proven to  <span style="color: #f6c785"><strong>work quickly, meeting all deadlines, while also maintaining a high standard</strong></span>.`,
  },
  {
    id: 'monika-anderova',
    name: 'Monika Anderova, Former Head of Global Education at Mews',
    tenure: 'My tenure: 2024 - present',
    text: `Gladys has done an outstanding job leading the Data and Measurement workstream within the Global Education team at Mews. She took the initiative to redefine our trained user levels, which provide a much more granular and effective way to track how prepared our clients are to use Mews products.<br><br>Her strategic thinking has been invaluable, particularly in <span style="color: #f6c785"><strong>identifying what needs to be measured and why</strong></span>. Beyond expectations, Gladys demonstrated incredible proactiveness and technical ability by building a dashboard herself. These efforts have provided new, actionable insights that were previously unavailable to the team.<br><br>Collaborating with her on this project has been a true pleasure, as her foresight and clarity have greatly enhanced our outcomes, and I look forward to seeing even more impact from her contributions moving forward!`,
    keyQuote: `Her strategic thinking has been invaluable, particularly in <span style="color: #f6c785"><strong>identifying what needs to be measured and why</strong></span> ... These efforts have provided new, actionable insights that were previously unavailable to the team.`,
  },
  {
    id: 'justyna-konieczny',
    name: 'Justyna Konieczny, Senior Instructional Designer at Mews',
    tenure: 'My tenure: 2024 - present',
    text: `Gladys is an invaluable peer reviewer, contributor, and sounding board when it comes to reviewing learning assets, data tracking, troubleshooting technical blockers, and iterating over content improvements. She is highly customer-centric who brings deep expertise to every project, translating industry challenges into relevant and tailored training. <br><br>She really is our data queen, creating and updating reporting frameworks to assess the impact of our initiatives and ensure data accuracy, transparency, and ease of use. Not only did she create templates and thorough documentation, but she is also open to troubleshooting issues over a call. <br><br>To sum up, Gladys is the <span style="color: #f6c785"><strong>collaborative, skilled, and thoughtful teammate every team needs</span></strong>. Her balance of technical know-how, open communication, and mutual support has consistently improved both daily project work and our team culture.`,
    keyQuote: `... Gladys is the <span style="color: #f6c785"><strong>collaborative, skilled, and thoughtful teammate every team needs</span></strong>. Her balance of technical know-how, open communication, and mutual support has consistently improved both daily project work and our team culture.`,
  },
  {
    id: 'tianyi-tian',
    name: 'Tianyi Tian, Former Academy Program Manager at Mendix',
    tenure: 'My tenure: 2022 - 2024',
    text: `Throughout my work with Gladys, she has consistently demonstrated an exceptional dedication to customer satisfaction. She has a <span style="color: #f6c785"><strong>talent for always asking the right questions</strong></span>, which not only ensures that the team does not miss out on important ideas to address the needs of our wide range of customers, but also uncovers latent customer desires, which helped us drive innovation and tailored solutions.<br><br>Her commitment to excellence sets a standard of service that positively impacts both our clients and our team.`,
    keyQuote: `[Gladys] has a <span style="color: #f6c785"><strong>talent for always asking the right questions</strong></span> ... Her commitment to excellence sets a standard of service that positively impacts both our clients and our team.`,
  },
  {
    id: 'audrey-fleur',
    name: 'Audrey Fleur, Former Senior Practical Facilitator at NHL Stenden Hospitality Group',
    tenure: 'My tenure: 2018 - 2022',
    text: `I had the pleasure of collaborating with Gladys on various L&D projects, and her insights and efforts have undoubtedly elevated our initiatives. She not only met deadlines and delivered high-quality work but also fostered a positive and inclusive working environment. Her <span style="color: #f6c785"><strong>approachability and willingness to share knowledge have made her a go-to person for collaboration and support</strong></span>.<br><br>Gladys is a hard-working and memorable professional, and an invaluable member of our organization who brings dedication and expertise to every project. I am confident that she will continue to make meaningful contributions in any future endeavors.`,
    keyQuote: `Her <span style="color: #f6c785"><strong>approachability and willingness to share knowledge have made her a go-to person</strong></span> for collaboration and support. Gladys is a hard-working and memorable professional, and an invaluable member of our organization ...`,
  },
  {
    id: 'laverne-york',
    name: 'LaVerne York, Former Human Capital Manager at NHL Stenden Hospitality Group',
    tenure: 'My tenure: 2018 - 2022',
    text: `I wholeheartedly recommend Gladys for her outstanding skills, creativity, and dedication to delivering high-quality learning experiences. She is an invaluable asset to our team, and I have no doubt that <span style="color: #f6c785"><strong>her contributions will continue to elevate our educational initiatives in the future</strong></span>.<br><br>In addition to her technical proficiency and collaborative mindset, her thought process stands out. She has a knack for grasping and turning complex concepts into digestable information that resonate well with our trainees, the team, and the stakeholders she works with.`,
    keyQuote: `She is an invaluable asset to our team, and I have no doubt that <span style="color: #f6c785"><strong>her contributions will continue to elevate our educational initiatives in the future</strong></span>.`,
  },
];

const testimonialIndexFromHash = () => {
  const id = window.location.hash.replace('#testimonial-', '');
  return testimonials.findIndex((testimonial) => testimonial.id === id);
};

export default function Testimonials() {
  const [current, setCurrent] = useState(() => {
    const linkedIndex = testimonialIndexFromHash();
    return linkedIndex >= 0 ? linkedIndex : 0;
  });
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notDesktop, setNotDesktop] = useState(false);
  const sectionRef = useRef(null);
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

  useEffect(() => {
    const showLinkedTestimonial = () => {
      const linkedIndex = testimonialIndexFromHash();
      if (linkedIndex < 0) return;

      setCurrent(linkedIndex);
      setExpanded(false);
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    };

    showLinkedTestimonial();
    window.addEventListener('hashchange', showLinkedTestimonial);
    return () => window.removeEventListener('hashchange', showLinkedTestimonial);
  }, []);

  const go = (i) => {
    const next = (i + total) % total;
    trackEvent('testimonial_slide', '/', testimonials[next].name);
    setCurrent(next);
    setExpanded(false);
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#testimonial-${testimonials[next].id}`
    );
    if (isMobile) sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Swipe navigation
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const paraStyle = { fontFamily: 'var(--font-body)', color: 'var(--gray)', fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '1rem' };
  const readMoreStyle = { fontFamily: 'var(--font-body)', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem 1.25rem', fontSize: '0.9375rem', cursor: 'pointer', marginTop: '0.5rem' };

  return (
    <section id="testimonials" ref={sectionRef} style={{ backgroundColor: 'var(--blue-bg)', padding: '5rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '3rem' }}>
          Others' Eyes
        </h2>

        {/* Card */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ backgroundColor: 'var(--blue-card)', position: 'relative' }}>

          {/* Prev — on card side (desktop only) */}
          {!notDesktop && (
            <button onClick={() => go(current - 1)} aria-label="Previous" className="testimonial-arrow" style={{
              position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
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
                <div style={paraStyle} dangerouslySetInnerHTML={{ __html: t.keyQuote }} />
                <button onClick={() => setExpanded(true)} style={readMoreStyle}>
                  Read more ↓
                </button>
              </>
            ) : (
              <>
                <div style={paraStyle} dangerouslySetInnerHTML={{ __html: t.text }} />
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
            <button onClick={() => go(current + 1)} aria-label="Next" className="testimonial-arrow" style={{
              position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
            }}>›</button>
          )}
        </div>

        {/* Dots — flanked by arrows on non-desktop */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
          {notDesktop && (
            <button onClick={() => go(current - 1)} aria-label="Previous" className="testimonial-arrow" style={{ marginRight: '0.5rem' }}>‹</button>
          )}
          {testimonials.map((testimonial, i) => (
            <button key={testimonial.id} onClick={() => go(i)} aria-label={`Show testimonial from ${testimonial.name}`} style={{
              height: '6px', width: i === current ? '2rem' : '0.5rem',
              borderRadius: '9999px', border: 'none', cursor: 'pointer',
              backgroundColor: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease', padding: 0,
            }} />
          ))}
          {notDesktop && (
            <button onClick={() => go(current + 1)} aria-label="Next" className="testimonial-arrow" style={{ marginLeft: '0.5rem' }}>›</button>
          )}
        </div>

      </div>
    </section>
  );
}
