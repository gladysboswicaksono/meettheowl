/**
 * CourseNav — reusable sidenav for standalone HTML microlearnings.
 *
 * Usage:
 *   CourseNav.init({
 *     courseTitle:    'Course 02',
 *     courseSubtitle: 'Edit an Existing File',
 *     backHref:       'https://meettheowl.com/own-what-ai-builds',
 *     sections: [
 *       { id: 'intro',        label: 'Introduction' },
 *       { id: 'how-it-works', label: 'Lesson 1: How it works' },
 *       { id: 'practice',     label: 'Lesson 2: Make it yours' },
 *     ],
 *     lockedSections: ['how-it-works', 'practice'],
 *     onUnlock: (id) => { /* course-specific reveal logic *\/ },
 *   });
 *
 *   // Call from course JS to update sidenav state:
 *   CourseNav.unlock('how-it-works');
 */

(function (global) {
  'use strict';

  let _sections  = [];
  let _locked    = new Set();
  let _activeIdx = 0;
  let _onUnlock  = null;

  /* ── Build one nav item button ── */
  function buildItemHTML(s, i) {
    const locked = _locked.has(s.id);
    return `<button
      class="course-nav__item${_activeIdx === i ? ' is-active' : ''}${locked ? ' is-locked' : ''}"
      data-id="${s.id}"
      data-idx="${i}">
        <span class="course-nav__item-num">0${i + 1}</span>
        ${s.label}
        ${locked ? '<span class="course-nav__item-lock">🔒</span>' : ''}
    </button>`;
  }

  /* ── Attach click handlers to a container of nav items ── */
  function attachItemClicks(container, onNavigate) {
    container.querySelectorAll('.course-nav__item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id  = btn.dataset.id;
        const idx = parseInt(btn.dataset.idx, 10);
        if (_locked.has(id)) {
          if (_onUnlock) _onUnlock(id);
        } else {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          updateActive(idx);
        }
        if (onNavigate) onNavigate();
      });
    });
  }

  function renderItems() {
    /* ── Desktop sidenav ── */
    const container = document.querySelector('.course-nav__sections');
    if (container) {
      container.innerHTML = _sections.map(buildItemHTML).join('');
      attachItemClicks(container, null);
    }

    /* ── Mobile drawer ── */
    const drawerSections = document.querySelector('.course-mobile-drawer__sections');
    if (drawerSections) {
      drawerSections.innerHTML = _sections.map(buildItemHTML).join('');
      attachItemClicks(drawerSections, closeDrawer);
    }
  }

  function updateActive(idx) {
    _activeIdx = idx;
    renderItems();

    /* progress bar */
    const pct = _sections.length > 1
      ? Math.round((idx / (_sections.length - 1)) * 100)
      : 0;
    const fill  = document.querySelector('.course-nav__progress-fill');
    const label = document.querySelector('.course-nav__progress-label span:last-child');
    if (fill)  fill.style.width = pct + '%';
    if (label) label.textContent = pct + '%';

    /* pill label */
    const pillSection = document.querySelector('.course-progress-pill__section');
    if (pillSection && _sections[idx]) pillSection.textContent = _sections[idx].label;
  }

  function unlock(id) {
    _locked.delete(id);
    const idx = _sections.findIndex(s => s.id === id);
    if (idx !== -1) updateActive(idx);
    else renderItems();
  }

  /* ── Drawer open / close ── */
  function openDrawer() {
    document.querySelector('.course-mobile-drawer')?.classList.add('is-open');
    document.querySelector('.course-mobile-overlay')?.classList.add('is-open');
    document.querySelector('.course-progress-pill')?.classList.add('is-open');
  }

  function closeDrawer() {
    document.querySelector('.course-mobile-drawer')?.classList.remove('is-open');
    document.querySelector('.course-mobile-overlay')?.classList.remove('is-open');
    document.querySelector('.course-progress-pill')?.classList.remove('is-open');
  }

  function init(config) {
    const { courseTitle, courseSubtitle, sections, backHref, lockedSections, onUnlock } = config;
    _sections = sections;
    _locked   = new Set(lockedSections || []);
    _onUnlock = onUnlock || null;

    /* ── Desktop sidenav ── */
    const nav = document.createElement('nav');
    nav.className = 'course-nav';
    nav.setAttribute('aria-label', 'Course navigation');
    nav.innerHTML = `
      <div class="course-nav__header">
        <a href="${backHref || 'https://meettheowl.com/own-what-ai-builds'}" class="course-nav__back">← Back to portfolio</a>
        <span class="course-nav__num">${courseTitle}</span>
        <div class="course-nav__title">${courseSubtitle}</div>
      </div>
      <div class="course-nav__sections"></div>
      <div class="course-nav__footer">
        <div class="course-nav__progress-label"><span>Progress</span><span>0%</span></div>
        <div class="course-nav__progress-track">
          <div class="course-nav__progress-fill"></div>
        </div>
      </div>`;
    document.body.insertBefore(nav, document.body.firstChild);

    const spacer = document.createElement('div');
    spacer.className = 'course-nav-spacer';
    document.body.insertBefore(spacer, nav.nextSibling);

    const main = document.createElement('div');
    main.className = 'course-nav-main';
    [...document.body.children]
      .filter(el => el !== nav && el !== spacer && !el.matches('script,style'))
      .forEach(el => main.appendChild(el));
    document.body.appendChild(main);
    document.body.classList.add('course-nav-ready');

    /* ── Mobile overlay ── */
    const overlay = document.createElement('div');
    overlay.className = 'course-mobile-overlay';
    overlay.addEventListener('click', closeDrawer);
    document.body.appendChild(overlay);

    /* ── Mobile drawer ── */
    const drawer = document.createElement('div');
    drawer.className = 'course-mobile-drawer';
    drawer.innerHTML = `
      <div class="course-mobile-drawer__handle"></div>
      <div class="course-mobile-drawer__header">
        <a href="${backHref || 'https://meettheowl.com/own-what-ai-builds'}" class="course-mobile-drawer__back">← Back to portfolio</a>
        <div class="course-mobile-drawer__title">${courseSubtitle}</div>
      </div>
      <div class="course-mobile-drawer__sections"></div>`;
    document.body.appendChild(drawer);

    /* ── Mobile pill ── */
    const pill = document.createElement('button');
    pill.className = 'course-progress-pill';
    pill.setAttribute('aria-label', 'Open course navigation');
    pill.innerHTML = `
      <span>${courseTitle}</span>
      <span class="course-progress-pill__section">${sections[0]?.label || ''}</span>
      <span class="course-progress-pill__caret">▲</span>`;
    pill.addEventListener('click', () => {
      pill.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    document.body.appendChild(pill);

    renderItems();

    /* ── Scroll-spy ── */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = sections.findIndex(s => s.id === entry.target.id);
        if (idx !== -1 && !_locked.has(sections[idx].id)) updateActive(idx);
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    updateActive(0);
  }

  global.CourseNav = { init, unlock };
})(window);
