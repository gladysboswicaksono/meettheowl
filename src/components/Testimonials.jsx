import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../utils/tracker';

const MIN_SWIPE_DISTANCE = 80;
const HORIZONTAL_SWIPE_RATIO = 1.5;

const testimonialTabs = [
  { id: 'speed-to-impact', label: 'Speed to Impact (2)' },
  { id: 'strategic-systems-thinking', label: 'Strategic Involvement (3)' },
  { id: 'collaboration-customer-centricity', label: 'Peer Collaboration (3)' },
];

const testimonials = [
  {
    id: 'brenna-oneil-one',
    tabId: 'speed-to-impact',
    name: "Brenna O'Neil, Instructional Design Manager at Mews",
    tenure: 'My tenure: 2024 - present',
    text: `Gladys quickly immersed herself after her New Hire Orientation and began making significant contributions immediately. She introduced innovative ideas for incorporating storytelling and developed engaging hands-on activities, enhancing the overall learner experience. She has proven to <span style="color: #f6c785"><strong>work quickly, meeting all deadlines, while also maintaining a high standard.</strong></span><br><br>Beyond Instructional Design tasks, Gladys developed trained user levels and established metrics for measuring the number of active users. Her work has been instrumental in setting two of our departmental OKRs, reflecting her impact on our strategic goals.<br><br>Gladys' achievements over her first six months at Mews demonstrate what an asset she is to our team and the company, and we are very fortunate to have her on our team!`,
    keyQuote: `Gladys introduced innovative ideas for incorporating storytelling and developed engaging hands-on activities, enhancing the overall learner experience. She has proven to  <span style="color: #f6c785"><strong>work quickly, meeting all deadlines, while also maintaining a high standard</strong></span>.`,
  },
  {
    id: 'matt-jeffrey',
    tabId: 'speed-to-impact',
    name: "Matt Jeffrey, Learning Strategy Specialist at Mews",
    tenure: 'My tenure: 2024 - present',
    text: `As [another teammate] said, "It feels like she's been with us for 6 months, not 6 weeks!". Gladys contributed so much in such a short space of time, with a confidence and charisma that shines through always. Not only does she bring motivation and enthusiasm to every conversation but <span style="color: #f6c785"><strong>she has a wealth of fresh perspective and an openness to share that is so beneficial for all of us, for Mews, and for our customers</strong></span>. Thank you, Gladys!`,
    keyQuote: '... It feels like Gladys has been with us for 6 months, not 6 weeks! ... Not only does she bring motivation and enthusiasm to every conversation but <span style="color: #f6c785"><strong>she has a wealth of fresh perspective and an openness to share that is so beneficial for all of us, for Mews, and for our customers</strong></span>.',
  },
  {
    id: 'monika-anderova',
    tabId: 'strategic-systems-thinking',
    name: 'Monika Anderova, Former Head of Global Education at Mews',
    tenure: 'My tenure: 2024 - present',
    text: `Gladys has done an outstanding job leading the Data and Measurement workstream within the Global Education team at Mews. She took the initiative to redefine our trained user levels, which provide a much more granular and effective way to track how prepared our clients are to use Mews products.<br><br>Her strategic thinking has been invaluable, particularly in <span style="color: #f6c785"><strong>identifying what needs to be measured and why</strong></span>. Beyond expectations, Gladys demonstrated incredible proactiveness and technical ability by building a dashboard herself. These efforts have provided new, actionable insights that were previously unavailable to the team.<br><br>Collaborating with her on this project has been a true pleasure, as her foresight and clarity have greatly enhanced our outcomes, and I look forward to seeing even more impact from her contributions moving forward!`,
    keyQuote: `Her strategic thinking has been invaluable, particularly in <span style="color: #f6c785"><strong>identifying what needs to be measured and why</strong></span> ... These efforts have provided new, actionable insights that were previously unavailable to the team.`,
  },
  {
    id: 'brenna-oneil',
    tabId: 'strategic-systems-thinking',
    name: "Brenna O'Neil, Instructional Design Manager at Mews",
    tenure: 'My tenure: 2024 - present',
    text: `One of Gladys' strongest contributions has been ensuring that learning initiatives are grounded in real customer needs and measurable outcomes rather than assumptions. Across complex topics, <span style="color: #f6c785"><strong>she has designed learning experiences that demonstrate clear behavioral impact and operational value</strong></span>. Her transition into a Learning Architect role has helped move evaluation from an isolated activity into a more integrated workflow that instructional designers can use independently. <br><br> Through frameworks and coaching, Gladys has enabled the team to better understand training impact, make more informed priortization decisions, and increase confidence when discussing outcomes with stakeholders. Her ability to translate complexity into usable guidance extends her work beyond individual delivery and raises the capability level of the entire team.`,
    keyQuote: `Across complex topics, Gladys has <span style="color: #f6c785"><strong>designed learning experiences that demonstrate clear behavioral impact and operational value</strong></span> ... Her ability to translate complexity into usable guidance extends her work beyond individual delivery and raises the capability level of the entire team.`,
  },
  {
    id: 'laverne-york',
    tabId: 'strategic-systems-thinking',
    name: 'LaVerne York, Former Human Capital Manager at NHL Stenden Hospitality Group',
    tenure: 'My tenure: 2018 - 2022',
    text: `I wholeheartedly recommend Gladys for her outstanding skills, creativity, and dedication to delivering high-quality learning experiences. She is an invaluable asset to our team, and I have no doubt that <span style="color: #f6c785"><strong>her contributions will continue to elevate our educational initiatives in the future</strong></span>.<br><br>In addition to her technical proficiency and collaborative mindset, her thought process stands out. She has a knack for grasping and turning complex concepts into digestable information that resonate well with our trainees, the team, and the stakeholders she works with.`,
    keyQuote: `She is an invaluable asset to our team, and I have no doubt that <span style="color: #f6c785"><strong>her contributions will continue to elevate our educational initiatives in the future</strong></span>.`,
  },
  {
    id: 'justyna-konieczny',
    tabId: 'collaboration-customer-centricity',
    name: 'Justyna Konieczny, Senior Instructional Designer at Mews',
    tenure: 'My tenure: 2024 - present',
    text: `Gladys is an invaluable peer reviewer, contributor, and sounding board when it comes to reviewing learning assets, data tracking, troubleshooting technical blockers, and iterating over content improvements. She is highly customer-centric who brings deep expertise to every project, translating industry challenges into relevant and tailored training. <br><br>She really is our data queen, creating and updating reporting frameworks to assess the impact of our initiatives and ensure data accuracy, transparency, and ease of use. Not only did she create templates and thorough documentation, but she is also open to troubleshooting issues over a call. <br><br>To sum up, Gladys is the <span style="color: #f6c785"><strong>collaborative, skilled, and thoughtful teammate every team needs</span></strong>. Her balance of technical know-how, open communication, and mutual support has consistently improved both daily project work and our team culture.`,
    keyQuote: `... Gladys is the <span style="color: #f6c785"><strong>collaborative, skilled, and thoughtful teammate every team needs</span></strong>. Her balance of technical know-how, open communication, and mutual support has consistently improved both daily project work and our team culture.`,
  },
  {
    id: 'tianyi-tian',
    tabId: 'collaboration-customer-centricity',
    name: 'Tianyi Tian, Former Academy Program Manager at Mendix (A Siemens Business)',
    tenure: 'My tenure: 2022 - 2024',
    text: `Throughout my work with Gladys, she has consistently demonstrated an exceptional dedication to customer satisfaction. She has a <span style="color: #f6c785"><strong>talent for always asking the right questions</strong></span>, which not only ensures that the team does not miss out on important ideas to address the needs of our wide range of customers, but also uncovers latent customer desires, which helped us drive innovation and tailored solutions.<br><br>Her commitment to excellence sets a standard of service that positively impacts both our clients and our team.`,
    keyQuote: `Gladys has a <span style="color: #f6c785"><strong>talent for always asking the right questions</strong></span> ... Her commitment to excellence sets a standard of service that positively impacts both our clients and our team.`,
  },
  {
    id: 'audrey-fleur',
    tabId: 'collaboration-customer-centricity',
    name: 'Audrey Fleur, Former Senior Practical Facilitator at NHL Stenden Hospitality Group',
    tenure: 'My tenure: 2018 - 2022',
    text: `I had the pleasure of collaborating with Gladys on various L&D projects, and her insights and efforts have undoubtedly elevated our initiatives. She not only met deadlines and delivered high-quality work but also fostered a positive and inclusive working environment. Her <span style="color: #f6c785"><strong>approachability and willingness to share knowledge have made her a go-to person for collaboration and support</strong></span>.<br><br>Gladys is a hard-working and memorable professional, and an invaluable member of our organization who brings dedication and expertise to every project. I am confident that she will continue to make meaningful contributions in any future endeavors.`,
    keyQuote: `Her <span style="color: #f6c785"><strong>approachability and willingness to share knowledge have made her a go-to person</strong></span> for collaboration and support. Gladys is a hard-working and memorable professional, and an invaluable member of our organization ...`,
  },
];

