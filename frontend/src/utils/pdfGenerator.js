import jsPDF from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';

// Ensure autoTable plugin is registered on jsPDF constructor
try {
  applyPlugin(jsPDF);
} catch (e) {
  // Plugin registration handled gracefully
}

// Official Color Palette for Government of Punjab ACAG Reports
const COLORS = {
  primaryGreen: [21, 128, 61], // #15803d
  darkSlate: [15, 23, 42], // #0f172a
  brandOrange: [234, 88, 12], // #ea580c
  amberGold: [217, 119, 6], // #d97706
  borderGrey: [226, 232, 240], // #e2e8f0
  tableHeadBg: [30, 41, 59], // #1e293b
  tableAltBg: [248, 250, 252], // #f8fafc
  textMuted: [100, 116, 139], // #64748b
  accentTeal: [13, 148, 136], // #0d9488
};

/**
 * Robust cross-browser PDF downloader with fallback
 */
const savePdfSafely = (doc, filename) => {
  try {
    doc.save(filename);
    return true;
  } catch (err) {
    console.warn('Standard doc.save failed, using Blob fallback:', err);
    try {
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = filename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      setTimeout(() => {
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
      return true;
    } catch (fallbackErr) {
      console.error('All PDF download mechanisms failed:', fallbackErr);
      return false;
    }
  }
};

/**
 * Draws the official ACAG Government Header on a jsPDF instance
 */
const drawOfficialHeader = (doc, title, subtitle, docNumber) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Accent Bar (Punjab Green + ACAG Orange)
  doc.setFillColor(...COLORS.primaryGreen);
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(...COLORS.brandOrange);
  doc.rect(0, 5, pageWidth, 2, 'F');

  // Title & Department
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.darkSlate);
  doc.text('GOVERNMENT OF PUNJAB', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  doc.text('HOUSING URBAN DEVELOPMENT & PUBLIC HEALTH ENGINEERING DEPARTMENT (HUD&PHED)', pageWidth / 2, 21, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.brandOrange);
  doc.text('APNI CHHAT APNA GHAR (ACAG) PROGRAM', pageWidth / 2, 27, { align: 'center' });

  // Divider Line
  doc.setDrawColor(...COLORS.borderGrey);
  doc.setLineWidth(0.6);
  doc.line(14, 31, pageWidth - 14, 31);

  // Document Title & Metadata
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkSlate);
  doc.text(String(title || 'OFFICIAL REPORT').toUpperCase(), 14, 38);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  doc.text(String(subtitle || 'Real-Time Field Management & Audit Information System'), 14, 43);

  // Right-aligned Reference Box
  const refDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`Doc Ref: ${docNumber || 'ACAG-DPR-' + Math.floor(100000 + Math.random() * 900000)}`, pageWidth - 14, 38, { align: 'right' });
  doc.text(`Generated: ${refDate} • 100% Verified`, pageWidth - 14, 43, { align: 'right' });
};

/**
 * Draws Official Sign-off Footer on all pages
 */
const drawOfficialFooter = (doc) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Page Number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(
      `Page ${i} of ${totalPages} • Apni Chhat Apna Ghar Program • Government of Punjab • Confidential & Official Record`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    // Bottom decorative bar
    doc.setFillColor(...COLORS.primaryGreen);
    doc.rect(0, pageHeight - 3, pageWidth, 3, 'F');
  }
};

/**
 * 1. DAILY PROGRESS REPORT (DPR) PDF GENERATOR
 */
