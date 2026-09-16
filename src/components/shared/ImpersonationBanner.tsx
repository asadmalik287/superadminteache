import React from 'react';
import { ShieldAlert, LogOut, ArrowRight, UserCheck, Building2 } from 'lucide-react';
import { Company, Worker } from '../../types';

interface ImpersonationBannerProps {
  impersonatingCompany: Company | null;
  impersonatingWorker: Worker | null;
  onExitCompanyImpersonation: () => void;
  onExitWorkerImpersonation: () => void;
}

export const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({
  impersonatingCompany,
  impersonatingWorker,
  onExitCompanyImpersonation,
  onExitWorkerImpersonation,
}) => {
  if (!impersonatingCompany && !impersonatingWorker) {
    return null;
  }

  // Worker impersonation active (nested within company view)
  if (impersonatingWorker) {
    return (
      <div 
        id="worker-impersonation-banner"
        className="bg-purple-900 text-purple-100 px-4 py-2.5 shadow-md flex items-center justify-between border-b border-purple-700 text-sm z-50 sticky top-0"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse" />
          <UserCheck className="w-4 h-4 text-purple-300" />
          <span className="font-semibold text-white">
            Viewing as Worker:
          </span>
          <span className="bg-purple-800 text-purple-100 px-2 py-0.5 rounded font-mono text-xs">
            {impersonatingWorker.firstName} {impersonatingWorker.lastName} ({impersonatingWorker.jobTitle})
          </span>
          <span className="text-purple-300 text-xs hidden sm:inline">
            • Mode: {impersonatingWorker.workerType} • Read/Action Active
          </span>
        </div>
        <button
          id="exit-worker-impersonation-btn"
          onClick={onExitWorkerImpersonation}
          className="flex items-center gap-1.5 px-3 py-1 bg-white text-purple-900 hover:bg-purple-100 text-xs font-semibold rounded transition shadow-sm cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit Worker View
        </button>
      </div>
    );
  }

  // Super Admin impersonating Company Admin
  return (
    <div 
      id="super-admin-impersonation-banner"
      className="bg-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between border-b border-amber-700 text-sm z-50 sticky top-0"
    >
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="flex h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
        <ShieldAlert className="w-4 h-4 text-amber-100" />
        <span className="font-semibold">
          Impersonating Company Admin:
        </span>
        <span className="bg-amber-800 text-white px-2 py-0.5 rounded font-medium text-xs flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" />
          {impersonatingCompany?.name} ({impersonatingCompany?.id})
        </span>
        <span className="text-amber-100 text-xs hidden md:inline">
          • Admin: {impersonatingCompany?.contactName} ({impersonatingCompany?.contactEmail})
        </span>
        <span className="text-amber-200 text-xs hidden lg:inline">
          • Logged as: Christian (Super Admin)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-amber-700/80 px-2 py-0.5 rounded text-amber-100 hidden sm:inline">
          Audit Trail Logging: Active
        </span>
        <button
          id="exit-super-admin-impersonation-btn"
          onClick={onExitCompanyImpersonation}
          className="flex items-center gap-1.5 px-3.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition shadow cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-amber-400" />
          <span>Exit to Super Admin Panel</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
