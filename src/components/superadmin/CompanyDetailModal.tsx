import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  ShieldAlert, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  ArrowUpRight,
  ShieldCheck,
  Send,
  Layers,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Company, Worker } from '../../types';

interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  workers: Worker[];
  onImpersonate: (company: Company) => void;
  onOpenNotes: (company: Company) => void;
  onToggleStatus: (companyId: string, newStatus: 'active' | 'suspended') => void;
  onSend90WorkerNotification: (company: Company) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  isOpen,
  onClose,
  company,
  workers,
  onImpersonate,
  onOpenNotes,
  onToggleStatus,
  onSend90WorkerNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'addons' | 'security'>('overview');
  const [showSuspendConfirmation, setShowSuspendConfirmation] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen || !company) return null;

  const companyWorkers = workers.filter((w) => w.companyId === company.id);

  const handleConfirmSuspend = () => {
    onToggleStatus(company.id, company.status === 'active' ? 'suspended' : 'active');
    setShowSuspendConfirmation(false);
    setActionNotice(
      company.status === 'active' 
        ? `Account ${company.name} has been suspended.`
        : `Account ${company.name} has been reactivated.`
    );
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSend90Alert = () => {
    onSend90WorkerNotification(company);
    setActionNotice(`90-worker threshold uncapping notification email dispatched to ${company.contactEmail}!`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div 
      id="company-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-200">
                {company.id}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {company.name}
              </h2>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                company.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : company.status === 'suspended'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Status: {company.status.toUpperCase()}
              </span>
              {company.totalWorkers >= 90 && (
                <span className="bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  90+ Workers Uncapped
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{company.legalEntityName}</span>
              <span>•</span>
              <span>EIN: {company.ein}</span>
              <span>•</span>
              <span>Signed up: {company.signupDate}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="impersonate-from-detail-btn"
              onClick={() => {
                onClose();
                onImpersonate(company);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              Impersonate Admin
            </button>
            <button
              id="close-company-detail-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="bg-teal-50 border-b border-teal-200 px-6 py-2.5 text-xs font-semibold text-teal-800 flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            {actionNotice}
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Company Overview & Billing
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roster' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Workers & Pay Profiles ({company.totalWorkers})
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'addons' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Partner Add-Ons & Compliance
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            System Controls & Notes
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Top Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-medium block mb-1">Total Workforce</span>
                  <span className="text-2xl font-bold text-slate-900">{company.totalWorkers}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {company.employeeCount} W-2 · {company.contractorCount} 1099
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-medium block mb-1">Stripe Monthly Base</span>
                  <span className="text-2xl font-bold text-teal-700">${company.baseMonthlyFee}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Includes 1-5 workers</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-medium block mb-1">Estimated Next Invoice</span>
                  <span className="text-2xl font-bold text-slate-900">${company.estimatedNextInvoice}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">+$3/head from 6th worker</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-medium block mb-1">Onboarding Progress</span>
                  <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {company.onboardingStatus === 'completed' ? 'Completed & Active' : 'In-Progress Step'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 truncate font-mono">
                    {company.onboardingCurrentStep}
                  </span>
                </div>
              </div>

              {/* Company Details Grid */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Company Directory & Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Primary Contact:</span>
                    <strong className="text-slate-800 text-sm font-semibold">{company.contactName}</strong>
                    <div className="flex items-center gap-2 mt-1 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {company.contactEmail}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {company.contactPhone}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Headquarters & Locations:</span>
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{company.headquartersAddress}</span>
                    </div>
                    <span className="text-slate-500 block mt-1">
                      Active Locations: <strong>{company.workLocationsCount}</strong> · States: <strong>{company.statesOfOperation.join(', ')}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Workers Comp Info */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  Workers' Compensation Coverage
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Insurance ID</span>
                    <strong className="text-slate-800 text-sm font-mono">{company.workersCompId || 'None on file'}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Carrier</span>
                    <strong className="text-slate-800 text-sm">{company.workersCompCarrier || 'State Assigned'}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Policy Expiration</span>
                    <strong className="text-slate-800 text-sm">{company.workersCompExpiry || 'Pending'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roster' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Sample Worker Profiles & Payment Info Summary
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Under Everee security rules, Teache only displays safe summaries (bank name, masked account, verification status).
                  </p>
                </div>
                <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md text-xs">
                  Showing sample roster ({companyWorkers.length} workers)
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Worker</th>
                      <th className="py-2.5 px-4">Role & Type</th>
                      <th className="py-2.5 px-4">Department</th>
                      <th className="py-2.5 px-4">Pay Structure</th>
                      <th className="py-2.5 px-4">Direct Deposit Safe Summary</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {companyWorkers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          No workers currently imported.
                        </td>
                      </tr>
                    ) : (
                      companyWorkers.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {w.avatarUrl ? (
                                <img src={w.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                  {w.firstName[0]}{w.lastName[0]}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-800 block">
                                  {w.firstName} {w.lastName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">{w.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-700 block">{w.jobTitle}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600">
                              {w.workerType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {w.department}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-800">
                            {w.workerType === 'W2_SALARY' 
                              ? `$${w.payRate.toLocaleString()}/yr`
                              : `$${w.payRate.toFixed(2)}/hr`}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                              <span className="font-medium text-slate-700">{w.bankName}</span>
                              <span className="font-mono text-slate-500 text-[11px]">{w.maskedAccount}</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1 rounded">
                              {w.directDepositStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              {w.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'addons' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                Integrated Vendor Add-Ons & Subscriptions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Posters */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      PosterElite Labor Law Posters
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {company.addons.laborLawPosters.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Automatic year-round compliance updates. Complimentary first poster active; billed add-on for multi-state or multi-location setups.
                  </p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-600">
                    Status: <strong>{company.addons.posterStatus || 'Active'}</strong>
                  </div>
                </div>

                {/* Benefits Clasp */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      Clasp Benefits ($12 PEPM)
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      company.addons.benefitsClasp ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {company.addons.benefitsClasp ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Embedded Clasp Employer & Member component for medical, dental, vision, life, and disability administration.
                  </p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-600">
                    Clasp Status: <strong>{company.addons.benefitsStatus || 'Not Offered'}</strong>
                  </div>
                </div>

                {/* HR Consultation */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      HR Consultation Service
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      company.addons.hrConsultation !== 'none' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {company.addons.hrConsultation.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Dedicated human HR guidance. $400/mo for 10 hours or $1,000/mo for 40 hours. In-app live chat support enabled for client.
                  </p>
                </div>

                {/* Equipment Lease */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Kiosk Tablet Leases ($40/dev/mo)
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {company.addons.equipmentLeaseCount} Devices
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Hardware tablets deployed for warehouse/field worker punch clock access at app.teache.com/timeclock.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              {/* Internal Notes Quick Access */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    Internal Teache Ops Notes
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Staff performance tracking & operational log for this client account.
                  </p>
                </div>
                <button
                  id="open-notes-from-detail-btn"
                  onClick={() => onOpenNotes(company)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  View & Add Internal Notes
                </button>
              </div>

              {/* 90-Worker Threshold Notification Trigger */}
              {company.totalWorkers >= 85 && (
                <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      90-Worker Uncapped Threshold Alert
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                      {company.totalWorkers} Active Workers
                    </span>
                  </div>
                  <p className="text-purple-700 text-xs">
                    This organization has crossed the 90-worker threshold. You can send the founder-prepared uncapping notice regarding expanded benefit packages and multi-state compliance.
                  </p>
                  <button
                    id="send-90-worker-email-btn"
                    onClick={handleSend90Alert}
                    className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Uncapped Benefits Email
                  </button>
                </div>
              )}

              {/* Account Suspension / Reactivation */}
              <div className="bg-white p-5 rounded-xl border border-red-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-red-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Sensitive Account Operations
                </h4>
                <p className="text-slate-600 text-xs">
                  {company.status === 'active' 
                    ? 'Suspending an account temporarily disables company login and halts future automated Stripe billings while preserving all historical HR records.'
                    : 'Reactivating will restore administrator access and resume normal platform activity.'}
                </p>

                {showSuspendConfirmation ? (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
                    <span className="font-bold text-red-800 text-xs block">
                      Confirm {company.status === 'active' ? 'Account Suspension' : 'Reactivation'}:
                    </span>
                    <input
                      type="text"
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      placeholder="Enter reason for audit logs (e.g., Stripe invoice overdue, client request)..."
                      className="w-full text-xs p-2.5 border border-red-300 rounded bg-white text-slate-800"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowSuspendConfirmation(false)}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        id="confirm-status-toggle-btn"
                        onClick={handleConfirmSuspend}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow cursor-pointer"
                      >
                        Confirm Status Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    id="toggle-suspend-account-btn"
                    onClick={() => setShowSuspendConfirmation(true)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs ${
                      company.status === 'active'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {company.status === 'active' ? 'Suspend Company Account' : 'Reactivate Company Account'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Company ID: <strong className="text-slate-700 font-mono">{company.id}</strong> · Last activity: {company.lastActivity}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
