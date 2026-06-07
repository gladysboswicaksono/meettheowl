import { useState } from 'react';


const STEPS = [
  {
    label: 'Step 1',
    title: 'Point it to your design system',
    body: "It's a good practice to have a file with your themes, colors, and fonts that you can easily point AI to. Without it, AI defaults to generic styles — and you spend the next hour re-prompting to fix the colors.",
  },
  {
    label: 'Step 2',
    title: 'Design the pattern',
    body: 'Name the interaction you want to incorporate: stepper, accordion, hotspot, knowledge check. The more specific you are with the pattern name, the more likely the output will be usable out of the box.',
  },
  {
    label: 'Step 3',
    title: 'Specify the output',
    body: 'Specify any constraints and structure: single HTML or separated files, standalone artifact or something you will embed. This avoids getting a beautifully built component that only works in isolation.',
  },
  {
    label: 'Step 4',
    title: 'Ask for readable names and inline comments',
    body: 'Tell it to name classes that describe what an element is (.step-detail, .accordion-body, .course-heading), and to add a comment above every major section. Your future self will thank you.',
  },
  {
    label: 'Step 5',
    title: 'Create reusable components',
    body: 'Like something? Ask it to create a reusable component out of it and save it in a centralized folder. The next time you build a course with AI, you can point directly to it — no rebuilding from scratch.',
  },
];

export default function AiCourseStepper() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div className="browser-window">

      {/* Tab strip */}
      <div className="browser-window__chrome">
        <div className="browser-window__dots">
          <span className="browser-window__dot browser-window__dot--red" />
          <span className="browser-window__dot browser-window__dot--yellow" />
          <span className="browser-window__dot browser-window__dot--green" />
        </div>
        <div className="browser-window__tab">
          <span className="browser-window__tab-title">stepper.html</span>
          <button className="browser-window__tab-close">✕</button>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="browser-window__navbar">
        <button className="browser-window__nav-btn">←</button>
        <button className="browser-window__nav-btn">→</button>
        <button className="browser-window__nav-btn">↺</button>
        <div className="browser-window__urlbar">
          <span className="browser-window__urlbar-icon">🔍</span>
          <span className="browser-window__urlbar-text">file:///stepper.html</span>
        </div>
      </div>

      {/* Page content */}
      <div className="browser-window__body">

        <div className="browser-window__page">
          <h3 className="browser-window__page-heading">Tips to work with AI to build your course</h3>
          <p className="browser-window__page-body">
            The output quality depends almost entirely on what you give AI upfront. Without a design system
            to reference, it defaults to generic styles. Without a defined pattern, it creates something that 
            works in isolation but is a nightmare to reuse and maintain.
          </p>
          <br></br>
          <p className='browser-window__page-body'>
            These <strong>five steps</strong> are not only gonna help you produce something <strong>more consistent</strong> but also <strong>scalable</strong> and <strong>maintainable</strong>.
          </p>
        </div>

        <div className="stepper-mock" style={{ borderRadius: 0, marginTop: 0, border: 'none' }}>
          {/* <div className="stepper-mock__label">Tips to work with AI to build your course</div> */}
          <div className="stepper-mock__body">

            <div className="stepper__steps">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  className={[
                    'stepper__step',
                    i === active ? 'is-active' : '',
                    i < active  ? 'is-done'   : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => setActive(i)}
                >
                  <span className="stepper__step-num">{s.label}</span>
                  {s.title}
                </button>
              ))}
            </div>

            <div className="stepper__detail">
              <h4 className="stepper__detail-title">{step.title}</h4>
              <p className="stepper__detail-body">{step.body}</p>
            </div>

            <div className="stepper__controls">
              <button
                className="stepper__btn stepper__btn--ghost"
                onClick={() => setActive(a => Math.max(0, a - 1))}
                disabled={active === 0}
              >
                ← Previous
              </button>
              <span className="stepper__counter">{active + 1} of {STEPS.length}</span>
              <button
                className="stepper__btn"
                onClick={() => setActive(a => Math.min(STEPS.length - 1, a + 1))}
                disabled={active === STEPS.length - 1}
              >
                Next step →
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
