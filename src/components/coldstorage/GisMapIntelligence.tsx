import React, { useState } from 'react';
import { HarvestBatch } from '../../types';

interface GisMapIntelligenceProps {
  batches?: HarvestBatch[];
  onSelectBatch?: (batch: HarvestBatch) => void;
  onRerouteDistress: () => void;
  onContactFacility: (facilityName: string) => void;
  onRouteDiversion: (facilityName: string) => void;
  onReserveAllocation: (facilityName: string) => void;
  onOpenCompareModal?: (batchAId?: string, batchBId?: string) => void;
}

interface ThermalHotspot {
  id: string;
  batchId?: string;
  cropName: string;
  variety: string;
  producer: string;
  weightKg: number;
  grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade A+';
  currentAmbientTemp: number; // in °C
  safeTempThreshold: number; // in °C
  respirationMultiplier: number; // e.g. 3.8x
  remainingUsefulLife: string;
  riskLevel: 'critical' | 'accelerated' | 'moderate' | 'optimal';
  decayMechanism: string;
  locationLabel: string;
  recommendedAction: string;
  coordinates: { x: number; y: number }; // Relative SVG / Canvas coordinates
  transitStatus?: string;
  actionType: 'cold-storage' | 'processing-plant' | 'mandi';
}

const THERMAL_HOTSPOTS: ThermalHotspot[] = [
  {
    id: 'hotspot-chilli-baramati',
    batchId: '#CS-CH-0419',
    cropName: 'Green Chilli (G-4)',
    variety: 'High Moisture Capsicum annuum',
    producer: 'Balu Shinde • Baramati Sector',
    weightKg: 650,
    grade: 'Grade C',
    currentAmbientTemp: 38.0,
    safeTempThreshold: 22.0,
    respirationMultiplier: 4.2,
    remainingUsefulLife: '18 Hours',
    riskLevel: 'critical',
    decayMechanism: 'Rapid desiccation, membrane breakdown, and accelerated moisture transpiration at 38°C.',
    locationLabel: 'Baramati Thermal Basin (38.0°C)',
    recommendedAction: 'Emergency bypass to Kisan Pulp Unit #4 or immediate insulated reefer pull-down.',
    coordinates: { x: 440, y: 590 },
    transitStatus: 'Field Heat Acute (38°C) • Immediate Offload Required',
    actionType: 'processing-plant'
  },
  {
    id: 'hotspot-tomato-transit',
    batchId: '#CS-TOM-0824',
    cropName: 'Hybrid Desi Tomato',
    variety: 'Solanum lycopersicum',
    producer: 'Ramesh Jadhav • Khed Taluka',
    weightKg: 1000,
    grade: 'Grade A',
    currentAmbientTemp: 31.4,
    safeTempThreshold: 20.0,
    respirationMultiplier: 2.1,
    remainingUsefulLife: '4d 18h (Drops to 32h if unrefrigerated)',
    riskLevel: 'accelerated',
    decayMechanism: 'Respiration surge (7.2 mg CO₂/kg·h) causing premature skin softening and ethylene release.',
    locationLabel: 'NH-60 Agro Transit Corridor (31.4°C)',
    recommendedAction: 'Confirm Narayanpur Mandi delivery in <4h or divert to Sahyadri CA Chamber 2.',
    coordinates: { x: 580, y: 460 },
    transitStatus: 'En-Route Truck #MH-14-AZ-4029 • 35 min ETA',
    actionType: 'cold-storage'
  },
  {
    id: 'hotspot-onion-nashik',
    batchId: '#CS-ON-1102',
    cropName: 'Red Onion (Nashik Special)',
    variety: 'Allium cepa',
    producer: 'Sunita Patil • Nashik East',
    weightKg: 2400,
    grade: 'Grade B',
    currentAmbientTemp: 32.5,
    safeTempThreshold: 25.0,
    respirationMultiplier: 2.4,
    remainingUsefulLife: '~30 Hours Ambient (+18d with Cold Chain)',
    riskLevel: 'accelerated',
    decayMechanism: 'Transpirational moisture vulnerability in dry 32°C highway airflow causing weight shrinkage.',
    locationLabel: 'Nashik South Bypass (32.5°C)',
    recommendedAction: 'Divert to Sahyadri Cold Hub Chamber C-2 to lock +18 day preservation.',
    coordinates: { x: 790, y: 350 },
    transitStatus: 'Awaiting Offload • Slot Confirmed',
    actionType: 'cold-storage'
  },
  {
    id: 'hotspot-potato-junnar',
    batchId: '#CS-POT-0951',
    cropName: 'Jyoti Potato',
    variety: 'Solanum tuberosum',
    producer: 'Ganesh Thorat • Junnar Foothills',
    weightKg: 3200,
    grade: 'Grade A+',
    currentAmbientTemp: 27.8,
    safeTempThreshold: 20.0,
    respirationMultiplier: 1.1,
    remainingUsefulLife: '14 Days Shelf Life',
    riskLevel: 'optimal',
    decayMechanism: 'Minimal decay. Cured skin provides high heat insulation up to 30°C.',
    locationLabel: 'Junnar Valley Microclimate (27.8°C)',
    recommendedAction: 'Pool with FPO truck #MH-12-AP-8902 for Pune Mega Mandi.',
    coordinates: { x: 380, y: 320 },
    transitStatus: 'Cured 48h • Awaiting FPO Pooling',
    actionType: 'mandi'
  }
];

