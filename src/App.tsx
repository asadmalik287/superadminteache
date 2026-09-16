import React, { useState, useEffect } from 'react';
import { 
  Company, 
  Worker, 
  AuditLogEntry, 
  InternalNote, 
  SuperAdminPage, 
  ToastMessage,
  AccountStatus 
} from './types';
import { 
  INITIAL_COMPANIES, 
  INITIAL_WORKERS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_INTERNAL_NOTES 
} from './data/mockData';

// Shared Components
import { ImpersonationBanner } from './components/shared/ImpersonationBanner';
import { SessionTimeoutModal } from './components/shared/SessionTimeoutModal';
import { ToastContainer } from './components/shared/ToastContainer';
import { GlobalSearchModal } from './components/shared/GlobalSearchModal';

// Super Admin Layout & Modals
import { SuperAdminSidebar } from './components/superadmin/SuperAdminSidebar';
import { SuperAdminHeader } from './components/superadmin/SuperAdminHeader';
import { InternalNotesDrawer } from './components/superadmin/InternalNotesDrawer';
import { NewCompanyNotificationModal } from './components/superadmin/NewCompanyNotificationModal';

// Super Admin Dedicated Pages
import { CompaniesPage } from './pages/superadmin/CompaniesPage';
import { CompanyDetailPage } from './pages/superadmin/CompanyDetailPage';
import { OnboardingPipelinePage } from './pages/superadmin/OnboardingPipelinePage';
import { BillingRevenuePage } from './pages/superadmin/BillingRevenuePage';
import { AuditLogsPage } from './pages/superadmin/AuditLogsPage';
import { SystemSettingsPage } from './pages/superadmin/SystemSettingsPage';

// Client & Worker Views
import { CompanyAdminView } from './components/client/CompanyAdminView';
import { ClientOnboardingModal } from './components/client/ClientOnboardingModal';
import { WorkerView } from './components/client/WorkerView';

