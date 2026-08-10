import { TeamRecord } from './adminStore';
import { MemberData } from '../types/registration';

/**
 * Helper to escape quotes and format values for Excel-friendly CSV:
 * - Prepend UTF-8 BOM (\uFEFF) byte so symbols (₹, ⭐) render without corruption
 * - Wraps numbers/long IDs with ="VALUE" so Excel forces text mode (no scientific notation like 9.924E+10)
 * - Escapes internal quotes
 */
function formatCSVCell(val: string | number | undefined | null, isNumberString = false): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).trim();
  if (str === '') return '""';

  if (isNumberString) {
    // Excel formula wrapper to preserve leading zeros & avoid scientific notation (e.g., 9.924E+10)
    const cleanStr = str.replace(/"/g, '""');
    return `"=""${cleanStr}"""`;
  }

  // Standard CSV escaped string
  return `"${str.replace(/"/g, '""')}"`;
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 1. ENHANCED MEMBER-WISE DETAILED ROSTER CSV EXPORT (DEFAULT)
 * Features:
 * - Col 1: Team S.No (1, 2, 3...)
 * - Col 2: Team ID
 * - Col 3: Team Name (Well formatted & centered)
 * - Col 4: Member Role (⭐ TEAM LEADER vs Member 1, 2, 3...)
 * - Col 5: Member Name (⭐ HIGHLIGHTED TEAM LEADER NAME)
 * - Col 6: Registration No (Scientific notation safe: ="9924123456")
 * - Col 7: Mobile Number (Scientific notation safe: ="7416123456")
 * - Col 8: Department
 * - Col 9: Section
 * - Col 10: Year of Study
 * - Col 11: Residence Type (Hosteller / Day Scholar)
 * - Col 12: Hostel Name (if Hosteller, else N/A)
 * - Col 13: Room Number (if Hosteller, else N/A)
 * - Col 14: Warden Name (if Hosteller, else N/A)
 * - Col 15: Warden Phone (if Hosteller, else N/A)
 * - Col 16: Payment Status (APPROVED / PENDING / REJECTED)
 * - Col 17: Transaction ID (Scientific notation safe)
 * - Col 18: Amount (₹)
 * - Col 19: Payment App Used
 * - Col 20: Submitted Date & Time
 * - UTF-8 Byte Order Mark (\uFEFF) to prevent encoding corruption (e.g. ₹ turning into 京)
 */
export function exportTeamsToCSV(teams: TeamRecord[], filename = 'DISFRUTAR_2K26_Member_Roster.csv') {
  const headers = [
    'Team S.No',
    'Team ID',
    'Team Name',
    'Member Role',
    'Member Full Name (Leader Highlighted)',
    'Registration No',
    'Mobile Number',
    'Department',
    'Section',
    'Year',
    'Residence Type',
    'Hostel Name',
    'Room Number',
    'Warden Name',
    'Warden Phone',
    'Payment Status',
    'Transaction ID',
    'Amount (₹)',
    'Payment App',
    'Submission Date'
  ];

  const rows: string[][] = [];

  teams.forEach((t, tIdx) => {
    const teamNumber = tIdx + 1;
    const activeMembers = t.members.filter(m => m.name.trim() !== '' || m.role === 'Leader');

    activeMembers.forEach((m, mIdx) => {
      const isLeader = m.role === 'Leader' || mIdx === 0;

      const memberRoleText = isLeader ? '⭐ TEAM LEADER' : m.role.toUpperCase();
      const memberNameText = isLeader ? `⭐ ${m.name.toUpperCase()} (LEADER)` : m.name;

      rows.push([
        formatCSVCell(teamNumber),
        formatCSVCell(t.id),
        formatCSVCell(t.teamName),
        formatCSVCell(memberRoleText),
        formatCSVCell(memberNameText),
        formatCSVCell(m.registerNumber, true),
        formatCSVCell(m.phone, true),
        formatCSVCell(m.department || 'N/A'),
        formatCSVCell(m.section || 'N/A'),
        formatCSVCell(m.year || 'N/A'),
        formatCSVCell(m.residenceType || 'N/A'),
        formatCSVCell(m.residenceType === 'Hosteller' ? (m.hostelName || 'N/A') : 'N/A (Day Scholar)'),
        formatCSVCell(m.residenceType === 'Hosteller' ? (m.roomNumber || 'N/A') : 'N/A'),
        formatCSVCell(m.residenceType === 'Hosteller' ? (m.wardenName || 'N/A') : 'N/A'),
        formatCSVCell(m.residenceType === 'Hosteller' ? (m.wardenPhone || 'N/A') : 'N/A', m.residenceType === 'Hosteller' && !!m.wardenPhone),
        formatCSVCell(t.paymentStatus.toUpperCase()),
        formatCSVCell(t.transactionId, true),
        formatCSVCell(t.amount),
        formatCSVCell((t as any).paymentAppUsed || 'UPI / QR Code'),
        formatCSVCell(t.submittedAt || t.createdAt)
      ]);
    });
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * 2. ENHANCED TEAM-SUMMARY SIDE-BY-SIDE CSV EXPORT
 * One row per team with side-by-side member columns (Leader & Member 1-4)
 */
export function exportTeamsSummaryToCSV(teams: TeamRecord[], filename = 'DISFRUTAR_2K26_Teams_Summary.csv') {
  const headers = [
    'Team S.No',
    'Team ID',
    'Team Name',
    'Member Count',
    'Payment Status',
    'Amount (₹)',
    'Transaction ID',
    'Submitted At',
    'Leader Name',
    'Leader Reg No',
    'Leader Phone',
    'Leader Dept',
    'Leader Sec',
    'Leader Year',
    'Leader Residence',
    'Leader Hostel',
    'Leader Room',
    'Leader Warden Name',
    'Leader Warden Phone',
    'Member 1 Name',
    'Member 1 Reg No',
    'Member 1 Phone',
    'Member 1 Dept',
    'Member 1 Residence',
    'Member 2 Name',
    'Member 2 Reg No',
    'Member 2 Phone',
    'Member 2 Dept',
    'Member 2 Residence',
    'Member 3 Name',
    'Member 3 Reg No',
    'Member 3 Phone',
    'Member 3 Dept',
    'Member 3 Residence',
    'Member 4 Name',
    'Member 4 Reg No',
    'Member 4 Phone',
    'Member 4 Dept',
    'Member 4 Residence'
  ];

  const rows = teams.map((t, tIdx) => {
    const leader = t.members.find(m => m.role === 'Leader') || t.members[0] || {} as Partial<MemberData>;
    const otherMembers = t.members.filter(m => m !== leader);

    const m1 = otherMembers[0] || {} as Partial<MemberData>;
    const m2 = otherMembers[1] || {} as Partial<MemberData>;
    const m3 = otherMembers[2] || {} as Partial<MemberData>;
    const m4 = otherMembers[3] || {} as Partial<MemberData>;

    return [
      formatCSVCell(tIdx + 1),
      formatCSVCell(t.id),
      formatCSVCell(t.teamName),
      formatCSVCell(t.memberCount),
      formatCSVCell(t.paymentStatus.toUpperCase()),
      formatCSVCell(t.amount),
      formatCSVCell(t.transactionId, true),
      formatCSVCell(t.submittedAt || t.createdAt),

      // Leader
      formatCSVCell(`⭐ ${leader.name || 'N/A'}`),
      formatCSVCell(leader.registerNumber, true),
      formatCSVCell(leader.phone, true),
      formatCSVCell(leader.department || 'N/A'),
      formatCSVCell(leader.section || 'N/A'),
      formatCSVCell(leader.year || 'N/A'),
      formatCSVCell(leader.residenceType || 'N/A'),
      formatCSVCell(leader.hostelName || 'N/A'),
      formatCSVCell(leader.roomNumber || 'N/A'),
      formatCSVCell(leader.wardenName || 'N/A'),
      formatCSVCell(leader.wardenPhone || 'N/A', !!leader.wardenPhone),

      // Member 1
      formatCSVCell(m1.name || 'N/A'),
      formatCSVCell(m1.registerNumber, true),
      formatCSVCell(m1.phone, true),
      formatCSVCell(m1.department || 'N/A'),
      formatCSVCell(m1.residenceType || 'N/A'),

      // Member 2
      formatCSVCell(m2.name || 'N/A'),
      formatCSVCell(m2.registerNumber, true),
      formatCSVCell(m2.phone, true),
      formatCSVCell(m2.department || 'N/A'),
      formatCSVCell(m2.residenceType || 'N/A'),

      // Member 3
      formatCSVCell(m3.name || 'N/A'),
      formatCSVCell(m3.registerNumber, true),
      formatCSVCell(m3.phone, true),
      formatCSVCell(m3.department || 'N/A'),
      formatCSVCell(m3.residenceType || 'N/A'),

      // Member 4
      formatCSVCell(m4.name || 'N/A'),
      formatCSVCell(m4.registerNumber, true),
      formatCSVCell(m4.phone, true),
      formatCSVCell(m4.department || 'N/A'),
      formatCSVCell(m4.residenceType || 'N/A')
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * 3. STYLED EXCEL SPREADSHEET EXPORT (.xls)
 * Rich styled HTML/XML table that Excel opens natively with:
 * - Centered Team Name columns
 * - Highlighted Team Leader rows in soft gold (#FEF3C7)
 * - Green/Amber payment status badges
 * - Text number formatting (mso-number-format:"\@") preventing scientific notation
 * - Crisp table borders and header styling
 */
export function exportTeamsToExcelXML(teams: TeamRecord[], filename = 'DISFRUTAR_2K26_Master_Spreadsheet.xls') {
  let tableRowsHTML = '';

  teams.forEach((t, tIdx) => {
    const activeMembers = t.members.filter(m => m.name.trim() !== '' || m.role === 'Leader');

    activeMembers.forEach((m, mIdx) => {
      const isLeader = m.role === 'Leader' || mIdx === 0;
      const rowStyle = isLeader ? 'background-color: #FEF3C7; font-weight: 600;' : (tIdx % 2 === 0 ? 'background-color: #FFFFFF;' : 'background-color: #F8FAFC;');
      const roleBadge = isLeader ? '<span style="color: #B45309; font-weight: 800;">⭐ TEAM LEADER</span>' : `<span style="color: #475569;">${m.role}</span>`;
      const nameHTML = isLeader ? `<strong style="color: #92400E; font-size: 11px;">⭐ ${m.name.toUpperCase()} (LEADER)</strong>` : `<span>${m.name}</span>`;
      const statusBadge = t.paymentStatus === 'approved' 
        ? '<span style="background-color: #DCFCE7; color: #15803D; padding: 3px 8px; border-radius: 10px; font-weight: bold;">APPROVED</span>'
        : '<span style="background-color: #FEF3C7; color: #B45309; padding: 3px 8px; border-radius: 10px; font-weight: bold;">PENDING</span>';

      tableRowsHTML += `
        <tr style="${rowStyle}">
          <td style="text-align: center; font-weight: bold; color: #2563EB;">${tIdx + 1}</td>
          <td style="text-align: center; font-family: monospace; font-weight: bold; mso-number-format:'\\@';">${t.id}</td>
          <td style="text-align: center; font-weight: bold; color: #0F172A;">${t.teamName}</td>
          <td style="text-align: center;">${roleBadge}</td>
          <td>${nameHTML}</td>
          <td style="font-family: monospace; mso-number-format:'\\@'; font-weight: bold;">${m.registerNumber || 'N/A'}</td>
          <td style="font-family: monospace; mso-number-format:'\\@'; font-weight: bold; color: #2563EB;">${m.phone || 'N/A'}</td>
          <td>${m.department || 'N/A'}</td>
          <td style="text-align: center;">${m.section || 'N/A'}</td>
          <td style="text-align: center;">${m.year || 'N/A'}</td>
          <td style="text-align: center;">${m.residenceType || 'N/A'}</td>
          <td>${m.residenceType === 'Hosteller' ? (m.hostelName || 'N/A') : 'N/A (Day Scholar)'}</td>
          <td style="text-align: center;">${m.residenceType === 'Hosteller' ? (m.roomNumber || 'N/A') : 'N/A'}</td>
          <td>${m.residenceType === 'Hosteller' ? (m.wardenName || 'N/A') : 'N/A'}</td>
          <td style="font-family: monospace; mso-number-format:'\\@';">${m.residenceType === 'Hosteller' ? (m.wardenPhone || 'N/A') : 'N/A'}</td>
          <td style="text-align: center;">${statusBadge}</td>
          <td style="font-family: monospace; mso-number-format:'\\@';">${t.transactionId}</td>
          <td style="text-align: right; font-weight: bold; color: #166534;">₹${t.amount}</td>
          <td style="text-align: center;">${(t as any).paymentAppUsed || 'UPI'}</td>
          <td style="font-size: 10px; color: #64748B;">${t.submittedAt || t.createdAt}</td>
        </tr>
      `;
    });
  });

  const excelHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>DISFRUTAR 2K26 Roster</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #1E1B4B; color: #FFFFFF; font-weight: bold; text-transform: uppercase; font-size: 10px; padding: 10px 8px; border: 1px solid #334155; text-align: center; }
          td { border: 1px solid #CBD5E1; padding: 7px 10px; vertical-align: middle; }
        </style>
      </head>
      <body>
        <h2>DISFRUTAR 2K26 - Official Master Event Roster</h2>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()} | Total Teams: ${teams.length}</p>
        <table>
          <thead>
            <tr>
              <th>Team S.No</th>
              <th>Team ID</th>
              <th>Team Name</th>
              <th>Member Role</th>
              <th>Member Name (Leader Highlighted)</th>
              <th>Registration No</th>
              <th>Mobile Number</th>
              <th>Department</th>
              <th>Section</th>
              <th>Year</th>
              <th>Residence Type</th>
              <th>Hostel Name</th>
              <th>Room Number</th>
              <th>Warden Name</th>
              <th>Warden Phone</th>
              <th>Payment Status</th>
              <th>Transaction ID</th>
              <th>Amount (₹)</th>
              <th>Payment App</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHTML}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Common Styles and Print Window Header for Premium PDF Generation
 */
const BASE_PDF_STYLES = `
  @page {
    size: A4 portrait;
    margin: 12mm 10mm 15mm 10mm;
  }
  @media print {
    .no-print { display: none !important; }
    body { background: #ffffff !important; color: #0f172a !important; padding: 0 !important; }
    .card-box { border: 1px solid #cbd5e1 !important; box-shadow: none !important; }
    tr { page-break-inside: avoid; }
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #0f172a;
    background: #f8fafc;
    margin: 0;
    padding: 20px;
    font-size: 11px;
    line-height: 1.4;
  }
  .print-action-bar {
    position: sticky;
    top: 0;
    z-index: 9999;
    background: #0f172a;
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3);
  }
  .print-btn {
    background: #3b82f6;
    color: #ffffff;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }
  .print-btn:hover { background: #2563eb; }
  .close-btn {
    background: rgba(255,255,255,0.1);
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }
  .close-btn:hover { background: rgba(255,255,255,0.2); }
  .doc-container {
    max-width: 1000px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 24px 28px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
  .header-brand {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2.5px solid #2563eb;
    padding-bottom: 14px;
    margin-bottom: 18px;
  }
  .brand-title {
    font-size: 22px;
    font-weight: 900;
    color: #1e1b4b;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .brand-sub {
    font-size: 12px;
    font-weight: 700;
    color: #2563eb;
    letter-spacing: 1px;
    margin-top: 2px;
  }
  .report-title-badge {
    display: inline-block;
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 800;
    font-size: 13px;
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid #bfdbfe;
    margin-top: 6px;
    text-transform: uppercase;
  }
  .meta-info {
    text-align: right;
    font-size: 10px;
    color: #64748b;
  }
  .meta-info strong { color: #1e293b; }
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }
  .kpi-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 14px;
  }
  .kpi-label { font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-val { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px; }
  .kpi-sub { font-size: 9px; color: #3b82f6; margin-top: 2px; font-weight: 600; }
  
  table.pdf-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 10.5px;
  }
  table.pdf-table th {
    background: #1e1b4b;
    color: #ffffff;
    text-align: left;
    padding: 9px 10px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid #1e1b4b;
  }
  table.pdf-table td {
    padding: 8px 10px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
    color: #334155;
  }
  table.pdf-table tr:nth-child(even) {
    background-color: #f8fafc;
  }
  .sn-cell { font-weight: 800; text-align: center; color: #2563eb; width: 35px; }
  .badge-hostel {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9.5px;
    font-weight: 700;
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
  }
  .badge-dayscholar {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9.5px;
    font-weight: 700;
    background: #f3e8ff;
    color: #7e22ce;
    border: 1px solid #e9d5ff;
  }
  .badge-pending {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 800;
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
    text-transform: uppercase;
  }
  .badge-approved {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 800;
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
    text-transform: uppercase;
  }
  .footer-stamp {
    margin-top: 24px;
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: #94a3b8;
  }
`;

function getActionHeaderHTML(title: string) {
  return `
    <div class="no-print print-action-bar">
      <div style="font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px;">
        <span style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px;">PDF</span>
        <span>DISFRUTAR 2K26 • ${title}</span>
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="window.print()" class="print-btn">🖨️ Print / Save as PDF</button>
        <button onclick="window.close()" class="close-btn">✕ Close</button>
      </div>
    </div>
  `;
}

/**
 * 1. HOSTELLERS PDF GENERATOR
 * Requirements: SN, Name, Registration, Dept, Mobile, Hostel Name, Warden Name, Warden Number
 */
export function openHostellersPDF(teams: TeamRecord[], filterDescription = 'All Active Registrations') {
  // Extract all hosteller participants across all provided teams
  const hostellers: {
    teamId: string;
    teamName: string;
    member: MemberData;
  }[] = [];

  teams.forEach(t => {
    t.members.forEach(m => {
      if (m.residenceType === 'Hosteller' && m.name.trim() !== '') {
        hostellers.push({
          teamId: t.id,
          teamName: t.teamName,
          member: m
        });
      }
    });
  });

  const totalHostellers = hostellers.length;
  const uniqueHostels = Array.from(new Set(hostellers.map(h => h.member.hostelName || 'Unspecified'))).filter(Boolean).length;
  const currentDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const rowsHTML = hostellers.map((h, idx) => `
    <tr>
      <td class="sn-cell">${idx + 1}</td>
      <td>
        <strong style="color: #0f172a; font-size: 11px;">${h.member.name}</strong><br/>
        <span style="font-size: 9px; color: #64748b;">${h.member.role} • ${h.teamName} (${h.teamId})</span>
      </td>
      <td style="font-family: monospace; font-weight: 700; color: #1e293b;">${h.member.registerNumber || 'N/A'}</td>
      <td>${h.member.department || 'N/A'} ${h.member.section ? `(${h.member.section})` : ''}<br/><span style="font-size: 9px; color: #64748b;">${h.member.year || ''}</span></td>
      <td style="font-family: monospace; font-weight: 700; color: #2563eb;">${h.member.phone || 'N/A'}</td>
      <td>
        <span class="badge-hostel">${h.member.hostelName || 'N/A'}</span>
        ${h.member.roomNumber ? `<br/><span style="font-size: 9px; color: #475569;">Room: <strong>${h.member.roomNumber}</strong></span>` : ''}
      </td>
      <td style="font-weight: 600;">${h.member.wardenName || 'N/A'}</td>
      <td style="font-family: monospace; font-weight: 700; color: #0284c7;">${h.member.wardenPhone || 'N/A'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hostellers Roster Report - DISFRUTAR 2K26</title>
        <style>${BASE_PDF_STYLES}</style>
      </head>
      <body>
        ${getActionHeaderHTML('Hosteller Allocation Report')}
        
        <div class="doc-container">
          <div class="header-brand">
            <div>
              <div class="brand-title">DISFRUTAR 2K26</div>
              <div class="brand-sub">KARE ACM STUDENT CHAPTER</div>
              <div class="report-title-badge">🏢 Hosteller Accommodation Roster</div>
            </div>
            <div class="meta-info">
              <div><strong>Generated:</strong> ${currentDate}</div>
              <div><strong>Scope:</strong> ${filterDescription}</div>
              <div><strong>Total Hostellers:</strong> ${totalHostellers} Students</div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Hostellers</div>
              <div class="kpi-val" style="color: #0284c7;">${totalHostellers}</div>
              <div class="kpi-sub">Enrolled Hostel Residents</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Hostel Blocks</div>
              <div class="kpi-val">${uniqueHostels}</div>
              <div class="kpi-sub">Campus Hostels</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Teams Represented</div>
              <div class="kpi-val">${teams.length}</div>
              <div class="kpi-sub">Teams with Hostellers</div>
            </div>
          </div>

          <table class="pdf-table">
            <thead>
              <tr>
                <th style="width: 35px; text-align: center;">SN</th>
                <th>Name & Role</th>
                <th>Registration</th>
                <th>Dept / Sec</th>
                <th>Mobile</th>
                <th>Hostel Name</th>
                <th>Warden Name</th>
                <th>Warden Number</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML || '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #64748b;">No hosteller student records found.</td></tr>'}
            </tbody>
          </table>

          <div class="footer-stamp">
            <div>Official Hosteller Allocation Document • KARE ACM Operations Team</div>
            <div>Page 1 of 1 • System Generated</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `;

  openPrintWindow(html);
}

/**
 * 2. DAY SCHOLARS PDF GENERATOR
 * Requirements: SN, Name, Registration, Dept, Mobile
 */
export function openDayScholarsPDF(teams: TeamRecord[], filterDescription = 'All Active Registrations') {
  // Extract all day scholar participants across all provided teams
  const dayScholars: {
    teamId: string;
    teamName: string;
    member: MemberData;
  }[] = [];

  teams.forEach(t => {
    t.members.forEach(m => {
      if (m.residenceType === 'Day Scholar' && m.name.trim() !== '') {
        dayScholars.push({
          teamId: t.id,
          teamName: t.teamName,
          member: m
        });
      }
    });
  });

  const totalDayScholars = dayScholars.length;
  const currentDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const rowsHTML = dayScholars.map((d, idx) => `
    <tr>
      <td class="sn-cell">${idx + 1}</td>
      <td>
        <strong style="color: #0f172a; font-size: 11px;">${d.member.name}</strong><br/>
        <span style="font-size: 9px; color: #64748b;">${d.member.role} • ${d.teamName} (${d.teamId})</span>
      </td>
      <td style="font-family: monospace; font-weight: 700; color: #1e293b;">${d.member.registerNumber || 'N/A'}</td>
      <td>${d.member.department || 'N/A'} ${d.member.section ? `(${d.member.section})` : ''}<br/><span style="font-size: 9px; color: #64748b;">${d.member.year || ''}</span></td>
      <td style="font-family: monospace; font-weight: 700; color: #7e22ce;">${d.member.phone || 'N/A'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Day Scholars Roster Report - DISFRUTAR 2K26</title>
        <style>${BASE_PDF_STYLES}</style>
      </head>
      <body>
        ${getActionHeaderHTML('Day Scholars Commuter Roster')}
        
        <div class="doc-container">
          <div class="header-brand">
            <div>
              <div class="brand-title">DISFRUTAR 2K26</div>
              <div class="brand-sub">KARE ACM STUDENT CHAPTER</div>
              <div class="report-title-badge" style="background: #f3e8ff; color: #6b21a8; border-color: #e9d5ff;">🚌 Day Scholars Commuter Roster</div>
            </div>
            <div class="meta-info">
              <div><strong>Generated:</strong> ${currentDate}</div>
              <div><strong>Scope:</strong> ${filterDescription}</div>
              <div><strong>Total Day Scholars:</strong> ${totalDayScholars} Students</div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Day Scholars</div>
              <div class="kpi-val" style="color: #7e22ce;">${totalDayScholars}</div>
              <div class="kpi-sub">Local Commuter Students</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Teams Covered</div>
              <div class="kpi-val">${teams.length}</div>
              <div class="kpi-sub">Teams with Day Scholars</div>
            </div>
          </div>

          <table class="pdf-table">
            <thead>
              <tr>
                <th style="width: 35px; text-align: center;">SN</th>
                <th>Student Name & Role</th>
                <th>Registration No</th>
                <th>Department & Year</th>
                <th>Mobile Number</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML || '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">No day scholar student records found.</td></tr>'}
            </tbody>
          </table>

          <div class="footer-stamp">
            <div>Official Day Scholar Roster • KARE ACM Operations Team</div>
            <div>Page 1 of 1 • System Generated</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `;

  openPrintWindow(html);
}

/**
 * 3. PENDING PAYMENTS PDF GENERATOR
 * Requirements: SN, Team ID, Team Name, Names & Reg Numbers, Mobile Number, Transaction ID, Amount, Date, Status
 */
export function openPendingPaymentsPDF(teams: TeamRecord[], filterDescription = 'Teams Awaiting Payment Verification') {
  const pendingTeams = teams.filter(t => t.paymentStatus === 'pending');
  const totalPending = pendingTeams.length;
  const totalPendingAmount = pendingTeams.reduce((acc, t) => acc + t.amount, 0);
  const currentDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const rowsHTML = pendingTeams.map((t, idx) => {
    const leader: Partial<MemberData> = t.members[0] || {};
    const membersListHTML = t.members
      .filter(m => m.name.trim() !== '')
      .map(m => `<div style="font-size: 9.5px; margin-bottom: 2px;">• <strong>${m.name}</strong> (${m.registerNumber || 'N/A'}) - <span style="color: #64748b;">${m.role}</span></div>`)
      .join('');

    return `
      <tr>
        <td class="sn-cell">${idx + 1}</td>
        <td style="font-family: monospace; font-weight: 800; color: #1e1b4b;">${t.id}</td>
        <td>
          <strong style="color: #0f172a; font-size: 11.5px;">${t.teamName}</strong><br/>
          <span style="font-size: 9px; color: #64748b;">${t.memberCount} Total Members</span>
        </td>
        <td>
          ${membersListHTML}
        </td>
        <td style="font-family: monospace; font-weight: 700; color: #2563eb;">
          ${leader.phone || 'N/A'}<br/>
          <span style="font-size: 9px; color: #64748b;">(Leader Contact)</span>
        </td>
        <td style="font-family: monospace; font-weight: 800; color: #d97706; background: #fffbeb; padding: 6px; border-radius: 4px; border: 1px solid #fef3c7;">
          ${t.transactionId || 'N/A'}
        </td>
        <td style="font-weight: 900; color: #166534; font-size: 12px;">
          ₹${t.amount}
        </td>
        <td style="font-size: 9.5px; color: #475569;">
          ${t.submittedAt || t.createdAt}
        </td>
        <td>
          <span class="badge-pending">PENDING VERIFICATION</span>
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pending Payments Audit Report - DISFRUTAR 2K26</title>
        <style>${BASE_PDF_STYLES}</style>
      </head>
      <body>
        ${getActionHeaderHTML('Pending Payments Audit Roster')}
        
        <div class="doc-container">
          <div class="header-brand">
            <div>
              <div class="brand-title">DISFRUTAR 2K26</div>
              <div class="brand-sub">KARE ACM STUDENT CHAPTER</div>
              <div class="report-title-badge" style="background: #fffbeb; color: #b45309; border-color: #fde68a;">⏳ Pending Payments Audit Roster</div>
            </div>
            <div class="meta-info">
              <div><strong>Generated:</strong> ${currentDate}</div>
              <div><strong>Scope:</strong> ${filterDescription}</div>
              <div><strong>Pending Teams:</strong> ${totalPending} Teams</div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card" style="border-left: 4px solid #f59e0b;">
              <div class="kpi-label">Pending Verification</div>
              <div class="kpi-val" style="color: #d97706;">${totalPending} Teams</div>
              <div class="kpi-sub">Awaiting UPI Check</div>
            </div>
            <div class="kpi-card" style="border-left: 4px solid #10b981;">
              <div class="kpi-label">Outstanding Revenue</div>
              <div class="kpi-val" style="color: #059669;">₹${totalPendingAmount}</div>
              <div class="kpi-sub">Total Unverified Amount</div>
            </div>
          </div>

          <table class="pdf-table">
            <thead>
              <tr>
                <th style="width: 35px; text-align: center;">SN</th>
                <th>Team ID</th>
                <th>Team Name</th>
                <th>Team Member Names & Reg Numbers</th>
                <th>Leader Mobile</th>
                <th>Transaction ID</th>
                <th>Fee Amount</th>
                <th>Submitted Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML || '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #64748b;">No pending payment verification records found. All payments clear!</td></tr>'}
            </tbody>
          </table>

          <div class="footer-stamp">
            <div>Official Payment Audit Roster • KARE ACM Finance Committee</div>
            <div>Page 1 of 1 • Verification Checklist Document</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `;

  openPrintWindow(html);
}

/**
 * 4. OVERALL MASTER PDF GENERATOR
 */
export function openOverallPDF(teams: TeamRecord[], reportTitle = 'DISFRUTAR 2K26 Master Roster Report', filterDescription = 'All Teams Roster') {
  const currentDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const totalTeams = teams.length;
  const totalParticipants = teams.reduce((acc, t) => acc + t.memberCount, 0);
  const totalApproved = teams.filter(t => t.paymentStatus === 'approved').length;
  const totalPending = teams.filter(t => t.paymentStatus === 'pending').length;
  const totalRevenue = teams.reduce((acc, t) => acc + (t.paymentStatus === 'approved' ? t.amount : 0), 0);

  const rowsHTML = teams.map((t, idx) => {
    const leader: Partial<MemberData> = t.members[0] || {};
    const hostellersCount = t.members.filter(m => m.residenceType === 'Hosteller').length;
    const dayScholarsCount = t.members.filter(m => m.residenceType === 'Day Scholar').length;

    return `
      <tr>
        <td class="sn-cell">${idx + 1}</td>
        <td style="font-family: monospace; font-weight: 800;">${t.id}</td>
        <td>
          <strong style="color: #0f172a; font-size: 11.5px;">${t.teamName}</strong><br/>
          <span style="font-size: 9px; color: #64748b;">Txn: ${t.transactionId}</span>
        </td>
        <td>
          <strong style="color: #1e293b;">${leader.name || 'N/A'}</strong> (${leader.registerNumber || 'N/A'})<br/>
          <span style="font-size: 9px; color: #2563eb;">Mob: ${leader.phone || 'N/A'} • Dept: ${leader.department || 'N/A'}</span>
        </td>
        <td>
          <strong>${t.memberCount} Members</strong><br/>
          <span style="font-size: 9px; color: #0284c7;">${hostellersCount} Hosteller(s)</span> • 
          <span style="font-size: 9px; color: #7e22ce;">${dayScholarsCount} Day Scholar(s)</span>
        </td>
        <td style="font-weight: 800; color: #166534;">₹${t.amount}</td>
        <td>
          <span class="${t.paymentStatus === 'approved' ? 'badge-approved' : t.paymentStatus === 'pending' ? 'badge-pending' : 'badge-pending'}" style="${t.paymentStatus === 'rejected' ? 'background: #fee2e2; color: #b91c1c; border-color: #fca5a5;' : ''}">
            ${t.paymentStatus}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>${BASE_PDF_STYLES}</style>
      </head>
      <body>
        ${getActionHeaderHTML('Master Overall Operations Report')}
        
        <div class="doc-container">
          <div class="header-brand">
            <div>
              <div class="brand-title">DISFRUTAR 2K26</div>
              <div class="brand-sub">KARE ACM STUDENT CHAPTER</div>
              <div class="report-title-badge">${reportTitle}</div>
            </div>
            <div class="meta-info">
              <div><strong>Generated:</strong> ${currentDate}</div>
              <div><strong>Filter Scope:</strong> ${filterDescription}</div>
              <div><strong>Verified Status:</strong> Official Admin Export</div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Teams</div>
              <div class="kpi-val" style="color: #2563eb;">${totalTeams}</div>
              <div class="kpi-sub">Registered Teams</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Participants</div>
              <div class="kpi-val">${totalParticipants}</div>
              <div class="kpi-sub">Students Enrolled</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Approved Teams</div>
              <div class="kpi-val" style="color: #166534;">${totalApproved}</div>
              <div class="kpi-sub">Verified Registrations</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Pending Verification</div>
              <div class="kpi-val" style="color: #d97706;">${totalPending}</div>
              <div class="kpi-sub">Needs Audit</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Verified Revenue</div>
              <div class="kpi-val" style="color: #059669;">₹${totalRevenue}</div>
              <div class="kpi-sub">Approved Collections</div>
            </div>
          </div>

          <table class="pdf-table">
            <thead>
              <tr>
                <th style="width: 35px; text-align: center;">SN</th>
                <th>Team ID</th>
                <th>Team Details</th>
                <th>Leader Contact & Dept</th>
                <th>Roster Composition</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #64748b;">No matching teams found for this report.</td></tr>'}
            </tbody>
          </table>

          <div class="footer-stamp">
            <div>DISFRUTAR 2K26 Official Master Roster • KARE ACM Operations Team</div>
            <div>Page 1 of 1 • Authorized Admin Document</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `;

  openPrintWindow(html);
}

/**
 * 5. SINGLE TEAM REGISTRATION CERTIFICATE / RECEIPT PDF
 */
export function openSingleTeamPDF(team: TeamRecord) {
  const leader: Partial<MemberData> = team.members[0] || {};
  const activeMembers = team.members.filter(m => m.name.trim() !== '');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Team Receipt - ${team.id}</title>
        <style>${BASE_PDF_STYLES}</style>
      </head>
      <body>
        ${getActionHeaderHTML(`Team Receipt: ${team.teamName} (${team.id})`)}
        
        <div class="doc-container" style="max-width: 750px;">
          <div class="header-brand">
            <div>
              <div class="brand-title">DISFRUTAR 2K26</div>
              <div class="brand-sub">KARE ACM STUDENT CHAPTER</div>
              <div class="report-title-badge">Official Team Registration Summary</div>
            </div>
            <div class="meta-info">
              <div><strong>Reg ID:</strong> ${team.id}</div>
              <div><strong>Date:</strong> ${team.submittedAt || team.createdAt}</div>
              <div><strong>Status:</strong> <span class="${team.paymentStatus === 'approved' ? 'badge-approved' : 'badge-pending'}">${team.paymentStatus}</span></div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Team Name</div>
              <div class="kpi-val" style="font-size: 16px; color: #1e1b4b;">${team.teamName}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Leader</div>
              <div class="kpi-val" style="font-size: 14px;">${leader.name || 'N/A'}</div>
              <div class="kpi-sub">${leader.registerNumber || ''}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Transaction ID</div>
              <div class="kpi-val" style="font-size: 13px; font-family: monospace; color: #2563eb;">${team.transactionId}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Registration Fee</div>
              <div class="kpi-val" style="font-size: 18px; color: #166534;">₹${team.amount}</div>
            </div>
          </div>

          <h4 style="font-size: 12px; font-weight: 800; color: #1e1b4b; text-transform: uppercase; margin-top: 20px; margin-bottom: 8px;">Registered Team Members (${activeMembers.length})</h4>

          <table class="pdf-table">
            <thead>
              <tr>
                <th style="width: 35px; text-align: center;">SN</th>
                <th>Role</th>
                <th>Member Name</th>
                <th>Registration No</th>
                <th>Dept / Sec</th>
                <th>Mobile</th>
                <th>Residence</th>
              </tr>
            </thead>
            <tbody>
              ${activeMembers.map((m, idx) => `
                <tr>
                  <td class="sn-cell">${idx + 1}</td>
                  <td><strong>${m.role}</strong></td>
                  <td><strong style="color: #0f172a;">${m.name}</strong></td>
                  <td style="font-family: monospace;">${m.registerNumber}</td>
                  <td>${m.department} ${m.section ? `(${m.section})` : ''}</td>
                  <td style="font-family: monospace;">${m.phone}</td>
                  <td>
                    ${m.residenceType === 'Hosteller' ? `<span class="badge-hostel">Hosteller (${m.hostelName || 'Hostel'})</span>` : `<span class="badge-dayscholar">Day Scholar</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer-stamp">
            <div>Official Registration Pass • KARE ACM Desk Verification</div>
            <div>Keep this copy for entrance confirmation</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `;

  openPrintWindow(html);
}

/**
 * Legacy openPrintablePDF helper maintaining backwards compatibility
 */
export function openPrintablePDF(teams: TeamRecord[], reportTitle: string, filterDescription?: string) {
  openOverallPDF(teams, reportTitle, filterDescription);
}

/**
 * Helper to safely open print window without popup blocking issues
 */
function openPrintWindow(htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    alert('Please allow popups in your browser to view or print PDF reports.');
  }
}
