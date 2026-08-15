import { BENCHMARK_MODELS } from '../shared/benchmarksData';
import { BenchmarkModel, OpenRouterBenchmarkApiResponse } from '../shared/types';

const API_KEY_STORAGE_KEY = 'openrouter_api_key';

export const getStoredApiKey = (): string => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

export const setStoredApiKey = (key: string): void => {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
};

export interface FetchBenchmarkParams {
  source?: string;
  task_type?: string;
  arena?: string;
  apiKey?: string;
}

export async function fetchLiveBenchmarks(params: FetchBenchmarkParams = {}): Promise<{
  data: BenchmarkModel[];
  rawResponse?: OpenRouterBenchmarkApiResponse;
  isLive: boolean;
  error?: string;
}> {
  const apiKey = params.apiKey || getStoredApiKey();
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
    // Return preloaded high-fidelity dataset
    return {
      data: filterPreloadedModels(params.source, params.task_type),
      isLive: false
    };
  }

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'OpenRouter Benchmark Hub'
      }
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `API error (${res.status}): ${res.statusText}`);
    }

    const rawJson: OpenRouterBenchmarkApiResponse = await res.json();
    
    // Merge live data points with our rich model catalogue
    const mergedModels = mergeApiDataWithCatalogue(rawJson, params.source, params.task_type);

    return {
      data: mergedModels,
      rawResponse: rawJson,
      isLive: true
    };
  } catch (err: any) {
    console.warn('Falling back to local high-fidelity benchmark snapshot:', err);
    return {
      data: filterPreloadedModels(params.source, params.task_type),
      isLive: false,
      error: err.message || 'Failed to fetch live benchmarks. Showing preloaded dataset.'
    };
  }
}

function filterPreloadedModels(source?: string, task_type?: string): BenchmarkModel[] {
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

function mergeApiDataWithCatalogue(
  apiData: OpenRouterBenchmarkApiResponse,
  source?: string,
  task_type?: string
): BenchmarkModel[] {
  if (!apiData?.data || !Array.isArray(apiData.data)) {
    return filterPreloadedModels(source, task_type);
  }

  const modelMap = new Map<string, BenchmarkModel>();
  BENCHMARK_MODELS.forEach(m => modelMap.set(m.id, { ...m }));

  apiData.data.forEach(item => {
    const existing = modelMap.get(item.model);
    if (existing) {
      // update or add benchmark item
      const bIdx = existing.benchmarks.findIndex(b => b.source === item.source && b.metric_name === item.metric);
      if (bIdx >= 0) {
        existing.benchmarks[bIdx].value = item.score;
      } else {
        existing.benchmarks.push({
          source: item.source,
          task: item.task_type || 'overall',
          metric_name: item.metric,
          value: item.score
        });
      }
    }
  });

  return Array.from(modelMap.values());
}
