import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  Download, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Truck,
  DollarSign,
  Coffee
} from 'lucide-react';
import { Worker, Company } from '../../types';

interface WorkerViewProps {
  worker: Worker;
  company: Company;
  onExitWorker: () => void;
}

export const WorkerView: React.FC<WorkerViewProps> = ({
  worker,
  company,
  onExitWorker,
}) => {
  const [clockStatus, setClockStatus] = useState<'NOT_CLOCKED_IN' | 'CLOCKED_IN' | 'ON_BREAK'>('CLOCKED_IN');
  const [clockActionNotice, setClockActionNotice] = useState<string | null>(null);
  const [gpsAcknowledged, setGpsAcknowledged] = useState<boolean>(true);

  const isTransportation = company.industry.toLowerCase().includes('trucking') || company.industry.toLowerCase().includes('transportation') || company.industry.toLowerCase().includes('logistics');

  const triggerPunch = (action: string, newStatus: 'NOT_CLOCKED_IN' | 'CLOCKED_IN' | 'ON_BREAK') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClockStatus(newStatus);
    setClockActionNotice(`${action} Successful: ${timeStr}`);
    setTimeout(() => setClockActionNotice(null), 4000);
  };

  const handleDownloadPaystub = () => {
    // Generate simple PDF download stub
    const content = `TEACHE HR / EVEREE PAY STATEMENT\nWorker: ${worker.firstName} ${worker.lastName}\nEID: ${worker.id}\nCompany: ${company.name}\nNet Pay: $1,420.50\nPayment Method: Direct Deposit (${worker.bankName} ${worker.maskedAccount})\nStatus: Verified\n`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Paystub_${worker.lastName}_04152026.pdf`;
    link.click();
  };

  return (
    <div id="worker-portal-view" className="min-h-screen bg-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Worker Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {worker.avatarUrl ? (
              <img src={worker.avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-200" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 font-bold text-xl flex items-center justify-center">
                {worker.firstName[0]}{worker.lastName[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {worker.firstName} {worker.lastName}
                </h2>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {worker.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {worker.jobTitle} · {company.name} ({worker.workerType})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitWorker}
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow cursor-pointer"
            >
              Exit Worker View
            </button>
          </div>
        </div>

        {/* Action Confirmation Banner */}
        {clockActionNotice && (
          <div className="bg-emerald-600 text-white p-3 rounded-xl text-center font-bold text-xs shadow-md animate-in fade-in duration-150 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {clockActionNotice}
          </div>
        )}

        {/* Transportation GPS Notice */}
        {isTransportation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                Transportation Fleet Location Verification Policy:
              </span>
              <p className="text-blue-800 text-[11px] mt-0.5">
                Location verification is captured only during active clock actions (Clock In, Break, Clock Out) for state compliance.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-teal-800 bg-white px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  Verified Area: Columbus Logistics Hub (Roberts Rd)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Time Clock Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Timekeeping Clock (No Rounding · Exact Precision)
          </div>

          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {clockStatus === 'CLOCKED_IN' ? 'Status: CLOCKED IN' : clockStatus === 'ON_BREAK' ? 'Status: ON BREAK' : 'Status: NOT CLOCKED IN'}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {clockStatus === 'NOT_CLOCKED_IN' && (
              <button
                id="worker-clock-in-btn"
                onClick={() => triggerPunch('Clock In', 'CLOCKED_IN')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow cursor-pointer"
              >
                Clock In (08:02 AM)
              </button>
            )}

            {clockStatus === 'CLOCKED_IN' && (
              <>
                <button
                  id="worker-start-break-btn"
                  onClick={() => triggerPunch('Break Started', 'ON_BREAK')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-5 rounded-xl text-xs transition shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Coffee className="w-4 h-4" />
                  Start Break
                </button>
                <button
                  id="worker-clock-out-btn"
                  onClick={() => triggerPunch('Clock Out', 'NOT_CLOCKED_IN')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow cursor-pointer"
                >
                  Clock Out
                </button>
              </>
            )}

            {clockStatus === 'ON_BREAK' && (
              <button
                id="worker-end-break-btn"
                onClick={() => triggerPunch('Break Ended', 'CLOCKED_IN')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow cursor-pointer"
              >
                End Break & Resume Work
              </button>
            )}
          </div>
        </div>

        {/* Worker Pay & Stubs Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-600" />
                Pay Statements & Direct Deposit
              </h3>
              <p className="text-xs text-slate-500">
                Everee payroll statements are issued as PDF downloads only.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Payment Method: {worker.directDepositStatus.toUpperCase()}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-teal-600" />
              <div>
                <span className="font-bold text-slate-800 block">{worker.bankName}</span>
                <span className="text-slate-500 font-mono">Account Ending in {worker.maskedAccount}</span>
              </div>
            </div>

            <button
              id="download-worker-paystub-btn"
              onClick={handleDownloadPaystub}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              Download Latest Paystub (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
