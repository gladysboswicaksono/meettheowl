import { useState } from 'react';

const testimonials = [
  {
    name: "Brenna O'Neil, Instructional Design Manager at Mews",
    tenure: 'My tenure: 2024 - present',
    highlight: 'She has proven to work quickly, meeting all deadlines, while also maintaining a high standard.',
    body: [
      "Gladys quickly immersed herself after her New Hire Orientation and began making significant contributions immediately. She introduced innovative ideas for incorporating storytelling and developed engaging hands-on activities, enhancing the overall learner experience.",
      "Beyond Instructional Design tasks, Gladys developed trained user levels and established metrics for measuring the number of active users. Her work has been instrumental in setting two of our departmental OKRs, reflecting her impact on our strategic goals.",
      "Gladys' achievements over her first six months at Mews demonstrate what an asset she is to our team and the company, we are very fortunate to have her on our team!",
    ],
  },
  {
    name: 'Monika Anderova, Former Head of Global Education at Mews',
    tenure: 'My tenure: 2024 - present',
    highlight: 'Her strategic thinking has been invaluable, particularly in identifying what needs to be measured and why.',
    body: [
      "Gladys has done an outstanding job leading the Data and Measurement workstream within the Global Education team at Mews. She took the initiative to redefine our trained user levels, which provide a much more granular and effective way to track how prepared our clients are to use Mews products.",
      "Beyond expectations, Gladys demonstrated incredible proactiveness and technical ability by building a dashboard herself. These efforts have provided new, actionable insights that were previously unavailable to the team.",
      "Collaborating with her on this project has been a true pleasure, as her foresight and clarity have made the process smooth and impactful.",
    ],
  },
  {
    name: 'Tianyi Tian, Former Academy Program Manager at Mendix',
    tenure: 'My tenure: 2022 - 2024',
    highlight: 'She has a talent for always asking the right questions.',
    body: [
      "Throughout my work with Gladys, she has consistently demonstrated an exceptional dedication to customer satisfaction. She has a talent for always asking the right questions, which not only ensures that the team does not miss out on important ideas to address the needs of our wide range of customers, but also uncovers latent customer desires, which helped us drive innovation and tailored solutions.",
      "Her commitment to excellence sets a standard of service that positively impacts both our clients and our team.",
    ],
  },
  {
    name: 'Audrey, Former Senior Practical Facilitator at NHL Stenden Hospitality Group',
    tenure: 'My tenure: 2018 - 2022',
    highlight: 'Her approachability and willingness to share knowledge have made her a go-to person for collaboration and support.',
    body: [
      "I had the pleasure of collaborating with Gladys on various L&D projects, and her insights and efforts have undoubtedly elevated our initiatives. She not only met deadlines and deliver high-quality work but also fostered a positive and inclusive working environment.",
      "Gladys is a hard-working and memorable professional, and an invaluable member of our organization who brings dedication and expertise to every project. I am confident that she will continue to make meaningful contributions in any future endeavors.",
    ],
  },
  {
    name: "Daan van Eenbergen, Former L&D Manager at NHL Stenden Hospitality Group",
    tenure: 'My tenure: 2018 - 2022',
    highlight: 'Gladys has the rare ability to translate complex learning needs into clear, actionable solutions.',
    body: [
      "Working with Gladys was always a productive and enjoyable experience. She brought creativity and rigor to every project, and her ability to work independently while keeping stakeholders informed made her an invaluable part of our L&D team.",
      "I would recommend Gladys without hesitation to any organization looking for a skilled and dependable learning professional.",
    ],
  },
];

function renderWithHighlight(text, highlight) {
  if (!text.includes(highlight)) return text;
  const [before, after] = text.split(highlight);
  return <>{before}<strong style={{ color: 'var(--gold)', fontWeight: 600 }}>{highlight}</strong>{after}</>;
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  const t = testimonials[current];

  const go = (i) => setCurrent((i + total) % total);

  return (
    <section style={{ backgroundColor: 'var(--blue-bg)', padding: '5rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '3rem' }}>
          Others' Eyes
        </h2>

        {/* Card */}
        <div style={{ backgroundColor: 'var(--blue-card)', position: 'relative' }}>

          {/* Prev */}
          <button onClick={() => go(current - 1)} aria-label="Previous" style={{
            position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
            width: '2.25rem', height: '2.25rem', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
            color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>‹</button>

          {/* Slide */}
          <div style={{ borderLeft: '4px solid var(--gold)', paddingLeft: '2rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.125rem', textAlign: 'center', fontVariant: 'small-caps', marginBottom: '0.25rem' }}>
              {t.name}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'rgba(232,230,230,0.6)', fontSize: '0.9375rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              {t.tenure}
            </p>
            <div style={{ width: '5rem', height: '1px', backgroundColor: 'var(--gold)', margin: '0 auto 1.5rem' }} />
            {t.body.map((para, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-body)', color: 'var(--gray)', fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '1rem' }}>
                {renderWithHighlight(para, t.highlight)}
              </p>
            ))}
          </div>

          {/* Next */}
          <button onClick={() => go(current + 1)} aria-label="Next" style={{
            position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
            width: '2.25rem', height: '2.25rem', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
            color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>›</button>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Testimonial ${i + 1}`} style={{
              height: '6px', width: i === current ? '2rem' : '0.5rem',
              borderRadius: '9999px', border: 'none', cursor: 'pointer',
              backgroundColor: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease', padding: 0,
            }} />
          ))}
        </div>

      </div>
    </section>
  );
}
