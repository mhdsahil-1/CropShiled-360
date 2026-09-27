import React, { useState } from 'react';
import { HarvestBatch } from '../../types';
import { TOMATO_HARVEST_IMAGE, MAP_ROUTE_IMAGE } from '../../data/mockData';

interface BatchIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batch: HarvestBatch) => void;
}

export const BatchIngestionModal: React.FC<BatchIngestionModalProps> = ({
  isOpen,
  onClose,
  onAddBatch
}) => {
  const [crop, setCrop] = useState('Tomato');
  const [variety, setVariety] = useState('Hybrid Desi');
  const [producer, setProducer] = useState('Anand Shinde');
  const [origin, setOrigin] = useState('Khed Taluka, Pune');
  const [weight, setWeight] = useState('1200');
  const [fieldTemp, setFieldTemp] = useState('32');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'form' | 'scanning' | 'complete'>('form');

  if (!isOpen) return null;

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanStep('scanning');

    setTimeout(() => {
      setIsScanning(false);
      setScanStep('complete');
    }, 1800);
  };

  const handleFinish = () => {
    const randomId = `#CS-${crop.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedWeight = parseInt(weight) || 1000;
    const tempNum = parseInt(fieldTemp) || 30;

    // Simulate decay score based on field temperature
    const healthScore = tempNum > 35 ? 48 : tempNum > 30 ? 76 : 91;
    const grade = healthScore >= 85 ? 'Grade A' : healthScore >= 60 ? 'Grade B' : 'Grade C';
    const gradeLabel =
      grade === 'Grade A' ? 'Grade A (Fresh)' : grade === 'Grade B' ? 'Grade B (Act Soon)' : 'Grade C (Accelerated Decay)';

    const newBatch: HarvestBatch = {
      id: randomId,
      cropName: crop,
      variety,
      grade,
      gradeLabel,
      weightKg: parsedWeight,
      status: 'Awaiting Dispatch Slot',
      statusType: 'pooling',
      producer,
      origin,
      harvestedTimeAgo: 'Harvested just now',
      healthScore,
      healthDescription: healthScore > 75 ? 'Optimal skin firmness' : 'Moderate heat vulnerability',
      shelfLifeRemaining: healthScore > 75 ? '5d 12h remaining' : '32 hrs remaining',
      shelfLifeContext: 'Post-harvest biological clock calibrated',
      routeType: healthScore > 75 ? 'AI Prescribed Mandi' : 'Diverted Preservation Route',
      destinationName: healthScore > 75 ? 'Narayanpur Wholesale Mandi' : 'Sahyadri Cold Storage Hub',
      destinationPriceContext: healthScore > 75 ? '(Est. ₹32–34/kg)' : 'Chamber 2 Reservation',
      actionButtonText: 'Inspect Twin',
      actionIcon: 'visibility',
      actionType: 'map',
      modelName: 'YOLOv8 + MobileNetV3 Edge Scan',
      imageUrl: TOMATO_HARVEST_IMAGE,
      imageAlt: 'Harvest batch defect scan inspection',
      aiConfidence: 96.8,
      pestSurfaceScars: healthScore > 75 ? '0.6% (Minimal)' : '3.8% (Moderate)',
      pestPercentage: healthScore > 75 ? 6 : 38,
      respirationRate: healthScore > 75 ? '6.8 mg CO₂/kg·h' : '14.2 mg CO₂/kg·h',
      respirationPercentage: healthScore > 75 ? 20 : 50,
      ambientTransitTemp: `${tempNum}°C`,
      tempPercentage: tempNum * 2,
      transitEta: 'Pending Dispatch',
      routeId: 'Route #AUTO-INGEST',
      mapImageUrl: MAP_ROUTE_IMAGE,
      economicPreservedValue: `₹${(parsedWeight * 32).toLocaleString()}`,
      economicComparison: '+25% value protected by ADDT triage'
    };

    onAddBatch(newBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary-container text-on-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl">add_circle</span>
            <div>
              <h3 className="font-headline-sm text-lg font-bold">Batch Ingestion &amp; ADDT Scan</h3>
              <p className="text-xs opacity-90">Edge-AI defect scanner &amp; biological decay twin calibration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {scanStep === 'form' && (
            <form onSubmit={handleStartScan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Crop Type</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary"
                  >
                    <option>Tomato</option>
                    <option>Red Onion</option>
                    <option>Green Chilli</option>
                    <option>Potato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Variety</label>
                  <input
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary"
                    placeholder="e.g. Hybrid Desi"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Producer / Farmer</label>
                  <input
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary"
                    placeholder="Farmer Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Origin / Sector</label>
                  <input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary"
                    placeholder="e.g. Khed Taluka"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Batch Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Field Heat (°C)</label>
                  <input
                    type="number"
                    value={fieldTemp}
                    onChange={(e) => setFieldTemp(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">document_scanner</span>
                  <span>Trigger YOLOv8 Defect &amp; Spoilage Scan</span>
                </button>
              </div>
            </form>
          )}

          {scanStep === 'scanning' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-20 h-20 rounded-full border-4 border-primary-container border-t-transparent animate-spin flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-2xl animate-pulse">
                  center_focus_strong
                </span>
              </div>
              <div>
                <h4 className="font-headline-sm text-base font-bold text-on-surface">Running YOLOv8 Defect &amp; Moisture Analysis</h4>
                <p className="text-xs text-on-surface-variant mt-1">Calibrating MobileNetV3 respiration model against {fieldTemp}°C ambient heat...</p>
              </div>
            </div>
          )}

          {scanStep === 'complete' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-base font-bold text-on-surface">Diagnostic Scan Complete!</h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Biological Digital Decay Twin created with 96.8% confidence.
                </p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-outline">Assigned Grade:</span>
                  <span className="font-bold text-primary">Grade A (Fresh)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Calculated Health Score:</span>
                  <span className="font-bold text-on-surface">82/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Prescribed Route:</span>
                  <span className="font-bold text-secondary">Narayanpur Wholesale Mandi</span>
                </div>
              </div>
              <button
                onClick={handleFinish}
                className="w-full h-11 rounded-lg bg-primary text-on-primary font-bold text-sm hover:bg-primary-container transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                Ingest to Active Batch Registry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
