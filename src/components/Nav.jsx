export default function Nav() {
  return (
    <header style={{
      backgroundColor: 'var(--red)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: '4rem',
    }}>
      <div style={{
        maxWidth: '100%',
        height: '100%',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/images/logo-navigation.png" alt="MeetTheOwl" style={{ height: '2.5rem', width: 'auto' }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--gold)',
            fontSize: '0.65625rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            Gladys Bos-Wicaksono&nbsp;&nbsp;|&nbsp;&nbsp;meettheowl.com
          </span>
        </a>
      </div>
    </header>
  );
}
