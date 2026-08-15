import React from 'react';
import { 
  X, 
  ExternalLink, 
  Trophy, 
  Zap, 
  DollarSign, 
  Cpu, 
  Code, 
  Calculator, 
  Bot, 
  Eye, 
  Layers, 
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { BenchmarkModel } from '../shared/types';

interface ModelDetailModalProps {
  model: BenchmarkModel | null;
  onClose: () => void;
  onCompare: (modelId: string) => void;
  isComparing: boolean;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  onClose,
  onCompare,
  isComparing
}) => {
  if (!model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                {model.provider}
              </span>
              {model.isReasoningModel && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Reasoning Model
                </span>
              )}
              {model.isOpenWeights && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Open Weights
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mt-1.5">{model.name}</h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{model.id}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Description & Overview */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">About Model</h4>
            <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">{model.description}</p>
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-medium">Arena ELO</span>
              <div className="text-lg font-bold text-amber-400 mt-0.5 font-mono">{model.metrics.elo}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-medium">Quality Index</span>
              <div className="text-lg font-bold text-white mt-0.5 font-mono">{model.metrics.qualityIndex}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-medium">Throughput</span>
              <div className="text-lg font-bold text-sky-400 mt-0.5 font-mono">{model.metrics.tokensPerSec} <span className="text-xs font-normal">tps</span></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-medium">TTFT Latency</span>
              <div className="text-lg font-bold text-slate-200 mt-0.5 font-mono">{model.metrics.ttftMs} <span className="text-xs font-normal">ms</span></div>
            </div>

          </div>

          {/* Pricing & Architecture specs */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300">Technical Specifications</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Context Length:</span>
                <span className="font-mono text-slate-200">{model.context_length.toLocaleString()} tokens</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Architecture:</span>
                <span className="text-slate-200">{model.architecture}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Prompt Price:</span>
                <span className="font-mono text-emerald-400">${model.pricing.prompt.toFixed(2)} / 1M tokens</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Completion Price:</span>
                <span className="font-mono text-emerald-400">${model.pricing.completion.toFixed(2)} / 1M tokens</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Modalities:</span>
                <span className="text-slate-200">{model.modalities.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Release Date:</span>
                <span className="text-slate-200">{model.releaseDate}</span>
              </div>
            </div>
          </div>

          {/* Provenance Benchmarks List */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Individual Benchmark Provenance
            </h4>
            
            <div className="space-y-2">
              {model.benchmarks.map((b, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{b.metric_name}</div>
                    <div className="text-[11px] text-slate-500">{b.source} • {b.task}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sky-400">{b.value}</div>
                    {b.percentile && (
                      <div className="text-[10px] text-emerald-400">Top {100 - b.percentile}% percentile</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => onCompare(model.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isComparing
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isComparing ? 'In Comparison Matrix' : '+ Add to Compare'}</span>
          </button>

          <a
            href={model.openRouterUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/25 transition-all"
          >
            <span>Run on OpenRouter</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
