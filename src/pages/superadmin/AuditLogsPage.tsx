import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Download, 
  Filter, 
  UserCheck, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Layers
} from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogsPageProps {
  logs: AuditLogEntry[];
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AuditLogEntry['category']>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.companyName && log.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.ipAddress.includes(searchTerm);

    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const impersonationCount = logs.filter((l) => l.category === 'impersonation').length;
  const securityCount = logs.filter((l) => l.category === 'security').length;

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Action', 'Category', 'User Email', 'Role', 'Company', 'IP Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.action}"`,
      l.category,
      l.userEmail,
      l.userRole,
      `"${l.companyName || 'N/A'}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teache_AuditLogs_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="audit-logs-forensics-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600" />
            Security Audit Trails & Forensics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system logs tracking every administrative impersonation, payroll execution, permission change, and login event.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-2 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export Audit CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Audited Events
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {logs.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Persisted tamper-proof record log
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Impersonation Audits
          </span>
          <div className="text-3xl font-extrabold text-purple-700">
            {impersonationCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Interactive sessions launched by Super Admins
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Security & Account Controls
          </span>
          <div className="text-3xl font-extrabold text-emerald-700">
            {securityCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Suspension toggles & password resets
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail by action, details, user email, or IP..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'impersonation', label: 'Impersonation' },
              { id: 'security', label: 'Security' },
              { id: 'payroll', label: 'Payroll' },
              { id: 'onboarding', label: 'Onboarding' },
              { id: 'billing', label: 'Billing' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Event & Category</th>
                <th className="py-3 px-4">Actor Email / Role</th>
                <th className="py-3 px-4">Target Organization</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => {
                let badgeStyle = 'bg-slate-100 text-slate-700';
                if (log.category === 'impersonation') badgeStyle = 'bg-purple-100 text-purple-800';
                if (log.category === 'security') badgeStyle = 'bg-red-100 text-red-800';
                if (log.category === 'payroll') badgeStyle = 'bg-emerald-100 text-emerald-800';
                if (log.category === 'onboarding') badgeStyle = 'bg-blue-100 text-blue-800';
                if (log.category === 'billing') badgeStyle = 'bg-amber-100 text-amber-800';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-sans">
                      <span className="font-bold text-slate-900 block">{log.action}</span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded inline-block mt-0.5 ${badgeStyle}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="font-semibold text-slate-800 block text-[11px]">{log.userEmail}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.userRole}</span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700">
                      {log.companyName ? (
                        <div>
                          <span className="font-bold block">{log.companyName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.companyId}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Global System</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {log.ipAddress}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 text-[11px] max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {log.timestamp}
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
