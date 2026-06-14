# Course System — Maintenance & Authoring Guide

This guide covers everything you need to create a new course, add a lesson, wire up
navigation, and keep the system consistent. No build tools needed — courses are plain
HTML files served as static assets.

---

## Table of contents

1. [How the system works](#1-how-the-system-works)
2. [File structure](#2-file-structure)
3. [Creating a new course from scratch](#3-creating-a-new-course-from-scratch)
4. [Adding a new lesson to an existing course](#4-adding-a-new-lesson-to-an-existing-course)
5. [Wiring up the progressive unlock (Up next / CTA)](#5-wiring-up-the-progressive-unlock)
6. [Mapping lesson blocks to the sidenav](#6-mapping-lesson-blocks-to-the-sidenav)
7. [Editing lesson interactivity](#7-editing-lesson-interactivity)
8. [Replacing the practice file](#8-replacing-the-practice-file)
9. [CSS classes reference](#9-css-classes-reference)
10. [Checklist for a new course](#10-checklist-for-a-new-course)

---

## 1. How the system works

Each course is a **single HTML file** (`index.html`) inside its own folder. Three shared
files do the heavy lifting so you don't repeat yourself across courses:

| File | Purpose |
|---|---|
| `shared/tokens.css` | Shared colors, typography, and other design tokens |
| `shared/course.css` | Course styling — reset, layout, components |
| `shared/sidenav.css` | Desktop and mobile course navigation styling |
| `shared/sidenav.js` | Injects the left sidenav, progress bar, and mobile pill |
| `public/OwnWhatAIBuilds/downloads/stepper.html` | The editable file used by Course 02 exercises |

The course HTML is just content. It declares which sections exist, which ones start
locked, and hands the unlock callback to `CourseNav.init()`. Everything else — DOM
injection, scroll-spy, progress, the "Up next" CTA — is driven by two short JS blocks
at the bottom of the file.

### How progressive unlock works

1. Every lesson section except the first starts with `data-locked` on it.
2. CSS rule `.course-section[data-locked] { display: none; }` hides them.
3. On page load, `renderCta()` finds the last visible section and appends a single
   "Up next" button pointing at the next locked section.
4. Clicking "Up next" calls `unlockSection(id)`, which:
   - removes `data-locked` from the target section
   - calls `CourseNav.unlock(id)` so the sidenav updates
   - calls `renderCta()` again so the button moves to the newly revealed section
   - smooth-scrolls the user to the top of the new section
5. When the last section is unlocked, `renderCta()` reveals the hidden `<footer>` instead.

---

## 2. File structure

```
public/
  courses/
    shared/
      tokens.css          ← shared design tokens
      course.css          ← shared course styles (edit here, not in each course)
      sidenav.css         ← shared navigation styles
      sidenav.js          ← shared sidenav component (rarely needs editing)
    01-write-from-scratch/
      index.html          ← Course 01 (coming soon)
    edit-existing-file/
      index.html          ← Course 02 (built)
    03-structure-files/
      index.html          ← Course 03 (coming soon)
    COURSE-GUIDE.md       ← this file
  downloads/
    stepper.html          ← downloadable file used in Course 02 exercises
```

A new course always gets its own numbered folder: `04-your-course-name/index.html`.

---

## 3. Creating a new course from scratch

### Step 1 — Copy the shell

Start from this minimal HTML shell and paste it into your new
`public/OwnWhatAIBuilds/courses/04-your-course/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course 04 — Your Course Title | Own What AI Builds</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../shared/course.css">
  <link rel="stylesheet" href="../shared/sidenav.css">
</head>
<body>

<div class="course-page">

  <!-- ══ SECTION 1: Introduction ══════════════════════════════════════════ -->
  <section id="intro" class="course-section">
    <span class="section-eyebrow">Course 04 · Your Course Title</span>
    <h1 class="section-heading">Your course heading here.</h1>
    <p class="section-intro">
      One or two sentences: what this course is about and what the learner
      will be able to do when they finish.
    </p>

    <div class="lesson__divider">What you'll be able to do<hr></div>
    <ol class="lesson-ol">
      <li>First outcome</li>
      <li>Second outcome</li>
      <li>Third outcome</li>
    </ol>

    <div class="callout">
      Any prerequisite or framing note for the learner.
    </div>
  </section>

  <!-- ══ SECTION 2: Lesson 1 ══════════════════════════════════════════════ -->
  <section id="lesson-1" class="course-section" data-locked>
    <span class="section-eyebrow">Lesson 1</span>
    <h2 class="section-heading">Your lesson title</h2>
    <p class="section-intro">One sentence framing what this lesson covers.</p>

    <!-- lesson content goes here -->

  </section>

  <!-- ══ Course footer ════════════════════════════════════════════════════ -->
  <footer class="course-footer" id="course-footer" style="display:none">
    <span class="course-footer__eyebrow">You've finished Course 04</span>
    <h2 class="course-footer__heading">What's next</h2>
    <p class="course-footer__body">
      Brief sentence pointing the learner to the next course or back to the portfolio.
    </p>
    <div class="course-footer__links">
      <a href="https://meettheowl.com/own-what-ai-builds" class="course-footer__link">Back to portfolio</a>
    </div>
  </footer>

</div><!-- /.course-page -->

<!-- ═══ Sidenav ═════════════════════════════════════════════════════════ -->
<script src="../shared/sidenav.js"></script>
<script>
  const COURSE_SECTIONS = [
    { id: 'intro',    label: 'Introduction' },
    { id: 'lesson-1', label: 'Lesson 1: Your lesson title' },
  ];

  CourseNav.init({
    courseTitle:    'Course 04',
    courseSubtitle: 'Your Course Title',
    backHref:       'https://meettheowl.com/own-what-ai-builds',
    sections:       COURSE_SECTIONS,
    lockedSections: ['lesson-1'],       // ← every section except intro
    onUnlock:       (id) => unlockSection(id),
  });

  function renderCta() {
    document.querySelectorAll('.section-cta').forEach(el => el.remove());
    let lastRevealedIdx = -1;
    for (let i = 0; i < COURSE_SECTIONS.length; i++) {
      const el = document.getElementById(COURSE_SECTIONS[i].id);
      if (el && !el.hasAttribute('data-locked')) lastRevealedIdx = i;
    }
    const nextIdx = lastRevealedIdx + 1;
    if (nextIdx >= COURSE_SECTIONS.length) {
      const footer = document.getElementById('course-footer');
      if (footer) footer.style.display = '';
      return;
    }
    const hostSection = document.getElementById(COURSE_SECTIONS[lastRevealedIdx].id);
    const nextSection = COURSE_SECTIONS[nextIdx];
    if (!hostSection) return;
    const cta = document.createElement('div');
    cta.className = 'section-cta';
    cta.innerHTML = `
      <span class="section-cta__label">Up next</span>
      <button class="section-cta__btn" data-unlock="${nextSection.id}">
        ${nextSection.label} <span class="arrow">→</span>
      </button>`;
    cta.querySelector('button').addEventListener('click', () => unlockSection(nextSection.id));
    hostSection.appendChild(cta);
  }

  function unlockSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.removeAttribute('data-locked');
    CourseNav.unlock(id);
    renderCta();
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  renderCta();
</script>

</body>
</html>
```

### Step 2 — Add the course card to the portfolio page

Open `src/pages/OwnWhatAIBuildsPage.jsx` and find the `.courses-grid` block. Copy an
existing `.course-card` and update:

- The `.course-card__num` text: `04`
- The `.course-card__title`: your course title
- The `.course-card__outcomes` list items: 3–4 bullet outcomes
- The `.course-card__meta`: tool or topic label
- The CTA `<a>` href: `/OwnWhatAIBuilds/courses/04-your-course/` and remove `course-card__cta--soon`

---

## 4. Adding a new lesson to an existing course

A lesson is just a `<section>` with a unique `id`, the class `course-section`, and
`data-locked` to start hidden.

### Step 1 — Write the HTML

Add the new section **before** the `<footer>`, after the last existing section:

```html
<!-- ══ SECTION 3: Lesson 2 ══════════════════════════════════════════════ -->
<section id="lesson-2" class="course-section" data-locked>
  <span class="section-eyebrow">Lesson 2</span>
  <h2 class="section-heading">Your new lesson title</h2>
  <p class="section-intro">One-sentence framing.</p>

  <div class="lesson__divider">First topic<hr></div>
  <p class="lesson__p">Your content here.</p>

</section>
```

**Rules:**
- `id` must be unique on the page — use `lesson-2`, `lesson-3`, etc. or a descriptive
  slug like `practice` or `recap`.
- Always include `data-locked` unless this is the first section (intro is never locked).
- The eyebrow reads "Lesson 2", "Lesson 3", etc. — keep it sequential.

### Step 2 — Register it in `COURSE_SECTIONS`

Find the `COURSE_SECTIONS` array in the script block at the bottom of the file and add
a new entry **in the order you want the lesson to appear**:

```js
const COURSE_SECTIONS = [
  { id: 'intro',    label: 'Introduction' },
  { id: 'lesson-1', label: 'Lesson 1: The three-block structure' },
  { id: 'lesson-2', label: 'Lesson 2: Your new lesson title' },  // ← add this
];
```

The `label` is what appears in the sidenav and on the "Up next" button. Keep it short
(under ~40 characters) so it fits without wrapping in the nav.

### Step 3 — Add the id to `lockedSections`

```js
lockedSections: ['lesson-1', 'lesson-2'],   // ← add the new id here
```

That's it. `renderCta()` and `CourseNav.unlock()` handle everything else automatically.

---

## 5. Wiring up the progressive unlock

The "Up next" button, the sidenav state, and the footer reveal are all driven by two
arrays that must stay in sync: **`COURSE_SECTIONS`** (the ordered list) and
**`lockedSections`** (the subset that starts hidden).

### The rules

| What | Where | Value |
|---|---|---|
| Intro section | `COURSE_SECTIONS[0]` | Never in `lockedSections` |
| Every other section | `COURSE_SECTIONS[1..n]` | Must be in `lockedSections` |
| Footer | `id="course-footer" style="display:none"` | Revealed when all sections unlocked |

### How "Up next" decides what to show

`renderCta()` walks `COURSE_SECTIONS` from index 0 and finds the **last** entry whose
corresponding `<section>` does NOT have `data-locked`. It appends the CTA to that
section, pointing at `COURSE_SECTIONS[lastRevealedIdx + 1]`.

Example with 4 sections (intro + 3 lessons):

| State | Last revealed | CTA points at |
|---|---|---|
| Page load | `intro` (idx 0) | `lesson-1` (idx 1) |
| After lesson-1 unlocked | `lesson-1` (idx 1) | `lesson-2` (idx 2) |
| After lesson-2 unlocked | `lesson-2` (idx 2) | `lesson-3` (idx 3) |
| After lesson-3 unlocked | `lesson-3` (idx 3) | footer revealed, no CTA |

**You never need to edit `renderCta()` itself.** Only `COURSE_SECTIONS` and
`lockedSections` need updating when you add or remove a lesson.

---

## 6. Mapping lesson blocks to the sidenav

The sidenav item label and the section `id` must correspond exactly.

```
COURSE_SECTIONS entry          ←→    <section id="..."> in the HTML
{ id: 'lesson-2',                    <section id="lesson-2"
  label: 'Lesson 2: ...' }             class="course-section" data-locked>
```

**Common mistakes:**

- `id` in `COURSE_SECTIONS` does not match the `id` on the `<section>` → section never
  unlocks, CTA never moves, progress never advances.
- Section in HTML but missing from `COURSE_SECTIONS` → sidenav doesn't list it,
  scroll-spy won't highlight it, and it won't participate in the unlock sequence.
- Section in `COURSE_SECTIONS` but not in `lockedSections` and not the intro → it will
  be visible on page load (probably not what you want).

**How to verify the mapping is correct:**

Open the course in the browser and check the browser console for errors, then:
1. The sidenav should show exactly as many items as there are entries in `COURSE_SECTIONS`.
2. All items except "Introduction" should show the lock icon (🔒) on first load.
3. Clicking "Up next" should reveal the correct section and update the sidenav.

---

## 7. Editing lesson interactivity

### Changing the "Up next" button label

The button label comes from the `label` field of the NEXT section in `COURSE_SECTIONS`.
To change it, update that entry's `label`:

```js
// Before
{ id: 'lesson-1', label: 'Lesson 1: The three-block structure' },

// After
{ id: 'lesson-1', label: 'Lesson 1: How files are built' },
```

The sidenav item label updates automatically from the same value.

### Reordering lessons

Change the order of entries in `COURSE_SECTIONS`. The unlock sequence follows the
array order, not the DOM order — but keep DOM order and array order in sync to avoid
confusion. Move the `<section>` blocks in the HTML to match.

### Removing a lesson

1. Delete the `<section>` block from the HTML.
2. Remove its entry from `COURSE_SECTIONS`.
3. Remove its `id` from `lockedSections`.

### Adding an exercise or interactive element inside a lesson

Any JS-driven content (like the stepper demo or the exercise editor) lives in its own
`<script>` block **after** the sidenav script block. It can reference elements inside
any section freely. If the content lives inside a locked section, the DOM element
exists but `display:none` keeps it invisible — the JS still initialises fine when the
section is unlocked.

---

## 8. Replacing the practice file

Course 02 exercises are built around a specific downloadable file. When you replace
that file with a different product, two files need to change — nothing else.

**`public/OwnWhatAIBuilds/downloads/stepper.html`**
The file learners download and edit. Replace the entire content with your new file.

**`src/components/stepperInspectData.js`**
Contains two things that must stay in sync with the file above:

- `SOURCE` — the full file content as a string. Must match `stepper.html` exactly,
  character for character. The in-browser editor loads from this string, not from the
  download directly.
- `EXERCISES` — the five exercise validators. Each one checks for specific strings,
  class names, or structures from the source file. If your new file has different class
  names, different text, or a different structure, update every validator that
  references content from the old file.

The course HTML (`index.html`) does not need touching — it has no knowledge of what
is inside the file. It only loads the exercises and editor from `stepperInspectData.js`.

---

## 9. CSS classes reference

Course-content classes live in `shared/course.css`; navigation classes live in
`shared/sidenav.css`. Never add a `<style>` block to a course HTML file. Mirror
shared course classes in `src/styles/ai-course.css` when the React app also needs them.

### Layout

| Class | Use |
|---|---|
| `.course-page` | Max-width wrapper, horizontal padding |
| `.course-section` | Top padding, separator border between sections |
| `.course-section[data-locked]` | Hides section until unlocked (do not remove) |

### Section header

| Class | Use |
|---|---|
| `.section-eyebrow` | Small gold caps label (e.g. "Lesson 1") |
| `.section-heading` | `<h1>` or `<h2>` — large white Cinzel heading |
| `.section-intro` | Slightly larger intro paragraph below the heading |

### Body content

| Class | Use |
|---|---|
| `.lesson__divider` | Gold sub-heading with a `<hr>` — wrap text + `<hr>` inside |
| `.lesson__p` | Standard body paragraph (max 680px) |
| `.inline-code` | Inline `<code>` style — gold monospace on dark bg |
| `.lesson-ol` | Numbered list with gold circle counters |
| `.callout` | Gold left-border callout box, italic, for notes/tips |
| `.code-block` | Multi-line syntax-highlighted code display (read-only) |

### Components

| Class | Use |
|---|---|
| `.anatomy-grid` / `.anatomy-card` | 3-col card grid (HTML/CSS/JS anatomy) |
| `.browser-window` | Mac-style browser frame mock |
| `.stepper-mock` | Stepper component wrapper (inside a browser-window) |
| `.editor-block` | Live code editor + preview panel |
| `.exercise-stack` / `.exercise-card` | Exercise list with pass/fail state |
| `.download-btn` | Gold outlined download link |

### Navigation / unlock

| Class | Use |
|---|---|
| `.section-cta` | "Up next" container — injected by JS, never write manually |
| `.course-footer` | End-of-course "What's next" block — start with `style="display:none"` |

---

## 10. Checklist for a new course

Copy this checklist when starting a new course:

```
[ ] Created public/OwnWhatAIBuilds/courses/0N-course-name/index.html
[ ] <title> updated with course number and title
[ ] <link> to ../shared/course.css and ../shared/sidenav.css
[ ] <link> to Google Fonts included
[ ] Intro section has id="intro" and NO data-locked
[ ] Every lesson section has a unique id and data-locked
[ ] <footer id="course-footer" style="display:none"> present
[ ] COURSE_SECTIONS array lists every section in DOM order
[ ] lockedSections lists every section except intro
[ ] onUnlock: (id) => unlockSection(id) callback wired up
[ ] renderCta() and unlockSection() copied from shell (no changes needed)
[ ] renderCta() called once at the end of the script block
[ ] Course card added to OwnWhatAIBuildsPage.jsx with correct href
[ ] Opened in browser: sidenav shows, all lessons locked, Up next button visible
[ ] Clicked through every lesson unlock end-to-end: footer appears after last lesson
[ ] Checked on mobile (≤768px): sidenav hidden, progress pill visible at bottom
```
