import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Info, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { BenchmarkModel } from '../shared/types';

interface ParetoVisualizerViewProps {
  models: BenchmarkModel[];
  onSelectModel: (model: BenchmarkModel) => void;
}

export const ParetoVisualizerView: React.FC<ParetoVisualizerViewProps> = ({
  models,
  onSelectModel
}) => {
  const [chartMode, setChartMode] = useState<'cost-vs-quality' | 'speed-vs-quality' | 'latency-vs-quality'>('cost-vs-quality');
  const [hoveredModel, setHoveredModel] = useState<BenchmarkModel | null>(null);
  const [showReasoningOnly, setShowReasoningOnly] = useState(false);

  const filteredModels = useMemo(() => {
    if (showReasoningOnly) {
      return models.filter(m => m.isReasoningModel);
    }
    return models;
  }, [models, showReasoningOnly]);

  // Compute Pareto Frontier for (Cost vs Quality) -> Min Cost, Max Quality
  const paretoCostQuality = useMemo(() => {
    // Sort by price ascending
    const sorted = [...filteredModels].sort((a, b) => {
      const priceA = a.pricing.prompt * 0.75 + a.pricing.completion * 0.25;
      const priceB = b.pricing.prompt * 0.75 + b.pricing.completion * 0.25;
      return priceA - priceB;
    });

    const frontier: BenchmarkModel[] = [];
    let maxQualitySoFar = -1;

    for (const m of sorted) {
      if (m.metrics.qualityIndex > maxQualitySoFar) {
        frontier.push(m);
        maxQualitySoFar = m.metrics.qualityIndex;
      }
    }
    return frontier;
  }, [filteredModels]);

  // SVG Dimension Constants
  const width = 800;
  const height = 440;
  const padding = { top: 40, right: 60, bottom: 60, left: 70 };

  // Calculate coordinates based on chart mode
  const plotData = useMemo(() => {
    let minX = 0;
    let maxX = 100;
    let minY = 80;
    let maxY = 100;

    if (chartMode === 'cost-vs-quality') {
      // X = Price ($/1M), Y = Quality Index
      const prices = filteredModels.map(m => m.pricing.prompt * 0.75 + m.pricing.completion * 0.25);
      minX = 0;
      maxX = Math.max(...prices, 10) * 1.05;
      minY = Math.min(...filteredModels.map(m => m.metrics.qualityIndex)) - 4;
      maxY = 100;
    } else if (chartMode === 'speed-vs-quality') {
      // X = Speed (tokens/sec), Y = Quality Index
      const speeds = filteredModels.map(m => m.metrics.tokensPerSec);
      minX = 0;
      maxX = Math.max(...speeds, 140) * 1.1;
      minY = Math.min(...filteredModels.map(m => m.metrics.qualityIndex)) - 4;
      maxY = 100;
    } else {
      // X = Latency TTFT (ms), Y = Quality Index
      const latencies = filteredModels.map(m => m.metrics.ttftMs);
      minX = 0;
      maxX = Math.max(...latencies, 1500) * 1.1;
      minY = Math.min(...filteredModels.map(m => m.metrics.qualityIndex)) - 4;
      maxY = 100;
    }

    const scaleX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * (width - padding.left - padding.right);
    const scaleY = (val: number) => height - padding.bottom - ((val - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);

    return {
      minX, maxX, minY, maxY, scaleX, scaleY
    };
  }, [filteredModels, chartMode]);

  const getPointCoords = (m: BenchmarkModel) => {
    let rawX = 0;
    if (chartMode === 'cost-vs-quality') {
      rawX = m.pricing.prompt * 0.75 + m.pricing.completion * 0.25;
    } else if (chartMode === 'speed-vs-quality') {
      rawX = m.metrics.tokensPerSec;
    } else {
      rawX = m.metrics.ttftMs;
    }
    return {
      x: plotData.scaleX(rawX),
      y: plotData.scaleY(m.metrics.qualityIndex),
      rawX
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <span>Pareto Frontier & Efficiency Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Discover frontier optimal models where no other model provides higher quality for lower cost or latency.
          </p>
        </div>

        {/* View Mode Selector Pills */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setChartMode('cost-vs-quality')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartMode === 'cost-vs-quality'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cost vs Quality (Pareto)
          </button>
          <button
            onClick={() => setChartMode('speed-vs-quality')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartMode === 'speed-vs-quality'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Speed vs Quality
          </button>
          <button
            onClick={() => setChartMode('latency-vs-quality')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartMode === 'latency-vs-quality'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Latency vs Quality
          </button>
        </div>
      </div>

      {/* Main SVG Scatter Plot Container */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm relative overflow-hidden shadow-xl">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">
              {chartMode === 'cost-vs-quality' ? 'Quality Index vs Blended Price ($/1M tokens)' : chartMode === 'speed-vs-quality' ? 'Quality Index vs Throughput Speed (tps)' : 'Quality Index vs TTFT Latency (ms)'}
            </span>
            {chartMode === 'cost-vs-quality' && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                ★ Green line = Pareto Frontier
              </span>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showReasoningOnly}
              onChange={(e) => setShowReasoningOnly(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
            />
            <span>Reasoning models only</span>
          </label>
        </div>

        {/* SVG Scatter Plot */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[650px] overflow-visible">
            
            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((step, i) => {
              const y = padding.top + (height - padding.top - padding.bottom) * step;
              const yVal = Math.round(plotData.maxY - step * (plotData.maxY - plotData.minY));
              return (
                <g key={`h-grid-${i}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="rgba(51, 65, 85, 0.3)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 12}
                    y={y + 4}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {yVal}
                  </text>
                </g>
              );
            })}

            {/* X-axis ticks */}
            {[0.0, 0.25, 0.5, 0.75, 1.0].map((step, i) => {
              const x = padding.left + (width - padding.left - padding.right) * step;
              const xVal = (plotData.minX + step * (plotData.maxX - plotData.minX)).toFixed(1);
              return (
                <g key={`v-grid-${i}`}>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="rgba(51, 65, 85, 0.3)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={x}
                    y={height - padding.bottom + 20}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {chartMode === 'cost-vs-quality' ? `$${xVal}` : xVal}
                  </text>
                </g>
              );
            })}

            {/* Pareto Curve (for cost vs quality) */}
            {chartMode === 'cost-vs-quality' && paretoCostQuality.length > 1 && (
              <path
                d={paretoCostQuality.reduce((path, m, idx) => {
                  const pt = getPointCoords(m);
                  return idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
                }, '')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                opacity="0.8"
              />
            )}

            {/* Model Scatter Points */}
            {filteredModels.map((model) => {
              const pt = getPointCoords(model);
              const isPareto = chartMode === 'cost-vs-quality' && paretoCostQuality.some(p => p.id === model.id);
              const isHovered = hoveredModel?.id === model.id;

              return (
                <g
                  key={model.id}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredModel(model)}
                  onMouseLeave={() => setHoveredModel(null)}
                  onClick={() => onSelectModel(model)}
                >
                  {/* Outer pulse for Pareto or hovered */}
                  {(isPareto || isHovered) && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 14 : 10}
                      fill={isPareto ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.25)'}
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Point */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 7 : isPareto ? 6 : 4.5}
                    fill={isPareto ? '#10b981' : model.isReasoningModel ? '#a855f7' : '#38bdf8'}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />

                  {/* Model Label Tag */}
                  <text
                    x={pt.x + 8}
                    y={pt.y + 3}
                    fill={isHovered ? '#ffffff' : '#cbd5e1'}
                    fontSize={isHovered ? '11' : '9.5'}
                    fontWeight={isHovered || isPareto ? 'bold' : 'normal'}
                    className="select-none pointer-events-none drop-shadow"
                  >
                    {model.name.split(' ')[0]} {isPareto ? '★' : ''}
                  </text>
                </g>
              );
            })}

            {/* Axes Labels */}
            <text
              x={width / 2}
              y={height - 12}
              fill="#94a3b8"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              {chartMode === 'cost-vs-quality' ? 'Blended Cost ($ per 1M tokens)' : chartMode === 'speed-vs-quality' ? 'Speed (Tokens per Second)' : 'Latency (TTFT ms)'}
            </text>

            <text
              x={-height / 2}
              y={20}
              transform="rotate(-90)"
              fill="#94a3b8"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              Quality Index (Artificial Analysis 0-100)
            </text>

          </svg>
        </div>

        {/* Hovered Model Card Flyout */}
        {hoveredModel && (
          <div className="absolute top-16 right-8 w-72 p-4 rounded-xl bg-slate-950/95 border border-sky-500/50 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{hoveredModel.provider}</span>
              {paretoCostQuality.some(p => p.id === hoveredModel.id) && (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  Pareto Optimal
                </span>
              )}
            </div>
            <h4 className="font-bold text-white text-sm mt-1">{hoveredModel.name}</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{hoveredModel.description}</p>
            
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Quality Index</span>
                <div className="font-mono font-bold text-white">{hoveredModel.metrics.qualityIndex}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Speed (TPS)</span>
                <div className="font-mono font-bold text-sky-400">{hoveredModel.metrics.tokensPerSec} tps</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Prompt Price</span>
                <div className="font-mono text-emerald-400">${hoveredModel.pricing.prompt}/1M</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Completion</span>
                <div className="font-mono text-emerald-400">${hoveredModel.pricing.completion}/1M</div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
