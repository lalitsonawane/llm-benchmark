import { BenchmarkModel } from './types';

export const BENCHMARK_MODELS: BenchmarkModel[] = [
  {
    id: 'anthropic/claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet (Thinking)',
    provider: 'Anthropic',
    context_length: 200000,
    pricing: { prompt: 3.00, completion: 15.00 },
    metrics: {
      elo: 1378,
      qualityIndex: 94.5,
      tokensPerSec: 68.4,
      ttftMs: 580,
      mmluPro: 89.2,
      sweBench: 70.3,
      gpqa: 68.7,
      tauBench: 69.4,
      humaneval: 95.8,
      aime2024: 84.6,
      math500: 96.2,
      designArenaElo: 1395
    },
    description: 'Hybrid reasoning model with dynamically controllable thinking token budget and industry-leading software engineering prowess.',
    architecture: 'Dense Transformer w/ Extended Reasoning',
    modalities: ['Text', 'Vision', 'Code'],
    openRouterUrl: 'https://openrouter.ai/anthropic/claude-3.7-sonnet',
    releaseDate: '2025-02-24',
    isReasoningModel: true,
    isOpenWeights: false,
    benchmarks: [
      { source: 'artificial-analysis', task: 'overall', metric_name: 'Quality Index', value: 94.5, percentile: 99 },
      { source: 'artificial-analysis', task: 'coding', metric_name: 'Coding Index', value: 97.8, percentile: 100 },
      { source: 'artificial-analysis', task: 'reasoning', metric_name: 'Reasoning Index', value: 96.1, percentile: 99 },
      { source: 'openrouter-evals', task: 'agentic', metric_name: 'tau-bench Telecom', value: 69.4, percentile: 98 },
      { source: 'openrouter-evals', task: 'reasoning', metric_name: 'GPQA Diamond', value: 68.7, percentile: 97 },
      { source: 'swe-bench', task: 'coding', metric_name: 'SWE-bench Verified', value: 70.3, percentile: 99 },
      { source: 'design-arena', task: 'vision', metric_name: 'Design ELO', value: 1395, percentile: 99 }
    ]
  },
  {
    id: 'openai/gpt-4.5-preview',
    name: 'GPT-4.5 Preview',
    provider: 'OpenAI',
    context_length: 128000,
    pricing: { prompt: 75.00, completion: 150.00 },
    metrics: {
      elo: 1385,
      qualityIndex: 95.2,
      tokensPerSec: 42.1,
      ttftMs: 920,
      mmluPro: 90.4,
      sweBench: 64.2,
      gpqa: 71.8,
      tauBench: 66.8,
      humaneval: 94.2,
      aime2024: 79.4,
      math500: 93.8,
      designArenaElo: 1410
    },
    description: 'OpenAI largest general-knowledge model with massive world understanding, intuition, and high EQ communication.',
    architecture: 'Massive Scale Transformer',
    modalities: ['Text', 'Vision', 'Audio'],
    openRouterUrl: 'https://openrouter.ai/openai/gpt-4.5-preview',
    releaseDate: '2025-02-27',
    isReasoningModel: false,
    isOpenWeights: false,
    benchmarks: [
      { source: 'artificial-analysis', task: 'overall', metric_name: 'Quality Index', value: 95.2, percentile: 100 },
      { source: 'artificial-analysis', task: 'reasoning', metric_name: 'World Knowledge', value: 98.4, percentile: 100 },
      { source: 'design-arena', task: 'overall', metric_name: 'Design Arena ELO', value: 1410, percentile: 100 },
      { source: 'openrouter-evals', task: 'reasoning', metric_name: 'GPQA Diamond', value: 71.8, percentile: 99 }
    ]
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    context_length: 164000,
    pricing: { prompt: 0.55, completion: 2.19 },
    metrics: {
      elo: 1362,
      qualityIndex: 93.8,
      tokensPerSec: 38.5,
      ttftMs: 1400,
      mmluPro: 88.6,
      sweBench: 65.8,
      gpqa: 71.5,
      tauBench: 62.1,
      humaneval: 93.4,
      aime2024: 83.3,
      math500: 97.3,
      designArenaElo: 1320
    },
    description: 'Open-weights reasoning powerhouse trained with large-scale RL, excelling at competitive math, logic, and algorithmic coding.',
    architecture: 'DeepSeek-V3 MoE (671B params, 37B active)',
    modalities: ['Text', 'Code'],
    openRouterUrl: 'https://openrouter.ai/deepseek/deepseek-r1',
    releaseDate: '2025-01-20',
    isReasoningModel: true,
    isOpenWeights: true,
    benchmarks: [
      { source: 'artificial-analysis', task: 'reasoning', metric_name: 'Reasoning Index', value: 95.8, percentile: 98 },
      { source: 'artificial-analysis', task: 'math', metric_name: 'Math 500', value: 97.3, percentile: 100 },
      { source: 'openrouter-evals', task: 'math', metric_name: 'AIME 2024', value: 83.3, percentile: 99 },
      { source: 'swe-bench', task: 'coding', metric_name: 'SWE-bench Verified', value: 65.8, percentile: 94 }
    ]
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    context_length: 1048576,
    pricing: { prompt: 0.10, completion: 0.40 },
    metrics: {
      elo: 1335,
      qualityIndex: 88.7,
      tokensPerSec: 132.5,
      ttftMs: 310,
      mmluPro: 82.4,
      sweBench: 56.4,
      gpqa: 58.2,
      tauBench: 60.5,
      humaneval: 88.9,
      aime2024: 64.0,
      math500: 89.6,
      designArenaElo: 1340
    },
    description: 'Next-gen lightning-fast multimodal model featuring 1M token context, native tool use, and supreme cost efficiency.',
    architecture: 'Sparse Multimodal Transformer',
    modalities: ['Text', 'Vision', 'Audio', 'Video'],
    openRouterUrl: 'https://openrouter.ai/google/gemini-2.0-flash-001',
    releaseDate: '2025-02-05',
    isReasoningModel: false,
    isOpenWeights: false,
    benchmarks: [
      { source: 'artificial-analysis', task: 'overall', metric_name: 'Speed (tps)', value: 132.5, percentile: 99 },
      { source: 'artificial-analysis', task: 'overall', metric_name: 'Cost Efficiency', value: 98.2, percentile: 100 },
      { source: 'design-arena', task: 'vision', metric_name: 'Vision ELO', value: 1340, percentile: 92 }
    ]
  },
  {
    id: 'openai/o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'OpenAI',
    context_length: 200000,
    pricing: { prompt: 1.10, completion: 4.40 },
    metrics: {
      elo: 1358,
      qualityIndex: 93.1,
      tokensPerSec: 72.8,
      ttftMs: 820,
      mmluPro: 87.9,
      sweBench: 66.2,
      gpqa: 72.4,
      tauBench: 64.3,
      humaneval: 94.7,
      aime2024: 87.3,
      math500: 97.9,
      designArenaElo: 1315
    },
    description: 'STEM-optimized fast reasoning model offering medium/high reasoning effort control with top competitive programming scores.',
    architecture: 'Reasoning Optimized Transformer',
    modalities: ['Text', 'Code'],
    openRouterUrl: 'https://openrouter.ai/openai/o3-mini',
    releaseDate: '2025-01-31',
    isReasoningModel: true,
    isOpenWeights: false,
    benchmarks: [
      { source: 'artificial-analysis', task: 'math', metric_name: 'AIME 2024', value: 87.3, percentile: 100 },
      { source: 'artificial-analysis', task: 'coding', metric_name: 'Codeforces Rating', value: 2175, percentile: 99 },
      { source: 'openrouter-evals', task: 'reasoning', metric_name: 'GPQA Diamond', value: 72.4, percentile: 100 }
    ]
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    context_length: 128000,
    pricing: { prompt: 0.40, completion: 0.80 },
    metrics: {
      elo: 1310,
      qualityIndex: 86.4,
      tokensPerSec: 85.0,
      ttftMs: 440,
      mmluPro: 79.8,
      sweBench: 48.2,
      gpqa: 52.6,
      tauBench: 54.2,
      humaneval: 86.1,
      aime2024: 52.8,
      math500: 84.1,
      designArenaElo: 1285
    },
    description: 'Meta open weights industry standard matching previous 405B capabilities in a streamlined 70B footprint.',
    architecture: 'Dense Llama 3 Architecture',
    modalities: ['Text', 'Code'],
    openRouterUrl: 'https://openrouter.ai/meta-llama/llama-3.3-70b-instruct',
    releaseDate: '2024-12-06',
    isReasoningModel: false,
    isOpenWeights: true,
    benchmarks: [
      { source: 'lmsys-arena', task: 'overall', metric_name: 'Chatbot ELO', value: 1310, percentile: 88 },
      { source: 'artificial-analysis', task: 'overall', metric_name: 'Quality Index', value: 86.4, percentile: 86 }
    ]
  },
  {
    id: 'qwen/qwen-2.5-max',
    name: 'Qwen 2.5 Max',
    provider: 'Alibaba',
    context_length: 131072,
    pricing: { prompt: 1.60, completion: 6.40 },
    metrics: {
      elo: 1350,
      qualityIndex: 92.4,
      tokensPerSec: 54.2,
      ttftMs: 650,
      mmluPro: 86.5,
      sweBench: 58.4,
      gpqa: 64.9,
      tauBench: 61.8,
      humaneval: 91.2,
      aime2024: 76.5,
      math500: 94.6,
      designArenaElo: 1360
    },
    description: 'Alibaba flagship mixture-of-experts model delivering top-tier multilingual coding, math, and knowledge capabilities.',
    architecture: 'Large Scale MoE',
    modalities: ['Text', 'Code', 'Vision'],
    openRouterUrl: 'https://openrouter.ai/qwen/qwen-2.5-max',
    releaseDate: '2025-01-28',
    isReasoningModel: false,
    isOpenWeights: false,
    benchmarks: [
      { source: 'artificial-analysis', task: 'overall', metric_name: 'Quality Index', value: 92.4, percentile: 94 },
      { source: 'design-arena', task: 'overall', metric_name: 'Design ELO', value: 1360, percentile: 95 }
    ]
  },
  {
    id: 'mistralai/mistral-large-2411',
    name: 'Mistral Large 2411',
    provider: 'Mistral',
    context_length: 128000,
    pricing: { prompt: 2.00, completion: 6.00 },
    metrics: {
      elo: 1328,
      qualityIndex: 89.1,
      tokensPerSec: 62.0,
      ttftMs: 510,
      mmluPro: 83.1,
      sweBench: 52.8,
      gpqa: 59.4,
      tauBench: 58.6,
      humaneval: 87.4,
      aime2024: 61.2,
      math500: 88.0,
      designArenaElo: 1310
    },
    description: 'Mistral top frontier model engineered for enterprise agents, multilingual comprehension, and system administration tasks.',
    architecture: 'Dense Transformer (123B)',
    modalities: ['Text', 'Code'],
    openRouterUrl: 'https://openrouter.ai/mistralai/mistral-large-2411',
    releaseDate: '2024-11-18',
    isReasoningModel: false,
    isOpenWeights: false,
    benchmarks: [
      { source: 'artificial-analysis', task: 'agentic', metric_name: 'Function Calling', value: 91.2, percentile: 92 },
      { source: 'lmsys-arena', task: 'overall', metric_name: 'Chatbot ELO', value: 1328, percentile: 91 }
    ]
  },
  {
    id: 'x-ai/grok-2-1212',
    name: 'Grok 2 (1212)',
    provider: 'xAI',
    context_length: 131072,
    pricing: { prompt: 2.00, completion: 10.00 },
    metrics: {
      elo: 1338,
      qualityIndex: 90.2,
      tokensPerSec: 58.1,
      ttftMs: 600,
      mmluPro: 84.6,
      sweBench: 54.0,
      gpqa: 62.0,
      tauBench: 57.0,
      humaneval: 89.0,
      aime2024: 67.0,
      math500: 90.5,
      designArenaElo: 1335
    },
    description: 'xAI flagship model with real-time world context, sharp conversational wit, and strong visual reasoning.',
    architecture: 'Advanced MoE',
    modalities: ['Text', 'Vision'],
    openRouterUrl: 'https://openrouter.ai/x-ai/grok-2-1212',
    releaseDate: '2024-12-12',
    isReasoningModel: false,
    isOpenWeights: false,
    benchmarks: [
      { source: 'artificial-analysis', task: 'vision', metric_name: 'Vision Math', value: 86.4, percentile: 91 },
      { source: 'lmsys-arena', task: 'overall', metric_name: 'Chatbot ELO', value: 1338, percentile: 93 }
    ]
  },
  {
    id: 'google/gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro Experimental',
    provider: 'Google',
    context_length: 2097152,
    pricing: { prompt: 3.50, completion: 10.50 },
    metrics: {
      elo: 1370,
      qualityIndex: 93.9,
      tokensPerSec: 52.0,
      ttftMs: 740,
      mmluPro: 88.8,
      sweBench: 63.5,
      gpqa: 69.2,
      tauBench: 67.5,
      humaneval: 94.0,
      aime2024: 81.0,
      math500: 95.8,
      designArenaElo: 1380
    },
    description: 'Google frontier research model featuring 2 Million token context window and superior complex coding and agentic execution.',
    architecture: 'Ultra-Large Multimodal Transformer',
    modalities: ['Text', 'Vision', 'Audio', 'Video', 'Code'],
    openRouterUrl: 'https://openrouter.ai/google/gemini-2.0-pro-exp-02-05',
    releaseDate: '2025-02-05',
    isReasoningModel: false,
    isOpenWeights: false,
    benchmarks: [
      { source: 'openrouter-evals', task: 'agentic', metric_name: 'tau-bench Retail', value: 67.5, percentile: 97 },
      { source: 'artificial-analysis', task: 'coding', metric_name: 'Coding Evals', value: 94.0, percentile: 98 }
    ]
  }
];

