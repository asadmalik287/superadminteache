import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  PlayCircle, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  HeartHandshake, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  StickyNote, 
  Plus, 
  CreditCard, 
  Truck, 
  ShieldAlert,
  Send,
  Eye,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Company, Worker, InternalNote, AuditLogEntry, AccountStatus } from '../../types';

interface CompanyDetailPageProps {
  company: Company;
  workers: Worker[];
  notes: InternalNote[];
  auditLogs: AuditLogEntry[];
  onBack: () => void;
  onImpersonate: (company: Company) => void;
  onImpersonateWorker: (worker: Worker) => void;
  onToggleStatus: (companyId: string, newStatus: AccountStatus) => void;
  onSend90WorkerNotification: (company: Company) => void;
  onAddNote: (newNote: Omit<InternalNote, 'id' | 'createdAt'>) => void;
  currentUser: { name: string; email: string; roleTitle: any };
}

export const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({
  company,
  workers,
  notes,
  auditLogs,
  onBack,
  onImpersonate,
  onImpersonateWorker,
  onToggleStatus,
  onSend90WorkerNotification,
  onAddNote,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workforce' | 'payroll' | 'addons' | 'notes' | 'audit'>('overview');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<InternalNote['category']>('General');
  const [alertSent, setAlertSent] = useState(false);

  const companyWorkers = workers.filter((w) => w.companyId === company.id);
  const companyNotes = notes.filter((n) => n.companyId === company.id);
  const companyAudit = auditLogs.filter((a) => a.companyId === company.id || a.details.includes(company.id));

  const isSuspended = company.status === 'suspended';
  const isTransportation = company.industry.toLowerCase().includes('trucking') || company.industry.toLowerCase().includes('transportation') || company.industry.toLowerCase().includes('logistics');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    onAddNote({
      companyId: company.id,
      authorName: currentUser.name,
      authorRole: currentUser.roleTitle,
      category: newNoteCategory,
      content: newNoteContent.trim(),
    });
    setNewNoteContent('');
  };

  const handleSendAlert = () => {
    onSend90WorkerNotification(company);
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  };

  return (
    <div id="company-detail-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Back Button & Top Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Companies Directory</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleStatus(company.id, isSuspended ? 'active' : 'suspended')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isSuspended
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {isSuspended ? 'Reactivate Account' : 'Suspend Account'}
          </button>

          <button
            id="detail-impersonate-company-btn"
            onClick={() => onImpersonate(company)}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Impersonate Company Admin</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {company.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {company.name}
                </h1>
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {company.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                  isSuspended ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {company.status}
                </span>
                {isTransportation && (
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Truck className="w-3 h-3 text-blue-600" />
                    Fleet Logistics
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Legal Entity: <strong>{company.legalEntityName}</strong> · EIN: <span className="font-mono">{company.ein}</span> · {company.businessType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Stripe Plan MRR</span>
              <span className="text-xl font-extrabold text-slate-900">${company.estimatedNextInvoice}/mo</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Workforce</span>
              <span className="text-xl font-extrabold text-slate-900">{company.totalWorkers}</span>
            </div>
          </div>
        </div>

        {/* 90-Worker Uncap Warning */}
        {company.approachingUncap90Workers && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="block">Approaching 90-Worker Uncapped Benefits Tier ({company.totalWorkers} Active Workers)</strong>
                <span>At 90+ workers, health benefits PEPM shifts to uncapped rate tiers. Send compliance notification to administrator.</span>
              </div>
            </div>
            <button
              onClick={handleSendAlert}
              disabled={alertSent}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold px-3.5 py-1.5 rounded-lg transition shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {alertSent ? 'Notification Dispatched!' : 'Send Uncap Alert'}
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex space-x-6 border-t border-slate-100 pt-4 overflow-x-auto text-xs font-bold text-slate-600">
          {[
            { id: 'overview', label: 'Company Overview', icon: Building2 },
            { id: 'workforce', label: `Workforce (${companyWorkers.length})`, icon: Users },
            { id: 'payroll', label: 'Everee Payroll & Tax', icon: DollarSign },
            { id: 'addons', label: 'Add-ons & Billing', icon: HeartHandshake },
            { id: 'notes', label: `Internal Notes (${companyNotes.length})`, icon: StickyNote },
            { id: 'audit', label: `Audit Trail (${companyAudit.length})`, icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Primary Contact & Headquarters
            </h3>
            <div className="space-y-2.5 text-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Contact Name: <strong>{company.contactName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Contact Email: <strong>{company.contactEmail}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Contact Phone: <strong>{company.contactPhone}</strong></span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <span>Headquarters: <strong>{company.headquartersAddress}</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Regulatory & Workers' Comp Coverage
            </h3>
            <div className="space-y-2.5 text-slate-700">
              <div>
                <span className="text-slate-400 block">States of Operation:</span>
                <span className="font-bold text-slate-900">{company.statesOfOperation.join(', ') || 'Ohio'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Workers' Compensation ID:</span>
                <span className="font-mono font-bold text-teal-800">{company.workersCompId || 'None registered'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Expiration Date:</span>
                <span className="font-bold text-slate-900">{company.workersCompExpiry || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Worksite Physical Locations:</span>
                <span className="font-bold text-slate-900">{company.workLocationsCount} worksite locations</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Workforce */}
      {activeTab === 'workforce' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Active Workers Directory ({companyWorkers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Safe payment masking applied (never displaying full account or routing numbers).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Worker Profile</th>
                  <th className="py-3 px-4">Job Title & Type</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companyWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-700">
                          {w.firstName[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{w.firstName} {w.lastName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{w.id} · {w.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{w.jobTitle}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        {w.workerType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {w.workerType === 'W2_SALARY' ? `$${w.payRate.toLocaleString()}/yr` : `$${w.payRate.toFixed(2)}/hr`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                        <span className="font-semibold">{w.bankName}</span>
                        <span className="font-mono text-slate-400">{w.maskedAccount}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onImpersonateWorker(w)}
                        className="bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        Impersonate Worker
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payroll */}
      {activeTab === 'payroll' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">
            Everee Embedded Payroll & Tax Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block">Schedule</span>
              <span className="text-base font-bold text-slate-900">Bi-Weekly (Every Other Friday)</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block">Everee Authorization (Form 8655)</span>
              <span className="text-base font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Active on File
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block">Tax Direct Deposit</span>
              <span className="text-base font-bold text-teal-700">ACH Processing Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Add-ons & Billing */}
      {activeTab === 'addons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              PosterElite Compliance Posters
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Service Type:</span>
              <strong className="text-slate-900 uppercase">{company.addons.laborLawPosters}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Poster Status:</span>
              <strong className="text-emerald-700">Complimentary Covered by Teache</strong>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Clasp Benefits Administration ($12 PEPM)
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Benefits Managed:</span>
              <strong className={company.addons.benefitsClasp ? 'text-purple-700' : 'text-slate-500'}>
                {company.addons.benefitsClasp ? 'Enabled (Clasp Broker of Record)' : 'Not Enabled'}
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Carrier Contact:</span>
              <strong className="font-mono text-slate-700">partnerships@withclasp.com</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Internal Team Notes */}
      {activeTab === 'notes' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Internal Team Operational Notes
            </h3>
            <p className="text-slate-500 mt-0.5">
              Strictly invisible to clients. Visible across all Super Admin roles with author attribution.
            </p>
          </div>

          {/* New Note Form */}
          <form onSubmit={handleCreateNote} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Add Operational Note</span>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as any)}
                className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs bg-white text-slate-800"
              >
                <option value="Onboarding Help">Onboarding Help</option>
                <option value="Payroll Setup">Payroll Setup</option>
                <option value="Poster Dispatch">Poster Dispatch</option>
                <option value="HR Consulting">HR Consulting</option>
                <option value="Billing & Cap">Billing & Cap</option>
                <option value="General">General</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Type internal note details..."
              className="w-full border border-slate-300 rounded-xl p-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Post Note
              </button>
            </div>
          </form>

          {/* Notes list */}
          <div className="space-y-3">
            {companyNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{note.authorName}</span>
                    <span className="text-[10px] text-slate-500 font-semibold bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                      {note.authorRole}
                    </span>
                    <span className="text-[10px] text-teal-800 bg-teal-50 font-bold px-1.5 py-0.2 rounded">
                      {note.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{note.createdAt}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{note.content}</p>
              </div>
            ))}
            {companyNotes.length === 0 && (
              <div className="text-center py-6 text-slate-400">
                No internal notes recorded yet for this organization.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Activity History for {company.name}
            </h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {companyAudit.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.action}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded uppercase font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{item.details}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 shrink-0 font-mono">
                  {item.timestamp}
                </div>
              </div>
            ))}
            {companyAudit.length === 0 && (
              <div className="text-center py-6 text-slate-400">
                No dedicated audit logs recorded for this company yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
