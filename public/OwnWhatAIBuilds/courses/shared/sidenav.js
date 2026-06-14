/**
 * CourseNav — reusable sidenav for standalone HTML microlearnings.
 *
 * Lessons behave as PAGES — only one is visible at a time.
 * Within a lesson, wrap content chunks in <div class="course-block">.
 * Blocks reveal progressively; previous blocks stay visible.
 * When the last block of a lesson is revealed, the action button becomes
 * "Next lesson →" which unlocks and navigates to the next lesson.
 * A "← Previous lesson" link is injected at the top of every lesson after
 * the first so the learner can always go back.
 *
 * Usage:
 *   CourseNav.init({
 *     courseTitle:    'Course 02',
 *     courseSubtitle: 'Edit an Existing File',
 *     backHref:       'https://meettheowl.com/own-what-ai-builds',
 *     sections: [
 *       { label: 'Getting Started', lessons: [
 *         { id: 'intro', label: 'Introduction', type: 'theory' },
 *       ]},
 *       { label: 'The Course', lessons: [
 *         { id: 'lesson-1', label: 'Lesson One', type: 'theory' },
 *         { id: 'lesson-2', label: 'Practice',   type: 'practice' },
 *       ]},
 *     ],
 *     lockedLessons: ['lesson-1', 'lesson-2'],
 *     onUnlock:   (id) => { },   // optional — intercept locked-lesson clicks in sidenav
 *     onComplete: ()  => { },   // optional — called when last lesson's last block is done
 *   });
 *
 *   CourseNav.unlock(id)    // unlock + navigate to a lesson
 *   CourseNav.complete(id)  // manually mark a lesson complete (updates progress)
 */

