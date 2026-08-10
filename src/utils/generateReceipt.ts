import { TeamRegistrationState } from '../types/registration';

export function downloadReceipt(state: TeamRegistrationState) {
  const activeMembers = (state?.members || []).filter(m => m && Boolean((m.name || '').trim()));
  const memberCount = activeMembers.length;
  const totalAmount = memberCount * 350;
  const regId = state?.registrationId || `DFR2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const receiptHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - ${regId}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #06080b;
            color: #ffffff;
            padding: 40px;
            margin: 0;
          }
          .card {
            max-width: 600px;
            margin: 0 auto;
            background: #0c1024;
            border: 1px solid #536bff;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .logo-title {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 2px;
          }
          .logo-sub {
            font-size: 10px;
            color: #536bff;
            letter-spacing: 1.5px;
          }
          .badge {
            background: rgba(83, 107, 255, 0.2);
            color: #8da2ff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            border: 1px solid rgba(83, 107, 255, 0.4);
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
            background: rgba(255,255,255,0.02);
            padding: 16px;
            border-radius: 12px;
          }
          .info-label {
            font-size: 11px;
            color: #8892b0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            margin-top: 4px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .table th {
            text-align: left;
            font-size: 11px;
            color: #8892b0;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 8px 0;
          }
          .table td {
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            font-size: 13px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: bold;
            border-top: 2px solid #536bff;
            padding-top: 16px;
            margin-top: 16px;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #8892b0;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div>
              <div class="logo-title">DISFRUTAR 2K26</div>
              <div class="logo-sub">KARE ACM STUDENT CHAPTER</div>
            </div>
            <div class="badge">REGISTRATION CONFIRMED</div>
          </div>

          <div class="info-grid">
            <div>
              <div class="info-label">Registration ID</div>
              <div class="info-value">${regId}</div>
            </div>
            <div>
              <div class="info-label">Team Name</div>
              <div class="info-value">${state.teamName || 'N/A'}</div>
            </div>
            <div>
              <div class="info-label">Transaction ID</div>
              <div class="info-value">${state.payment.transactionId || 'N/A'}</div>
            </div>
            <div>
              <div class="info-label">Date</div>
              <div class="info-value">${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Member Role</th>
                <th>Name</th>
                <th>Reg No</th>
              </tr>
            </thead>
            <tbody>
              ${activeMembers.map(m => `
                <tr>
                  <td><strong>${m.role}</strong></td>
                  <td>${m.name}</td>
                  <td>${m.registerNumber}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-row">
            <span>Total Registration Fee (${memberCount} Members)</span>
            <span style="color: #536bff;">₹${totalAmount}</span>
          </div>

          <div class="footer">
            Official Registration Receipt | KARE ACM Student Chapter<br/>
            Keep this document for on-campus entrance & desk verification.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  }
}
