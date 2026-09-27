/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab, HarvestBatch, ProcessingContract } from './types';
import { INITIAL_BATCHES } from './data/mockData';
import { SideNavBar } from './components/layout/SideNavBar';
import { TopNavBar } from './components/layout/TopNavBar';
import { LiveHarvestBatches } from './components/overview/LiveHarvestBatches';
import { ImpactCommandCenter } from './components/overview/ImpactCommandCenter';
import { GisMapIntelligence } from './components/coldstorage/GisMapIntelligence';
import { MarketMandisView } from './components/mandis/MarketMandisView';
import { ProcessingView } from './components/processing/ProcessingView';
import { PolicyAnalyticsView } from './components/policy/PolicyAnalyticsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { EmergencyDispatchModal } from './components/dispatch/EmergencyDispatchModal';
import { BatchIngestionModal } from './components/batch/BatchIngestionModal';
import { BatchCompareModal } from './components/batch/BatchCompareModal';
import { DocumentationModal } from './components/help/DocumentationModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [overviewSubTab, setOverviewSubTab] = useState<'dispatch' | 'command'>('dispatch');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Batches state
  const [batches, setBatches] = useState<HarvestBatch[]>(INITIAL_BATCHES);
  const [selectedBatch, setSelectedBatch] = useState<HarvestBatch>(INITIAL_BATCHES[0]);

  // Search & Sync State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('Last synced 2 min ago');

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareBatchAId, setCompareBatchAId] = useState<string | undefined>(undefined);
  const [compareBatchBId, setCompareBatchBId] = useState<string | undefined>(undefined);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalTitle, setDocModalTitle] = useState('CropShield 360 — System Architecture & Documentation');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger sync
  const handleTriggerSync = () => {
    setIsSyncing(true);
    addToast('info', 'Synchronizing Telemetry...', 'Connecting with 8 FPO mesh gateways & cold storage sensors.');
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedText('Synced just now');
      addToast('success', 'Telemetry Synchronized', 'All 48 batches and reefer trucks updated to latest GPS and temperature.');
    }, 1500);
  };

  // Actions on batches
  const handleConfirmMandi = (batch: HarvestBatch) => {
    addToast(
      'success',
      `Mandi Slot Confirmed: ${batch.destinationName}`,
      `Batch ${batch.id} (${batch.cropName}) routed. Estimated realization: ${batch.economicPreservedValue}.`
    );
  };

  const handleDivertRoute = (batch: HarvestBatch) => {
    addToast(
      'warning',
      `Route Diverted: Sahyadri Cold Chamber C-2`,
      `Batch ${batch.id} rerouted to pre-cooling vault. Shelf-life extended by +18 days.`
    );
  };

  const handleBatchActionClick = (batch: HarvestBatch) => {
    if (batch.actionType === 'map') {
      setActiveTab('cold-storage');
      addToast('info', 'Navigating to GIS Corridor', `Inspecting transit route for batch ${batch.id}`);
    } else if (batch.actionType === 'chamber') {
      setActiveTab('cold-storage');
      addToast('info', 'Cold Chamber Selected', `Viewing Sahyadri Cold Vault 2 occupancy.`);
    } else if (batch.actionType === 'contract') {
      setActiveTab('market-mandis');
      addToast('success', 'Buyout Contract Verified', `Kisan Pulp buyout contract active for batch ${batch.id}`);
    } else {
      addToast('success', 'Vehicle Assigned', `Fleet truck #MH-12-AP-8902 scheduled for ${batch.id}`);
    }
  };

  const handleOpenCompare = (batchAId?: string, batchBId?: string) => {
    setCompareBatchAId(batchAId || selectedBatch?.id || batches[0]?.id);
    setCompareBatchBId(batchBId);
    setIsCompareModalOpen(true);
  };

  const handleAddBatch = (newBatch: HarvestBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatch(newBatch);
    setActiveTab('overview');
    setOverviewSubTab('dispatch');
    addToast('success', 'Batch Ingested Successfully', `New ${newBatch.cropName} batch ${newBatch.id} analyzed and added to registry.`);
  };

  const handleEmergencyDispatchConfirm = (batchId: string, route: string, vehicleId: string) => {
    // update batch status
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: `Dispatched to ${route}`,
              statusType: 'en-route',
              routeType: 'Emergency Exit Route' as any
            }
          : b
      )
    );
    addToast(
      'error',
      'Emergency Dispatch Authorized!',
      `Batch ${batchId} dispatched via ${vehicleId} to ${route}. Driver navigation notified.`
    );
  };

  const handleLockContract = (contract: ProcessingContract) => {
    addToast(
      'success',
      `Contract Allocation Locked: ${contract.plantName}`,
      `Locked quota ${contract.intakeQuota} at guaranteed price ${contract.fixedFloorPrice}/kg. Fast-lane weighbridge cleared.`
    );
  };

  const handleBroadcastAdvisory = (payload: { cluster: string; commodity: string; category: string; message: string }) => {
    addToast(
      'success',
      `Advisory Broadcast Sent: ${payload.category}`,
      `Pushed to 1,420 smallholder farmers via P2P mesh and SMS. Estimated ~45 MT produce mobilized.`
    );
  };

  const handleTabSelection = (tab: NavigationTab) => {
    if (tab === 'documentation') {
      setDocModalTitle('CropShield 360 — System Architecture & Documentation');
      setIsDocModalOpen(true);
    } else if (tab === 'system-help') {
      setDocModalTitle('CropShield 360 — System Help & Field Troubleshooting');
      setIsDocModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Filtered batches by global search query if present
  const searchedBatches = batches.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.cropName.toLowerCase().includes(q) ||
      b.variety.toLowerCase().includes(q) ||
      b.producer.toLowerCase().includes(q) ||
      b.origin.toLowerCase().includes(q) ||
      b.destinationName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-row">
      {/* 1. PERSISTENT SIDE NAVIGATION BAR */}
      <SideNavBar
        activeTab={activeTab}
        onSelectTab={handleTabSelection}
        onOpenEmergencyDispatch={() => setIsEmergencyModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. MAIN WORKSPACE CONTENT CANVAS */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-background min-w-0">
        {/* Persistent Top Navigation Bar */}
        <TopNavBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onTriggerSync={handleTriggerSync}
          isSyncing={isSyncing}
          lastSyncedText={lastSyncedText}
          onOpenNotifications={() => {
            addToast('info', 'Active Notifications', '3 critical warnings: Junnar Late Blight, 18h RUL Tomato, Cold Bay 88%.');
          }}
          unreadCount={3}
        />

        {/* Dynamic View Header Sub-Tabs for Overview */}
        {activeTab === 'overview' && (
          <div className="px-6 pt-4 pb-0 bg-background border-b border-outline-variant/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOverviewSubTab('dispatch')}
                className={`px-4 py-2.5 rounded-t-lg font-label-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                  overviewSubTab === 'dispatch'
                    ? 'border-primary text-primary bg-surface-container-lowest'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">alt_route</span>
                <span>Live Harvest Batches &amp; Dispatch</span>
              </button>
              <button
                onClick={() => setOverviewSubTab('command')}
                className={`px-4 py-2.5 rounded-t-lg font-label-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                  overviewSubTab === 'command'
                    ? 'border-primary text-primary bg-surface-container-lowest'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">monitoring</span>
                <span>Operations &amp; Impact Command</span>
                <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                  SIH 2026
                </span>
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-outline pb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Real-time ADDT twin stream active</span>
            </div>
          </div>
        )}

        {/* MAIN BODY VIEW CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {overviewSubTab === 'dispatch' ? (
                <LiveHarvestBatches
                  batches={searchedBatches}
                  selectedBatch={selectedBatch}
                  onSelectBatch={setSelectedBatch}
                  onConfirmMandi={handleConfirmMandi}
                  onDivertRoute={handleDivertRoute}
                  onOpenIngestionModal={() => setIsIngestionModalOpen(true)}
                  onOpenCompareModal={handleOpenCompare}
                  onExportCSV={() => {
                    addToast('info', 'Exporting CSV Manifest', 'Downloading active batch registry with decay telemetry.');
                  }}
                  onActionClick={handleBatchActionClick}
                />
              ) : (
                <ImpactCommandCenter
                  onViewAllBatches={() => setOverviewSubTab('dispatch')}
                  onDispatchMandiTruck={() => {
                    setIsEmergencyModalOpen(true);
                  }}
                  onReallocateBays={() => {
                    setActiveTab('cold-storage');
                    addToast('info', 'Storage Bays Opened', 'Viewing cold storage hub capacity in Nashik.');
                  }}
                  onConfirmHandoff={() => {
                    setActiveTab('market-mandis');
                    addToast('success', 'Processing Handoff Initiated', '20 tonnes allocated to AgroPure Puree Plant.');
                  }}
                  onExportReport={() => {
                    addToast('success', 'Report Exported', 'Full SIH 2026 impact and carbon offset audit report downloaded.');
                  }}
                />
              )}
            </>
          )}

          {/* TAB 2: COLD STORAGE (GIS MAP) */}
          {activeTab === 'cold-storage' && (
            <GisMapIntelligence
              batches={batches}
              onSelectBatch={(batch) => {
                setSelectedBatch(batch);
                addToast('info', `Batch Selected: ${batch.id}`, `Inspecting thermal stress and decay projection for ${batch.cropName}`);
              }}
              onRerouteDistress={() => setIsEmergencyModalOpen(true)}
              onContactFacility={(facilityName) => {
                addToast('info', `Connecting to ${facilityName}`, 'Opening direct VoIP hotline to Hub Dispatcher.');
              }}
              onRouteDiversion={(facilityName) => {
                addToast('warning', `Route Diversion Vector Set`, `Truck MH-14-AZ-4029 redirected to ${facilityName}.`);
              }}
              onReserveAllocation={(facilityName) => {
                addToast('success', `Allocation Confirmed at ${facilityName}`, '10 Tons locked in Chamber 2 (4.1°C / 90% RH).');
              }}
              onOpenCompareModal={handleOpenCompare}
            />
          )}

          {/* TAB 3: PROCESSING */}
          {activeTab === 'processing' && (
            <ProcessingView
              onLockContract={handleLockContract}
              onPostNewContract={() => {
                addToast('info', 'Contract Intake Portal', 'Industrial processor onboarding form initialized.');
              }}
            />
          )}

          {/* TAB 4: MARKET MANDIS */}
          {activeTab === 'market-mandis' && (
            <MarketMandisView
              onRouteInTransit={() => {
                addToast('warning', 'Urban Deficit Redirection', 'Pushed rerouting directives to 5 cold reefer trucks toward Mumbai/Pune.');
              }}
              onLockContract={handleLockContract}
              onBroadcastAdvisory={handleBroadcastAdvisory}
              onPostPurchaseContract={() => {
                addToast('info', 'Post Purchase Contract', 'Opening buyer floor purchase tender interface.');
              }}
              onExportLedger={() => {
                addToast('info', 'Ledger Exported', 'Downloading verified processor off-take and weighbridge ledger CSV.');
              }}
            />
          )}

          {/* TAB 5: POLICY ANALYTICS */}
          {activeTab === 'policy-analytics' && (
            <PolicyAnalyticsView
              onExportCarbonAudit={() => {
                addToast('success', 'Carbon Audit Generated', '142 MT CO2e offset certificate exported.');
              }}
              onDownloadPolicyReport={() => {
                addToast('success', 'Policy Report Downloaded', 'Maharashtra State Agriculture Department Governance Briefing (PDF).');
              }}
              onDraftStateBroadcast={() => {
                setActiveTab('market-mandis');
                addToast('info', 'Broadcast Composer Opened', 'Draft state advisory directive below.');
              }}
            />
          )}

          {/* TAB 6: ADMIN SETTINGS */}
          {activeTab === 'admin-settings' && (
            <AdminSettingsView
              onSaveSettings={() => {
                addToast('success', 'Configuration Saved', 'Edge nodes updated with new parameters.');
              }}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      <EmergencyDispatchModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        criticalBatches={batches.filter((b) => b.healthScore < 70)}
        onConfirmEmergencyDispatch={handleEmergencyDispatchConfirm}
      />

      <BatchIngestionModal
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        onAddBatch={handleAddBatch}
      />

      <BatchCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        batches={batches}
        initialBatchAId={compareBatchAId}
        initialBatchBId={compareBatchBId}
        onConfirmMandi={handleConfirmMandi}
        onDivertRoute={handleDivertRoute}
      />

      <DocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        title={docModalTitle}
      />

      {/* TOAST NOTIFICATION CONTAINER */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