export const GisMapIntelligence: React.FC<GisMapIntelligenceProps> = ({
  batches,
  onSelectBatch,
  onRerouteDistress,
  onContactFacility,
  onRouteDiversion,
  onReserveAllocation,
  onOpenCompareModal
}) => {
  // Layer toggles
  const [layers, setLayers] = useState({
    transitRoutes: true,
    coldStorage: true,
    processingUnits: true,
    wholesaleMandis: true,
    diseaseHeatmap: true,
    temperatureDecayHeatmap: true // Geospatial thermal risk layer
  });

  // Thermal controls
  const [thermalRiskFilter, setThermalRiskFilter] = useState<'all' | 'critical' | 'accelerated'>('all');
  const [isHeatwaveSimulated, setIsHeatwaveSimulated] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<ThermalHotspot | null>(THERMAL_HOTSPOTS[0]);
  const [isThermalInspectorOpen, setIsThermalInspectorOpen] = useState<boolean>(true);

  // Facility selection
  const [selectedFacility, setSelectedFacility] = useState({
    name: 'Sahyadri Agro Cold Storage Hub',
    type: 'Active Cold Storage Node',
    distance: '12.4 km from distress cluster',
    chamber: 'Chamber 2: 4.1°C / 90% RH',
    capacityVacant: '320 Crates (12.8 Tons) Vacant',
    certification: 'Controlled Atmosphere (CA) Certified',
    fillLevel: 68,
    powerStatus: '100% Grid OK (72 hrs Diesel Aux)',
    pullDownRate: '2.4 hrs pull-down',
    isAllocated: false
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [terrainMode, setTerrainMode] = useState(false);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleFacilitySelect = (facility: typeof selectedFacility) => {
    setSelectedFacility(facility);
  };

  const handleReserveClick = () => {
    onReserveAllocation(selectedFacility.name);
    setSelectedFacility((prev) => ({ ...prev, isAllocated: true }));
    setTimeout(() => {
      setSelectedFacility((prev) => ({ ...prev, isAllocated: false }));
    }, 4000);
  };

  // Filtered hotspots based on severity
  const visibleHotspots = THERMAL_HOTSPOTS.filter((h) => {
    if (thermalRiskFilter === 'critical') return h.riskLevel === 'critical';
    if (thermalRiskFilter === 'accelerated') return h.riskLevel === 'critical' || h.riskLevel === 'accelerated';
    return true;
  });

  // Dynamic temperature calculation under heatwave simulation
  const getSimulatedTemp = (baseTemp: number) => {
    return isHeatwaveSimulated ? +(baseTemp + 3.2).toFixed(1) : baseTemp;
  };

  const getSimulatedMultiplier = (baseMultiplier: number) => {
    return isHeatwaveSimulated ? +(baseMultiplier * 1.35).toFixed(1) : baseMultiplier;
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-low gis-grid-pattern shadow-sm select-none">
      {/* ========================================================================= */}
      {/* 1. VECTOR / SYNTHETIC SATELLITE GIS MAP CANVAS WITH THERMAL HEATMAP       */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300 origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg className="w-full h-full opacity-85" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Standard Disease Fungal Risk Gradient */}
            <radialGradient cx="50%" cy="50%" id="fungalRiskZone" r="50%">
              <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#ffb956" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffb956" stopOpacity="0" />
            </radialGradient>

            {/* CRITICAL THERMAL DECAY GRADIENT (Baramati Extreme 38°C+ Cell) */}
            <radialGradient cx="50%" cy="50%" id="thermalExtremePlume" r="50%">
              <stop offset="0%" stopColor="#ba1a1a" stopOpacity={isHeatwaveSimulated ? "0.75" : "0.62"} />
              <stop offset="35%" stopColor="#d9381e" stopOpacity={isHeatwaveSimulated ? "0.55" : "0.42"} />
              <stop offset="65%" stopColor="#f57c00" stopOpacity="0.28" />
              <stop offset="85%" stopColor="#ffb300" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffb300" stopOpacity="0" />
            </radialGradient>

            {/* ACCELERATED RESPIRATION THERMAL GRADIENT (NH-60 Corridor 32-35°C) */}
            <radialGradient cx="50%" cy="50%" id="thermalAcceleratedPlume" r="50%">
              <stop offset="0%" stopColor="#e65100" stopOpacity={isHeatwaveSimulated ? "0.65" : "0.48"} />
              <stop offset="45%" stopColor="#f57c00" stopOpacity="0.32" />
              <stop offset="75%" stopColor="#ffb74d" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#ffb74d" stopOpacity="0" />
            </radialGradient>

            {/* MODERATE HEAT GRADIENT (Nashik Highway Stretch) */}
            <radialGradient cx="50%" cy="50%" id="thermalModeratePlume" r="50%">
              <stop offset="0%" stopColor="#fb8c00" stopOpacity="0.40" />
              <stop offset="55%" stopColor="#ffb74d" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#ffb74d" stopOpacity="0" />
            </radialGradient>

            {/* COLD STORAGE THERMAL SINK MICROCLIMATE (Sahyadri Hub 4.1°C) */}
            <radialGradient cx="50%" cy="50%" id="coldStorageThermalSink" r="50%">
              <stop offset="0%" stopColor="#004d40" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#00796b" stopOpacity="0.35" />
              <stop offset="75%" stopColor="#26a69a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#26a69a" stopOpacity="0" />
            </radialGradient>

            {/* Shimmer / Glow Filter */}
            <filter id="gisGlow" height="140%" width="140%" x="-20%" y="-20%">
              <feGaussianBlur result="glow" stdDeviation="3.5" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            <filter id="thermalPulsingFilter" height="160%" width="160%" x="-30%" y="-30%">
              <feGaussianBlur result="blur" stdDeviation="6" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Topographic Contour Lines */}
          <path
            d="M-100,200 Q200,120 500,240 T1100,180 T1600,300"
            fill="none"
            opacity="0.30"
            stroke="#707972"
            strokeDasharray="4,8"
            strokeWidth="0.75"
          />
          <path
            d="M-50,380 Q300,280 650,420 T1250,310 T1700,450"
            fill="none"
            opacity="0.30"
            stroke="#707972"
            strokeDasharray="4,8"
            strokeWidth="0.75"
          />
          <path
            d="M0,540 Q400,490 850,560 T1450,520 T1800,640"
            fill="none"
            opacity="0.30"
            stroke="#707972"
            strokeDasharray="4,8"
            strokeWidth="0.75"
          />

          {/* Expressways (NH-60 Pune-Nashik Corridor) */}
          <path
            d="M 280,780 C 420,540 560,420 720,290 C 850,190 980,110 1120,40"
            fill="none"
            opacity="0.45"
            stroke="#b1bafd"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d="M 280,780 C 420,540 560,420 720,290 C 850,190 980,110 1120,40"
            fill="none"
            opacity="0.8"
            stroke="#515a96"
            strokeDasharray="12,12"
            strokeWidth="2"
          />

          {/* Secondary Arterial Rural Routes */}
          <path d="M 460,510 Q 590,570 780,510 T 1040,430" fill="none" opacity="0.35" stroke="#707972" strokeWidth="2.5" />
          <path d="M 720,290 Q 860,340 980,260" fill="none" opacity="0.3" stroke="#707972" strokeWidth="2" />

          {/* Active Transit Vectors */}
          {layers.transitRoutes && (
            <>
              {/* Route 1: Khed Farm Cluster to Sahyadri Agro Cold Hub */}
              <path
                className="animate-dash-flow"
                d="M 390,610 Q 480,520 620,440 T 715,310"
                fill="none"
                filter="url(#gisGlow)"
                stroke="#1f5c3d"
                strokeWidth="3.5"
              />
              {/* Route 2: Junnar Distress Bypass -> Narayanpur Mandi */}
              <path
                className="animate-dash-flow"
                d="M 520,380 C 580,360 690,390 840,460"
                fill="none"
                stroke="#ba1a1a"
                strokeWidth="3"
              />
              {/* Route 3: Narayangaon to Kisan Pulp Unit #4 */}
              <path
                className="animate-dash-flow"
                d="M 715,310 Q 820,310 930,270"
                fill="none"
                stroke="#515a96"
                strokeWidth="2.5"
              />
            </>
          )}

          {/* ========================================================================= */}
          {/* GEOSPATIAL THERMAL HEATMAP OVERLAYS (Ambient Temp & Rapid Decay Zones)   */}
          {/* ========================================================================= */}
          {layers.temperatureDecayHeatmap && (
            <g className="transition-opacity duration-500">
              {/* Thermal Cell 1: BARAMATI EXTREME HEAT PLUME (38°C - 41.2°C) */}
              <g className="animate-pulse" style={{ animationDuration: '4s' }}>
                <ellipse
                  cx="440"
                  cy="600"
                  rx={isHeatwaveSimulated ? "185" : "155"}
                  ry={isHeatwaveSimulated ? "135" : "110"}
                  fill="url(#thermalExtremePlume)"
                  filter="url(#thermalPulsingFilter)"
                />
                {/* 38°C Isothermal Contour Loop */}
                <ellipse
                  cx="440"
                  cy="600"
                  rx="115"
                  ry="80"
                  fill="none"
                  stroke="#ba1a1a"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                  opacity="0.75"
                />
                {/* 36°C Outer Contour Loop */}
                <ellipse
                  cx="440"
                  cy="600"
                  rx="145"
                  ry="105"
                  fill="none"
                  stroke="#f57c00"
                  strokeWidth="0.8"
                  strokeDasharray="6,4"
                  opacity="0.5"
                />
              </g>

              {/* Thermal Cell 2: KHED-CHAKAN TRANSIT THERMAL ACCELERATION CORRIDOR (32°C - 35°C) */}
              <g>
                <ellipse
                  cx="590"
                  cy="460"
                  rx={isHeatwaveSimulated ? "160" : "130"}
                  ry={isHeatwaveSimulated ? "110" : "90"}
                  fill="url(#thermalAcceleratedPlume)"
                  filter="url(#thermalPulsingFilter)"
                />
                <ellipse
                  cx="590"
                  cy="460"
                  rx="95"
                  ry="65"
                  fill="none"
                  stroke="#e65100"
                  strokeWidth="1"
                  strokeDasharray="5,4"
                  opacity="0.65"
                />
              </g>

              {/* Thermal Cell 3: NASHIK SOUTH HIGHWAY OPEN-AIR PLUME (32.5°C) */}
              <g>
                <ellipse
                  cx="800"
                  cy="350"
                  rx="140"
                  ry="95"
                  fill="url(#thermalModeratePlume)"
                  filter="url(#thermalPulsingFilter)"
                />
              </g>

              {/* Thermal Cell 4: SHIRUR-PUNE BASIN HEAT DOME (36°C) */}
              <g>
                <circle
                  cx="700"
                  cy="590"
                  r={isHeatwaveSimulated ? "120" : "95"}
                  fill="url(#thermalAcceleratedPlume)"
                  opacity="0.7"
                />
              </g>

              {/* COLD STORAGE MICROCLIMATE THERMAL SINK (Sahyadri Hub 4.1°C & Nashik Vault 4.2°C) */}
              {/* Cold Hub 1 Sink */}
              <g>
                <circle
                  cx="715"
                  cy="310"
                  r="70"
                  fill="url(#coldStorageThermalSink)"
                  filter="url(#gisGlow)"
                />
                <circle
                  cx="715"
                  cy="310"
                  r="35"
                  fill="none"
                  stroke="#26a69a"
                  strokeWidth="1.2"
                  strokeDasharray="2,3"
                  opacity="0.8"
                />
              </g>

              {/* Cold Hub 2 Sink */}
              <g>
                <circle
                  cx="1100"
                  cy="120"
                  r="60"
                  fill="url(#coldStorageThermalSink)"
                  opacity="0.65"
                />
              </g>
            </g>
          )}

          {/* Junnar Late Blight Biological Hazard Zone Overlay */}
          {layers.diseaseHeatmap && (
            <circle cx="530" cy="380" fill="url(#fungalRiskZone)" r="130" />
          )}
        </svg>

        {/* ========================================================================= */}
        {/* GEOSPATIAL LABELS & ISOTHERM ANNOTATIONS                                  */}
        {/* ========================================================================= */}
        {layers.temperatureDecayHeatmap && (
          <>
            {/* Critical Isotherm Label (Baramati) */}
            <div className="absolute top-[515px] left-[345px] pointer-events-none flex items-center gap-1 px-2 py-0.5 rounded bg-error/90 text-white font-mono text-[10px] font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>ISOTHERM: {isHeatwaveSimulated ? '41.2°C' : '38.0°C'} CRITICAL SENESCENCE</span>
            </div>

            {/* Accelerated Isotherm Label (Khed/Chakan) */}
            <div className="absolute top-[395px] left-[540px] pointer-events-none flex items-center gap-1 px-2 py-0.5 rounded bg-amber-600/90 text-white font-mono text-[10px] font-bold shadow-xs">
              <span>ISOTHERM: {isHeatwaveSimulated ? '35.6°C' : '32.4°C'} ACCELERATED RESPIRATION</span>
            </div>

            {/* Cold Sink Label */}
            <div className="absolute top-[250px] left-[700px] pointer-events-none flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800/90 text-emerald-100 font-mono text-[10px] font-bold shadow-xs">
              <span className="material-symbols-outlined text-[12px]">ac_unit</span>
              <span>4.1°C PRE-COOLING THERMAL SINK</span>
            </div>
          </>
        )}

        {/* Hazard Zone Label */}
        {layers.diseaseHeatmap && (
          <div className="absolute top-[340px] left-[450px] pointer-events-auto bg-error-container/95 backdrop-blur-xs border border-error px-3 py-1.5 rounded-lg shadow-sm">
            <div className="flex items-center gap-1.5 text-error font-label-sm text-label-sm font-bold">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                coronavirus
              </span>
              <span>Junnar District: Late Blight Alert</span>
            </div>
            <p className="font-body-sm text-[11px] leading-tight text-on-surface-variant font-medium">
              Humidity: 82% • RUL Degradation +35%
            </p>
          </div>
        )}

        {/* NH-60 Label */}
        <div className="absolute top-1/4 right-1/4 text-outline/60 font-label-sm text-label-sm tracking-widest pointer-events-none uppercase font-bold">
          NH-60 Agro Logistics Corridor (Pune — Nashik)
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE HIGH-RISK BATCH THERMAL HOTSPOT BEACONS                       */}
        {/* ========================================================================= */}
        {layers.temperatureDecayHeatmap &&
          visibleHotspots.map((hotspot) => {
            const temp = getSimulatedTemp(hotspot.currentAmbientTemp);
            const multiplier = getSimulatedMultiplier(hotspot.respirationMultiplier);
            const isSelected = selectedHotspot?.id === hotspot.id && isThermalInspectorOpen;

            return (
              <div
                key={hotspot.id}
                style={{ left: `${hotspot.coordinates.x}px`, top: `${hotspot.coordinates.y}px` }}
                className="absolute z-25 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                onClick={() => {
                  setSelectedHotspot(hotspot);
                  setIsThermalInspectorOpen(true);
                  if (hotspot.batchId && batches && onSelectBatch) {
                    const match = batches.find((b) => b.id === hotspot.batchId);
                    if (match) onSelectBatch(match);
                  }
                }}
              >
                {/* Pulsing ring for critical/accelerated risks */}
                {hotspot.riskLevel === 'critical' ? (
                  <div className="absolute -inset-3 bg-red-600/35 rounded-full animate-ping pointer-events-none" />
                ) : hotspot.riskLevel === 'accelerated' ? (
                  <div className="absolute -inset-2 bg-amber-500/25 rounded-full animate-ping pointer-events-none" />
                ) : null}

                {/* Hotspot Badge */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border transition-all duration-150 ${
                    isSelected
                      ? 'scale-110 ring-3 ring-primary ring-offset-2 bg-surface-container-lowest'
                      : 'hover:scale-105 bg-surface-container-lowest/95 backdrop-blur-xs'
                  } ${
                    hotspot.riskLevel === 'critical'
                      ? 'border-error text-error'
                      : hotspot.riskLevel === 'accelerated'
                      ? 'border-amber-600 text-amber-700'
                      : 'border-primary text-primary'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      hotspot.riskLevel === 'critical'
                        ? 'bg-error animate-pulse'
                        : hotspot.riskLevel === 'accelerated'
                        ? 'bg-amber-600'
                        : 'bg-primary'
                    }`}
                  />
                  <div className="text-left leading-none">
                    <div className="font-bold text-[11px] font-mono tracking-tight flex items-center gap-1">
                      <span>{hotspot.batchId}</span>
                      <span
                        className={`px-1 py-0.2 rounded text-[9px] font-extrabold ${
                          hotspot.riskLevel === 'critical'
                            ? 'bg-error text-white'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {temp}°C
                      </span>
                    </div>
                    <div className="text-[9px] text-on-surface-variant font-medium mt-0.5">
                      {multiplier}x Decay • RUL {hotspot.remainingUsefulLife.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* ========================================================================= */}
        {/* FACILITY PINS                                                             */}
        {/* ========================================================================= */}
        {/* Facility Pin 1: Sahyadri Agro Cold Hub */}
        {layers.coldStorage && (
          <div
            onClick={() =>
              handleFacilitySelect({
                name: 'Sahyadri Agro Cold Storage Hub',
                type: 'Active Cold Storage Node',
                distance: '12.4 km from distress cluster',
                chamber: 'Chamber 2: 4.1°C / 90% RH',
                capacityVacant: '320 Crates (12.8 Tons) Vacant',
                certification: 'Controlled Atmosphere (CA) Certified',
                fillLevel: 68,
                powerStatus: '100% Grid OK (72 hrs Diesel Aux)',
                pullDownRate: '2.4 hrs pull-down',
                isAllocated: false
              })
            }
            className="absolute top-[280px] left-[690px] z-20 group cursor-pointer"
          >
            <div className="absolute -inset-2 bg-primary/25 rounded-full animate-ping" />
            <div className="relative flex items-center gap-2 bg-surface-container-lowest border-2 border-primary text-primary px-3 py-1.5 rounded-full shadow-lg hover:scale-105 transition-all">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="material-symbols-outlined text-base">ac_unit</span>
              <div className="text-left leading-none pr-1">
                <div className="font-bold text-xs">Sahyadri Agro Cold Hub</div>
                <div className="text-[10px] text-on-surface-variant font-medium">68% full • 320 crates open</div>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed font-bold text-[10px] px-1.5 py-0.5 rounded">
                Grade A
              </span>
            </div>
          </div>
        )}

        {/* Facility Pin 2: Kisan Pulp & Ketchup Unit #4 */}
        {layers.processingUnits && (
          <div
            onClick={() =>
              handleFacilitySelect({
                name: 'Kisan Pulp & Processing Unit #4',
                type: 'Industrial Food Processing Node',
                distance: '8.2 km from Narayangaon',
                chamber: 'Intake Bay #3: Puree Line Active',
                capacityVacant: '20 Tonnes Open Quota',
                certification: 'FSSAI Industrial Grade Certified',
                fillLevel: 82,
                powerStatus: '100% Industrial Grid',
                pullDownRate: 'Instant pulp offload',
                isAllocated: false
              })
            }
            className="absolute top-[240px] left-[920px] z-20 group cursor-pointer"
          >
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-secondary text-secondary px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="material-symbols-outlined text-base">factory</span>
              <div className="text-left leading-none pr-1">
                <div className="font-bold text-xs">Kisan Pulp Unit #4</div>
                <div className="text-[10px] text-on-surface-variant">Processing Open • High Intake</div>
              </div>
            </div>
          </div>
        )}

        {/* Facility Pin 3: Narayanpur Wholesale Mandi */}
        {layers.wholesaleMandis && (
          <div
            onClick={() =>
              handleFacilitySelect({
                name: 'Narayanpur Wholesale Mandi',
                type: 'APMC Market Terminal',
                distance: '16.8 km via Expressway',
                chamber: 'Auction Yard 4 & Cold Transit Dock',
                capacityVacant: '1,200 Crates High Demand',
                certification: 'e-NAM Integrated Mandi',
                fillLevel: 85,
                powerStatus: 'APMC Continuous Power',
                pullDownRate: 'Direct buyer offload',
                isAllocated: false
              })
            }
            className="absolute top-[430px] left-[820px] z-20 group cursor-pointer"
          >
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-tertiary-container text-tertiary-container px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span className="material-symbols-outlined text-base">storefront</span>
              <div className="text-left leading-none pr-1">
                <div className="font-bold text-xs">Narayanpur Mandi</div>
                <div className="text-[10px] text-on-surface-variant">₹2,850/qtl • High Demand</div>
              </div>
            </div>
          </div>
        )}

        {/* Facility Pin 4: Nashik Central Hub (Amber warning) */}
        {layers.coldStorage && (
          <div
            onClick={() =>
              handleFacilitySelect({
                name: 'Nashik Central Storage Hub',
                type: 'Regional Cold Warehouse',
                distance: '24.1 km North Corridor',
                chamber: 'Vault 6: Onion & Pomegranate',
                capacityVacant: '12 Tonnes Slot Reserved',
                certification: 'CA Certified Cold Vault',
                fillLevel: 88,
                powerStatus: 'Diesel Aux Active',
                pullDownRate: '4.2°C Stabilized',
                isAllocated: false
              })
            }
            className="absolute top-[90px] left-[1080px] z-20 group cursor-pointer"
          >
            <div className="flex items-center gap-2 bg-surface-container-lowest border-2 border-amber-500 text-tertiary px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="material-symbols-outlined text-base text-amber-600">warehouse</span>
              <div className="text-left leading-none pr-1">
                <div className="font-bold text-xs">Nashik Central Hub</div>
                <div className="text-[10px] text-on-surface-variant font-semibold">88% Capacity (Near Full)</div>
              </div>
            </div>
          </div>
        )}

        {/* Live Moving Transit Marker 1 */}
        {layers.transitRoutes && (
          <div className="absolute top-[480px] left-[520px] z-20 cursor-pointer">
            <div className="flex items-center gap-1.5 bg-inverse-surface text-surface-container-lowest px-2.5 py-1 rounded-md shadow-xl border border-primary-fixed/40 hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-sm text-primary-fixed animate-bounce">
                local_shipping
              </span>
              <div>
                <div className="font-bold text-[11px] leading-tight font-mono">MH-14-AZ-4029</div>
                <div className="text-[9px] text-surface-variant">1,000kg Tomatoes • ETA 38m</div>
              </div>
            </div>
          </div>
        )}

        {/* Live Transit Marker 2 */}
        {layers.transitRoutes && (
          <div className="absolute top-[370px] left-[730px] z-20 cursor-pointer">
            <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant px-2 py-0.5 rounded shadow-md text-[10px] text-on-surface">
              <span className="material-symbols-outlined text-xs text-secondary">local_shipping</span>
              <span className="font-semibold font-mono">MH-12-RP-1188 (Pulp grade)</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING GIS LAYER DRAWER (LEFT OVERLAY) WITH THERMAL DECAY TELEMETRY  */}
      {/* ========================================================================= */}
      <section className="absolute top-4 left-4 z-20 w-84 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-16rem)] overflow-y-auto bg-surface-container-lowest/95 backdrop-blur-md rounded-xl border border-outline-variant shadow-lg p-4 space-y-3">
        {/* Control Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">layers</span>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">GIS Intelligence</h2>
          </div>
          <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[11px] font-bold rounded-full">
            v4.2 Live
          </span>
        </div>

        {/* Thermal Risk Telemetry Banner */}
        <div className="p-3 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-error font-bold text-xs">
              <span className="material-symbols-outlined text-sm animate-pulse">local_fire_department</span>
              <span>Ambient Thermal Decay Engine</span>
            </div>
            <button
              onClick={() => setIsHeatwaveSimulated(!isHeatwaveSimulated)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                isHeatwaveSimulated
                  ? 'bg-error text-white shadow-2xs'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
              title="Toggle +3.2°C midday heatwave condition"
            >
              {isHeatwaveSimulated ? '🔥 +3.2°C Active' : '⚡ Simulate Heatwave'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="bg-white/80 p-1.5 rounded-lg border border-red-100">
              <span className="text-outline text-[10px] block">Peak Ambient Heat</span>
              <span className="font-extrabold text-error text-sm font-mono">
                {isHeatwaveSimulated ? '41.2°C' : '38.0°C'}
              </span>
              <span className="text-[9px] text-error font-semibold block">Baramati Basin</span>
            </div>
            <div className="bg-white/80 p-1.5 rounded-lg border border-amber-100">
              <span className="text-outline text-[10px] block">Decay Multiplier</span>
              <span className="font-extrabold text-amber-700 text-sm font-mono">
                {isHeatwaveSimulated ? '4.8x' : '3.4x'}
              </span>
              <span className="text-[9px] text-on-surface-variant block">Above 20°C base</span>
            </div>
          </div>

          {/* Thermal Spectrum Scale Legend */}
          <div className="space-y-1 pt-0.5">
            <div className="flex justify-between text-[9px] text-outline font-bold">
              <span>&lt;25°C Safe</span>
              <span>30-35°C Fast</span>
              <span className="text-error">&gt;38°C Critical</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden flex shadow-2xs">
              <div className="w-1/4 bg-emerald-500" title="Safe Microclimate (<25°C)" />
              <div className="w-1/4 bg-yellow-400" title="Moderate (25-30°C)" />
              <div className="w-1/4 bg-amber-500" title="Accelerated Respiration (30-35°C)" />
              <div className="w-1/4 bg-red-600 animate-pulse" title="Critical Degradation (>36°C)" />
            </div>
          </div>
        </div>

        {/* Operational Counters */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <div className="text-[10px] font-label-sm text-on-surface-variant font-semibold">Cold Capacity</div>
            <div className="font-headline-sm text-base font-bold text-primary flex items-baseline gap-1">
              74% <span className="text-[10px] font-normal text-outline">avg</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-primary-container h-full w-[74%]" />
            </div>
          </div>
          <div className="p-2 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <div className="text-[10px] font-label-sm text-on-surface-variant font-semibold">Intake Open</div>
            <div className="font-headline-sm text-base font-bold text-secondary flex items-baseline gap-1">
              85 <span className="text-[10px] font-normal text-outline">Tonnes</span>
            </div>
            <div className="text-[9px] text-primary font-semibold mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[11px]">check_circle</span> 4 plants ready
            </div>
          </div>
        </div>

        {/* Distress Alert Pill */}
        <div className="p-2.5 bg-error-container/85 rounded-lg border border-error/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-error text-lg animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <div>
              <p className="font-label-sm text-xs text-on-error-container font-bold">4 Batches in Distress</p>
              <p className="text-[10px] text-on-surface-variant">RUL &lt; 24h due to ambient heat &amp; blight</p>
            </div>
          </div>
          <button
            onClick={onRerouteDistress}
            className="px-2.5 py-1 bg-error hover:bg-on-error-container text-on-error rounded font-label-sm text-[11px] font-bold transition-colors cursor-pointer active:scale-95 shadow-2xs"
          >
            Reroute
          </button>
        </div>

        {/* Layer Selector Toggles */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-bold">
              Visible Map Layers
            </p>
            {layers.temperatureDecayHeatmap && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setThermalRiskFilter('all')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                    thermalRiskFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setThermalRiskFilter('critical')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                    thermalRiskFilter === 'critical'
                      ? 'bg-error text-white'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  &gt;36°C
                </button>
              </div>
            )}
          </div>

          {/* PRIMARY TOGGLE: Ambient Thermal Decay Heatmap */}
          <label className="flex items-center justify-between p-1.5 rounded-lg bg-red-50/70 border border-red-200 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error ring-2 ring-red-300 animate-pulse" />
              <div>
                <span className="font-label-md text-xs text-red-950 font-bold block leading-tight">
                  Ambient Heat &amp; Rapid Decay Heatmap
                </span>
                <span className="text-[9px] text-red-700">Highlights batches at risk (&gt;31°C)</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={layers.temperatureDecayHeatmap}
              onChange={() => toggleLayer('temperatureDecayHeatmap')}
              className="rounded border-outline-variant text-error focus:ring-error h-3.5 w-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary-fixed" />
              <span className="font-label-md text-xs text-on-surface">Active Transit Routes (14 trucks)</span>
            </div>
            <input
              type="checkbox"
              checked={layers.transitRoutes}
              onChange={() => toggleLayer('transitRoutes')}
              className="rounded border-outline-variant text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
              <span className="font-label-md text-xs text-on-surface">Cold Storage Hubs (Capacity)</span>
            </div>
            <input
              type="checkbox"
              checked={layers.coldStorage}
              onChange={() => toggleLayer('coldStorage')}
              className="rounded border-outline-variant text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-secondary-fixed" />
              <span className="font-label-md text-xs text-on-surface">Food Processing Units</span>
            </div>
            <input
              type="checkbox"
              checked={layers.processingUnits}
              onChange={() => toggleLayer('processingUnits')}
              className="rounded border-outline-variant text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container ring-2 ring-tertiary-fixed" />
              <span className="font-label-md text-xs text-on-surface">Wholesale Mandis</span>
            </div>
            <input
              type="checkbox"
              checked={layers.wholesaleMandis}
              onChange={() => toggleLayer('wholesaleMandis')}
              className="rounded border-outline-variant text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded-lg bg-surface-container-high/40 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error ring-2 ring-error-container" />
              <span className="font-label-md text-xs text-error font-bold">Disease &amp; Fungal Heatmap</span>
            </div>
            <input
              type="checkbox"
              checked={layers.diseaseHeatmap}
              onChange={() => toggleLayer('diseaseHeatmap')}
              className="rounded border-outline-variant text-error focus:ring-error h-3.5 w-3.5 cursor-pointer"
            />
          </label>
        </div>

        {/* Weather GIS Telemetry */}
        <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-outline">thermostat</span>
            <span>Surface: {isHeatwaveSimulated ? '34.6°C' : '31.4°C'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-outline">air</span>
            <span>Wind: 14 km/h SW</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE THERMAL DECAY INSPECTOR CARD (FLOATING OVERLAY)             */}
      {/* ========================================================================= */}
      {selectedHotspot && isThermalInspectorOpen && layers.temperatureDecayHeatmap && (
        <aside className="absolute top-4 right-16 z-30 w-88 max-w-[calc(100vw-5rem)] bg-surface-container-lowest/98 backdrop-blur-md rounded-2xl border border-red-300 shadow-2xl p-4 space-y-3 transition-all animate-fadeIn">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-outline-variant/40 pb-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    selectedHotspot.riskLevel === 'critical'
                      ? 'bg-error text-white'
                      : selectedHotspot.riskLevel === 'accelerated'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {selectedHotspot.riskLevel === 'critical' ? '🔥 Critical Thermal Spoilage' : '⚠️ Accelerated Heat Decay'}
                </span>
                <span className="text-[11px] font-mono text-outline font-bold">{selectedHotspot.batchId}</span>
              </div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                {selectedHotspot.cropName}
              </h3>
              <p className="text-[11px] text-on-surface-variant">{selectedHotspot.producer}</p>
            </div>
            <button
              onClick={() => setIsThermalInspectorOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* Thermal Telemetry Bento Block */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-red-900 font-bold uppercase">Ambient Temp</span>
                <span className="material-symbols-outlined text-sm text-error">thermostat</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-error font-mono">
                  {getSimulatedTemp(selectedHotspot.currentAmbientTemp)}°C
                </span>
                <span className="text-[10px] text-red-700 font-semibold">
                  (Safe: {selectedHotspot.safeTempThreshold}°C)
                </span>
              </div>
              <div className="text-[9px] text-error font-medium mt-0.5">
                +{+(getSimulatedTemp(selectedHotspot.currentAmbientTemp) - selectedHotspot.safeTempThreshold).toFixed(1)}°C Thermal Excess
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-900 font-bold uppercase">Decay Velocity</span>
                <span className="material-symbols-outlined text-sm text-amber-700">speed</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-amber-800 font-mono">
                  {getSimulatedMultiplier(selectedHotspot.respirationMultiplier)}x
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">Q10 Rate</span>
              </div>
              <div className="text-[9px] text-amber-800 font-medium mt-0.5">
                RUL: <strong>{selectedHotspot.remainingUsefulLife}</strong>
              </div>
            </div>
          </div>

          {/* Biological Degradation Explanation */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-sm text-error">biotechnology</span>
              <span>Biological Heat Mechanism:</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              {selectedHotspot.decayMechanism}
            </p>
          </div>

          {/* Recommended AI Dispatch Intervention */}
          <div className="p-2.5 rounded-xl bg-primary-fixed/20 border border-primary-container/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-sm">alt_route</span>
              <span>AI Thermal Rescue Intervention:</span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium">
              {selectedHotspot.recommendedAction}
            </p>
          </div>

          {/* Direct Rescue Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onRouteDiversion(selectedHotspot.cropName);
                setIsThermalInspectorOpen(false);
              }}
              className="h-9 px-3 rounded-lg bg-secondary hover:bg-secondary/90 text-white font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">ac_unit</span>
              <span>Reroute to Cold Hub</span>
            </button>
            <button
              onClick={() => {
                onRerouteDistress();
                setIsThermalInspectorOpen(false);
              }}
              className="h-9 px-3 rounded-lg bg-error hover:bg-on-error-container text-white font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">emergency</span>
              <span>Emergency Dispatch</span>
            </button>
          </div>
          {onOpenCompareModal && selectedHotspot.batchId && (
            <button
              onClick={() => {
                onOpenCompareModal(selectedHotspot.batchId);
                setIsThermalInspectorOpen(false);
              }}
              className="w-full h-8 mt-1 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/60 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm text-primary">compare_arrows</span>
              <span>Compare Decay Trajectory Side-by-Side</span>
            </button>
          )}
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 4. MAP FLOATING UTILITIES (Zoom, Reset, Recenter, 3D Mode)                */}
      {/* ========================================================================= */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg p-1 shadow-md">
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6))}
          className="p-2 hover:bg-surface-container rounded text-on-surface cursor-pointer"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75))}
          className="p-2 hover:bg-surface-container rounded text-on-surface cursor-pointer"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <div className="h-px bg-outline-variant/60 my-0.5" />
        <button
          onClick={() => setZoomLevel(1)}
          className="p-2 hover:bg-surface-container rounded text-on-surface cursor-pointer"
          title="Recenter Map"
        >
          <span className="material-symbols-outlined text-lg">my_location</span>
        </button>
        <button
          onClick={() => setTerrainMode(!terrainMode)}
          className={`p-2 rounded cursor-pointer ${terrainMode ? 'bg-primary-container text-white' : 'hover:bg-surface-container text-on-surface'}`}
          title="3D Terrain Mode"
        >
          <span className="material-symbols-outlined text-lg">landscape</span>
        </button>
        {/* Quick Thermal Toggle Shortcut */}
        <button
          onClick={() => toggleLayer('temperatureDecayHeatmap')}
          className={`p-2 rounded cursor-pointer transition-colors ${
            layers.temperatureDecayHeatmap ? 'bg-red-600 text-white' : 'hover:bg-surface-container text-on-surface'
          }`}
          title="Toggle Thermal Heat-Map"
        >
          <span className="material-symbols-outlined text-lg">local_fire_department</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM FLOATING DISPATCH & FACILITY TRAY                                */}
      {/* ========================================================================= */}
      <section className="absolute bottom-4 left-4 right-4 z-30 bg-surface-container-lowest/98 backdrop-blur-md rounded-2xl border border-outline-variant shadow-2xl p-4 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Node Summary */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                ac_unit
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-fixed text-on-primary-fixed">
                  {selectedFacility.type}
                </span>
                <span className="text-xs text-outline">• {selectedFacility.distance}</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                {selectedFacility.name}
              </h3>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant flex items-center gap-2 sm:gap-3 flex-wrap">
                <span>
                  <strong className="text-on-surface font-semibold">{selectedFacility.chamber}</strong>
                </span>
                <span>•</span>
                <span>
                  <strong className="text-primary font-bold">{selectedFacility.capacityVacant}</strong>
                </span>
                <span>•</span>
                <span className="text-xs font-semibold text-secondary">{selectedFacility.certification}</span>
              </p>
            </div>
          </div>

          {/* Capacity Metric Blocks */}
          <div className="flex items-center gap-4 sm:gap-6 border-y lg:border-y-0 lg:border-x border-outline-variant/60 py-2 lg:py-0 px-0 lg:px-6">
            <div>
              <div className="text-[11px] font-label-sm text-outline font-semibold">Current Fill Level</div>
              <div className="font-headline-sm text-lg font-bold text-on-surface">
                {selectedFacility.fillLevel}% <span className="text-xs text-primary font-normal">Optimal</span>
              </div>
              <div className="w-24 sm:w-28 bg-surface-variant rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${selectedFacility.fillLevel}%` }}
                />
              </div>
            </div>
            <div>
              <div className="text-[11px] font-label-sm text-outline font-semibold">Power / Solar Hybrid</div>
              <div className="font-headline-sm text-lg font-bold text-on-surface">
                100% <span className="text-xs text-primary font-normal">Grid OK</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1 font-medium">Backup: 72 hrs Diesel Aux</p>
            </div>
            <div className="hidden sm:block">
              <div className="text-[11px] font-label-sm text-outline font-semibold">Pre-cooling Rate</div>
              <div className="font-headline-sm text-lg font-bold text-on-surface">
                {selectedFacility.pullDownRate}
              </div>
              <p className="text-[10px] text-primary font-semibold mt-1">Ready for intake</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => onContactFacility(selectedFacility.name)}
              className="h-11 px-3.5 rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-variant text-on-surface font-label-md text-xs sm:text-sm flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>Contact</span>
            </button>
            <button
              onClick={() => onRouteDiversion(selectedFacility.name)}
              className="h-11 px-3.5 rounded-lg bg-secondary hover:brightness-110 text-on-secondary font-label-md text-xs sm:text-sm flex items-center gap-1.5 transition-colors active:scale-95 shadow-xs cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-base">alt_route</span>
              <span>Route Diversion</span>
            </button>
            <button
              onClick={handleReserveClick}
              className={`h-11 px-4 rounded-lg font-label-md text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer font-bold ${
                selectedFacility.isAllocated
                  ? 'bg-primary text-white'
                  : 'bg-primary-container hover:bg-primary text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                {selectedFacility.isAllocated ? 'check_circle' : 'lock_clock'}
              </span>
              <span>
                {selectedFacility.isAllocated ? '10 Tons Allocated!' : 'Reserve 10 Tons Allocation'}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
