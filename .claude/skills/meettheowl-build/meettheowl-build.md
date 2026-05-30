---
name: meettheowl-build
description: >
  Implementation playbook for the MeetTheOwl portfolio (Gladys Bos-Wicaksono's
  React + Vite rebuild of her Wix site at gladys1998crb.wixstudio.com/theowl).
  Use this skill for ANY build, edit, styling, or layout task on the portfolio:
  creating or changing pages, components, sections, CSS, design tokens, the nav,
  hero, artifacts grid, testimonials carousel, footer, or the four project pages
  (Owllocate, Training Impact, Needs Analysis, Virtual Onboarding). Trigger
  whenever the user asks to build, add, fix, restyle, match, or recreate any part
  of the site so it matches the original Wix design with full fidelity. This skill
  carries the verified design system (colors, fonts, spacing, component anatomy)
  captured directly from the live site. For writing/rewriting prose, also use
  meettheowl-voice. This is the design source of truth — do not invent tokens,
  class names, or section structures; check here first.
---

# MeetTheOwl Build Skill

The job is full visual fidelity to the original Wix site. This file is the verified
spec, captured by inspecting computed styles and content on the live site. When this
skill and a screenshot disagree, trust the screenshot of the live site and update
this file. When this skill and `CLAUDE.md` overlap, this file wins on visual/structural
detail; `CLAUDE.md` is the reference for exhaustive page copy.

- Live reference: https://gladys1998crb.wixstudio.com/theowl
- Repo root for the build: `E:\Portfolio\site`
- Dev server: `npm run dev` → http://localhost:5173

---

## Non-negotiable rules

- React + Vite, **plain CSS only**. No Tailwind, no Astro, no CSS-in-JS, no new build tooling.
- All global styles live in `src/index.css`. Components in `src/components/`.
- Font sizes in **px**, never rem.
- `p1` / `p2` / `p3` are CSS classes: `<p className="p1">`, never `<p1>`.
- Artifact cards have **no background** — they sit on the section gradient. Never add card bg color.
- Inline styles in JSX are fine; reach for a CSS class only when responsive control is needed.
- Don't invent button or section class names. The real ones are listed below — use them.
- Uppercase on the homepage H1 is **literal text typed in caps**, not `text-transform`. Project-page titles are mixed case.

---

## Design tokens (verified against computed styles)

Defined in `:root` in `src/index.css`:

| Token | Hex | Used for |
|---|---|---|
| `--red` | `#5B0606` | Headings, nav background, `.btn-primary`, deep-red section gradient, disclaimer border |
| `--gold` | `#F6C785` | Section labels, vertical accent borders, dividers, `.btn-secondary`, active tab text, active carousel dot, footer owl watermark |
| `--blue-card` | `#1A1A2E` | Testimonials section background, `.tab-content` panel background |
| `--blue-bg` | `#1C253C` | Navy deep-dive section background (`.deep-section--navy`) |
| `--gray` | `#E8E6E6` | Hero / light section background, nav name text |
| `--dark` | `#2A2A2A` | Footer charcoal background; token for dark text |
| `--white` | `#FAFAF8` | Light text on dark sections |

**Verified colors that matter:**
- Body paragraph text on light backgrounds is **`#363838`** (verified on the live site). `body { color: #363838; }` is set in `index.css`. (There used to be a `color: var(--blue)` typo here — `--blue` was never defined, so body text fell back to black. Fixed.)
- Heading red is exactly `#5B0606`.
- Artifacts section gradient: `linear-gradient(180deg, #6B0808 0%, #2D0202 100%)` bleeding into navy. The rebuild's `.deep-section--red` / `.cta-section` use `#6B0808 → #3D0202` — keep consistent within a page.

