import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { HarvestBatch } from '../../types';

interface BatchCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: HarvestBatch[];
  initialBatchAId?: string;
  initialBatchBId?: string;
  onConfirmMandi?: (batch: HarvestBatch) => void;
  onDivertRoute?: (batch: HarvestBatch) => void;
}

interface ComparativePoint {
  timeLabel: string;
  hours: number;
  batchA_ambient: number;
  batchA_preserved: number;
  batchB_ambient: number;
  batchB_preserved: number;
}

export const BatchCompareModal: React.FC<BatchCompareModalProps> = ({
  isOpen,
  onClose,
  batches,
  initialBatchAId,
  initialBatchBId,
  onConfirmMandi,
  onDivertRoute
}) => {
  // Ensure we have at least 2 batches
  const defaultBatchA = useMemo(() => {
    return batches.find((b) => b.id === initialBatchAId) || batches[0] || null;
  }, [batches, initialBatchAId]);

  const defaultBatchB = useMemo(() => {
    return (
      batches.find((b) => b.id === initialBatchBId) ||
      batches.find((b) => b.id !== defaultBatchA?.id) ||
      batches[1] ||
      batches[0] ||
      null
    );
  }, [batches, initialBatchBId, defaultBatchA]);

  const [batchAId, setBatchAId] = useState<string>(defaultBatchA?.id || '');
  const [batchBId, setBatchBId] = useState<string>(defaultBatchB?.id || '');
  const [activeCurveView, setActiveCurveView] = useState<'both' | 'ambient-only' | 'preserved-only'>('both');

  // Synchronize when initial props change
  React.useEffect(() => {
    if (initialBatchAId) {
      setBatchAId(initialBatchAId);
      // Ensure Batch B is distinct from Batch A
      setBatchBId((prev) => {
        if (prev === initialBatchAId) {
          const alternate = batches.find((b) => b.id !== initialBatchAId);
          return alternate ? alternate.id : prev;
        }
        return prev;
      });
    }
  }, [initialBatchAId, batches]);

  React.useEffect(() => {
    if (initialBatchBId) {
      setBatchBId(initialBatchBId);
    }
  }, [initialBatchBId]);

  const batchA = useMemo(() => batches.find((b) => b.id === batchAId) || batches[0], [batches, batchAId]);
  const batchB = useMemo(() => {
    const found = batches.find((b) => b.id === batchBId);
    if (found && found.id !== batchA?.id) return found;
    return batches.find((b) => b.id !== batchA?.id) || batches[1] || batches[0];
  }, [batches, batchBId, batchA]);

  // Swap Batch A and Batch B
  const handleSwap = () => {
    const temp = batchAId;
    setBatchAId(batchBId);
    setBatchBId(temp);
  };

  // Trajectory projection calculator for any batch
  const getBatchDecayRate = (b: HarvestBatch) => {
    const name = b.cropName.toLowerCase();
    if (name.includes('chilli')) return { ambientLoss: 2.1, preservedLoss: 0.45 };
    if (name.includes('tomato')) return { ambientLoss: 1.15, preservedLoss: 0.28 };
    if (name.includes('onion')) return { ambientLoss: 0.65, preservedLoss: 0.14 };
    if (name.includes('potato')) return { ambientLoss: 0.25, preservedLoss: 0.05 };
    return { ambientLoss: 0.9, preservedLoss: 0.2 };
  };

  // Comparative time series data points
  const comparativeData: ComparativePoint[] = useMemo(() => {
    if (!batchA || !batchB) return [];

    const rateA = getBatchDecayRate(batchA);
    const rateB = getBatchDecayRate(batchB);

    const timeSteps = [0, 6, 12, 18, 24, 36, 48, 72, 96];

    return timeSteps.map((h) => {
      const accelA = 1 + (h / 80) * 0.4;
      const accelB = 1 + (h / 80) * 0.4;

      const scoreA_amb = Math.max(0, Math.round(batchA.healthScore - h * rateA.ambientLoss * accelA));
      const scoreA_prs = Math.max(15, Math.round(batchA.healthScore - h * rateA.preservedLoss));

      const scoreB_amb = Math.max(0, Math.round(batchB.healthScore - h * rateB.ambientLoss * accelB));
      const scoreB_prs = Math.max(15, Math.round(batchB.healthScore - h * rateB.preservedLoss));

      return {
        timeLabel: h === 0 ? 'Now' : `+${h}h`,
        hours: h,
        batchA_ambient: scoreA_amb,
        batchA_preserved: scoreA_prs,
        batchB_ambient: scoreB_amb,
        batchB_preserved: scoreB_prs
      };
    });
  }, [batchA, batchB]);

  if (!isOpen || !batchA || !batchB) return null;

  // Grade color helper
  const getGradeBadge = (grade: string) => {
    if (grade.includes('A+')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (grade.includes('A')) return 'bg-primary-fixed text-on-primary-fixed border-primary-container/30';
    if (grade.includes('B')) return 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-container/30';
    return 'bg-error-container text-on-error-container border-error/30';
  };

  // Calculate comparative deltas
  const healthDelta = batchA.healthScore - batchB.healthScore;
  const weightDelta = batchA.weightKg - batchB.weightKg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-inverse-surface/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl flex flex-col my-auto">
        {/* ========================================================================= */}
        {/* 1. MODAL HEADER & BATCH QUICK SELECTORS                                   */}
        {/* ========================================================================= */}
        <div className="sticky top-0 z-30 px-6 py-4 bg-surface-container-lowest border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-bold">
                ADDT Comparative Twin Engine
              </span>
              <span className="text-outline text-xs">• Side-by-Side Analysis</span>
            </div>
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
              Batch Decay Trajectory &amp; Logistics Compare
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface font-label-sm text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/60 active:scale-95"
              title="Swap Batch A and Batch B"
            >
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              <span>Swap</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Close Compare View"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Selection Bar & Preset Strip */}
        <div className="p-4 bg-surface-container-low border-b border-outline-variant/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto flex-1">
            {/* Batch A Selector */}
            <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-xl border-2 border-primary-container shadow-2xs">
              <span className="px-2 py-1 rounded bg-primary-container text-on-primary font-bold text-xs font-mono">
                Batch A
              </span>
              <select
                value={batchAId}
                onChange={(e) => setBatchAId(e.target.value)}
                className="flex-1 bg-transparent font-label-md text-xs sm:text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} • {b.cropName} ({b.gradeLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Batch B Selector */}
            <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-xl border-2 border-secondary shadow-2xs">
              <span className="px-2 py-1 rounded bg-secondary text-on-secondary font-bold text-xs font-mono">
                Batch B
              </span>
              <select
                value={batchBId}
                onChange={(e) => setBatchBId(e.target.value)}
                className="flex-1 bg-transparent font-label-md text-xs sm:text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} • {b.cropName} ({b.gradeLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-label-sm text-outline font-semibold">Presets:</span>
            <button
              onClick={() => {
                setBatchAId('#CS-TOM-0824');
                setBatchBId('#CS-CH-0419');
              }}
              className="px-2.5 py-1 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-[11px] font-semibold text-on-surface cursor-pointer transition-colors"
            >
              Tomato vs Chilli (Fresh vs Spoilage)
            </button>
            <button
              onClick={() => {
                setBatchAId('#CS-ON-1102');
                setBatchBId('#CS-POT-0951');
              }}
              className="px-2.5 py-1 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-[11px] font-semibold text-on-surface cursor-pointer transition-colors"
            >
              Onion vs Potato (Storable)
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6">
          {/* ========================================================================= */}
          {/* 2. SIDE-BY-SIDE BATCH HERO & CORE METRICS CARDS                           */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BATCH A CARD */}
            <div className="bg-surface-container-lowest rounded-2xl border-2 border-primary-container p-5 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-container" />

              {/* Title & Image Bar */}
              <div className="flex items-start gap-4">
                <img
                  src={batchA.imageUrl}
                  alt={batchA.imageAlt}
                  className="w-20 h-20 rounded-xl object-cover border border-outline-variant shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-xs font-bold text-on-surface">
                      {batchA.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getGradeBadge(batchA.grade)}`}>
                      {batchA.gradeLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                      {batchA.weightKg.toLocaleString()} kg
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface truncate">
                    {batchA.cropName}
                  </h3>
                  <p className="text-xs text-on-surface-variant truncate">
                    Producer: <strong className="text-on-surface">{batchA.producer}</strong> ({batchA.origin})
                  </p>
                </div>
              </div>

              {/* Biological Health & Shelf-Life Bar */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div>
                  <span className="text-[11px] font-label-sm text-outline font-semibold block">Health Score</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-headline-md text-2xl font-bold text-primary">
                      {batchA.healthScore}
                    </span>
                    <span className="text-xs text-outline font-normal">/ 100</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant line-clamp-1">
                    {batchA.healthDescription}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-label-sm text-outline font-semibold block">Remaining Useful Life</span>
                  <div className="font-headline-sm text-base font-bold text-primary-container mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">timer</span>
                    <span>{batchA.shelfLifeRemaining}</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant line-clamp-1">
                    {batchA.shelfLifeContext}
                  </span>
                </div>
              </div>

              {/* Sensor & Degradation Telemetry */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                  <span className="text-outline text-[10px] block">Ambient Temp</span>
                  <span className="font-bold text-on-surface mt-0.5 block">{batchA.ambientTransitTemp}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                  <span className="text-outline text-[10px] block">Respiration Rate</span>
                  <span className="font-bold text-primary mt-0.5 block">{batchA.respirationRate}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                  <span className="text-outline text-[10px] block">Pest &amp; Surface</span>
                  <span className="font-bold text-on-surface mt-0.5 block">{batchA.pestSurfaceScars}</span>
                </div>
              </div>

              {/* Logistics & Route Target */}
              <div className="p-3 rounded-xl bg-primary-fixed/20 border border-primary-container/40 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-primary">
                    {batchA.routeType}
                  </span>
                  <span className="font-bold text-primary">{batchA.destinationPriceContext}</span>
                </div>
                <p className="font-bold text-sm text-on-surface">{batchA.destinationName}</p>
                <p className="text-on-surface-variant text-[11px]">
                  Estimated Value: <strong>{batchA.economicPreservedValue}</strong> ({batchA.economicComparison})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {onConfirmMandi && (
                  <button
                    onClick={() => onConfirmMandi(batchA)}
                    className="flex-1 h-9 rounded-lg bg-primary-container hover:bg-primary text-white font-label-sm text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Confirm Route A</span>
                  </button>
                )}
                {onDivertRoute && (
                  <button
                    onClick={() => onDivertRoute(batchA)}
                    className="h-9 px-3 rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-variant text-on-surface font-label-sm text-xs font-bold flex items-center gap-1 transition-colors active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">alt_route</span>
                    <span>Divert</span>
                  </button>
                )}
              </div>
            </div>

            {/* BATCH B CARD */}
            <div className="bg-surface-container-lowest rounded-2xl border-2 border-secondary p-5 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary" />

              {/* Title & Image Bar */}
              <div className="flex items-start gap-4">
                <img
                  src={batchB.imageUrl}
                  alt={batchB.imageAlt}
                  className="w-20 h-20 rounded-xl object-cover border border-outline-variant shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-xs font-bold text-on-surface">
                      {batchB.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getGradeBadge(batchB.grade)}`}>
                      {batchB.gradeLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                      {batchB.weightKg.toLocaleString()} kg
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface truncate">
                    {batchB.cropName}
                  </h3>
                  <p className="text-xs text-on-surface-variant truncate">
                    Producer: <strong className="text-on-surface">{batchB.producer}</strong> ({batchB.origin})
                  </p>
                </div>
              </div>

              {/* Biological Health & Shelf-Life Bar */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div>
                  <span className="text-[11px] font-label-sm text-outline font-semibold block">Health Score</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-headline-md text-2xl font-bold text-secondary">
                      {batchB.healthScore}
                    </span>
                    <span className="text-xs text-outline font-normal">/ 100</span>
                    {healthDelta !== 0 && (
                      <span
                        className={`text-[10px] font-bold ml-1 px-1 rounded ${
                          healthDelta > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {healthDelta > 0 ? `${-healthDelta} pts vs A` : `+${Math.abs(healthDelta)} pts vs A`}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-on-surface-variant line-clamp-1">
                    {batchB.healthDescription}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-label-sm text-outline font-semibold block">Remaining Useful Life</span>
                  <div className="font-headline-sm text-base font-bold text-secondary mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">timer</span>
                    <span>{batchB.shelfLifeRemaining}</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant line-clamp-1">
                    {batchB.shelfLifeContext}
                  </span>
                </div>
              </div>

              {/* Sensor & Degradation Telemetry */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                  <span className="text-outline text-[10px] block">Ambient Temp</span>
                  <span className="font-bold text-on-surface mt-0.5 block">{batchB.ambientTransitTemp}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                  <span className="text-outline text-[10px] block">Respiration Rate</span>
                  <span className="font-bold text-secondary mt-0.5 block">{batchB.respirationRate}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                  <span className="text-outline text-[10px] block">Pest &amp; Surface</span>
                  <span className="font-bold text-on-surface mt-0.5 block">{batchB.pestSurfaceScars}</span>
                </div>
              </div>

              {/* Logistics & Route Target */}
              <div className="p-3 rounded-xl bg-secondary-fixed/30 border border-secondary/30 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-secondary">
                    {batchB.routeType}
                  </span>
                  <span className="font-bold text-secondary">{batchB.destinationPriceContext}</span>
                </div>
                <p className="font-bold text-sm text-on-surface">{batchB.destinationName}</p>
                <p className="text-on-surface-variant text-[11px]">
                  Estimated Value: <strong>{batchB.economicPreservedValue}</strong> ({batchB.economicComparison})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {onConfirmMandi && (
                  <button
                    onClick={() => onConfirmMandi(batchB)}
                    className="flex-1 h-9 rounded-lg bg-secondary hover:bg-secondary/90 text-white font-label-sm text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Confirm Route B</span>
                  </button>
                )}
                {onDivertRoute && (
                  <button
                    onClick={() => onDivertRoute(batchB)}
                    className="h-9 px-3 rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-variant text-on-surface font-label-sm text-xs font-bold flex items-center gap-1 transition-colors active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">alt_route</span>
                    <span>Divert</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. COMPARATIVE DECAY TRAJECTORY CHART (RECHARTS)                          */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/50 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">show_chart</span>
                  <h4 className="font-headline-sm text-base font-bold text-on-surface">
                    Comparative Decay Trajectory (0 to 96 Hours)
                  </h4>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Side-by-side projection of biological degradation under open-air ambient transit vs cold preservation
                </p>
              </div>

              {/* Curve Filter Tabs */}
              <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg border border-outline-variant/60">
                <button
                  onClick={() => setActiveCurveView('both')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeCurveView === 'both'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  All 4 Trajectories
                </button>
                <button
                  onClick={() => setActiveCurveView('ambient-only')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeCurveView === 'ambient-only'
                      ? 'bg-surface-container-lowest text-error shadow-xs'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Ambient Only
                </button>
                <button
                  onClick={() => setActiveCurveView('preserved-only')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeCurveView === 'preserved-only'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Preserved Only
                </button>
              </div>
            </div>

            {/* Recharts Chart Container */}
            <div className="h-68 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparativeData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dde2f3" opacity={0.6} />
                  <XAxis
                    dataKey="timeLabel"
                    stroke="#707972"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#c0c9c0' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#707972"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#c0c9c0' }}
                    ticks={[0, 25, 40, 60, 80, 100]}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant shadow-xl text-xs space-y-2 min-w-[240px]">
                          <div className="font-bold text-on-surface border-b border-outline-variant/60 pb-1 flex items-center justify-between">
                            <span>Elapsed Time: {label}</span>
                            <span className="text-[10px] text-outline font-mono">ADDT Simulation</span>
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-primary flex items-center justify-between">
                              <span>Batch A ({batchA.id}):</span>
                              <span>
                                {payload.find((p) => p.dataKey === 'batchA_preserved')?.value ??
                                  payload.find((p) => p.dataKey === 'batchA_ambient')?.value}{' '}
                                pts
                              </span>
                            </div>
                            <div className="text-[11px] text-on-surface-variant flex justify-between pl-2">
                              <span>Preserved: {payload.find((p) => p.dataKey === 'batchA_preserved')?.value}</span>
                              <span className="text-amber-800">
                                Ambient: {payload.find((p) => p.dataKey === 'batchA_ambient')?.value}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1 pt-1 border-t border-outline-variant/40">
                            <div className="font-bold text-secondary flex items-center justify-between">
                              <span>Batch B ({batchB.id}):</span>
                              <span>
                                {payload.find((p) => p.dataKey === 'batchB_preserved')?.value ??
                                  payload.find((p) => p.dataKey === 'batchB_ambient')?.value}{' '}
                                pts
                              </span>
                            </div>
                            <div className="text-[11px] text-on-surface-variant flex justify-between pl-2">
                              <span>Preserved: {payload.find((p) => p.dataKey === 'batchB_preserved')?.value}</span>
                              <span className="text-red-700">
                                Ambient: {payload.find((p) => p.dataKey === 'batchB_ambient')?.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    y={40}
                    stroke="#ba1a1a"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Grade C Spoilage Threshold (40 pts)',
                      fill: '#ba1a1a',
                      fontSize: 10,
                      position: 'insideBottomRight'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => {
                      const labels: Record<string, string> = {
                        batchA_preserved: `${batchA.id} Preserved (Cold)`,
                        batchA_ambient: `${batchA.id} Ambient (Open Air)`,
                        batchB_preserved: `${batchB.id} Preserved (Cold)`,
                        batchB_ambient: `${batchB.id} Ambient (Open Air)`
                      };
                      return <span className="text-xs text-on-surface font-semibold">{labels[value] || value}</span>;
                    }}
                  />

                  {/* Batch A Lines (Green / Emerald) */}
                  {(activeCurveView === 'both' || activeCurveView === 'preserved-only') && (
                    <Line
                      type="monotone"
                      dataKey="batchA_preserved"
                      stroke="#004428"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#004428' }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(activeCurveView === 'both' || activeCurveView === 'ambient-only') && (
                    <Line
                      type="monotone"
                      dataKey="batchA_ambient"
                      stroke="#1f5c3d"
                      strokeWidth={1.8}
                      strokeDasharray="5 5"
                      dot={{ r: 2.5, fill: '#1f5c3d' }}
                    />
                  )}

                  {/* Batch B Lines (Indigo / Red) */}
                  {(activeCurveView === 'both' || activeCurveView === 'preserved-only') && (
                    <Line
                      type="monotone"
                      dataKey="batchB_preserved"
                      stroke="#515a96"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#515a96' }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(activeCurveView === 'both' || activeCurveView === 'ambient-only') && (
                    <Line
                      type="monotone"
                      dataKey="batchB_ambient"
                      stroke="#ba1a1a"
                      strokeWidth={1.8}
                      strokeDasharray="5 5"
                      dot={{ r: 2.5, fill: '#ba1a1a' }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. COMPARATIVE LOGISTICS & AI ARBITRATION MATRIX TABLE                    */}
          {/* ========================================================================= */}
          <div className="rounded-2xl border border-outline-variant overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-surface-container-high/60 border-b border-outline-variant flex items-center justify-between">
              <span className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider">
                Logistics &amp; Biological Differential Matrix
              </span>
              <span className="text-[11px] text-outline font-semibold">Auto-Computed by ADDT Engine</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/60 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Evaluation Metric</th>
                    <th className="py-2.5 px-4 text-primary font-bold">
                      Batch A ({batchA.id} • {batchA.cropName})
                    </th>
                    <th className="py-2.5 px-4 text-secondary font-bold">
                      Batch B ({batchB.id} • {batchB.cropName})
                    </th>
                    <th className="py-2.5 px-4 text-on-surface font-bold">AI Decision Synthesis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  <tr className="hover:bg-surface-container/20">
                    <td className="py-2.5 px-4 font-semibold text-on-surface">Biological Shelf Life</td>
                    <td className="py-2.5 px-4 font-bold text-primary">{batchA.shelfLifeRemaining}</td>
                    <td className="py-2.5 px-4 font-bold text-secondary">{batchB.shelfLifeRemaining}</td>
                    <td className="py-2.5 px-4 text-on-surface-variant font-medium">
                      {healthDelta > 0
                        ? `Batch A has +${healthDelta} pts higher cellular resistance.`
                        : `Batch B has +${Math.abs(healthDelta)} pts higher biological resilience.`}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container/20">
                    <td className="py-2.5 px-4 font-semibold text-on-surface">Ambient Field Heat Exposure</td>
                    <td className="py-2.5 px-4">{batchA.ambientTransitTemp}</td>
                    <td className="py-2.5 px-4">{batchB.ambientTransitTemp}</td>
                    <td className="py-2.5 px-4 text-on-surface-variant font-medium">
                      {batchB.ambientTransitTemp.includes('38') || batchB.ambientTransitTemp.includes('Critical')
                        ? 'Batch B is under extreme thermal distress; require immediate offload.'
                        : 'Both batches within manageable transit temperature corridors.'}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container/20">
                    <td className="py-2.5 px-4 font-semibold text-on-surface">Respiration &amp; Water Loss</td>
                    <td className="py-2.5 px-4 font-mono">{batchA.respirationRate}</td>
                    <td className="py-2.5 px-4 font-mono">{batchB.respirationRate}</td>
                    <td className="py-2.5 px-4 text-on-surface-variant font-medium">
                      Higher respiration accelerates ripening and ethylene secretion.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container/20">
                    <td className="py-2.5 px-4 font-semibold text-on-surface">Target Realization Price</td>
                    <td className="py-2.5 px-4 font-bold text-primary">{batchA.destinationPriceContext}</td>
                    <td className="py-2.5 px-4 font-bold text-secondary">{batchB.destinationPriceContext}</td>
                    <td className="py-2.5 px-4 text-on-surface-variant font-medium">
                      Batch A target: {batchA.destinationName}; Batch B target: {batchB.destinationName}.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container/20">
                    <td className="py-2.5 px-4 font-semibold text-on-surface">Preserved Economic Value</td>
                    <td className="py-2.5 px-4 font-bold text-on-surface">{batchA.economicPreservedValue}</td>
                    <td className="py-2.5 px-4 font-bold text-on-surface">{batchB.economicPreservedValue}</td>
                    <td className="py-2.5 px-4 font-bold text-primary">
                      Combined Portfolio Value: ₹
                      {(
                        parseInt(batchA.economicPreservedValue.replace(/[^0-9]/g, '')) +
                        parseInt(batchB.economicPreservedValue.replace(/[^0-9]/g, ''))
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. MODAL FOOTER ACTIONS                                                   */}
        {/* ========================================================================= */}
        <div className="sticky bottom-0 px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between gap-3 shadow-md">
          <span className="text-xs text-outline font-medium hidden sm:inline">
            Comparative analysis logged under FPO Audit Ledger • Session ID: #CMP-2026-084
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
