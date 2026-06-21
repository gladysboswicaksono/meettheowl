import { useState, useEffect, useRef } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import TooltipTerm from '../components/TooltipTerm';

function ZoomableImage({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      <div className="zoomable-img" onClick={() => setZoomed(true)}>
        <img src={src} alt={alt} />
        <span className="zoom-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" />
            <line x1="7" y1="5" x2="7" y2="9" />
            <line x1="5" y1="7" x2="9" y2="7" />
          </svg>
        </span>
      </div>
      {zoomed && (
        <div className="zoom-overlay" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt} />
        </div>
      )}
    </>
  );
}

async function getGifDuration(src) {
  try {
    const bytes = new Uint8Array(await (await fetch(src)).arrayBuffer());
    let cs = 0;
    for (let i = 0; i < bytes.length - 5; i++) {
      if (bytes[i] === 0x21 && bytes[i + 1] === 0xF9 && bytes[i + 2] === 0x04) {
        cs += bytes[i + 4] | (bytes[i + 5] << 8);
      }
    }
    return cs * 10;
  } catch { return 0; }
}

function GifPlayImage({ poster, gif, alt }) {
  const [playing, setPlaying] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const src = playing ? gif : poster;
  const timerRef = useRef(null);

  useEffect(() => {
    if (!playing) { clearTimeout(timerRef.current); return; }
    getGifDuration(gif).then(duration => {
      if (duration > 0) timerRef.current = setTimeout(() => setPlaying(false), duration * 5);
    });
    return () => clearTimeout(timerRef.current);
  }, [playing, gif]);

  return (
    <div className="gif-figure">
      <button type="button" className="gif-toggle" onClick={() => setPlaying(p => !p)}>
        <img className="gif-toggle__icon" src={playing ? '/images/owllocate/Pause.png' : '/images/owllocate/Play.png'} alt="" />
        {playing ? 'Pause gif' : 'Play gif'}
      </button>
      <div className="zoomable-img" onClick={() => setZoomed(true)}>
        <img src={src} alt={alt} />
        <span className="zoom-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" />
            <line x1="7" y1="5" x2="7" y2="9" />
            <line x1="5" y1="7" x2="9" y2="7" />
          </svg>
        </span>
      </div>
      {zoomed && (
        <div className="zoom-overlay" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt} />
        </div>
      )}
    </div>
  );
}

