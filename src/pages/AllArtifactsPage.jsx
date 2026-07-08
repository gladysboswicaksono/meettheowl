import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { projects } from '../data/artifacts';

export default function AllArtifactsPage() {
  return (
    <>
      <Nav />
      <section className="artifacts-page" id="artifacts">
        <div className="artifacts-page__header">
          <a href="/#artifacts" className="artifacts-page__back">← Back</a>
          <h1 className="artifacts-page__heading">The Artifacts</h1>
        </div>
        <div className="artifacts-page__list">
          {projects.map((proj, i) => (
            <div className="artifacts-page__card" key={proj.href}>
              <div className="showcase__bg">
                <img src={proj.image} alt={proj.imageAlt} />
              </div>
              <div className="showcase__vignette" />
              <div className="showcase__copy">
                {i === 0 && <div className="showcase__featured-tag">Featured</div>}
                <div className="showcase__eyebrow">{proj.category.join(' · ')}</div>
                <h2 className="showcase__title">{proj.featuredTitle}</h2>
                <div className="showcase__stats">
                  {proj.stats.map(s => (
                    <div key={s.value} className="showcase__stat">
                      <span className="showcase__stat-value">{s.value}</span>
                      <span className="showcase__stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
                <a href={proj.href} className="btn-primary">View Case Study →</a>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
