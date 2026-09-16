import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Clock, 
  HeartHandshake, 
  Settings, 
  ShieldAlert, 
  AlertCircle, 
  PlayCircle, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Download, 
  MapPin, 
  FileText, 
  Lock,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Truck,
  X
} from 'lucide-react';
import { Company, Worker } from '../../types';

interface CompanyAdminViewProps {
  company: Company;
  workers: Worker[];
  onOpenOnboarding: () => void;
  onImpersonateWorker: (worker: Worker) => void;
  isSuperAdminImpersonating: boolean;
  onAddWorker?: (newWorker: Worker) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const CompanyAdminView: React.FC<CompanyAdminViewProps> = ({
  company,
  workers,
  onOpenOnboarding,
  onImpersonateWorker,
  isSuperAdminImpersonating,
  onAddWorker,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workforce' | 'payroll' | 'timekeeping' | 'benefits' | 'settings'>('overview');
  const [payrollStatus, setPayrollStatus] = useState<'READY' | 'RAN'>('READY');
  const [payrollNotice, setPayrollNotice] = useState<string | null>(null);
  const [showPayrollConfirmModal, setShowPayrollConfirmModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [benefitsToggle, setBenefitsToggle] = useState<boolean>(company.addons.benefitsClasp);

  const companyWorkers = workers.filter((w) => w.companyId === company.id);
  const isTransportation = company.industry.toLowerCase().includes('trucking') || company.industry.toLowerCase().includes('transportation') || company.industry.toLowerCase().includes('logistics');

  // New Worker Form State
  const [newWorkerForm, setNewWorkerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '(614) 555-0199',
    jobTitle: isTransportation ? 'Commercial Fleet Driver' : 'Operations Specialist',
    department: isTransportation ? 'Logistics' : 'General & Administrative',
    workerType: isTransportation ? ('W2_HOURLY' as const) : ('W2_SALARY' as const),
    payRate: isTransportation ? 28.50 : 65000,
    bankName: 'Huntington National Bank',
    maskedAccount: '••••3910',
  });

  const handleRunPayroll = () => {
    setShowPayrollConfirmModal(false);
    setPayrollStatus('RAN');
    setPayrollNotice('Payroll successfully executed and locked via Everee! Pay statements generated.');
    setTimeout(() => setPayrollNotice(null), 5000);
  };

  return (
    <div id="company-admin-view" className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Onboarding Incomplete Banner */}
      {company.onboardingStatus === 'in_progress' && (
        <div 
          id="onboarding-incomplete-banner"
          className="bg-amber-500 text-slate-950 px-4 py-3 shadow-md flex items-center justify-between font-medium text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2 max-w-2xl">
            <AlertCircle className="w-5 h-5 text-slate-950 shrink-0" />
            <span>
              <strong>Company Setup Incomplete:</strong> You haven’t finished setting up your company yet. Complete your tax forms, Everee payroll authorization, and worker rosters.
            </span>
          </div>
          <button
            id="resume-setup-banner-btn"
            onClick={onOpenOnboarding}
            className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-4 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer text-xs"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            Resume Setup
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {company.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-slate-900">
                    {company.name}
                  </h1>
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {company.id}
                  </span>
                  {isTransportation && (
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                      <Truck className="w-3 h-3 text-blue-600" />
                      Fleet Timekeeping Mode
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 block">
                  Logged in as Administrator: {company.contactName} ({company.contactEmail})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                Active Workers: <strong className="text-slate-900">{company.totalWorkers}</strong>
              </span>
              <button
                onClick={onOpenOnboarding}
                className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                Onboarding Wizard
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-6 overflow-x-auto text-xs font-bold text-slate-600 border-t border-slate-100">
            {[
              { id: 'overview', label: 'Dashboard', icon: Building2 },
              { id: 'workforce', label: `Workforce (${company.totalWorkers})`, icon: Users },
              { id: 'payroll', label: 'Payroll (Everee)', icon: DollarSign },
              { id: 'timekeeping', label: isTransportation ? 'Timekeeping & Fleet GPS' : 'Timekeeping', icon: Clock },
              { id: 'benefits', label: 'Benefits (Clasp)', icon: HeartHandshake },
              { id: 'settings', label: 'Settings & Billing', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`company-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
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
          </nav>
        </div>
      </header>

      {/* Notice Banner */}
      {payrollNotice && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4" />
          {payrollNotice}
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Active Team Members
                </span>
                <div className="text-3xl font-extrabold text-slate-900">
                  {company.totalWorkers}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {company.employeeCount} W-2 Employees · {company.contractorCount} 1099 Contractors
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Next Payroll Run
                </span>
                <div className="text-3xl font-extrabold text-teal-700">
                  {payrollStatus === 'RAN' ? 'Locked (Ran)' : 'Ready'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Pay Period: Bi-Weekly · Everee Synchronized
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Pending Timecards
                </span>
                <div className="text-3xl font-extrabold text-slate-900">
                  0 Unpaired Breaks
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All punches verified
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Stripe Subscription
                </span>
                <div className="text-3xl font-extrabold text-slate-900">
                  ${company.estimatedNextInvoice}/mo
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Base $30 + ${(company.totalWorkers - 5) * 3} worker count
                </div>
              </div>
            </div>

            {/* Quick Impersonate Worker section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    Interactive Worker View Testing (Admin Feature)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    As specified in the platform specs, Company Admins can toggle into worker views to inspect timeclock mobile access or view paystubs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {companyWorkers.map((worker) => (
                  <div 
                    key={worker.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      {worker.avatarUrl ? (
                        <img src={worker.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-600">
                          {worker.firstName[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">
                          {worker.firstName} {worker.lastName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {worker.jobTitle} ({worker.workerType})
                        </span>
                      </div>
                    </div>

                    <button
                      id={`impersonate-worker-${worker.id}`}
                      onClick={() => onImpersonateWorker(worker)}
                      className="bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      View As
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WORKFORCE TAB */}
        {activeTab === 'workforce' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Workforce Directory & Compensation Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Displaying safe direct deposit summaries only (Never full account or routing numbers).
                </p>
              </div>
              <button 
                id="add-new-worker-btn"
                onClick={() => setShowAddWorkerModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Worker
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Worker Profile</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Compensation</th>
                    <th className="py-3 px-4">Safe Payment Summary</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companyWorkers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {worker.avatarUrl ? (
                            <img src={worker.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-600">
                              {worker.firstName[0]}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block">{worker.firstName} {worker.lastName}</span>
                            <span className="text-[11px] text-slate-400">{worker.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{worker.jobTitle}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600">
                          {worker.workerType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {worker.workerType === 'W2_SALARY' 
                          ? `$${worker.payRate.toLocaleString()}/yr`
                          : `$${worker.payRate.toFixed(2)}/hr`}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                          <span className="font-semibold">{worker.bankName}</span>
                          <span className="font-mono text-slate-500">{worker.maskedAccount}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1 rounded">
                          {worker.directDepositStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          {worker.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onImpersonateWorker(worker)}
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

        {/* PAYROLL TAB */}
        {activeTab === 'payroll' && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      Payroll Period: 04/01/2026 – 04/15/2026
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      payrollStatus === 'RAN' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Status: {payrollStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Everee Integration · Synchronized with Approved Time Records · 14-day free trial applies on first run
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="open-payroll-adjustment-btn"
                    onClick={() => setShowAdjustmentModal(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    + Pay Adjustment (Future Run)
                  </button>

                  {payrollStatus === 'READY' ? (
                    <button
                      id="run-payroll-action-btn"
                      onClick={() => setShowPayrollConfirmModal(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      Run Payroll
                    </button>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Locked (Ran)
                    </span>
                  )}
                </div>
              </div>

              {/* Payroll Totals Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Total Gross Pay</span>
                  <span className="text-xl font-extrabold text-slate-900">$14,840.00</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Total Net Pay</span>
                  <span className="text-xl font-extrabold text-teal-700">$11,420.50</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Total Withheld Taxes</span>
                  <span className="text-xl font-extrabold text-slate-700">$3,419.50</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Everee Processing Date</span>
                  <span className="text-xl font-extrabold text-slate-900">04/18/2026</span>
                </div>
              </div>

              {/* Pay Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Worker Name</th>
                      <th className="py-2.5 px-3">Pay Type</th>
                      <th className="py-2.5 px-3">Approved Hours</th>
                      <th className="py-2.5 px-3">Base Pay</th>
                      <th className="py-2.5 px-3">Bonus / Tips</th>
                      <th className="py-2.5 px-3">Total Pay</th>
                      <th className="py-2.5 px-3">Paystub</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {companyWorkers.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {w.firstName} {w.lastName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {w.workerType}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {w.workerType === 'W2_SALARY' ? '80.0 hrs' : '76.5 hrs'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium">
                          {w.workerType === 'W2_SALARY' ? `$${(w.payRate / 26).toFixed(2)}` : `$${(w.payRate * 76.5).toFixed(2)}`}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          $0.00
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {w.workerType === 'W2_SALARY' ? `$${(w.payRate / 26).toFixed(2)}` : `$${(w.payRate * 76.5).toFixed(2)}`}
                        </td>
                        <td className="py-2.5 px-3">
                          <button 
                            className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-semibold cursor-pointer"
                            title="Download PDF paystub"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TIMEKEEPING TAB */}
        {activeTab === 'timekeeping' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  {isTransportation ? 'Transportation Fleet Timekeeping & GPS Verification' : 'Company Timekeeping & Attendance'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTransportation 
                    ? 'Captures Drive Time + Wait Time - Unpaid Breaks with verified approximate clock punch locations.'
                    : 'Standard Attendance & Kiosk Punch Records. Internal precision to exact minute without rounding.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                  Kiosk: app.teache.com/timeclock
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Worker Name</th>
                    <th className="py-2.5 px-3">Shift Date</th>
                    <th className="py-2.5 px-3">Clock In</th>
                    {isTransportation ? (
                      <>
                        <th className="py-2.5 px-3">Drive Time</th>
                        <th className="py-2.5 px-3">Wait Time</th>
                        <th className="py-2.5 px-3">Unpaid Breaks</th>
                      </>
                    ) : (
                      <>
                        <th className="py-2.5 px-3">Break Start</th>
                        <th className="py-2.5 px-3">Break End</th>
                      </>
                    )}
                    <th className="py-2.5 px-3">Clock Out</th>
                    <th className="py-2.5 px-3">Total Hours</th>
                    {isTransportation && <th className="py-2.5 px-3">Verified Location</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-sans font-bold text-slate-900">
                      Carlos Mendez (Driver)
                    </td>
                    <td className="py-3 px-3 text-slate-600">04/14/2026</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">08:02 AM</td>
                    {isTransportation ? (
                      <>
                        <td className="py-3 px-3 text-blue-700">6.0 hrs</td>
                        <td className="py-3 px-3 text-amber-700">2.0 hrs</td>
                        <td className="py-3 px-3 text-slate-500">1.0 hr</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-3">12:01 PM</td>
                        <td className="py-3 px-3">12:31 PM</td>
                      </>
                    )}
                    <td className="py-3 px-3 text-red-700 font-bold">05:03 PM</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {isTransportation ? '7.00 hrs' : '8.50 hrs'}
                    </td>
                    {isTransportation && (
                      <td className="py-3 px-3 font-sans text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          Columbus Logistics Hub (Roberts Rd)
                        </span>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BENEFITS TAB */}
        {activeTab === 'benefits' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-purple-600" />
                  Clasp Benefits Administration ($12 PEPM)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Embedded Clasp Employer component for medical, dental, vision, open enrollment, and qualifying life events.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Benefits Toggle:</span>
                <button
                  id="toggle-benefits-management-btn"
                  onClick={() => setBenefitsToggle(!benefitsToggle)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    benefitsToggle ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {benefitsToggle ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            {benefitsToggle ? (
              <div className="border border-purple-200 rounded-xl p-6 bg-purple-50/40 text-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 text-sm">
                    Active Clasp Group Policy Plans
                  </span>
                  <span className="bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded text-[11px]">
                    Clasp Employer ID: CLASP-EMP-99201
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-lg border border-purple-100 shadow-2xs">
                    <span className="font-bold text-slate-900 block">Anthem BlueCross PPO</span>
                    <span className="text-[11px] text-slate-500">Medical (80/20 Cost-share)</span>
                    <span className="text-xs text-purple-800 font-semibold block mt-2">24 Enrolled</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-purple-100 shadow-2xs">
                    <span className="font-bold text-slate-900 block">Delta Dental Premier</span>
                    <span className="text-[11px] text-slate-500">Comprehensive Dental</span>
                    <span className="text-xs text-purple-800 font-semibold block mt-2">19 Enrolled</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-purple-100 shadow-2xs">
                    <span className="font-bold text-slate-900 block">VSP Vision Care</span>
                    <span className="text-[11px] text-slate-500">Standard Eye Exam & Lenses</span>
                    <span className="text-xs text-purple-800 font-semibold block mt-2">22 Enrolled</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-purple-100 text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">
                    Clasp Deductions Flowing into Everee Payroll:
                  </p>
                  <p>
                    Automatic pre-tax benefit deductions are calculated by Clasp and applied to each employee paycheck. Premium billing is handled directly through Clasp; Teache charges $12 PEPM for software benefits management.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-800">Benefits Management Disabled</p>
                <p className="text-xs text-slate-500 mt-1">
                  Enable the toggle above to launch Clasp embedded benefits setup.
                </p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Organization Settings & Stripe Billing
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your subscription, add-ons, and payment methods.
              </p>
            </div>

            {/* Invoices and Receipts */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-800 text-xs block">
                Invoices & Receipts
              </span>
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Invoice #INV-2026-03</span>
                  <span className="text-slate-500 text-[11px]">Paid on 03/31/2026 · Card ending in 8412</span>
                </div>
                <span className="font-mono font-bold text-slate-900">$189.00</span>
              </div>

              {/* CANCEL PLAN explicitly placed under Invoices & Receipts as requested! */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-red-900 text-xs block">Cancel Plan</span>
                  <span className="text-[11px] text-slate-500">
                    Discontinue monthly platform access and future recurring Stripe charges.
                  </span>
                </div>
                <button
                  id="cancel-plan-btn"
                  onClick={() => alert('Plan cancellation flow initiated via Stripe Billing API.')}
                  className="bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payroll Confirmation Modal */}
      {showPayrollConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-base">
                Confirm Final Payroll Execution
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                “You cannot make edits after payroll status reflects 'Ran'. All hours and pay values for this pay period will become locked. Future corrections must be handled via Payroll Adjustments.”
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPayrollConfirmModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-lg transition cursor-pointer"
              >
                No, Go Back
              </button>
              <button
                id="confirm-run-payroll-btn"
                onClick={handleRunPayroll}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-lg transition shadow cursor-pointer"
              >
                Yes, Run Payroll Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Adjustment Pop-up Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Create Payroll Adjustment
              </h4>
              <button onClick={() => setShowAdjustmentModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Adjustment entries do not unlock completed pay runs; they automatically append to the next scheduled pay cycle.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Worker</label>
                <select className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                  {companyWorkers.map(w => (
                    <option key={w.id} value={w.id}>{w.firstName} {w.lastName} ({w.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Adjustment Type</label>
                <select className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                  <option>Hours Adjustment</option>
                  <option>Earnings Adjustment</option>
                  <option>Tips Adjustment</option>
                  <option>Reimbursement Adjustment</option>
                  <option>Deduction Adjustment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hours</label>
                  <input type="number" defaultValue={2} className="w-full border border-slate-200 rounded-lg p-2" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rate ($)</label>
                  <input type="number" defaultValue={28.5} className="w-full border border-slate-200 rounded-lg p-2" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs font-semibold py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAdjustmentModal(false);
                  setPayrollNotice('Adjustment scheduled for upcoming pay cycle!');
                  setTimeout(() => setPayrollNotice(null), 3500);
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-lg transition shadow cursor-pointer"
              >
                Submit Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Worker Modal */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Add New Team Member
                </h4>
                <p className="text-[11px] text-slate-500">
                  Worker will be immediately provisioned for timeclock access and Everee payroll.
                </p>
              </div>
              <button
                onClick={() => setShowAddWorkerModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newWorkerForm.firstName.trim() || !newWorkerForm.lastName.trim()) return;

                const newWorker: Worker = {
                  id: `WRK-${Math.floor(1000 + Math.random() * 9000)}`,
                  companyId: company.id,
                  firstName: newWorkerForm.firstName.trim(),
                  lastName: newWorkerForm.lastName.trim(),
                  email: newWorkerForm.email || `${newWorkerForm.firstName.toLowerCase()}.${newWorkerForm.lastName.toLowerCase()}@example.com`,
                  phone: newWorkerForm.phone,
                  jobTitle: newWorkerForm.jobTitle,
                  department: newWorkerForm.department,
                  workerType: newWorkerForm.workerType,
                  role: 'employee',
                  payRate: Number(newWorkerForm.payRate),
                  status: 'active',
                  directDepositStatus: 'verified',
                  bankName: newWorkerForm.bankName,
                  maskedAccount: newWorkerForm.maskedAccount,
                  hireDate: '04/15/2026',
                };

                if (onAddWorker) {
                  onAddWorker(newWorker);
                }
                if (onShowToast) {
                  onShowToast('Worker Added', `${newWorker.firstName} ${newWorker.lastName} added to ${company.name}`, 'success');
                }
                setShowAddWorkerModal(false);
                setNewWorkerForm({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '(614) 555-0199',
                  jobTitle: isTransportation ? 'Commercial Fleet Driver' : 'Operations Specialist',
                  department: isTransportation ? 'Logistics' : 'General & Administrative',
                  workerType: isTransportation ? 'W2_HOURLY' : 'W2_SALARY',
                  payRate: isTransportation ? 28.50 : 65000,
                  bankName: 'Huntington National Bank',
                  maskedAccount: '••••3910',
                });
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                  <input
                    required
                    type="text"
                    value={newWorkerForm.firstName}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, firstName: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-slate-900"
                    placeholder="e.g. Samuel"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    required
                    type="text"
                    value={newWorkerForm.lastName}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, lastName: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-slate-900"
                    placeholder="e.g. Jenkins"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newWorkerForm.email}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-900"
                  placeholder="samuel.jenkins@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newWorkerForm.jobTitle}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, jobTitle: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Worker Type</label>
                  <select
                    value={newWorkerForm.workerType}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, workerType: e.target.value as any })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-900 font-medium"
                  >
                    <option value="W2_HOURLY">W-2 Hourly</option>
                    <option value="W2_SALARY">W-2 Salary</option>
                    <option value="1099_HOURLY">1099 Contractor (Hourly)</option>
                    <option value="1099_PROJECT">1099 Contractor (Project)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {newWorkerForm.workerType === 'W2_SALARY' ? 'Annual Salary ($)' : 'Hourly Rate ($)'}
                  </label>
                  <input
                    type="number"
                    value={newWorkerForm.payRate}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, payRate: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Direct Deposit Bank</label>
                  <input
                    type="text"
                    value={newWorkerForm.bankName}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, bankName: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl transition shadow cursor-pointer"
                >
                  Confirm & Provision Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
