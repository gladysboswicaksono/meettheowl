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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
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
        <Accordion label="Character-Driven Scenario">
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
        <Accordion label="User Autonomy">
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
          Learning doesn't happen in a single exposure. I structure simulations so that each module
          builds on the last — starting with guided, low-stakes tasks and gradually introducing
          complexity, ambiguity, and time pressure.
        </p>
        <p>
          This mirrors how proficiency actually develops: not from reading instructions, but from
          repeated problem-solving in increasingly realistic conditions. Progressive complexity ensures
          that by the end, learners aren't just familiar with the interface — they're confident in the
          judgment calls the job requires.
        </p>
        <Accordion label="Illustration">
          <p>Illustration placeholder — complexity progression diagram.</p>
        </Accordion>
      </>
    ),
  },
  {
    id: 'adaptive',
    label: 'Adaptive Feedback',
    content: (
      <>
        <p>
          Generic feedback breaks learning flow. Every decision point in the simulation triggers
          contextual feedback — not just "correct" or "incorrect," but an explanation of why, grounded
          in real-world consequences.
        </p>
        <p>
          When a learner takes a suboptimal path, feedback reframes the experience: not as failure,
          but as a signal pointing toward better understanding. This approach directly supports the
          shift from "How do I use Feature X?" to "How do I achieve [Goal] with Feature X?"
        </p>
        <Accordion label="Illustration">
          <p>Illustration placeholder — adaptive feedback examples.</p>
        </Accordion>
      </>
    ),
  },
];

export default function OwllocatePage() {
  const [activeTab, setActiveTab] = useState('immersive');
  const current = tabs.find(t => t.id === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <div className="project-hero__image">
            <img src="/images/card-owllocate.png" alt="Owllocate app on desktop and mobile" />
          </div>
          <div className="project-hero__text">
            <h2>Getting Started with Owllocate</h2>
            <p>When work takes over, self-care and wellbeing slip through the cracks.</p>
            <p>
              This course explores how Owllocate bridges personal wellbeing and financial
              responsibility, transforming habit formation into a rewarding that pays (literally!)
            </p>
            <p className="project-hero__tools">
              Tools: Articulate Storyline, Parta, Google Apps Script, Adobe Illustrator, Adobe Photoshop.
            </p>
            <a
              href="https://gladys1998crb.wixstudio.com/theowl/owllocate-get-started"
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
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h2>⚙️ Learning Design &amp; Technical Implementation</h2>

            {/* Tabs */}
            <div className="tabs">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
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
