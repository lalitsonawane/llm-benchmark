import { BENCHMARK_MODELS } from '../shared/benchmarksData';
import { BenchmarkModel, OpenRouterBenchmarkApiResponse } from '../shared/types';

export interface FetchBenchmarkParams {
  source?: string;
  task_type?: string;
  arena?: string;
  apiKey?: string;
}

export async function fetchMobileBenchmarks(params: FetchBenchmarkParams = {}): Promise<{
  data: BenchmarkModel[];
  rawResponse?: OpenRouterBenchmarkApiResponse;
  isLive: boolean;
  error?: string;
}> {
  const apiKey = params.apiKey;
  const url = new URL('https://openrouter.ai/api/v1/benchmarks');
  
  if (params.source && params.source !== 'all') {
    url.searchParams.set('source', params.source);
  }
  if (params.task_type && params.task_type !== 'all') {
    url.searchParams.set('task_type', params.task_type);
  }
  if (params.arena) {
    url.searchParams.set('arena', params.arena);
  }

  if (!apiKey) {
    return {
      data: filterModels(params.source, params.task_type),
      isLive: false
    };
  }

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://openrouter.ai/mobile-app',
        'X-Title': 'OpenRouter Mobile Benchmark Hub'
      }
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `HTTP ${res.status}`);
    }

    const rawJson: OpenRouterBenchmarkApiResponse = await res.json();
    return {
      data: filterModels(params.source, params.task_type),
      rawResponse: rawJson,
      isLive: true
    };
  } catch (err: any) {
    return {
      data: filterModels(params.source, params.task_type),
      isLive: false,
      error: err.message
    };
  }
}

function filterModels(source?: string, task_type?: string): BenchmarkModel[] {
  let filtered = [...BENCHMARK_MODELS];

  if (source && source !== 'all') {
    filtered = filtered.filter(m => 
      m.benchmarks.some(b => b.source.toLowerCase() === source.toLowerCase())
    );
  }

  if (task_type && task_type !== 'all') {
    if (task_type === 'coding') {
      filtered.sort((a, b) => (b.metrics.sweBench || 0) - (a.metrics.sweBench || 0));
    } else if (task_type === 'math') {
      filtered.sort((a, b) => (b.metrics.aime2024 || 0) - (a.metrics.aime2024 || 0));
    } else if (task_type === 'reasoning') {
      filtered.sort((a, b) => (b.metrics.gpqa || 0) - (a.metrics.gpqa || 0));
    } else if (task_type === 'agentic') {
      filtered.sort((a, b) => (b.metrics.tauBench || 0) - (a.metrics.tauBench || 0));
    }
  }

  return filtered;
}
