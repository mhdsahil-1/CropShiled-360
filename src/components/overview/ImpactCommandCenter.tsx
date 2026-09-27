import React from 'react';

interface ImpactCommandCenterProps {
  onViewAllBatches: () => void;
  onDispatchMandiTruck: () => void;
  onReallocateBays: () => void;
  onConfirmHandoff: () => void;
  onExportReport: () => void;
}

export const ImpactCommandCenter: React.FC<ImpactCommandCenterProps> = ({
  onViewAllBatches,
  onDispatchMandiTruck,
  onReallocateBays,
  onConfirmHandoff,
  onExportReport
}) => {
  return (
    <div className="space-y-6">
      {/* PAGE TITLE & CONTROL BAR */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              Regional Operations &amp; Impact Command Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
              SIH 2026 LIVE
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Real-time biological decay tracking, predictive loss reduction, and multimodal cold-chain dispatch intelligence.
          </p>
        </div>

        {/* Filter & Date Controls */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface shadow-xs font-semibold">
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
            <span>Oct 2026 - Real-time</span>
          </div>
          <button
            onClick={onExportReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant rounded-lg font-label-md text-label-md shadow-xs transition-colors cursor-pointer font-bold active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </section>

      {/* KPI METRIC ROW (4 CARDS) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Post-Harvest Loss % */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Post-Harvest Loss %</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">trending_down</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-bold text-on-surface">12.4%</span>
            <span className="inline-flex items-center font-label-sm text-label-sm text-primary font-bold">
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span> -17.6%
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1">vs 30.0% conventional baseline</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-fixed/30 text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[14px]">savings</span>
            <span>Saved ₹48.2L this month</span>
          </div>
        </div>

        {/* Card 2: Avg. Time to Market */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Avg. Time to Market</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-bold text-on-surface">1.8 Days</span>
            <span className="inline-flex items-center font-label-sm text-label-sm text-primary font-bold">
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span> -3.2 Days
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1">Conventional transit: 5 days</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>50% Faster turnaround</span>
          </div>
        </div>

        {/* Card 3: Farmer Net Realization */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Farmer Net Realization</span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-bold text-on-surface">
              ₹32.40<span className="text-sm font-normal text-on-surface-variant">/kg</span>
            </span>
            <span className="inline-flex items-center font-label-sm text-label-sm text-primary font-bold">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> +62%
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1">vs ₹20 baseline distress sale</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary-fixed/60 text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[14px]">payments</span>
            <span>+₹12.40 / kg value uplift</span>
          </div>
        </div>

        {/* Card 4: Carbon Emissions Offset */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Carbon Emissions Offset</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[20px]">eco</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-bold text-on-surface">142 MT</span>
            <span className="inline-flex items-center font-label-sm text-label-sm text-primary font-bold">
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span> -40%
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1">Green logistics &amp; reduced decay dump</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            <span>Optimized cluster routing</span>
          </div>
        </div>
      </section>

      {/* MAIN DATA VISUALIZATION BENTO GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1 & 2: IMPACT COMPARISON PANEL */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant pb-4">
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Impact Comparison: Conventional vs. CropShield 360
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Quantified multi-stakeholder improvements verified across 18 district mandis.
                </p>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 text-label-sm font-label-sm shrink-0">
                <span className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                  <span className="w-3 h-3 rounded-xs bg-outline-variant" />
                  Current System
                </span>
                <span className="flex items-center gap-1.5 text-primary font-bold">
                  <span className="w-3 h-3 rounded-xs bg-primary-container" />
                  With CropShield 360
                </span>
              </div>
            </div>

            {/* Comparison Bar Rows */}
            <div className="space-y-5 mt-6">
              {/* Metric 1: Post-Harvest Losses */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-[11px]">
                      PH
                    </span>
                    <span className="text-on-surface font-semibold">Post-Harvest Losses</span>
                  </div>
                  <div className="flex gap-4 text-body-sm">
                    <span className="text-outline">Conv: 30%</span>
                    <span className="text-primary font-bold">CropShield: 12% (-60% loss cut)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-outline-variant h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>

              {/* Metric 2: Time to Market */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-[11px]">
                      TM
                    </span>
                    <span className="text-on-surface font-semibold">Time to Market</span>
                  </div>
                  <div className="flex gap-4 text-body-sm">
                    <span className="text-outline">Conv: 5 days</span>
                    <span className="text-primary font-bold">CropShield: 2 days (60% faster)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-outline-variant h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              {/* Metric 3: Transportation Cost */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-[11px]">
                      TC
                    </span>
                    <span className="text-on-surface font-semibold">Transportation Cost</span>
                  </div>
                  <div className="flex gap-4 text-body-sm">
                    <span className="text-outline">Conv: ₹12/kg</span>
                    <span className="text-primary font-bold">CropShield: ₹8/kg (-33%)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-outline-variant h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>

              {/* Metric 4: Carbon Emissions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-[10px]">
                      CO2
                    </span>
                    <span className="text-on-surface font-semibold">Carbon Emissions</span>
                  </div>
                  <div className="flex gap-4 text-body-sm">
                    <span className="text-outline">Conv: 100% Index</span>
                    <span className="text-primary font-bold">CropShield: 60% Index (-40% CO₂)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-outline-variant h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

              {/* Metric 5: Farmer Income */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[11px]">
                      FI
                    </span>
                    <span className="text-on-surface font-semibold">Farmer Net Income</span>
                  </div>
                  <div className="flex gap-4 text-body-sm">
                    <span className="text-outline">Conv: ₹20/kg</span>
                    <span className="text-primary font-bold">CropShield: ₹32/kg (+60% Profit)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-outline-variant h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Real-world Impact Badges */}
          <div className="mt-6 pt-4 border-t border-outline-variant grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-surface flex items-center gap-2 border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[20px]">attach_money</span>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface font-bold">Higher Realization</p>
                <p className="font-body-sm text-body-sm text-outline leading-tight">Better pricing power</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface flex items-center gap-2 border border-outline-variant">
              <span className="material-symbols-outlined text-secondary text-[20px]">route</span>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface font-bold">Dynamic Routing</p>
                <p className="font-body-sm text-body-sm text-outline leading-tight">Mandi vs cold facility</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface flex items-center gap-2 border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary text-[20px]">eco</span>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface font-bold">Zero-Waste AI</p>
                <p className="font-body-sm text-body-sm text-outline leading-tight">Processing diversion</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: SIDEBAR WIDGETS (HEALTH SCORE & DECAY TREND) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Regional Freshness Health Score */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-lg font-bold text-on-surface">Regional Freshness Index</h4>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                Optimal
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="84, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display-lg text-3xl font-bold text-on-surface">84</span>
                  <span className="font-label-sm text-label-sm text-outline">/ 100 Safe</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant space-y-2">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant font-medium">Active ADDT Decay Twins</span>
                <span className="font-bold text-on-surface">1,420 Batches</span>
              </div>
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant font-medium">Avg Spoilage Prediction Confidence</span>
                <span className="font-bold text-primary">94.8%</span>
              </div>
            </div>
          </div>

          {/* Spoilage Loss Reduction Trend Chart */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-headline-sm text-lg font-bold text-on-surface">Loss Curve (6 Mo)</h4>
                <p className="font-body-sm text-body-sm text-outline">Post-Harvest decline trajectory</p>
              </div>
              <span className="material-symbols-outlined text-primary">auto_graph</span>
            </div>
            {/* SVG Sparkline Area Chart */}
            <div className="relative w-full h-28 my-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 200 80">
                <defs>
                  <linearGradient id="gradLoss" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#1f5c3d" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1f5c3d" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon fill="url(#gradLoss)" points="0,15 40,25 80,38 120,52 160,65 200,72 200,80 0,80" />
                <polyline
                  fill="none"
                  points="0,15 40,25 80,38 120,52 160,65 200,72"
                  stroke="#004428"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <circle cx="200" cy="72" fill="#004428" r="4" />
              </svg>
            </div>
            <div className="flex justify-between text-body-sm font-label-sm text-outline pt-2 border-t border-outline-variant">
              <span>May (29.2%)</span>
              <span>Jul (22.0%)</span>
              <span className="text-primary font-bold">Oct (12.4%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION: URGENT ROUTING DISPATCHES & COLD CHAIN ALERTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Urgent Routing Dispatches &amp; Cold Chain Alerts
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
              3 Action Required
            </span>
          </div>
          <button
            onClick={onViewAllBatches}
            className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Active Batches</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Alert Card 1: Emergency Mandi Dispatch */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-error border border-outline-variant shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                  Grade C • Rapid Decay
                </span>
                <span className="font-body-sm text-body-sm text-outline font-mono">Batch #CS-TOM-0824</span>
              </div>
              <h5 className="font-headline-sm text-lg font-bold text-on-surface mt-3">Hybrid Tomato (Nashik FPO)</h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Remaining Useful Life: <strong className="text-error font-bold">18 Hours</strong> remaining before skin softness breakdown.
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-surface text-body-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-outline">Recommended Route:</span>
                  <span className="font-bold text-on-surface">Vashi Wholesale Mandi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Target Realization:</span>
                  <span className="font-bold text-primary">₹26.50/kg</span>
                </div>
              </div>
            </div>
            <button
              onClick={onDispatchMandiTruck}
              className="mt-4 w-full py-2.5 px-4 bg-error text-on-error font-label-md text-label-md rounded-lg hover:brightness-110 transition-colors active:scale-95 shadow-xs flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Dispatch Mandi Truck</span>
            </button>
          </div>

          {/* Alert Card 2: Cold Storage Allocation */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-secondary border border-outline-variant shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  Capacity Alert
                </span>
                <span className="font-body-sm text-body-sm text-outline font-mono">Hub #CS-MH-04</span>
              </div>
              <h5 className="font-headline-sm text-lg font-bold text-on-surface mt-3">Kisan Cold Chamber (Nashik)</h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Onion &amp; Pomegranate chamber at <strong>88% capacity</strong>. 12 tonnes slot reserved until 6:00 PM.
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-surface text-body-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-outline">Temperature:</span>
                  <span className="font-bold text-on-surface">4.2°C (Optimal)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Incoming Fleet:</span>
                  <span className="font-bold text-secondary">2 Reefers in transit</span>
                </div>
              </div>
            </div>
            <button
              onClick={onReallocateBays}
              className="mt-4 w-full py-2.5 px-4 bg-secondary text-on-secondary font-label-md text-label-md rounded-lg hover:brightness-110 transition-colors active:scale-95 shadow-xs flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Reallocate Storage Bays</span>
            </button>
          </div>

          {/* Alert Card 3: Processing Unit Intake */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-primary-container border border-outline-variant shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                  Grade B • Direct Offtake
                </span>
                <span className="font-body-sm text-body-sm text-outline font-mono">Intake #PU-PULP-12</span>
              </div>
              <h5 className="font-headline-sm text-lg font-bold text-on-surface mt-3">AgroPure Tomato Puree Plant</h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Open purchasing window for 20 tonnes ripened batch at guaranteed procurement floor.
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-surface text-body-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-outline">Purchase Price:</span>
                  <span className="font-bold text-primary">₹22.00/kg (Fixed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Turnaround Time:</span>
                  <span className="font-bold text-on-surface">Under 4 Hours</span>
                </div>
              </div>
            </div>
            <button
              onClick={onConfirmHandoff}
              className="mt-4 w-full py-2.5 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-colors active:scale-95 shadow-xs flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">factory</span>
              <span>Confirm Processing Handoff</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
