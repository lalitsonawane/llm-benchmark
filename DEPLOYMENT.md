# Deployment Guide 🚀

Comprehensive guide for deploying the **OpenRouter LLM Benchmark Suite** across cloud platforms, container environments, and native mobile app stores.

---

## 📑 Table of Contents

1. [Architecture & Overview](#architecture--overview)
2. [Web Application Deployment](#web-application-deployment)
   - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
   - [Option B: Netlify](#option-b-netlify)
   - [Option C: Cloudflare Pages](#option-c-cloudflare-pages)
   - [Option D: Docker & Docker Compose](#option-d-docker--docker-compose)
   - [Option E: Self-Hosted Nginx / Caddy (VPS)](#option-e-self-hosted-nginx--caddy-vps)
   - [Option F: AWS S3 + CloudFront / GCS + CDN](#option-f-aws-s3--cloudfront--gcs--cdn)
3. [Mobile Application Deployment (Expo & React Native)](#mobile-application-deployment-expo--react-native)
   - [Prerequisites & EAS CLI Setup](#prerequisites--eas-cli-setup)
   - [EAS Build Profiles (`eas.json`)](#eas-build-profiles-easjson)
   - [Android Deployment (Google Play / APK)](#android-deployment-google-play--apk)
   - [iOS Deployment (Apple App Store / TestFlight)](#ios-deployment-apple-app-store--testflight)
   - [Expo Web Standalone Export](#expo-web-standalone-export)
   - [Over-the-Air (OTA) Updates with EAS Update](#over-the-air-ota-updates-with-eas-update)
4. [CI/CD Workflows (GitHub Actions)](#cicd-workflows-github-actions)
5. [Environment & API Key Security](#environment--api-key-security)
6. [Production Checklist & Troubleshooting](#production-checklist--troubleshooting)

---

## 🏗️ Architecture & Overview

This repository is structured as a monorepo containing:
- **`web/`**: Vite + React 18 + TypeScript + Tailwind CSS Single Page Application (SPA).
- **`mobile/`**: Expo SDK 52 + React Native + TypeScript native mobile application.
- **`shared/`**: Common TypeScript benchmark datasets and data models shared between web and mobile.

Both clients operate as client-side applications that fetch live data from the OpenRouter Benchmarks API (`https://openrouter.ai/api/v1/benchmarks`) when an API key is supplied, or fall back to high-fidelity embedded snapshot data.

---

## 🌐 Web Application Deployment

### Option A: Vercel (Recommended)

The project includes a root [`vercel.json`](./vercel.json) preconfigured for one-click monorepo builds and SPA routing.

#### Method 1: Vercel Git Integration (Automatic)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel automatically detects [`vercel.json`](./vercel.json):
   - **Framework Preset**: `Vite`
   - **Install Command**: `npm --prefix web install`
   - **Build Command**: `npm --prefix web run build`
   - **Output Directory**: `web/dist`
4. Click **Deploy**.

#### Method 2: Vercel CLI (Manual / Terminal)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy preview build
vercel

# Deploy to production
vercel --prod
```

---

### Option B: Netlify

#### Method 1: Netlify Web Dashboard
1. Connect your repository at [app.netlify.com](https://app.netlify.com).
2. Configure build settings:
   - **Base directory**: `web`
   - **Build command**: `npm run build`
   - **Publish directory**: `web/dist`
3. Add SPA Redirect Rule: Create `web/public/_redirects` with:
   ```text
   /*    /index.html   200
   ```
4. Click **Deploy Site**.

#### Method 2: Netlify CLI
```bash
npm install -g netlify-cli
cd web
netlify init
netlify deploy --prod --dir=dist
```

---

### Option C: Cloudflare Pages

1. In the Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository and set:
   - **Framework preset**: `Vite`
   - **Root directory**: `web`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Add single-page application fallback:
   - Cloudflare Pages automatically handles SPA routing with Vite fallback.
4. Click **Save and Deploy**.

---

### Option D: Docker & Docker Compose

A multi-stage [`Dockerfile`](./Dockerfile) and [`docker-compose.yml`](./docker-compose.yml) are included in the repository.

#### 1. Build and Run with Docker Compose
```bash
# Build and start container in detached mode
docker compose up -d --build

# View container logs
docker compose logs -f

# Stop container
docker compose down
```
Access the application at [http://localhost:8080](http://localhost:8080).

#### 2. Standalone Docker Build
```bash
# Build Docker image
docker build -t openrouter-llm-benchmark:latest .

# Run container on port 80
docker run -d -p 80:80 --name llm-benchmark openrouter-llm-benchmark:latest
```

#### 3. Deploy to Cloud Run / AWS ECS / DigitalOcean App Platform
Push the image to any container registry (Docker Hub, AWS ECR, GCP Artifact Registry):
```bash
docker tag openrouter-llm-benchmark:latest gcr.io/<PROJECT_ID>/openrouter-llm-benchmark:latest
docker push gcr.io/<PROJECT_ID>/openrouter-llm-benchmark:latest
```

---

### Option E: Self-Hosted Nginx / Caddy (VPS)

#### 1. Build Artifacts on Server or CI
```bash
cd web
npm install
npm run build
# Output will be located in web/dist
```

#### 2. Nginx Configuration
Copy compiled assets to `/var/www/llm-benchmark/` and use the provided [`nginx.conf`](./nginx.conf) pattern:

```nginx
server {
    listen 80;
    server_name benchmark.yourdomain.com;

    root /var/www/llm-benchmark;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Hashed Asset Caching
    location ~* \.(?:css|js|woff2?|svg|png|jpg|ico|webp)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. SSL via Let's Encrypt (Certbot)
```bash
sudo certbot --nginx -d benchmark.yourdomain.com
```

---

### Option F: AWS S3 + CloudFront / GCS + CDN

1. **Build**: Run `npm --prefix web run build`.
2. **Sync Assets to S3**:
   ```bash
   aws s3 sync web/dist/ s3://my-benchmark-bucket/ --delete
   ```
3. **CloudFront Distribution**:
   - Set S3 bucket as Origin.
   - Configure **Custom Error Responses**:
     - HTTP Error Code: `403` / `404`
     - Response Page Path: `/index.html`
     - HTTP Response Code: `200`
4. **Invalidate Cache**:
   ```bash
   aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
   ```

---

## 📱 Mobile Application Deployment (Expo & React Native)

The `/mobile` directory contains the complete Expo application configured with navigation, icons, and native chart capabilities.

### Prerequisites & EAS CLI Setup

1. Sign up for a free account at [expo.dev](https://expo.dev).
2. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
3. Log in to your Expo account:
   ```bash
   eas login
   ```
4. Configure the project:
   ```bash
   cd mobile
   eas project:init
   ```

---

### EAS Build Profiles (`eas.json`)

The included [`mobile/eas.json`](./mobile/eas.json) defines three profiles:
- **`development`**: For running local builds with debugging tools.
- **`preview`**: Standalone `.apk` (Android) or Simulator build (iOS) for internal team testing.
- **`production`**: Optimized release binaries (`.aab` for Play Store, `.ipa` for App Store).

---

### Android Deployment (Google Play / APK)

#### 1. Generate Standalone APK for Direct Device Testing / Sideloading
```bash
cd mobile
eas build --platform android --profile preview
```
Download the resulting `.apk` file directly to test on any Android phone.

#### 2. Generate Android App Bundle (`.aab`) for Google Play Store
```bash
cd mobile
eas build --platform android --profile production
```

#### 3. Submit to Google Play Store
```bash
eas submit --platform android
```
*(Requires a Google Play Console service account credentials `.json` file).*

---

### iOS Deployment (Apple App Store / TestFlight)

#### 1. Build for iOS Simulator (No Apple Developer account needed)
```bash
cd mobile
eas build --platform ios --profile preview
```

#### 2. Build for TestFlight & Apple App Store
```bash
cd mobile
eas build --platform ios --profile production
```
EAS handles certificates, provisioning profiles, and signing keys interactively.

#### 3. Submit to TestFlight / App Store
```bash
eas submit --platform ios
```

---

### Expo Web Standalone Export

To export the mobile application as a standalone static web bundle:
```bash
cd mobile
npx expo export --platform web
```
The resulting web bundle will be in `mobile/dist`, ready to deploy to any static host or web server.

---

### Over-the-Air (OTA) Updates with EAS Update

Ship bug fixes directly to users without waiting for App Store reviews:

1. Install EAS Update:
   ```bash
   cd mobile
   npx expo install expo-updates
   ```
2. Configure EAS Update:
   ```bash
   eas update:configure
   ```
3. Publish an instant OTA update:
   ```bash
   eas update --branch production --message "Fix benchmark comparison sorting"
   ```

---

## 🤖 CI/CD Workflows (GitHub Actions)

### 1. Web App Build & Validation Workflow (`.github/workflows/web-ci.yml`)

```yaml
name: Web CI & Build

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: 'web/package-lock.json'

      - name: Install dependencies
        run: npm --prefix web install

      - name: Typecheck and Build Web
        run: npm --prefix web run build

      - name: Archive production artifacts
        uses: actions/upload-artifact@v4
        with:
          name: web-dist
          path: web/dist
```

### 2. Mobile App EAS Preview Build Workflow (`.github/workflows/mobile-ci.yml`)

```yaml
name: Mobile EAS Preview Build

on:
  workflow_dispatch:
  push:
    paths:
      - 'mobile/**'
      - 'shared/**'

jobs:
  mobile-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup EAS CLI
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        working-directory: ./mobile
        run: npm install

      - name: Build Android Preview APK
        working-directory: ./mobile
        run: eas build --platform android --profile preview --non-interactive
```

---

## 🔒 Environment & API Key Security

- **Client-Side Storage**: The application stores the user's OpenRouter API key strictly in the browser's `localStorage` (Web) or encrypted storage (Mobile).
- **No Hardcoded Secrets**: Do not check API keys into source control.
- **CORS Support**: OpenRouter API (`https://openrouter.ai/api/v1/benchmarks`) supports browser-originated CORS requests when authenticated with a Bearer token.
- **Enterprise / Backend Proxy Setup (Optional)**: For enterprise deployments where an organization provides a centralized key without exposing it to clients, introduce a reverse proxy route (e.g., `/api/benchmarks`) that injects the `Authorization: Bearer <SERVER_KEY>` header.

---

## ✅ Production Checklist & Troubleshooting

| Check | Requirement | Verified |
| :--- | :--- | :---: |
| **Routing** | SPA fallback configured (`index.html` on 404) | [x] |
| **Security Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options` configured | [x] |
| **Compression** | Gzip or Brotli enabled on host/CDN | [x] |
| **Asset Caching** | Long-term immutable caching (`max-age=31536000`) for hashed assets | [x] |
| **Offline Resilience** | Fallback snapshot data renders even without internet/API key | [x] |
| **Mobile Bundles** | Bundle IDs (`ai.openrouter.benchmarks`) properly configured in `app.json` | [x] |

### Common Issues & Fixes

1. **Page reload returns 404 error on sub-routes**:
   - Ensure your web server or hosting platform has SPA rewrites configured (`vercel.json` rewrites, `_redirects` in Netlify, or `try_files $uri $uri/ /index.html;` in Nginx).
2. **CORS error when fetching live benchmarks**:
   - Verify that the OpenRouter API key entered in the header modal is valid and starts with `sk-or-v1-`.
3. **Expo build fails on dependencies**:
   - Run `npx expo install --fix` in `/mobile` to ensure all React Native package versions match Expo SDK 52.
