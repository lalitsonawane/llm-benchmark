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
cd llm-benchmark

# Install web dependencies
cd web && npm install

# Install mobile dependencies
cd ../mobile && npm install
```

---

## 💻 Running the Web Application

To start the Vite development server:
```bash
npm run dev
# Or from web directory:
cd web && npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:
```bash
npm run build
```

---

## 📱 Running the Expo Mobile App

To launch the Expo development server:
```bash
npm run mobile
# Or from mobile directory:
cd mobile && npm run start
```

### Options:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in Web Browser
- Scan the QR code with the **Expo Go** app on your physical iOS or Android device.

---

## 🔑 OpenRouter API Key Integration

The application is 100% functional out of the box with high-fidelity preloaded snapshot data. To connect directly to your live OpenRouter account:
1. Click **"Connect API Key"** in the top navigation bar.
2. Enter your OpenRouter API key (`sk-or-v1-...`).
3. All benchmark requests will fetch live metrics directly from `https://openrouter.ai/api/v1/benchmarks`.
