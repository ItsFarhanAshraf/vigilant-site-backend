import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  Printer,
  Building2,
  CreditCard,
  Users,
  ShieldAlert,
  HardHat,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const ReportsAnalytics = () => {
  const { t } = useLanguage();
  const { houses, loans, workers, safetyIssues, engineers, visits } = useDashboardData();

  const [reportDomain, setReportDomain] = useState('CONSTRUCTION'); // CONSTRUCTION | LOANS | LABOUR | SAFETY | ENGINEERS
  const [dateRange, setDateRange] = useState('YTD'); // 7DAYS | 30DAYS | YTD | ALL
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [isDprModalOpen, setIsDprModalOpen] = useState(false);

  const districtsList = Array.from(new Set(houses.map((h) => h.district)));

  // Dynamic Export CSV (Excel format)
  const handleExportExcel = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportDomain === 'CONSTRUCTION') {
      csvContent += 'House ID,Owner Name,District,Stage,Progress %,Status,Loan Disbursed\n';
      houses.forEach((h) => {
        csvContent += `"${h.id}","${h.ownerName}","${h.district}","${h.stage}",${h.progressPct},"${h.status}",${h.loanDisbursed}\n`;
      });
    } else if (reportDomain === 'LOANS') {
      csvContent += 'Loan ID,Applicant,CNIC,House ID,Approved Amount,Disbursed Amount,Remaining Amount,Status\n';
      loans.forEach((l) => {
        csvContent += `"${l.id}","${l.applicant}","${l.cnic}","${l.houseId}",${l.approvedAmount},${l.disbursedAmount},${l.remainingAmount},"${l.status}"\n`;
      });
    } else if (reportDomain === 'LABOUR') {
      csvContent += 'Worker ID,Name,Skill,Assigned House,Training Status,Safety Status\n';
      workers.forEach((w) => {
        csvContent += `"${w.id}","${w.name}","${w.skill}","${w.assignedHouseId}","${w.trainingStatus}","${w.safetyStatus}"\n`;
      });
    } else if (reportDomain === 'SAFETY') {
      csvContent += 'Incident ID,House ID,Issue Type,Severity,Assigned Engineer,Status,Reported Date\n';
      safetyIssues.forEach((s) => {
        csvContent += `"${s.id}","${s.houseId}","${s.issueType}","${s.severity}","${s.assignedEngineer}","${s.status}","${s.reportedDate}"\n`;
      });
    } else {
      csvContent += 'Engineer Name,PEC No,Division,Assigned Houses,Completed Visits,Training Sessions,Status\n';
      engineers.forEach((e) => {
        csvContent += `"${e.name}","${e.pecNo}","${e.assignedDivision}",${e.assignedHousesCount},${e.completedVisits},${e.trainingSessionsConducted},"${e.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ACAG_${reportDomain}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Reports & Analytics Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate executive compliance reports, daily progress logs (DPR), financial reconciliations, and export to Excel/PDF
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDprModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4 text-slate-600" />
            <span>Generate DPR</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-orange-500/25 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Excel (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: 'CONSTRUCTION', label: 'Construction Progress', icon: Building2 },
          { id: 'LOANS', label: 'Loan Disbursements', icon: CreditCard },
          { id: 'LABOUR', label: 'Labour Training', icon: Users },
          { id: 'SAFETY', label: 'Safety & Compliance', icon: ShieldAlert },
          { id: 'ENGINEERS', label: 'Engineer Scorecards', icon: HardHat },
        ].map((domain) => {
          const Icon = domain.icon;
          const isActive = reportDomain === domain.id;
          return (
            <button
              key={domain.id}
              onClick={() => setReportDomain(domain.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{domain.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Timeframe:</span>
          {['7DAYS', '30DAYS', 'YTD', 'ALL'].map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                dateRange === r ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r === '7DAYS' ? 'Last 7 Days' : r === '30DAYS' ? 'Last 30 Days' : r === 'YTD' ? 'Year-to-Date' : 'All Time'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">District:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
          >
            <option value="ALL">All Punjab Districts</option>
            {districtsList.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================================================================
          DOMAIN 1: CONSTRUCTION REPORT
         ========================================================================= */}
      {reportDomain === 'CONSTRUCTION' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Units Mapped</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{houses.length} Houses</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Completion Rate</span>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">
                {Math.round((houses.filter((h) => h.status === 'Completed').length / houses.length) * 100)}%
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Under Construction</span>
              <div className="text-2xl font-black text-blue-900 mt-0.5">
                {houses.filter((h) => h.status === 'Under Construction').length} Units
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Delayed / High Risk</span>
              <div className="text-2xl font-black text-rose-700 mt-0.5">
                {houses.filter((h) => h.safetyIssuesCount > 0).length} Units
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase">
                  <th className="py-3 px-5">House ID</th>
                  <th className="py-3 px-4">Owner Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Progress %</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Loan Disbursed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {houses.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-5 font-mono font-black text-orange-700">{h.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{h.ownerName}</td>
                    <td className="py-3.5 px-4 text-slate-700">{h.district}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{h.stage}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-700">{h.progressPct}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 border">
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900">
                      PKR {(h.loanDisbursed / 1000).toLocaleString()}k
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 2: LOANS REPORT
         ========================================================================= */}
      {reportDomain === 'LOANS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Financing Committed</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                PKR {(loans.reduce((acc, l) => acc + l.approvedAmount, 0) / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Disbursed Through BOP</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                PKR {(loans.reduce((acc, l) => acc + l.disbursedAmount, 0) / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Installments</span>
              <div className="text-xl font-black text-amber-700 mt-0.5">
                PKR {(loans.reduce((acc, l) => acc + l.remainingAmount, 0) / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase">
                  <th className="py-3 px-5">Loan ID</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">House ID</th>
                  <th className="py-3 px-4">Approved (PKR)</th>
                  <th className="py-3 px-4">Disbursed (PKR)</th>
                  <th className="py-3 px-4">Remaining (PKR)</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-5 font-mono font-black text-slate-900">{l.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{l.applicant}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-700">{l.houseId}</td>
                    <td className="py-3.5 px-4 font-mono">PKR {(l.approvedAmount / 1000).toLocaleString()}k</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-700">PKR {(l.disbursedAmount / 1000).toLocaleString()}k</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">PKR {(l.remainingAmount / 1000).toLocaleString()}k</td>
                    <td className="py-3.5 px-5 text-right font-bold text-slate-800">{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 3: LABOUR TRAINING REPORT
         ========================================================================= */}
      {reportDomain === 'LABOUR' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Site Workers</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{workers.length} Artisans</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Certified Trained</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                {workers.filter((w) => w.trainingStatus === 'Trained').length}
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Required Topics</span>
              <div className="text-xl font-black text-amber-700 mt-0.5">
                {workers.filter((w) => w.trainingStatus !== 'Trained').length}
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Field Sessions Logged</span>
              <div className="text-xl font-black text-purple-900 mt-0.5">
                {engineers.reduce((acc, e) => acc + e.trainingSessionsConducted, 0)} Sessions
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase">
                  <th className="py-3 px-5">Worker ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Trade Skill</th>
                  <th className="py-3 px-4">Assigned House</th>
                  <th className="py-3 px-4">Completed Modules</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-5 font-mono font-black text-slate-900">{w.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{w.name}</td>
                    <td className="py-3.5 px-4 text-blue-700 font-bold">{w.skill}</td>
                    <td className="py-3.5 px-4 font-mono text-orange-700">{w.assignedHouseId}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{w.completedTopics.join(', ')}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-emerald-700">{w.trainingStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 4: SAFETY & COMPLIANCE REPORT
         ========================================================================= */}
      {reportDomain === 'SAFETY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Logged Incidents</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{safetyIssues.length}</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Critical Stop-Work Orders</span>
              <div className="text-xl font-black text-rose-700 mt-0.5">
                {safetyIssues.filter((s) => s.severity === 'Critical').length}
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Rectified & Closed</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                {safetyIssues.filter((s) => s.status === 'Resolved').length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase">
                  <th className="py-3 px-5">Incident ID</th>
                  <th className="py-3 px-4">House ID</th>
                  <th className="py-3 px-4">Defect Description</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Assigned Engineer</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safetyIssues.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-5 font-mono font-black text-slate-900">{s.id}</td>
                    <td className="py-3.5 px-4 font-mono text-orange-700">{s.houseId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.issueType}</td>
                    <td className="py-3.5 px-4 font-bold text-rose-700">{s.severity}</td>
                    <td className="py-3.5 px-4 text-slate-700">{s.assignedEngineer}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-slate-800">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 5: ENGINEER SCORECARDS REPORT
         ========================================================================= */}
      {reportDomain === 'ENGINEERS' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase">
                <th className="py-3 px-5">Engineer Name</th>
                <th className="py-3 px-4">PEC Reg No</th>
                <th className="py-3 px-4">Assigned Division</th>
                <th className="py-3 px-4">Assigned Houses</th>
                <th className="py-3 px-4">Completed Inspections</th>
                <th className="py-3 px-4">Labour Sessions</th>
                <th className="py-3 px-5 text-right">Safety Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {engineers.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-5 font-black text-slate-900">{e.name}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{e.pecNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{e.assignedDivision}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-700">{e.assignedHousesCount}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-700">{e.completedVisits}</td>
                  <td className="py-3.5 px-4 font-mono text-purple-900">{e.trainingSessionsConducted}</td>
                  <td className="py-3.5 px-5 text-right font-black text-emerald-700">{e.safetyComplianceScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          MODAL: DAILY PROGRESS REPORT (DPR) PRINTABLE PREVIEW
         ========================================================================= */}
      {isDprModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Government of Punjab — ACAG Daily Progress Report (DPR)
                </h3>
                <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setIsDprModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center font-bold">
                <div className="p-2 bg-white rounded-xl border">Total Active Houses: {houses.length}</div>
                <div className="p-2 bg-white rounded-xl border">Completed Handover: {houses.filter((h) => h.status === 'Completed').length}</div>
                <div className="p-2 bg-white rounded-xl border">BOP Disbursed: PKR {(loans.reduce((acc, l) => acc + l.disbursedAmount, 0) / 1000000).toFixed(2)}M</div>
              </div>
              <p className="text-slate-700">
                Summary: Field inspections conducted smoothly across {districtsList.length} divisions. Safety violations were flagged in Gujranwala corridor and re-inspection directives dispatched.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDprModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintPDF}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition flex items-center gap-1"
              >
                <Printer className="h-4 w-4" />
                <span>Print DPR to PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