export const BENCHMARK_SOURCES = [
  { id: 'all', name: 'All Sources', description: 'Aggregated normalized benchmark metrics across all evaluators' },
  { id: 'artificial-analysis', name: 'Artificial Analysis', description: 'Independent quality, latency, throughput and price benchmarking' },
  { id: 'design-arena', name: 'Design Arena', description: 'Blind A/B visual UI/UX & frontend design evaluation leaderboard' },
  { id: 'openrouter-evals', name: 'OpenRouter Evals', description: 'tau-bench agentic workflows, GPQA Diamond, and web search evaluations' },
  { id: 'lmsys-arena', name: 'LMSYS Chatbot Arena', description: 'Crowdsourced human preference ELO battles' },
  { id: 'swe-bench', name: 'SWE-bench Verified', description: 'Real-world GitHub issue resolution and software engineering test' },
  { id: 'helm', name: 'HELM (Stanford)', description: 'Holistic Evaluation of Language Models across transparency and bias' }
];

export const TASK_TYPES = [
  { id: 'all', name: 'All Tasks', icon: 'Sparkles', description: 'Holistic index across all benchmark categories' },
  { id: 'overall', name: 'General Intelligence', icon: 'Brain', description: 'MMLU-Pro, LMSYS Arena ELO, and core reasoning' },
  { id: 'coding', name: 'Coding & SWE', icon: 'Code', description: 'SWE-bench Verified, HumanEval, and Codeforces' },
  { id: 'reasoning', name: 'Deep Reasoning', icon: 'Cpu', description: 'GPQA Diamond, ARC Challenge, and logical deduction' },
  { id: 'math', name: 'Competition Math', icon: 'Calculator', description: 'AIME 2024, MATH 500, and Olympiad problem solving' },
  { id: 'agentic', name: 'Agentic & Tool Use', icon: 'Bot', description: 'tau-bench tool calling and multi-turn workflows' },
  { id: 'vision', name: 'Vision & Multimodal', icon: 'Eye', description: 'Design Arena UI evaluation, ChartQA, and DocVQA' }
];
