import React, { useState } from 'react';
import { USER_AVATAR_IMAGE } from '../../data/mockData';

interface TopNavBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleMobileNav: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  lastSyncedText: string;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  searchQuery,
  onSearchChange,
  onToggleMobileNav,
  onTriggerSync,
  isSyncing,
  lastSyncedText,
  onOpenNotifications,
  unreadCount = 3
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'FPO Coordinator' | 'Processing Plant Manager' | 'Government Policy Analyst'>('FPO Coordinator');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 w-full bg-surface-container-lowest shadow-xs border-b border-outline-variant">
      {/* Left side: Mobile Toggle & Search bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-sm">search</span>
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-body-sm font-body-sm bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
            placeholder="Search Batch ID, Farmer, Mandi, or Hub..."
            type="search"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Center: Status sync chips */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-fixed/30 border border-primary-container text-primary font-label-sm text-label-sm shadow-2xs">
          <span className={`w-2 h-2 rounded-full bg-primary ${isSyncing ? 'animate-ping' : 'animate-pulse'}`} />
          <span className="font-semibold">Online — Synced</span>
          <span className="text-on-surface-variant opacity-80 text-[11px] ml-1">
            ({lastSyncedText})
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm border border-secondary/20 hover:bg-secondary-container/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            <span className="font-bold">{selectedRole}</span>
            <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
          </button>

          {showRoleMenu && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-1.5 z-50 text-xs">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-outline">Switch Stakeholder Role</div>
              {[
                { role: 'FPO Coordinator', desc: 'Nashik Cluster 04 (Field & Batches)' },
                { role: 'Processing Plant Manager', desc: 'MIDC Intake & Direct Buyout' },
                { role: 'Government Policy Analyst', desc: 'State Agri Dept / SIH 2026 Audit' }
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    setSelectedRole(item.role as any);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex flex-col hover:bg-surface-container-low transition-colors ${
                    selectedRole === item.role ? 'bg-primary-fixed/20 font-bold text-primary' : 'text-on-surface'
                  }`}
                >
                  <span className="font-semibold">{item.role}</span>
                  <span className="text-[10px] text-outline">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side trailing action cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Trailing action: Sync Now */}
        <button
          onClick={onTriggerSync}
          disabled={isSyncing}
          className="h-9 px-3 sm:px-4 flex items-center gap-2 bg-primary-container text-surface-container-lowest rounded-lg font-label-md text-label-md hover:bg-primary transition-all active:scale-95 duration-100 shadow-sm cursor-pointer disabled:opacity-75"
        >
          <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span className="hidden sm:inline font-semibold">{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>

        {/* Icon actions: notifications & tune */}
        <button
          onClick={onOpenNotifications}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest animate-pulse" />
          )}
        </button>

        <div className="h-6 w-px bg-outline-variant mx-1" />

        {/* Stakeholder profile avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs ring-2 ring-outline-variant overflow-hidden shrink-0">
            <img
              src={USER_AVATAR_IMAGE}
              alt="FPO Coordinator avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to text initials if external image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="initials-fallback">FC</span>
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-label-sm text-label-sm text-on-surface leading-tight font-bold">
              Rajesh Sharma
            </span>
            <span className="text-[11px] text-outline">
              Nashik Cluster 04
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
