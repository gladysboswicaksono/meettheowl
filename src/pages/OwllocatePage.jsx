import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function ZoomableImage({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      <div className="zoomable-img" onClick={() => setZoomed(true)}>
        <img src={src} alt={alt} />
        <span className="zoom-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="5"/>
            <line x1="11" y1="11" x2="14.5" y2="14.5"/>
            <line x1="7" y1="5" x2="7" y2="9"/>
            <line x1="5" y1="7" x2="9" y2="7"/>
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
          provide optional, high-level direction — just enough support to keep moving forward without
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
          <strong style={{ color: 'var(--gold)', textDecoration: 'underline' }}>~27% fewer support tickets</strong>{' '}
          for the topics they've practiced. That's my principle behind immersive simulation — the shift
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
          <div className="accordion-images" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
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
          <strong style={{ color: 'var(--gold)', textDecoration: 'underline' }}>naturally transition from guided to independent</strong>{' '}
          practice. Each success and repetition reinforces both confidence and accuracy, creating
          the compounding effect that lies at the heart of this approach.
        </p>
      </>
    ),
  },
  {
    id: 'adaptive',
    label: 'Adaptive Feedback',
    content: (
      <>
        <p>
          Strong feedback earns its value by guiding the next decision the receiver makes. So how
          do you make feedback that specific at scale?
        </p>
        <p>
          Building custom feedback for every possible click is impractical with today's technology,
          so I use data to guide where precision matters most. When I notice patterns where users
          consistently get stuck, I implement targeted tracking to understand what might cause the
          confusion. From there, I create feedback that speaks directly to the actual problem.
        </p>
        <Accordion label="Illustration">
          <div className="accordion-images">
            <ZoomableImage src="/images/owllocate/General feedback.png" alt="General feedback" />
            <ZoomableImage src="/images/owllocate/Targeted feedback.png" alt="Targeted feedback" />
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
          <strong style={{ color: 'var(--gold)', textDecoration: 'underline' }}>QoQ drop of ~14.1%</strong>{' '}
          in support tickets among trained users.
        </p>
        <p>
          Just as practice structure needs intentional design, so does feedback timing. Immediate
          feedback works well for clear mistakes, but sometimes it's a matter of efficiency. Some
          tasks can be done in multiple paths and some paths are more efficient than the other. My
          simulations follow their chosen path either way and deliver feedback at the end to
          preserve flow while building toward a reflective conclusion.
        </p>
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
    window.location.hash = id;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <h2>Getting Started with Owllocate</h2>
          <div className="project-hero__image">
            <img src="/images/card-owllocate.png" alt="Owllocate app on desktop and mobile" />
          </div>
          <div className="project-hero__text">
            <p>When work takes over, self-care and wellbeing slip through the cracks.</p>
            <p>
              This course explores how Owllocate bridges personal wellbeing and financial
              responsibility, transforming habit formation into a rewarding that pays (literally!)
            </p>
            <p className="project-hero__tools">
              Tools: Articulate Storyline, Parta, Google Apps Script, Adobe Illustrator, Adobe Photoshop.
            </p>
            <a
              href="https://owllocate.s3.eu-central-1.amazonaws.com/getting_started_with_owllocate_html/index.html#/static-scorm-v2/05547c43-0547-4762-914f-c4648ffcafc1/0"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Try Me
            </a>
          </div>
        </section>

        {/* ABOUT THIS WORK */}
        <section style={{ background: 'var(--gray)', padding: '60px 0' }}>
          <div className="about-section">
            <h2>About This Work</h2>
            <p>
              In my role, I designed a product training for one of our most complex topics, also one
              that contributed the most to our support ticket volume. I didn't set a hard metric at
              the start — my guiding assumption was that <em>*trained users</em> should submit fewer
              support tickets on this topic. The data supported that assumption: on average, a trained
              user submitted{' '}
              <strong style={{ color: 'var(--red)', textDecoration: 'underline' }}>~27% fewer support cases</strong>{' '}
              than an untrained user. Ongoing data-informed refinements continued to improve this
              result, driving an average{' '}
              <strong style={{ color: 'var(--red)', textDecoration: 'underline' }}>QoQ reduction of ~14%</strong>{' '}
              within the trained population.
            </p>
            <p>
              Because this work is owned by my employer, I'm unable to share it directly. So, I created
              the approach using Owllocate, a personal app I built which provides a suitable environment
              to demonstrate the same principles.
            </p>
            <p>
              This piece applies the same methods I used for that training: combining character-driven
              storytelling, hands-on simulations, and contextual feedback that reframe "How to use
              Feature X" into "How to achieve [Goal] with Feature X". While Owllocate is simpler than
              the systems I work with professionally, it allows my design principles to stand on their
              own without the constraints of proprietary complexity.
            </p>
            <p>
              Below, I walk through the design approach behind these results. The needs analysis and
              data work deserves its own deep dive — you can explore it in its dedicated piece linked
              at the end of this page.
            </p>
            <p>
              <em>
                *Trained users are those who completed the relevant resources designed to influence
                specific business metrics.
              </em>
            </p>
            <div className="disclaimer">
              This work piece represents my individual design approach and methodology. It does not
              reflect the procedures, processes, or team practices of my current or former employers.
            </div>
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
          </div>
        </section>

        {/* CTA CROSS-LINK */}
        <section className="cta-section">
          <h3>Making Training Count</h3>
          <p>
            Measuring how training influences business outcomes is genuinely complex, but it's also
            one of the most rewarding work I've done in my seven years as a learning professional.
            If you're interested in the data side of Customer Education, Learning &amp; Development,
            or Revenue Enablement, you can check out my other piece where I walk through how I built
            a trained-user framework and a Power BI report that surfaces what's actually happening
            inside a training program.
          </p>
          <a href="/training-impact" className="btn-secondary">
            Measuring Training Impact
          </a>
        </section>

      </main>
      <Footer />
    </div>
  );
}
