import React, { useState } from 'react';
import { PROCESSING_CONTRACTS } from '../../data/mockData';
import { ProcessingContract } from '../../types';

interface ProcessingViewProps {
  onLockContract: (contract: ProcessingContract) => void;
  onPostNewContract: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  onLockContract,
  onPostNewContract
}) => {
  const [filter, setFilter] = useState<'all' | 'puree' | 'ketchup' | 'dehydration'>('all');

  const contracts = PROCESSING_CONTRACTS.filter((c) => {
    if (filter === 'puree') return c.plantName.toLowerCase().includes('puree');
    if (filter === 'ketchup') return c.plantName.toLowerCase().includes('ketchup');
    if (filter === 'dehydration') return c.plantName.toLowerCase().includes('dehydration');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold uppercase tracking-wider">
              Industrial Processing Hub
            </span>
            <span className="text-outline text-xs">• Zero-Waste Food Recovery Grid</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
            Food Processing &amp; Distress Produce Intake
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Institutional contracts guaranteeing buyout floor prices for Grade B &amp; C surplus produce to eliminate post-harvest farm dumping.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onPostNewContract}
            className="h-11 px-5 rounded-lg bg-primary text-on-primary font-label-md text-xs sm:text-sm flex items-center gap-2 hover:bg-primary-container active:scale-95 transition-all shadow-sm cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-xl">add_business</span>
            <span>Register Processing Line</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs">
          <span className="text-xs text-outline font-semibold uppercase">Active Intake Capacity</span>
          <div className="font-display-lg text-3xl font-bold text-primary mt-1">65 / 80 T</div>
          <p className="text-xs text-on-surface-variant mt-1">15 Tonnes emergency buffer remaining today</p>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
            <div className="bg-primary h-full rounded-full w-[82%]" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs">
          <span className="text-xs text-outline font-semibold uppercase">Avg Floor Price</span>
          <div className="font-display-lg text-3xl font-bold text-on-surface mt-1">₹21.16/kg</div>
          <p className="text-xs text-primary font-semibold mt-1">+₹5.16/kg vs unorganized local distress buyers</p>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
            <div className="bg-primary h-full rounded-full w-[70%]" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-xs">
          <span className="text-xs text-outline font-semibold uppercase">Total Salvaged Volume</span>
          <div className="font-display-lg text-3xl font-bold text-secondary mt-1">240 Tonnes</div>
          <p className="text-xs text-on-surface-variant mt-1">Equivalent to 40% reduction in methane landfill emissions</p>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
            <div className="bg-secondary h-full rounded-full w-[88%]" />
          </div>
        </div>
      </div>

      {/* Filters and List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-headline-sm text-lg font-bold text-on-surface">Available Offtake Contracts</h2>
          <div className="flex items-center gap-2">
            {(['all', 'puree', 'ketchup', 'dehydration'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                  filter === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
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
                      Verified Buyer
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-tertiary font-label-sm text-xs font-bold bg-tertiary-fixed/60 px-2 py-0.5 rounded">
                      <span className="material-symbols-outlined text-xs">electric_bolt</span>
                      High Output
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">{contract.plantName}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">{contract.location}</p>
                </div>

                <div className="my-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">
                  <div>
                    <span className="font-body-sm text-xs text-outline">Procurement Rate:</span>
                    <div className="font-display-lg text-2xl font-extrabold text-primary">
                      {contract.fixedFloorPrice}
                      <span className="font-body-md text-xs font-medium text-on-surface-variant">/kg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-body-sm text-xs text-outline">Open Quota:</span>
                    <div className="font-headline-sm text-sm font-bold text-on-surface">{contract.intakeQuota}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Accepted Quality:</span>
                    <span className="font-semibold text-on-surface">{contract.acceptedQuality}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Payment Terms:</span>
                    <span className="font-semibold text-primary">{contract.paymentClearance}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">Window:</span>
                    <span className="font-semibold text-error">{contract.deliveryWindow}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  onClick={() => onLockContract(contract)}
                  className="w-full h-11 rounded-lg bg-primary text-on-primary font-label-md text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-container active:scale-95 transition-all shadow-xs cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>{contract.buttonLabel}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
