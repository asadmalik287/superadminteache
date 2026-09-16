import React from 'react';
import { 
  Search, 
  Clock, 
  Menu, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Bell, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SuperAdminPage, Company } from '../../types';

interface SuperAdminHeaderProps {
  currentPage: SuperAdminPage;
  selectedCompany?: Company | null;
  onOpenSearch: () => void;
  onSimulateInactivity: () => void;
  onToggleMobileSidebar: () => void;
  onNavigate: (page: SuperAdminPage) => void;
}

export const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({
  currentPage,
  selectedCompany,
  onOpenSearch,
  onSimulateInactivity,
  onToggleMobileSidebar,
  onNavigate,
}) => {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'companies':
        return 'Companies Portfolio';
      case 'company-detail':
        return selectedCompany ? selectedCompany.name : 'Company Detail';
      case 'onboarding-crm':
        return 'Onboarding Pipeline & Recovery CRM';
      case 'billing-revenue':
        return 'Stripe Billing & Revenue Analytics';
      case 'audit-logs':
        return 'Security Audit Trails & Forensics';
      case 'system-settings':
        return 'System Administration & Security';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-2xs">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigate('companies')}
            className="hover:text-teal-700 transition cursor-pointer"
          >
            Super Admin
          </button>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
          {currentPage === 'company-detail' && selectedCompany ? (
            <>
              <button
                onClick={() => onNavigate('companies')}
                className="hover:text-teal-700 transition cursor-pointer"
              >
                Companies
              </button>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
              <span className="font-bold text-slate-900">{selectedCompany.name}</span>
            </>
          ) : (
            <span className="font-bold text-slate-900">{getPageTitle()}</span>
          )}
        </nav>
      </div>

      {/* Right: Search, Timeout Simulator, Status */}
      <div className="flex items-center gap-3">
        {/* Global Search Button */}
        <button
          id="global-search-trigger-btn"
          onClick={onOpenSearch}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2 transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Quick Search...</span>
          <kbd className="hidden sm:inline bg-white px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-300 text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Inactivity Security Simulator */}
        <button
          id="test-session-timeout-btn"
          onClick={onSimulateInactivity}
          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Simulate the 15-minute inactivity security dialog"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">Test 15m Timeout</span>
        </button>

        {/* Integration Status Badges */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Everee Live
          </span>
          <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Clasp Live
          </span>
        </div>
      </div>
    </header>
  );
};
