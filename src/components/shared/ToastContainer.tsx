import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      id="toast-notification-container" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-teal-500 bg-slate-900 text-white';
        let iconColor = 'text-teal-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-500 bg-slate-900 text-white';
          iconColor = 'text-red-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500 bg-slate-900 text-white';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-500 bg-slate-900 text-white';
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-3.5 shadow-xl border flex items-start gap-3 transition-all duration-200 transform translate-y-0 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 text-xs">
              <div className="font-bold text-white">{toast.title}</div>
              {toast.message && (
                <div className="text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
