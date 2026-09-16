import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Search, 
  ShieldAlert, 
  Plus, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  PhoneCall, 
  Clock, 
  Lock, 
  Layers, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Filter,
  Eye,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { Company, UserRole } from '../../types';

interface SuperAdminDashboardProps {
  companies: Company[];
  onImpersonateCompany: (company: Company) => void;
  onResumeOnboarding: (company: Company) => void;
  onOpenCompanyDetail: (company: Company) => void;
  onOpenOnboardingTracker: () => void;
  onOpenAuditLogs: () => void;
  onOpenNewCompanyModal: () => void;
  onOpenNotesForCompany: (company: Company) => void;
  onSimulateInactivity: () => void;
  onResetDemoData: () => void;
  currentSuperAdminUser: { name: string; email: string; roleTitle: string };
  onSwitchAdminUser: (name: string, roleTitle: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  companies,
  onImpersonateCompany,
  onResumeOnboarding,
  onOpenCompanyDetail,
  onOpenOnboardingTracker,
  onOpenAuditLogs,
  onOpenNewCompanyModal,
  onOpenNotesForCompany,
  onSimulateInactivity,
  onResetDemoData,
  currentSuperAdminUser,
  onSwitchAdminUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  // Calculations
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.status === 'active').length;
  const inProgressOnboardings = companies.filter((c) => c.onboardingStatus === 'in_progress').length;
  const totalEmployees = companies.reduce((acc, c) => acc + c.employeeCount, 0);
  const totalContractors = companies.reduce((acc, c) => acc + c.contractorCount, 0);
  const totalWorkforce = totalEmployees + totalContractors;
  const companies90Plus = companies.filter((c) => c.totalWorkers >= 90).length;

  const industries = Array.from(new Set(companies.map((c) => c.industry)));

