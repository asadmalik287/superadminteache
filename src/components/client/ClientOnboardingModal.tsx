import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Building2, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  Briefcase, 
  FileText, 
  DollarSign, 
  HeartHandshake, 
  CheckCircle2, 
  AlertTriangle,
  Upload,
  Info,
  Phone
} from 'lucide-react';
import { Company, OnboardingFormData } from '../../types';

interface ClientOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onSaveProgress: (updatedCompany: Company, isComplete?: boolean) => void;
  isSuperAdminImpersonating?: boolean;
}

const ALL_50_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
  'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const BUSINESS_TYPES = [
  'LLC (Limited Liability Company)',
  'C Corporation',
  'S Corporation',
  'Partnership (General or Limited)',
  'Sole Proprietorship',
  'Non-Profit (501c3)',
  'Professional Corporation (PC/PA)'
];

const INDUSTRIES = [
  'Agriculture & Farming', 'Aquatics & Marine Services', 'Automotive Services', 'Beauty & Spa',
  'Childcare Services', 'Cleaning & Janitorial Services', 'Construction', 'Education',
  'Entertainment & Events', 'Food & Beverage', 'Healthcare', 'Home Services', 'Hospitality',
  'Logistics', 'Manufacturing', 'Nonprofit', 'Professional Services', 'Property Management',
  'Real Estate', 'Retail', 'Security Services', 'Skilled Trades', 'Technology',
  'Trucking & Transportation', 'Wellness & Fitness', 'Other'
];

