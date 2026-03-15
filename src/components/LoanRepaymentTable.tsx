'use client';

function getLoanSchedule(
  principal: number,
  months: number
): { month: number; date: string; payment: number; principal: number; balance: number }[] {
  const rows: { month: number; date: string; payment: number; principal: number; balance: number }[] = [];
  const monthlyPayment = principal / months;
  const start = new Date();
  start.setMonth(start.getMonth() + 1);
  for (let i = 1; i <= months; i++) {
    const principalPayment =
      i < months ? monthlyPayment : principal - (months - 1) * monthlyPayment;
    const balance = Math.max(0, principal - i * monthlyPayment);
    const d = new Date(start.getFullYear(), start.getMonth() + i - 1, 1);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    rows.push({
      month: i,
      date: dateStr,
      payment: monthlyPayment,
      principal: principalPayment,
      balance,
    });
  }
  return rows;
}

const headerStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '14px',
  fontWeight: 'var(--font-weight-semibold)',
  color: '#141E44',
  backgroundColor: '#E8EDF2',
  border: '1px solid #E5E9F9',
  textAlign: 'center',
};
const cellStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '14px',
  fontWeight: 'var(--font-weight-normal)',
  color: '#141E44',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E9F9',
  textAlign: 'center',
};

export interface LoanRepaymentTableProps {
  /** סכום ההלוואה (קרן) */
  principal: number;
  /** מספר חודשי ההחזר (ברירת מחדל 120) */
  months?: number;
  /** אם מועבר – מציג כפתור סגירה */
  onClose?: () => void;
}

export function LoanRepaymentTable({
  principal,
  months = 120,
  onClose,
}: LoanRepaymentTableProps) {
  const schedule = getLoanSchedule(principal, months);
  const monthlyPayment = principal / months;

  return (
    <div className="w-full" dir="rtl" style={{ marginTop: '8px', marginBottom: '16px' }}>
      <div
        style={{
          padding: '20px 24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 0 12px rgba(24, 47, 67, 0.06)',
          border: '1px solid #E5E9F9',
        }}
      >
        <div className="flex items-center justify-between mb-4" style={{ flexDirection: 'row-reverse' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'var(--font-weight-semibold)', color: '#141E44', textAlign: 'right' }}>
            תצוגת החזרי הלוואה — ₪{principal.toLocaleString('he-IL')} ל־{months} חודשים
          </h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[rgba(0,0,0,0.06)] transition-colors"
              style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
              aria-label="סגור"
            >
              <span style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1 }}>×</span>
            </button>
          )}
        </div>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px', textAlign: 'right' }}>
          הלוואה ללא ריבית. תשלום חודשי קבוע — ₪{Math.round(monthlyPayment).toLocaleString('he-IL')}.
        </p>
        <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full border-collapse" style={{ minWidth: '420px', tableLayout: 'fixed' }} dir="rtl">
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ ...headerStyle, width: '20%' }}>מס׳ חודש</th>
                <th style={{ ...headerStyle, width: '26%' }}>תשלום חודשי</th>
                <th style={{ ...headerStyle, width: '27%' }}>סה״כ שולם</th>
                <th style={{ ...headerStyle, width: '27%' }}>נותר לתשלום</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => {
                const totalPaidSoFar = principal - row.balance;
                return (
                  <tr key={row.month}>
                    <td style={cellStyle}>{row.month}</td>
                    <td style={cellStyle}>₪{Math.round(row.payment).toLocaleString('he-IL')}</td>
                    <td style={cellStyle}>₪{Math.round(totalPaidSoFar).toLocaleString('he-IL')}</td>
                    <td style={cellStyle}>₪{Math.round(row.balance).toLocaleString('he-IL')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
