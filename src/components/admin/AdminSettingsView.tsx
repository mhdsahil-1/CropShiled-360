import React, { useState } from 'react';

interface AdminSettingsViewProps {
  onSaveSettings: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ onSaveSettings }) => {
  const [syncInterval, setSyncInterval] = useState('2');
  const [modelConfidence, setModelConfidence] = useState('92');
  const [clusterRegion, setClusterRegion] = useState('Pune-Nashik Horticultural Corridor');
  const [enableOfflineMesh, setEnableOfflineMesh] = useState(true);
  const [enableSmsFallback, setEnableSmsFallback] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    onSaveSettings();
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold uppercase tracking-wider">
            System Administration
          </span>
          <span className="text-outline text-xs">• SIH 2026 Engine v2.4</span>
        </div>
        <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
          Admin Settings &amp; Cluster Configuration
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant mt-1">
          Manage edge-IoT synchronization intervals, YOLOv8 defect thresholds, P2P mesh network parameters, and FPO cluster mappings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Edge IoT & Sensor Config */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">sensors</span>
            <span>Edge-IoT &amp; Telemetry Synchronization</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Background Telemetry Sync Interval (Minutes)
              </label>
              <input
                type="number"
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary"
                min="1"
                max="60"
              />
              <span className="text-[11px] text-outline mt-1 block">
                Standard: 2 min for active reefers, 10 min for cold storage bays.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Target Agricultural Cluster Corridor
              </label>
              <select
                value={clusterRegion}
                onChange={(e) => setClusterRegion(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant text-xs focus:border-primary cursor-pointer"
              >
                <option>Pune-Nashik Horticultural Corridor</option>
                <option>Western Maharashtra Agri Hub</option>
                <option>Marathwada Dryland Irrigation Zone</option>
                <option>Vidarbha Orange &amp; Cotton Belt</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Model Calibration */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">psychology</span>
            <span>ADDT Digital Twin AI Model Calibration</span>
          </h2>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Minimum YOLOv8 Defect Detection Confidence</span>
              <span className="text-primary">{modelConfidence}%</span>
            </div>
            <input
              type="range"
              min="75"
              max="99"
              value={modelConfidence}
              onChange={(e) => setModelConfidence(e.target.value)}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-outline mt-1">
              Batches with confidence below this threshold prompt manual re-inspection by FPO Lead.
            </p>
          </div>
        </div>

        {/* P2P Mesh & Fallback Gateway */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">cell_tower</span>
            <span>Offline Mesh &amp; SMS Gateway Fallback</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 cursor-pointer">
              <div>
                <div className="font-bold text-xs text-on-surface">Enable Offline P2P Mesh Networking</div>
                <div className="text-[11px] text-on-surface-variant">
                  Allows farmer mobile handsets to relay biological decay certificates without cellular internet.
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableOfflineMesh}
                onChange={() => setEnableOfflineMesh(!enableOfflineMesh)}
                className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 cursor-pointer">
              <div>
                <div className="font-bold text-xs text-on-surface">MahaAgri SMS Blast Carrier Fallback</div>
                <div className="text-[11px] text-on-surface-variant">
                  Automatically delivers urgent price spikes and blight warnings via GSM SMS when app is offline.
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableSmsFallback}
                onChange={() => setEnableSmsFallback(!enableSmsFallback)}
                className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Settings saved and deployed to edge nodes!
            </span>
          ) : (
            <span className="text-xs text-outline">Changes apply across all 8 active FPO cluster nodes</span>
          )}

          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-primary text-on-primary font-bold text-sm hover:bg-primary-container active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
