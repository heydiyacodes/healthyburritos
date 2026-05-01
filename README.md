# healthyburritos v2 — Local Setup & GCP Deployment

## API Keys Required?
**None.** healthyburritos v2 is fully self-contained with mock data.
No external APIs, no authentication services, no keys needed.

---

## Run Locally (< 2 minutes)

### Prerequisites
- [Node.js 18+](https://nodejs.org/) — check with `node -v`

### Steps

```bash
# 1. Enter the project folder
cd healthyburritos

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Your browser opens automatically at **http://localhost:3000**

### Other commands
```bash
npm run build    # Production build → /dist folder
npm run preview  # Preview production build locally
```

---

## Deploy on GCP — Google Cloud Run

Cloud Run is the easiest GCP service for this: serverless containers,
auto-scales to zero, HTTPS out of the box, ~free tier for low traffic.

### Prerequisites
1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
2. A GCP project created (note your PROJECT_ID)
3. Billing enabled on the project

### One-time setup

```bash
# Authenticate
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

### Deploy (3 commands)

```bash
# 1. Build & push image to GCP Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/healthyburritos

# 2. Deploy to Cloud Run
gcloud run deploy healthyburritos \
  --image gcr.io/YOUR_PROJECT_ID/healthyburritos \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080

# 3. Get your live URL
gcloud run services describe healthyburritos --region asia-south1 --format 'value(status.url)'
```

Your app is live at the printed URL in ~60 seconds. ✅

### Recommended region for India
Use `--region asia-south1` (Mumbai) for lowest latency from Indore.

### Re-deploy after changes
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/healthyburritos && \
gcloud run deploy healthyburritos --image gcr.io/YOUR_PROJECT_ID/healthyburritos \
  --platform managed --region asia-south1
```

---

## GCP Cost Estimate (low traffic)
| Service         | Free tier              | Paid beyond that     |
|-----------------|------------------------|----------------------|
| Cloud Run       | 2M req/month free      | ~$0.40/million req   |
| Cloud Build     | 120 min/day free       | $0.003/min           |
| Artifact Reg.   | 0.5 GB free            | $0.10/GB/month       |

For a personal/small-team app you'll very likely stay in the free tier.

---

## Project Structure
```
healthyburritos/
├── src/
│   ├── main.jsx       # React entry point
│   └── App.jsx        # Full healthyburritos application
├── index.html         # HTML shell
├── vite.config.js     # Vite bundler config
├── package.json       # Dependencies & scripts
├── Dockerfile         # Multi-stage: node build → nginx serve
├── nginx.conf         # SPA routing + caching headers
└── .dockerignore
```
