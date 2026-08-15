import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Code2, 
  ExternalLink, 
  Sparkles, 
  Key, 
  Globe, 
  Layers, 
  Clock,
  ShieldAlert
} from 'lucide-react';
import { fetchLiveBenchmarks, getStoredApiKey } from '../services/openrouterApi';
import { BENCHMARK_SOURCES, TASK_TYPES } from '../shared/benchmarksData';

export const ApiPlaygroundView: React.FC = () => {
  const [sourceParam, setSourceParam] = useState<string>('artificial-analysis');
  const [taskTypeParam, setTaskTypeParam] = useState<string>('coding');
  const [arenaParam, setArenaParam] = useState<string>('');
  const [apiKeyInput, setApiKeyInput] = useState<string>(getStoredApiKey());
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'python' | 'javascript'>('curl');
  const [copied, setCopied] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [isLiveSource, setIsLiveSource] = useState<boolean>(false);

  // Generate constructed URL
  const queryUrl = (() => {
    const url = new URL('https://openrouter.ai/api/v1/benchmarks');
    if (sourceParam && sourceParam !== 'all') url.searchParams.set('source', sourceParam);
    if (taskTypeParam && taskTypeParam !== 'all') url.searchParams.set('task_type', taskTypeParam);
    if (arenaParam) url.searchParams.set('arena', arenaParam);
    return url.toString();
  })();

  // Code Snippets
  const getCodeSnippet = () => {
    const token = apiKeyInput || '$OPENROUTER_API_KEY';
    
    if (selectedLanguage === 'curl') {
      return `curl -X GET "${queryUrl}" \\
  -H "Authorization: Bearer ${token}" \\
  -H "HTTP-Referer: https://your-site.com" \\
  -H "X-Title: LLM Benchmark Hub"`;
    }

    if (selectedLanguage === 'python') {
      return `import requests

url = "${queryUrl}"
headers = {
    "Authorization": "Bearer ${token}",
    "HTTP-Referer": "https://your-site.com",
    "X-Title": "LLM Benchmark Hub"
}

response = requests.get(url, headers=headers)
benchmarks_data = response.json()
print(benchmarks_data)`;
    }

    return `const response = await fetch("${queryUrl}", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${token}",
    "HTTP-Referer": "https://your-site.com",
    "X-Title": "LLM Benchmark Hub"
  }
});

const benchmarks = await response.json();
console.log(benchmarks);`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    const start = performance.now();

    try {
      const res = await fetchLiveBenchmarks({
        source: sourceParam,
        task_type: taskTypeParam,
        arena: arenaParam,
        apiKey: apiKeyInput
      });

      const end = performance.now();
      setResponseLatency(Math.round(end - start));
      setIsLiveSource(res.isLive);
      setResponseStatus(200);

      if (res.rawResponse) {
        setResponseJson(res.rawResponse);
      } else {
        // Construct structured benchmark response format
        const mockPayload = {
          data: res.data.map(m => ({
            model: m.id,
            source: sourceParam || 'artificial-analysis',
            task_type: taskTypeParam || 'overall',
            score: taskTypeParam === 'coding' ? (m.metrics.sweBench || m.metrics.qualityIndex) : m.metrics.qualityIndex,
            metric: taskTypeParam === 'coding' ? 'SWE-bench Verified (%)' : 'Quality Index',
            updated_at: new Date().toISOString(),
            provenance: {
              source_url: `https://openrouter.ai/docs/api/benchmarks`,
              price_basis: `$${m.pricing.prompt} / 1M prompt tokens`
            }
          })),
          sources: [sourceParam || 'all'],
          task_types: [taskTypeParam || 'all'],
          updated_at: new Date().toISOString()
        };
        setResponseJson(mockPayload);
      }
    } catch (err: any) {
      setResponseStatus(400);
      setResponseJson({
        error: {
          message: err.message || 'Failed to execute query',
          code: 400
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <span>OpenRouter Benchmarks API Playground</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test and inspect parameters against the <code className="text-sky-400 font-mono">GET /api/v1/benchmarks</code> endpoint in real-time.
          </p>
        </div>

        <a
          href="https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-colors"
        >
          <span>Official API Docs</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Query Builder Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Query Parameters Form */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Request Parameters</span>
            </div>

            {/* Source Parameter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>source (Optional)</span>
                <span className="text-[10px] text-slate-500">Query Param</span>
              </label>
              <select
                value={sourceParam}
                onChange={(e) => setSourceParam(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {BENCHMARK_SOURCES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type Parameter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>task_type (Optional)</span>
                <span className="text-[10px] text-slate-500">Query Param</span>
              </label>
              <select
                value={taskTypeParam}
                onChange={(e) => setTaskTypeParam(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {TASK_TYPES.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Arena Parameter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>arena (Optional)</span>
                <span className="text-[10px] text-slate-500">For Design / Chat Arena</span>
              </label>
              <input
                type="text"
                placeholder="e.g. design-arena"
                value={arenaParam}
                onChange={(e) => setArenaParam(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* API Key Override */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-sky-400" />
                  <span>OpenRouter API Key</span>
                </span>
                <span className="text-[10px] text-slate-500">Bearer Auth</span>
              </label>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Optional: If empty, playground executes using the local high-fidelity benchmark snapshot engine.
              </p>
            </div>

            {/* Send Request Action Button */}
            <button
              onClick={handleExecuteRequest}
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isLoading ? 'Sending Request...' : 'Send API Request'}</span>
            </button>

          </div>

          {/* Code Snippet Generator */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Code Generator</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                {(['curl', 'python', 'javascript'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-sky-500 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80">
                {getCodeSnippet()}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                title="Copy code snippet"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Response Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm min-h-[480px] flex flex-col">
            
            {/* Response Status Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300">Response Payload</span>
                {responseStatus !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    responseStatus === 200
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-red-500/15 text-red-300 border-red-500/30'
                  }`}>
                    {responseStatus} OK
                  </span>
                )}
                {isLiveSource && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium">
                    Live OpenRouter API
                  </span>
                )}
              </div>

              {responseLatency !== null && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{responseLatency} ms</span>
                </div>
              )}
            </div>

            {/* Request URL Pill */}
            <div className="mt-3 p-2 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center gap-2 overflow-x-auto">
              <span className="text-emerald-400 font-bold">GET</span>
              <span className="text-slate-300">{queryUrl}</span>
            </div>

            {/* JSON Response Body View */}
            <div className="mt-3 flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-sky-300 overflow-auto max-h-[500px]">
              {responseJson ? (
                <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(responseJson, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 opacity-40" />
                  <p className="text-xs">Click "Send API Request" to test endpoint live.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
