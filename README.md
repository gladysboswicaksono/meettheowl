# meettheowl.com — Portfolio Site

React + Vite rebuild of Gladys Bos-Wicaksono's portfolio, deployed to GitHub Pages at [meettheowl.com](https://meettheowl.com).

## Stack
- React + Vite, plain CSS
- React Router for client-side routing
- GitHub Pages for hosting
- Google Cloud Functions + BigQuery for analytics

## Dev setup
```bash
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## CSS

Global foundations and design tokens live in `src/index.css`. Component,
project, and responsive styles are organized under `src/styles/`.

See [docs/css-architecture.md](docs/css-architecture.md) for stylesheet
ownership, import order, breakpoints, and responsive conventions.

## Deployment
Push to `main`, then manually trigger **Deploy to GitHub Pages** under Actions → Run workflow.

Pushing to `main` alone does NOT deploy — it only saves code to GitHub.

## Analytics
Visitor interactions are tracked via a custom setup:
- `src/utils/tracker.js` — runs in the visitor's browser, sends events to the Cloud Function
- `src/components/Analytics.jsx` — fires a `page_view` on every route change
- `cloud-function/` — Node.js Cloud Function on GCP that writes events to BigQuery

**To add tracking to a new element:**
```js
import { trackClick } from '../utils/tracker';
<button onClick={() => trackClick('Button label')}>...</button>
```

**To exclude your own visits:** visit the site with `?notrack=1` in the URL. Suppresses all tracking for that browser session.

**To redeploy the Cloud Function after changes:**
```bash
cd cloud-function
gcloud functions deploy trackEvent --runtime nodejs22 --trigger-http --allow-unauthenticated --region us-central1 --service-account meettheowl-tracker@meettheowl.iam.gserviceaccount.com
```

**To query the data:**
```sql
SELECT * FROM `meettheowl.portfolio_analytics.events` ORDER BY timestamp DESC LIMIT 10
```

## Pages
- `/` — Homepage (Hero, Artifacts, Testimonials, Expertise)
- `/owllocate-get-started` — Getting Started with Owllocate
- `/training-impact` — Measuring Training Impact
- `/needs-analysis` — Data and AI for Analysis & Evaluation
- `/virtual-onboarding` — Making Remote Onboarding Work
