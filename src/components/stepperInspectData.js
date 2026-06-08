export const SOURCE = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:wght@400;700&display=swap" rel="stylesheet">
<style>

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Page content (heading + intro) ── */
.page-content {
  padding: 32px 32px 24px;
  background: #FAFAF8;
  border-bottom: 1px solid #e0dede;
}
.page-heading {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 700;
  color: #2A2A2A;
  margin: 0 0 12px;
}
.page-body {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 16px;
  line-height: 1.3;
  color: #525252;
  margin: 0;
}

/* ── Wrapper ── */
.stepper {
  background: #FAFAF8;
  border: 1px solid rgba(246,199,133,0.25);
  border-radius: 10px;
  overflow: hidden;
}

/* ── Header label ── */
.stepper__label {
  background: #E8E6E6;
  color: #2A2A2A;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-bottom: 1px solid #d4d2d2;
}

/* ── Step buttons grid ── */
.stepper__steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

/* ── Individual step button ── */
.stepper__step {
  background: #FAFAF8;
  border: 1px solid #d4d2d2;
  border-radius: 6px;
  padding: 12px 10px;
  text-align: center;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: #2A2A2A;
  cursor: pointer;
}
.stepper__step.is-active {
  background: #5B0606;
  border-color: #5B0606;
  color: #FAFAF8;
}
.stepper__step.is-done {
  background: #2A2A2A;
  border-color: #2A2A2A;
  color: #F6C785;
}
.stepper__step:hover { border-color: #5B0606; }

/* ── Detail panel ── */
.stepper__detail {
  background: #E8E6E6;
  border-radius: 8px;
  padding: 22px 24px;
  min-height: 120px;
  margin-bottom: 16px;
}
.stepper__detail-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 700;
  color: #5B0606;
  text-transform: uppercase;
  margin: 0 0 10px;
}
.stepper__detail-body {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 17px;
  color: #2A2A2A;
  line-height: 1.65;
  margin: 0;
}

