import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function OwnWhatAIBuilds() {
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

      </main>
      <Footer />
    </div>
  );
}
