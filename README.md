# 🌯 healthyburritos

**A personal nutrition dashboard built with React — tracks meals, macros, hydration, supplements, and suggests daily burrito recipes.**

Live on Vercel → `https://healthyburritos.vercel.app`

---

## What it does

healthyburritos is a fully client-side nutrition platform. No backend, no database — everything lives in your browser's `localStorage`, keyed by date and user. It onboards you once, then adapts all calorie targets, meal plans, and swap suggestions to your real profile.

| Feature | Description |
|---|---|
| **Onboarding** | Name, age, weight, goal, allergies, medications — saved on first launch |
| **Dashboard** | Live calorie ring, diet quality score, macro bars, hydration tracker, weekly trend chart |
| **Food Log** | Add meals by slot (Breakfast / Lunch / Dinner / Snacks), persisted daily |
| **Meal Plan** | 7-day plan auto-selected from your goal (Weight Loss / Muscle Gain / Maintenance) |
| **Trends** | 7-day charts for calories, workout minutes, water intake — built from real logged data |
| **Goals & Profile** | Edit your profile inline, switch goals live, targets recompute automatically |
| **Smart Swaps** | Curated food swap library filtered by category and difficulty |
| **Supplements** | Add supplements, log daily doses, track streaks |
| **Burrito of the Day** | Daily rotating home-recipe suggestions — rajma, paneer, egg bhurji, and more |
| **Dark mode** | Full dark/light theme toggle |
| **Mobile** | Responsive layout with bottom nav on small screens |

---

## Tech stack

```
React 18          — UI framework
Vite 5            — Dev server and build tool
Recharts          — Charts (area, line, bar)
lucide-react      — Icons
localStorage      — All persistence, no backend
nginx             — Static file server (Docker / Cloud Run)
```

---

## Project structure

```
healthyburritos/
├── public/
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # All pages + routing + state
│   └── components/
│       └── OnboardingModal.jsx   # First-launch profile setup
├── index.html
├── vite.config.js
├── package.json
├── Dockerfile                    # Multi-stage: Node build → nginx serve
├── nginx.conf                    # SPA fallback, gzip, cache headers
└── .gitignore
```

---

## Local setup

**Requirements:** Node.js 18+

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/healthyburritos.git
cd healthyburritos

# 2. Install
npm install

# 3. Run
npm run dev
```

Opens at `http://localhost:3000`

On first launch, the onboarding modal appears. Fill in your profile — it saves to `localStorage` and never leaves your device.

---

## Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

---

## Docker (local container test)

```bash
docker build -t healthyburritos .
docker run -p 8080:8080 healthyburritos
# open http://localhost:8080
```

The Dockerfile uses a two-stage build:
1. `node:20-alpine` — installs deps and runs `vite build`
2. `nginx:1.27-alpine` — serves `/dist` with SPA fallback

---

## Vercel deployment

The fastest path. No config file needed — Vite is auto-detected.

```bash
# One-time: install Vercel CLI
npm install -g vercel

# Deploy (from project root)
vercel

# Production deploy
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard — every push to `main` deploys automatically.

**Build settings Vercel uses automatically:**

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

---

## Google Cloud Run deployment

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud run deploy healthyburritos \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080
```

Cloud Run builds the Docker image via Cloud Build, pushes to Artifact Registry, and serves it. Port 8080 is set in `nginx.conf` and matches Cloud Run's expected default.

---

## How data is stored

All data is stored in `localStorage` in the user's browser. Nothing is sent to any server.

| Key | Contents |
|---|---|
| `hb_user` | User profile (name, age, weight, goal, allergies, medications) |
| `hb_foodlog_YYYY-MM-DD` | Food log entries for that day, grouped by meal slot |
| `hb_water_hb_foodlog_YYYY-MM-DD` | Water cup count for that day |
| `hb_activity_YYYY-MM-DD` | Sleep, steps, workout for that day |
| `hb_supplements_{name}` | Supplement list for the user |
| `hb_supp_log_hb_foodlog_YYYY-MM-DD` | Which supplements were taken today |

To reset everything, click **Reset profile** in the sidebar footer.
---

## How calorie targets are computed

Targets are not hardcoded. They are computed on every render from the user's real profile using the Mifflin-St Jeor equation:

```
BMR  = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
TDEE = BMR × 1.55  (moderate activity)

Weight Loss  → TDEE − 400 kcal, protein = weight × 1.8g
Muscle Gain  → TDEE + 300 kcal, protein = weight × 2.2g
Maintenance  → TDEE,            protein = weight × 1.6g
```

Change your goal in the Goals page — targets update immediately across all pages.

---

## License

MIT — do whatever you want with it.

---

*Built with Claude · Deployed on Vercel · With love,🪔*
