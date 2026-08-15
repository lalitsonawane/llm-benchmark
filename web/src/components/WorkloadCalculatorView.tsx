import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Sparkles, 
  TrendingDown, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { BenchmarkModel } from '../shared/types';

interface WorkloadCalculatorViewProps {
  models: BenchmarkModel[];
  onSelectModel: (model: BenchmarkModel) => void;
}

export const WorkloadCalculatorView: React.FC<WorkloadCalculatorViewProps> = ({
  models,
  onSelectModel
}) => {
  const [monthlyRequests, setMonthlyRequests] = useState<number>(250000);
  const [avgPromptTokens, setAvgPromptTokens] = useState<number>(1000);
  const [avgCompletionTokens, setAvgCompletionTokens] = useState<number>(300);
  const [maxLatencyConstraint, setMaxLatencyConstraint] = useState<number>(1200); // ms

  // Calculate monthly tokens in millions
  const totalPromptTokensM = (monthlyRequests * avgPromptTokens) / 1_000_000;
  const totalCompletionTokensM = (monthlyRequests * avgCompletionTokens) / 1_000_000;

  // Compute spend for each model
  const modelCosts = useMemo(() => {
    return models
      .map(model => {
        const promptCost = totalPromptTokensM * model.pricing.prompt;
        const completionCost = totalCompletionTokensM * model.pricing.completion;
        const totalCost = promptCost + completionCost;
        const meetsLatency = model.metrics.ttftMs <= maxLatencyConstraint;

        // Composite value score: Quality / Cost penalty
        const costPenalty = Math.max(0.1, totalCost / 100);
        const roiScore = (model.metrics.qualityIndex / Math.pow(costPenalty, 0.4)).toFixed(1);

        return {
          model,
          promptCost,
          completionCost,
          totalCost,
          meetsLatency,
          roiScore: parseFloat(roiScore)
        };
      })
      .sort((a, b) => a.totalCost - b.totalCost);
  }, [models, totalPromptTokensM, totalCompletionTokensM, maxLatencyConstraint]);

  // Find baseline most expensive model for comparison savings (e.g. GPT-4.5)
  const baselineCost = useMemo(() => {
    const gpt45 = modelCosts.find(m => m.model.id.includes('gpt-4.5'));
    return gpt45 ? gpt45.totalCost : Math.max(...modelCosts.map(m => m.totalCost));
  }, [modelCosts]);

  // Recommended Best Value Model that meets latency
  const recommendedModel = useMemo(() => {
    const candidates = modelCosts.filter(m => m.meetsLatency && m.model.metrics.qualityIndex >= 88);
    if (candidates.length === 0) return modelCosts[0];
    return candidates.sort((a, b) => b.roiScore - a.roiScore)[0];
  }, [modelCosts]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-sky-400" />
          <span>Workload Cost & ROI Estimator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Estimate your monthly production token bill and identify the most cost-effective frontier model for your traffic requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Workload Sliders & Configuration */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Traffic & Token Parameters</span>
          </div>

          {/* Slider 1: Monthly Requests */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Monthly Requests</span>
              <span className="font-mono font-bold text-sky-400">
                {monthlyRequests.toLocaleString()} reqs
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={monthlyRequests}
              onChange={(e) => setMonthlyRequests(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>10k</span>
              <span>1M</span>
              <span>2M</span>
            </div>
          </div>

          {/* Slider 2: Prompt Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Avg Prompt Tokens / Req</span>
              <span className="font-mono font-bold text-indigo-400">
                {avgPromptTokens.toLocaleString()} tokens
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="8000"
              step="100"
              value={avgPromptTokens}
              onChange={(e) => setAvgPromptTokens(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>100</span>
              <span>4,000</span>
              <span>8,000</span>
            </div>
          </div>

          {/* Slider 3: Completion Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Avg Completion Tokens / Req</span>
              <span className="font-mono font-bold text-purple-400">
                {avgCompletionTokens.toLocaleString()} tokens
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="4000"
              step="50"
              value={avgCompletionTokens}
              onChange={(e) => setAvgCompletionTokens(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>50</span>
              <span>2,000</span>
              <span>4,000</span>
            </div>
          </div>

          {/* Slider 4: Max TTFT Latency Constraint */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Max TTFT Latency SLA</span>
              <span className="font-mono font-bold text-amber-400">
                &le; {maxLatencyConstraint} ms
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="2000"
              step="50"
              value={maxLatencyConstraint}
              onChange={(e) => setMaxLatencyConstraint(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>300ms (Real-time)</span>
              <span>2000ms (Batch)</span>
            </div>
          </div>

          {/* Volume Summary */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Total Prompt Volume:</span>
              <span className="font-mono font-semibold text-slate-200">{totalPromptTokensM.toFixed(1)}M tokens</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Total Completion Volume:</span>
              <span className="font-mono font-semibold text-slate-200">{totalCompletionTokensM.toFixed(1)}M tokens</span>
            </div>
          </div>

        </div>

        {/* Right Columns: Recommendation Card + Ranked Spend Table */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Top Recommendation Box */}
          {recommendedModel && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900/90 to-indigo-950/60 border border-sky-500/40 backdrop-blur-sm relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                    Recommended Sweet-Spot Model
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Save {((1 - recommendedModel.totalCost / baselineCost) * 100).toFixed(0)}% vs Flagship
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {recommendedModel.model.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {recommendedModel.model.provider} • Quality Index: {recommendedModel.model.metrics.qualityIndex} • TTFT: {recommendedModel.model.metrics.ttftMs}ms
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Estimated Monthly Bill</span>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    ${recommendedModel.totalCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Model Ranked Costs Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Projected Cost Breakdown</span>
              <span>Estimated Monthly Spend</span>
            </div>

            <div className="divide-y divide-slate-800/50">
              {modelCosts.map(({ model, totalCost, promptCost, completionCost, meetsLatency }) => {
                const savingsPct = ((1 - totalCost / baselineCost) * 100).toFixed(0);
                
                return (
                  <div
                    key={model.id}
                    onClick={() => onSelectModel(model)}
                    className={`p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      !meetsLatency ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white hover:text-sky-400 transition-colors">
                            {model.name}
                          </span>
                          {!meetsLatency && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                              Exceeds {maxLatencyConstraint}ms SLA
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {model.provider} • Prompt: ${promptCost.toFixed(2)} + Output: ${completionCost.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-100 text-sm">
                        ${totalCost.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        {totalCost < baselineCost ? `${savingsPct}% cheaper` : 'Baseline'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
