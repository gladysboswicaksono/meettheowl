# Portfolio Site — Claude Context

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
- Dev server: `npm run dev -- --port 4322` from `E:\Portfolio\site`
- Launch config: `E:\Portfolio\Wix assets\.claude\launch.json`

## File Structure
- `src/App.jsx` — homepage (hero, artifacts section, testimonials)
- `src/index.css` — all global styles, design tokens, typography, layout classes
- `src/components/Nav.jsx` — sticky red nav, logo + name only, no links
- `src/components/Footer.jsx` — charcoal bg, gold tagline, work links, owl watermark
- `src/components/ProjectCard.jsx` — reusable card: image, category tag, title, description, Learn More
- `src/components/Testimonials.jsx` — carousel with dots, 5 testimonials
- `public/images/` — hero-portrait.png, logo-navigation.png, owl-outline.png, card-owllocate.png, card-needs-analysis.png, card-onboarding.png

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
- `.btn-intro` — red shadow button used in hero

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
- Section headings include emoji icons (⚙️ 🔧 📐) + uppercase title
- **Tab navigation** (Owllocate page only): 3 tabs — "IMMERSIVE SIMULATION" / "PROGRESSIVE COMPLEXITY" / "ADAPTIVE FEEDBACK"
  - Active tab: dark red background, white text
  - Inactive tabs: transparent, white text, separated by thin vertical dividers
  - Tab content panel: left gold vertical border, gold subheading, white body text
- Code snippet references styled as `</> Label text`
- Photo placeholders labeled `📸 Illustration`
- GIF placeholders labeled `PLAY GIF`

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
