import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Lock, 
  Users, 
  Server, 
  CheckCircle2, 
  Clock, 
  Key, 
  Globe, 
  Zap,
  Save,
  AlertCircle
} from 'lucide-react';

interface SystemSettingsPageProps {
  currentUser: { name: string; email: string; roleTitle: string };
  onSwitchUser: (name: string, roleTitle: string) => void;
  onSimulateInactivity: () => void;
}

export const SystemSettingsPage: React.FC<SystemSettingsPageProps> = ({
  currentUser,
  onSwitchUser,
  onSimulateInactivity,
}) => {
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(15);
  const [warningCountdownSeconds, setWarningCountdownSeconds] = useState(30);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [ipRestricted, setIpRestricted] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSaveSettings = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3500);
  };

  return (
    <div id="system-settings-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600" />
            System Administration & Security
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure platform security thresholds, admin role privileges, and external API webhook health.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Settings</span>
        </button>
      </div>

      {savedBanner && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          System security parameters updated successfully!
        </div>
      )}

      {/* Admin Users & Roles */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Platform Super Administrators
            </h3>
            <p className="text-xs text-slate-500">
              Authorized personnel with root access across all tenant organizations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                C
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900">Christian (Founder)</strong>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Platform Owner
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">admin@teachepro.com</span>
                <span className="text-[10px] text-slate-400">Full Root Privileges · MFA Active</span>
              </div>
            </div>

            <button
              onClick={() => onSwitchUser('Christian (Founder)', 'Platform Owner')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                currentUser.name.includes('Christian')
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {currentUser.name.includes('Christian') ? 'Active Persona' : 'Switch To'}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900">Maya Lin</strong>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Operations Specialist
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">maya.ops@teachepro.com</span>
                <span className="text-[10px] text-slate-400">Onboarding & Support Lead · MFA Active</span>
              </div>
            </div>

            <button
              onClick={() => onSwitchUser('Maya Lin', 'Operations Specialist')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                currentUser.name.includes('Maya')
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {currentUser.name.includes('Maya') ? 'Active Persona' : 'Switch To'}
            </button>
          </div>
        </div>
      </div>

      {/* Security & Inactivity Timeouts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-600" />
          15-Minute Session Inactivity Policy & Guardrails
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          To protect sensitive wage records, Form W-4 tax identifiers, and masked bank details, the system enforces automatic lockouts upon prolonged client or admin inactivity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="font-bold text-slate-800 block">
              Inactivity Lockout Timer (Minutes)
            </label>
            <input
              type="number"
              value={sessionTimeoutMinutes}
              onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
            />
            <span className="text-[11px] text-slate-500">Default: 15 minutes of idle cursor/keyboard events</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="font-bold text-slate-800 block">
              Warning Popup Duration (Seconds)
            </label>
            <input
              type="number"
              value={warningCountdownSeconds}
              onChange={(e) => setWarningCountdownSeconds(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
            />
            <span className="text-[11px] text-slate-500">Countdown before automatic redirect to login</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onSimulateInactivity}
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Trigger Inactivity Modal Now (Test Security)
          </button>
        </div>
      </div>

      {/* External Partner API Integration Health */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-600" />
          Integration Webhooks & Microservices Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold">Everee Embedded Payroll</strong>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold block">Status: 100% Operational</span>
            <span className="text-[10px] text-slate-500 font-mono">Form 8655 webhook latency: 38ms</span>
          </div>

          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold">Clasp Benefits Engine</strong>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
            <span className="text-[11px] text-purple-800 font-semibold block">Status: 100% Operational</span>
            <span className="text-[10px] text-slate-500 font-mono">PEPM calculation latency: 54ms</span>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold">Stripe Subscriptions API</strong>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <span className="text-[11px] text-blue-800 font-semibold block">Status: 100% Operational</span>
            <span className="text-[10px] text-slate-500 font-mono">Tier metering webhook: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
