'use client';

import { Button } from "@/components/ui/button";

function IconPlusCircle() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

interface ChargeRow {
  id: number;
  type: "loan" | "unit";
  identifier: string;
  childName: string;
  monthlyAmount: string;
  chargeDay?: number;
  nextChargeDate?: string;
  paidPayments: {
    count: number;
    totalAmount: string;
  };
}

function IconPencil() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
      <path d="M13.26 3.6L5.05 12.29C4.74 12.62 4.44 13.27 4.38 13.72L4.01 16.96C3.88 18.13 4.72 18.93 5.88 18.73L9.1 18.18C9.55 18.1 10.18 17.77 10.49 17.43L18.7 8.74C20.12 7.24 20.76 5.53 18.55 3.44C16.35 1.37 14.68 2.1 13.26 3.6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
      <path d="M11.89 5.05C12.32 7.81 14.56 9.92 17.34 10.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
      <path d="M3 22H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

interface ChargesTableProps {
  charges: ChargeRow[];
}

export function ChargesTable({ charges }: ChargesTableProps) {
  return (
    <div className="flex flex-col w-full" dir="rtl">
      {/* Desktop Table View */}
      <div
        className="bg-muted/30 w-full relative hidden md:block"
        style={{
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ overflow: "hidden", borderRadius: "var(--radius-card)" }}>
          {/* Table Header */}
          <div
            className="bg-muted/50 flex items-center"
            style={{
              paddingRight: "var(--spacing-6, 24px)",
              paddingLeft: "var(--spacing-6, 24px)",
              paddingTop: "var(--spacing-3, 12px)",
              paddingBottom: "var(--spacing-3, 12px)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-start" style={{ width: "110px", paddingLeft: "var(--spacing-3, 12px)" }}>
              <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "18px" }}>
                תשלום עבור
              </p>
            </div>
            <div className="flex items-center justify-start" style={{ width: "130px", paddingLeft: "var(--spacing-3, 12px)" }}>
              <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "18px" }}>
                מס׳ מזהה
              </p>
            </div>
            <div className="flex items-center justify-start" style={{ width: "120px", paddingLeft: "var(--spacing-3, 12px)" }}>
              <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "18px" }}>
                סכום חיוב חודשי
              </p>
            </div>
            <div className="flex items-center justify-start" style={{ width: "140px", paddingLeft: "var(--spacing-3, 12px)" }}>
              <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "18px" }}>
                יום חיוב בחודש
              </p>
            </div>
            <div className="flex items-center justify-start" style={{ width: "110px", paddingLeft: "var(--spacing-3, 12px)" }}>
              <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "18px" }}>
                חיוב קרוב
              </p>
            </div>
            <div className="flex-1" />
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {charges.map((charge, index) => (
              <div
                key={charge.id}
                className="bg-card flex items-center"
                style={{
                  paddingRight: "var(--spacing-6, 24px)",
                  paddingLeft: "var(--spacing-6, 24px)",
                  paddingTop: "var(--spacing-4, 16px)",
                  paddingBottom: "var(--spacing-4, 16px)",
                  borderBottom: index < charges.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div className="flex items-center justify-start" style={{ width: "110px", paddingLeft: "var(--spacing-3, 12px)" }}>
                  <p className="text-foreground text-right" style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-normal)", lineHeight: "20px" }}>
                    {charge.type === "loan" ? "הלוואה" : "יחידה"}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-center" style={{ width: "130px", paddingLeft: "var(--spacing-3, 12px)" }}>
                  <p className="text-foreground text-right" style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-normal)", lineHeight: "20px" }}>
                    {charge.identifier}
                  </p>
                  {charge.type === "unit" && (
                    <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-normal)", lineHeight: "18px", marginTop: "var(--spacing-0-5, 2px)" }}>
                      עבור {charge.childName}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-start" style={{ width: "120px", paddingLeft: "var(--spacing-3, 12px)" }}>
                  <p className="text-foreground text-right" style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "20px" }}>
                    {charge.monthlyAmount}
                  </p>
                </div>
                <div className="flex items-center justify-start gap-2" style={{ width: "140px", paddingLeft: "var(--spacing-3, 12px)" }}>
                  <p className="text-foreground text-right" style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-normal)", lineHeight: "20px" }}>
                    {charge.chargeDay ? `${charge.chargeDay} לחודש` : '—'}
                  </p>
                  <button
                    className="flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shrink-0"
                    style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.06)' }}
                    aria-label="עריכת יום חיוב"
                  >
                    <IconPencil />
                  </button>
                </div>
                <div className="flex items-center justify-start" style={{ width: "110px", paddingLeft: "var(--spacing-3, 12px)" }}>
                  <p className="text-foreground text-right" style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-normal)", lineHeight: "20px" }}>
                    {charge.nextChargeDate || '—'}
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-secondary-foreground hover:bg-primary/5 hover:text-secondary-foreground font-semibold rounded-lg"
                  >
                    הוסף ילד/ה
                    <IconPlusCircle />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-4 md:hidden">
        {charges.map((charge) => (
          <div
            key={charge.id}
            className="bg-card flex flex-col"
            style={{
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border)",
              padding: "var(--spacing-4, 16px)",
              gap: "var(--spacing-3, 12px)",
            }}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col items-start" style={{ gap: "var(--spacing-1, 4px)" }}>
                <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "18px" }}>
                  {charge.type === "loan" ? "הלוואה" : "יחידה"}
                </p>
                <p className="text-foreground text-right" style={{ fontSize: "var(--text-base, 16px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "20px" }}>
                  {charge.identifier}
                </p>
                {charge.type === "unit" && (
                  <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-normal)", lineHeight: "18px" }}>
                    עבור {charge.childName}
                  </p>
                )}
              </div>
              <p className="text-foreground text-left" style={{ fontSize: "var(--text-xl, 20px)", fontWeight: "var(--font-weight-bold, 700)", lineHeight: "24px" }}>
                {charge.monthlyAmount}
              </p>
            </div>
            <div className="flex items-center justify-between w-full" style={{ paddingTop: 2 }}>
              <div className="flex items-center gap-3">
                {charge.chargeDay && (
                  <div className="flex items-center gap-1.5">
                    <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-normal)", lineHeight: "18px" }}>
                      יום חיוב:
                    </p>
                    <p className="text-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-semibold, 600)", lineHeight: "18px" }}>
                      {charge.chargeDay} לחודש
                    </p>
                    <button
                      className="flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shrink-0"
                      style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.06)' }}
                      aria-label="עריכת יום חיוב"
                    >
                      <IconPencil />
                    </button>
                  </div>
                )}
                {charge.nextChargeDate && (
                  <div className="flex items-center gap-1.5">
                    <p className="text-muted-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-normal)", lineHeight: "18px" }}>
                      חיוב קרוב:
                    </p>
                    <p className="text-foreground text-right" style={{ fontSize: "var(--text-sm, 14px)", fontWeight: "var(--font-weight-semibold, 600)", lineHeight: "18px" }}>
                      {charge.nextChargeDate}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-primary text-secondary-foreground hover:bg-primary/5 hover:text-secondary-foreground font-semibold rounded-lg"
            >
              הוסף ילד/ה
              <IconPlusCircle />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