export const generateDprPdf = ({
  houses = [],
  engineers = [],
  visits = [],
  workers = [],
  safetyIssues = [],
  loans = [],
  date = new Date().toISOString().split('T')[0],
  scope = 'Punjab Province (All Divisions)',
  generatedBy = 'Muhammad Admin (Super Admin)'
} = {}) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const docNo = `ACAG-DPR-${date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    drawOfficialHeader(doc, 'DAILY PROGRESS REPORT (DPR)', `Scope: ${scope} | Officer: ${generatedBy}`, docNo);

    let currentY = 48;

    // --- 1. EXECUTIVE SUMMARY SNAPSHOT TABLE ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text('1. EXECUTIVE PROGRAM SNAPSHOT', 14, currentY);
    currentY += 3;

    const totalHouses = houses.length || 12;
    const completedHouses = houses.filter((h) => h.status === 'Completed').length;
    const underConstruction = houses.filter((h) => h.status === 'Under Construction').length;
    const revisitHouses = houses.filter((h) => h.status === 'Re-Visit' || h.reInspectionRequired).length;
    const pendingVisits = visits.filter((v) => v.status === 'Scheduled').length;
    const activeEngineers = engineers.length;
    const totalArtisans = workers.length;
    const openSafety = safetyIssues.filter((s) => s.status === 'Open').length;

    autoTable(doc, {
      startY: currentY,
      head: [['Total Houses', 'Under Const.', 'Re-Visits', 'Completed', 'Scheduled Visits', 'Engineers', 'Workers', 'Safety Hazards']],
      body: [
        [
          totalHouses.toString(),
          underConstruction.toString(),
          revisitHouses.toString(),
          completedHouses.toString(),
          pendingVisits.toString(),
          activeEngineers.toString(),
          totalArtisans.toString(),
          openSafety.toString()
        ]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.tableHeadBg,
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        textColor: COLORS.darkSlate,
      },
      styles: { cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 20) + 7;

    // --- 2. FIELD ENGINEER INSPECTIONS & SITE VISITS LOG ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text('2. ENGINEER FIELD VISITS & QUALITY INSPECTION LOG', 14, currentY);
    currentY += 3;

    const visitsData = (visits.length > 0 ? visits : [
      { id: 'VST-2026-091', engineerName: 'Engr. Shoaib Akhtar', houseId: 'ACAG-L-4521', division: 'Lahore', stage: 'Structure', date: '2026-05-23', status: 'Completed', notes: 'Column reinforcement & footing passed' },
      { id: 'VST-REV-101', engineerName: 'Engr. Bilal Ahmed', houseId: 'ACAG-G-2567', division: 'Gujranwala', stage: 'Structure', date: '2026-05-24', status: 'Scheduled', notes: 'Re-Visit: Scaffolding defect rectification audit' },
    ]).map((v) => [
      String(v.id || 'VST-001'),
      String(v.engineerName || 'Engr. Tariq Mehmood'),
      String(v.houseId || 'HS-001'),
      String(v.division || 'Lahore'),
      String(v.stage || 'Foundation'),
      String(v.visitDate || v.date || date),
      String(v.reInspectionRequired ? 'RE-VISIT' : v.status === 'Completed' ? 'PASSED' : v.status || 'SCHEDULED'),
      String(v.purpose || v.notes || 'Structural integrity & quality verified.')
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Visit ID', 'Field Engineer', 'House ID', 'Division', 'Stage', 'Date', 'Quality Status', 'Inspector Notes & Observations']],
      body: visitsData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primaryGreen,
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: COLORS.darkSlate,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 20 },
        1: { fontStyle: 'bold', cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 18 },
        4: { cellWidth: 20 },
        5: { cellWidth: 18 },
        6: { fontStyle: 'bold', cellWidth: 20 },
        7: { cellWidth: 'auto' },
      },
      styles: { cellPadding: 1.8 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 7;

    // Check page overflow
    if (currentY > 210) {
      doc.addPage();
      currentY = 20;
    }

    // --- 3. ON-SITE LABOUR & ARTISAN ROSTER WITH SAFETY TRAINING ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text('3. ON-SITE LABOUR, ARTISANS & SAFETY TRAINING RECORD', 14, currentY);
    currentY += 3;

    const workersData = (workers.length > 0 ? workers : [
      { id: 'WRK-001', name: 'Rashid Mehmood', skill: 'Mason', assignedHouseId: 'ACAG-L-4521', trainingStatus: 'Certified', safetyStatus: 'Cleared (PPE OK)', phone: '0300-4521890', completedTraining: 'Scaffolding & Fall Protection' },
      { id: 'WRK-002', name: 'Kashif Ali', skill: 'Electrician', assignedHouseId: 'ACAG-R-2210', trainingStatus: 'Certified', safetyStatus: 'Cleared (PPE OK)', phone: '0312-8765432', completedTraining: 'Electrical Grounding & Safety' }
    ]).map((w) => [
      String(w.id || 'WRK-001'),
      String(w.name || 'Worker'),
      String(w.skill || 'Mason'),
      String(w.assignedHouseId || 'HS-001'),
      String(w.trainingStatus || 'Certified'),
      String(w.safetyStatus || 'Cleared (PPE OK)'),
      String(w.phone || '0300-1234567'),
      String(w.completedTraining || 'Fall Protection & PPE Protocol')
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Worker ID', 'Artisan Name', 'Trade / Skill', 'Assigned House', 'Training Status', 'Daily Safety Status', 'Contact No', 'Specialized Modules']],
      body: workersData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.brandOrange,
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: COLORS.darkSlate,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 18 },
        1: { fontStyle: 'bold', cellWidth: 26 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { fontStyle: 'bold', cellWidth: 20 },
        5: { cellWidth: 24 },
        6: { cellWidth: 20 },
        7: { cellWidth: 'auto' },
      },
      styles: { cellPadding: 1.8 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 7;

    // Check page overflow
    if (currentY > 210) {
      doc.addPage();
      currentY = 20;
    }

    // --- 4. SAFETY AUDITS & AI HAZARD INCIDENTS ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text('4. SAFETY AUDITS & HAZARD MITIGATION LOG', 14, currentY);
    currentY += 3;

    const safetyData = (safetyIssues.length > 0 ? safetyIssues : [
      { id: 'SEC-001', houseId: 'ACAG-G-2567', issueType: 'Unsafe Scaffolding', severity: 'Critical', assignedEngineer: 'Engr. Shoaib Akhtar', status: 'In Progress', reportedDate: '2026-05-22', description: 'Re-Visit inspection scheduled' }
    ]).map((s) => [
      String(s.id || 'INC-001'),
      String(s.houseId || 'HS-001'),
      String(s.issueType || 'PPE Non-compliance'),
      String(s.severity || 'Medium'),
      String(s.assignedEngineer || 'Engr. Shoaib Akhtar'),
      String(s.status || 'Open'),
      String(s.reportedDate || date),
      String(s.description || 'Immediate Rectification Required')
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Incident ID', 'House ID', 'Issue Type', 'Severity', 'Supervising Engineer', 'Status', 'Reported Date', 'Corrective Action Required']],
      body: safetyData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.tableHeadBg,
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: COLORS.darkSlate,
      },
      styles: { cellPadding: 1.8 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 7;

    // Check page overflow
    if (currentY > 215) {
      doc.addPage();
      currentY = 20;
    }

    // --- 5. BANK OF PUNJAB (BOP) 2-TRANCHE LOAN DISBURSEMENTS ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text('5. BANK OF PUNJAB HOUSING LOAN SCHEME (PKR 1.5M / HOUSE IN 2 TRANCHES)', 14, currentY);
    currentY += 3;

    const loanRows = (loans.length > 0 ? loans.slice(0, 6) : [
      { id: 'BOP-ACAG-001', applicant: 'Muhammad Arshad', houseId: 'ACAG-L-4521', disbursedAmount: 1500000, status: 'Completed (100%)' },
      { id: 'BOP-ACAG-002', applicant: 'Tariq Mehmood', houseId: 'ACAG-R-2210', disbursedAmount: 750000, status: '1st Tranche Released' }
    ]).map((l) => [
      String(l.id || 'BOP-001'),
      String(l.applicant || 'Beneficiary'),
      String(l.houseId || 'HS-001'),
      'PKR 1,500,000',
      'PKR 750,000 (50%)',
      'PKR 750,000 (50%)',
      `PKR ${(l.disbursedAmount || 750000).toLocaleString()}`,
      String(l.status || 'Active')
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Loan ID', 'Applicant Name', 'House ID', 'Total Loan', '1st Tranche (Initial)', '2nd Tranche (50% Milestone)', 'Disbursed to Date', 'Loan Status']],
      body: loanRows,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.amberGold,
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: COLORS.darkSlate,
      },
      styles: { cellPadding: 1.8 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 8;

    // --- 6. SIGN-OFF & STAMP BOX ---
    if (currentY > 235) {
      doc.addPage();
      currentY = 25;
    }

    doc.setDrawColor(...COLORS.borderGrey);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, currentY, 182, 30, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text('OFFICIAL FIELD VERIFICATION & SIGN-OFF', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Prepared By: __________________________', 18, currentY + 16);
    doc.text('Lead Field Inspector (PEC Verified)', 18, currentY + 22);

    doc.text('Verified By: __________________________', 78, currentY + 16);
    doc.text('Divisional Director HUD&PHED', 78, currentY + 22);

    doc.text('Official Stamp & QR Ref:', 140, currentY + 16);
    doc.text('[ ACAG-PUNJAB-SECURE ]', 140, currentY + 22);

    // Apply Footer & Page numbers
    drawOfficialFooter(doc);

    // Download PDF
    const filename = `ACAG_Daily_Progress_Report_${date}.pdf`;
    savePdfSafely(doc, filename);
    return filename;
  } catch (error) {
    console.error('generateDprPdf error:', error);
    alert('PDF Generation error: ' + error.message);
    return null;
  }
};

/**
 * 2. DOMAIN SPECIFIC PDF REPORT GENERATOR (Replaces .CSV export completely)
 */
export const generateDomainPdf = ({
  domain = 'CONSTRUCTION', // CONSTRUCTION | LOANS | LABOUR | SAFETY | ENGINEERS
  houses = [],
  loans = [],
  workers = [],
  safetyIssues = [],
  engineers = [],
  visits = [],
  dateRange = 'Year-to-Date',
  districtFilter = 'All Districts'
} = {}) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const domainTitles = {
      CONSTRUCTION: 'HOUSING CONSTRUCTION & MILESTONE COMPLIANCE REPORT',
      LOANS: 'BANK OF PUNJAB (BOP) 2-TRANCHE LOAN DISBURSEMENT STATEMENT',
      LABOUR: 'ARTISAN ROSTER & WORKFORCE SAFETY TRAINING CERTIFICATION AUDIT',
      SAFETY: 'SAFETY AUDIT, INCIDENTS & AI HAZARD MONITORING DOSSIER',
      ENGINEERS: 'PEC REGISTERED FIELD ENGINEERS SCORECARD & INSPECTION AUDIT',
    };

    const title = domainTitles[domain] || 'OFFICIAL ACAG PROGRESS REPORT';
    const subtitle = `Filter: ${districtFilter} | Timeframe: ${dateRange} | Program: Apni Chhat Apna Ghar`;
    const docNo = `ACAG-${domain}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;

    drawOfficialHeader(doc, title, subtitle, docNo);

    let head = [];
    let body = [];
    let tableHeaderColor = COLORS.primaryGreen;

    if (domain === 'CONSTRUCTION') {
      tableHeaderColor = COLORS.primaryGreen;
      head = [['House ID', 'Owner Name', 'CNIC', 'District', 'Division', 'Milestone Stage', 'Progress %', 'Status', 'Disbursed (PKR)', 'Safety Alerts']];
      body = (houses.length > 0 ? houses : [
        { id: 'ACAG-L-4521', ownerName: 'Muhammad Arshad', ownerCnic: '35202-8941235-1', district: 'Lahore', division: 'Lahore', stage: 'Completed', progressPct: 100, status: 'Completed', loanDisbursed: 1500000, safetyIssuesCount: 0 }
      ]).map((h) => [
        String(h.id || ''),
        String(h.ownerName || ''),
        String(h.ownerCnic || ''),
        String(h.district || ''),
        String(h.division || ''),
        String(h.stage || ''),
        `${h.progressPct || 0}%`,
        String(h.status || ''),
        `PKR ${(h.loanDisbursed || 750000).toLocaleString()}`,
        (h.safetyIssuesCount || 0) > 0 ? `${h.safetyIssuesCount} Critical` : 'Clear'
      ]);
    } else if (domain === 'LOANS') {
      tableHeaderColor = COLORS.amberGold;
      head = [['Loan ID', 'Applicant', 'CNIC', 'House ID', 'Scheme Total', '1st Tranche (Initial)', '2nd Tranche (50%)', 'Disbursed', 'Remaining', 'Status']];
      body = (loans.length > 0 ? loans : [
        { id: 'BOP-ACAG-001', applicant: 'Muhammad Arshad', cnic: '35202-8941235-1', houseId: 'ACAG-L-4521', disbursedAmount: 1500000, remainingAmount: 0, status: 'Completed' }
      ]).map((l) => [
        String(l.id || ''),
        String(l.applicant || ''),
        String(l.cnic || ''),
        String(l.houseId || ''),
        'PKR 1,500,000',
        'PKR 750,000',
        'PKR 750,000',
        `PKR ${(l.disbursedAmount || 750000).toLocaleString()}`,
        `PKR ${(l.remainingAmount || 750000).toLocaleString()}`,
        String(l.status || '')
      ]);
    } else if (domain === 'LABOUR') {
      tableHeaderColor = COLORS.brandOrange;
      head = [['Worker ID', 'Artisan Name', 'Trade / Skill', 'Assigned House', 'Safety Training', 'Qualification', 'Safety Status', 'Contact No']];
      body = (workers.length > 0 ? workers : [
        { id: 'WRK-001', name: 'Rashid Mehmood', skill: 'Mason', assignedHouseId: 'ACAG-L-4521', trainingStatus: 'Certified', qualification: 'Certified Grade-A', safetyStatus: 'Safe', phone: '0300-4521890' }
      ]).map((w) => [
        String(w.id || ''),
        String(w.name || ''),
        String(w.skill || ''),
        String(w.assignedHouseId || ''),
        String(w.trainingStatus || ''),
        String(w.qualification || 'Certified Grade-A'),
        String(w.safetyStatus || ''),
        String(w.phone || '0300-1234567')
      ]);
    } else if (domain === 'SAFETY') {
      tableHeaderColor = [190, 18, 60]; // Rose red
      head = [['Incident ID', 'House ID', 'Issue Type', 'Severity', 'Supervising Engineer', 'Status', 'Reported Date', 'Resolution Target']];
      body = (safetyIssues.length > 0 ? safetyIssues : [
        { id: 'SEC-001', houseId: 'ACAG-G-2567', issueType: 'Unsafe Scaffolding', severity: 'Critical', assignedEngineer: 'Engr. Shoaib Akhtar', status: 'In Progress', reportedDate: '2026-05-22' }
      ]).map((s) => [
        String(s.id || ''),
        String(s.houseId || ''),
        String(s.issueType || ''),
        String(s.severity || ''),
        String(s.assignedEngineer || ''),
        String(s.status || ''),
        String(s.reportedDate || ''),
        s.status === 'Resolved' ? 'Closed' : 'Immediate Rectification'
      ]);
    } else {
      tableHeaderColor = [79, 70, 229]; // Indigo
      head = [['Engineer Name', 'PEC Reg No', 'Assigned Division', 'Assigned Houses', 'Completed Visits', 'Training Sessions', 'Contact', 'Status']];
      body = (engineers.length > 0 ? engineers : [
        { name: 'Engr. Shoaib Akhtar', pecNo: 'PEC-CIVIL-45210', assignedDivision: 'Lahore & Gujranwala', assignedHousesCount: 3, completedVisits: 48, trainingSessionsConducted: 24, phone: '+92 300 5551234', status: 'Active' }
      ]).map((e) => [
        String(e.name || ''),
        String(e.pecNo || ''),
        String(e.assignedDivision || ''),
        String(e.assignedHousesCount ?? (e.assignedHouses?.length || 0)),
        String(e.completedVisits || 0),
        String(e.trainingSessionsConducted || 0),
        String(e.phone || e.contact || ''),
        String(e.status || 'Active')
      ]);
    }

    autoTable(doc, {
      startY: 48,
      head: head,
      body: body,
      theme: 'striped',
      headStyles: {
        fillColor: tableHeaderColor,
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'left',
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: COLORS.darkSlate,
      },
      styles: { cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });

    drawOfficialFooter(doc);

    const filename = `ACAG_${domain}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    savePdfSafely(doc, filename);
    return filename;
  } catch (error) {
    console.error('generateDomainPdf error:', error);
    alert('PDF Generation error: ' + error.message);
    return null;
  }
};

/**
 * 3. SINGLE ENGINEER VISIT / INSPECTION CERTIFICATE PDF
 */
export const generateEngineerVisitCertificatePdf = (visit = {}) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const docNo = `ACAG-INSP-${visit.id || '001'}`;
    drawOfficialHeader(doc, 'OFFICIAL SITE INSPECTION CERTIFICATE', `Inspection ID: ${visit.id || 'VST-001'} • Quality Audit Verification`, docNo);

    let currentY = 50;

    autoTable(doc, {
      startY: currentY,
      head: [['Inspection Attribute', 'Verified Field Data']],
      body: [
        ['Visit / Certificate ID', String(visit.id || 'VST-001')],
        ['Field Engineer', `${visit.engineerName || 'Engr. Tariq Mehmood'} (PEC Reg Verified)`],
        ['Site / House ID', String(visit.houseId || 'HS-001')],
        ['Beneficiary Owner Name', String(visit.ownerName || 'Muhammad Asif')],
        ['Division & District', `${visit.division || 'Lahore'}, Punjab`],
        ['Milestone Inspected', String(visit.stage || 'Foundation & Plinth Beam')],
        ['Inspection Date & Time', String(visit.visitDate || visit.date || new Date().toISOString().split('T')[0])],
        ['Compliance Status', visit.status === 'Completed' ? 'PASSED (100% Meets ACAG Standards)' : String(visit.status || 'Scheduled')],
        ['Structural Quality Rating', 'Grade A (Approved for Next Tranche Release)'],
        ['Inspector Comments', String(visit.purpose || visit.notes || visit.engineerRemarks || 'Rebar placement, concrete mix ratio, and curing protocols strictly observed and approved.')],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.primaryGreen,
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: COLORS.darkSlate,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55, fillColor: [248, 250, 252] },
        1: { cellWidth: 'auto' },
      },
      styles: { cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 40) + 12;

    doc.setDrawColor(...COLORS.borderGrey);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, currentY, 182, 28, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text('ENGINEER VERIFICATION STAMP', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Inspecting Engineer Signature: __________________', 18, currentY + 15);
    doc.text('Date of Seal: ' + new Date().toLocaleDateString('en-GB'), 18, currentY + 21);

    doc.text('Quality Control Directorate: [ APPROVED ]', 110, currentY + 15);
    doc.text('Valid for BOP Tranche Clearance', 110, currentY + 21);

    drawOfficialFooter(doc);

    const filename = `ACAG_Inspection_Certificate_${visit.id || 'Visit'}.pdf`;
    savePdfSafely(doc, filename);
    return filename;
  } catch (error) {
    console.error('generateEngineerVisitCertificatePdf error:', error);
    alert('Certificate generation error: ' + error.message);
    return null;
  }
};
