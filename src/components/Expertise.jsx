function KnowMarker() {
  return (
    <span className="expertise__know-marker" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const knows = [
  <>Which problems are <b>worth solving</b></>,
  <>How success should be <b>measured</b></>,
  <>Whether learning <b>actually changed behavior</b></>,
  <>How systems <b>scale beyond a pilot</b></>,
  <>When to <b>trust AI</b>, and when not to</>,
];

const IconEcosystem = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18.5" r="2" />
    <line x1="7" y1="6" x2="17" y2="6" /><line x1="6.6" y1="7.4" x2="11" y2="16.6" /><line x1="17.4" y1="7.4" x2="13" y2="16.6" />
  </svg>
);

const IconBulb = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" /><path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.1 1.3 1.2 2.4h5.2c.1-1.1.5-1.8 1.2-2.4A6 6 0 0 0 12 3z" />
  </svg>
);

const IconChart = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="20" x2="20.5" y2="20" />
    <rect x="6" y="12" width="3.2" height="6" /><rect x="11" y="8.5" width="3.2" height="9.5" /><rect x="16" y="5" width="3.2" height="13" />
  </svg>
);

const IconLoop = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 11.5A8 8 0 1 0 18.5 17" /><polyline points="20 5 20 11.5 13.5 11.5" />
  </svg>
);

const cards = [
  {
    num: '01',
    icon: IconEcosystem,
    title: 'End-to-end learning ecosystems that bring results',
    desc: (
      <>
        I design the whole learner path across tools and platforms so it works as one system, not
        scattered courses, with realistic practice built in where people can fail safely before it
        counts for real.
      </>
    ),
    tags: ['eLearning development', 'In-app enablement', 'Instructional video', 'Hands-on workshops', 'Objective frameworks', 'Articulate Rise & Storyline', 'Adobe Captivate', 'Figma'],
  },
  {
    num: '02',
    icon: IconBulb,
    title: 'Versatile, cost-effective problem-solving',
    desc: (
      <>
        I've saved past employers <strong>over $120k a year</strong> as a single IC, building custom
        workarounds instead of buying another tool. AI is my thinking partner for moving fast and
        pressure-testing assumptions; I validate everything before it ships.
      </>
    ),
    tags: ['Cross-source verification', 'Testing & experimentation', 'Documentation review', 'Data validation'],
  },
  {
    num: '03',
    icon: IconChart,
    title: 'Linking learning to business performance',
    desc: (
      <>
        Most training can't prove it worked. I connect learning data to the metrics people actually
        report on, so "did it move anything?" has an answer instead of a shrug.
      </>
    ),
    tags: ['Data manipulation & analysis', 'Visualization', 'SQL', 'Power BI', 'JavaScript'],
  },
  {
    num: '04',
    icon: IconLoop,
    title: 'Automating operations and manual work',
    desc: (
      <>
        I automate the repetitive admin that eats a team's week, so learning systems and operations
        keep running without someone babysitting them.
      </>
    ),
    tags: ['Google Apps Script', 'Power Automate', 'JavaScript', 'LMS integrations'],
  },
];

export default function Expertise() {
  return (
    <section className="expertise">
      <div className="expertise__inner">

        {/* Manifesto */}
        <div className="expertise__manifesto">
          <span className="expertise__rule" />
          <h2 className="expertise__title">What you'd get from me</h2>
          <p className="expertise__lede">
            A list of skills won't tell you what changes when you onboard me onto your team. What stays
            constant, no matter how the tools and workflows evolve, is the need for someone who knows:
          </p>

          <ul className="expertise__knows">
            {knows.map((item, i) => (
              <li className="expertise__know" key={i}>
                <KnowMarker />
                {item}
              </li>
            ))}
          </ul>

          <div className="expertise__closer">
            <p>I am <em>that someone.</em></p>
          </div>
        </div>

        {/* Expertise areas */}
        <div className="expertise__areas">
          {cards.map((c) => (
            <article className="expertise-card" key={c.num}>
              <div className="expertise-card__index">
                <span className="expertise-card__num">{c.num}</span>
                <span className="expertise-card__icon" aria-hidden="true">{c.icon}</span>
              </div>
              <div className="expertise-card__body">
                <h3 className="expertise-card__title">{c.title}</h3>
                <p className="expertise-card__desc">{c.desc}</p>
                <div className="expertise-card__tags">
                  {c.tags.map((t) => (
                    <span className="expertise-tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Payoff */}
        <div className="expertise__payoff">
          <p><em>Four</em> areas of expertise and more, for the price of <em>one</em></p>
        </div>

        {/* CTA */}
        <div className="expertise__cta">
          <a
            className="btn-secondary"
            href="https://www.linkedin.com/in/gladys-bos-wicaksono/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zM8 19h-3v-9h3v9zM6.5 8.25c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zM20 19h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.51 0-1.74 1.18-1.74 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
            </svg>
            Get in touch
          </a>
        </div>

      </div>
    </section>
  );
}
