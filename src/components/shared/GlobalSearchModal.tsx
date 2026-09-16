import React, { useState, useEffect } from 'react';
import { Search, Building2, Users, FileText, ArrowRight, X, Shield, DollarSign, Settings } from 'lucide-react';
import { Company, Worker, SuperAdminPage } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  workers: Worker[];
  onSelectCompany: (company: Company) => void;
  onSelectPage: (page: SuperAdminPage) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  companies,
  workers,
  onSelectCompany,
  onSelectPage,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.industry.toLowerCase().includes(query.toLowerCase())
  );

  const filteredWorkers = workers.filter(
    (w) =>
      `${w.firstName} ${w.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      w.email.toLowerCase().includes(query.toLowerCase()) ||
      w.jobTitle.toLowerCase().includes(query.toLowerCase())
  );

  const navigationPages: { page: SuperAdminPage; label: string; icon: any; desc: string }[] = [
    { page: 'companies', label: 'Companies Portfolio', icon: Building2, desc: 'View and manage all tenant organizations' },
    { page: 'onboarding-crm', label: 'Onboarding Pipeline CRM', icon: Users, desc: 'In-progress setups & drop-off recovery' },
    { page: 'billing-revenue', label: 'Stripe Billing & Revenue', icon: DollarSign, desc: 'MRR analytics and 90-worker uncap alerts' },
    { page: 'audit-logs', label: 'Security & Audit Trails', icon: Shield, desc: 'Immutable activity logs & impersonation trail' },
    { page: 'system-settings', label: 'System & Admin Settings', icon: Settings, desc: 'Platform admins, API health, session timeout rules' },
  ];

  const filteredPages = navigationPages.filter(
    (p) => p.label.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, workers, pages, or tools... (e.g. Apex, Onboarding, Carlos)"
            className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Platform Pages
              </div>
              <div className="space-y-1">
                {filteredPages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        onSelectPage(item.page);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50/80 flex items-center justify-between group transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-teal-900">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-500">{item.desc}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Companies */}
          {filteredCompanies.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Companies ({filteredCompanies.length})
              </div>
              <div className="space-y-1">
                {filteredCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCompany(c);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between group transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {c.name}
                          <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1 rounded">
                            {c.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {c.industry} · {c.totalWorkers} workers · {c.status}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-800 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Workers */}
          {filteredWorkers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Workers ({filteredWorkers.length})
              </div>
              <div className="space-y-1">
                {filteredWorkers.map((w) => (
                  <div
                    key={w.id}
                    className="p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                        {w.firstName[0]}{w.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {w.firstName} {w.lastName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {w.jobTitle} · {w.workerType}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{w.maskedAccount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCompanies.length === 0 && filteredPages.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No matching results found for "{query}".
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tip: Use <strong>Tab</strong> or <strong>Enter</strong> to navigate</span>
          <span>Press <strong>Esc</strong> to exit</span>
        </div>
      </div>
    </div>
  );
};
