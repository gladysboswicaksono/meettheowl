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
                Owllocate is a product concept that brings habit-building, rewards, and
                practical learning together in one connected experience.
              </p>
              <a
                href="https://www.owllocate.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary project-hero-btn"
              >
                Visit Owllocate
              </a>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>About Owllocate</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className="project-embed">
            <iframe
              src="/html/owllocate-learning-lab.html"
              title="Owllocate product and learning environment"
              loading="lazy"
            />
          </div>
        </section>

        <section className="cta-section">
          <h3>See Owllocate in Action</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor
            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <a href="/owllocate-get-started" className="btn-secondary">
            Getting Started with Owllocate
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
