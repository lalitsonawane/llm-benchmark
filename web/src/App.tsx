import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LeaderboardView } from './components/LeaderboardView';
import { ModelCompareView } from './components/ModelCompareView';
import { ParetoVisualizerView } from './components/ParetoVisualizerView';
import { WorkloadCalculatorView } from './components/WorkloadCalculatorView';
import { ApiPlaygroundView } from './components/ApiPlaygroundView';
import { ModelDetailModal } from './components/ModelDetailModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { MobileSimulatorModal } from './components/MobileSimulatorModal';
import { fetchLiveBenchmarks, getStoredApiKey } from './services/openrouterApi';
import { BenchmarkModel, BenchmarkSource, TaskType } from './shared/types';
import { BENCHMARK_MODELS } from './shared/benchmarksData';
import { ExternalLink, Zap } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'compare' | 'pareto' | 'calculator' | 'api'>('leaderboard');
  const [models, setModels] = useState<BenchmarkModel[]>(BENCHMARK_MODELS);
  const [activeSource, setActiveSource] = useState<BenchmarkSource>('all');
  const [activeTask, setActiveTask] = useState<TaskType>('all');
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<BenchmarkModel | null>(null);
  
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(Boolean(getStoredApiKey()));

  // Initial load / refresh
  const loadBenchmarks = async () => {
    try {
      const res = await fetchLiveBenchmarks({
        source: activeSource,
        task_type: activeTask
      });
      setModels(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBenchmarks();
  }, [activeSource, activeTask]);

  const handleToggleCompare = (modelId: string) => {
    if (!modelId) {
      setSelectedCompareIds([]);
      return;
    }
    setSelectedCompareIds(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), modelId];
      }
      return [...prev, modelId];
    });
  };

  const handleKeySave = () => {
    setHasApiKey(Boolean(getStoredApiKey()));
    loadBenchmarks();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenMobileSimulator={() => setIsMobileSimulatorOpen(true)}
        selectedCompareCount={selectedCompareIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            models={models}
            selectedCompareIds={selectedCompareIds}
            onToggleCompare={handleToggleCompare}
            onSelectModel={setSelectedModel}
            activeSource={activeSource}
            setActiveSource={setActiveSource}
            activeTask={activeTask}
            setActiveTask={setActiveTask}
          />
        )}

        {activeTab === 'compare' && (
          <ModelCompareView
            models={models}
            selectedCompareIds={selectedCompareIds}
            onToggleCompare={handleToggleCompare}
            onSelectModel={setSelectedModel}
          />
        )}

        {activeTab === 'pareto' && (
          <ParetoVisualizerView
            models={models}
            onSelectModel={setSelectedModel}
          />
        )}

        {activeTab === 'calculator' && (
          <WorkloadCalculatorView
            models={models}
            onSelectModel={setSelectedModel}
          />
        )}

        {activeTab === 'api' && (
          <ApiPlaygroundView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-sky-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-semibold text-slate-300">OpenRouter LLM Benchmark Suite</span>
            <span>•</span>
            <span>Web & Mobile Expo App</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <span>API Reference</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsMobileSimulatorOpen(true)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Launch Expo Preview
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ModelDetailModal
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
        onCompare={handleToggleCompare}
        isComparing={selectedModel ? selectedCompareIds.includes(selectedModel.id) : false}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleKeySave}
      />

      <MobileSimulatorModal
        isOpen={isMobileSimulatorOpen}
        onClose={() => setIsMobileSimulatorOpen(false)}
        models={models}
        onSelectModel={setSelectedModel}
      />

    </div>
  );
}
export default App;
