import React, { useState } from 'react';
import { HarvestBatch } from '../../types';
import { BatchDecayTrendsChart } from './BatchDecayTrendsChart';

interface LiveHarvestBatchesProps {
  batches: HarvestBatch[];
  selectedBatch: HarvestBatch;
  onSelectBatch: (batch: HarvestBatch) => void;
  onConfirmMandi: (batch: HarvestBatch) => void;
  onDivertRoute: (batch: HarvestBatch) => void;
  onOpenIngestionModal: () => void;
  onOpenCompareModal?: (batchAId?: string, batchBId?: string) => void;
  onExportCSV: () => void;
  onActionClick: (batch: HarvestBatch) => void;
}

export const LiveHarvestBatches: React.FC<LiveHarvestBatchesProps> = ({
  batches,
  selectedBatch,
  onSelectBatch,
  onConfirmMandi,
  onDivertRoute,
  onOpenIngestionModal,
  onOpenCompareModal,
  onExportCSV,
  onActionClick
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedQuality, setSelectedQuality] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rul');
  const [inspectorTab, setInspectorTab] = useState<'all' | 'trends' | 'gis'>('all');

  // Filter batches
  const filteredBatches = batches.filter((b) => {
    if (selectedCrop !== 'All' && !b.cropName.toLowerCase().includes(selectedCrop.toLowerCase())) {
      return false;
    }
    if (selectedQuality !== 'All') {
      if (selectedQuality === 'Grade A' && !b.grade.includes('Grade A')) return false;
      if (selectedQuality === 'Grade B' && b.grade !== 'Grade B') return false;
      if (selectedQuality === 'Grade C' && b.grade !== 'Grade C') return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rul') return a.healthScore - b.healthScore;
    if (sortBy === 'weight') return b.weightKg - a.weightKg;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Top Section: Headline and Action Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm mb-1 font-bold">
            <span className="material-symbols-outlined text-sm">hub</span>
            <span>AI-Driven Agricultural Digital Decay Twin (ADDT) Engine</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight text-2xl lg:text-3xl">
            Live Harvest Batches &amp; Predictive Dispatch
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Continuous shelf-life prediction, quality decay modeling, and dynamic cold chain routing.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportCSV}
            className="h-10 px-4 flex items-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 shadow-xs cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Manifest (CSV)</span>
          </button>
          <button
            onClick={() => {
              setSelectedCrop('All');
              setSelectedQuality('All');
            }}
            className="h-10 px-4 flex items-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 shadow-xs cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            <span>Reset Filters</span>
          </button>
          <button
            onClick={onOpenIngestionModal}
            className="h-10 px-4 flex items-center gap-2 bg-primary-container text-surface-container-lowest rounded-lg font-label-md text-label-md hover:bg-primary transition-all active:scale-95 shadow-sm cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Batch Ingestion Feed</span>
          </button>
          {onOpenCompareModal && (
            <button
              onClick={() => onOpenCompareModal(selectedBatch?.id)}
              className="h-10 px-4 flex items-center gap-2 bg-surface-container-lowest border-2 border-primary-container text-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed/30 transition-all active:scale-95 shadow-xs cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              <span>Compare Batches</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Metrics Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Batches */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant card-elevation-1 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Total Aggregate Volume</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-on-surface">48</span>
              <span className="font-label-md text-label-md text-primary font-bold">Batches Today</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">7,250 kg in active circulation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
          </div>
        </div>

        {/* Metric 2: In Transit */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant card-elevation-1 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Logistics Telemetry</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-secondary">14</span>
              <span className="font-label-md text-label-md text-secondary font-bold">In Transit</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Live GPS connected via FPO trucks</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
        </div>

        {/* Metric 3: Cold Storage Diverted */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant card-elevation-1 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Preservation Chambers</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-primary-container">8</span>
              <span className="font-label-md text-label-md text-primary-container font-bold">Cold Storage</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Slots locked in Sahyadri &amp; Khed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              ac_unit
            </span>
          </div>
        </div>

        {/* Metric 4: High-Decay Expedited */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-error-container card-elevation-1 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-error font-semibold">Biological Critical</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-error">3</span>
              <span className="font-label-md text-label-md text-error font-bold">Expedited</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">&lt; 24h RUL remaining — rerouted</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Filter Toolbar */}
      <section className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider px-2 font-bold">Crops:</span>
          {['All', 'Tomato', 'Onion', 'Green Chilli', 'Potato'].map((crop) => {
            const isSelected = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-surface-container-lowest font-bold shadow-xs'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high border border-outline-variant'
                }`}
              >
                <span>{crop}</span>
                {isSelected && crop !== 'All' && <span className="text-xs opacity-75">✕</span>}
              </button>
            );
          })}

          <div className="h-5 w-px bg-outline-variant mx-1" />

          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider px-2 font-bold">Quality:</span>
          <button
            onClick={() => setSelectedQuality(selectedQuality === 'Grade A' ? 'All' : 'Grade A')}
            className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 cursor-pointer transition-all ${
              selectedQuality === 'Grade A'
                ? 'ring-2 ring-primary bg-primary-fixed text-on-primary-fixed font-bold'
                : 'bg-primary-fixed/60 text-on-primary-fixed font-medium'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            Grade A (Fresh)
          </button>
          <button
            onClick={() => setSelectedQuality(selectedQuality === 'Grade B' ? 'All' : 'Grade B')}
            className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 cursor-pointer transition-all ${
              selectedQuality === 'Grade B'
                ? 'ring-2 ring-tertiary-container bg-tertiary-fixed text-on-tertiary-fixed font-bold'
                : 'bg-tertiary-fixed/60 text-on-tertiary-fixed font-medium'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary-container" />
            Grade B (Act Soon)
          </button>
          <button
            onClick={() => setSelectedQuality(selectedQuality === 'Grade C' ? 'All' : 'Grade C')}
            className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 cursor-pointer transition-all ${
              selectedQuality === 'Grade C'
                ? 'ring-2 ring-error bg-error-container text-on-error-container font-bold'
                : 'bg-error-container/60 text-on-error-container font-medium'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-error" />
            Grade C (Critical Decay)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-sm">sort</span>
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-label-sm text-label-sm text-on-surface font-semibold focus:outline-none border-b border-outline cursor-pointer"
            >
              <option value="rul">Remaining Shelf Life (Lowest first)</option>
              <option value="weight">Batch Weight (Highest first)</option>
            </select>
          </label>
        </div>
      </section>

      {/* Main Layout Grid: Batch Dispatch Board (Left) & ADDT Diagnostic Inspector (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* BATCH MONITORING & ROUTING TABLE (Columns 8 of 12) */}
        <section className="xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">alt_route</span>
              <span>Active Batch Registry &amp; Preservation Dispatches</span>
            </h2>
            <span className="font-label-sm text-label-sm text-outline">
              Showing {filteredBatches.length} batches • Real-time update
            </span>
          </div>

          {filteredBatches.map((batch) => {
            const isSelected = selectedBatch.id === batch.id;
            const isGradeA = batch.grade.includes('Grade A');
            const isGradeB = batch.grade === 'Grade B';
            const isGradeC = batch.grade === 'Grade C';

            const accentColor = isGradeA ? 'bg-primary-container' : isGradeB ? 'bg-tertiary-container' : 'bg-error';
            const ringBorder = isSelected
              ? 'border-2 border-primary-container shadow-md'
              : isGradeC
              ? 'border-2 border-error bg-error-container/10'
              : 'border border-outline-variant';

            return (
              <div
                key={batch.id}
                onClick={() => onSelectBatch(batch)}
                className={`bg-surface-container-lowest rounded-2xl card-elevation-1 p-5 transition-all relative overflow-hidden cursor-pointer hover:border-primary-container ${ringBorder}`}
              >
                {/* Accent line on left */}
                <div className={`absolute top-0 left-0 w-2 h-full ${accentColor}`} />

                {/* Top tier */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-bold tracking-wider font-mono">
                      {batch.id}
                    </span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {batch.cropName} ({batch.variety})
                    </span>

                    {/* Grade Badge */}
                    {isGradeA && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                        {batch.gradeLabel}
                      </span>
                    )}
                    {isGradeB && (
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {batch.gradeLabel}
                      </span>
                    )}
                    {isGradeC && (
                      <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                        {batch.gradeLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">
                      {batch.weightKg.toLocaleString()} kg
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 font-semibold ${
                        isGradeC
                          ? 'bg-error text-on-error animate-pulse font-bold'
                          : batch.statusType === 'confirmed'
                          ? 'bg-surface-container-highest text-on-surface'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {isGradeC ? 'priority_high' : isGradeB ? 'warehouse' : 'local_shipping'}
                      </span>
                      {batch.status}
                    </span>
                  </div>
                </div>

                {/* Middle Tier: Farmer info, Freshness decay gauge, Spoilage Window */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-outline-variant/40 items-center">
                  <div>
                    <span className="font-body-sm text-body-sm text-outline block">Producer &amp; Origin:</span>
                    <span className="font-label-lg text-base font-bold text-on-surface">{batch.producer}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      {batch.origin} ({batch.harvestedTimeAgo})
                    </span>
                  </div>

                  {/* Freshness Gauge Metric */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-surface-variant"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className={isGradeA ? 'text-primary-container' : isGradeB ? 'text-tertiary-container' : 'text-error'}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${batch.healthScore}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.5"
                        />
                      </svg>
                      <span className={`absolute font-headline-sm font-bold text-sm ${isGradeA ? 'text-primary' : isGradeB ? 'text-tertiary' : 'text-error'}`}>
                        {batch.healthScore}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-md text-label-md font-bold text-on-surface block">
                        Health Score: {batch.healthScore}/100
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {batch.healthDescription}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-body-sm text-body-sm text-outline block">Remaining Shelf Life:</span>
                    <span
                      className={`font-headline-sm font-bold text-base flex items-center gap-1 ${
                        isGradeA ? 'text-primary-container' : isGradeB ? 'text-tertiary' : 'text-error'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isGradeC ? 'hourglass_bottom' : isGradeB ? 'warning_amber' : 'timer'}
                      </span>
                      {batch.shelfLifeRemaining}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {batch.shelfLifeContext}
                    </span>
                  </div>
                </div>

                {/* Bottom Tier: AI Recommendation & Smart Logistics Route */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded font-label-sm text-[11px] font-bold uppercase ${
                        isGradeC
                          ? 'bg-error-container text-on-error-container'
                          : isGradeB
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-secondary-fixed/50 text-on-secondary-fixed'
                      }`}
                    >
                      {batch.routeType}
                    </span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      {batch.destinationName}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">
                      {batch.destinationPriceContext}
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onActionClick(batch)}
                      className="h-9 px-3 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-sm">{batch.actionIcon}</span>
                      <span>{batch.actionButtonText}</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectBatch(batch);
                        setInspectorTab('trends');
                      }}
                      className="h-9 px-2.5 rounded-lg bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors cursor-pointer font-semibold border border-primary/20"
                      title="View projected shelf-life degradation curve"
                    >
                      <span className="material-symbols-outlined text-sm">trending_down</span>
                      <span className="hidden sm:inline">Decay Trend</span>
                    </button>
                    {onOpenCompareModal && (
                      <button
                        onClick={() => onOpenCompareModal(batch.id)}
                        className="h-9 px-2.5 rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors cursor-pointer font-semibold active:scale-95"
                        title="Compare with another harvest batch"
                      >
                        <span className="material-symbols-outlined text-sm">compare_arrows</span>
                        <span className="hidden md:inline">Compare</span>
                      </button>
                    )}
                    <button
                      onClick={() => onSelectBatch(batch)}
                      className="h-9 px-3 rounded-lg bg-primary-container text-surface-container-lowest font-label-sm text-label-sm flex items-center gap-1.5 shadow-xs hover:bg-primary transition-all cursor-pointer font-semibold"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>Inspect Twin</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* SIDE DRAWER / INSPECTION PREVIEW: ADDT Decay Twin Diagnostics (Columns 4 of 12) */}
        <aside className="xl:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant card-elevation-1 p-5 space-y-4 sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-container" />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Digital Twin Diagnostics
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
              Active Inspector
            </span>
          </div>

          {/* Quick Sub-Tabs within Inspector */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg text-xs font-label-sm">
            <button
              type="button"
              onClick={() => setInspectorTab('all')}
              className={`flex-1 py-1 px-2 rounded-md font-semibold text-center transition-all cursor-pointer ${
                inspectorTab === 'all'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Signals
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab('trends')}
              className={`flex-1 py-1 px-2 rounded-md font-semibold text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                inspectorTab === 'trends'
                  ? 'bg-primary-container text-surface-container-lowest font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xs">trending_down</span>
              <span>Decay Trends</span>
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab('gis')}
              className={`flex-1 py-1 px-2 rounded-md font-semibold text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                inspectorTab === 'gis'
                  ? 'bg-secondary text-surface-container-lowest font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xs">map</span>
              <span>GIS Route</span>
            </button>
          </div>

          {/* Batch Header & Harvest Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-outline">Selected Batch</span>
                <h3 className="font-headline-md text-xl font-bold text-on-surface font-mono">
                  {selectedBatch.id}
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                {selectedBatch.modelName}
              </span>
            </div>

            {/* Crop Harvest Image with Strict Data-Alt & Fallback Container */}
            <div className="relative rounded-xl overflow-hidden border border-outline-variant aspect-video bg-surface-container-low">
              <img
                src={selectedBatch.imageUrl}
                alt={selectedBatch.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-inverse-surface/80 backdrop-blur-xs text-inverse-on-surface font-label-sm text-label-sm flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-xs text-primary-fixed">verified</span>
                <span>AI Confidence: {selectedBatch.aiConfidence}%</span>
              </div>
            </div>
          </div>

          {/* RECHARTS: Batch Decay Trends Chart Component */}
          {(inspectorTab === 'all' || inspectorTab === 'trends') && (
            <BatchDecayTrendsChart batch={selectedBatch} />
          )}

          {/* AI Biological Degradation Modeling Breakdown */}
          {(inspectorTab === 'all' || inspectorTab === 'trends') && (
            <div className="bg-surface-container-low rounded-xl p-4 space-y-3 border border-outline-variant/60">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold block">
                ADDT Spoilage Prediction Factors
              </span>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-body-sm font-body-sm mb-1">
                    <span className="text-on-surface">Pest &amp; Surface Scars</span>
                    <span className="font-bold text-primary">{selectedBatch.pestSurfaceScars}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
                      style={{ width: `${selectedBatch.pestPercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-body-sm font-body-sm mb-1">
                    <span className="text-on-surface">Firmness &amp; Respiration Rate</span>
                    <span className="font-bold text-primary">{selectedBatch.respirationRate}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
                      style={{ width: `${selectedBatch.respirationPercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-body-sm font-body-sm mb-1">
                    <span className="text-on-surface">Ambient Transit Temp (Open-Air)</span>
                    <span className="font-bold text-tertiary">{selectedBatch.ambientTransitTemp}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tertiary-container rounded-full transition-all duration-500"
                      style={{ width: `${selectedBatch.tempPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Geographic GIS Telemetry / Open-Meteo Risk Map Preview */}
          {(inspectorTab === 'all' || inspectorTab === 'gis') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline font-bold">GIS &amp; Dynamic Weather Corridor</span>
                <span className="text-xs font-semibold text-primary">{selectedBatch.routeId}</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-outline-variant aspect-[2/1] bg-surface-container">
                <img
                  src={selectedBatch.mapImageUrl}
                  alt="Logistics satellite route corridor map"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-transparent to-transparent flex items-end p-3">
                  <div className="text-inverse-on-surface text-body-sm font-body-sm flex items-center justify-between w-full">
                    <span>Transit ETA: {selectedBatch.transitEta}</span>
                    <span className="font-bold text-primary-fixed flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
                      GPS Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Value Preservation Decision CTA Card */}
          <div className="p-4 rounded-xl bg-primary-fixed/20 border border-primary-container space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold font-label-md text-label-md">
              <span className="material-symbols-outlined text-base">savings</span>
              <span>Preserved Economic Value</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              By routing to <strong>{selectedBatch.destinationName}</strong> within the next 4 hours, estimated farmer realization is{' '}
              <strong className="text-primary font-bold">{selectedBatch.economicPreservedValue}</strong> ({selectedBatch.economicComparison}).
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onConfirmMandi(selectedBatch)}
                className="h-10 px-3 bg-primary-container text-surface-container-lowest rounded-lg font-label-md text-label-md hover:bg-primary transition-all flex items-center justify-center gap-1 cursor-pointer font-bold active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Confirm Mandi</span>
              </button>
              <button
                onClick={() => onDivertRoute(selectedBatch)}
                className="h-10 px-3 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-1 cursor-pointer font-semibold active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                <span>Divert Route</span>
              </button>
            </div>
            {onOpenCompareModal && (
              <button
                onClick={() => onOpenCompareModal(selectedBatch.id)}
                className="w-full h-9 mt-1 px-3 bg-surface-container-lowest hover:bg-surface-container border border-primary/30 text-primary rounded-lg font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                <span>Compare {selectedBatch.id} with Another Batch</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