(function (global) {
  'use strict';

  /* ── Auto-size iframes that include resize-reporter.js ── */
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'courseIframeResize') return;
    document.querySelectorAll('iframe[src]').forEach(function (iframe) {
      iframe.style.height = Math.ceil(e.data.h) + 'px';
    });
  });

  let _sections   = [];
  let _lessons    = [];
  let _locked     = new Set();
  let _completed  = new Set();
  let _activeId   = null;
  let _onUnlock   = null;
  let _onComplete = null;
  let _collapsed  = new Set();
  let _blockState = {}; // lessonId → number of blocks revealed so far

  /* ── Inline SVGs (fill="currentColor" inherits the button's color) ── */
  const ICONS = {
    theory:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"><path d="M560-574v-48q33-14 67.5-21t72.5-7q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-610q-38 0-73 9.5T560-574Zm0 220v-49q33-13.5 67.5-20.25T700-430q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-390q-38 0-73 9t-67 27Zm0-110v-48q33-14 67.5-21t72.5-7q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-500q-38 0-73 9.5T560-464ZM248-300q53.57 0 104.28 12.5Q403-275 452-250v-427q-45-30-97.62-46.5Q301.76-740 248-740q-38 0-74.5 9.5T100-707v434q31-14 70.5-20.5T248-300Zm264 50q50-25 98-37.5T712-300q38 0 78.5 6t69.5 16v-429q-34-17-71.82-25-37.82-8-76.18-8-54 0-104.5 16.5T512-677v427Zm-30 90q-51-38-111-58.5T248-239q-36.54 0-71.77 9T106-208q-23.1 11-44.55-3Q40-225 40-251v-463q0-15 7-27.5T68-761q42-20 87.39-29.5 45.4-9.5 92.61-9.5 63 0 122.5 17T482-731q51-35 109.5-52T712-800q46.87 0 91.93 9.5Q849-781 891-761q14 7 21.5 19.5T920-714v463q0 27.89-22.5 42.45Q875-194 853-208q-34-14-69.23-22.5Q748.54-239 712-239q-63 0-121 21t-109 58ZM276-489Z"/></svg>`,
    practice: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"><path d="M768-120 517-371l57-57 251 251-57 57Zm-581 0-57-57 290-290-107-107-23 23-44-44v85l-24 24-122-122 24-24h86l-48-48 131-131q17-17 37-23t44-6q24 0 44 8.5t37 25.5L348-699l48 48-24 24 104 104 122-122q-8-13-12.5-30t-4.5-36q0-53 38.5-91.5T711-841q15 0 25.5 3t17.5 8l-85 85 75 75 85-85q5 8 8.5 19.5T841-709q0 53-38.5 91.5T711-579q-18 0-31-2.5t-24-7.5L187-120Z"/></svg>`,
  };

  /* ── Build one lesson button (sidenav item) ── */
  function buildLessonHTML(lesson) {
    const locked    = _locked.has(lesson.id);
    const completed = _completed.has(lesson.id);
    const active    = _activeId === lesson.id;
    const cls = [
      'course-nav__item',
      active    ? 'is-active'    : '',
      completed ? 'is-completed' : '',
      locked    ? 'is-locked'    : '',
    ].filter(Boolean).join(' ');

    const icon = ICONS[lesson.type] || ICONS.theory;

    return `<button class="${cls}" data-id="${lesson.id}">
      <span class="course-nav__icon">
        ${icon}
        ${completed ? '<span class="course-nav__icon-check">✓</span>' : ''}
      </span>
      <span class="course-nav__item-label">${lesson.label}</span>
      ${locked ? '<span class="course-nav__item-lock"></span>' : ''}
    </button>`;
  }

  /* ── Build one section group ── */
  function buildGroupHTML(group, gIdx) {
    const collapsed = _collapsed.has(gIdx);
    const count     = group.lessons.length;
    return `<div class="course-nav__group${collapsed ? ' is-collapsed' : ''}" data-group="${gIdx}">
      <button class="course-nav__group-header" data-group="${gIdx}">
        <span class="course-nav__group-label">${group.label}</span>
        <span class="course-nav__group-meta">${count} lesson${count !== 1 ? 's' : ''}</span>
        <span class="course-nav__group-caret">›</span>
      </button>
      <div class="course-nav__group-lessons">
        ${group.lessons.map(buildLessonHTML).join('')}
      </div>
    </div>`;
  }

  /* ── Render lessons into a container (desktop nav or mobile drawer) ── */
  function renderInto(container, onNavigate) {
    if (!container) return;
    container.innerHTML = _sections.map(buildGroupHTML).join('');

    container.querySelectorAll('.course-nav__group-header').forEach(btn => {
      btn.addEventListener('click', () => {
        const gIdx = parseInt(btn.dataset.group, 10);
        if (_collapsed.has(gIdx)) _collapsed.delete(gIdx);
        else _collapsed.add(gIdx);
        renderAll();
      });
    });

    container.querySelectorAll('.course-nav__item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (_locked.has(id)) {
          if (_onUnlock) _onUnlock(id);
          else unlock(id);
        } else {
          navigateToLesson(id);
        }
        if (onNavigate) onNavigate();
      });
    });
  }

  function renderAll() {
    renderInto(document.querySelector('.course-nav__sections'), null);
    renderInto(document.querySelector('.course-mobile-drawer__sections'), closeDrawer);
  }

  /* ── Update sidenav highlight and pill label (no page switch) ── */
  function setActive(id) {
    _activeId = id;
    renderAll();
    const lesson = _lessons.find(l => l.id === id);
    const pillSection = document.querySelector('.course-progress-pill__section');
    if (pillSection && lesson) pillSection.textContent = lesson.label;
    updateProgress();
  }

  function updateProgress() {
    const pct = _lessons.length > 0
      ? Math.round((_completed.size / _lessons.length) * 100)
      : 0;
    const fill  = document.querySelector('.course-nav__progress-fill');
    const label = document.querySelector('.course-nav__progress-label span:last-child');
    if (fill)  fill.style.width  = pct + '%';
    if (label) label.textContent = pct + '%';
  }

  /* ── Switch the visible lesson (page view) ── */
  function navigateToLesson(id) {
    _lessons.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) el.classList.toggle('is-page-active', l.id === id);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    initBlocksForLesson(id);
    setActive(id);
  }

  /* ── Progressive block reveal within the active lesson ── */
  function initBlocksForLesson(id) {
    const section = document.getElementById(id);
    if (!section) return;
    const blocks = Array.from(section.querySelectorAll('.course-block'));
    if (!blocks.length) return;

    if (_blockState[id] === undefined) _blockState[id] = 1;
    const revealed = _blockState[id];

    blocks.forEach((block, i) => {
      // Show or hide this block
      block.style.display = i < revealed ? '' : 'none';

      // Remove any previously injected action button from this block
      block.querySelector('.block-action')?.remove();

      // Only add a button to the last revealed block
      if (i !== revealed - 1) return;

      const btn = document.createElement('button');

      if (i < blocks.length - 1) {
        // There are more blocks to reveal
        btn.className = 'block-action block-action--continue';
        btn.textContent = 'Continue ↓';
        btn.addEventListener('click', () => {
          _blockState[id]++;
          initBlocksForLesson(id);
          const next = blocks[_blockState[id] - 1];
          if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      } else {
        // Last block revealed — lesson is complete
        if (!_completed.has(id)) {
          _completed.add(id);
          renderAll();
          updateProgress();
        }

        const lessonIdx = _lessons.findIndex(l => l.id === id);
        const nextLesson = _lessons[lessonIdx + 1];

        if (nextLesson) {
          btn.className = 'block-action block-action--next-lesson';
          btn.textContent = nextLesson.label + ' →';
          btn.addEventListener('click', () => {
            if (_locked.has(nextLesson.id)) unlock(nextLesson.id);
            else navigateToLesson(nextLesson.id);
          });
        } else {
          btn.className = 'block-action block-action--complete';
          btn.textContent = 'Finish course →';
          btn.addEventListener('click', handleCourseComplete);
        }
      }

      block.appendChild(btn);
    });
  }

  /* ── Hide the last lesson and call the course's onComplete hook ── */
  function handleCourseComplete() {
    const lastSection = document.getElementById(_activeId);
    if (lastSection) lastSection.classList.remove('is-page-active');
    if (_onComplete) _onComplete();
  }

  /* ── Inject "← Previous lesson" link at the top of each lesson after the first ── */
  function initPrevLinks() {
    _lessons.forEach((lesson, idx) => {
      if (idx === 0) return;
      const section = document.getElementById(lesson.id);
      if (!section) return;

      section.querySelector('.lesson-back')?.remove();

      const prevLesson = _lessons[idx - 1];
      const btn = document.createElement('button');
      btn.className = 'lesson-back';
      btn.textContent = '← ' + prevLesson.label;
      btn.addEventListener('click', () => navigateToLesson(prevLesson.id));
      section.prepend(btn);
    });
  }

  /* ── Unlock a lesson and navigate to it ── */
  function unlock(id) {
    _locked.delete(id);
    _sections.forEach((group, gIdx) => {
      if (group.lessons.some(l => l.id === id)) _collapsed.delete(gIdx);
    });
    navigateToLesson(id);
  }

  /* ── Manually mark a lesson as complete ── */
  function complete(id) {
    _completed.add(id);
    renderAll();
    updateProgress();
  }

  /* ── Drawer helpers ── */
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

  /* ── Show only the initially active lesson; hide all others ── */
  function initPageView() {
    _lessons.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) el.classList.toggle('is-page-active', l.id === _activeId);
    });
    if (_activeId) initBlocksForLesson(_activeId);
  }

  function init(config) {
    const { courseTitle, courseSubtitle, sections, backHref, lockedLessons, onUnlock, onComplete } = config;
    _sections   = sections;
    _lessons    = sections.flatMap(g => g.lessons);
    _locked     = new Set(lockedLessons || []);
    _onUnlock   = onUnlock  || null;
    _onComplete = onComplete || null;

    sections.forEach((group, gIdx) => {
      if (group.lessons.every(l => _locked.has(l.id))) _collapsed.add(gIdx);
    });

    const first = _lessons.find(l => !_locked.has(l.id));
    _activeId = first?.id || null;

    /* ── Desktop sidenav ── */
    const nav = document.createElement('nav');
    nav.className = 'course-nav';
    nav.setAttribute('aria-label', 'Course navigation');
    nav.innerHTML = `
      <div class="course-nav__header">
        <a href="${backHref || 'https://meettheowl.com/own-what-ai-builds'}" class="course-nav__back">← Back to portfolio</a>
        <span class="course-nav__num">${courseTitle}</span>
        <div class="course-nav__title">${courseSubtitle}</div>
        <div class="course-nav__legend">
          <span class="course-nav__legend-item">${ICONS.theory}<span>Theory</span></span>
          <span class="course-nav__legend-item">${ICONS.practice}<span>Practice</span></span>
        </div>
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
      <span class="course-progress-pill__section">${_lessons[0]?.label || ''}</span>
      <span class="course-progress-pill__caret">▲</span>`;
    pill.addEventListener('click', () => {
      pill.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    document.body.appendChild(pill);

    renderAll();
    initPrevLinks();
    initPageView();
  }

  global.CourseNav = { init, unlock, complete };
})(window);
