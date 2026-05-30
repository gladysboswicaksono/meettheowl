# Portfolio Site — Claude Context

## ⚠️ READ FIRST — How to interact with Gladys
Before doing anything on this project, **always read the memory files** that record how to work with me. They take priority over everything else in this file.
- Memory index: `C:\Users\glady\.claude\projects\E--Portfolio-site\memory\MEMORY.md`
- Read every feedback/memory file it links to (e.g. `feedback_no-unrequested-edits.md`) at the start of each session, before touching any code.

Non-negotiable rules captured there:
- **Never edit any file without an explicit, direct instruction to make that change.** When I ask a question (e.g. "Can you see it in the preview?") or describe my own plan (e.g. "so I have to make the padding 400px"), that is context — NOT a command to edit. Answer the question and leave files untouched.
- Distinguish "I have to make X" (my plan) from "make X" (an instruction to you). When in doubt, ask before editing.
- Never override or undo a state I just said I'm happy with.

## ⚠️ Inspecting the original Wix portfolio — do this EXACTLY
The live Wix site (https://gladys1998crb.wixstudio.com/theowl) is the ONLY source of truth, and **the rendered page is the only reliable view of it.** Do NOT trust indirect tools — they have been confidently wrong every session.

**Never use for structure/counts:** WebFetch (its text flattens carousels into a single blob), the accessibility-tree `find` tool (gives contradictory answers), or DOM/JS slide counts (Wix lazy-loads slides, so the DOM undercounts). Wix also renders client-side, hashes asset names, and **paints fake carousel dots INTO the dashboard screenshots** — so dots inside an image are not the real controls.

**The exact procedure:**
1. Open the page in the real browser via **Claude-in-Chrome** (not WebFetch). Create a tab group, navigate, approve the screenshot permission for `wixstudio.com`.
2. **Scroll correctly:** `scroll` requires a coordinate — without one it fails *silently* and the page never moves. Prefer `scroll_to` with an element ref, or pass a coordinate. After every scroll, screenshot and **verify the view actually changed** before describing it. Never narrate scrolling you didn't confirm.
3. **Classify each section by looking**, not querying:
   - **Carousel** → authoritative count = the dot buttons; `find` them and read "Show slide N of N". Click each **dot by its ref** (not the arrows by coordinate — they shift after scrolling and you'll mis-click). Read each slide's own gold subtitle. NEVER count a dashboard's internal sidebar tabs (OVERVIEW/TIME ON CORE TASK/etc.) or dots drawn inside a screenshot as slides.
   - **Play-gif** → "PLAY GIF" overlay + play button; click play to confirm it animates (poster PNG + `.gif`).
   - **Static image** → otherwise.
4. **Filenames:** alt/title in markup give friendly names (e.g. `Same tenure.png`); CDN URLs are hashed (`b418e1_…~mv2.png`).
5. **Report confidence honestly:** if you haven't visually counted or clicked it, say so. Never pass a tool's partial number off as fact.

**Verified structure (Training Impact page, inspected slide-by-slide 2026-05-30):**
- **1 carousel** — "What I Built" Overview = **5 slides** (confirmed by clicking the next-arrow until it looped back to slide 1), gold subtitles in order: **OVERVIEW PAGE → PROGRAM REACH → EFFECTIVENESS AND ACCOUNT HEALTH → DEDICATED METRIC PAGES → ASK THE OWL – BOT INTERPRETER**.
- **Play-gif (the only one on the page, confirmed):** "One Measure, Two Modes" (clicked play, poster swapped to animated dashboard).
- **Static images (all confirmed by view):** hero (owl eye); Framework charts (`Product training catalogue.png`, `Completion distribution.png`, `Performance comparison.png`); `Same tenure.png`; DiD figure (`DiD.png`); Period-Over-Period figure (`Period-over-period.png`, a Month-over-Month comparison table); `Anomaly investigation.png` (Ask the Owl).

## Goal
This project is a React rebuild of Gladys Barragan-Torres's existing Wix portfolio (https://gladys1998crb.wixstudio.com/theowl). The aim is to recreate it as a custom-coded site with full design fidelity to the original.

## GitHub & Deployment
- Repo: https://github.com/gladysboswicaksono/meettheowl
- Domain: meettheowl.com (purchased on GoDaddy)
- Hosting: GitHub Pages
- Deploy: **manual only** — go to Actions → Deploy to GitHub Pages → Run workflow
- Pushing to `main` does NOT auto-deploy — it only saves code to GitHub
- Deploy workflow: `.github/workflows/deploy.yml` (trigger: `workflow_dispatch`)
- DNS: 4 A records on GoDaddy pointing to GitHub's IPs (185.199.108-111.153)
- `www` subdomain is NOT configured (GoDaddy has a locked conflicting record)

## Stack
- React + Vite, plain CSS, no Tailwind, no Astro
- Dev server: `npm run dev` from `E:\Portfolio\site` — runs on `http://localhost:5173`
- Launch config: `E:\Portfolio\Wix assets\.claude\launch.json`

## File Structure
- `src/App.jsx` — homepage (hero, artifacts section, testimonials)
- `src/index.css` — all global styles, design tokens, typography, layout classes
- `src/components/Nav.jsx` — sticky red nav, logo + name only, no links
- `src/components/Footer.jsx` — charcoal bg, gold tagline, work links, owl watermark
- `src/components/ProjectCard.jsx` — reusable card: image, category tag, title, description, Learn More
- `src/components/Testimonials.jsx` — carousel with dots, testimonials
- `src/pages/` — one component per project page:
  - `OwllocatePage.jsx` — Getting Started with Owllocate (the most built-out page: tabbed deep dive, zoomable images, gif toggle, mobile bottom tab nav)
  - plus the other project pages (Training Impact, Needs Analysis, Virtual Onboarding)
- `public/images/` — hero-portrait.png, logo-navigation.png, owl-outline.png, card-owllocate.png, card-needs-analysis.png, card-onboarding.png
- `public/images/owllocate/` — Owllocate deep-dive assets (illustration PNGs, feedback PNGs, gif, Play.png / Pause.png icons)

## Design Tokens (index.css)
```css
--red:   #5B0606;
--blue-card:  #1A1A2E;
--blue-bg: #1C253C;
--gold:  #F6C785;
--gray:  #E8E6E6;
--dark:  #2A2A2A;
--white: #FAFAF8;
--font-display: "Cinzel", Georgia, serif
--font-body:    "Crimson Pro", Georgia, serif
```

## Typography — all in px
- Body: 17px / 16px tablet / 16px phone
- H1: 36 / 32 / 28px
- H2: 30 / 24 / 22px
- H3: 20 / 18 / 17px
- H4: 16 / 15 / 15px
- H5: 12 / 11 / 10px — uppercase, 600 weight
- H6: 10 / 10 / 9px — uppercase, 400 weight
- `.p1` 26px, `.p2` 19px, `.p3` 17px — CSS classes applied to `<p>` elements

## Breakpoints
- Tablet: `max-width: 900px`
- Phone: `max-width: 600px`

## Key CSS Classes
- `.hero` / `.hero__portrait` / `.hero__text` — hero layout (index.css)
- `.artifacts-grid` — 2-col desktop, 1-col tablet/phone
- `.btn-primary` — red shadow/outline button (hero, project hero CTAs)
- `.btn-secondary` — gold shadow/outline button (cross-link CTAs)
- `.tabs` / `.tab-btn` / `.tab-content` — Owllocate deep-dive top tab strip + panel
- `.tab-jump` / `.tab-jump__btn` — Owllocate mobile-only bottom tab nav (≤600px)
- `.accordion-images` / `.accordion-images--grid3` — illustration image rows (grid3 = 3-col → 1-col mobile)
- `.zoomable-img` / `.zoom-overlay` — click-to-zoom image + full-screen overlay
- `.gif-figure` / `.gif-toggle` — gif play/pause control on Adaptive Feedback tab

## Reference
- Original Wix portfolio: https://gladys1998crb.wixstudio.com/theowl

## Rules
- Font sizes in px, NOT rem
- No Tailwind, no Astro, no unnecessary abstractions
- Inline styles are fine in JSX; use CSS classes when responsive control is needed
- p1/p2/p3 are CSS classes — use `<p className="p1">`, NOT `<p1>`
- Do not add card background colors — cards sit on the section gradient
- Artifacts section gradient: `linear-gradient(180deg, #6B0808 0%, #2D0202 100%)`
- Do not invent button class names — check index.css first

---

## Site Structure (from live Wix portfolio)

### Pages
- `/` — Homepage (Hero + Artifacts + Testimonials)
- `/owllocate-get-started` — Getting Started with Owllocate
- `/training-impact` — Measuring Training Impact
- `/needs-analysis` — Data and AI for Analysis & Evaluation
- `/virtual-onboarding` — Making Remote Onboarding Work

---

## Homepage Sections

### Nav
- Sticky, dark red (`#5B0606`) background, full width
- Left: owl logo icon + "Gladys Bos-Wicaksono | meettheowl.com" in Cinzel, white
- No navigation links at all — logo clicks back to home

### Hero Section
- Background: light warm gray (`--gray: #E8E6E6`)
- **Left column:** portrait — high-contrast black & white duotone/stencil (posterized) effect; dark gradient fade at the bottom of the image
- **Right column:** text content
  - H1: dark red, ALL CAPS, Cinzel — "I THRIVE ON CHALLENGES THAT START IN THE DARK, WHERE SOLUTIONS HIDE IN PATTERNS WAITING TO BE SEEN."
  - Body paragraphs in Crimson Pro, dark text
  - Inline emphasis on key phrases: bold + underline, dark red color (e.g., "faster onboarding", "higher adoption", "significant cost savings", "Individual Contributor", "call me Gladys")
  - CTA button: outlined/ghost style, dark red border + text, small uppercase Cinzel — "THE ARTIFACTS"

### Artifacts Section
- Background gradient: dark red → deep purple/navy as you scroll down
  - Top: `#6B0808`, Bottom: `#2D0202` bleeding into `#1A1A2E` (navy)
- Section title: "THE ARTIFACTS" — centered, gold/white, uppercase, Cinzel
- **2-column card grid** (1-col on tablet/phone)
- Cards have NO background — they sit on the gradient
- **Card anatomy (top to bottom):**
  1. Image (full card width, no border-radius visible)
  2. Category tag: thin gold border box, gold uppercase text (Cinzel, small)
  3. Card title: white, uppercase, bold Cinzel
  4. Description: white body text, Crimson Pro
  5. "LEARN MORE" button: outlined, white border + white text, small uppercase Cinzel

#### The 4 Cards (in order)
| Title | Category | Page slug |
|---|---|---|
| GETTING TO KNOW OWLLOCATE | CUSTOMER EDUCATION | `/owllocate-get-started` |
| MEASURING TRAINING IMPACT | AI, DATA & MEASUREMENT | `/training-impact` |
| DATA & AI FOR NEEDS ANALYSIS | AI, DATA & MEASUREMENT | `/needs-analysis` |
| MAKING REMOTE ONBOARDING WORK | INTERNAL ENABLEMENT | `/virtual-onboarding` |

### Testimonials ("Others' Eyes")
- Background: dark navy (`--blue-card: #1A1A2E`)
- Section title: "OTHERS' EYES" — centered, white, uppercase, Cinzel
- **Carousel:** left/right circle-arrow buttons on the sides; 3 dot indicators at bottom
  - Active dot: gold pill/elongated shape
  - Inactive dots: small gray circles
- **Testimonial card:** spans most of the section width, light/semi-transparent background, left vertical gold border line
  - Name + role in bold Cinzel: e.g. "Brenna O'Neil, Instructional Design Manager at Mews"
  - Tenure line in smaller italic: "My tenure: 2024 - present"
  - Horizontal gold divider line
  - Body text in Crimson Pro; some inline text highlighted in gold/dark red
- There are **3 testimonials** total (3 dots)

### Footer
- Background: dark charcoal (`--dark: #2A2A2A`)
- Short gold horizontal line (left-aligned, above tagline)
- Tagline in italic Crimson Pro: *"Rooted in truth, driven by possibility, adaptable in motion."*
- Work links in small uppercase Cinzel: all 4 project page titles, space-separated
- Horizontal divider line
- Bottom row: "GLADYS BOS-WICAKSONO • MEETTHEOWL.COM • [LinkedIn icon] GET IN TOUCH" (GET IN TOUCH links to LinkedIn)
- Large gold owl outline watermark in bottom-right corner (decorative, low opacity)

---

## Project Page Structure (all 4 pages share this layout)

### 1. Project Hero (light gray bg `#E8E6E6`)
- Page title: H2, dark red, Cinzel, **mixed case** (e.g. "Getting Started with Owllocate") — NOT all caps like homepage H1
- 2-column layout: image left (~45% width), text right
- Right column: 1–2 description paragraphs + bold "Tools: [list]" line
- CTA button: outlined, dark red border + text (label varies: "TRY ME", "VIEW REPORT", etc.)

### 2. Summary Section (dark navy bg `#1A1A2E`)
- "SUMMARY" centered heading: gold, uppercase, Cinzel
- 3-column layout with thin vertical dividers between columns
- Each column: left thin gold vertical border line | small-caps bold heading (Cinzel) | body text (Crimson Pro)
- Columns vary by page:
  - Owllocate: (no summary section — goes straight to content)
  - Training Impact: THE GAP / THE WORK / THE SHIFT
  - Virtual Onboarding: GOAL / SOLUTION / OUTCOME

### 3. "About This Work" Section (light gray bg)
- Heading: "ABOUT THIS WORK" — dark red, uppercase, Cinzel
- Long-form body text in Crimson Pro
- Callout/disclaimer box: left dark red border, pale pinkish-red background, Crimson Pro italic text

### 4. Deep-Dive Content Sections (alternate dark navy / dark red bg)
- Section headings include emoji icons (⚙️ 🔧 📐) + title
- **Tab navigation** (Owllocate page only): 3 tabs — "IMMERSIVE SIMULATION" / "PROGRESSIVE COMPLEXITY" / "ADAPTIVE FEEDBACK"
  - Active tab: dark red background (`rgba(91,6,6,0.5)`), gold text; inactive: transparent white text, separated by thin gold vertical dividers
  - Active tab is synced to the URL hash (e.g. `#adaptive`); the hash sets the initial tab on load
  - Tab content panel: left gold vertical border, gold subheading, white body text
  - **Mobile-only bottom tab nav** (`.tab-jump`, shown `max-width: 600px` only): a labeled "Other Design Principles" stacked list of all 3 tabs (each a full-width gold-outlined button with a `→`, active one marked with a `●`). Lets users switch tabs without scrolling back up; tapping one switches the tab and smooth-scrolls to the top of the deep-dive section. Hidden on desktop.
- **Illustration accordions** (`📸 Illustration`): collapsible, hold one or more images. Multi-image accordions use `.accordion-images` (flex-wrap); the 3-image grids use `.accordion-images--grid3` (3 cols desktop → 1 stacked column on mobile)
- **Zoomable images** (`ZoomableImage` component): every deep-dive image has a zoom icon and opens a full-screen overlay on click
- **Gif play/pause toggle** (`GifPlayImage` component, Adaptive Feedback tab): a "Play gif" button (with Play.png icon) above the poster image swaps the PNG for an animated gif and flips the label to "Pause gif" (Pause.png icon); also zoomable
- Code snippet references styled as `</> Label text`

### 5. Cross-link CTA Section (dark red bg)
- Short section with H3-level heading, body text, and an outlined button linking to the next related project page

---

## Inline Text Emphasis Patterns
Throughout all pages, certain phrases are styled with **bold + underline + dark red** color to draw the eye:
- In hero: "faster onboarding", "higher adoption", "significant cost savings", "Individual Contributor", "call me Gladys"
- In project pages: key stats/phrases like "~27% fewer support cases", "QoQ reduction of ~14%", "honest, data-backed answer"

---

## Exact Copy — Homepage

**H1:** I THRIVE ON CHALLENGES THAT START IN THE DARK, WHERE SOLUTIONS HIDE IN PATTERNS WAITING TO BE SEEN.

**Para 1:** Seven years and counting, I've turned complex learning challenges into measurable wins: **_faster onboarding_**, **_higher adoption_**, and **_significant cost savings_**.

**Para 2:** I've chosen depth in the craft over the ladder climb, growing as an **_Individual Contributor_** fluent in technical execution while building the business lens to create strategic value.

**Para 3:** Some people call me a self-starter, others call me a systems thinker. But you can just **_call me Gladys_**.

**CTA Button:** THE ARTIFACTS

---

## Exact Copy — Card Descriptions (homepage)

**Owllocate:** When work takes over, self-care and wellbeing slip through the cracks. This course explores how Owllocate bridges personal wellbeing and financial responsibility, transforming habit formation into a rewarding that pays (literally!)

**Training Impact:** "Is training driving results?" is the question every stakeholder asks and most learning teams struggle to answer confidently. This is the framework I built so that question always has a data-backed answer and a clear direction forward.

**Needs Analysis:** AI analyzes data fast and presents findings so credibly that we forget it pattern-matches toward plausibility, not truth. That's why I treat it as a probabilistic assistant under audit, not a magic eight ball.

**Onboarding:** A Purchasing department held a two-day, in-person orientation that was crucial for transferring essential knowledge to new trainees. However, COVID-19 social distancing restrictions made continuing this traditional format impossible.

---

## Footer Copy
**Tagline:** *Rooted in truth, driven by possibility, adaptable in motion.*
**Work links:** GETTING TO KNOW OWLLOCATE · MEASURING TRAINING IMPACT · NEEDS ANALYSIS · MAKING REMOTE ONBOARDING WORK
**Bottom:** GLADYS BOS-WICAKSONO • MEETTHEOWL.COM • [LinkedIn] GET IN TOUCH

---

## Exact Copy — Project Pages

### Getting Started with Owllocate (`/owllocate-get-started`)

**Page title (H2):** Getting Started with Owllocate
**CTA button:** TRY ME (links to course demo)
**Tools:** Articulate Storyline, Parta, Google Apps Script, Adobe Illustrator, Adobe Photoshop

**Hero description:**
When work takes over, self-care and wellbeing slip through the cracks. This course explores how Owllocate bridges personal wellbeing and financial responsibility through habit formation.

**Note (callout/disclaimer box):** This work cannot be shared directly due to employer ownership — the methodology was recreated using the personal Owllocate app.

**Key stats (inline emphasis):**
- Trained users submitted **~27% fewer support cases** than untrained users
- Ongoing refinements drove **~14% quarterly reductions** (QoQ)

**Deep-dive section heading:** ⚙️ Learning Design & Technical Implementation

**Tab 1 — IMMERSIVE SIMULATION:**
Simulations mirror the system's actual interface, built around a character navigating the same tasks real users face. Users stay in control — step-by-step guidance or independent practice, switchable anytime, with optional high-level hints. Two "Illustration" accordions (character-driven, user autonomy). Result: ~27% fewer support tickets on practiced topics.

**Tab 2 — PROGRESSIVE COMPLEXITY:**
Sequenced activities that gradually increase in complexity, building toward a final complete-workflow challenge. Where applicable, users repeat a task with different parameters for retrieval-based retention. Two accordions: a 3-image progression grid, and a single centered "Repetition" image (capped at 340px). Data point: users naturally transition from guided to independent practice.

**Tab 3 — ADAPTIVE FEEDBACK:**
Custom feedback for every click is impractical, so data guides where precision matters — targeted tracking on workflows where users get stuck, then feedback that speaks to the actual problem. Example: a "Watch, Guide, Test" support-level option. Contributes to a ~14.1% QoQ drop in support tickets among trained users. Includes a 3-image implementation accordion plus a side-by-side comparison: "General feedback" (static) vs "Targeted feedback" (gif play/pause toggle), both zoomable.

---

### Measuring Training Impact (`/training-impact`)

**Page title (H2):** Measuring Training Impact
**CTA button:** VIEW REPORT (links to Power BI dashboard)
**Tools:** Power BI, SQL, Claude API (Anthropic)

**Hero description:**
"Is training driving results?" is the question every stakeholder asks and most learning teams struggle to answer confidently. This is the framework I built so that question always has a data-backed answer and a clear direction forward.

**Summary section — 3 columns:**

| Column | Heading | Body |
|---|---|---|
| 1 | THE GAP | Training occurred but results remained unclear. The definition of "trained user" lacked connection to actual business outcomes. Tracked metrics (completion rates, CSAT) showed no reliable connection to what the business cared about. |
| 2 | THE WORK | Created a measurement framework with flexible definitions of trained users based on intended business outcomes, with Power BI reporting. Retrieves warehouse data and analyzes how users at different training stages performed. |
| 3 | THE SHIFT | Trained user rate entered departmental OKRs, making training a business-accountable metric for the first time. Functions now report using stakeholder language rather than internal metrics. |

**Key concept (pull quote):**
"If we could show trained users consistently outperform untrained ones on different metrics, measured through multiple methods, with different user populations and different time windows, at some point the pattern itself becomes the proof."

**Three measurement methods:**
1. Overview page with dynamic summaries
2. Same-tenure comparison analysis
3. Difference-in-differences (DiD) analysis with customizable windows (1–6 months, defaulting to 3)

**Trained user definition:** Someone who completed at least 50% of the Product Training catalog. The most significant performance jump happens at the Mid progress bucket (50–74%).

**Technical details:**
- Data source: data warehouse (not direct LMS) for modeling flexibility
- SQL components: user segmentation queries, performance comparison queries, trained flag (AI-generated), validation queries
- Power BI: flexible trained-user measure (two modes), time-aware DAX, period-over-period tracking (WoW, MoM, QoQ), metric-type switching
- "Ask the Owl" bot: Claude API integration for on-demand report interpretation for stakeholders

**Cross-link CTA targets:** DATA & AI FOR NEEDS ANALYSIS, OWLLOCATE: GET STARTED, MAKING REMOTE ONBOARDING WORK

---

### Data & AI for Needs Analysis (`/needs-analysis`)

**Page title (H2):** Data and AI for Analysis & Evaluation
**CTA button:** (to be confirmed — likely "VIEW REPORT" or similar)
**Tools:** (to be confirmed from live site)

**Hero description:**
AI analyzes data fast and presents findings so credibly that we forget it pattern-matches toward plausibility, not truth. That's why I treat it as a probabilistic assistant under audit, not a magic eight ball.

**Core message:** Demonstrates a methodology for using AI to analyze large qualitative datasets (support tickets) while maintaining accuracy and preventing fabrication.

**Six-step methodology (deep-dive section):**
1. **Ground the AI in Facts** — Verify AI can access/read data before analysis; request record count as initial validation
2. **Test Capability at Small Scale** — Have AI analyze five records with reasoning; verify analytical approach before scaling
3. **Run Full Analysis with Guardrails** — Analyze complete dataset with processing limit instructions; require batching/sampling transparency
4. **Validate the Output** — Manually verify ticket IDs and quotes against source system; confirm quotes exist exactly as cited
5. **Segment by Population** — Analyze different user groups (trained vs. untrained, regions, tenure); reveal whether solutions work across all populations
6. **Triangulate with Other Data Sources** — Cross-reference findings with simulations, documentation, recordings; build confidence through multiple data validation

**Context:** Analysis focuses on identifying knowledge gaps causing user dependency on support resources, using thousands of support ticket records.

---

### Making Remote Onboarding Work (`/virtual-onboarding`)

**Page title (H2):** Making Remote Onboarding Work
**CTA button:** (to be confirmed — likely "VIEW PROJECT" or similar)
**Tools:** Final Cut Pro X, Adobe Photoshop, Articulate 360, H5P

**Hero description:**
A Purchasing department held a two-day, in-person orientation that was crucial for transferring essential knowledge to new trainees. However, COVID-19 social distancing restrictions made continuing this traditional format impossible.

**Summary section — 3 columns:**

| Column | Heading | Body |
|---|---|---|
| 1 | GOAL | Redesign training orientation and onboarding for COVID restrictions while keeping trainees job-ready and confident. |
| 2 | SOLUTION | Virtual kickoffs via Teams, complemented by self-paced learning path featuring interactive videos, 360° facility tour, micro-learning, and system simulations. |
| 3 | OUTCOME | Increased engagement with daily responsibilities while achieving the same, if not higher, competency levels compared to those from traditional onboarding setup. |

**About This Work:**
Role: instructional design, video production, and eLearning development. Audience: Purchasing trainees in Real-World Learning program (hospitality industry).

**Project Goals (4 numbered):**
1. Understanding organizational fit and importance
2. Build core competence for task performance
3. Provide interactive question channels beyond one-way delivery
4. Maintain performance metrics and trainee confidence

**Analysis & Scoping:**
Gathered feedback from past sessions, identified critical activities (inventory management, supplier tracking, goods receipt, departmental distribution), consulted two Subject Matter Experts on FAQs and mixed experience levels.

**Solution details:**
Blended approach: Teams virtual introductions + self-paced learning including interactive video, 360° virtual tour with embedded scenario prompts, micro-learning modules, and system simulations for inventory workflows (requisitions, order placement, stock counts).

**GIF demonstrations (3 total):**
1. 360° tour with embedded scenario prompts for knowledge testing
2. Abbreviated recaps between units for reinforcement and preview
3. (Third GIF — to be confirmed from live site)

**Key stats (inline emphasis):**
- **Over 75%** completed the full learning path
- **~30 completions** over a six-month period
- Approximately **8 trainees every 5 weeks**
- Department retained program post-COVID