  const filteredCompanies = companies.filter((comp) => {
    const matchesSearch = 
      comp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.statesOfOperation.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'in_progress' ? comp.onboardingStatus === 'in_progress' :
      statusFilter === 'completed' ? comp.onboardingStatus === 'completed' :
      statusFilter === '90_plus' ? comp.totalWorkers >= 90 :
      comp.status === statusFilter;

    const matchesIndustry = industryFilter === 'all' || comp.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  return (
    <div id="super-admin-dashboard" className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-sm">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold tracking-tight text-white text-base">
                  Teache HR
                </h1>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Super Admin
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  • MVP Owner Portal
                </span>
              </div>
              <span className="text-xs text-slate-400 block">
                Multi-Tenant Company Control, Impersonation & Onboarding CRM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Operator switcher */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400">Signed in as:</span>
              <select
                id="super-admin-user-select"
                value={currentSuperAdminUser.name}
                onChange={(e) => {
                  if (e.target.value === 'Christian (Founder)') {
                    onSwitchAdminUser('Christian (Founder)', 'Platform Owner');
                  } else {
                    onSwitchAdminUser('Maya Lin', 'Operations Specialist');
                  }
                }}
                className="bg-slate-900 text-white font-semibold rounded px-1.5 py-0.5 border border-slate-700 focus:outline-hidden"
              >
                <option value="Christian (Founder)">Christian (Founder - Platform Owner)</option>
                <option value="Maya Lin">Maya Lin (Operations Specialist)</option>
              </select>
            </div>

            {/* Test Security Timeout Simulation button */}
            <button
              id="simulate-inactivity-btn"
              onClick={onSimulateInactivity}
              title="Test 15-Minute Inactivity Protection Modal"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Test Inactivity Clock</span>
            </button>

            {/* Audit Logs button */}
            <button
              id="view-audit-logs-btn"
              onClick={onOpenAuditLogs}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Registered Companies
              </span>
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {totalCompanies}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="text-emerald-700 font-semibold">{activeCompanies} Active</span>
              <span>•</span>
              <span className="text-amber-700 font-semibold">{inProgressOnboardings} In Onboarding</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Managed Workforce
              </span>
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {totalWorkforce}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="text-slate-700 font-medium">{totalEmployees} W-2 Employees</span>
              <span>•</span>
              <span className="text-slate-500">{totalContractors} 1099 Contractors</span>
            </div>
          </div>

          {/* In-Progress Onboarding CRM Widget */}
          <div 
            onClick={onOpenOnboardingTracker}
            className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-2xs hover:border-amber-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                In-Progress Drop-Offs
              </span>
              <PhoneCall className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-extrabold text-amber-900 flex items-center gap-2">
              {inProgressOnboardings}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Call Pipeline
              </span>
            </div>
            <div className="text-xs text-amber-700 mt-1 flex items-center justify-between">
              <span>Saved phone & steps ready</span>
              <span className="font-semibold underline flex items-center gap-0.5">
                Review Leads <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                90-Worker Uncap Alerts
              </span>
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {companies90Plus}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Organizations eligible for customized benefits & uncap notices</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-company-id-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Company ID (e.g. COMP-1049), name, contact, email, or state..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <button
                id="open-register-company-btn"
                onClick={onOpenNewCompanyModal}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Register New Client
              </button>

              <button
                id="open-onboarding-tracker-btn"
                onClick={onOpenOnboardingTracker}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold py-2.5 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                <span>Onboarding Leads ({inProgressOnboardings})</span>
              </button>

              <button
                id="reset-demo-environment-btn"
                onClick={onResetDemoData}
                title="Restores default demo companies, workers, and audit records"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Status:
              </span>
              {[
                { id: 'all', label: `All (${companies.length})` },
                { id: 'active', label: `Active (${activeCompanies})` },
                { id: 'in_progress', label: `In-Progress Onboarding (${inProgressOnboardings})` },
                { id: '90_plus', label: `90+ Workers Uncapped (${companies90Plus})` },
                { id: 'suspended', label: 'Suspended' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
                    statusFilter === pill.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Industry:</span>
              <select
                id="industry-filter-select"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-slate-50 font-medium text-xs focus:outline-hidden"
              >
                <option value="all">All Industries ({industries.length})</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Company Master Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Registered Client Companies Directory
              </h3>
              <p className="text-xs text-slate-500">
                Click "Impersonate Admin" to log in directly to any company workspace with full read/write access.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredCompanies.length} of {companies.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Company ID</th>
                  <th className="py-3 px-4">Business Name & Industry</th>
                  <th className="py-3 px-4">Primary Admin Contact</th>
                  <th className="py-3 px-4">Workforce</th>
                  <th className="py-3 px-4">Onboarding State</th>
                  <th className="py-3 px-4">Add-Ons & Billing</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      No companies match the search or filter query.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/90 transition group">
                      {/* Company ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200">
                          {comp.id}
                        </span>
                      </td>

                      {/* Business Name & Industry */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {comp.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          <span>{comp.industry}</span>
                          <span>•</span>
                          <span>{comp.statesOfOperation.slice(0, 2).join(', ')}{comp.statesOfOperation.length > 2 ? ` +${comp.statesOfOperation.length - 2}` : ''}</span>
                        </div>
                      </td>

                      {/* Primary Admin */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {comp.contactName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {comp.contactEmail}
                        </div>
                        <div className="text-[11px] text-teal-700 font-mono">
                          {comp.contactPhone}
                        </div>
                      </td>

                      {/* Workforce */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {comp.totalWorkers}
                        </span>
                        <span className="text-slate-400 text-[11px] block">
                          {comp.employeeCount} W-2 / {comp.contractorCount} 1099
                        </span>
                        {comp.totalWorkers >= 90 && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 block mt-0.5">
                            90+ Cap Tier
                          </span>
                        )}
                      </td>

                      {/* Onboarding State */}
                      <td className="py-3.5 px-4">
                        {comp.onboardingStatus === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              In-Progress
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[130px]" title={comp.onboardingCurrentStep}>
                              {comp.onboardingCurrentStep}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Add-ons & Billing */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          ${comp.estimatedNextInvoice}/mo est.
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px]">
                          {comp.addons.benefitsClasp && (
                            <span className="bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-medium" title="Clasp Benefits">
                              Clasp
                            </span>
                          )}
                          {comp.addons.hrConsultation !== 'none' && (
                            <span className="bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-medium" title="HR Consultation">
                              HR Cons.
                            </span>
                          )}
                          {comp.addons.equipmentLeaseCount > 0 && (
                            <span className="bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-medium" title="Tablet Leases">
                              {comp.addons.equipmentLeaseCount} Tabs
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          comp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : comp.status === 'suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {comp.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {comp.lastActivity}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        {/* Impersonate Button */}
                        <button
                          id={`impersonate-btn-${comp.id}`}
                          onClick={() => onImpersonateCompany(comp)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-xs inline-flex items-center gap-1 cursor-pointer"
                          title={`Log in as ${comp.contactName} at ${comp.name}`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Impersonate</span>
                        </button>

                        {/* Resume Onboarding on Behalf (if incomplete) */}
                        {comp.onboardingStatus === 'in_progress' && (
                          <button
                            id={`resume-setup-btn-${comp.id}`}
                            onClick={() => onResumeOnboarding(comp)}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                            title="Complete onboarding setup on client's behalf"
                          >
                            <span>Resume Setup</span>
                          </button>
                        )}

                        {/* Details Modal */}
                        <button
                          id={`view-details-btn-${comp.id}`}
                          onClick={() => onOpenCompanyDetail(comp)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                          title="Manage company, notes, workers, and controls"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
