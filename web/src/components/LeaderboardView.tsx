import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Check, 
  SlidersHorizontal, 
  Download, 
  Brain, 
  Code, 
  Cpu, 
  Calculator, 
  Bot, 
  Eye, 
  Sparkles,
  Zap,
  DollarSign,
  Clock,
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { BenchmarkModel, BenchmarkSource, TaskType } from '../shared/types';
import { BENCHMARK_SOURCES, TASK_TYPES } from '../shared/benchmarksData';

interface LeaderboardViewProps {
  models: BenchmarkModel[];
  selectedCompareIds: string[];
  onToggleCompare: (modelId: string) => void;
  onSelectModel: (model: BenchmarkModel) => void;
  activeSource: BenchmarkSource;
  setActiveSource: (source: BenchmarkSource) => void;
  activeTask: TaskType;
  setActiveTask: (task: TaskType) => void;
}

type SortField = 
  | 'elo'
  | 'qualityIndex'
  | 'tokensPerSec'
  | 'ttftMs'
  | 'price'
  | 'sweBench'
  | 'gpqa'
  | 'aime2024'
  | 'tauBench'
  | 'context_length';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  models,
  selectedCompareIds,
  onToggleCompare,
  onSelectModel,
  activeSource,
  setActiveSource,
  activeTask,
  setActiveTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('elo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // List of unique providers
  const providers = useMemo(() => {
    const set = new Set<string>();
    models.forEach(m => set.add(m.provider));
    return ['all', ...Array.from(set)];
  }, [models]);

  // Handle column sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default to ascending for cost and latency, descending for scores
      setSortDirection(field === 'price' || field === 'ttftMs' ? 'asc' : 'desc');
    }
  };

  // Filtered & Sorted models
  const processedModels = useMemo(() => {
    return models
      .filter(model => {
        const matchesSearch = 
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.provider.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesProvider = 
          selectedProvider === 'all' || model.provider.toLowerCase() === selectedProvider.toLowerCase();
        
        return matchesSearch && matchesProvider;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        switch (sortField) {
          case 'elo':
            valA = a.metrics.elo;
            valB = b.metrics.elo;
            break;
          case 'qualityIndex':
            valA = a.metrics.qualityIndex;
            valB = b.metrics.qualityIndex;
            break;
          case 'tokensPerSec':
            valA = a.metrics.tokensPerSec;
            valB = b.metrics.tokensPerSec;
            break;
          case 'ttftMs':
            valA = a.metrics.ttftMs;
            valB = b.metrics.ttftMs;
            break;
          case 'price':
            // Blended pricing (3:1 input:output typical ratio)
            valA = a.pricing.prompt * 0.75 + a.pricing.completion * 0.25;
            valB = b.pricing.prompt * 0.75 + b.pricing.completion * 0.25;
            break;
          case 'sweBench':
            valA = a.metrics.sweBench || 0;
            valB = b.metrics.sweBench || 0;
            break;
          case 'gpqa':
            valA = a.metrics.gpqa || 0;
            valB = b.metrics.gpqa || 0;
            break;
          case 'aime2024':
            valA = a.metrics.aime2024 || 0;
            valB = b.metrics.aime2024 || 0;
            break;
          case 'tauBench':
            valA = a.metrics.tauBench || 0;
            valB = b.metrics.tauBench || 0;
            break;
          case 'context_length':
            valA = a.context_length;
            valB = b.context_length;
            break;
        }

        if (sortDirection === 'asc') {
          return valA - valB;
        } else {
          return valB - valA;
        }
      });
  }, [models, searchQuery, selectedProvider, sortField, sortDirection]);

  // Summary KPI statistics
  const topIntelligenceModel = useMemo(() => {
    return [...models].sort((a, b) => b.metrics.elo - a.metrics.elo)[0];
  }, [models]);

  const fastestModel = useMemo(() => {
    return [...models].sort((a, b) => b.metrics.tokensPerSec - a.metrics.tokensPerSec)[0];
  }, [models]);

  const bestValueModel = useMemo(() => {
    return [...models].sort((a, b) => {
      const scoreA = a.metrics.qualityIndex / (a.pricing.prompt + 0.1);
      const scoreB = b.metrics.qualityIndex / (b.pricing.prompt + 0.1);
      return scoreB - scoreA;
    })[0];
  }, [models]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Model Name',
      'Provider',
      'Model ID',
      'Arena ELO',
      'Quality Index',
      'Throughput (tps)',
      'TTFT (ms)',
      'Prompt Price ($/1M)',
      'Completion Price ($/1M)',
      'Context Length',
      'SWE-bench Verified (%)',
      'GPQA Diamond (%)',
      'AIME 2024 (%)'
    ];

    const rows = processedModels.map((m, idx) => [
      idx + 1,
      `"${m.name}"`,
      m.provider,
      m.id,
      m.metrics.elo,
      m.metrics.qualityIndex,
      m.metrics.tokensPerSec,
      m.metrics.ttftMs,
      m.pricing.prompt,
      m.pricing.completion,
      m.context_length,
      m.metrics.sweBench || 'N/A',
      m.metrics.gpqa || 'N/A',
      m.metrics.aime2024 || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `openrouter_benchmarks_${activeSource}_${activeTask}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTaskIcon = (taskId: TaskType) => {
    switch (taskId) {
      case 'coding': return Code;
      case 'reasoning': return Cpu;
      case 'math': return Calculator;
      case 'agentic': return Bot;
      case 'vision': return Eye;
      case 'overall': return Brain;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Benchmark Models Tracked */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-4 text-slate-800 group-hover:text-slate-700 transition-colors">
            <Sparkles className="w-10 h-10 opacity-20" />
          </div>
          <span className="text-xs font-medium text-slate-400">Total Benchmark Models</span>
          <div className="text-2xl font-bold text-white mt-1">{models.length} <span className="text-xs text-sky-400 font-normal">Active Frontier</span></div>
          <p className="text-[11px] text-slate-500 mt-1">Sourced from OpenRouter & Artificial Analysis</p>
        </div>

        {/* Card 2: Highest Intelligence */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-4 text-amber-500 group-hover:text-amber-400 transition-colors">
            <Brain className="w-10 h-10 opacity-15" />
          </div>
          <span className="text-xs font-medium text-slate-400">Top Overall ELO</span>
          <div className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-2">
            {topIntelligenceModel?.metrics.elo}
            <span className="text-xs font-medium text-slate-300 truncate max-w-[120px]">
              {topIntelligenceModel?.name.split(' ')[0]}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">LMSYS & Design Arena #1 Leader</p>
        </div>

        {/* Card 3: Speed Champion */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-4 text-sky-500 group-hover:text-sky-400 transition-colors">
            <Zap className="w-10 h-10 opacity-15" />
          </div>
          <span className="text-xs font-medium text-slate-400">Fastest Throughput</span>
          <div className="text-2xl font-bold text-sky-400 mt-1 flex items-center gap-2">
            {fastestModel?.metrics.tokensPerSec} <span className="text-xs font-normal text-slate-400">tps</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">{fastestModel?.name} ({fastestModel?.metrics.ttftMs}ms TTFT)</p>
        </div>

        {/* Card 4: Best ROI */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-4 text-emerald-500 group-hover:text-emerald-400 transition-colors">
            <DollarSign className="w-10 h-10 opacity-15" />
          </div>
          <span className="text-xs font-medium text-slate-400">Highest Efficiency ROI</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1 truncate">
            {bestValueModel?.name.split(' ')[0]}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ${bestValueModel?.pricing.prompt}/1M • {bestValueModel?.metrics.qualityIndex} QI
          </p>
        </div>

      </div>

      {/* Benchmark Source Selector Pills */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span>Benchmark Evaluation Source</span>
          </div>
          <span className="text-xs text-slate-500">API Endpoint: /api/v1/benchmarks?source={activeSource}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {BENCHMARK_SOURCES.map(src => {
            const isSelected = activeSource === src.id;
            return (
              <button
                key={src.id}
                onClick={() => setActiveSource(src.id as BenchmarkSource)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500 text-sky-300 shadow-sm shadow-sky-500/20'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{src.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Type Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Evaluation Task Domain</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {TASK_TYPES.map(task => {
            const Icon = getTaskIcon(task.id as TaskType);
            const isSelected = activeTask === task.id;
            return (
              <button
                key={task.id}
                onClick={() => setActiveTask(task.id as TaskType)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-500/20 to-sky-500/10 border-indigo-500/60 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                </div>
                <span className="text-xs font-semibold mt-2 line-clamp-1">{task.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Provider Filter & Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search model name, provider (e.g. Claude 3.7, DeepSeek, GPT-4.5)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Provider Dropdown & Export */}
        <div className="flex items-center gap-2">
          
          {/* Provider Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Provider:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {providers.map(p => (
                <option key={p} value={p} className="bg-slate-900 text-slate-200">
                  {p === 'all' ? 'All Providers' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-colors"
            title="Download CSV Leaderboard Dataset"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

      </div>

      {/* Main Leaderboard Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-2 w-10 text-center">Diff</th>
                <th className="py-3.5 px-4 min-w-[220px]">Model & Provider</th>
                
                <th 
                  onClick={() => handleSort('elo')}
                  className="py-3.5 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Arena ELO</span>
                    {sortField === 'elo' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" /> : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    ) : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('qualityIndex')}
                  className="py-3.5 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Quality Index</span>
                    {sortField === 'qualityIndex' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" /> : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    ) : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('sweBench')}
                  className="py-3.5 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>SWE-bench</span>
                    {sortField === 'sweBench' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" /> : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    ) : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('aime2024')}
                  className="py-3.5 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>AIME 2024</span>
                    {sortField === 'aime2024' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" /> : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    ) : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('tokensPerSec')}
                  className="py-3.5 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Speed</span>
                    {sortField === 'tokensPerSec' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" /> : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    ) : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('ttftMs')}
                  className="py-3.5 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Latency</span>
                    {sortField === 'ttftMs' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" /> : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    ) : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('price')}
                  className="py-3.5 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Price (In/Out 1M)</span>
                    {sortField === 'price' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" /> : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    ) : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                  </div>
                </th>

                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50 text-xs text-slate-200">
              {processedModels.map((model, index) => {
                const isSelectedForCompare = selectedCompareIds.includes(model.id);
                const isTopThree = index < 3;

                return (
                  <tr
                    key={model.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectModel(model)}
                  >
                    {/* Rank Number with Badge */}
                    <td className="py-3.5 px-4 text-center font-bold">
                      {isTopThree ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${
                          index === 0
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-400/20'
                            : index === 1
                            ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                            : 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                        }`}>
                          {index + 1}
                        </span>
                      ) : (
                        <span className="text-slate-500">{index + 1}</span>
                      )}
                    </td>

                    {/* Compare Select Checkbox */}
                    <td 
                      className="py-3.5 px-2 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(model.id);
                      }}
                    >
                      <div className={`w-5 h-5 mx-auto rounded-md border flex items-center justify-center transition-all ${
                        isSelectedForCompare
                          ? 'bg-sky-500 border-sky-400 text-white'
                          : 'border-slate-700 group-hover:border-slate-500 bg-slate-900'
                      }`}>
                        {isSelectedForCompare && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </td>

                    {/* Model Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                            {model.name}
                          </span>
                          {model.isReasoningModel && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                              Reasoning
                            </span>
                          )}
                          {model.isOpenWeights && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                              Open Weights
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="text-slate-300 font-medium">{model.provider}</span>
                          <span>•</span>
                          <span>{(model.context_length / 1000).toFixed(0)}k ctx</span>
                        </div>
                      </div>
                    </td>

                    {/* ELO Rating */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      <span className="text-amber-400">{model.metrics.elo}</span>
                    </td>

                    {/* Quality Index */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{model.metrics.qualityIndex}</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                            style={{ width: `${model.metrics.qualityIndex}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* SWE-bench Verified */}
                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      {model.metrics.sweBench ? (
                        <span className="text-emerald-400 font-medium">{model.metrics.sweBench}%</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* AIME 2024 */}
                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      {model.metrics.aime2024 ? (
                        <span className="text-indigo-400 font-medium">{model.metrics.aime2024}%</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Speed (tokens/sec) */}
                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      <span className={model.metrics.tokensPerSec > 80 ? 'text-sky-400 font-semibold' : 'text-slate-300'}>
                        {model.metrics.tokensPerSec} <span className="text-[10px] text-slate-500">tps</span>
                      </span>
                    </td>

                    {/* Latency (TTFT ms) */}
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      <span>{model.metrics.ttftMs}ms</span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="flex flex-col">
                        <span>${model.pricing.prompt.toFixed(2)} / ${model.pricing.completion.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500">per 1M tokens</span>
                      </div>
                    </td>

                    {/* Arrow Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-slate-500 group-hover:text-sky-400 transition-colors">
                        <span className="text-[11px] hidden sm:inline font-medium">Inspect</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compare Floating Bottom Banner when items selected */}
      {selectedCompareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 border border-sky-500/50 backdrop-blur-lg px-5 py-3 rounded-2xl shadow-2xl shadow-sky-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">
              {selectedCompareIds.length} model{selectedCompareIds.length > 1 ? 's' : ''} selected
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">(Max 4 models)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare('')}
              className="text-xs text-slate-400 hover:text-slate-200 underline px-2"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const compareTab = document.querySelector('[data-tab="compare"]') as HTMLButtonElement;
                if (compareTab) compareTab.click();
              }}
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs rounded-xl shadow-md transition-colors"
            >
              Open Comparison Matrix →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