/* ── Navigation controls ── */
.stepper__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stepper__btn {
  background: #2A2A2A;
  color: #FAFAF8;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}
.stepper__btn.ghost {
  background: transparent;
  color: #2A2A2A;
  border: 1px solid #2A2A2A;
}
.stepper__btn:disabled { opacity: 0.35; cursor: not-allowed; }
.stepper__counter {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: #525252;
  letter-spacing: 0.04em;
}

</style>
</head>

<!-- ═══ HTML Structure ══════════════════════════════════════════════════ -->
<body style="margin: 0; background: #FAFAF8;">

<div class="page-content">
  <h3 class="page-heading">Tips to work with AI to build your course</h3>
  <p class="page-body">The output quality depends almost entirely on what you give AI upfront. Without a design system to reference, it defaults to generic styles. Without a defined pattern, it creates something that works in isolation but is a nightmare to reuse and maintain.</p>
  <br>
  <p class="page-body">These <strong>five tips</strong> are not only gonna help you produce something <strong>more consistent</strong> but also <strong>scalable</strong> and <strong>maintainable</strong>.</p>
</div>

<div class="stepper">
  <div style="padding: 24px;">
    <div class="stepper__steps" id="steps"></div>
    <div class="stepper__detail">
      <h4 class="stepper__detail-title" id="detail-title"></h4>
      <p  class="stepper__detail-body"  id="detail-body"></p>
    </div>
    <div class="stepper__controls">
      <button class="stepper__btn ghost" id="btn-prev" onclick="go(-1)">← Previous</button>
      <span   class="stepper__counter"   id="counter"></span>
      <button class="stepper__btn"       id="btn-next" onclick="go(1)">Next step →</button>
    </div>
  </div>
</div>

<!-- ═══ JavaScript ══════════════════════════════════════════════════════ -->
<script>
const steps = [
  { title: 'Point it to your design system',           body: "It's a good practice to have a file with your themes, colors, and fonts that you can easily point AI to. Without it, AI defaults to generic styles — and you spend the next hour re-prompting to fix the colors." },
  { title: 'Design the pattern',                        body: 'Name the interaction you want to incorporate: stepper, accordion, hotspot, knowledge check. The more specific you are with the pattern name, the more likely the output will be usable out of the box.' },
  { title: 'Specify the output',                        body: 'Specify any constraints and structure: single HTML or separated files, standalone artifact or something you will embed. This avoids getting a beautifully built component that only works in isolation.' },
  { title: 'Ask for readable names and inline comments', body: 'Tell it to name classes that describe what an element is (.step-detail, .accordion-body, .course-heading), and to add a comment above every major section. Your future self will thank you.' },
  { title: 'Create reusable components',                body: 'Like something? Ask it to create a reusable component out of it and save it in a centralized folder. The next time you build a course with AI, you can point directly to it — no rebuilding from scratch.' },
];
let active = 0;

function render() {
  document.getElementById('steps').innerHTML = steps.map((s, i) => \`
    <button class="stepper__step\${i===active?' is-active':i<active?' is-done':''}"
            onclick="setStep(\${i})">
      \${s.title}
    </button>\`).join('');
  document.getElementById('detail-title').textContent = steps[active].title;
  document.getElementById('detail-body').textContent  = steps[active].body;
  document.getElementById('counter').textContent = \`\${active+1} of \${steps.length}\`;
  document.getElementById('btn-prev').disabled = active === 0;
  document.getElementById('btn-next').disabled = active === steps.length - 1;
}

function setStep(i) { active = i; render(); }
function go(dir) {
  active = Math.max(0, Math.min(steps.length-1, active+dir));
  render();
}

render();
</script>

</body>
</html>`;

// ── Section map: class → search anchors in the source ────────────────────
export const SECTION_MAP = {
  'stepper-wrapper': {
    startSearch: '/* ── Wrapper ── */',
    endSearch:   '/* ── Header label ── */',
    label: '.stepper',
    desc: 'The outer container — sets the white background, rounded corners, and gold border.',
  },
  'stepper-label': {
    startSearch: '/* ── Header label ── */',
    endSearch:   '/* ── Step buttons grid ── */',
    label: '.stepper__label',
    desc: 'The gray header bar at the top. Cinzel font, uppercase, bordered bottom.',
  },
  'stepper-steps': {
    startSearch: '/* ── Step buttons grid ── */',
    endSearch:   '/* ── Individual step button ── */',
    label: '.stepper__steps',
    desc: 'CSS Grid — repeat(5, 1fr) splits the 5 step buttons into equal columns.',
  },
  'stepper-step': {
    startSearch: '/* ── Individual step button ── */',
    endSearch:   '/* ── Detail panel ── */',
    label: '.stepper__step',
    desc: 'Each step button. State variants .is-active (red) and .is-done (dark) are toggled by the JS render() function.',
  },
  'stepper-detail': {
    startSearch: '/* ── Detail panel ── */',
    endSearch:   '/* ── Navigation controls ── */',
    label: '.stepper__detail',
    desc: 'The content panel that shows the active step title and body. JS writes into it on every step change.',
  },
  'stepper-controls': {
    startSearch: '/* ── Navigation controls ── */',
    endSearch:   '</style>',
    label: '.stepper__controls',
    desc: 'Flex row that pushes the Previous button, counter, and Next button to the left, center, and right.',
  },
  'stepper-btn': {
    startSearch: '.stepper__btn {',
    endSearch:   '.stepper__counter',
    label: '.stepper__btn',
    desc: 'The dark pill button. .ghost flips to transparent with a border. :disabled lowers opacity.',
  },
};

// ── Original step bodies (used by exercise validators) ───────────────────
const ORIGINAL_BODIES = [
  "It's a good practice to have a file with your themes, colors, and fonts that you can easily point AI to. Without it, AI defaults to generic styles — and you spend the next hour re-prompting to fix the colors.",
  'Name the interaction you want to incorporate: stepper, accordion, hotspot, knowledge check. The more specific you are with the pattern name, the more likely the output will be usable out of the box.',
  'Specify any constraints and structure: single HTML or separated files, standalone artifact or something you will embed. This avoids getting a beautifully built component that only works in isolation.',
  'Tell it to name classes that describe what an element is (.step-detail, .accordion-body, .course-heading), and to add a comment above every major section. Your future self will thank you.',
  'Like something? Ask it to create a reusable component out of it and save it in a centralized folder. The next time you build a course with AI, you can point directly to it — no rebuilding from scratch.',
];

// ── Exercises ─────────────────────────────────────────────────────────────
export const EXERCISES = [
  {
    title: 'Exercise 1: Update the title',
    desc: 'Replace "Tips to work with AI to build your course" with any title of your choice. It appears in two places: the page heading and the stepper label.',
    validate(code) {
      const pass = !code.includes('Tips to work with AI to build your course');
      return {
        pass,
        feedback: pass
          ? 'Title updated.'
          : 'The original title still appears in the file. Look for the <h3 class="page-heading"> and replace the text.',
      };
    },
  },
  {
    title: 'Exercise 2: Rewrite a step',
    desc: 'Find the steps array in the JavaScript block and rewrite at least one body value. Replace it with your own words or a completely different topic.',
    validate(code) {
      const unchanged = ORIGINAL_BODIES.filter(b => code.includes(b));
      const pass = unchanged.length < ORIGINAL_BODIES.length;
      return {
        pass,
        feedback: pass
          ? `Step updated — ${ORIGINAL_BODIES.length - unchanged.length} of 5 bodies changed.`
          : 'All step bodies are still the original text. Find the steps array in the <script> block and change at least one body: value.',
      };
    },
  },
  {
    title: 'Exercise 3: Add a hover effect',
    desc: 'Find the .stepper__step:hover rule in the CSS and add a background-color property inside it. Try background-color: #5B060680 for a semi-transparent red.',
    validate(code) {
      const hoverIdx = code.indexOf('.stepper__step:hover');
      if (hoverIdx === -1) {
        return { pass: false, feedback: 'No .stepper__step:hover rule found — look in the <style> block.' };
      }
      const block = code.slice(hoverIdx, hoverIdx + 200);
      const pass = /background(-color)?\s*:/.test(block);
      return {
        pass,
        feedback: pass
          ? 'Hover effect added.'
          : 'Found .stepper__step:hover but no background or background-color property inside it. Add background-color: #5B060680; inside the { } block.',
      };
    },
  },
  {
    title: 'Exercise 4: Add a sixth step',
    desc: 'Add a new entry to the steps array in the JavaScript. Give it a title and body of your choice — it will appear as Step 6 in the stepper.',
    validate(code) {
      const count = (code.match(/\bbody\s*:/g) ?? []).length;
      const pass = count >= 6;
      return {
        pass,
        feedback: pass
          ? 'Step 6 added.'
          : `Found ${count} step${count === 1 ? '' : 's'} — need at least 6. Add a new { title: '...', body: '...' } entry to the steps array.`,
      };
    },
  },
  {
    title: 'Exercise 5: Add a browser tooltip',
    desc: 'Add a title attribute to each step button inside render() so hovering a step shows its full title as a native browser tooltip. Hint: add title="${s.title}" to the <button> element in the template.',
    validate(code) {
      const pass = /title\s*=\s*["'`][^"'`]*\$\{s\.title\}/.test(code);
      return {
        pass,
        feedback: pass
          ? 'Tooltip added — hovering a step button will now show the full title.'
          : 'No title attribute found on the step button. In render(), add title="${s.title}" to the <button> element.',
      };
    },
  },
];
