import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  X, 
  Plus, 
  Sparkles, 
  Trophy, 
  Zap, 
  DollarSign, 
  Cpu, 
  Code, 
  Calculator, 
  Bot, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { BenchmarkModel } from '../shared/types';

interface ModelCompareViewProps {
  models: BenchmarkModel[];
  selectedCompareIds: string[];
  onToggleCompare: (modelId: string) => void;
  onSelectModel: (model: BenchmarkModel) => void;
}

const COLORS = [
  { stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.25)', name: 'Sky' },
  { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.25)', name: 'Purple' },
  { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.25)', name: 'Emerald' },
  { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.25)', name: 'Amber' }
];

export const ModelCompareView: React.FC<ModelCompareViewProps> = ({
  models,
  selectedCompareIds,
  onToggleCompare,
  onSelectModel
}) => {
  // If no models selected, default to top 2 (Claude 3.7 Sonnet vs GPT-4.5 or DeepSeek R1)
  const [activeCompareIds, setActiveCompareIds] = useState<string[]>(() => {
    if (selectedCompareIds.length >= 2) return selectedCompareIds.slice(0, 4);
    if (selectedCompareIds.length === 1) {
      const secondModel = models.find(m => m.id !== selectedCompareIds[0])?.id;
      return secondModel ? [selectedCompareIds[0], secondModel] : [selectedCompareIds[0]];
    }
    return [models[0]?.id || '', models[1]?.id || '', models[2]?.id || ''].filter(Boolean);
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize with external selectedCompareIds if user added via leaderboard
  useEffect(() => {
    if (selectedCompareIds.length > 0) {
      setActiveCompareIds(selectedCompareIds.slice(0, 4));
    }
  }, [selectedCompareIds]);

  const selectedModels = activeCompareIds
    .map(id => models.find(m => m.id === id))
    .filter((m): m is BenchmarkModel => Boolean(m));

  // Compute normalized radar axes (0 - 100)
  const axes = [
    { label: 'Reasoning (GPQA)', key: 'reasoning' },
    { label: 'Coding (SWE-bench)', key: 'coding' },
    { label: 'Math (AIME 2024)', key: 'math' },
    { label: 'Throughput Speed', key: 'speed' },
    { label: 'Cost Efficiency', key: 'cost' },
    { label: 'Agentic Tool Use', key: 'agentic' }
  ];

  const getModelAxisValue = (model: BenchmarkModel, axisKey: string): number => {
    switch (axisKey) {
      case 'reasoning':
        return model.metrics.gpqa || 60;
      case 'coding':
        return (model.metrics.sweBench || 50) * 1.35; // scaled to 100
      case 'math':
        return model.metrics.aime2024 || 60;
      case 'speed':
        return Math.min(100, (model.metrics.tokensPerSec / 140) * 100);
      case 'cost':
        // Lower price = higher score (inverse scale)
        const blendedPrice = model.pricing.prompt * 0.75 + model.pricing.completion * 0.25;
        return Math.max(10, Math.min(100, 100 - blendedPrice * 1.2));
      case 'agentic':
        return (model.metrics.tauBench || 55) * 1.35;
      default:
        return 50;
    }
  };

  // Render HTML5 Canvas Radar Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 380;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 45;
    const totalAxes = axes.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw concentric polygon webs (20%, 40%, 60%, 80%, 100%)
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      ctx.beginPath();
      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = level === levels ? 'rgba(100, 116, 139, 0.4)' : 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines and labels
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.stroke();

      // Label text
      const labelDist = radius + 22;
      const labelX = centerX + labelDist * Math.cos(angle);
      const labelY = centerY + labelDist * Math.sin(angle);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axes[i].label, labelX, labelY);
    }

    // Draw each model polygon
    selectedModels.forEach((model, mIdx) => {
      const color = COLORS[mIdx % COLORS.length];
      ctx.beginPath();

      axes.forEach((axis, i) => {
        const val = getModelAxisValue(model, axis.key);
        const r = (radius * Math.min(100, Math.max(10, val))) / 100;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.closePath();
      ctx.fillStyle = color.fill;
      ctx.fill();
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      axes.forEach((axis, i) => {
        const val = getModelAxisValue(model, axis.key);
        const r = (radius * Math.min(100, Math.max(10, val))) / 100;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color.stroke;
        ctx.fill();
      });
    });

  }, [selectedModels]);

  const handleAddModel = (id: string) => {
    if (activeCompareIds.length < 4 && !activeCompareIds.includes(id)) {
      setActiveCompareIds(prev => [...prev, id]);
    }
  };

  const handleRemoveModel = (id: string) => {
    setActiveCompareIds(prev => prev.filter(mId => mId !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Model Picker Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>Side-by-Side Model Comparison</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare up to 4 frontier LLMs across quality indices, reasoning benchmarks, speed, and pricing.
          </p>
        </div>

        {/* Add Model Dropdown if under 4 models */}
        {activeCompareIds.length < 4 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddModel(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="" disabled>+ Add model to compare</option>
              {models
                .filter(m => !activeCompareIds.includes(m.id))
                .map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Grid & Radar Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Radar Chart Visualizer */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Capability Radar Profile
            </span>
            <span className="text-[11px] text-slate-500">6 Normalized Axes</span>
          </div>

          {/* Canvas Radar */}
          <div className="relative my-2">
            <canvas
              ref={canvasRef}
              style={{ width: 340, height: 340 }}
              className="max-w-full"
            />
          </div>

          {/* Model Legends */}
          <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
            {selectedModels.map((m, idx) => {
              const color = COLORS[idx % COLORS.length];
              return (
                <div key={m.id} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.stroke }} />
                  <span className="truncate font-medium text-slate-200">{m.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Comparison Matrix Columns */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Model Header Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
            {selectedModels.map((model, idx) => {
              const color = COLORS[idx % COLORS.length];
              return (
                <div 
                  key={model.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border transition-all relative group"
                  style={{ borderColor: `${color.stroke}40` }}
                >
                  <button
                    onClick={() => handleRemoveModel(model.id)}
                    className="absolute top-3 right-3 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.stroke }} />
                    <span className="text-xs font-semibold text-slate-400">{model.provider}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-sky-300 transition-colors">
                    {model.name}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                    <div className="bg-slate-950/60 p-1.5 rounded-lg">
                      <span className="text-[10px] text-slate-400">Quality Index</span>
                      <div className="font-mono font-bold text-white text-sm">{model.metrics.qualityIndex}</div>
                    </div>
                    <div className="bg-slate-950/60 p-1.5 rounded-lg">
                      <span className="text-[10px] text-slate-400">Throughput</span>
                      <div className="font-mono font-bold text-sky-400 text-sm">{model.metrics.tokensPerSec} <span className="text-[9px]">tps</span></div>
                    </div>
                    <div className="bg-slate-950/60 p-1.5 rounded-lg">
                      <span className="text-[10px] text-slate-400">In / Out 1M</span>
                      <div className="font-mono font-bold text-emerald-400 text-sm">${model.pricing.prompt}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Metric Diff Rows */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800/60">
            
            {/* Row: Arena ELO */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-48 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Chatbot / Arena ELO</span>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedModels.map(m => (
                  <div key={m.id} className="text-center font-mono font-bold text-amber-300 text-sm">
                    {m.metrics.elo}
                  </div>
                ))}
              </div>
            </div>

            {/* Row: SWE-bench Verified */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-48 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>SWE-bench Verified (%)</span>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedModels.map(m => (
                  <div key={m.id} className="text-center font-mono font-bold text-emerald-400 text-sm">
                    {m.metrics.sweBench ? `${m.metrics.sweBench}%` : 'N/A'}
                  </div>
                ))}
              </div>
            </div>

            {/* Row: GPQA Diamond */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-48 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>GPQA Diamond (%)</span>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedModels.map(m => (
                  <div key={m.id} className="text-center font-mono font-bold text-indigo-300 text-sm">
                    {m.metrics.gpqa ? `${m.metrics.gpqa}%` : 'N/A'}
                  </div>
                ))}
              </div>
            </div>

            {/* Row: AIME 2024 Math */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-48 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-purple-400" />
                <span>AIME 2024 Math (%)</span>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedModels.map(m => (
                  <div key={m.id} className="text-center font-mono font-bold text-purple-300 text-sm">
                    {m.metrics.aime2024 ? `${m.metrics.aime2024}%` : 'N/A'}
                  </div>
                ))}
              </div>
            </div>

            {/* Row: Latency TTFT */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-48 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Time to First Token (TTFT)</span>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedModels.map(m => (
                  <div key={m.id} className="text-center font-mono text-slate-300 text-xs">
                    {m.metrics.ttftMs} ms
                  </div>
                ))}
              </div>
            </div>

            {/* Row: Context Length */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-48 text-xs font-semibold text-slate-300">
                Context Window
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedModels.map(m => (
                  <div key={m.id} className="text-center font-mono text-slate-300 text-xs">
                    {(m.context_length / 1000).toFixed(0)}k tokens
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
