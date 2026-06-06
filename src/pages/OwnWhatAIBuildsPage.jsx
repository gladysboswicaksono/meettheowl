import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import RefCard from '../components/RefCard';
import HtmlCssPractice from '../components/HtmlCssPractice';

const whatIBuiltSlides = [
  {
    title: 'Overview Page',
    caption: 'An overview page with dynamic summary on all three measurement methods and metrics, so readers know the current state of training performance without digging further. A bot interpreter with example is linked directly from the page for on-demand guidance.',
    img: '/images/training-impact/overview.png',
    alt: 'Overview page',
  },
  {
    title: 'Program Reach',
    caption: 'Headline KPIs for population, coverage, causal effect, and associated impact, so leadership can assess program scale and effectiveness in one glance. Below, a summary card breaking down main KPIs per business metric, which is where reader sees whether training is both associated with and causing behavior changes on all measured business goals.',
    img: '/images/training-impact/program-reach.png',
    alt: 'Program reach',
  },
  {
    title: 'Effectiveness and Account Health',
    caption: 'Associated impact and causal training effect per metric over time, switchable between WoW, MoM, and QoQ, so teams can monitor trends at the cadence that matches their decision cycle. Next to it, an account-level health status calculated from key performance indicators, so Customer Success teams can identify which accounts may need interventions.',
    img: '/images/training-impact/effectiveness-and-account-health.png',
    alt: 'Effectiveness and account health',
  },
  {
    title: 'Dedicated Metric Pages',
    caption: 'Each business metric gets a full analytical view covering same-tenure comparison, DiD effect, performance over time, and period-over-period tracking, so users can investigate whats driving the numbers they see on the overview. All built on a shared foundation for maintainability.',
    img: '/images/training-impact/dedicated-metric-pages.png',
    alt: 'Dedicated metric pages',
  },
  {
    title: 'Ask the Owl – Bot Interpreter',
    caption: "An AI interpreter built on the report's methodology that can read screenshots, explains metrics, and guides investigation without drawing conclusions. Built to improve report accessibility without loosening the analytical standards that training measurement needs.",
    img: '/images/training-impact/ask-the-owl-bot-interpreter.png',
    alt: 'Ask the Owl bot interpreter',
  },
];

const tabs = [
  {
    id: 'html',
    label: 'HTML',
    content: (
      <div className="lesson">

        {/* ── Document structure ───────────────────────── */}
        <div className="lesson__divider">Document structure<hr /></div>
        <p className="lesson__p">
          Every HTML file starts with the same structure to tell the browser what it's looking at.
          Each tag has an opening and a closing half; and everything between them belongs to that tag.
        </p>
        <p className="lesson__p">
          <span className="inline-code">&lt;!DOCTYPE html&gt;</span> is the one exception: it's a
          declaration, not a tag, so it stands alone.
        </p>
        <RefCard
          tags={[
            { tag: '<!DOCTYPE html>', desc: 'Tells the browser to read the page as modern HTML' },
            { tag: '<html>',          desc: 'Wraps every other tag on the page' },
            { tag: '<head>',          desc: "Holds information about the page the visitor doesn't see directly" },
            { tag: '<title>',         desc: 'Names the page; shows on the browser tab' },
            { tag: '<body>',          desc: 'Holds everything visible on the page' },
          ]}
          codeSample={`<!DOCTYPE html>\n<html>\n    <head>\n        <title>Page title</title>\n    </head>\n    <body>\n        <!-- CONTENT GOES HERE -->\n    </body>\n</html>`}
        />

        {/* ── Text tags ────────────────────────────────── */}
        <div className="lesson__divider" id="section-text-tags">Text tags<hr /></div>
        <p className="lesson__p">
          HTML has six heading levels, but most pages use three. The number in a heading tag sets the rank, and while browsers render lower numbers larger by default, 
          rank is what screen readers and search engines read.
        </p>
        <RefCard
          tags={[
            { tag: '<h1>', desc: "The page's main heading. Use it once, for the title of the whole page" },
            { tag: '<h2>', desc: 'A section heading. Use it to break the page into named parts' },
            { tag: '<h3>', desc: 'A subsection heading. Use it when a section needs its own divisions' },
          ]}
          codeSample={`<h1>Title</h1>\n<h2>Section</h2>\n<h3>Subsection</h3>`}
          result={
            <>
              <div className="res-h1">Title</div>
              <div className="res-h2">Section</div>
              <div className="res-h3">Subsection</div>
            </>
          }
        />
        <br></br>
        <p className="lesson__p">
          <span className='inline-code'>&lt;p&gt;</span> represents a paragraph. Browsers add a line break and a gap above and below it automatically.
          As such, you can't change the display by adding extra spaces or lines in your HTML code. 
          To start a new paragraph, wrap the text in a new <span className='inline-code'>&lt;p&gt;</span> and <span className='inline-code'>&lt;/p&gt;</span> tags.
        </p>
        <RefCard
          tags={[
            { tag: '<p>', desc: "A paragraph. Use it for any block of text that isn't a heading or a list" },
          ]}
          codeSample={`<p>Paragraph one</p>\n<p>Paragraph two</p>`}
          result={
            <>
              <div className="res-p">Paragraph one</div>
              <div className="res-p">Paragraph two</div>
            </>
          }
        />

        {/* ── Write it yourself ────────────────────────── */}
        <div className="lesson__divider">&#9997;&#65039; Write it yourself<hr /></div>
        <HtmlCssPractice
          exerciseId="html-text-tags"
          nudgeHref="#section-text-tags"
          prompt={
            <>
              Recreate the expected output. Write an <code>&lt;h1&gt;</code> for the title, an{' '}
              <code>&lt;h2&gt;</code> and <code>&lt;h3&gt;</code> beneath it, then two{' '}
              <code>&lt;p&gt;</code> paragraphs. Run it — the five lines stack, headings largest
              at the top.
            </>
          }
          expectedOutput={
            <>
              <div className="res-h1">Meet me!</div>
              <div className="res-h2">I am {'{Name}'}</div>
              <div className="res-h3">About me</div>
              <div className="res-p">I like learning new things.</div>
              <div className="res-p">Right now, I&rsquo;m learning HTML fundamentals.</div>
            </>
          }
        />

      </div>
    ),
  },
  {
    id: 'css',
    label: 'CSS',
    content: (
      <p style={{ opacity: 0.5, fontStyle: 'italic' }}>Coming soon.</p>
    ),
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    content: (
      <p style={{ opacity: 0.5, fontStyle: 'italic' }}>Coming soon.</p>
    ),
  },
];

