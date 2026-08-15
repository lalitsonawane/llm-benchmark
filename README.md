# OpenRouter LLM Benchmarks Suite ⚡

A modern, full-stack **Web Application** and **Expo Mobile App** for tracking, comparing, and analyzing Large Language Model benchmarks based on the [OpenRouter Benchmarks API Reference](https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks).

---

## 🌟 Key Features

### 1. Unified Multi-Source Benchmark Leaderboards
- **Multi-Source Filtering**: Artificial Analysis, Design Arena, OpenRouter Evals (tau-bench, GPQA, SWE-bench), LMSYS Chatbot Arena, and Stanford HELM.
- **Task Domains**: General Intelligence, Coding & Software Eng, Deep Reasoning, Competition Math, Agentic Tool Use, and Multimodal Vision.
- **Metrics Tracked**:
  - Arena / LMSYS ELO
  - Quality Index (0 - 100)
  - Throughput Speed (tokens/sec)
  - Time to First Token (TTFT ms)
  - Blended Pricing ($ / 1M input/output tokens)
  - SWE-bench Verified (%), GPQA Diamond (%), AIME 2024 (%), MMLU-Pro (%)
- **Data Export**: One-click download of full filtered datasets as CSV.

### 2. Side-by-Side Model Comparator & Radar Visualizer
- Compare up to 4 models simultaneously (Claude 3.7 Sonnet Thinking, GPT-4.5, DeepSeek R1, Gemini 2.0 Flash, etc.).
- Multi-dimensional HTML5 Canvas Radar Chart across 6 capability dimensions.
- Visual differential matrix with automatic winner highlights.

### 3. Pareto Frontier & Efficiency Analytics
- Interactive 2D Scatter Plots for **Cost vs Quality**, **Speed vs Quality**, and **Latency vs Quality**.
- Real-time Pareto Frontier curve identification to pinpoint optimal value models.

### 4. Workload Cost & ROI Estimator
- Configure monthly API requests, average prompt/completion tokens, and latency SLAs.
- Computes estimated monthly token bills and displays savings vs flagship models.

### 5. Live OpenRouter Benchmarks API Playground
- Direct interactive tester for `GET https://openrouter.ai/api/v1/benchmarks` with customizable params (`source`, `task_type`, `arena`).
- Live JSON response inspector and ready-to-use code generators in **cURL**, **Python**, and **JavaScript / TypeScript**.

### 6. Universal Mobile Experience
- **Dedicated Expo Mobile App** (`/mobile`) with bottom navigation tabs, touch cards, and native performance.
- **In-Browser iPhone 16 Pro Simulator** for instant desktop preview of the mobile application.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/llm-benchmark.git
cd llm-benchmark

# Install web dependencies
npm --prefix web install

# Install mobile dependencies
npm --prefix mobile install
```

---

## 💻 Running Locally

### 1. Web Application (Vite Dev Server)
```bash
npm run dev
# Or from web directory:
cd web && npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

To build and preview production bundle:
```bash
npm run build
npm run preview
```

### 2. Expo Mobile App
```bash
npm run mobile
# Or from mobile directory:
cd mobile && npm run start
```

#### Launch Options:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in Web Browser
- Scan the QR code with the **Expo Go** app on your physical iOS or Android device.

---

## 🚢 Deployment

For complete, step-by-step production guides, see the [**Deployment Guide (DEPLOYMENT.md)**](./DEPLOYMENT.md).

### 🌐 Web Deployment

#### 1. Vercel (Recommended)
This repository includes a root [`vercel.json`](./vercel.json) preconfigured for zero-config deployment.
```bash
# Deploy with Vercel CLI
npm i -g vercel
vercel --prod
```
Or import the repository directly into [Vercel Dashboard](https://vercel.com/new).

#### 2. Docker & Docker Compose
A multi-stage production [`Dockerfile`](./Dockerfile) and [`docker-compose.yml`](./docker-compose.yml) are ready to use:
```bash
# Start production container on port 8080
docker compose up -d --build
```
Access the application at `http://localhost:8080`.

#### 3. Netlify & Cloudflare Pages
- **Base / Root directory**: `web`
- **Build command**: `npm run build`
- **Publish / Output directory**: `web/dist`

---

### 📱 Mobile Deployment (Expo EAS)

The project includes preconfigured build profiles in [`mobile/eas.json`](./mobile/eas.json).

```bash
# 1. Install EAS CLI and log in
npm install -g eas-cli
eas login

# 2. Build Android APK (Preview / Testing)
cd mobile
eas build --platform android --profile preview

# 3. Build for Production (Play Store .aab / App Store .ipa)
eas build --platform android --profile production
eas build --platform ios --profile production

# 4. Export standalone static web bundle
npx expo export --platform web
```

---

## 🔑 OpenRouter API Key Integration

The application is 100% functional out of the box with high-fidelity preloaded snapshot data. To connect directly to your live OpenRouter account:
1. Click **"Connect API Key"** in the top navigation bar.
2. Enter your OpenRouter API key (`sk-or-v1-...`).
3. All benchmark requests will fetch live metrics directly from `https://openrouter.ai/api/v1/benchmarks`.

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.

