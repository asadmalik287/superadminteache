import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  PlayCircle, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  Users,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Company } from '../../types';

interface OnboardingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  onResumeOnBehalf: (company: Company) => void;
}

export const OnboardingTrackerModal: React.FC<OnboardingTrackerModalProps> = ({
  isOpen,
  onClose,
  companies,
  onResumeOnBehalf,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const inProgressCompanies = companies.filter(
    (c) => c.onboardingStatus === 'in_progress' || c.onboardingStatus === 'not_started'
  );

  const filtered = inProgressCompanies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactPhone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const getStepDisplayName = (step: string) => {
    switch (step) {
      case 'acknowledgment': return '1. Legal Compliance Acknowledgment';
      case 'company_info': return '2. Company Information & Addresses';
      case 'worker_count': return '3. Worker Split (W-2 vs 1099)';
      case 'workers_comp': return '4. Workers\' Comp Insurance ID';
      case 'bulk_upload': return '5. Bulk CSV / Signed Docs Upload';
      case 'industry_select': return '6. Industry Classification';
      case 'posters': return '7. Labor Law Posters (PosterElite)';
      case 'payroll_everee': return '8. Payroll & Everee Form 8655';
      case 'benefits_clasp': return '9. Employee Benefits (Clasp)';
      case 'review_confirm': return '10. Final Review & Confirmation';
      default: return step;
    }
  };

  return (
    <div 
      id="onboarding-tracker-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Live In-Progress Drop-Off Pipeline
              </span>
              <span className="text-xs text-slate-500">
                Founder Phone Outreach & Client Assistance
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Incomplete Client Onboardings ({inProgressCompanies.length})
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Clients who auto-saved their progress or dropped off before submitting. You can review their saved contact information, call them personally to offer assistance, or complete the setup on their behalf.
            </p>
          </div>
          <button
            id="close-onboarding-tracker-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-onboarding-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Company ID, business name, contact, or phone number..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Showing {filtered.length} leads
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">All Client Onboardings Complete!</p>
              <p className="text-xs text-slate-500 mt-1">
                No incomplete registrations currently require phone outreach.
              </p>
            </div>
          ) : (
            filtered.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {company.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">
                        {company.name}
                      </h4>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {company.industry}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Admin: <strong className="text-slate-800 font-semibold">{company.contactName}</strong>
                      </span>
                      <a 
                        href={`tel:${company.contactPhone}`}
                        className="flex items-center gap-1 text-teal-700 hover:text-teal-800 font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {company.contactPhone}
                      </a>
                      <button
                        onClick={() => handleCopyPhone(company.contactPhone)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                        title="Copy phone"
                      >
                        {copiedPhone === company.contactPhone ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedPhone === company.contactPhone ? 'Copied' : 'Copy'}
                      </button>
                      <a 
                        href={`mailto:${company.contactEmail}`}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-800"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {company.contactEmail}
                      </a>
                    </div>

                    {/* Progress details */}
                    <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Last Saved Step: <strong>{getStepDisplayName(company.onboardingCurrentStep)}</strong>
                        </span>
                        <span className="text-amber-700 font-mono text-[11px]">
                          Auto-saved: {company.onboardingLastSavedAt || 'Recently'}
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px] pt-1 border-t border-amber-200/60 flex items-center gap-3">
                        <span>Workers Reported: <strong>{company.totalWorkers}</strong> ({company.employeeCount} W-2 / {company.contractorCount} 1099)</span>
                        <span>•</span>
                        <span>States: {company.statesOfOperation.join(', ') || 'Pending selection'}</span>
                        <span>•</span>
                        <span>WC ID: {company.workersCompId ? <span className="text-emerald-700 font-semibold">{company.workersCompId}</span> : <span className="text-red-600 font-semibold">Missing</span>}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 justify-center">
                    <button
                      id={`resume-onboarding-btn-${company.id}`}
                      onClick={() => onResumeOnBehalf(company)}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Resume on Client's Behalf
                    </button>
                    <a
                      href={`tel:${company.contactPhone}`}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3.5 rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      Call {company.contactName.split(' ')[0]}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            💡 <strong>Founder Tip:</strong> When prospective clients call to add add-ons, you can directly launch their setup and guide them live on the call.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
