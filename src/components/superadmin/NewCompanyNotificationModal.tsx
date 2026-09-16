import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Building2, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { Company } from '../../types';

interface NewCompanyNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterCompany: (newComp: Company) => void;
}

export const NewCompanyNotificationModal: React.FC<NewCompanyNotificationModalProps> = ({
  isOpen,
  onClose,
  onRegisterCompany,
}) => {
  const [formData, setFormData] = useState({
    name: 'Horizon Health Network',
    legalEntityName: 'Horizon Health Services LLC',
    contactName: 'Gregory Taylor',
    contactEmail: 'gtaylor@horizonhealth.io',
    contactPhone: '(614) 555-7730',
    industry: 'Healthcare',
    state: 'Ohio',
    employeeCount: 35,
    contractorCount: 10,
    ein: '39-8172901',
    address: '420 Metro Place North, Dublin, OH 43017',
    planAddons: 'Base ($30) + PosterElite ($9/mo) + Clasp Benefits + 2 Tablet Leases'
  });

  const [notificationPreview, setNotificationPreview] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const companyId = `COMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalWorkers = Number(formData.employeeCount) + Number(formData.contractorCount);
    
    const newCompany: Company = {
      id: companyId,
      name: formData.name,
      legalEntityName: formData.legalEntityName,
      ein: formData.ein,
      businessType: 'LLC (Limited Liability Company)',
      industry: formData.industry,
      statesOfOperation: [formData.state],
      headquartersAddress: formData.address,
      workLocationsCount: 1,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      status: 'active',
      signupDate: new Date().toISOString().slice(0, 10),
      lastActivity: 'Just now',
      employeeCount: Number(formData.employeeCount),
      contractorCount: Number(formData.contractorCount),
      totalWorkers: totalWorkers,
      baseMonthlyFee: 30,
      estimatedNextInvoice: totalWorkers <= 5 ? 30 : 30 + (totalWorkers - 5) * 3,
      isCapped: totalWorkers >= 90,
      approachingUncap90Workers: totalWorkers >= 85,
      onboardingStatus: 'in_progress',
      onboardingCurrentStep: 'company_info',
      onboardingLastSavedAt: 'Just now',
      addons: {
        laborLawPosters: 'both',
        posterStatus: 'pending_dispatch',
        benefitsClasp: true,
        benefitsStatus: 'consultation_requested',
        hrConsultation: 'none',
        equipmentLeaseCount: 2,
        backgroundChecksEnabled: true,
      }
    };

    onRegisterCompany(newCompany);
    setNotificationPreview(true);
  };

  return (
    <div 
      id="new-company-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {notificationPreview ? 'Automated Admin Email Triggered' : 'Register New Company Account'}
              </h3>
              <p className="text-xs text-slate-500">
                {notificationPreview 
                  ? 'System-generated notification sent to Christian (admin@teachepro.com)'
                  : 'Provisions company and sends automated internal tracker email to Super Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notificationPreview ? (
          <div className="p-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">
                  Company Successfully Registered & Ingested
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  The automated internal tracking notification has been dispatched to <strong>admin@teachepro.com</strong>.
                </p>
              </div>
            </div>

            {/* Email Preview Box */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-xs flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  To: admin@teachepro.com (Christian - Platform Owner)
                </span>
                <span className="text-slate-400 font-mono">automated-system@teache.com</span>
              </div>
              <div className="p-5 bg-white text-xs font-sans text-slate-800 space-y-3">
                <p className="font-bold text-slate-900 text-sm">
                  🚀 New Company Registration Alert: {formData.name}
                </p>
                <p className="text-slate-600">
                  Hello Christian, a new company account has just completed initial registration on the Teache HR platform:
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Company Name:</span>
                    <strong className="text-slate-900">{formData.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Primary Admin Contact:</span>
                    <strong className="text-slate-900">{formData.contactName} ({formData.contactEmail})</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Contact Phone:</span>
                    <strong className="text-slate-900">{formData.contactPhone}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Total Workers:</span>
                    <strong className="text-slate-900">{Number(formData.employeeCount) + Number(formData.contractorCount)} ({formData.employeeCount} W-2 Employees / {formData.contractorCount} 1099 Contractors)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Industry Type:</span>
                    <strong className="text-slate-900">{formData.industry}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Plan Type & Add-Ons:</span>
                    <strong className="text-teal-700">{formData.planAddons}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Signup Date:</span>
                    <strong className="text-slate-900">{new Date().toLocaleDateString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Onboarding Status:</span>
                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      In-Progress (Step 1: Company Info)
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 text-[11px] pt-1 italic">
                  You can monitor or resume their onboarding from your Super Admin portal at any time.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition shadow cursor-pointer"
              >
                Return to Super Admin Directory
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company Display Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Legal Entity Name</label>
                <input
                  type="text"
                  required
                  value={formData.legalEntityName}
                  onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Admin Name</label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Admin Email</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Industry Classification</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800 bg-white"
                >
                  <option value="Healthcare">Healthcare</option>
                  <option value="Trucking & Transportation">Trucking & Transportation</option>
                  <option value="Construction">Construction</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Automotive Services">Automotive Services</option>
                  <option value="Security Services">Security Services</option>
                  <option value="Technology">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Estimated W-2 Employees</label>
                <input
                  type="number"
                  min="0"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 0 })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Estimated 1099 Contractors</label>
                <input
                  type="number"
                  min="0"
                  value={formData.contractorCount}
                  onChange={(e) => setFormData({ ...formData, contractorCount: parseInt(e.target.value) || 0 })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-700 block mb-1">Selected Plan & Partner Add-Ons</label>
              <input
                type="text"
                value={formData.planAddons}
                onChange={(e) => setFormData({ ...formData, planAddons: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Automatically dispatches alert email to <strong>admin@teachepro.com</strong>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-register-company-btn"
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Create Account & Trigger Alert
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
