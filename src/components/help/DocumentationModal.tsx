import React from 'react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  title = 'CropShield 360 — System Architecture & ADDT Specification'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-surface-container-high px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
            <div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">{title}</h3>
              <p className="text-xs text-on-surface-variant">Smart India Hackathon (SIH 2026) • Problem Statement #6</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-on-surface">
          <div>
            <h4 className="font-bold text-base text-primary mb-1">1. The Problem Statement &amp; Agricultural Challenge</h4>
            <p className="text-on-surface-variant leading-relaxed text-xs sm:text-sm">
              In India, up to <strong>30% of perishable horticultural crops</strong> (tomatoes, onions, chillies, potatoes) degrade post-harvest due to lack of real-time decay visibility, fragmented cold chain storage, and delayed mandi transit. Smallholder farmers face distress sales as low as ₹20/kg, while urban centers experience acute deficits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2">
            <h4 className="font-bold text-sm text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">science</span>
              <span>2. Agricultural Digital Decay Twin (ADDT) Engine</span>
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              ADDT creates a real-time mathematical biological twin of each harvested produce crate. It couples:
            </p>
            <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-1">
              <li><strong>Computer Vision (YOLOv8):</strong> Detects surface scarring, skin firmness, mechanical bruising, and fungal spores.</li>
              <li><strong>Biological Respiration Equation:</strong> Models CO₂ emission rate vs. ambient temperature using Arrhenius kinetics: <code className="bg-surface-container px-1 py-0.5 rounded font-mono text-[11px]">R(T) = R₀ · Q₁₀^((T - T₀)/10)</code>.</li>
              <li><strong>Dynamic RUL Clock:</strong> Predicts remaining useful shelf life in hours before catastrophic cellular breakdown.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base text-primary mb-1">3. Multi-Modal Dispatch Optimization</h4>
            <p className="text-on-surface-variant leading-relaxed text-xs sm:text-sm">
              Instead of forcing every batch to travel to a single terminal mandi:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
              <div className="p-3 bg-primary-fixed/20 border border-primary/20 rounded-lg">
                <span className="font-bold text-xs text-primary block">Grade A (Fresh)</span>
                <span className="text-[11px] text-on-surface-variant">Dispatched directly to highest-paying terminal wholesale Mandis (e.g. Vashi / Narayanpur).</span>
              </div>
              <div className="p-3 bg-tertiary-fixed/20 border border-tertiary/20 rounded-lg">
                <span className="font-bold text-xs text-tertiary block">Grade B (Act Soon)</span>
                <span className="text-[11px] text-on-surface-variant">Diverted to controlled atmosphere (CA) pre-cooling cold storage hubs to extend shelf-life by 14–21 days.</span>
              </div>
              <div className="p-3 bg-error-container/30 border border-error/20 rounded-lg">
                <span className="font-bold text-xs text-error block">Grade C (Critical Decay)</span>
                <span className="text-[11px] text-on-surface-variant">Immediately routed to industrial food puree, ketchup, and solar dehydration units at guaranteed buyout floor prices.</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-base text-secondary mb-1">4. Offline-First P2P Mesh Architecture</h4>
            <p className="text-on-surface-variant leading-relaxed text-xs sm:text-sm">
              Rural farm-gates frequently suffer from zero or intermittent 4G/5G connectivity. CropShield 360 runs its YOLOv8 and MobileNetV3 inference entirely on-device, generating cryptographic harvest certificates that propagate over peer-to-peer Wi-Fi Direct and Bluetooth mesh networks, syncing automatically once within hub proximity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container px-6 py-3 border-t border-outline-variant flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
