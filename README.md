# NutriSense

Minimal repo for local run and direct deploy to **Google Cloud Run**.

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GCP

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud run deploy nutrisense \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

If Cloud Run asks for a port, use **8080**.
