import React, { useState } from 'react';
import { HarvestBatch } from '../../types';

interface EmergencyDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  criticalBatches: HarvestBatch[];
  onConfirmEmergencyDispatch: (batchId: string, route: string, vehicleId: string) => void;
}

export const EmergencyDispatchModal: React.FC<EmergencyDispatchModalProps> = ({
  isOpen,
  onClose,
  criticalBatches,
  onConfirmEmergencyDispatch
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    criticalBatches[0]?.id || '#CS-CH-0419'
  );
  const [selectedRoute, setSelectedRoute] = useState<string>('processing');
  const [assignedVehicle, setAssignedVehicle] = useState<string>('MH-14-AZ-4029 (Reefer 3.5T)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentBatch = criticalBatches.find((b) => b.id === selectedBatchId) || criticalBatches[0];

  const handleDispatch = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmEmergencyDispatch(
        selectedBatchId,
        selectedRoute === 'processing'
          ? 'Kisan Pulp & Processing Unit #4 (Direct Buyout)'
          : selectedRoute === 'mandi'
          ? 'Vashi APMC Wholesale Mandi (Express Lane)'
          : 'Sahyadri Agro Cold Hub (Pre-Cooling Bay)',
        assignedVehicle
      );
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border-2 border-error w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-error text-on-error px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              crisis_alert
            </span>
            <div>
              <h3 className="font-headline-sm text-lg font-bold">Emergency Post-Harvest Dispatch</h3>
              <p className="text-xs opacity-90">High-priority biological decay mitigation &amp; rapid rerouting protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Step 1: Select Critical Batch */}
          <div>
            <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
              1. Select Batch Under Biological Threat (&lt; 24h RUL)
            </label>
            <div className="space-y-2">
              {criticalBatches.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedBatchId === b.id
                      ? 'border-2 border-error bg-error-container/20 shadow-xs'
                      : 'border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-error" />
                    <div>
                      <div className="font-bold text-sm text-on-surface font-mono">
                        {b.id} — {b.cropName} ({b.variety})
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Producer: {b.producer} • {b.origin} ({b.weightKg.toLocaleString()} kg)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-error bg-error-container px-2 py-0.5 rounded">
                      {b.shelfLifeRemaining}
                    </span>
                    <div className="text-[11px] text-outline mt-0.5">Score: {b.healthScore}/100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Diversion Strategy */}
          <div>
            <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
              2. Select Autonomous Mitigation Destination
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                onClick={() => setSelectedRoute('processing')}
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedRoute === 'processing'
                    ? 'border-2 border-primary bg-primary-fixed/20 shadow-xs'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-primary text-xl">factory</span>
                  <span className="text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded">
                    Zero Waste
                  </span>
                </div>
                <div className="font-bold text-xs text-on-surface">Processing Plant Bypass</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                  Kisan Pulp Unit #4 (₹22/kg guaranteed floor buyout)
                </div>
              </label>

              <label
                onClick={() => setSelectedRoute('mandi')}
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedRoute === 'mandi'
                    ? 'border-2 border-secondary bg-secondary-fixed/20 shadow-xs'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-secondary text-xl">storefront</span>
                  <span className="text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded">
                    Express APMC
                  </span>
                </div>
                <div className="font-bold text-xs text-on-surface">Vashi Mandi Express</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                  Terminal auction priority slot (Est. ₹26.50/kg)
                </div>
              </label>

              <label
                onClick={() => setSelectedRoute('cold-chamber')}
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedRoute === 'cold-chamber'
                    ? 'border-2 border-tertiary bg-tertiary-fixed/20 shadow-xs'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-tertiary text-xl">ac_unit</span>
                  <span className="text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded">
                    CA Vault
                  </span>
                </div>
                <div className="font-bold text-xs text-on-surface">Sahyadri Pre-Cooling</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                  Chamber 2 (4.1°C) +18 days shelf life extension
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Vehicle Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Assign Fleet Vehicle
              </label>
              <select
                value={assignedVehicle}
                onChange={(e) => setAssignedVehicle(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface text-xs focus:border-primary cursor-pointer"
              >
                <option>MH-14-AZ-4029 (Reefer 3.5T - Junnar)</option>
                <option>MH-12-RP-1188 (Insulated 5.0T - Khed)</option>
                <option>MH-15-EG-8821 (FPO Pool Truck - Nashik)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Driver P2P Mesh Dispatch
              </label>
              <div className="h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between text-xs text-on-surface">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Auto-SMS + GPS Navigation
                </span>
                <span className="text-[11px] text-primary font-bold">Signal: Strong</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDispatch}
            disabled={isSubmitting}
            className="h-11 px-6 rounded-lg bg-error text-on-error font-label-md text-xs sm:text-sm font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-75"
          >
            <span className={`material-symbols-outlined text-base ${isSubmitting ? 'animate-spin' : ''}`}>
              {isSubmitting ? 'sync' : 'bolt'}
            </span>
            <span>{isSubmitting ? 'Executing Dispatch...' : 'Authorize Immediate Dispatch'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
