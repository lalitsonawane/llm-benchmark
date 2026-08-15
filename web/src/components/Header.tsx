import React from 'react';
import { 
  Trophy, 
  BarChart3, 
  Layers, 
  Terminal, 
  Calculator, 
  Smartphone, 
  Key, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'leaderboard' | 'compare' | 'pareto' | 'calculator' | 'api';
  setActiveTab: (tab: 'leaderboard' | 'compare' | 'pareto' | 'calculator' | 'api') => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenMobileSimulator: () => void;
  selectedCompareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasApiKey,
  onOpenApiKeyModal,
  onOpenMobileSimulator,
  selectedCompareCount
}) => {
  const tabs = [
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy },
    { 
      id: 'compare' as const, 
      label: 'Compare', 
      icon: Layers, 
      badge: selectedCompareCount > 0 ? selectedCompareCount : undefined 
    },
    { id: 'pareto' as const, label: 'Pareto & Analytics', icon: BarChart3 },
    { id: 'calculator' as const, label: 'ROI Calculator', icon: Calculator },
    { id: 'api' as const, label: 'API Playground', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-[1px] flex items-center justify-center shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-sky-400 fill-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  OpenRouter
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-medium">
                  Benchmarks
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Unified LLM Leaderboard, ELO & Cost Analytics
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-sky-600' : 'bg-sky-500/20 text-sky-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Simulator Toggle */}
            <button
              onClick={onOpenMobileSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-all shadow-sm"
              title="Preview Mobile App (Expo Simulator)"
            >
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Expo App</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                hasApiKey
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {hasApiKey ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Key className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{hasApiKey ? 'Live API Connected' : 'Connect API Key'}</span>
            </button>

            {/* OpenRouter Official Docs Link */}
            <a
              href="https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800 transition-colors"
              title="OpenRouter Benchmarks Documentation"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/60">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
