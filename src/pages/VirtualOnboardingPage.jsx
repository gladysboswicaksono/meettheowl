import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

/* Gif play/pause toggle — same button style as the other work pieces
   (not the original's click-to-play overlay). */
function GifPlayImage({ poster, gif, alt }) {
  const [playing, setPlaying] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const src = playing ? gif : poster;
  return (
    <div className="gif-figure">
      <button type="button" className="gif-toggle" onClick={() => setPlaying(p => !p)}>
        <img className="gif-toggle__icon" src={playing ? '/images/owllocate/Pause.png' : '/images/owllocate/Play.png'} alt="" />
        {playing ? 'Pause gif' : 'Play gif'}
      </button>
      <div className="zoomable-img" onClick={() => setZoomed(true)}>
        <img src={src} alt={alt} />
        <span className="zoom-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" />
            <line x1="7" y1="5" x2="7" y2="9" />
            <line x1="5" y1="7" x2="9" y2="7" />
          </svg>
        </span>
      </div>
      {zoomed && (
        <div className="zoom-overlay" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt} />
        </div>
      )}
    </div>
  );
}

export default function VirtualOnboardingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <h2>Making Remote Onboarding Work</h2>
          <div className="project-hero__image">
            <img src="/images/card-onboarding.png" alt="Welcome Onboard presentation on laptop" />
          </div>
          <div className="project-hero__text">
            <p>
              A Purchasing department historically conducted a two-day in-person orientation for rotating
              trainees, designed to thoroughly introduce them to their upcoming roles and responsibilities
              within the department. The orientation was crucial to maintain the essential knowledge transfer.
            </p>
            <p>
              However, COVID-19 social distancing measures made continuing in the traditional format
              impossible.
            </p>
            <p className="project-hero__tools">
              Tools: Final Cut Pro X, Adobe Photoshop, Articulate 360, H5P
            </p>
          </div>
        </section>

        {/* SUMMARY */}
        <section style={{ backgroundColor: 'var(--blue-bg)' }}>
          <div className="summary-section">
            <h2>Summary</h2>
            <div className="summary-grid">
              <div className="summary-column">
                <h3>Goal</h3>
                <p>
                  Redesign training orientation and onboarding for COVID restrictions while keeping trainees
                  job-ready and confident.
                </p>
              </div>
              <div className="summary-column">
                <h3>Solution</h3>
                <p>
                  Virtual kickoffs via Teams, complemented by self-paced learning path featuring interactive
                  videos, 360° facility tour, micro-learning, and system simulations.
                </p>
              </div>
              <div className="summary-column">
                <h3>Outcome</h3>
                <p>
                  Increased engagement with daily responsiblities while achieving the same, if not higher,
                  competency levels compared to those from traditional onboarding setup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT THIS WORK */}
        <section className="about-section">
          <h2>About This Work</h2>
          <p>
            The audience for this work was Purchasing trainees in Real-World Learning program, a hospitality
            program providing hands-on profesional experience in active business environments. My role covered
            instructional design, video production, and eLearning development.
          </p>
          <p>
            The solution combined live virtual sessions via Teams with self-paced learning: interactive
            videos, 360° virtual tour with embedded scenario prompts, micro-learning modules, and system
            simulations for hands-on practice with inventory management workflows—reviewing requisitions,
            placing orders, and conducting stock counts.
          </p>
          <p>
            This approach replicated the essential knowledge transfer and skill-building of in-person
            orientation while accommodating the constraints of remote delivery.
          </p>
          <div className="disclaimer">
            <p>
              This work sample represents my individual design approach and methodology. It does not reflect
              the procedures, processes, or team practices of my current or former employers.
            </p>
          </div>
        </section>

        {/* DEEP DIVE */}
        <section className="deep-section deep-section--navy">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Project Goal */}
            <div className="tab-content" style={{ marginBottom: '28px' }}>
              <h3>Project Goal</h3>
              <p>
                Keep onboarding effective while adhering to health guidelines and COVID restrictions. This
                alternative approach should make sure:
              </p>
              <ol className="about-list about-list--light">
                <li>Understanding of where Purchasing fits within the organization and why it matters</li>
                <li>Build core competence so trainees can perform tasks and responsibilities</li>
                <li>Provide channels for questions and clarification, not just one-way content delivery</li>
                <li>Maintain performance metrics; same confidence and motivation levels as pre-COVID</li>
              </ol>
            </div>

            {/* Analysis and Scoping */}
            <div className="tab-content" style={{ marginBottom: '28px' }}>
              <h3>Analysis and Scoping</h3>
              <p>
                Started by analyzing feedback from past onboarding sessions, confirming that onboarding still
                has to take place to maintain trainee readiness, confidence, and engagement. Then, identified
                critical activities to map must-keep activities tied to core responsibilities, like managing
                inventory, tracking supplier deliveryt schedules, overseeing goods receipt and quality checks,
                and timely distributions to all departments.
              </p>
              <p>
                The department head assigned two Subject Matter Experts to the project; the facilitators who
                worked directly with trainees on the floor day-to-day. Through them, I gathered frequently
                asked questions from both orientation and daily work. They also emphasized the variance in
                trainee background knowledge, some had purchasing experience while others were completely new,
                and stressed the need for content that worked for mixed experience levels.
              </p>
            </div>

            {/* Solution */}
            <div className="tab-content" style={{ marginBottom: '28px' }}>
              <h3>Solution</h3>
              <p>
                Blending virtual introductions via Teams, complemented by self-paced learning path that
                consists of interactive video, 360° virtual tour, micro-learning modules, and system
                simulation.
              </p>
              <p>
                The interactive video gave trainees a general impression of the department, their roles and
                responsibilities. The 360° virtual tour enabled trainees to navigate the space freely and gain
                a realistic understanding of their working environment. System simulations provided hands-on
                practice with the end-to-end inventory management system workflows, from reviewing internal
                requisitions, placing external orders, to conducting stock counts. Most content is under NDA;
                examples below show the 360° tour with embedded challenges and the micro-learning recap
                structure.
              </p>

              <div className="gif-standalone">
                <GifPlayImage poster="/images/virtual-onboarding/virtual-tour.png" gif="/images/virtual-onboarding/virtual-tour.gif" alt="360 degree virtual tour with embedded scenario prompts" />
              </div>
              <p className="img-caption">Compressed for faster loading</p>
              <p>
                The 360° virtual tour included embedded scenario prompts to test their knowledge. Trainees
                already familiar with the facility could skip directly to the prompts.
              </p>

              <div className="gif-standalone">
                <GifPlayImage poster="/images/virtual-onboarding/knowledge-check.png" gif="/images/virtual-onboarding/knowledge-check.gif" alt="Knowledge checks and shortcuts inside simulation" />
              </div>
              <p className="img-caption">Compressed for faster loading</p>
              <p>
                Short recaps between units reinforce prior learning and preview what's next. For trainees with
                background knowledge, it's a way to get up to speed without sitting through everything.
              </p>

              <div className="gif-standalone">
                <GifPlayImage poster="/images/virtual-onboarding/recap.png" gif="/images/virtual-onboarding/Recap.gif" alt="Micro-learning recap between units" />
              </div>
              <p className="img-caption">Compressed for faster loading</p>
            </div>

            {/* Outcomes */}
            <div className="tab-content" style={{ marginBottom: '28px' }}>
              <h3>Outcomes</h3>
              <p>
                My walk arounds were encouraging, observing confident and engaged trainees on their work.
                Performance held up too; reports came back that trainees were handling responsibilities at a
                level that matched, if not exceeded, what they saw with traditional in-person onboarding.
                Engagement with the resources was strong too, time-on-course data showed genuine investment
                not just box-ticking. With a cohort of roughly eight trainees every five weeks, over 75%
                completed the full learning path; representing around 30 completions over six-month period.
              </p>
              <p>
                While COVID restrictions was the trigger, the solution outlived the problem. The department
                kept it running because trainees could revisit what they needed, every cohort got the same
                experience, and performance outcomes stayed on par with traditional onboarding.
              </p>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