export const ClientOnboardingModal: React.FC<ClientOnboardingModalProps> = ({
  isOpen,
  onClose,
  company,
  onSaveProgress,
  isSuperAdminImpersonating = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [acknowledgedCompliance, setAcknowledgedCompliance] = useState<boolean>(true);
  const [showWorkersCompWarning, setShowWorkersCompWarning] = useState<boolean>(false);
  const [showZeroWorkersConfirm, setShowZeroWorkersConfirm] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Form State initialized from company
  const [form, setForm] = useState<OnboardingFormData>({
    companyName: company.name || '',
    legalEntityName: company.legalEntityName || '',
    ein: company.ein || '',
    businessType: company.businessType || 'LLC (Limited Liability Company)',
    statesOfOperation: company.statesOfOperation || ['Ohio'],
    contactName: company.contactName || '',
    contactEmail: company.contactEmail || '',
    contactPhone: company.contactPhone || '',
    fullAddress: company.headquartersAddress || '',
    employeeCount: company.employeeCount ?? 15,
    contractorCount: company.contractorCount ?? 3,
    workersCompId: company.workersCompId || '',
    workersCompExpiry: company.workersCompExpiry || '',
    industry: company.industry || 'Trucking & Transportation',
    hasPosterSolution: company.addons.laborLawPosters !== 'none',
    posterType: 'BOTH',
    workEnvironment: 'Hybrid',
    purchaseAdditionalPosters: false,
    payFrequency: 'Bi-Weekly',
    payPeriodStartDay: 'Monday',
    payDateChoice: 'Every Other Friday',
    switchingMidYear: true,
    directDeposit: true,
    ptoTracking: true,
    ptoAccrualMethod: 'hours_worked',
    ptoYearEndPolicy: 'rollover',
    maxRolloverHours: 40,
    currentlyOfferBenefits: company.addons.benefitsClasp,
    benefitsManagedByClasp: false,
    wantsToOfferBenefits: true,
    benefitsSpecialistContacted: false,
    ...company.onboardingSavedData,
  });

  if (!isOpen) return null;

  const steps = [
    { id: 'compliance', title: 'Compliance Acknowledgment', icon: ShieldCheck },
    { id: 'company_info', title: 'Company Information', icon: Building2 },
    { id: 'worker_counts', title: 'Workforce Composition', icon: Users },
    { id: 'workers_comp', title: 'Workers\' Compensation', icon: AlertTriangle },
    { id: 'bulk_upload', title: 'Bulk Files & Docs Import', icon: FileSpreadsheet },
    { id: 'industry', title: 'Industry Classification', icon: Briefcase },
    { id: 'posters', title: 'Labor Law Posters', icon: FileText },
    { id: 'payroll', title: 'Payroll Setup (Everee)', icon: DollarSign },
    { id: 'benefits', title: 'Benefits (Clasp)', icon: HeartHandshake },
    { id: 'review', title: 'Review & Submit', icon: CheckCircle2 },
  ];

  const handleStateToggle = (stateName: string) => {
    if (form.statesOfOperation.includes(stateName)) {
      setForm({
        ...form,
        statesOfOperation: form.statesOfOperation.filter((s) => s !== stateName),
      });
    } else {
      setForm({
        ...form,
        statesOfOperation: [...form.statesOfOperation, stateName],
      });
    }
  };

  const handleSaveOnly = () => {
    const updatedCompany: Company = {
      ...company,
      name: form.companyName || company.name,
      legalEntityName: form.legalEntityName || company.legalEntityName,
      ein: form.ein || company.ein,
      businessType: form.businessType,
      industry: form.industry,
      statesOfOperation: form.statesOfOperation,
      headquartersAddress: form.fullAddress || company.headquartersAddress,
      contactName: form.contactName || company.contactName,
      contactEmail: form.contactEmail || company.contactEmail,
      contactPhone: form.contactPhone || company.contactPhone,
      employeeCount: Number(form.employeeCount) || 0,
      contractorCount: Number(form.contractorCount) || 0,
      totalWorkers: (Number(form.employeeCount) || 0) + (Number(form.contractorCount) || 0),
      workersCompId: form.workersCompId,
      workersCompExpiry: form.workersCompExpiry,
      onboardingStatus: 'in_progress',
      onboardingLastSavedAt: new Date().toLocaleTimeString() + ' EST',
      onboardingSavedData: form,
    };

    onSaveProgress(updatedCompany, false);
    setSaveBanner('Progress auto-saved successfully! You can resume setup at any time.');
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const handleNext = () => {
    // Validation on worker count step
    if (currentStepIndex === 2) {
      if (form.employeeCount === 0 && form.contractorCount === 0 && !showZeroWorkersConfirm) {
        setShowZeroWorkersConfirm(true);
        return;
      }
    }

    // Validation on workers comp step
    if (currentStepIndex === 3) {
      if (form.employeeCount > 0 && !form.workersCompId && !showWorkersCompWarning) {
        setShowWorkersCompWarning(true);
        return;
      }
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleFinalSubmit = () => {
    const totalW = (Number(form.employeeCount) || 0) + (Number(form.contractorCount) || 0);
    const updatedCompany: Company = {
      ...company,
      name: form.companyName,
      legalEntityName: form.legalEntityName,
      ein: form.ein,
      businessType: form.businessType,
      industry: form.industry,
      statesOfOperation: form.statesOfOperation,
      headquartersAddress: form.fullAddress,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      employeeCount: Number(form.employeeCount) || 0,
      contractorCount: Number(form.contractorCount) || 0,
      totalWorkers: totalW,
      baseMonthlyFee: 30,
      estimatedNextInvoice: totalW <= 5 ? 30 : 30 + (totalW - 5) * 3,
      workersCompId: form.workersCompId,
      workersCompExpiry: form.workersCompExpiry,
      onboardingStatus: 'completed',
      onboardingCurrentStep: 'review_confirm',
      onboardingSavedData: form,
      addons: {
        ...company.addons,
        laborLawPosters: form.hasPosterSolution ? (form.posterType.toLowerCase() as any) : 'none',
        benefitsClasp: form.currentlyOfferBenefits || form.wantsToOfferBenefits,
        benefitsStatus: form.currentlyOfferBenefits ? 'active_embedded' : 'consultation_requested',
      }
    };

    onSaveProgress(updatedCompany, true);
    onClose();
  };

  return (
    <div 
      id="client-onboarding-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-teal-900 text-[11px] font-extrabold px-2 py-0.5 rounded uppercase">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              {isSuperAdminImpersonating && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  Impersonation Mode: Completing on Client's Behalf
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Client Onboarding: {steps[currentStepIndex].title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="save-onboarding-progress-btn"
              onClick={handleSaveOnly}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-teal-600" />
              Save Progress
            </button>
            <button
              id="close-onboarding-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Banner */}
        {saveBanner && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {saveBanner}
          </div>
        )}

        {/* Stepper Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-100/60 overflow-x-auto flex items-center gap-2 text-xs">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md whitespace-nowrap transition cursor-pointer ${
                  isCurrent 
                    ? 'bg-teal-600 text-white font-bold shadow-2xs' 
                    : isCompleted
                    ? 'bg-teal-50 text-teal-800 font-medium'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 text-teal-600 stroke-[3]" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span>{idx + 1}. {step.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs bg-slate-50/40">
          {/* STEP 0: Compliance Acknowledgment */}
          {currentStepIndex === 0 && (
            <div className="max-w-2xl mx-auto py-4 space-y-5">
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  Compliance & Regulatory Responsibility Notice
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Welcome to Teache! We’re excited to help you get your company set up. If you need support at any point during the process, our implementation team is here to assist you.
                </p>
                <div className="bg-white p-4 rounded-lg border border-amber-200 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="compliance-ack-checkbox"
                      type="checkbox"
                      checked={acknowledgedCompliance}
                      onChange={(e) => setAcknowledgedCompliance(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-slate-800 font-medium leading-relaxed">
                      “I understand that while Teache provides compliance tools and consultation, I am responsible for ensuring my company complies with all applicable local, state, and federal laws.”
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  id="ack-start-btn"
                  disabled={!acknowledgedCompliance}
                  onClick={handleNext}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow flex items-center gap-2 cursor-pointer text-sm"
                >
                  Start Onboarding Checklist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Company Info */}
          {currentStepIndex === 1 && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Step 1: Company Details & Locations
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Company Display Name</label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Legal Entity Name</label>
                    <input
                      type="text"
                      value={form.legalEntityName}
                      onChange={(e) => setForm({ ...form, legalEntityName: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">EIN (Federal Tax ID)</label>
                    <input
                      type="text"
                      value={form.ein}
                      onChange={(e) => setForm({ ...form, ein: e.target.value })}
                      placeholder="XX-XXXXXXX"
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Business Entity Type</label>
                    <select
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 bg-white"
                    >
                      {BUSINESS_TYPES.map((bt) => (
                        <option key={bt} value={bt}>{bt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Primary Contact Name</label>
                    <input
                      type="text"
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Headquarters / Primary Address</label>
                    <input
                      type="text"
                      value={form.fullAddress}
                      onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
                      placeholder="Full Street, City, State, ZIP"
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>
                </div>

                {/* States of Operation Multi-Select */}
                <div className="pt-2">
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    State(s) of Operation (Multi-Select)
                  </label>
                  <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {ALL_50_STATES.map((st) => {
                      const isSelected = form.statesOfOperation.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStateToggle(st)}
                          className={`text-left px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-teal-600 text-white font-semibold' 
                              : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{st}</span>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Selected: {form.statesOfOperation.join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Worker Count Split */}
          {currentStepIndex === 2 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  How many people will you be managing in the system?
                </h4>
                <p className="text-slate-600 text-xs">
                  Split between W-2 payroll employees and 1099 independent contractors.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="font-bold text-slate-800 block mb-1 text-sm">
                      W-2 Employees
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.employeeCount}
                      onChange={(e) => setForm({ ...form, employeeCount: parseInt(e.target.value) || 0 })}
                      className="w-full text-lg font-bold p-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Receives taxes withheld, paystubs, benefits eligibility.
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="font-bold text-slate-800 block mb-1 text-sm">
                      1099 Contractors
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.contractorCount}
                      onChange={(e) => setForm({ ...form, contractorCount: parseInt(e.target.value) || 0 })}
                      className="w-full text-lg font-bold p-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      No tax withholding, self-employed, no employee benefits.
                    </span>
                  </div>
                </div>

                {showZeroWorkersConfirm && (
                  <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl space-y-3">
                    <p className="font-semibold text-amber-900">
                      You entered: {form.employeeCount} Employees, {form.contractorCount} 1099 Independent Contractors. Is this correct?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowZeroWorkersConfirm(false);
                          setCurrentStepIndex(currentStepIndex + 1);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        YES, Proceed
                      </button>
                      <button
                        onClick={() => setShowZeroWorkersConfirm(false)}
                        className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        NO, Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Workers Comp */}
          {currentStepIndex === 3 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  What is your Workers’ Compensation ID and expiration date?
                </h4>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-900 text-xs">
                  <Info className="w-4 h-4 inline mr-1 text-blue-600" />
                  Some states require employers to obtain Workers’ Compensation coverage directly through the state or through a licensed broker. If you are unsure which process applies to your business, please contact Teache at <strong>support@teachepro.com</strong>.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Workers' Comp Insurance ID
                    </label>
                    <input
                      type="text"
                      value={form.workersCompId}
                      onChange={(e) => setForm({ ...form, workersCompId: e.target.value })}
                      placeholder="e.g. WC-OH-882914"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      value={form.workersCompExpiry}
                      onChange={(e) => setForm({ ...form, workersCompExpiry: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>
                </div>

                {showWorkersCompWarning && (
                  <div className="bg-red-50 border border-red-300 p-4 rounded-xl space-y-3 animate-in fade-in">
                    <p className="text-red-900 text-xs leading-relaxed font-medium">
                      “You did not enter your Workers’ Compensation ID but confirmed that you have employees. This may result in being out of compliance, as Workers’ Compensation coverage is required by law in many states. If you are unsure of your requirements, please contact Teache at support@teachepro.com for guidance. Would you like to proceed?”
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowWorkersCompWarning(false)}
                        className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        NO, Go Back
                      </button>
                      <button
                        onClick={() => {
                          setShowWorkersCompWarning(false);
                          setCurrentStepIndex(currentStepIndex + 1);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        YES, Proceed Anyway
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Bulk Upload */}
          {currentStepIndex === 4 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Core Bulk Import Files Section (Optional)
                </h4>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-700 text-xs">
                  <strong>Note on Employment Status:</strong> If you have a W‑2 employee who is marked as a contractor in another HR system, please ensure the file reflects the correct employment type before importing. In the Teache platform, ‘contractor’ refers to 1099 status only. No benefits will be deducted and no taxes will be withheld for workers marked as 1099 contractors.
                </div>

                <div className="space-y-3">
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        1. Worker Profile CSV
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        First Name, Last Name, Email, Job Title, Dept, Start Date, Pay Rate, Pay Type.
                      </span>
                    </div>
                    <label className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Browse CSV
                      <input type="file" accept=".csv" className="hidden" />
                    </label>
                  </div>

                  <div className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        2. Signed HR Documents (ZIP Upload)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        e.g. jordan-smith_W4.pdf, mia-lee_Handbook.pdf. Auto-matched to employee profiles.
                      </span>
                    </div>
                    <label className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Browse ZIP
                      <input type="file" accept=".zip" className="hidden" />
                    </label>
                  </div>

                  <div className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        3. Training Completion CSV (Optional Log)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Employee Name, Training Title, Completion Date, Type.
                      </span>
                    </div>
                    <label className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Browse CSV
                      <input type="file" accept=".csv" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 p-3 rounded-lg flex items-center justify-between text-teal-900">
                  <span className="font-medium text-xs">
                    Need help importing your docs?
                  </span>
                  <span className="text-xs font-bold font-mono">
                    Call 1-800-555-TEACHE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Industry Classification */}
          {currentStepIndex === 5 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  What industry are you in?
                </h4>
                <p className="text-slate-600 text-xs">
                  Selecting <strong>Trucking & Transportation</strong> unlocks specialized driver timekeeping (Drive Time, Wait Time, Location Verification).
                </p>

                <div>
                  <select
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-white text-slate-800 font-medium"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                {form.industry === 'Other' && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Please specify your industry:
                    </label>
                    <input
                      type="text"
                      value={form.otherIndustryText || ''}
                      onChange={(e) => setForm({ ...form, otherIndustryText: e.target.value })}
                      placeholder="Type your industry..."
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Labor Law Posters (PosterElite) */}
          {currentStepIndex === 6 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Subsection: Labor Law Posters (PosterElite)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Federal and state labor laws require displaying workplace notices even if the business has only one employee. Teache partners with PosterElite to keep you compliant year-round.
                </p>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-xs block">
                    Where does your team primarily work?
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      '100% Remote',
                      'Hybrid',
                      'On-site (one location)',
                      'On-site (multi-location, same state)',
                      'On-site (multi-state)'
                    ].map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setForm({ ...form, workEnvironment: env as any })}
                        className={`text-left p-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          form.workEnvironment === env
                            ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-xs space-y-1">
                  <span className="font-bold block text-sm">
                    Complimentary First Poster Covered by Teache
                  </span>
                  <p>
                    Based on your workforce environment ({form.workEnvironment}), your initial poster is provided at <strong>$0 cost</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Additional posters: E-Update Service for Physical Worksites ($9.00/mo) · ePosterCenter for Remote ($13.50/mo).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Payroll (Everee) */}
          {currentStepIndex === 7 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Subsection: Payroll & Tax Filing (Everee)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Teache partners with Everee to support payroll processing and tax filing services. Please configure your pay schedule below.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pay Frequency</label>
                    <select
                      value={form.payFrequency}
                      onChange={(e) => setForm({ ...form, payFrequency: e.target.value as any })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 bg-white"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Start Day</label>
                    <select
                      value={form.payPeriodStartDay}
                      onChange={(e) => setForm({ ...form, payPeriodStartDay: e.target.value as any })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 bg-white"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pay Date Choice</label>
                    <select
                      value={form.payDateChoice}
                      onChange={(e) => setForm({ ...form, payDateChoice: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 bg-white"
                    >
                      <option value="Every Other Friday">Every Other Friday</option>
                      <option value="Every Other Monday">Every Other Monday</option>
                      <option value="Last Day of Month">Last Day of Month</option>
                      <option value="1st of Month">1st of Month</option>
                    </select>
                  </div>
                </div>

                {/* Everee Form 8655 Notice */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <span className="font-bold text-slate-900 text-xs block">
                    Everee Payroll Authorization Forms (IRS Form 8655)
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    Required forms: IRS Form 8655 and Everee Payroll Agreement. Forms are automatically routed to Everee operations upon final submission. Processing requires two weeks post-completion before running live payroll.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Form 8655 Generated for {company.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Benefits (Clasp) */}
          {currentStepIndex === 8 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Subsection: Employee Benefits Administration (Clasp)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Teache partners with Clasp to offer medical, dental, vision, and ancillary lines of coverage ($12 PEPM). Clasp serves as broker of record.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 text-xs block">
                    Do you currently offer employee benefits?
                  </span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, currentlyOfferBenefits: true })}
                      className={`px-4 py-2 rounded-lg font-semibold text-xs transition cursor-pointer ${
                        form.currentlyOfferBenefits ? 'bg-purple-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      Yes, We Offer Benefits
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, currentlyOfferBenefits: false })}
                      className={`px-4 py-2 rounded-lg font-semibold text-xs transition cursor-pointer ${
                        !form.currentlyOfferBenefits ? 'bg-purple-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      No, We Do Not Offer Benefits
                    </button>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-purple-900 text-xs space-y-2">
                  <span className="font-bold text-sm block">
                    Connect with Clasp Benefits Specialist
                  </span>
                  <p>
                    We’ll securely route your details to <strong>partnerships@withclasp.com</strong> so their licensed team can contact you the next business day to review carrier plans.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-purple-200 text-[11px] text-slate-700 space-y-1">
                    <div>Business: <strong>{form.companyName}</strong></div>
                    <div>Contact: <strong>{form.contactName} ({form.contactPhone})</strong></div>
                    <div>Eligible Employees: <strong>{form.employeeCount}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Review & Submit */}
          {currentStepIndex === 9 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                  <h4 className="font-bold text-slate-900 text-base">
                    Review and Confirm Organization Setup
                  </h4>
                </div>
                <p className="text-slate-600 text-xs">
                  Summary of your configuration before final submission. You can go back to any step if adjustments are required.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Company:</span>
                    <strong className="text-slate-900">{form.companyName} ({form.businessType})</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Workforce:</span>
                    <strong className="text-slate-900">
                      {form.employeeCount} W-2 Employees · {form.contractorCount} 1099 Contractors
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">States of Operation:</span>
                    <strong className="text-slate-900">{form.statesOfOperation.join(', ')}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Workers' Comp ID:</span>
                    <strong className="text-teal-700">{form.workersCompId || 'None entered'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Payroll Provider:</span>
                    <strong className="text-slate-900">Everee ({form.payFrequency}, {form.payDateChoice})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Benefits Integration:</span>
                    <strong className="text-purple-700">Clasp ($12 PEPM)</strong>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    id="submit-onboarding-final-btn"
                    onClick={handleFinalSubmit}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Setup & Activate Company
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            id="prev-step-btn"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </span>

          {currentStepIndex < steps.length - 1 ? (
            <button
              id="next-step-btn"
              onClick={handleNext}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
};
