import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Eye,
  Check,
  X,
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
  Banknote,
  Receipt
} from 'lucide-react';

export const LoanManagement = () => {
  const { t } = useLanguage();
  const { loans, houses, disburseTranche, approveLoan, rejectLoan } = useDashboardData();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedLoanDetail, setSelectedLoanDetail] = useState(null);
  const [disburseModalLoan, setDisburseModalLoan] = useState(null);
  const [selectedTrancheToDisburse, setSelectedTrancheToDisburse] = useState(null);

  const totalApproved = loans.reduce((acc, l) => acc + (l.approvedAmount || 0), 0);
  const totalDisbursed = loans.reduce((acc, l) => acc + (l.disbursedAmount || 0), 0);
  const totalRemaining = Math.max(0, totalApproved - totalDisbursed);
  const completedLoansCount = loans.filter((l) => l.status === 'Completed').length;

  const tabCounts = {
    ALL: loans.length,
    APPLICATIONS: loans.filter((l) => l.status === 'Pending Application').length,
    APPROVED: loans.filter((l) => l.status === 'Approved').length,
    DISBURSEMENTS: loans.filter((l) => l.status === 'Active').length,
    COMPLETED: loans.filter((l) => l.status === 'Completed').length,
  };

  const filteredLoans = loans.filter((l) => {
    if (activeTab === 'APPLICATIONS' && l.status !== 'Pending Application') return false;
    if (activeTab === 'APPROVED' && l.status !== 'Approved') return false;
    if (activeTab === 'DISBURSEMENTS' && l.status !== 'Active') return false;
    if (activeTab === 'COMPLETED' && l.status !== 'Completed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.id.toLowerCase().includes(q) ||
        l.applicant.toLowerCase().includes(q) ||
        l.cnic.toLowerCase().includes(q) ||
        l.houseId.toLowerCase().includes(q) ||
        l.division.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDisburseConfirm = () => {
    if (disburseModalLoan && selectedTrancheToDisburse) {
      disburseTranche(
        disburseModalLoan.id,
        selectedTrancheToDisburse.trancheNo,
        selectedTrancheToDisburse.amount
      );
      setDisburseModalLoan(null);
      setSelectedTrancheToDisburse(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Housing Loan & Disbursement Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer Bank of Punjab (BOP) subsidized housing financing, installment milestone verifications, and tranche disbursements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-orange-600" />
            <span>Bank of Punjab (BOP) Disbursement Channel Active</span>
          </span>
        </div>
      </div>

      {/* Top Financial Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Approved</span>
            <span className="text-2xl font-black text-slate-900 block">PKR {(totalApproved / 1000000).toFixed(2)}M</span>
            <span className="text-[9.5px] text-slate-400">Total Program Financing</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black shrink-0">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Disbursed</span>
            <span className="text-2xl font-black text-emerald-700 block">PKR {(totalDisbursed / 1000000).toFixed(2)}M</span>
            <span className="text-[9.5px] text-emerald-600 font-bold">{Math.round((totalDisbursed / (totalApproved || 1)) * 100)}% Disbursed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remaining Tranches</span>
            <span className="text-2xl font-black text-amber-700 block">PKR {(totalRemaining / 1000000).toFixed(2)}M</span>
            <span className="text-[9.5px] text-amber-700 font-bold">Pending Milestone Clearances</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-black shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Loans</span>
            <span className="text-2xl font-black text-purple-900 block">{completedLoansCount} Loans</span>
            <span className="text-[9.5px] text-purple-700 font-bold">100% Disbursed</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'ALL', label: 'All Accounts' },
          { id: 'APPLICATIONS', label: 'Loan Applications' },
          { id: 'APPROVED', label: 'Approved Loans' },
          { id: 'DISBURSEMENTS', label: 'Active Disbursements' },
          { id: 'COMPLETED', label: 'Completed Loans' },
        ].map((tab) => {
          const count = tabCounts[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by loan ID, applicant, CNIC, house..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
          />
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-5">Loan ID</th>
                <th className="py-3.5 px-4">Applicant / CNIC</th>
                <th className="py-3.5 px-4">House ID</th>
                <th className="py-3.5 px-4">Approved Amount</th>
                <th className="py-3.5 px-4">Disbursed (PKR)</th>
                <th className="py-3.5 px-4">Remaining (PKR)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                  {/* Loan ID */}
                  <td className="py-4 px-5">
                    <div className="font-mono font-black text-slate-900">{loan.id}</div>
                    <div className="text-[10px] text-slate-400">{loan.appliedDate}</div>
                  </td>

                  {/* Applicant */}
                  <td className="py-4 px-4">
                    <div className="font-black text-slate-900">{loan.applicant}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{loan.cnic}</div>
                  </td>

                  {/* House ID */}
                  <td className="py-4 px-4">
                    <div className="font-mono font-black text-orange-700">{loan.houseId}</div>
                    <div className="text-[10px] text-slate-500">{loan.division}</div>
                  </td>

                  {/* Approved Amount */}
                  <td className="py-4 px-4 font-mono font-extrabold text-slate-900">
                    PKR {(loan.approvedAmount / 1000).toLocaleString()}k
                  </td>

                  {/* Disbursed Amount */}
                  <td className="py-4 px-4">
                    <div className="font-mono font-black text-emerald-700">
                      PKR {(loan.disbursedAmount / 1000).toLocaleString()}k
                    </div>
                    <div className="text-[9.5px] text-slate-400">
                      {Math.round((loan.disbursedAmount / (loan.approvedAmount || 1)) * 100)}% released
                    </div>
                  </td>

                  {/* Remaining */}
                  <td className="py-4 px-4 font-mono font-extrabold text-slate-600">
                    PKR {(loan.remainingAmount / 1000).toLocaleString()}k
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        loan.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : loan.status === 'Active'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : loan.status === 'Approved'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedLoanDetail(loan)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-800 hover:text-orange-700 text-[11px] font-bold rounded-lg shadow-2xs transition cursor-pointer"
                        title="View Details"
                      >
                        Details
                      </button>

                      {loan.status === 'Pending Application' && (
                        <>
                          <button
                            onClick={() => approveLoan(loan.id)}
                            className="p-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
                            title="Approve Loan"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => rejectLoan(loan.id, 'Income/plot criteria unfulfilled')}
                            className="p-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition shadow-2xs cursor-pointer"
                            title="Reject Loan"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}

                      {loan.remainingAmount > 0 && loan.status !== 'Pending Application' && (
                        <button
                          onClick={() => {
                            setDisburseModalLoan(loan);
                            const nextTranche = loan.tranches.find((t) => t.status !== 'Disbursed') || loan.tranches[0];
                            setSelectedTrancheToDisburse(nextTranche);
                          }}
                          className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition cursor-pointer"
                        >
                          Disburse
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: LOAN DETAILS & TRANCHE BREAKDOWN
         ========================================================================= */}
      {selectedLoanDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Loan Account: {selectedLoanDetail.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Applicant: {selectedLoanDetail.applicant} ({selectedLoanDetail.cnic})
                </p>
              </div>
              <button
                onClick={() => setSelectedLoanDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Bank Information Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursing Bank:</span>
                <span className="font-bold text-slate-900">{selectedLoanDetail.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IBAN Account:</span>
                <span className="font-mono font-bold text-slate-900">{selectedLoanDetail.accountNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">House Case ID:</span>
                <span className="font-mono font-bold text-orange-700">{selectedLoanDetail.houseId}</span>
              </div>
            </div>

            {/* Tranches Schedule */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Milestone Installment Tranches (Bank of Punjab)
              </h4>
              <div className="space-y-2">
                {selectedLoanDetail.tranches?.map((tranche) => (
                  <div
                    key={tranche.trancheNo}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-black text-slate-900">
                        Tranche {tranche.trancheNo}: {tranche.stage}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Amount: <strong className="text-slate-800 font-mono">PKR {tranche.amount.toLocaleString()}</strong>
                        {tranche.voucherRef && ` • Ref: ${tranche.voucherRef}`}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        tranche.status === 'Disbursed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tranche.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLoanDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DISBURSE INSTALLMENT TRANCHE
         ========================================================================= */}
      {disburseModalLoan && selectedTrancheToDisburse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Confirm Bank Disbursement
              </h3>
              <button
                onClick={() => setDisburseModalLoan(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-2 text-xs text-orange-950">
              <div className="font-black text-sm">
                Tranche {selectedTrancheToDisburse.trancheNo} — {selectedTrancheToDisburse.stage}
              </div>
              <div>Applicant: <strong>{disburseModalLoan.applicant}</strong> ({disburseModalLoan.cnic})</div>
              <div>Disbursal Amount: <strong className="font-mono text-base text-orange-900">PKR {selectedTrancheToDisburse.amount.toLocaleString()}</strong></div>
              <div>Account: <span className="font-mono">{disburseModalLoan.accountNo}</span></div>
            </div>

            <p className="text-[11px] text-slate-500">
              Authorizing this release generates a real-time Bank of Punjab treasury voucher and credits the beneficiary’s ACAG account.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDisburseModalLoan(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisburseConfirm}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition"
              >
                Authorize & Disburse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
