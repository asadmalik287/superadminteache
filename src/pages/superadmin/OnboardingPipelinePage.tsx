import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  PlayCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Building2, 
  ShieldCheck, 
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Company } from '../../types';

interface OnboardingPipelinePageProps {
  companies: Company[];
  onResumeOnBehalf: (company: Company) => void;
}

export const OnboardingPipelinePage: React.FC<OnboardingPipelinePageProps> = ({
  companies,
  onResumeOnBehalf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'funnel' | 'list'>('funnel');

  const incompleteCompanies = companies.filter((c) => c.onboardingStatus === 'in_progress');
  const completedCompanies = companies.filter((c) => c.onboardingStatus === 'completed');

  const filteredIncomplete = incompleteCompanies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stages: { stepKey: string; label: string; desc: string; icon: any }[] = [
    { stepKey: 'company_info', label: '1. Entity Info', desc: 'EIN, legal entity & states', icon: Building2 },
    { stepKey: 'workers_comp', label: '2. Workers\' Comp', desc: 'Policy ID & expiration', icon: ShieldCheck },
    { stepKey: 'bulk_upload', label: '3. Bulk CSV / ZIP', desc: 'Roster & signed docs', icon: FileSpreadsheet },
    { stepKey: 'payroll_everee', label: '4. Everee Payroll', desc: 'IRS 8655 & schedule', icon: DollarSign },
    { stepKey: 'review_confirm', label: '5. Review & Submit', desc: 'Final activation', icon: CheckCircle2 },
  ];

  return (
    <div id="onboarding-pipeline-crm-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Onboarding Pipeline & Recovery CRM
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track incomplete registration drafts, identify drop-off hurdles, and resume setup on client's behalf.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'funnel' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stage Board
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Leads Table ({incompleteCompanies.length})
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Active Recovery Leads
          </span>
          <div className="text-3xl font-extrabold text-amber-600">
            {incompleteCompanies.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Organizations with saved draft states
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Successfully Onboarded
          </span>
          <div className="text-3xl font-extrabold text-teal-700">
            {completedCompanies.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Live companies processing on Everee
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Conversion Rate
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {Math.round((completedCompanies.length / companies.length) * 100)}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Healthy baseline across multi-state employers
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search lead by company name, ID, contact name, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Stage Board View */}
      {activeTab === 'funnel' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stages.map((stg) => {
            const Icon = stg.icon;
            const stageCompanies = filteredIncomplete.filter((c) => {
              if (stg.stepKey === 'company_info') return c.onboardingCurrentStep === 'company_info' || c.onboardingCurrentStep === 'acknowledgment';
              if (stg.stepKey === 'workers_comp') return c.onboardingCurrentStep === 'workers_comp' || c.onboardingCurrentStep === 'worker_count';
              if (stg.stepKey === 'bulk_upload') return c.onboardingCurrentStep === 'bulk_upload' || c.onboardingCurrentStep === 'industry_select';
              if (stg.stepKey === 'payroll_everee') return c.onboardingCurrentStep === 'payroll_everee' || c.onboardingCurrentStep === 'posters';
              if (stg.stepKey === 'review_confirm') return c.onboardingCurrentStep === 'review_confirm' || c.onboardingCurrentStep === 'benefits_clasp';
              return false;
            });

            return (
              <div key={stg.stepKey} className="bg-slate-50/80 rounded-2xl border border-slate-200 p-3.5 flex flex-col min-h-[420px]">
                <div className="border-b border-slate-200 pb-2.5 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-teal-600" />
                      {stg.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {stageCompanies.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{stg.desc}</span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {stageCompanies.map((comp) => (
                    <div
                      key={comp.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-500/50 transition space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                          {comp.name}
                        </span>
                        <span className="font-mono text-[9px] bg-slate-100 px-1 rounded font-semibold text-slate-600">
                          {comp.id}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <div className="truncate">{comp.contactName}</div>
                        <div className="truncate text-teal-700 font-medium">{comp.contactEmail}</div>
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-100">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Saved: {comp.onboardingLastSavedAt || 'Recent'}</span>
                      </div>

                      <button
                        onClick={() => onResumeOnBehalf(comp)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] transition shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Resume on Behalf</span>
                      </button>
                    </div>
                  ))}

                  {stageCompanies.length === 0 && (
                    <div className="text-center py-10 text-[11px] text-slate-400">
                      No leads at this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List Table View */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Stalled Step</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncomplete.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{comp.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{comp.id} · {comp.industry}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{comp.contactName}</span>
                      <span className="text-[11px] text-slate-500">{comp.contactEmail} · {comp.contactPhone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                        {comp.onboardingCurrentStep.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {comp.onboardingLastSavedAt || 'Recently active'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onResumeOnBehalf(comp)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        Resume Setup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
