export type BenchmarkSource = 
  | 'all'
  | 'artificial-analysis'
  | 'design-arena'
  | 'openrouter-evals'
  | 'lmsys-arena'
  | 'swe-bench'
  | 'helm';

export type TaskType =
  | 'all'
  | 'overall'
  | 'coding'
  | 'reasoning'
  | 'agentic'
  | 'math'
  | 'vision'
  | 'instruction';

export interface ModelPricing {
  prompt: number;      // $ per 1M tokens
  completion: number;  // $ per 1M tokens
}

export interface BenchmarkMetrics {
  elo: number;             // LMSYS / Design Arena ELO rating (e.g. 1360)
  qualityIndex: number;    // Artificial Analysis quality index (0 - 100 scale)
  tokensPerSec: number;    // Throughput speed in tokens/sec
  ttftMs: number;          // Time to First Token in milliseconds
  mmluPro?: number;        // MMLU-Pro accuracy % (0 - 100)
  sweBench?: number;       // SWE-bench Verified % (0 - 100)
  gpqa?: number;           // GPQA Diamond % (0 - 100)
  tauBench?: number;       // tau-bench agentic success rate % (0 - 100)
  humaneval?: number;      // HumanEval coding pass@1 % (0 - 100)
  aime2024?: number;       // AIME 2024 math competition score % (0 - 100)
  math500?: number;        // MATH 500 benchmark % (0 - 100)
  designArenaElo?: number; // Design / UI Arena ELO
}

export interface BenchmarkModel {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  pricing: ModelPricing;
  metrics: BenchmarkMetrics;
  description: string;
  architecture: string;
  modalities: string[];
  openRouterUrl: string;
  releaseDate: string;
  isReasoningModel?: boolean;
  isOpenWeights?: boolean;
  supportedParameters?: string[];
  benchmarks: {
    source: string;
    task: string;
    metric_name: string;
    value: number;
    percentile?: number;
  }[];
}

export interface OpenRouterBenchmarkApiResponse {
  data: {
    source: string;
    task_type: string;
    model: string;
    score: number;
    metric: string;
    updated_at: string;
    provenance?: {
      source_url?: string;
      price_basis?: string;
    };
  }[];
  sources: string[];
  task_types: string[];
  updated_at: string;
}
