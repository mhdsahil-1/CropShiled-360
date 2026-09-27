export type NavigationTab = 
  | 'overview' 
  | 'cold-storage' 
  | 'processing' 
  | 'market-mandis' 
  | 'policy-analytics' 
  | 'admin-settings'
  | 'documentation'
  | 'system-help';

export type QualityGrade = 'Grade A' | 'Grade A+' | 'Grade B' | 'Grade C';

export interface HarvestBatch {
  id: string;
  cropName: string;
  variety: string;
  scientificName?: string;
  grade: QualityGrade;
  gradeLabel: string;
  weightKg: number;
  status: string;
  statusType: 'en-route' | 'confirmed' | 'emergency' | 'pooling' | 'delivered';
  producer: string;
  origin: string;
  harvestedTimeAgo: string;
  healthScore: number;
  healthDescription: string;
  shelfLifeRemaining: string;
  shelfLifeContext: string;
  routeType: 'AI Prescribed Mandi' | 'Diverted Preservation Route' | 'Processing Plant Bypass' | 'Terminal Mandi';
  destinationName: string;
  destinationPriceContext: string;
  actionButtonText: string;
  actionIcon: string;
  actionType: 'map' | 'chamber' | 'contract' | 'assign';
  // Diagnostic details for Digital Twin
  modelName: string;
  imageUrl: string;
  imageAlt: string;
  aiConfidence: number;
  pestSurfaceScars: string;
  pestPercentage: number;
  respirationRate: string;
  respirationPercentage: number;
  ambientTransitTemp: string;
  tempPercentage: number;
  transitEta: string;
  routeId: string;
  mapImageUrl: string;
  economicPreservedValue: string;
  economicComparison: string;
  isExpedited?: boolean;
}

export interface CommodityRate {
  id: string;
  category: string;
  name: string;
  scientificName: string;
  priceRange: string;
  unit: string;
  trendText: string;
  trendPositive: boolean;
  statusNote: string;
  statusColor: string;
  demandMetricName: string;
  demandMetricValue: string;
  demandBarPercentage: number;
  demandBarColor: string;
}

export interface ProcessingContract {
  id: string;
  contractNumber: string;
  plantName: string;
  location: string;
  isVerified: boolean;
  isHighCapacity?: boolean;
  fixedFloorPrice: string;
  intakeQuota: string;
  acceptedQuality: string;
  paymentClearance: string;
  deliveryWindow: string;
  buttonLabel: string;
  quotaTonnes: number;
}

export interface DispatchLedgerEntry {
  id: string;
  batchId: string;
  fpoOrigin: string;
  commodity: string;
  grade: QualityGrade;
  buyer: string;
  netVolume: string;
  pricePerKg: string;
  gateStatus: string;
  statusColor: 'green' | 'blue' | 'amber';
}

export interface AdvisoryBroadcast {
  id: string;
  type: 'Late Blight Warning' | 'Tomato Price Surge' | 'Cold Storage Slot Opening' | 'Rainfall Advisory';
  cluster: string;
  timeAgo: string;
  message: string;
  reach: string;
  deliveredChannel: string;
  isCritical?: boolean;
}
