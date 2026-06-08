import { useState, useRef, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import RefCard from '../components/RefCard';
import HtmlCssPractice from '../components/HtmlCssPractice';
import AiCourseStepper from '../components/AiCourseStepper';
import StepperInspectBlock from '../components/StepperInspectBlock';

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
            { tag: '<html>', desc: 'Wraps every other tag on the page' },
            { tag: '<head>', desc: "Holds information about the page the visitor doesn't see directly" },
            { tag: '<title>', desc: 'Names the page; shows on the browser tab' },
            { tag: '<body>', desc: 'Holds everything visible on the page' },
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

const paths = [
  { id: 'write', num: '01', label: 'Write from scratch', desc: "Understand exactly what you're looking at — a solid prerequisite for path 3." },
  { id: 'edit', num: '02', label: 'Edit an existing file', desc: 'Know just enough to edit an existing HTML file generated by AI.' },
  { id: 'structure', num: '03', label: 'Learn how to structure files', desc: 'Fully own what AI produces — generate specific prompts and get the right output in your next AI production.' },
];

export default function OwnWhatAIBuildsPage() {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    return tabs.find(t => t.id === hash) ? hash : 'html';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [activePath, setActivePath] = useState('write');
  const current = tabs.find(t => t.id === activeTab);

  const pathSelectorRef = useRef(null);
  const pillRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const el = pathSelectorRef.current;
    if (!el) return;
    function update() {
      // Show bar only when the path selector has fully scrolled above the
      // viewport (user is past the section). Hides again if they scroll back up.
      const scrolledPast = el.getBoundingClientRect().bottom < 0;
      pillRef.current?.classList.toggle('is-visible', scrolledPast);
      barRef.current?.classList.toggle('is-visible', scrolledPast);
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const switchTab = (id) => {
    setActiveTab(id);
    window.history.pushState(null, '', `#${id}`);
  };

  const switchPath = (id) => setActivePath(id);

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
              maxWidth: '600px',
            }} aria-hidden="true">
              <div style={{ display: 'flex', gap: '6px', padding: '4px 4px 12px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#3a3a52', display: 'inline-block' }}></span>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#3a3a52', display: 'inline-block' }}></span>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#3a3a52', display: 'inline-block' }}></span>
              </div>
              <div className="own-ai-hero-panes">
                <div style={{ background: 'var(--blue-card)', borderRadius: '8px', padding: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>Your code</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '10.5px', color: 'var(--gold)', lineHeight: 1.65, whiteSpace: 'pre' }}>{`<h1>AI made this.</h1>\n<p>Now, make it yours.</p>\n\n<section\n  class="course-card">\n\n  <h2>Write it.</h2>\n  <p>Build from the basics.</p>\n\n  <h2>Edit it.</h2>\n  <p>Change what AI gives you.</p>\n\n  <h2>Structure it.</h2>\n  <p>Prompt for files you can maintain.</p>\n\n</section>`}</div>
                </div>
                <div style={{ background: 'var(--blue-card)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '2px' }}>Your output</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--gray)', lineHeight: 1.2 }}>AI made this.</div>
                  <div style={{ fontSize: '14px', color: '#b0aeb8', fontStyle: 'italic', marginBottom: '4px' }}>Now, make it yours.</div>
                  <div style={{ border: '1px solid rgba(246,199,133,0.2)', borderRadius: '6px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[['Write it.', 'Build from the basics.'], ['Edit it.', 'Change what AI gives you.'], ['Structure it.', 'Prompt for files you can maintain.']].map(([h, p]) => (
                      <div key={h}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--gold)', lineHeight: 1.2 }}>{h}</div>
                        <div style={{ fontSize: '13px', color: '#b0aeb8', lineHeight: 1.3 }}>{p}</div>
                      </div>
                    ))}
                  </div>
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

            {/* Path selector */}
            <div className="path-selector" ref={pathSelectorRef}>
              {paths.map(p => (
                <button
                  key={p.id}
                  className={`path-card${activePath === p.id ? ' is-active' : ''}`}
                  onClick={() => switchPath(p.id)}
                >
                  <span className="path-card__num">Path {p.num}</span>
                  <div className="path-card__title">{p.label}</div>
                  <p className="path-card__desc">{p.desc}</p>
                </button>
              ))}
            </div>

            {/* Path content */}
            {activePath === 'write' && (
              <>
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
              </>
            )}
            {activePath === 'edit' && (
              <>
                <div className='lesson__divider'>
                  Editing an existing file <hr />
                </div>
                <p className='lesson__p'>
                  When AI generates an interactive course or reference guide, it almost always produces a single file.
                  Everything lives inside one <span className='inline-code'>.html</span> file: the content, the styling, and the interactivity.
                  That can feel overwhelming when you open the file for the first time, but most AI-generated courses follow a predictable structure.
                </p>
                <p className='lesson__p'>
                  Let's take a look at the following example which has three distinct blocks:
                </p>
                <AiCourseStepper />
                <br></br>
                <ol className='lesson__p'>
                  <li>HTML is what you use when you want to change text, headings, or the order of content.</li>
                  <div className='inspect-practice__editor'>
                    {`<h2>Tips to work with AI to Build your courses</h2>\n<p>The output quality depends almost entirely on what you give AI upfront. Without a design system to reference, it defaults to generic styles.\nWithout a defined pattern, it creates something that works in isoluation but is a nightmare to reuse and maintain.\n<br>
                      \n<p>These <strong>five steps</strong> are not only gonna help you produce something <strong>more consistent</strong> \nbut also <strong>scalable</strong> and <strong>maintainable</strong>.
                      `}
                  </div>
                  <br></br>
                  <li><span className='inline-code'>&lt;style&gt;</span> block at the top holding the CSS, which you use to change how something looks like color, spacing, fonts.</li>
                  <div className='inspect-practice__editor'>
                    {`<style>
  :root {
    --gray: #525252;
    --light: #b9b9b9;
    --dark: #3b3b3b;
    --red: #5B0606;
  }

  .flow-steps {
    display: flex;
    gap: 8px;
  }
  .flow-single-step {
    flex: 1;
    background-color: var(--light);
    border-radius: 6px;
    border: 1px solid var(--gray);
    text-align: center;
    font-size: 12px;
    transition: all 0.3s ease;
  }
  .flow-single-step:hover {
    border-color: var(--red);
  }
  .flow-single-step.active {
    background-color: var(--red);
  }
</style>`}
                  </div>
                  <br></br>
                  <li><span className='inline-code'>&lt;script&gt;</span> block at the bottom has two layers. The top layer holds the text inside an interaction. Instead of writing every step 
                  directly in HTML, the content is stored as data, and JavaScript swaps in the right title, sentence, or label based on what the user does.
                  </li>
                  <div className='inspect-practice__editor'>
                    {`<script>\n// DATA OBJECTS - ONE ENTRY PER STEP
const steps = [
  { label: 'Step 1', title: 'Point it to your design system',     body: 'Have a file with your themes, colors, and fonts that AI can reference.' },
  { label: 'Step 2', title: 'Design the pattern',                  body: 'Name the interaction: stepper, accordion, hotspot, knowledge check.' },
  { label: 'Step 3', title: 'Specify the output',                  body: 'Single HTML or separated files — be explicit about what you need.' },
  { label: 'Step 4', title: 'Ask for readable names and comments', body: 'Tell it to name classes descriptively and add comments above each section.' },
  { label: 'Step 5', title: 'Create reusable components',          body: 'Ask it to save reusable components in a centralized folder.' },
];
let active = 0;

// Step triggers — fired when the user clicks a step or a nav button
function setStep(i) { active = i; render(); }
function go(dir) {
  active = Math.max(0, Math.min(steps.length - 1, active + dir));
  render();
}`}
                  </div>
                  <br></br>
                  <p>The second layer handles behavior; it listens for user actions, like clicking a button or progressing a step, and tells the page what to update next. </p>
                </ol>
                <div className='inspect-practice__editor'>
                  {`function setStep(i) { active = i; render(); }
function go(dir) {
  active = Math.max(0, Math.min(steps.length - 1, active + dir));
  render();

  ...
  </script>
}`}
                </div>
                <div className="lesson__divider" style={{ marginTop: '48px' }}>
                  &#9998; Make it yours<hr />
                </div>
                <p className="lesson__p">
                  Now it's your turn to work with the file. You'll make five small changes to this AI-generated block, each one targeting a different part of the interaction.
                  Use the suggested edits if you want a quick path, or replace them with your own course idea. The goal is <strong>not</strong> to memorize the code but to recognize the pattern and learn where to look when you want to change something.
                </p>
                <p className='lesson__p'>
                  You can download the file and edit it locally on your computer, or use the editor provided below.
                </p>
                <a
                  href="/downloads/stepper.html"
                  download="stepper.html"
                  className="download-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', marginBottom: '28px' }}
                >
                  ↓ Download stepper.html
                </a>
                <StepperInspectBlock exercises={[
                  { title: 'Exercise 1: Update the title', desc: 'Replace "Tips to work with AI to build your course" with "Build Better Learning Interactions with AI".' },
                  { title: 'Exercise 2 — placeholder', desc: 'Placeholder description for exercise 2. Make a different edit, then click Run.' },
                  { title: 'Exercise 3 — placeholder', desc: 'Placeholder description for exercise 3. Try something bolder this time.' },
                  { title: 'Exercise 4 — placeholder', desc: 'Placeholder description for exercise 4. Almost there.' },
                  { title: 'Exercise 5 — placeholder', desc: 'Placeholder description for exercise 5. Last one.' },
                ]} />
              </>
            )}
            {activePath === 'structure' && (
              <p style={{ opacity: 0.5, fontStyle: 'italic' }}>Coming soon.</p>
            )}
          </div>
        </section>

      </main>
      <Footer />

      {/* Slim path bar — desktop only */}
      <div className="path-bar" ref={barRef}>
        {paths.map(p => (
          <button
            key={p.id}
            className={`path-bar__btn${activePath === p.id ? ' is-active' : ''}`}
            onClick={() => switchPath(p.id)}
          >
            {p.num} · {p.label}
          </button>
        ))}
      </div>

      {/* Floating path pill — non-desktop only */}
      <div className="path-pill" ref={pillRef}>
        {paths.map(p => (
          <button
            key={p.id}
            className={`path-pill__btn${activePath === p.id ? ' is-active' : ''}`}
            onClick={() => switchPath(p.id)}
          >
            {p.num}
          </button>
        ))}
      </div>
    </div>
  );
}
