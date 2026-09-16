import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink, 
  PlayCircle, 
  StickyNote, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { Company, AccountStatus } from '../../types';

interface CompaniesPageProps {
  companies: Company[];
  onSelectCompanyDetail: (company: Company) => void;
  onImpersonateCompany: (company: Company) => void;
  onResumeOnboarding: (company: Company) => void;
  onOpenNotes: (company: Company) => void;
  onToggleStatus: (companyId: string, newStatus: AccountStatus) => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({
  companies,
  onSelectCompanyDetail,
  onImpersonateCompany,
  onResumeOnboarding,
  onOpenNotes,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [onboardingFilter, setOnboardingFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.status === 'active').length;
  const totalWorkers = companies.reduce((acc, c) => acc + c.totalWorkers, 0);
  const totalMRR = companies.reduce((acc, c) => acc + c.estimatedNextInvoice, 0);
  const incompleteOnboarding = companies.filter((c) => c.onboardingStatus === 'in_progress').length;

  const industries = Array.from(new Set(companies.map((c) => c.industry)));

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ein.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter;
    const matchesOnboarding = onboardingFilter === 'all' || c.onboardingStatus === onboardingFilter;

    return matchesSearch && matchesStatus && matchesIndustry && matchesOnboarding;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'EIN', 'Industry', 'Workers', 'Employees', 'Contractors', 'Status', 'MRR', 'Onboarding'];
    const rows = filteredCompanies.map((c) => [
      c.id,
      `"${c.name}"`,
      c.ein,
      `"${c.industry}"`,
      c.totalWorkers,
      c.employeeCount,
      c.contractorCount,
      c.status,
      c.estimatedNextInvoice,
      c.onboardingStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teache_Companies_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="companies-portfolio-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Heading & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Companies Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized multi-tenant management directory, onboarding control, and live impersonation hub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-2 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Organizations
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {totalCompanies}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {activeCompanies} Active Accounts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Managed Workers
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {totalWorkers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Employees & 1099 Contractors
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stripe Monthly MRR
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-2">
            ${totalMRR.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            $30 base + $3/head tiering
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Incomplete Onboarding
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2">
            {incompleteOnboarding} Leads
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">
            Requires Outreach / Setup Help
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, ID, EIN, contact..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">All Statuses (Active & Suspended)</option>
              <option value="active">Active Accounts Only</option>
              <option value="suspended">Suspended Accounts Only</option>
            </select>
          </div>

          <div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={onboardingFilter}
              onChange={(e) => setOnboardingFilter(e.target.value as any)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">All Onboarding Statuses</option>
              <option value="completed">Completed & Live</option>
              <option value="in_progress">In-Progress (Drafts)</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
          <span>Showing <strong>{filteredCompanies.length}</strong> of {totalCompanies} organizations</span>
          {(searchTerm || statusFilter !== 'all' || industryFilter !== 'all' || onboardingFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setIndustryFilter('all');
                setOnboardingFilter('all');
              }}
              className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Company & Identity</th>
                <th className="py-3 px-4">Industry & Locations</th>
                <th className="py-3 px-4">Workforce</th>
                <th className="py-3 px-4">Billing / MRR</th>
                <th className="py-3 px-4">Onboarding State</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map((c) => {
                const isSuspended = c.status === 'suspended';
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    {/* Identity */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
                          {c.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectCompanyDetail(c)}
                              className="font-bold text-slate-900 hover:text-teal-700 transition cursor-pointer text-left"
                            >
                              {c.name}
                            </button>
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-semibold">
                              {c.id}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            EIN: {c.ein} · {c.businessType}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{c.industry}</span>
                      <span className="text-[11px] text-slate-500">
                        {c.statesOfOperation.join(', ') || 'Ohio'} ({c.workLocationsCount} worksites)
                      </span>
                    </td>

                    {/* Workforce */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">{c.totalWorkers}</span>
                        <span className="text-[11px] text-slate-500">
                          ({c.employeeCount} W-2 · {c.contractorCount} 1099)
                        </span>
                      </div>
                      {c.approachingUncap90Workers && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mt-0.5">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          90+ Worker Uncap Alert
                        </span>
                      )}
                    </td>

                    {/* Billing */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900 block">${c.estimatedNextInvoice}/mo</span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {c.isCapped ? '$400 Monthly Cap' : 'Standard Tier'}
                      </span>
                    </td>

                    {/* Onboarding */}
                    <td className="py-3 px-4">
                      {c.onboardingStatus === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Active & Live
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                            In-Progress ({c.onboardingCurrentStep.replace('_', ' ')})
                          </span>
                          <button
                            onClick={() => onResumeOnboarding(c)}
                            className="block mt-1 text-[10px] text-teal-700 font-bold hover:underline cursor-pointer"
                          >
                            Resume Setup →
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onToggleStatus(c.id, isSuspended ? 'active' : 'suspended')}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                          isSuspended
                            ? 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {c.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectCompanyDetail(c)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition cursor-pointer"
                          title="View Full Profile Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenNotes(c)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition cursor-pointer"
                          title="View Internal Team Notes"
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`impersonate-company-btn-${c.id}`}
                          onClick={() => onImpersonateCompany(c)}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <PlayCircle className="w-3 h-3" />
                          <span>Impersonate</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