function Accordion({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion${open ? ' open' : ''}`}>
      <button className="accordion__header" onClick={() => setOpen(o => !o)}>
        <span className="accordion__label">📸 {label}</span>
        <span className={`accordion__chevron${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </div>
  );
}

const tabs = [
  {
    id: 'immersive',
    label: 'Immersive Simulation',
    content: (
      <>
        <p>
          The moment stakes are high and the interface is unfamiliar is exactly when people fall apart.
          That's why one of my go-to approaches for a complex system training is through immersive
          simulations that mirror the system's actual interface. And what makes such simulations effective
          isn't the perfect interface replication but the problem being solved.
        </p>
        <p>
          To keep the experience grounded in real work, I design simulations around a character navigating
          the same challenges and tasks users (will) have in their day-to-day.
        </p>
        <Accordion label="Illustration">
          <div className="accordion-images">
            <ZoomableImage src="/images/owllocate/1. Character driven 1.png" alt="Character driven simulation 1" />
            <ZoomableImage src="/images/owllocate/1. Characterdriven 2.png" alt="Character driven simulation 2" />
          </div>
        </Accordion>
        <p>
          Users stay in control the entire time. They can choose step-by-step guidance, work independently,
          and switch modes at any point throughout the simulation. In independent practice mode, hints
          provide optional, high-level direction whiich give just enough support to keep moving forward without
          taking away agency.
        </p>
        <Accordion label="Illustration">
          <div className="accordion-images">
            <ZoomableImage src="/images/owllocate/2. User autonomy 1.png" alt="User autonomy 1" />
            <ZoomableImage src="/images/owllocate/2. User autonomy 2.png" alt="User autonomy 2" />
          </div>
        </Accordion>
        <p>
          The result of this approach is tangible. On average, users who complete such simulations submit{' '}
          <strong style={{ color: 'var(--gold)' }}>~27% fewer support tickets</strong>{' '}
          for the topics they've practiced. That's my principle behind immersive simulation: the shift
          from knowing where to click to shaping understanding that maximizes product readiness.
        </p>
      </>
    ),
  },
  {
    id: 'progressive',
    label: 'Progressive Complexity',
    content: (
      <>
        <p>
          I believe every small win builds confidence for more complex challenges. And I build this
          momentum through sequenced activities, each gradually increasing in complexity, leading to
          a final challenge where users execute a complete workflow.
        </p>
        <Accordion label="Illustration">
          <div className="accordion-images accordion-images--grid3">
            <ZoomableImage src="/images/owllocate/3. Progression 1.png" alt="Progression 1" />
            <ZoomableImage src="/images/owllocate/3. Progression 2.png" alt="Progression 2" />
            <ZoomableImage src="/images/owllocate/3. Progression 3.png" alt="Progression 3" />
          </div>
        </Accordion>
        <p>
          Where applicable, users complete two variations of the same task for better retention;
          same steps, different parameters. If users choose guided support on the second attempt,
          the simulation encourages them to try independently first, because the goal is retention
          through retrieval, not just completion.
        </p>
        <Accordion label="Illustration">
          <div className="accordion-images" style={{ maxWidth: '340px', margin: '0 auto' }}>
            <ZoomableImage src="/images/owllocate/4. Repetition.png" alt="Repetition" />
          </div>
        </Accordion>
        <p>
          The data confirms my belief; confidence is a product of success and not its prerequisite.
          As users accumulate small, successful experiences, they{' '}
          <strong style={{ color: 'var(--gold)' }}>naturally transition from guided to independent</strong>{' '}
          practice. Each success and repetition reinforces both confidence and accuracy, creating
          the compounding effect that lies at the heart of this approach.
        </p>
      </>
    ),
  },
  {
    id: 'contextual',
    label: 'Contextual Feedback',
    content: (
      <>
        <p>
          Strong feedback earns its value by guiding the next decision the receiver makes. So how
          do you make feedback that specific at scale?
        </p>
        <p>
          I use data to guide where precision matters most because building custom feedback for every possible click is{' '}
          <TooltipTerm
            term="impractical with today's technology"
            desc="At the time, I didn't have much access to AI tools. While I wouldn't design custom feedback for every click, AI makes it more feasible to create deeper custom feedback than what I could build manually. And I look forward to showcasing it in my future case study."
          />
          <img src="/icons/info.svg" aria-hidden="true" style={{ width: '13px', height: '13px', opacity: 0.45, verticalAlign: 'middle', marginRight: '2px', marginBottom: '2px' }} />
          . When I notice patterns where users
          consistently get stuck, I implement targeted tracking to understand what might cause the
          confusion. From there, I create feedback that speaks directly to the actual problem.
        </p>
        <Accordion label="Illustration">
          <div className="accordion-images accordion-images--grid3">
            <ZoomableImage src="/images/owllocate/Implementation 1.png" alt="Contextual feedback" />
            <ZoomableImage src="/images/owllocate/Implementation 2.png" alt="Contextual feedback" />
            <ZoomableImage src="/images/owllocate/Implementation 3.png" alt="Contextual feedback" />
          </div>
        </Accordion>
        <p>
          And the data continues working. When certain workflows trip people up repeatedly, it
          shows me what to address differently in the next iteration, whether it's putting more
          emphasis on certain concepts, breaking the task into smaller steps, or restructuring
          the practice approach entirely.
        </p>
        <p>
          I've applied this in my current role: after spotting persistent struggles in one workflow,
          I introduced a simple "Watch, Guide, Test" option that let users choose the level of
          support they needed. It's one small example, but these data-driven tweaks continue to
          pay off, contributing to an ongoing{' '}
          <strong style={{ color: 'var(--gold)' }}>QoQ drop of ~14%</strong>{' '}
          in support tickets among trained users.
        </p>
        <p>
          Just as practice structure needs intentional design, so does feedback timing. Immediate
          feedback works well for clear mistakes, but sometimes it's a matter of efficiency. Some
          tasks can be done in multiple paths and some paths are more efficient than the other. My
          simulations follow their chosen path either way and deliver feedback at the end to
          preserve flow while building toward a reflective conclusion.
        </p>
        <p>
          Think about it, which of these conclusions would stick more with you?
        </p>
        <div className="feedback-row">
          <div className="gif-figure">
            <span className="gif-toggle gif-toggle--spacer" aria-hidden="true">
              <img className="gif-toggle__icon" src="/images/owllocate/Play.png" alt="" />
              Play gif
            </span>
            <ZoomableImage src="/images/owllocate/General feedback.png" alt="General feedback" />
          </div>
          <GifPlayImage
            poster="/images/owllocate/Targeted feedback.png"
            gif="/images/owllocate/Targetedfeedback-ezgif.com-optimize.gif"
            alt="Targeted feedback"
          />
        </div>
      </>
    ),
  },
];

export default function OwllocatePage() {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    return tabs.find(t => t.id === hash) ? hash : 'immersive';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const current = tabs.find(t => t.id === activeTab);

  const switchTab = (id) => {
    setActiveTab(id);
    window.history.pushState(null, '', `#${id}`);
  };

  const jumpTab = (id) => {
    switchTab(id);
    document.querySelector('.deep-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO + SUMMARY */}
        <section className="project-hero">
          <div className="project-hero__left">
            <div className="project-hero__bg">
              <img src="/images/card-owllocate.png" alt="" aria-hidden="true" />
            </div>
            <div className="project-hero__vignette" />
            <div className="project-hero__copy">
              <span className='showcase__eyebrow'>customer education</span>
              <h2>Getting Started with Owllocate</h2>
              <p>Think about the last time you wanted to pick up a new skill or tool but did not know where to start.
                You knew having it under your belt would make you better at your work, maybe even more marketable. The value was obvious, but the path was not.
              </p>
              <p>
                Now imagine two versions of that tool. One gives you the usual kit: academy content, documentation, and a community platform.
                The other gives you the same kit, plus a practice lab where you can build confidence from first attempt to advanced workflows.
              </p>
              <p style={{ color: 'var(--gold)', fontWeight: '800' }}>
                Which tool would you invest your time in?
              </p>
              <br></br>
              <a
                href="https://owllocate.s3.eu-central-1.amazonaws.com/getting_started_with_owllocate_html/index.html#/static-scorm-v2/05547c43-0547-4762-914f-c4648ffcafc1/0"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary project-hero-btn"
              >
                Try Me
              </a>
              <br></br>
              <br></br>
              <p className="project-hero__tools">Articulate Storyline &nbsp;&nbsp; ● &nbsp;&nbsp; Parta &nbsp;&nbsp; ● &nbsp;&nbsp; Adobe Illustrator &nbsp;&nbsp;</p>
              <p className='project-hero__tools'>JavaScript &nbsp;&nbsp; ● &nbsp;&nbsp; Google Apps Script</p>
            </div>
          </div>
          <div className="project-hero__right">
            <span className="project-hero__summary-label">Summary</span>
            <div className="project-summary-item">
              <div className="project-summary-item__heading">The Gap</div>
              <p className="project-summary-item__body">
                At work, I'm responsible for a topic where a <strong>small knowledge gap could turn into a lengthy support investigation</strong>.
              </p>
              <p className="project-summary-item__body">
                The workflow is complex, and when something goes wrong, Support team frequently had to trace what the user had tried, where the issue started, and what needed to be corrected.
                So the problem was not only in <strong>ticket volume</strong> but also the <strong>time</strong> and <strong>cost</strong> each ticket could consume once it landed.
              </p>
              <p className="project-summary-item__body">
                Something was needed to prevent avoidable tickets before they existed.
              </p>
            </div>
            <div className="project-summary-item">
              <div className="project-summary-item__heading">The Work</div>
              <p className="project-summary-item__body">
                Hands-on simulation series that let users <strong>practice the workflow</strong> before doing it in the real system.
              </p>
              <p className='project-summary-item__body'>
                The experience used character-led scenarios to <strong>give each task a reason</strong> rather than a sequence of clicks. Users could choose the <strong>level of guidance</strong> at the start or switch throughout the simulations;
                guided practice if the workflow was unfamiliar, or independent practice if they already had enough context or want to challenge themselves.
                I also added <strong>targeted tracking</strong> inside the experience so I could see where users got stuck most often.
              </p>
            </div>
            <div className="project-summary-item">
              <div className="project-summary-item__heading">The Shift</div>
              <p className="project-summary-item__body">
                Trained users submitted <strong>27% fewer support tickets</strong> on the topics they practiced, continuous refinements contributed to an average of <strong>14% quarter-over-quarter reduction</strong> in support tickets among trained users.
              </p>
              <p className="project-summary-item__body">
                I templateized the simulation structure for future projects with similar challenges, which <strong>cut development time by half</strong> in later builds.
              </p>
            </div>
          </div>
        </section>
        <div className="showcase__bottom-bar" />

        {/* ABOUT THIS WORK */}
        <section className="about-section">
          <h2>WHERE IT STARTED</h2>
          <p style={{ letterSpacing: '0.02em' }}>
            <em>"Would you keep learning if the safest option was to stop?"</em>
          </p>
          <p>
            That question is the starting point for this case study. Complex product workflows tend to fail because the user reaches a step where the next move feels risky
            and Customer Support is a few clicks away. It's the rational move to stop, open a ticket, and let someone who knows the system untangle it. It solves the immediate problem,
            but does not scale and build capability.
            The good thing is, stop learning didn't have to be the safest option.
          </p>
          <p>
            My working hypothesis: if users could practice the workflow as if they were in the real system, through goal-focused tasks that gradually increase in complexity,
            with guidance available at any point, and feedback tied to the consequences of their choices, they would become more capable, more confident, and less dependent on Support teams.
          </p>
          {/* <p>
            That's why my solution was built around:
          </p>
          <ol>
            <li>Design approach that follows from an in-depth analysis that pinpoint precisely where users were failing.</li>
            <li>Character-driven storytelling and immersive simulations that build up in complexity.</li>
            <li>Contextual feedback that reframe "How to use Feature X" into "How to achieve [Goal] with Feature X"</li>
          </ol>
          <br></br> */}
          <p>
            Below, I elaborate on my design choices. The data work deserves its own deep dive and you can explore it in its dedicated case study linked
            at the end of this page.
          </p>

          <div className="disclaimer">
            This is a public, sanitized case study based on real work. The actual project belongs to my employer, so I replicated the same approach in Owllocate,
            a personal app I built for habit and financial management, to show the same design thinking without exposing proprietary product details.
            <br></br>
            Owllocate runs at a much smaller scale than the enterprise software I work with day-to-day, but the 27% result and 14% QoQ average improvement came from the
            original work.
          </div>
        </section>

        {/* LEARNING DESIGN & TECHNICAL IMPLEMENTATION */}
        <section className="deep-section deep-section--navy">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2>⚙️ Learning Design &amp; Technical Implementation</h2>

            {/* Tabs */}
            <div className="tabs">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => switchTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              <h3>{current.label}</h3>
              {current.content}
            </div>

            {/* Bottom tab jump — mobile only */}
            <nav className="tab-jump" aria-label="Jump to another design principle">
              <span className="tab-jump__label">Other Design Principles</span>
              <div className="tab-jump__list">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    className={`tab-jump__btn${activeTab === t.id ? ' active' : ''}`}
                    onClick={() => jumpTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </section>

        {/* CTA CROSS-LINK */}
        <section className="cta-section">
          <h3>Making Training Count</h3>
          <p>
            Measuring how training influences business outcomes is genuinely complex, but it's also
            one of the most rewarding work I've done in my seven years as a learning professional.
            If you're interested in the data side of Customer Education, Learning &amp; Development,
            or Go-To-Market Enablement, you can check out my other piece where I walk through how I built
            a trained-user framework and a Power BI report that surfaces what's actually happening
            inside a training program and how it translates to business results.
          </p>
          <a href="/training-effectiveness" className="btn-secondary">
            Measuring Training Effectiveness
          </a>
        </section>

      </main>
      <Footer />
    </div>
  );
}
