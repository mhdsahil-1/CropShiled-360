import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgColor =
    toast.type === 'success'
      ? 'bg-primary text-white border-primary-fixed'
      : toast.type === 'error'
      ? 'bg-error text-white border-error-container'
      : toast.type === 'warning'
      ? 'bg-tertiary-container text-white border-tertiary-fixed'
      : 'bg-secondary text-white border-secondary-fixed';

  const icon =
    toast.type === 'success'
      ? 'check_circle'
      : toast.type === 'error'
      ? 'error'
      : toast.type === 'warning'
      ? 'warning'
      : 'info';

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${bgColor}`}
    >
      <span className="material-symbols-outlined text-xl shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
      <div className="flex-1">
        <h5 className="font-bold text-xs leading-snug">{toast.title}</h5>
        {toast.description && <p className="text-[11px] opacity-90 mt-0.5 leading-tight">{toast.description}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-70 hover:opacity-100 p-0.5 rounded cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
