export type UserRole = 'super_admin' | 'company_admin' | 'manager' | 'employee' | 'contractor';

export type AccountStatus = 'active' | 'suspended' | 'pending_review' | 'cancelled';

export type OnboardingStep = 
  | 'acknowledgment' 
  | 'company_info' 
  | 'worker_count' 
  | 'workers_comp' 
  | 'bulk_upload' 
  | 'industry_select' 
  | 'posters' 
  | 'payroll_everee' 
  | 'benefits_clasp' 
  | 'review_confirm';

export interface CompanyAddons {
  laborLawPosters: 'none' | 'physical' | 'digital' | 'both';
  posterStatus?: 'complimentary_active' | 'billed' | 'pending_dispatch';
  benefitsClasp: boolean;
  benefitsStatus?: 'not_offered' | 'consultation_requested' | 'active_embedded' | 'transition_pending';
  hrConsultation: 'none' | 'tier_10_hours' | 'tier_40_hours';
  equipmentLeaseCount: number; // $40/mo per device
  backgroundChecksEnabled: boolean; // $50/request Checkr
}

export interface Company {
  id: string; // e.g. COMP-1049
  name: string;
  legalEntityName: string;
  ein: string;
  businessType: string;
  industry: string;
  statesOfOperation: string[];
  headquartersAddress: string;
  workLocationsCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: AccountStatus;
  signupDate: string;
  lastActivity: string;
  
  // Worker stats
  employeeCount: number;
  contractorCount: number;
  totalWorkers: number;
  
  // Billing & Capping
  baseMonthlyFee: number; // $30 for 1-5, +$3 each 6th+
  estimatedNextInvoice: number;
  isCapped: boolean; // hit $400 cap or threshold
  approachingUncap90Workers: boolean;
  
  // Onboarding
  onboardingStatus: 'completed' | 'in_progress' | 'not_started';
  onboardingCurrentStep: OnboardingStep;
  onboardingSavedData?: Partial<OnboardingFormData>;
  onboardingLastSavedAt?: string;

  // Add-ons & Partners
  addons: CompanyAddons;
  workersCompId?: string;
  workersCompExpiry?: string;
  workersCompCarrier?: string;
}

export interface OnboardingFormData {
  companyName: string;
  legalEntityName: string;
  ein: string;
  businessType: string;
  statesOfOperation: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  fullAddress: string;
  employeeCount: number;
  contractorCount: number;
  workersCompId: string;
  workersCompExpiry: string;
  industry: string;
  otherIndustryText?: string;
  
  // Posters
  hasPosterSolution: boolean;
  posterType: 'DIGITAL' | 'PHYSICAL' | 'BOTH' | 'NONE';
  workEnvironment: '100% Remote' | 'Hybrid' | 'On-site (one location)' | 'On-site (multi-location, same state)' | 'On-site (multi-state)';
  purchaseAdditionalPosters: boolean;
  
  // Payroll Everee
  payFrequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  payPeriodStartDay: 'Monday' | 'Sunday';
  payDateChoice: string;
  switchingMidYear: boolean;
  directDeposit: boolean;
  ptoTracking: boolean;
  ptoAccrualMethod?: 'hours_worked' | 'lump_sum';
  ptoYearEndPolicy?: 'rollover' | 'use_it_or_lose_it';
  maxRolloverHours?: number;
  
  // Benefits Clasp
  currentlyOfferBenefits: boolean;
  benefitsManagedByClasp: boolean;
  wantsToOfferBenefits: boolean;
  benefitsSpecialistContacted: boolean;
}

export interface InternalNote {
  id: string;
  companyId: string;
  authorName: string;
  authorRole: 'Platform Owner' | 'Operations Specialist' | 'HR Consultant' | 'Support Rep';
  category: 'Onboarding Help' | 'Payroll Setup' | 'Poster Dispatch' | 'HR Consulting' | 'Billing & Cap' | 'General';
  content: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  companyId?: string;
  companyName?: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  category: 'impersonation' | 'security' | 'payroll' | 'billing' | 'onboarding' | 'system';
  details: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'denied';
}

export interface Worker {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  workerType: 'W2_HOURLY' | 'W2_SALARY' | 'W2_PER_DIEM' | '1099_HOURLY' | '1099_PROJECT';
  role: 'admin' | 'manager' | 'employee' | 'contractor';
  payRate: number; // hourly rate or annual salary
  status: 'active' | 'inactive' | 'on_leave';
  directDepositStatus: 'verified' | 'pending' | 'needs_update';
  bankName: string;
  maskedAccount: string;
  hireDate: string;
  avatarUrl?: string;
  assignedManagerId?: string;
}

export type SuperAdminPage = 
  | 'companies' 
  | 'company-detail' 
  | 'onboarding-crm' 
  | 'billing-revenue' 
  | 'audit-logs' 
  | 'system-settings';

export type ClientPage = 
  | 'overview' 
  | 'workforce' 
  | 'payroll' 
  | 'timekeeping' 
  | 'benefits' 
  | 'settings';

export type WorkerPage = 
  | 'clock' 
  | 'paystubs' 
  | 'schedule';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}
