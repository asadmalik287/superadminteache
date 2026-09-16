import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onStaySignedIn: () => void;
  onLogout: () => void;
  warningDurationSeconds?: number;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  onStaySignedIn,
  onLogout,
  warningDurationSeconds = 30,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(warningDurationSeconds);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(warningDurationSeconds);
      return;
    }

    setSecondsRemaining(warningDurationSeconds);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout, warningDurationSeconds]);

  if (!isOpen) return null;

  return (
    <div 
      id="session-timeout-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600 ring-8 ring-amber-50">
          <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          Security Policy: Inactivity Protection
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Are you still working?
        </h3>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          For your organization's security, sessions automatically log out after 15 minutes of inactivity to protect sensitive HR, payroll, and compliance records.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
            Automatic Logout In
          </span>
          <div className="text-4xl font-extrabold text-amber-600 font-mono">
            00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Clicking below will extend your session and resume your workspace.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="stay-signed-in-btn"
            onClick={onStaySignedIn}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Stay Signed In
          </button>
          <button
            id="logout-now-btn"
            onClick={onLogout}
            className="sm:w-32 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition cursor-pointer"
          >
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
};
