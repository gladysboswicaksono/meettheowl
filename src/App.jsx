import Nav from './components/Nav';
import Footer from './components/Footer';
import ProjectCard from './components/ProjectCard';
import Testimonials from './components/Testimonials';
import Expertise from './components/Expertise';

const projects = [
  {
    image: '/images/card-owllocate.png',
    imageAlt: 'Owllocate app on desktop and mobile',
    category: 'Customer Education',
    title: 'Getting Started with Owllocate',
    description: 'When work takes over, self-care and wellbeing slip through the cracks.\n\nThis course explores how Owllocate bridges personal wellbeing and financial responsibility, transforming habit formation into rewards that pays (literally!)',
    href: '/owllocate-get-started',
  },
  {
    image: '/images/card-training-impact.png',
    imageAlt: 'Report mock-up',
    category: 'AI, Data & Measurement',
    title: 'Measuring Training Impact',
    description: '"Is training driving results?" is the question every stakeholder asks and most learning teams struggle to answer confidently.\n\nThis is the framework I built so that question always has a data-backed answer and a clear direction forward.',
    href: '/training-impact' ,
  },
  {
    image: '/images/card-needs-analysis.png',
    imageAlt: 'Owl eye close-up with data overlay',
    category: 'AI, Data & Measurement',
    title: 'Data & AI for Needs Analysis',
    description: "AI analyzes data fast and presents findings so credibly that we forget it pattern-matches toward plausibility, not truth.\n\nThat's why I treat it as a probabilistic assistant under audit, not a magic eight ball.",
    href: '/needs-analysis',
  },
  {
    image: '/images/card-onboarding.png',
    imageAlt: 'Welcome Onboard presentation on laptop',
    category: 'Internal Enablement',
    title: 'Making Remote Onboarding Work',
    description: 'A Purchasing department held a two-day, in-person orientation that was crucial for transferring essential knowledge to new trainees.\n\nHowever, COVID-19 social distancing restrictions made continuing this traditional format impossible.',
    href: '/virtual-onboarding',
  },
];

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* HERO */}
        <section className="hero">

          {/* Portrait */}
          <div className="hero__portrait">
            <img
              src="/images/hero-portrait.png"
              alt="Gladys Bos-Wicaksono"
            />
          </div>

          {/* Text */}
          <div className="hero__text">
            <h1 style={{ color: 'var(--red)', textTransform: 'uppercase' }}>
              I thrive on challenges that start in the dark, where solutions hide in patterns waiting to be seen.
            </h1>
            <p className="p1">
              Seven years and counting, I've turned complex learning challenges into measurable wins:{' '}
              <strong style={{ color: 'var(--red)', fontWeight: 600 }}>faster onboarding</strong>,{' '}
              <strong style={{ color: 'var(--red)', fontWeight: 600 }}>higher adoption</strong>, and{' '}
              <strong style={{ color: 'var(--red)', fontWeight: 600 }}>significant cost savings</strong>.
            </p>
            <p className="p1">
              I've chosen depth in the craft over the ladder climb, growing as an{' '}
                <strong style={{ color: 'var(--red)', fontWeight: 600 }}>Individual Contributor</strong>{' '}
              fluent in technical execution while building the business lens to create strategic value. Currently working at Mews,
              dedicating 50% of my time on (in-app) Instructional Design as well as experimentation, and 50% on Data & Measurement.
            </p>
            <p className="p1">
              Some people call me a self-starter, others call me a systems thinker. But you can just{' '}
              <strong style={{ color: 'var(--red)', fontWeight: 600 }}>call me Gladys</strong>.
            </p>
          </div>
        </section>

        {/* ARTIFACTS */}
        <section id="artifacts" style={{ background: 'linear-gradient(180deg, #6B0808 0%, #1C253C 100%)', padding: '12px 12px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--gold)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: '3rem' }}>
              The Artifacts
            </h2>
            <div className="artifacts-grid">
              {projects.map(p => <ProjectCard key={p.href} {...p} />)}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* WHAT YOU'D GET FROM ME */}
        <Expertise />

      </main>
      <Footer />
    </div>
  );
}
