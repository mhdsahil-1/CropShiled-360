import React from 'react';
import { NavigationTab } from '../../types';

interface SideNavBarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenEmergencyDispatch: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenEmergencyDispatch,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'cold-storage', label: 'Cold Storage', icon: 'ac_unit' },
    { id: 'processing', label: 'Processing', icon: 'factory' },
    { id: 'market-mandis', label: 'Market Mandis', icon: 'storefront' },
    { id: 'policy-analytics', label: 'Policy Analytics', icon: 'analytics' },
    { id: 'admin-settings', label: 'Admin Settings', icon: 'admin_panel_settings' },
  ];

  const handleNavClick = (id: NavigationTab) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 flex flex-col p-4 bg-inverse-surface border-r border-outline-variant shadow-xl justify-between select-none transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header / Brand identity */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-primary-fixed shadow-sm">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-surface-container-lowest tracking-tight">
                  CropShield 360
                </span>
                <span className="font-label-sm text-label-sm text-surface-variant">
                  Agri-Supply Engine
                </span>
              </div>
            </div>
            {/* Close button for mobile */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden text-surface-variant hover:text-white p-1 rounded-md"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* Emergency Dispatch CTA */}
          <button
            onClick={() => {
              onOpenEmergencyDispatch();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full h-11 flex items-center justify-center gap-2 bg-error text-on-error rounded-lg font-label-md text-label-md tracking-wide hover:brightness-110 active:scale-[0.98] transition-all shadow-md group cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-sm group-hover:animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
            <span className="font-bold">Emergency Dispatch</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all duration-150 active:scale-[0.99] text-left cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container border-l-4 border-primary-fixed shadow-xs font-bold'
                      : 'text-surface-variant hover:text-surface-container-lowest hover:bg-on-surface-variant/20'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SideNav Footer Tabs */}
        <div className="pt-4 border-t border-outline-variant/30 space-y-1">
          <div className="px-3 py-2 bg-on-surface-variant/10 rounded-lg mb-2 flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-surface-variant">SIH 2026 Core #6</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-fixed text-on-primary-fixed rounded">
              v2.4 ADDT
            </span>
          </div>
          <button
            onClick={() => handleNavClick('documentation')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-label-md text-label-md transition-colors text-left cursor-pointer ${
              activeTab === 'documentation'
                ? 'bg-primary-container text-on-primary-container'
                : 'text-surface-variant hover:text-surface-container-lowest hover:bg-on-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined text-lg">menu_book</span>
            <span>Documentation</span>
          </button>
          <button
            onClick={() => handleNavClick('system-help')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-label-md text-label-md transition-colors text-left cursor-pointer ${
              activeTab === 'system-help'
                ? 'bg-primary-container text-on-primary-container'
                : 'text-surface-variant hover:text-surface-container-lowest hover:bg-on-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined text-lg">help</span>
            <span>System Help</span>
          </button>
        </div>
      </aside>
    </>
  );
};
