export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/images/logo-navigation.png" alt="MeetTheOwl" className="nav__logo" />
          <span className="nav__name">
            Gladys Bos-Wicaksono&nbsp;&nbsp;|&nbsp;&nbsp;meettheowl.com
          </span>
        </a>
      </div>
    </header>
  );
}