export default function OwnWhatAIBuildsPage() {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    return tabs.find(t => t.id === hash) ? hash : 'html';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const current = tabs.find(t => t.id === activeTab);

  const switchTab = (id) => {
    setActiveTab(id);
    window.location.hash = id;
  };

  const jumpTab = (id) => {
    switchTab(id);
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <h2>Own what AI Builds</h2>

          <div className="project-hero__image">
            <div style={{
              background: 'var(--blue-bg)',
              borderRadius: '10px',
              padding: '14px',
              boxShadow: '0 14px 30px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: '480px',
            }} aria-hidden="true">
              <div style={{ display: 'flex', gap: '6px', padding: '4px 4px 12px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#3a3a52', display: 'inline-block' }}></span>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#3a3a52', display: 'inline-block' }}></span>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#3a3a52', display: 'inline-block' }}></span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--blue-card)', borderRadius: '8px', padding: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>Your code</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '12.5px', color: 'var(--gold)', lineHeight: 1.7, whiteSpace: 'pre' }}>{'<h1>Meet me!</h1>\n<h2>I am Gladys</h2>\n<p>I build things.</p>'}</div>
                </div>
                <div style={{ background: 'var(--blue-card)', borderRadius: '8px', padding: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>Your output</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--gray)' }}>Meet me!</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--gray)', marginTop: '4px' }}>I am Gladys</div>
                  <div style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>I build things.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="project-hero__text">
            <p>
              My employer gives every R&D member €1,500 of Claude tokens a month. With that, I outsource most of my development work to it. 
              But that budget won't follow me everywhere. So, what happens when I need to achieve the same output with a fraction of what I have now?
            </p>
            <p className="project-hero__tools">
              Tools: HTML, CSS, JavaScript
            </p>
            <a href="#work" className="btn-primary">Try the editor</a>
          </div>
        </section>

        {/* ABOUT THIS WORK */}
        <section className="about-section">
          <h2>About this work</h2>
          <p>
           My employer gives every R&D member €1,500 of Claude tokens a month. With that, I can generate a course skeleton, a feedback script, and a working prototype before lunch. 
           The <a href="/owllocate-get-started" target='_blank' className='hyperlink'>Owllocate</a> piece in this portfolio took two weeks. 
           Today it would take two days, and the remaining time would go toward the parts AI cannot (yet) do: deciding what the learner actually needs to be able to do, and whether training is the right answer at all.
          </p>
          <p>
          That budget won't follow me everywhere. So before I became fully dependent on it, I needed the minimum viable code knowledge to own what AI produces.
          Read it, navigate it, edit it, extend it, and know exactly what I'm asking for when I tell a tool to build or update something.
          </p>
          <p>
            This is the first piece in my New Way of Working series: A hands-on microlearning covering the basics of HTML, CSS, JavaScript, and how to structure files
            so your AI prompts produce something you can maintain.
          </p>
        </section>

                {/* WHAT I BUILT */}
        <section className="deep-section deep-section--red">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2>🔧 What I Built</h2>
            <Carousel slides={whatIBuiltSlides} placeholderLabel="Image coming soon" />
          </div>
        </section>

        {/* LEARNING CONTENT */}
        <section className="deep-section deep-section--navy" id="work">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2>📚 The Learning Content</h2>

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

            {current.content}

            {/* Bottom tab jump — mobile only */}
            <nav className="tab-jump" aria-label="Jump to another topic">
              <span className="tab-jump__label">Other Topics</span>
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

      </main>
      <Footer />
    </div>
  );
}
