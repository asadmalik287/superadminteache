import React from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Shield, 
  Settings, 
  PlusCircle, 
  RotateCcw, 
  ShieldCheck, 
  LogOut, 
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { SuperAdminPage, Company } from '../../types';

interface SuperAdminSidebarProps {
  currentPage: SuperAdminPage;
  onNavigate: (page: SuperAdminPage) => void;
  companies: Company[];
  onOpenNewCompany: () => void;
  onResetDemo: () => void;
  currentUser: {
    name: string;
    email: string;
    roleTitle: 'Platform Owner' | 'Operations Specialist';
  };
  onSwitchUser: (name: string, roleTitle: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  currentPage,
  onNavigate,
  companies,
  onOpenNewCompany,
  onResetDemo,
  currentUser,
  onSwitchUser,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const incompleteCount = companies.filter((c) => c.onboardingStatus === 'in_progress').length;
  const uncapAlertCount = companies.filter((c) => c.approachingUncap90Workers).length;

  const navItems = [
    {
      id: 'companies' as SuperAdminPage,
      label: 'Companies Portfolio',
      icon: Building2,
      badge: companies.length.toString(),
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'onboarding-crm' as SuperAdminPage,
      label: 'Onboarding Pipeline',
      icon: Users,
      badge: incompleteCount > 0 ? `${incompleteCount} Incomplete` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
    {
      id: 'billing-revenue' as SuperAdminPage,
      label: 'Stripe Billing & MRR',
      icon: DollarSign,
      badge: uncapAlertCount > 0 ? `${uncapAlertCount} Alert` : undefined,
      badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
    },
    {
      id: 'audit-logs' as SuperAdminPage,
      label: 'Security & Audit Trail',
      icon: Shield,
    },
    {
      id: 'system-settings' as SuperAdminPage,
      label: 'System & Admin Settings',
      icon: Settings,
    },
  ];

  return (
    <aside 
      id="super-admin-sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white tracking-tight text-base font-mono">
                  TEACHE
                </span>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-500/30">
                  SUPER ADMIN
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Multi-Tenant HRIS Engine
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <button
            id="sidebar-register-company-btn"
            onClick={onOpenNewCompany}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-md shadow-teal-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Company</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Admin User Switching & Environment Controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
        {/* Reset Demo Data Button */}
        <button
          onClick={onResetDemo}
          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold py-2 px-3 rounded-lg border border-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Environment</span>
        </button>

        {/* User Identity Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Administrator
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
              <ShieldCheck className="w-3 h-3" />
              Root
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-slate-950 font-bold flex items-center justify-center text-xs">
              {currentUser.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-100 truncate text-xs">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser.roleTitle}
              </div>
            </div>
          </div>

          {/* Quick role test switch */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Switch Persona:</span>
            <select
              value={currentUser.name}
              onChange={(e) => {
                if (e.target.value.includes('Christian')) {
                  onSwitchUser('Christian (Founder)', 'Platform Owner');
                } else {
                  onSwitchUser('Maya Lin', 'Operations Specialist');
                }
              }}
              className="bg-slate-950 text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer"
            >
              <option value="Christian (Founder)">Christian (Owner)</option>
              <option value="Maya Lin">Maya Lin (Ops Admin)</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
