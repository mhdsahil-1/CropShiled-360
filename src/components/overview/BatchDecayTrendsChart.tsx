import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { HarvestBatch } from '../../types';

interface BatchDecayTrendsChartProps {
  batch: HarvestBatch;
  compact?: boolean;
}

interface TrendPoint {
  timeLabel: string;
  hours: number;
  ambientScore: number;
  preservedScore: number;
  ambientRisk: number;
  preservedRisk: number;
  ambientGrade: string;
  preservedGrade: string;
}

export const BatchDecayTrendsChart: React.FC<BatchDecayTrendsChartProps> = ({
  batch,
  compact = false,
}) => {
  const [metricType, setMetricType] = useState<'health' | 'risk'>('health');
  const [scenario, setScenario] = useState<'both' | 'preserved' | 'ambient'>('both');

  // Compute realistic decay projection curves based on current batch attributes
  const data: TrendPoint[] = useMemo(() => {
    const initialScore = batch.healthScore;
    
    // Determine biological decay multiplier based on crop type and ambient temp
    let ambientHourlyLoss = 0.9;
    let preservedHourlyLoss = 0.22;
    let timeSteps = [0, 6, 12, 18, 24, 36, 48, 72, 96];

    if (batch.cropName.toLowerCase().includes('chilli')) {
      ambientHourlyLoss = 2.1;
      preservedHourlyLoss = 0.45;
      timeSteps = [0, 3, 6, 12, 18, 24, 30, 36];
    } else if (batch.cropName.toLowerCase().includes('tomato')) {
      ambientHourlyLoss = 1.15;
      preservedHourlyLoss = 0.28;
      timeSteps = [0, 6, 12, 24, 36, 48, 72, 96];
    } else if (batch.cropName.toLowerCase().includes('onion')) {
      ambientHourlyLoss = 0.65;
      preservedHourlyLoss = 0.12;
      timeSteps = [0, 12, 24, 36, 48, 72, 96, 144];
    } else if (batch.cropName.toLowerCase().includes('potato')) {
      ambientHourlyLoss = 0.25;
      preservedHourlyLoss = 0.05;
      timeSteps = [0, 24, 48, 72, 96, 144, 216, 288];
    }

    return timeSteps.map((h) => {
      // Non-linear acceleration as respiration escalates
      const accelFactor = 1 + (h / 80) * 0.4;
      const ambientRaw = Math.max(0, initialScore - (h * ambientHourlyLoss * accelFactor));
      const preservedRaw = Math.max(15, initialScore - (h * preservedHourlyLoss));

      const amb = Math.round(ambientRaw);
      const prs = Math.round(preservedRaw);

      const getGrade = (score: number) => {
        if (score >= 75) return 'Grade A';
        if (score >= 45) return 'Grade B';
        return 'Grade C (Critical)';
      };

      return {
        timeLabel: h === 0 ? 'Now' : `+${h}h`,
        hours: h,
        ambientScore: amb,
        preservedScore: prs,
        ambientRisk: Math.min(100, Math.max(0, Math.round(100 - amb))),
        preservedRisk: Math.min(100, Math.max(0, Math.round(100 - prs))),
        ambientGrade: getGrade(amb),
        preservedGrade: getGrade(prs),
      };
    });
  }, [batch]);

  // Threshold cross calculation for ambient spoilage
  const breachPoint = useMemo(() => {
    return data.find((pt) => pt.ambientScore <= 40);
  }, [data]);

  const preservedExtension = useMemo(() => {
    if (batch.cropName.toLowerCase().includes('potato')) return '+14 Days Cold Life';
    if (batch.cropName.toLowerCase().includes('onion')) return '+18 Days Chamber Life';
    if (batch.cropName.toLowerCase().includes('chilli')) return '+28h Processing Bypass';
    return '+4.5 Days RUL Extended';
  }, [batch.cropName]);

  return (
    <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/70 space-y-3.5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary-fixed/50 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-base">trending_down</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span>Batch Decay Trends</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary-fixed text-on-primary-fixed font-mono">
                {batch.id}
              </span>
            </h4>
            <p className="text-[11px] text-on-surface-variant">
              ADDT dynamic shelf-life decay modeling &amp; RUL projection
            </p>
          </div>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-surface-container rounded-lg p-0.5 border border-outline-variant/50">
          <button
            type="button"
            onClick={() => setMetricType('health')}
            className={`px-2 py-0.5 text-[11px] font-label-sm rounded-md transition-all cursor-pointer ${
              metricType === 'health'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Health Score
          </button>
          <button
            type="button"
            onClick={() => setMetricType('risk')}
            className={`px-2 py-0.5 text-[11px] font-label-sm rounded-md transition-all cursor-pointer ${
              metricType === 'risk'
                ? 'bg-surface-container-lowest text-error font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Spoilage Risk %
          </button>
        </div>
      </div>

      {/* Quick Telemetry Callout */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-surface-container-lowest border border-primary/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="text-[11px] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Preserved Route RUL
            </span>
          </div>
          <div className="font-bold text-primary text-sm mt-0.5 font-headline-sm">
            {preservedExtension}
          </div>
          <span className="text-[10px] text-on-surface-variant">
            via {batch.destinationName.split(' ')[0]} Hub
          </span>
        </div>

        <div className="p-2 rounded-lg bg-surface-container-lowest border border-error/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="text-[11px] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error" />
              Ambient Spoilage ETA
            </span>
          </div>
          <div className="font-bold text-error text-sm mt-0.5 font-headline-sm">
            {breachPoint ? `Critical at ${breachPoint.timeLabel}` : 'Stabilized'}
          </div>
          <span className="text-[10px] text-on-surface-variant">
            {breachPoint ? 'Grade C threshold crossed' : 'Safe margin maintained'}
          </span>
        </div>
      </div>

      {/* Scenario Filters */}
      <div className="flex items-center justify-between text-[11px] pt-1">
        <span className="text-outline font-semibold uppercase tracking-wider text-[10px]">
          Display Curves:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setScenario('both')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
              scenario === 'both'
                ? 'bg-on-surface-variant/20 text-on-surface font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Comparative (Both)
          </button>
          <button
            type="button"
            onClick={() => setScenario('preserved')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
              scenario === 'preserved'
                ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Preserved
          </button>
          <button
            type="button"
            onClick={() => setScenario('ambient')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
              scenario === 'ambient'
                ? 'bg-error-container text-on-error-container font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Ambient
          </button>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className={`w-full ${compact ? 'h-44' : 'h-52'} pt-1`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="preservedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1F5C3D" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1F5C3D" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="ambientGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BA1A1A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#BA1A1A" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#c0c9c0" opacity={0.35} vertical={false} />

            <XAxis
              dataKey="timeLabel"
              tick={{ fontSize: 10, fill: '#707972' }}
              tickLine={false}
              axisLine={{ stroke: '#c0c9c0', opacity: 0.6 }}
            />

            <YAxis
              domain={metricType === 'health' ? [0, 100] : [0, 100]}
              tick={{ fontSize: 10, fill: '#707972' }}
              tickLine={false}
              axisLine={false}
              ticks={metricType === 'health' ? [0, 25, 50, 75, 100] : [0, 25, 50, 75, 100]}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as TrendPoint;
                  return (
                    <div className="bg-inverse-surface/95 backdrop-blur-md text-surface-container-lowest p-2.5 rounded-lg shadow-xl border border-outline/30 text-xs space-y-1.5 font-body-sm min-w-44 z-50">
                      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-1">
                        <span className="font-bold text-primary-fixed">Time: {label}</span>
                        <span className="text-[10px] text-surface-variant font-mono">
                          +{pt.hours} hrs elapsed
                        </span>
                      </div>

                      {/* Preserved route readout */}
                      {(scenario === 'both' || scenario === 'preserved') && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center text-primary-fixed">
                            <span className="flex items-center gap-1 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed" />
                              Preserved Route:
                            </span>
                            <span className="font-bold">
                              {metricType === 'health' ? `${pt.preservedScore}/100` : `${pt.preservedRisk}% Risk`}
                            </span>
                          </div>
                          <div className="text-[10px] text-surface-variant pl-2.5">
                            Status: <span className="font-medium text-surface-container-lowest">{pt.preservedGrade}</span>
                          </div>
                        </div>
                      )}

                      {/* Ambient open-air readout */}
                      {(scenario === 'both' || scenario === 'ambient') && (
                        <div className="space-y-0.5 pt-0.5">
                          <div className="flex justify-between items-center text-error-container">
                            <span className="flex items-center gap-1 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-error" />
                              Ambient Decay:
                            </span>
                            <span className="font-bold">
                              {metricType === 'health' ? `${pt.ambientScore}/100` : `${pt.ambientRisk}% Risk`}
                            </span>
                          </div>
                          <div className="text-[10px] text-surface-variant pl-2.5">
                            Status: <span className="font-medium text-error-container">{pt.ambientGrade}</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-1 border-t border-outline-variant/20 flex justify-between text-[10px] text-primary-fixed font-bold">
                        <span>Quality Salvaged:</span>
                        <span>
                          +{Math.abs(pt.preservedScore - pt.ambientScore)} Health Pts
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Critical Biological Threshold Reference Line (Health score 40) */}
            {metricType === 'health' && (
              <ReferenceLine
                y={40}
                stroke="#ba1a1a"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Critical Threshold (40)',
                  position: 'insideTopRight',
                  fill: '#ba1a1a',
                  fontSize: 9,
                  fontWeight: 600,
                }}
              />
            )}

            {/* Preserved Route Curve */}
            {(scenario === 'both' || scenario === 'preserved') && (
              <Area
                type="monotone"
                dataKey={metricType === 'health' ? 'preservedScore' : 'preservedRisk'}
                stroke="#1F5C3D"
                strokeWidth={2.5}
                fill="url(#preservedGrad)"
                name="Preserved Route"
                activeDot={{ r: 4, stroke: '#1F5C3D', strokeWidth: 2, fill: '#b1f1c8' }}
              />
            )}

            {/* Ambient Open-Air Curve */}
            {(scenario === 'both' || scenario === 'ambient') && (
              <Line
                type="monotone"
                dataKey={metricType === 'health' ? 'ambientScore' : 'ambientRisk'}
                stroke="#ba1a1a"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#ba1a1a' }}
                name="Ambient Decay"
                activeDot={{ r: 4, stroke: '#ba1a1a', strokeWidth: 2, fill: '#ffdad6' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-between text-[11px] pt-1 text-on-surface-variant border-t border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-1 bg-primary-container rounded-full" />
            CropShield Route
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-1 bg-error border-b border-dashed border-error" />
            Ambient Open-Air
          </span>
        </div>
        <span className="text-[10px] text-outline font-mono">
          YOLOv8 &amp; MobileNet-V3 Decay Twin
        </span>
      </div>
    </div>
  );
};
