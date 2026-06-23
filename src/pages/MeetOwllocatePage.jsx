import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function MeetOwllocatePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>
        <section className="project-hero project-hero--meet-owllocate">
          <div className="project-hero__left">
            <div className="project-hero__bg">
              <iframe
                src="/html/owllocate-mobile-reward-animation.html"
                title="Owllocate mobile reward animation"
                tabIndex="-1"
              />
            </div>
            <div className="project-hero__vignette" />
          </div>
          <div className="project-hero__right">
            <div className="project-hero__copy">
              <h2>Meet Owllocate</h2>
              <p>
                Owllocate is a non-commercial habit and financial management app where users allocate leisure money upfront, unlock
                it through the habits they set, and build financial discipline through everyday decisions.
              </p>
              <p>
                I built it with Lovable and Claude Code, and access is request-based because I don't have the technical
                know-how to maintain it at the levl a public product would require. It is built for personal use, a small number of people who
                understand the limitation, and as my portfolio lab.
              </p>
              <br></br>
              <a
                href="https://www.owllocate.com/#request-account"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary project-hero-btn"
              >
                REQUEST OWLLOCATE ACCOUNT
              </a>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why it exists</h2>
          <p>
            Owllocate started because I was putting serious time in professional growth while treating
            my personal wellbeing as optional.
          </p>
          <p>
            I wanted to be more consistent with the habits that help me outside work too: reflection, rest, read,
            and the small routines that are easy to postpone because no one is waiting for them other than the future me.
            I know from experience that I close gaps better when I pair them with something I already do well. And as managing
            spending limits was already a discipline I had, I connected it to the routines I kept skipping.
            It has been working well enough that a few friends with similar challenges started using it too.
          </p>
          <div className='tab-content-grid'>
            <div className='tab-content-column'>
              <div className="project-embed project-embed--owllocate">
                <iframe
                  src="/html/owllocate-learning-lab.html"
                  title="Owllocate product and learning environment"
                  loading="lazy"
                />
              </div>
            </div>
            <div className='tab-content-column'>
              <h3 style={{ color: 'var(--gold)' }}>THE PORTFOLIO LAB</h3>
              <br></br>
              <p>
                As I kept developing Owllocate, I realized it also solved my portfolio challenge. At work, I build learning solutions
                for SaaS products that I cannot show publicly. I can explain my design thinking, but cannot open the product and walk someone through how
                the thinking actually works.
                </p>
                <p>
                Owllocate now gives me the controlled environment where my thinking can be made visible. It lets me show how I design product learning,
                test ideas for where I think SaaS and PaaS Customer Education should go, get feedback from people in the field, and apply them back to work
                context where relevant.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h3>What's Live</h3>
          <p>
            The first showcase using this product is already live on this portfolio. This case study
            shows how I design product learning outside the product itself, using authoring tools like Parta and Articulate Storyline
            to build a simulation-based education using storytelling and character-driven approach.
          </p>
          <a href="/owllocate-get-started" className="btn-secondary">
            Getting started with owllocate
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
