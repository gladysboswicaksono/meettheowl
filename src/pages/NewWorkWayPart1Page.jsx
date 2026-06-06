import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function NewWorkWayPart1Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <h2>New Way of Working</h2>

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
              Most people who edit a webpage were never taught how. They get handed an HTML
              file, a vague instruction, and a reference that explains what HTML{' '}
              <span style={{ color: 'var(--red)', fontWeight: 600  }}>stands for</span>{' '}
              instead of what a tag actually does.
            </p>
            <p>
              My employer gives every R&D member €1,500 of Claude tokens a month. With that, I can generate a course skeleton, a feedback script, and a working prototype before lunch. 
              The Owllocate piece in this portfolio took weeks. 
              Today it would take two days, and the remaining weeks would go toward the parts AI cannot (yet) do; deciding what the learner needs to be able to do and whether training is the right answer.
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
           I won't always have €1,500 to work With

           
          </p>
          <p>
            The piece teaches by output. Each tag card shows what the tag does and what it
            renders, not where its name came from. The practice panel pairs an expected result
            with an empty editor, so you write the markup yourself and run it against the target
            instead of taking my word for it.
          </p>
          <p>
            Feedback runs through Claude, but on a short leash. A check in the browser compares
            the structure of your code to the structure the exercise expects — which tags, in
            what order — and never the words you type. Match it and you get a straight
            confirmation. Add something past the brief, like a color, and it tells you that's
            more than the exercise asked for. Claude only writes feedback for the cases I didn't
            script: code that diverges in a way the rules don't already cover.
          </p>
          <div className="disclaimer">
            <p>
              Your text content never reaches the model. The feedback reads HTML structure only,
              so whatever you write inside a tag stays between you and the editor. The model also
              runs behind my own endpoint, so no one needs an API key to use this.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
