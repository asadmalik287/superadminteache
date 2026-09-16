import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  Send, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  Download, 
  Building2,
  Users
} from 'lucide-react';
import { Company } from '../../types';

interface BillingRevenuePageProps {
  companies: Company[];
  onSend90WorkerAlert: (company: Company) => void;
}

export const BillingRevenuePage: React.FC<BillingRevenuePageProps> = ({
  companies,
  onSend90WorkerAlert,
}) => {
  const [alertDispatchedMap, setAlertDispatchedMap] = useState<Record<string, boolean>>({});

  const totalMRR = companies.reduce((acc, c) => acc + c.estimatedNextInvoice, 0);
  const totalWorkers = companies.reduce((acc, c) => acc + c.totalWorkers, 0);
  const cappedCompanies = companies.filter((c) => c.isCapped);
  const uncapAlertCompanies = companies.filter((c) => c.approachingUncap90Workers);

  const handleDispatch = (comp: Company) => {
    onSend90WorkerAlert(comp);
    setAlertDispatchedMap((prev) => ({ ...prev, [comp.id]: true }));
    setTimeout(() => {
      setAlertDispatchedMap((prev) => ({ ...prev, [comp.id]: false }));
    }, 4000);
  };

  return (
    <div id="billing-revenue-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Stripe Billing & Revenue Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated Stripe billing oversight, tier calculation ($30 base + $3/head), and 90-worker benefits tier thresholds.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Monthly Recurring (MRR)
          </span>
          <div className="text-3xl font-extrabold text-teal-700">
            ${totalMRR.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {companies.length} subscribed employers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Billable Headcount
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {totalWorkers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Combined W-2 & 1099 active workers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            $400 Capped Accounts
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {cappedCompanies.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Accounts reaching platform price ceiling
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            90+ Worker Uncap Watch
          </span>
          <div className="text-3xl font-extrabold text-amber-600">
            {uncapAlertCompanies.length}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">
            Requires custom benefits rate notice
          </div>
        </div>
      </div>

      {/* 90-Worker Uncap Alerts Section */}
      {uncapAlertCompanies.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm">
              Compliance Watch: Companies Approaching 90-Worker Benefits Uncap
            </h3>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Under Teache partner policy, when an organization reaches 90 active workers, healthcare benefits PEPM uncap protocols must be triggered. Disseminate notice to company contact before the next billing cycle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {uncapAlertCompanies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block text-sm">{comp.name}</span>
                  <span className="text-slate-500 text-[11px]">
                    {comp.totalWorkers} Workers · Contact: {comp.contactEmail}
                  </span>
                </div>

                <button
                  onClick={() => handleDispatch(comp)}
                  disabled={alertDispatchedMap[comp.id]}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  {alertDispatchedMap[comp.id] ? 'Sent!' : 'Dispatch Notice'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Plan Tiers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Current Billing Subscriptions & Add-ons
            </h3>
            <p className="text-xs text-slate-500">
              Pricing rule: $30/month covers first 5 workers; $3/month per each additional worker thereafter.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Headcount</th>
                <th className="py-3 px-4">Base Fee</th>
                <th className="py-3 px-4">Incremental Worker Fee</th>
                <th className="py-3 px-4">Estimated Invoice</th>
                <th className="py-3 px-4">Cap Status</th>
                <th className="py-3 px-4">Stripe Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => {
                const addtlWorkers = Math.max(0, c.totalWorkers - 5);
                const addtlCost = addtlWorkers * 3;
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{c.id}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {c.totalWorkers} workers
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      $30.00
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      ${addtlCost}.00 ({addtlWorkers} × $3)
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ${c.estimatedNextInvoice}.00/mo
                    </td>
                    <td className="py-3 px-4">
                      {c.isCapped ? (
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                          CAPPED ($400)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Uncapped Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Card on file (Active)
                      </span>
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