export default function App() {
  // Global Database State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>(INITIAL_INTERNAL_NOTES);

  // Multi-Page Routing State
  const [superAdminPage, setSuperAdminPage] = useState<SuperAdminPage>('companies');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Impersonation Context
  const [impersonatingCompany, setImpersonatingCompany] = useState<Company | null>(null);
  const [impersonatingWorker, setImpersonatingWorker] = useState<Worker | null>(null);

  // Admin User Identity
  const [currentSuperAdminUser, setCurrentSuperAdminUser] = useState({
    name: 'Christian (Founder)',
    email: 'admin@teachepro.com',
    roleTitle: 'Platform Owner' as const,
  });

  // UI Modals & Drawers
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [selectedCompanyForNotes, setSelectedCompanyForNotes] = useState<Company | null>(null);
  const [selectedCompanyForOnboarding, setSelectedCompanyForOnboarding] = useState<Company | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Feedback Toast Queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hash-based URL synchronizer for Back/Forward navigation
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('company/')) {
        const id = hash.replace('company/', '');
        setSelectedCompanyId(id);
        setSuperAdminPage('company-detail');
      } else if (['companies', 'onboarding-crm', 'billing-revenue', 'audit-logs', 'system-settings'].includes(hash)) {
        setSuperAdminPage(hash as SuperAdminPage);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const navigateToPage = (page: SuperAdminPage, companyId?: string) => {
    setSuperAdminPage(page);
    if (companyId) {
      setSelectedCompanyId(companyId);
      window.location.hash = `company/${companyId}`;
    } else {
      setSelectedCompanyId(null);
      window.location.hash = page;
    }
  };

  // Audit Logger
  const addAuditLog = (
    action: string,
    category: AuditLogEntry['category'],
    details: string,
    companyContext?: Company | null
  ) => {
    const newEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      companyId: companyContext?.id,
      companyName: companyContext?.name,
      userId: impersonatingCompany ? 'USR-IMPERSONATED' : 'USR-SUPER-01',
      userEmail: currentSuperAdminUser.email,
      userRole: impersonatingCompany ? 'company_admin' : 'super_admin',
      action,
      category,
      details,
      timestamp: new Date().toLocaleString() + ' EST',
      ipAddress: '74.125.210.14 (Columbus, OH)',
      status: 'success',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Impersonation controls
  const handleImpersonateCompany = (company: Company) => {
    setImpersonatingCompany(company);
    setImpersonatingWorker(null);
    addToast('Impersonation Session Started', `Now acting as Administrator for ${company.name}`, 'info');
    addAuditLog(
      'Impersonation Started',
      'impersonation',
      `Super Admin ${currentSuperAdminUser.name} initiated live impersonation of ${company.name} (${company.id})`,
      company
    );
  };

  const handleExitCompanyImpersonation = () => {
    const comp = impersonatingCompany;
    setImpersonatingCompany(null);
    setImpersonatingWorker(null);
    addToast('Returned to Super Admin', `Exited impersonation of ${comp?.name || 'company'}`, 'info');
    addAuditLog(
      'Impersonation Ended',
      'impersonation',
      `Super Admin returned to Super Admin Panel from ${comp?.name} (${comp?.id})`,
      comp
    );
  };

  const handleImpersonateWorker = (worker: Worker) => {
    setImpersonatingWorker(worker);
    addToast('Worker View Mode', `Viewing as ${worker.firstName} ${worker.lastName} (${worker.jobTitle})`, 'info');
    addAuditLog(
      'Impersonated Worker View',
      'impersonation',
      `Administrator view switched to Worker: ${worker.firstName} ${worker.lastName} (${worker.workerType})`,
      impersonatingCompany
    );
  };

  const handleExitWorkerImpersonation = () => {
    setImpersonatingWorker(null);
    addToast('Exited Worker View', 'Returned to Company Administrator Portal', 'info');
  };

  // Onboarding controls
  const handleResumeOnboarding = (company: Company) => {
    setSelectedCompanyForOnboarding(company);
    addAuditLog(
      'Onboarding Wizard Opened',
      'onboarding',
      `Resuming setup on client's behalf at step: ${company.onboardingCurrentStep}`,
      company
    );
  };

  const handleSaveOnboardingProgress = (updatedCompany: Company, isComplete = false) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
    );

    if (impersonatingCompany?.id === updatedCompany.id) {
      setImpersonatingCompany(updatedCompany);
    }

    addToast(
      isComplete ? 'Company Setup Activated!' : 'Onboarding Progress Saved',
      `${updatedCompany.name} is now ${isComplete ? 'fully active and live' : 'saved to profile'}`,
      'success'
    );

    addAuditLog(
      isComplete ? 'Onboarding Completed & Activated' : 'Onboarding Auto-Saved',
      'onboarding',
      isComplete
        ? `Organization setup completed and activated for ${updatedCompany.name}`
        : `Progress auto-saved at step: ${updatedCompany.onboardingCurrentStep}`,
      updatedCompany
    );
  };

  // Internal Notes
  const handleAddInternalNote = (newNoteData: Omit<InternalNote, 'id' | 'createdAt'>) => {
    const note: InternalNote = {
      ...newNoteData,
      id: `NOTE-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleString() + ' EST',
    };
    setInternalNotes((prev) => [note, ...prev]);
    const targetComp = companies.find((c) => c.id === newNoteData.companyId);
    addToast('Internal Note Recorded', `Saved under category ${newNoteData.category}`, 'success');
    addAuditLog(
      'Added Internal Note',
      'system',
      `Internal note recorded by ${newNoteData.authorName} under category "${newNoteData.category}"`,
      targetComp
    );
  };

  // Company Status toggle
  const handleToggleStatus = (companyId: string, newStatus: AccountStatus) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, status: newStatus } : c))
    );
    const comp = companies.find((c) => c.id === companyId);
    addToast(
      newStatus === 'suspended' ? 'Account Suspended' : 'Account Reactivated',
      `${comp?.name} is now ${newStatus.toUpperCase()}`,
      newStatus === 'suspended' ? 'warning' : 'success'
    );
    addAuditLog(
      newStatus === 'suspended' ? 'Account Suspended' : 'Account Reactivated',
      'security',
      `Account ${comp?.name} (${companyId}) status changed to ${newStatus.toUpperCase()}`,
      comp
    );
  };

  // 90-Worker Uncap Alert
  const handleSend90WorkerNotification = (company: Company) => {
    addToast('Compliance Notice Dispatched', `Uncap rate notification sent to ${company.contactEmail}`, 'warning');
    addAuditLog(
      'Dispatched 90-Worker Uncap Alert',
      'billing',
      `Sent uncapped benefits tier alert email to ${company.contactEmail} (${company.totalWorkers} workers)`,
      company
    );
  };

  // New Company Registration
  const handleRegisterCompany = (newCompany: Company) => {
    setCompanies((prev) => [newCompany, ...prev]);
    addToast('Company Registered', `${newCompany.name} provisioned with ID ${newCompany.id}`, 'success');
    addAuditLog(
      'Company Registered',
      'onboarding',
      `New company created: ${newCompany.name} (${newCompany.id}) · Automated email sent to admin@teachepro.com`,
      newCompany
    );
  };

  // Add Worker to company
  const handleAddWorker = (newWorker: Worker) => {
    setWorkers((prev) => [newWorker, ...prev]);
    // update company worker counts
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === newWorker.companyId) {
          const isContractor = newWorker.workerType.startsWith('1099');
          const newEmp = c.employeeCount + (isContractor ? 0 : 1);
          const newCont = c.contractorCount + (isContractor ? 1 : 0);
          const newTotal = newEmp + newCont;
          return {
            ...c,
            employeeCount: newEmp,
            contractorCount: newCont,
            totalWorkers: newTotal,
            estimatedNextInvoice: newTotal <= 5 ? 30 : 30 + (newTotal - 5) * 3,
            approachingUncap90Workers: newTotal >= 90,
          };
        }
        return c;
      })
    );
    addAuditLog(
      'Worker Provisioned',
      'payroll',
      `Added worker ${newWorker.firstName} ${newWorker.lastName} (${newWorker.workerType}) to company ${newWorker.companyId}`,
      companies.find((c) => c.id === newWorker.companyId)
    );
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    if (confirm('Reset demo environment to original pre-configured baseline?')) {
      setCompanies(INITIAL_COMPANIES);
      setWorkers(INITIAL_WORKERS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setInternalNotes(INITIAL_INTERNAL_NOTES);
      setImpersonatingCompany(null);
      setImpersonatingWorker(null);
      navigateToPage('companies');
      addToast('Demo Environment Restored', 'Reset to initial sample companies, workers, and logs.', 'info');
      addAuditLog(
        'Demo Environment Reset',
        'system',
        'Demo state restored to original 5-worker logistics baseline.'
      );
    }
  };

  const selectedCompanyForDetail = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-teal-500 selection:text-white font-sans">
      {/* Toast Notification Queue */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Global Command Palette / Search Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        companies={companies}
        workers={workers}
        onSelectCompany={(c) => navigateToPage('company-detail', c.id)}
        onSelectPage={(p) => navigateToPage(p)}
      />

      {/* Persistent Impersonation Status Banner */}
      <ImpersonationBanner
        impersonatingCompany={impersonatingCompany}
        impersonatingWorker={impersonatingWorker}
        onExitCompanyImpersonation={handleExitCompanyImpersonation}
        onExitWorkerImpersonation={handleExitWorkerImpersonation}
      />

      {/* Primary View Router */}
      {impersonatingWorker && impersonatingCompany ? (
        // 1. WORKER PORTAL VIEW (Punches, GPS, Paystubs)
        <WorkerView
          worker={impersonatingWorker}
          company={impersonatingCompany}
          onExitWorker={handleExitWorkerImpersonation}
        />
      ) : impersonatingCompany ? (
        // 2. CLIENT / COMPANY ADMIN VIEW (Multi-tabbed HRIS portal)
        <CompanyAdminView
          company={impersonatingCompany}
          workers={workers}
          onOpenOnboarding={() => setSelectedCompanyForOnboarding(impersonatingCompany)}
          onImpersonateWorker={handleImpersonateWorker}
          isSuperAdminImpersonating={true}
          onAddWorker={handleAddWorker}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      ) : (
        // 3. SUPER ADMIN MULTI-PAGE PLATFORM (Persistent Sidebar + Dynamic Pages)
        <div className="flex min-h-screen">
          {/* Persistent Sidebar */}
          <SuperAdminSidebar
            currentPage={superAdminPage}
            onNavigate={(p) => navigateToPage(p)}
            companies={companies}
            onOpenNewCompany={() => setShowNewCompanyModal(true)}
            onResetDemo={handleResetDemoData}
            currentUser={currentSuperAdminUser}
            onSwitchUser={(name, roleTitle) => {
              setCurrentSuperAdminUser({
                name,
                email: name.includes('Christian') ? 'admin@teachepro.com' : 'maya.ops@teachepro.com',
                roleTitle: roleTitle as any,
              });
              addToast('Switched Administrator Persona', `Active user: ${name} (${roleTitle})`, 'info');
            }}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Layout Area */}
          <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
            {/* Top Navigation Header */}
            <SuperAdminHeader
              currentPage={superAdminPage}
              selectedCompany={selectedCompanyForDetail}
              onOpenSearch={() => setShowSearchModal(true)}
              onSimulateInactivity={() => setShowTimeoutModal(true)}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              onNavigate={(p) => navigateToPage(p)}
            />

            {/* Dynamic Multi-Page Router Outlet */}
            <main className="flex-1">
              {superAdminPage === 'companies' && (
                <CompaniesPage
                  companies={companies}
                  onSelectCompanyDetail={(c) => navigateToPage('company-detail', c.id)}
                  onImpersonateCompany={handleImpersonateCompany}
                  onResumeOnboarding={handleResumeOnboarding}
                  onOpenNotes={(c) => setSelectedCompanyForNotes(c)}
                  onToggleStatus={handleToggleStatus}
                />
              )}

              {superAdminPage === 'company-detail' && (
                <CompanyDetailPage
                  company={selectedCompanyForDetail}
                  workers={workers}
                  notes={internalNotes}
                  auditLogs={auditLogs}
                  onBack={() => navigateToPage('companies')}
                  onImpersonate={handleImpersonateCompany}
                  onImpersonateWorker={(w) => {
                    setImpersonatingCompany(selectedCompanyForDetail);
                    handleImpersonateWorker(w);
                  }}
                  onToggleStatus={handleToggleStatus}
                  onSend90WorkerNotification={handleSend90WorkerNotification}
                  onAddNote={handleAddInternalNote}
                  currentUser={currentSuperAdminUser}
                />
              )}

              {superAdminPage === 'onboarding-crm' && (
                <OnboardingPipelinePage
                  companies={companies}
                  onResumeOnBehalf={(c) => {
                    setImpersonatingCompany(c);
                    setSelectedCompanyForOnboarding(c);
                  }}
                />
              )}

              {superAdminPage === 'billing-revenue' && (
                <BillingRevenuePage
                  companies={companies}
                  onSend90WorkerAlert={handleSend90WorkerNotification}
                />
              )}

              {superAdminPage === 'audit-logs' && (
                <AuditLogsPage logs={auditLogs} />
              )}

              {superAdminPage === 'system-settings' && (
                <SystemSettingsPage
                  currentUser={currentSuperAdminUser}
                  onSwitchUser={(name, roleTitle) => {
                    setCurrentSuperAdminUser({
                      name,
                      email: name.includes('Christian') ? 'admin@teachepro.com' : 'maya.ops@teachepro.com',
                      roleTitle: roleTitle as any,
                    });
                    addToast('Switched Persona', `Now operating as ${name}`, 'info');
                  }}
                  onSimulateInactivity={() => setShowTimeoutModal(true)}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* 15-Minute Session Inactivity Modal */}
      <SessionTimeoutModal
        isOpen={showTimeoutModal}
        onStaySignedIn={() => setShowTimeoutModal(false)}
        onLogout={() => {
          setShowTimeoutModal(false);
          setImpersonatingCompany(null);
          setImpersonatingWorker(null);
          addToast('Session Ended', 'Logged out due to security inactivity policy.', 'warning');
        }}
        warningDurationSeconds={30}
      />

      {/* Internal Team Notes Drawer */}
      <InternalNotesDrawer
        isOpen={!!selectedCompanyForNotes}
        onClose={() => setSelectedCompanyForNotes(null)}
        company={selectedCompanyForNotes}
        notes={internalNotes}
        onAddNote={handleAddInternalNote}
        currentUser={currentSuperAdminUser}
      />

      {/* New Company Registration Modal */}
      <NewCompanyNotificationModal
        isOpen={showNewCompanyModal}
        onClose={() => setShowNewCompanyModal(false)}
        onRegisterCompany={handleRegisterCompany}
      />

      {/* Client Onboarding Setup Wizard */}
      {selectedCompanyForOnboarding && (
        <ClientOnboardingModal
          isOpen={!!selectedCompanyForOnboarding}
          onClose={() => setSelectedCompanyForOnboarding(null)}
          company={selectedCompanyForOnboarding}
          onSaveProgress={handleSaveOnboardingProgress}
          isSuperAdminImpersonating={true}
        />
      )}
    </div>
  );
}
