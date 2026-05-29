export default function ProjectCard({ image, imageAlt, category, title, description, href }) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--gold)' }}>

      <img src={image} alt={imageAlt} style={{ width: '100%', height: '300px', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem', gap: '1rem' }}>

        {/* Category tag */}
        <div style={{
          display: 'inline-block', alignSelf: 'flex-start',
          border: '1px solid var(--gold)', padding: '4px 12px',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', textTransform: 'uppercase', fontSize: '20px' }}>
          {title}
        </h3>

        {/* Description */}
        <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,230,230,0.85)', fontSize: '17px', lineHeight: 1.75, flex: 1, whiteSpace: 'pre-line' }}>
          {description}
        </p>

        {/* CTA */}
        <a href={href} className="btn-secondary">
          Learn More
        </a>
      </div>
    </article>
  );
}
