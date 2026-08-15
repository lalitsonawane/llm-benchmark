import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Trophy, 
  Layers, 
  BarChart3, 
  Calculator, 
  Terminal, 
  Search, 
  Zap, 
  Brain, 
  Code, 
  Sparkles, 
  ChevronRight,
  Wifi,
  Battery,
  Signal,
  Check
} from 'lucide-react';
import { BenchmarkModel } from '../shared/types';

interface MobileSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: BenchmarkModel[];
  onSelectModel: (model: BenchmarkModel) => void;
}

export const MobileSimulatorModal: React.FC<MobileSimulatorModalProps> = ({
  isOpen,
  onClose,
  models,
  onSelectModel
}) => {
  const [mobileTab, setMobileTab] = useState<'leaderboard' | 'compare' | 'pareto' | 'calculator'>('leaderboard');
  const [mobileSearch, setMobileSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<'all' | 'coding' | 'reasoning' | 'math'>('all');

  if (!isOpen) return null;

  const filtered = models.filter(m => 
    m.name.toLowerCase().includes(mobileSearch.toLowerCase()) ||
    m.provider.toLowerCase().includes(mobileSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col items-center">
        
        {/* Top Floating Close / Info Bar */}
        <div className="mb-3 flex items-center justify-between w-full max-w-[380px] text-xs px-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>Expo React Native App View</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iPhone 16 Pro Frame */}
        <div className="w-[375px] h-[720px] bg-slate-950 rounded-[48px] border-[8px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-700/50">
          
          {/* Dynamic Island / Notch */}
          <div className="pt-3 pb-1 px-7 flex items-center justify-between z-20 select-none">
            <span className="text-[11px] font-semibold text-slate-200">9:41</span>
            
            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1 border border-slate-800/40">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
            </div>

            <div className="flex items-center gap-1.5 text-slate-200">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mobile Screen Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
            
            {/* Mobile Header */}
            <div className="px-4 py-2.5 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white leading-tight">OpenRouter Evals</h3>
                  <span className="text-[9px] text-sky-400">Mobile Benchmark Hub</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                v1.0.0
              </span>
            </div>

            {/* Tab: Leaderboard */}
            {mobileTab === 'leaderboard' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search model or provider..."
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Quick Task Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {(['all', 'coding', 'reasoning', 'math'] as const).map(task => (
                    <button
                      key={task}
                      onClick={() => setSelectedTask(task)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap capitalize transition-colors ${
                        selectedTask === task
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {task}
                    </button>
                  ))}
                </div>

                {/* Model Cards */}
                <div className="space-y-2">
                  {filtered.map((model, idx) => (
                    <div
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{model.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {model.provider} • ${(model.pricing.prompt).toFixed(2)}/1M
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-amber-400 text-xs">
                          {model.metrics.elo} ELO
                        </div>
                        <div className="text-[10px] text-sky-400 font-mono">
                          {model.metrics.tokensPerSec} tps
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab: Compare */}
            {mobileTab === 'compare' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div className="text-xs font-bold text-white">Compare Top Models</div>
                <div className="grid grid-cols-2 gap-2">
                  {models.slice(0, 2).map((m, i) => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-sky-400">{i === 0 ? 'Model A' : 'Model B'}</span>
                      <div className="font-bold text-xs text-white">{m.name}</div>
                      <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1 text-slate-300">
                        <div className="flex justify-between">
                          <span>ELO:</span>
                          <span className="font-mono text-amber-400">{m.metrics.elo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SWE-bench:</span>
                          <span className="font-mono text-emerald-400">{m.metrics.sweBench}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Throughput:</span>
                          <span className="font-mono text-sky-400">{m.metrics.tokensPerSec} tps</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Pareto */}
            {mobileTab === 'pareto' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div className="text-xs font-bold text-white">Pareto Optimal Frontier</div>
                <p className="text-[10px] text-slate-400">Models offering maximum quality at minimum price:</p>
                <div className="space-y-2">
                  {models.filter(m => m.metrics.qualityIndex >= 90).slice(0, 4).map(m => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-white">{m.name}</div>
                        <span className="text-[10px] text-emerald-400">Quality: {m.metrics.qualityIndex} QI</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-white">
                        ${m.pricing.prompt}/1M
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Calculator */}
            {mobileTab === 'calculator' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div className="text-xs font-bold text-white">Quick Spend Calculator</div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="text-[11px] text-slate-400">100k requests / month (1k prompt, 300 completion)</div>
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Claude 3.7 Sonnet:</span>
                      <span className="font-mono font-bold text-white">$750 / mo</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Gemini 2.0 Flash:</span>
                      <span className="font-mono">$22 / mo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Bottom Tab Bar */}
            <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 pb-2">
              {[
                { id: 'leaderboard', label: 'Evals', icon: Trophy },
                { id: 'compare', label: 'Compare', icon: Layers },
                { id: 'pareto', label: 'Pareto', icon: BarChart3 },
                { id: 'calculator', label: 'Costs', icon: Calculator }
              ].map(t => {
                const Icon = t.icon;
                const isActive = mobileTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setMobileTab(t.id as any)}
                    className={`flex flex-col items-center gap-1 transition-colors ${
                      isActive ? 'text-sky-400' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Home Bar */}
            <div className="pb-1 flex justify-center">
              <div className="w-28 h-1 bg-slate-700 rounded-full" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
