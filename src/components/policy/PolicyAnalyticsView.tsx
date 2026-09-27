import React, { useState } from 'react';
import { ADVISORY_FEED } from '../../data/mockData';
import { AdvisoryBroadcast } from '../../types';

interface PolicyAnalyticsViewProps {
  onExportCarbonAudit: () => void;
  onDownloadPolicyReport: () => void;
  onDraftStateBroadcast: () => void;
}

export const PolicyAnalyticsView: React.FC<PolicyAnalyticsViewProps> = ({
  onExportCarbonAudit,
  onDownloadPolicyReport,
  onDraftStateBroadcast
}) => {
  const [advisories, setAdvisories] = useState<AdvisoryBroadcast[]>(ADVISORY_FEED);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-xs sm:text-sm">
          <span className="hover:text-primary cursor-pointer font-medium">CropShield 360</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer font-medium">Executive Governance</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-bold">State Policy Telemetry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface font-label-sm text-xs border border-outline-variant/60 font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            SIH 2026 Grand Finale Release
          </span>
          <span className="text-outline text-xs">Cluster: Pune-Nashik Belt</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-xs uppercase tracking-wider font-extrabold">
              Slide 4 &amp; Slide 3 Direct Model
            </span>
            <span className="text-outline text-xs">|</span>
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">
              Real-Time Spoilage Suppression Matrix
            </span>
          </div>
          <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            State Agro-Impact &amp; Sustainability Telemetry (SIH 2026)
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant max-w-3xl">
            Macroeconomic value preservation, food loss reduction, and national rollout trajectory across Maharashtra agricultural clusters. Continuous edge-IoT validation informing district procurement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onExportCarbonAudit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-variant text-on-secondary-container font-label-md text-xs sm:text-sm font-bold transition-all border border-outline-variant/60 active:scale-95 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">eco</span>
            <span>Export Carbon Audit</span>
          </button>
          <button
            onClick={onDownloadPolicyReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            <span>Download Full Policy Report (PDF)</span>
          </button>
        </div>
      </section>

      {/* Section 2: Five Core Impact Pillars Grid (Slide 4 Mandate) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">token</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
              Five Core Impact Pillars (Slide 4 Mandate)
            </h3>
          </div>
          <span className="font-label-sm text-xs text-outline font-medium">
            Real-time harvest cycle analytics 2025–2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Pillar 1: Economic */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary-container/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#1F5C3D] font-label-sm text-xs font-bold">
                  Economic
                </span>
                <span className="material-symbols-outlined text-[#1F5C3D] text-[20px]">currency_rupee</span>
              </div>
              <p className="font-headline-md text-xl font-extrabold text-on-surface">
                +₹12.40<span className="font-body-sm text-xs text-outline font-normal">/kg avg uplift</span>
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Reduces post-harvest distress sales by ₹12.40/kg average uplift, saving <strong className="text-on-surface">₹48.2L</strong> this harvest cycle.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-primary font-label-sm font-bold">
              <span>+38.2% Farmer Margin</span>
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
            </div>
          </div>

          {/* Pillar 2: Social */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary-container/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold">
                  Social
                </span>
                <span className="material-symbols-outlined text-secondary text-[20px]">diversity_3</span>
              </div>
              <p className="font-headline-md text-xl font-extrabold text-on-surface">
                1,420+ <span className="font-body-sm text-xs text-outline font-normal">Producers</span>
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Empowers 1,420+ smallholder farmers with AI decay transparency &amp; direct fair-market bargaining power.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-secondary font-label-sm font-bold">
              <span>91% Cooperative Trust</span>
              <span className="material-symbols-outlined text-[16px]">handshake</span>
            </div>
          </div>

          {/* Pillar 3: Environmental */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary-container/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-bold">
                  Environmental
                </span>
                <span className="material-symbols-outlined text-primary text-[20px]">nest_eco_leaf</span>
              </div>
              <p className="font-headline-md text-xl font-extrabold text-on-surface">
                -40% <span className="font-body-sm text-xs text-outline font-normal">CO2e Emissions</span>
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Net emissions cut and <strong>240+ tonnes</strong> of methane-emitting biological dump safely prevented.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-primary font-label-sm font-bold">
              <span>240t Biomass Salvaged</span>
              <span className="material-symbols-outlined text-[16px]">recycling</span>
            </div>
          </div>

          {/* Pillar 4: Operational */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary-container/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-secondary-container font-label-sm text-xs font-bold">
                  Operational
                </span>
                <span className="material-symbols-outlined text-secondary text-[20px]">local_shipping</span>
              </div>
              <p className="font-headline-md text-xl font-extrabold text-on-surface">
                1.8 Days <span className="font-body-sm text-xs text-outline font-normal">Cycle</span>
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Dynamic routing optimizes cold chain turnaround from 5.0 days down to 1.8 days with <strong>88% bay fill</strong>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-secondary-container font-label-sm font-bold">
              <span>-64% In-Transit Loss</span>
              <span className="material-symbols-outlined text-[16px]">speed</span>
            </div>
          </div>

          {/* Pillar 5: Technological */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary-container/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-xs font-bold">
                  Technological
                </span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">memory</span>
              </div>
              <p className="font-headline-md text-xl font-extrabold text-on-surface">
                YOLOv8 <span className="font-body-sm text-xs text-outline font-normal">+ XGB</span>
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Edge-AI on-device decay twin running local RUL models without cloud latency or continuous bandwidth.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-tertiary font-label-sm font-bold">
              <span>100% Offline Capable</span>
              <span className="material-symbols-outlined text-[16px]">wifi_off</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Quantitative Governance Framework (Slide 4 Outcomes) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">grid_view</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
              Quantitative Governance Framework (Slide 4 Outcomes)
            </h3>
          </div>
          <span className="font-label-sm text-xs text-outline font-medium">
            Empirical benchmarks vs. baseline conventional practices
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tile 1: Higher Farmer Income */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] text-[#1F5C3D] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-extrabold">
                +40% NET PROFIT
              </span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">Higher Farmer Income</h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              40% increase in net farmer profit margin (<strong className="text-primary font-bold">₹32.40/kg</strong> achieved vs{' '}
              <span className="line-through text-outline">₹20.00/kg</span> baseline harvest distress dumping).
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '82%' }} />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-label-sm text-outline">
              <span>Pre-Shield: ₹20/kg</span>
              <span className="text-primary font-bold">CropShield Target: ₹32.40/kg</span>
            </div>
          </div>

          {/* Tile 2: Efficient Supply Chain */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-surface-container text-on-secondary-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">timer</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-extrabold">
                50% FASTER DISPATCH
              </span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">Efficient Supply Chain</h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              50% faster turnaround to terminal Mandi corridors. Elimination of 3 intermediary sorting checkpoints across Pune agro-clusters.
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '75%' }} />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-label-sm text-outline">
              <span>Conventional: 5.2 days</span>
              <span className="text-secondary font-bold">Telemetry Path: 1.8 days</span>
            </div>
          </div>

          {/* Tile 3: Optimal Storage Utilization */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-[#E3E8F9] text-secondary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">ac_unit</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-container font-label-sm text-xs font-extrabold">
                85% BAY OCCUPANCY
              </span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">Optimal Storage Utilization</h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              85% cold storage slot occupancy via predictive diversion vs. 42% conventional underutilization in Junnar &amp; Khed cold chains.
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-label-sm text-outline">
              <span>District Avg: 42%</span>
              <span className="text-secondary font-bold">Target Peak: 85% Active</span>
            </div>
          </div>

          {/* Tile 4: Environmental Sustainability */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">compost</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-xs font-extrabold">
                -60% DUMP LOSS
              </span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">Environmental Sustainability</h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              60% reduction in farm-gate bio dump and methane release. Salvages Grade B crops toward localized puree and solar dehydration mills.
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '90%' }} />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-label-sm text-outline">
              <span>Baseline: 38% Spoilage</span>
              <span className="text-primary font-bold">Suppressed: 9.8% Waste</span>
            </div>
          </div>

          {/* Tile 5: Market Accessibility */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">store</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-sm text-xs font-extrabold">
                22 BIDDING HUBS
              </span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">Market Accessibility</h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              14 registered Mandis and 8 processing units directly placing verifiable bids against calibrated YOLOv8 decay certificates.
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '68%' }} />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-label-sm text-outline">
              <span>Regional: 6 Mandis</span>
              <span className="text-tertiary font-bold">Expanded: 14 Mandis + 8 Plants</span>
            </div>
          </div>

          {/* Tile 6: Data-Driven Governance */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">policy</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface font-label-sm text-xs font-extrabold">
                MSP TRIGGER ACTIVE
              </span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">Data-Driven Governance</h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              Real-time district-level spoilage heatmaps informing state procurement interventions, buffer allocation, and Nafed market stabilization.
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '95%' }} />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-label-sm text-outline">
              <span>State Audit Speed: 24h</span>
              <span className="text-primary font-bold">100% Granular Heatmap</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 5-Stage Scaling Roadmap & Adoption Milestones (Slide 3) */}
      <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-outline-variant/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">timeline</span>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                5-Stage National Scaling Roadmap &amp; Commercial Viability (Slide 3)
              </h3>
            </div>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Phased transition from pilot clusters into Central e-NAM Integration and Nationwide Cold Chain Grid.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold self-start md:self-auto">
            Current Position: Stage 2 (FPO Network Expansion)
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {/* Stage 1: Completed */}
          <div className="flex flex-col bg-surface p-4 rounded-xl border border-outline-variant/60 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                <span className="material-symbols-outlined text-[16px]">done</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#1F5C3D]">
                100% COMPLETED
              </span>
            </div>
            <h5 className="font-label-lg text-sm font-bold text-on-surface">Stage 1: Pilot Village</h5>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Khed &amp; Junnar clusters validated with offline edge scanners.
            </p>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Farmers:</span>
                <span className="font-bold text-on-surface">500+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">FPOs:</span>
                <span className="font-bold text-on-surface">2 Pilot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Tons Saved:</span>
                <span className="font-bold text-primary">120 T</span>
              </div>
            </div>
          </div>

          {/* Stage 2: Active */}
          <div className="flex flex-col bg-surface-container-low p-4 rounded-xl border-2 border-primary-container shadow-xs ring-2 ring-primary-container/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs animate-pulse">
                2
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                ACTIVE STAGE
              </span>
            </div>
            <h5 className="font-label-lg text-sm font-bold text-primary">Stage 2: FPO Network</h5>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              8 FPOs onboarded across the Pune-Nashik horticultural belt.
            </p>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Farmers:</span>
                <span className="font-bold text-on-surface">1,420 Enrolled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">FPOs:</span>
                <span className="font-bold text-on-surface">8 Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Tons Saved:</span>
                <span className="font-bold text-primary">380 Tonnes</span>
              </div>
            </div>
          </div>

          {/* Stage 3: Upcoming */}
          <div className="flex flex-col bg-surface p-4 rounded-xl border border-outline-variant/60 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-secondary-container flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">
                TARGET Q1 2027
              </span>
            </div>
            <h5 className="font-label-lg text-sm font-bold text-on-surface">Stage 3: District Level</h5>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Inter-district cold chain aggregation across 4 Maharashtra hubs.
            </p>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Farmers:</span>
                <span className="font-bold text-on-surface">15,000 Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">FPOs:</span>
                <span className="font-bold text-on-surface">45 FPOs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Tons Saved:</span>
                <span className="font-bold text-on-surface-variant">2,400 T (Proj.)</span>
              </div>
            </div>
          </div>

          {/* Stage 4: State Scale */}
          <div className="flex flex-col bg-surface p-4 rounded-xl border border-outline-variant/60 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-secondary-container flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">
                ROADMAP 2027
              </span>
            </div>
            <h5 className="font-label-lg text-sm font-bold text-on-surface">Stage 4: State Scale</h5>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Integration with MahaAgri &amp; Maharashtra Agro-Marketing Board.
            </p>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Farmers:</span>
                <span className="font-bold text-on-surface">75,000 Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">FPOs:</span>
                <span className="font-bold text-on-surface">180 Fed.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Tons Saved:</span>
                <span className="font-bold text-on-surface-variant">12,000 T (Proj.)</span>
              </div>
            </div>
          </div>

          {/* Stage 5: National Rollout */}
          <div className="flex flex-col bg-surface p-4 rounded-xl border border-outline-variant/60 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-secondary-container flex items-center justify-center font-bold text-xs">
                5
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">
                NATIONAL 2028
              </span>
            </div>
            <h5 className="font-label-lg text-sm font-bold text-on-surface">Stage 5: National Rollout</h5>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Pan-India e-NAM bridge &amp; central sovereign cold-chain grid.
            </p>
            <div className="mt-4 pt-3 border-t border-outline-variant/30 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Farmers:</span>
                <span className="font-bold text-on-surface">500,000+ Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">FPOs:</span>
                <span className="font-bold text-on-surface">1,000+ Fed.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Tons Saved:</span>
                <span className="font-bold text-on-surface-variant">95,000 T (Proj.)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Real-World District Live Map & Advisory Emergency Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spoilage Threat Heatmap & Cluster Telemetry */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">map</span>
              <h4 className="font-headline-sm text-base font-bold text-on-surface">
                Maharashtra Cluster Spoilage Heatmap (Active Telemetry)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#E8F5E9] text-[#1F5C3D] font-label-sm text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> Live Sensors
              </span>
            </div>
          </div>

          {/* District Map Visual Canvas */}
          <div className="relative w-full rounded-xl bg-surface-container-low border border-outline-variant overflow-hidden flex flex-col justify-between p-4 min-h-[17rem]">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#1f5c3d_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="flex items-center justify-between z-10 flex-wrap gap-2">
              <div className="bg-surface-container-lowest/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-outline-variant/60 shadow-2xs">
                <p className="font-label-sm text-[11px] text-outline font-semibold">Target Zone Focus</p>
                <p className="font-headline-sm text-sm font-bold text-on-surface">Western Ghats Agro-Belt</p>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-lowest/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-outline-variant/60 text-xs">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1F5C3D]" /> Safe (&gt;72h RUL)
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2A93B]" /> Moderate (24-48h)
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B]" /> Urgent (&lt;24h)
                </span>
              </div>
            </div>

            {/* Spatial Pin Nodes overlayed */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-error shadow-2xs flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs font-bold text-on-surface">Junnar Sub-Cluster</span>
                  <span className="text-error font-bold text-xs">Critical</span>
                </div>
                <p className="font-body-sm text-[11px] text-outline mt-0.5">Tomato Decay Spike</p>
                <p className="font-label-sm text-xs text-error mt-2 font-bold">14.2h Remaining RUL</p>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-[#1F5C3D] shadow-2xs flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs font-bold text-on-surface">Khed Valley FPO</span>
                  <span className="text-[#1F5C3D] font-bold text-xs">Grade A</span>
                </div>
                <p className="font-body-sm text-[11px] text-outline mt-0.5">Onion Cold Vault</p>
                <p className="font-label-sm text-xs text-[#1F5C3D] mt-2 font-bold">118h Cold Bay Reserve</p>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-[#F2A93B] shadow-2xs flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs font-bold text-on-surface">Nashik Transit Bay</span>
                  <span className="text-tertiary-container font-bold text-xs">Diverting</span>
                </div>
                <p className="font-body-sm text-[11px] text-outline mt-0.5">Table Grape Re-routing</p>
                <p className="font-label-sm text-xs text-tertiary-container mt-2 font-bold">Vashi Mandi Express</p>
              </div>
            </div>

            <div className="z-10 flex items-center justify-between text-xs text-on-surface-variant font-label-sm bg-surface-container-lowest/80 px-2.5 py-1 rounded">
              <span>Telemetry Node: Maha-Edge-8419</span>
              <span>Updated automatically via offline batch synchronization</span>
            </div>
          </div>

          {/* Bottom Micro-Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-surface border border-outline-variant/60">
              <span className="font-label-sm text-xs text-outline font-semibold">Distress Diversion Rate</span>
              <p className="font-headline-sm text-xl font-bold text-primary mt-1">94.8%</p>
              <p className="text-xs text-on-surface-variant">Prevented farm distress sales</p>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-outline-variant/60">
              <span className="font-label-sm text-xs text-outline font-semibold">Processing Unit Ingestion</span>
              <p className="font-headline-sm text-xl font-bold text-secondary mt-1">42.5 Tonnes</p>
              <p className="text-xs text-on-surface-variant">Diverted directly to food pulping</p>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-outline-variant/60">
              <span className="font-label-sm text-xs text-outline font-semibold">Govt Buffer Stocking</span>
              <p className="font-headline-sm text-xl font-bold text-on-surface mt-1">1,820 Crates</p>
              <p className="text-xs text-on-surface-variant">Secured under MSP guarantee</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Advisory & Emergency Intervention Dispatcher */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error">broadcast_on_personal</span>
                <h4 className="font-headline-sm text-base font-bold text-on-surface">
                  Emergency Advisory Dispatcher
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-xs font-extrabold">
                LIVE
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant">
              High-priority broadcast push sent directly to registered farmers via offline P2P mesh and SMS carrier fallback.
            </p>

            {/* Dispatch Feed */}
            <div className="space-y-3">
              {advisories.map((adv) => (
                <div
                  key={adv.id}
                  className={`p-3 rounded-lg border flex flex-col gap-1 ${
                    adv.isCritical
                      ? 'bg-error-container/30 border-error/20'
                      : 'bg-[#E8F5E9] border-[#C8E6C9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-label-sm text-xs font-bold flex items-center gap-1 ${
                        adv.isCritical ? 'text-error' : 'text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {adv.isCritical ? 'fmd_bad' : 'trending_up'}
                      </span>
                      {adv.type}
                    </span>
                    <span className="text-[11px] text-outline font-label-sm">{adv.timeAgo}</span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface font-medium leading-relaxed">{adv.message}</p>
                  <div className="flex items-center justify-between pt-2 text-[11px] font-label-sm text-outline border-t border-outline-variant/30 mt-1">
                    <span>Reach: <strong>{adv.reach}</strong></span>
                    <span className="text-primary font-bold">{adv.deliveredChannel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Area */}
          <div className="pt-4 border-t border-outline-variant/40 space-y-2">
            <button
              onClick={onDraftStateBroadcast}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-inverse-surface hover:brightness-125 text-inverse-on-surface font-label-md text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Draft New State Advisory Broadcast</span>
            </button>
            <p className="text-center font-label-sm text-[11px] text-outline">
              Integrates directly with MahaAgri SMS Gateway &amp; Kisan Call Center
            </p>
          </div>
        </div>
      </div>

      {/* Footer Identity Bar */}
      <footer className="mt-8 px-6 py-4 bg-surface-container-lowest border-t border-outline-variant text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-2 text-outline font-body-sm text-xs">
        <div>
          <span>CropShield 360 © 2026</span> • <span>Smart India Hackathon (SIH 2026) Project Presentation</span> • <span>Theme: Smart Agriculture</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-label-sm">
          <span className="hover:text-primary cursor-pointer">Data Security Protocol</span>
          <span className="hover:text-primary cursor-pointer">State Agri Compliance</span>
          <span className="hover:text-primary cursor-pointer">ISO 22000 Food Traceability</span>
        </div>
      </footer>
    </div>
  );
};
