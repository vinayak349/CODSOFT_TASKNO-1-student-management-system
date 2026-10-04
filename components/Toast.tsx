import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const bgMap = {
          success: 'bg-emerald-900/90 text-emerald-100 border-emerald-700',
          error: 'bg-rose-900/90 text-rose-100 border-rose-700',
          info: 'bg-sky-900/90 text-sky-100 border-sky-700',
        };

        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all animate-slideUp ${bgMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold leading-tight">{toast.title}</h5>
              {toast.message && <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-70 hover:opacity-100 p-0.5 rounded transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
