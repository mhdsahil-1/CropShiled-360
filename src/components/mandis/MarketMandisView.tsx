import React, { useState } from 'react';
import { COMMODITY_RATES, PROCESSING_CONTRACTS, DISPATCH_LEDGER } from '../../data/mockData';
import { ProcessingContract } from '../../types';

interface MarketMandisViewProps {
  onRouteInTransit: () => void;
  onLockContract: (contract: ProcessingContract) => void;
  onBroadcastAdvisory: (payload: { cluster: string; commodity: string; category: string; message: string }) => void;
  onPostPurchaseContract: () => void;
  onExportLedger: () => void;
}

export const MarketMandisView: React.FC<MarketMandisViewProps> = ({
  onRouteInTransit,
  onLockContract,
  onBroadcastAdvisory,
  onPostPurchaseContract,
  onExportLedger
}) => {
  const [contractFilter, setContractFilter] = useState<'all' | 'grade-b' | 'grade-c'>('all');
  const [selectedCluster, setSelectedCluster] = useState('Pune-Nashik Corridor / Junnar Cluster');
  const [selectedCommodity, setSelectedCommodity] = useState('Hybrid Tomato (Solanum lycopersicum)');
  const [advisoryCategory, setAdvisoryCategory] = useState<'price' | 'weather' | 'pest'>('price');
  const [advisoryText, setAdvisoryText] = useState(
    'Vashi Mandi rate reached ₹34/kg. Farmers with Grade A harvest batches advised to dispatch before 4 PM.'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Marathi translation approximation
  const marathiTranslation =
    advisoryCategory === 'price'
      ? 'मराठी: वाशी मंडी दर ₹३४/किलो पोहोचला. ग्रेड अ टोमॅटो तातडीने रवाना करा.'
      : advisoryCategory === 'weather'
      ? 'मराठी: पुढील २४ तासांत अवकाळी पाऊस पडण्याची शक्यता. काढणी पूर्ण करा.'
      : 'मराठी: जुन्नर भागात करपा रोगाचा प्रादुर्भाव. तात्काळ फवारणी व प्रतवारी करा.';

  const filteredContracts = PROCESSING_CONTRACTS.filter((c) => {
    if (contractFilter === 'grade-b') return c.acceptedQuality.includes('Grade B');
    if (contractFilter === 'grade-c') return c.acceptedQuality.includes('Grade C');
    return true;
  });

  const handleBroadcastSubmit = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      onBroadcastAdvisory({
        cluster: selectedCluster,
        commodity: selectedCommodity,
        category: advisoryCategory === 'price' ? 'High Price Alert' : advisoryCategory === 'weather' ? 'Weather Alert' : 'Pest Outbreak',
        message: advisoryText
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 3. PAGE HERO HEADER & QUICK COMMERCIAL ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
              Mandi Engine 360
            </span>
            <span className="text-outline text-xs">• APMC Terminal V4.2</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
            Agri-Market Intelligence &amp; Processing Intake Terminal
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Real-time APMC mandi price discovery, industrial processing contracts, and predictive demand analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              const el = document.getElementById('advisory-composer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="h-11 px-4 rounded-lg bg-surface-container-low border border-outline text-on-surface font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95 shadow-xs cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-primary text-xl">campaign</span>
            <span>Broadcast Price Alert</span>
          </button>
          <button
            onClick={onPostPurchaseContract}
            className="h-11 px-5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container active:scale-95 transition-all shadow-sm cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-xl">post_add</span>
            <span>Post Purchase Contract</span>
          </button>
        </div>
      </div>

      {/* 4. COMMODITY PRICE TICKER & DEMAND FORECAST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">trending_up</span>
            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
              Key Commodity Rates &amp; APMC Demand Forecast
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Next automatic price recalibration: 14m
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMODITY_RATES.map((comm) => (
            <div
              key={comm.id}
              className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-semibold">
                      {comm.category}
                    </span>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">{comm.name}</h3>
                    <p className="font-body-sm text-xs text-on-surface-variant italic">{comm.scientificName}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-label-sm text-xs font-bold flex items-center gap-0.5 ${
                      comm.trendText.includes('+')
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {comm.trendText.includes('+') ? 'arrow_upward' : 'trending_flat'}
                    </span>
                    {comm.trendText}
                  </span>
                </div>

                <div className="my-3">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-2xl font-extrabold text-on-surface">{comm.priceRange}</span>
                    <span className="font-label-md text-xs text-on-surface-variant font-medium">{comm.unit}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1 ${comm.statusColor}`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span className="font-label-sm text-xs font-bold">{comm.statusNote}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/50">
                <div className="flex items-center justify-between font-body-sm text-xs">
                  <span className="text-on-surface-variant">{comm.demandMetricName}</span>
                  <span className="font-label-md font-bold text-on-surface">{comm.demandMetricValue}</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`${comm.demandBarColor} h-1.5 rounded-full`}
                    style={{ width: `${comm.demandBarPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demand Pressure Alert Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-xl">report</span>
            </div>
            <div>
              <div className="font-headline-sm text-base font-bold">Urban Deficit Warning: Mumbai &amp; Pune Cluster</div>
              <p className="font-body-sm text-xs sm:text-sm text-on-error-container/90">
                Tomato &amp; leafy intake shortfall exceeds 340 metric tons. Mandi premiums elevated by ₹6.50/kg for batches arriving before 4:00 PM.
              </p>
            </div>
          </div>
          <button
            onClick={onRouteInTransit}
            className="shrink-0 h-10 px-4 rounded-lg bg-error text-on-error font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all shadow-xs cursor-pointer font-bold"
          >
            Route In-Transit Trucks
          </button>
        </div>
      </section>

      {/* 5. DUAL INDUSTRIAL INFRASTRUCTURE GAUGES & METRICS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cold Storage Utilization Gauge */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined">ac_unit</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Regional Cold Storage Utilization</h3>
                <p className="font-body-sm text-xs text-on-surface-variant">6 Connected Multi-Commodity Hubs</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-xs font-bold">
              Zone: Maharashtra Central
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center my-2">
            <div className="sm:col-span-1 flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-xl">
              <div className="font-display-lg text-3xl font-extrabold text-secondary">74%</div>
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Capacity Occupied
              </span>
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div>
                <div className="flex justify-between font-label-md text-xs mb-1">
                  <span className="text-on-surface font-semibold">Reserved Space</span>
                  <span className="text-primary font-bold">3,400 MT</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
                  <div className="bg-secondary h-3 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
              <div className="flex justify-between font-body-sm text-xs text-on-surface-variant">
                <span>Free Chamber Capacity:</span>
                <span className="font-bold text-on-surface">1,200 MT remaining</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Baramati &amp; Junnar Hubs have active pre-cooling slots</span>
            </div>
            <span className="font-label-md text-secondary font-bold">6 Hubs Active</span>
          </div>
        </div>

        {/* Food Processing Intake Capacity Gauge */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined">factory</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Processing Intake Capacity</h3>
                <p className="font-body-sm text-xs text-on-surface-variant">Industrial Puree, Pulp &amp; Dehydration Lines</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-primary-fixed/50 text-on-primary-fixed-variant font-label-sm text-xs font-bold">
              High Intake Shift
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center my-2">
            <div className="sm:col-span-1 flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-xl">
              <div className="font-display-lg text-3xl font-extrabold text-primary">82%</div>
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Booked Capacity
              </span>
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div>
                <div className="flex justify-between font-label-md text-xs mb-1">
                  <span className="text-on-surface font-semibold">Active Industrial Slots</span>
                  <span className="text-primary font-bold">65 / 80 Tonnes</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
              <div className="flex justify-between font-body-sm text-xs text-on-surface-variant">
                <span>Distress Mitigation Pool:</span>
                <span className="font-bold text-on-surface">15 Tonnes buffer left</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-sm text-tertiary">info</span>
              <span>Kisan Pulp, AgroPure &amp; Sahyadri ready for Grade B/C off-take</span>
            </div>
            <span className="font-label-md text-primary font-bold">3 Shifts Active</span>
          </div>
        </div>
      </section>

      {/* 6. PROCESSING PLANT OFF-TAKE & DISTRESS PRODUCE BUYOUT BOARD */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">handshake</span>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                Processing Plant Off-Take &amp; Distress Produce Buyout Board
              </h2>
            </div>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant">
              Direct commercial off-take contracts for non-retail Grade B and Grade C batches to prevent post-harvest dumping.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-xs text-outline font-semibold">Filter:</span>
            <button
              onClick={() => setContractFilter('all')}
              className={`px-2.5 py-1 rounded-full font-label-sm text-xs font-semibold cursor-pointer ${
                contractFilter === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              All Contracts ({PROCESSING_CONTRACTS.length})
            </button>
            <button
              onClick={() => setContractFilter('grade-b')}
              className={`px-2.5 py-1 rounded-full font-label-sm text-xs font-semibold cursor-pointer ${
                contractFilter === 'grade-b'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Grade B
            </button>
            <button
              onClick={() => setContractFilter('grade-c')}
              className={`px-2.5 py-1 rounded-full font-label-sm text-xs font-semibold cursor-pointer ${
                contractFilter === 'grade-c'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Grade C
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary-container transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-xs font-bold font-mono">
                    {contract.contractNumber}
                  </span>
                  {contract.isVerified ? (
                    <span className="flex items-center gap-1 text-primary font-label-sm text-xs font-bold bg-primary-fixed/40 px-2 py-0.5 rounded">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Verified Processor
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-tertiary font-label-sm text-xs font-bold bg-tertiary-fixed/60 px-2 py-0.5 rounded">
                      <span className="material-symbols-outlined text-xs">electric_bolt</span>
                      High Capacity Line
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">{contract.plantName}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">{contract.location}</p>
                </div>

                {/* Price Box */}
                <div className="my-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">
                  <div>
                    <span className="font-body-sm text-xs text-outline">Fixed Floor Price:</span>
                    <div className="font-display-lg text-2xl font-extrabold text-primary">
                      {contract.fixedFloorPrice}
                      <span className="font-body-md text-xs font-medium text-on-surface-variant">/kg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-body-sm text-xs text-outline">Intake Quota:</span>
                    <div className="font-headline-sm text-sm font-bold text-on-surface">{contract.intakeQuota}</div>
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Accepted Quality:</span>
                    <span className="font-semibold text-on-surface">{contract.acceptedQuality}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Payment Clearance:</span>
                    <span className="font-semibold text-primary">{contract.paymentClearance}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">Delivery Window:</span>
                    <span className="font-semibold text-error">{contract.deliveryWindow}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  onClick={() => onLockContract(contract)}
                  className="w-full h-11 rounded-lg bg-primary text-on-primary font-label-md text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-container active:scale-95 transition-all shadow-xs cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-base">
                    {contract.buttonLabel.includes('Schedule') ? 'local_shipping' : 'lock'}
                  </span>
                  <span>{contract.buttonLabel}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ADVISORY BROADCAST COMPOSER WIDGET */}
      <section id="advisory-composer" className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">cell_tower</span>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                FPO Regional Advisory Broadcast Composer
              </h2>
            </div>
            <p className="font-body-md text-body-sm text-on-surface-variant">
              Draft, simulate, and broadcast emergency procurement directives &amp; mandi surge alerts directly to smallholder farmer devices.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-sm text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            1,420 Active Farmers in Broadcast Mesh
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-bold text-on-surface mb-1">
                  Target Cluster / Corridor
                </label>
                <select
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-md text-xs focus:border-primary cursor-pointer"
                >
                  <option>Pune-Nashik Corridor / Junnar Cluster</option>
                  <option>Baramati-Daund Irrigation Belt</option>
                  <option>Lasalgaon Onion Farming Belt</option>
                  <option>Satara Strawberry &amp; Polyhouse Belt</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold text-on-surface mb-1">
                  Target Commodity
                </label>
                <select
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-md text-xs focus:border-primary cursor-pointer"
                >
                  <option>Hybrid Tomato (Solanum lycopersicum)</option>
                  <option>Red Onion (Nashik Special)</option>
                  <option>Green Chilli (G-4)</option>
                  <option>Jyoti Potato (Solanum tuberosum)</option>
                </select>
              </div>
            </div>

            {/* Advisory Type Radios */}
            <div>
              <label className="block font-label-md text-xs font-bold text-on-surface mb-1.5">
                Advisory Directive Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdvisoryCategory('price');
                    setAdvisoryText('Vashi Mandi rate reached ₹34/kg. Farmers with Grade A harvest batches advised to dispatch before 4 PM.');
                  }}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs cursor-pointer font-bold transition-all ${
                    advisoryCategory === 'price'
                      ? 'border-2 border-primary bg-primary-fixed/30 text-on-surface shadow-2xs'
                      : 'border-outline-variant bg-surface hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                  <span>Price Alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdvisoryCategory('weather');
                    setAdvisoryText('Unseasonal rain forecasted in Junnar cluster in next 18 hrs. Accelerate harvesting and move crates to CA cold bays.');
                  }}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs cursor-pointer font-bold transition-all ${
                    advisoryCategory === 'weather'
                      ? 'border-2 border-secondary bg-secondary-fixed/30 text-on-surface shadow-2xs'
                      : 'border-outline-variant bg-surface hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-secondary text-base">cloud</span>
                  <span>Weather Alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdvisoryCategory('pest');
                    setAdvisoryText('High late blight spore count detected in 4 cluster blocks. Triage Grade B produce immediately to puree plant.');
                  }}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs cursor-pointer font-bold transition-all ${
                    advisoryCategory === 'pest'
                      ? 'border-2 border-error bg-error-container/30 text-on-surface shadow-2xs'
                      : 'border-outline-variant bg-surface hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-error text-base">pest_control</span>
                  <span>Pest Outbreak</span>
                </button>
              </div>
            </div>

            {/* Composer Text Area */}
            <div>
              <label className="block font-label-md text-xs font-bold text-on-surface mb-1">
                Advisory Payload Content (SMS + In-App Auto-Translate to Marathi)
              </label>
              <textarea
                value={advisoryText}
                onChange={(e) => setAdvisoryText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-md text-xs sm:text-sm focus:border-primary transition-all resize-none"
              />
              <div className="flex justify-between items-center mt-1 text-[11px] text-outline">
                <span>Standard GSM 7-bit Encoding • {advisoryText.length}/160 Characters</span>
                <span className="text-primary font-semibold">Localized to: English + Marathi (मराठी)</span>
              </div>
            </div>
          </div>

          {/* Right Preview Column: Handset Simulator */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-surface-container-low border border-outline-variant/60">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-bold">
                  Farmer Handset Simulator
                </span>
                <span className="material-symbols-outlined text-primary text-base">smartphone</span>
              </div>

              {/* Phone Screen Mock */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">shield</span>
                    <span className="font-label-sm text-xs font-bold text-on-surface">CropShield Alert</span>
                  </div>
                  <span className="text-[11px] text-outline">Just Now</span>
                </div>
                <p className="font-body-md text-xs sm:text-sm text-on-surface font-medium leading-relaxed">
                  "{advisoryText}"
                </p>
                <div className="pt-2 text-[11px] text-on-surface-variant flex items-center gap-1 border-t border-outline-variant/30">
                  <span className="material-symbols-outlined text-xs text-primary">translate</span>
                  <span>{marathiTranslation}</span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 font-body-sm text-xs text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>Reach Coverage:</span>
                  <span className="font-semibold text-on-surface">1,420 Verified Farmers</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Channels:</span>
                  <span className="font-semibold text-on-surface">SMS Blast + Offline Push Mesh</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Predicted Produce Mobilized:</span>
                  <span className="font-bold text-primary">~45 Metric Tonnes</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={handleBroadcastSubmit}
                disabled={isBroadcasting}
                className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-md text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-container active:scale-95 transition-all shadow-md cursor-pointer font-bold disabled:opacity-75"
              >
                <span className={`material-symbols-outlined text-lg ${isBroadcasting ? 'animate-spin' : ''}`}>
                  {isBroadcasting ? 'sync' : 'send'}
                </span>
                <span>
                  {isBroadcasting ? 'Broadcasting via P2P Mesh...' : 'Broadcast to 1,420 Farmers (SMS & In-App Sync)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RECENT ACTIVITY LOG & REGIONAL INTEL SUMMARY */}
      <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">
            Recent Dispatch Clearances &amp; Processor Intakes
          </h3>
          <button
            onClick={onExportLedger}
            className="font-label-sm text-xs text-secondary hover:underline cursor-pointer font-semibold"
          >
            Export Ledger (CSV)
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-xs sm:text-sm">
            <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
              <tr>
                <th className="py-3 px-4 font-label-md text-xs font-bold">Batch / Dispatch ID</th>
                <th className="py-3 px-4 font-label-md text-xs font-bold">FPO Origin Hub</th>
                <th className="py-3 px-4 font-label-md text-xs font-bold">Commodity &amp; Grade</th>
                <th className="py-3 px-4 font-label-md text-xs font-bold">Destination Buyer</th>
                <th className="py-3 px-4 font-label-md text-xs font-bold">Net Volume</th>
                <th className="py-3 px-4 font-label-md text-xs font-bold">Price / kg</th>
                <th className="py-3 px-4 font-label-md text-xs font-bold">Gate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {DISPATCH_LEDGER.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-on-surface">{row.batchId}</td>
                  <td className="py-3 px-4 text-on-surface">{row.fpoOrigin}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-on-surface">{row.commodity}</span>
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        row.grade === 'Grade A'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : row.grade === 'Grade B'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface">{row.buyer}</td>
                  <td className="py-3 px-4 font-semibold text-on-surface">{row.netVolume}</td>
                  <td className="py-3 px-4 font-bold text-primary">{row.pricePerKg}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-label-sm text-xs font-semibold ${
                        row.statusColor === 'green'
                          ? 'text-primary'
                          : row.statusColor === 'blue'
                          ? 'text-secondary'
                          : 'text-tertiary'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.gateStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
