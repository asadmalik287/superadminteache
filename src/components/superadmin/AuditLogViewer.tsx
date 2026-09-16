import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Search, 
  Download, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Building2 
} from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogViewerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.companyId && log.companyId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.companyName && log.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User Email', 'Role', 'Company ID', 'Company Name', 'Action', 'Category', 'Status', 'IP Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userEmail}"`,
      l.userRole,
      l.companyId || '',
      `"${l.companyName || ''}"`,
      `"${l.action}"`,
      l.category,
      l.status,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `teache_audit_trail_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      id="audit-log-viewer-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Immutable System Audit Trail
              </span>
              <span className="text-xs text-slate-500">
                SOC 2 & Compliance Ready (Encrypted Storage)
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Security & Activity Audit Logs ({logs.length})
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Tracks all Super Admin impersonations, sensitive administrative actions, payroll authorizations, and system changes.
            </p>
          </div>
          <button
            id="close-audit-logs-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-audit-logs-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by action, email, company ID, details, or IP..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="category-filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="impersonation">Impersonations</option>
              <option value="security">Security & Auth</option>
              <option value="payroll">Payroll Actions</option>
              <option value="billing">Billing & Stripe</option>
              <option value="onboarding">Onboarding</option>
              <option value="system">System & Notes</option>
            </select>

            <button
              id="export-audit-csv-btn"
              onClick={exportCSV}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User / Actor</th>
                <th className="py-3 px-4">Action & Category</th>
                <th className="py-3 px-4">Company Context</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP / Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No audit records matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        {log.userEmail}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {log.userRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.action}</div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.companyId ? (
                        <div>
                          <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                            {log.companyId}
                          </span>
                          <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                            {log.companyName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Global Platform</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">
                      <p className="line-clamp-2" title={log.details}>
                        {log.details}
                      </p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                      {log.ipAddress}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Success
                        </span>
                      ) : log.status === 'warning' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-red-200">
                          Denied
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            🔒 All security and impersonation sessions are recorded with IP, timestamp, and actor identity.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