const testimonialIndexFromHash = () => {
  const id = window.location.hash.replace('#testimonial-', '');
  return testimonials.findIndex((testimonial) => testimonial.id === id);
};

const getTabLabel = (tabId) => testimonialTabs.find((tab) => tab.id === tabId)?.label || '';

const firstIndexForTab = (tabId) => testimonials.findIndex((testimonial) => testimonial.tabId === tabId);

export default function Testimonials() {
  const [current, setCurrent] = useState(() => {
    const linkedIndex = testimonialIndexFromHash();
    return linkedIndex >= 0 ? linkedIndex : 0;
  });
  const [expanded, setExpanded] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notDesktop, setNotDesktop] = useState(false);
  const sectionRef = useRef(null);
  const total = testimonials.length;
  const t = testimonials[current];
  const activeTabId = t.tabId;

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
    setThemeMenuOpen(false);
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#testimonial-${testimonials[next].id}`
    );
    if (isMobile) sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const switchTab = (tabId) => {
    const next = firstIndexForTab(tabId);
    if (next >= 0) go(next);
  };

  const activeTabLabel = getTabLabel(activeTabId);
  const inactiveTabs = testimonialTabs.filter((tab) => tab.id !== activeTabId);

  // Swipe navigation
  const touchStart = useRef(null);
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const isHorizontalSwipe = Math.abs(dx) >= MIN_SWIPE_DISTANCE
      && Math.abs(dx) >= Math.abs(dy) * HORIZONTAL_SWIPE_RATIO;

    if (isHorizontalSwipe) go(current + (dx < 0 ? 1 : -1));
    touchStart.current = null;
  };

  const paraStyle = { fontFamily: 'var(--font-body)', color: 'var(--gray)', fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '1rem' };
  const readMoreStyle = { fontFamily: 'var(--font-body)', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem 1.25rem', fontSize: '0.9375rem', cursor: 'pointer', marginTop: '0.5rem' };

  return (
    <section id="testimonials" ref={sectionRef} style={{ backgroundColor: 'var(--blue-bg)', padding: '5rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '3rem' }}>
          Others' Eyes
        </h2>

        <div className="tabs testimonial-theme-tabs" role="tablist" aria-label="Testimonial themes">
          {testimonialTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn${activeTabId === tab.id ? ' active' : ''}`}
              onClick={() => switchTab(tab.id)}
              role="tab"
              aria-selected={activeTabId === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="testimonial-stage">
          <nav className="testimonial-theme-nav" aria-label="Testimonial themes">
            <button
              type="button"
              className="testimonial-theme-pill"
              onClick={() => setThemeMenuOpen((open) => !open)}
              aria-expanded={themeMenuOpen}
              aria-controls="testimonial-theme-menu"
            >
              <span>{activeTabLabel}</span>
              <span className="testimonial-theme-pill__chevron" aria-hidden="true" />
            </button>
            <div
              id="testimonial-theme-menu"
              className={`testimonial-theme-menu${themeMenuOpen ? ' is-open' : ''}`}
              hidden={!themeMenuOpen}
            >
              {inactiveTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className="testimonial-theme-option"
                  onClick={() => switchTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

        {/* Card */}
        <div className="testimonial-card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

          {/* Prev — on card side (desktop only) */}
          {!notDesktop && (
            <button onClick={() => go(current - 1)} aria-label="Previous" className="testimonial-arrow" style={{
              position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
            }}>‹</button>
          )}

          {/* Slide */}
          <div className={`testimonial-slide testimonial-slide--${activeTabId}`}>
            {t.isPlaceholder ? (
              <div style={paraStyle}>{t.keyQuote}</div>
            ) : isMobile && !expanded ? (
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
            <div className="testimonial-person">
              <div className="testimonial-person__rule" />
              <h3>{t.name}</h3>
              <p>{t.tenure}</p>
            </div>
          </div>

          {/* Next — on card side (desktop only) */}
          {!notDesktop && (
            <button onClick={() => go(current + 1)} aria-label="Next" className="testimonial-arrow" style={{
              position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
            }}>›</button>
          )}
        </div>
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
              backgroundColor: i === current ? 'var(--gold)' : testimonial.tabId === activeTabId ? 'rgba(246,199,133,0.55)' : 'rgba(255,255,255,0.3)',
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