> Note: there is **no `--blue` token**. The only blues are `--blue-card` (#1A1A2E) and `--blue-bg` (#1C253C), both dark-navy *backgrounds*. Body text must be dark ink (`#363838`), never a blue.

---

## Typography (verified)

- Display font: **Cinzel** (the live site uses Cinzel SemiBold for headings). Loaded via Google Fonts import at the top of `index.css` (`Cinzel:wght@400;600`).
- Body font: **Crimson Pro** (Regular for body, with italic + 600 available).
- Heading line-height ≈ **1.3–1.4**; body line-height ≈ **1.6–1.75**. Headings use `letter-spacing: normal` on the hero H1; section labels (h5/h6, uppercase tags) use wide letter-spacing.

Scale (desktop / tablet ≤900 / phone ≤600), all px:

| Element | Desktop | Tablet | Phone |
|---|---|---|---|
| body | 17 | 16 | 16 |
| h1 | 36 | 32 | 20* |
| h2 | 30 | 24 | 18 |
| h3 | 20 | 18 | 16 |
| h4 | 16 | 15 | 15 |
| h5 (uppercase, 600, ls .2em) | 12 | 11 | 10 |
| h6 (uppercase, 400, ls .25em) | 10 | 10 | 9 |
| .p1 | 26 | 20 | 16 |
| .p2 | 19 | 18 | 14 |
| .p3 | 17 | 16 | 12 |

\* The current rebuild sets phone H1 to 20px; the original hero H1 reads larger on phone. If matching the original feels too small, bump phone H1 toward 28px — verify against the live site at 375px width.

Breakpoints: **tablet `max-width: 900px`**, **phone `max-width: 600px`**. The hero additionally collapses at `1024px`.

---

## Component & section reference (real class names from `src/index.css`)

### Nav — `.nav`, `.nav__inner`, `.nav__logo`, `.nav__name`
Sticky, `--red` bg, height 80px, `z-index: 50`. Logo (65px) + "GLADYS BOS-WICAKSONO | MEETTHEOWL.COM" in Cinzel, `--gray`, uppercase, letter-spacing .05em. No nav links — logo links home. On phone the logo+name stack and center.

### Hero — `.hero`, `.hero__portrait`, `.hero__text`
`--gray` bg, `grid-template-columns: 1fr 1fr`, vertically centered. Left: posterized high-contrast B&W portrait with a dark gradient fade at the bottom, `max-height: 60vh`. Right (`.hero__text`): gap 24px, padding `64px 80px 64px 48px`. Collapses to one column at 1024px. Key phrases inline get **bold + underline + dark red** (e.g. "faster onboarding", "Individual Contributor", "call me Gladys"). CTA: `.btn-primary` reading **THE ARTIFACTS**.

### Buttons — `.btn-primary`, `.btn-secondary`
- `.btn-primary`: red text, transparent bg, **offset red box-shadow** `0 0 0 .5px #5B0606, 2px 2px 3px #5B0606`; on hover shifts up-left and shadow deepens. Cinzel, 14px, uppercase, ls .1em. This shadow look is the signature button style — don't replace it with a flat border.
- `.btn-secondary`: same construction in **gold** (used on dark sections / cards, e.g. LEARN MORE).

### Artifacts grid — `.artifacts-grid` + `ProjectCard`
2-col desktop, 1-col ≤900px, gap 2rem, on the red→navy gradient. Card anatomy top→bottom: image (full width, no radius) → gold-bordered category tag (gold uppercase Cinzel) → title (white uppercase Cinzel) → description (white Crimson Pro) → `LEARN MORE` (`.btn-secondary`). **4 cards in order:**

| Title | Category | Slug |
|---|---|---|
| GETTING TO KNOW OWLLOCATE | CUSTOMER EDUCATION | `/owllocate-get-started` |
| MEASURING TRAINING IMPACT | AI, DATA & MEASUREMENT | `/training-impact` |
| DATA & AI FOR NEEDS ANALYSIS | AI, DATA & MEASUREMENT | `/needs-analysis` |
| MAKING REMOTE ONBOARDING WORK | INTERNAL ENABLEMENT | `/virtual-onboarding` |

### Testimonials ("OTHERS' EYES") — `Testimonials` component
`--blue-card` (#1A1A2E) bg, centered white uppercase Cinzel heading. Carousel with circular ‹ › arrows on the sides and dot indicators centered below. **There are 5 testimonials (5 dots), not 3** — the active dot is a **gold elongated pill**, inactive are small gray dots. Card: spans most of the width, **left vertical gold border**, name+role in bold Cinzel (centered), tenure line below in smaller italic, a thin **gold horizontal divider**, then Crimson Pro body with **one sentence highlighted in gold**.

The five testimonials (verified order, name — role — tenure):
1. **Brenna O'Neil** — Instructional Design Manager at Mews — *2024 – present*
2. **Monika Anderova** — Former Head of Global Education at Mews — *2024 – present*
3. **Tianyi Tian** — Former Academy Program Manager at Mendix — *2022 – 2024*
4. **Audrey** — Former Senior Practical Facilitator at NHL Stenden Hospitality Group — *2018 – 2022*
5. **La Verne York** — Former Human Capital Manager at NHL Stenden Hospitality Group — *2018 – 2022*

### Footer — `Footer` component
`--dark` (#2A2A2A) charcoal bg. Short left-aligned gold line → italic Crimson Pro tagline *"Rooted in truth, driven by possibility, adaptable in motion."* → four work links in small uppercase Cinzel, underlined (GETTING TO KNOW OWLLOCATE · MEASURING TRAINING IMPACT · NEEDS ANALYSIS · MAKING REMOTE ONBOARDING WORK) → horizontal divider → bottom row "GLADYS BOS-WICAKSONO • MEETTHEOWL.COM • [LinkedIn] GET IN TOUCH" (GET IN TOUCH → LinkedIn). Large low-opacity **gold owl outline watermark** in the bottom-right corner.

### Project pages — shared classes
`.project-hero` (light gray, 2-col, max-width 1100px, centered, image left ~45%/text right, title spans full width in red Cinzel **mixed case**) · `.about-section` (light gray, red uppercase "ABOUT THIS WORK" heading, with `.disclaimer` callout: left red border + pale red bg + italic) · `.deep-section` with modifiers `.deep-section--navy` and `.deep-section--red` (alternating dark backgrounds, white uppercase headings) · `.tabs` / `.tab-btn` / `.tab-content` (Owllocate only) · `.accordion*` and `.zoomable-img` / `.zoom-overlay` (lightbox) · `.cta-section` (red gradient cross-link block).

Section padding rhythm: `60px 80px` desktop → `40px` tablet → `24px` phone (project-hero, about, deep, cta all follow this).

Tabs: inactive = transparent with gold side dividers, white text; **active = `rgba(91,6,6,.5)` bg + gold text**. `.tab-content` = `--blue-card` bg with a **left gold border** and gold uppercase h3 subheading.

---

## Page structures (verified on the live site)

Each project page shares the hero → (summary) → about → deep-dive → (cross-link) spine, but they differ. Deep-dive headings carry emoji icons. Code references render as `</> Label`; DAX/technical references as `🖧 Label`; image placeholders `📸 Illustration` / `📷`; animated demos `PLAY GIF`.

### `/` Homepage
Nav → Hero → **THE ARTIFACTS** (4 cards on red→navy gradient) → **OTHERS' EYES** (5-slide carousel) → Footer.

### `/owllocate-get-started` — "Getting Started with Owllocate"
Hero CTA **TRY ME**. Tools: Articulate Storyline, Parta, Google Apps Script, Adobe Illustrator, Adobe Photoshop. **No SUMMARY section.**
→ **ABOUT THIS WORK** (with disclaimer callout; key stats bolded: trained users ~27% fewer support cases; ~14% QoQ reduction)
→ **⚙️ LEARNING DESIGN & TECHNICAL IMPLEMENTATION** — 3 tabs (labels render lowercase): `immersive simulation` / `progressive complexity` / `adaptive feedback`. Tab 3 ends with a `Play gif`.
→ Cross-link **MAKING TRAINING COUNT** → button **MEASURING TRAINING IMPACT** (`/training-impact`).

> Correction vs older notes: the deep-dive heading is "LEARNING DESIGN & TECHNICAL IMPLEMENTATION", not "DESIGN PRINCIPLES". All three tab bodies are confirmed (see CLAUDE.md / live site for exact copy — Tab 2 is about sequenced, increasing-complexity activities; Tab 3 is about data-driven adaptive feedback and a "Watch, Guide, Test" option).

### `/training-impact` — "Measuring Training Impact"
Hero CTA **VIEW REPORT**. Tools: Power BI, SQL, Claude API.
→ **SUMMARY** (3 columns: **THE GAP / THE WORK / THE SHIFT**, thin gold vertical dividers)
→ **ABOUT THIS WORK**
→ Deep-dive sections: **🔧 WHAT I BUILT** (OVERVIEW PAGE) · **📐 THE FRAMEWORK** (multiple sub-sections: MAKING SENSE OF WHAT EXISTS, PERFORMANCE OF EXISTING USER SEGMENTS, SETTING A GENERAL BASELINE, BRINGING IT TO POWER BI, ONE MEASURE TWO MODES, IS TRAINING REALLY DRIVING IMPROVEMENT?, ASK THE OWL, BUILDING FOR MAINTAINABILITY, MEASUREMENT NEEDS DIRECTION). Heavy use of `</>` SQL labels, `🖧` DAX labels, `📷` validation, and `PLAY GIF`.
→ Cross-link → **DATA & AI FOR NEEDS ANALYSIS** (`/needs-analysis`).

### `/needs-analysis` — "Data and AI for Analysis & Evaluation"
(Live H1 reads "DATA AND AI FOR ANALYSIS & EVALUATION".) Hero has the "probabilistic assistant under audit" copy. **No SUMMARY section.** Hero CTA: none confirmed on the live site — verify before adding one.
→ **ABOUT THIS WORK**
→ **⚙️ THE METHODOLOGY** — 6 steps, each structured as **WHAT / WHY / HOW** with a **PROMPT EXAMPLE** code block (real SQL + AI prompt text):
  1. Ground the AI in Facts
  2. Test Capability at Small Scale
  3. Run Full Analysis with Guardrails
  4. Validate the Output
  5. Segment by Population
  6. Triangulate with Other Data Sources
→ No cross-link CTA at the end.

### `/virtual-onboarding` — "Making Remote Onboarding Work"
Hero: Tools line only (Final Cut Pro X, Adobe Photoshop, Articulate 360, H5P) — **no CTA button** in the hero.
→ **SUMMARY** (3 columns: **GOAL / SOLUTION / OUTCOME**)
→ **ABOUT THIS WORK**
→ **Project Goal** (4 bullet goals) → **Analysis and Scoping** → **Solution** (contains **3 GIFs**, each tagged "Reduced quality": (1) 360° tour with embedded scenario prompts, (2) system simulation, (3) micro-learning recap between units) → **Outcomes** (stats bolded: >75% completed; ~30 completions over 6 months; ~8 trainees / 5 weeks; department kept it post-COVID).
→ No cross-link CTA at the end.

> Correction vs older notes: the third GIF is the **micro-learning recap** structure (confirmed). Hero has no button on this page.

---

## Exact copy

Verbatim page copy (hero paragraphs, card descriptions, summary columns, footer, project bodies) is maintained in `E:\Portfolio\site\CLAUDE.md` and on the live site. Pull copy from there rather than rewriting it. If you need to write **new** prose or refine existing copy, invoke the **meettheowl-voice** skill — never hand-write portfolio prose without it.

---

## Build & verify workflow

1. Make the change in `src/index.css` / the relevant component.
2. Start the dev server (`npm run dev`) and open the preview (port 5173). Use the preview tools, not manual asking.
3. Verify against the live site at **three widths**: desktop (~1440), tablet (900), phone (375). Colors, fonts, spacing, and section order must match.
4. Check the console/network for errors.
5. For visual changes, capture a screenshot and compare side-by-side with the original before calling it done.

## Deployment (do NOT auto-deploy)

- Hosting: GitHub Pages, **manual deploy only** (Actions → "Deploy to GitHub Pages" → Run workflow). Pushing to `main` saves code but does not deploy.
- Repo: https://github.com/gladysboswicaksono/meettheowl · Domain: meettheowl.com (GoDaddy, A records → GitHub IPs). `www` is not configured.
- Never run a deploy or push without the user explicitly asking.

## Fidelity checklist (run before declaring a section "done")

- [ ] Colors are exact hex (`#5B0606` red, `#F6C785` gold, `#1A1A2E`/`#1C253C` navy, `#E8E6E6` gray, body text `#363838`).
- [ ] Headings = Cinzel; body = Crimson Pro; sizes in px per the scale; correct line-heights.
- [ ] Homepage H1 is literal caps; project titles are mixed case.
- [ ] Buttons use the offset box-shadow style (`.btn-primary` red / `.btn-secondary` gold), not flat borders.
- [ ] Artifact cards have no background; correct 4 cards in order with correct categories and slugs.
- [ ] Testimonials: 5 slides, gold pill active dot, gold left border, gold divider, one gold-highlighted sentence.
- [ ] Project pages match their specific spine (which have SUMMARY, which have tabs, which have cross-link CTAs — see above).
- [ ] Inline emphasis (bold + underline + dark red) on the right key phrases.
- [ ] Responsive at 900 and 600 (and hero at 1024). No horizontal scroll on phone.
- [ ] No new dependencies, no Tailwind, px not rem.
