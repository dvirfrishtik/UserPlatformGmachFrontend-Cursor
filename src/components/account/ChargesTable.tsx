'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, AlertTriangle, Info } from 'lucide-react';
import svgPaths from "../../imports/svg-uq5jcfbn1j";
import { Button } from "@/components/ui/button";

function IconRefresh() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p16638f80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
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

function IconBank({ size = 18, color = "#676767" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M2.33325 9.99723C2.33325 8.60168 2.89603 7.74644 4.06065 7.09831L8.85477 4.43033C11.3669 3.03232 12.6229 2.33331 13.9999 2.33331C15.3769 2.33331 16.633 3.03232 19.145 4.43033L23.9392 7.09831C25.1038 7.74644 25.6666 8.6017 25.6666 9.99723C25.6666 10.3756 25.6666 10.5649 25.6253 10.7204C25.4082 11.5377 24.6676 11.6666 23.9524 11.6666H4.04741C3.33223 11.6666 2.59169 11.5377 2.37458 10.7204C2.33325 10.5649 2.33325 10.3756 2.33325 9.99723Z" stroke={color} />
      <path d="M13.9951 8.16669H14.0061" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.66675 11.6667V21.5834M9.33341 11.6667V21.5834" stroke={color} />
      <path d="M18.6667 11.6667V21.5834M23.3334 11.6667V21.5834" stroke={color} />
      <path d="M22.1666 21.5833H5.83325C3.90026 21.5833 2.33325 23.1503 2.33325 25.0833C2.33325 25.4054 2.59442 25.6666 2.91659 25.6666H25.0833C25.4054 25.6666 25.6666 25.4054 25.6666 25.0833C25.6666 23.1503 24.0996 21.5833 22.1666 21.5833Z" stroke={color} />
    </svg>
  );
}

function IconCreditCard({ size = 18, color = "#676767" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M1.75 14C1.75 9.6666 1.75 7.49988 3.03968 6.05331C3.24596 5.82195 3.47331 5.60797 3.71914 5.41383C5.25611 4.20001 7.55824 4.20001 12.1625 4.20001H15.8375C20.4418 4.20001 22.7439 4.20001 24.2808 5.41383C24.5267 5.60797 24.754 5.82195 24.9603 6.05331C26.25 7.49988 26.25 9.6666 26.25 14C26.25 18.3334 26.25 20.5001 24.9603 21.9467C24.754 22.1781 24.5267 22.392 24.2808 22.5862C22.7439 23.8 20.4418 23.8 15.8375 23.8H12.1625C7.55824 23.8 5.25611 23.8 3.71914 22.5862C3.47331 22.392 3.24596 22.1781 3.03968 21.9467C1.75 20.5001 1.75 18.3334 1.75 14Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.55 18.9H13.3875" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.0625 18.9H21.35" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.75 10.325H26.25" stroke={color} strokeLinejoin="round" />
    </svg>
  );
}

const AVAILABLE_CHARGE_DAYS = [2, 5, 10, 15, 20, 25];

function ChangeChargeDayPopup({
  isOpen,
  onClose,
  charge,
  charges,
  paymentMethodLabel,
  paymentMethodType,
  onSelectCharge,
}: {
  isOpen: boolean;
  onClose: () => void;
  charge: ChargeRow;
  charges: ChargeRow[];
  paymentMethodLabel: string;
  paymentMethodType: 'bank' | 'credit';
  onSelectCharge: (charge: ChargeRow) => void;
}) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isChargeDropdownOpen, setIsChargeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedDay(null);
      setIsChargeDropdownOpen(false);
    }
  }, [isOpen, charge.id]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsChargeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const chargeLabel = charge.type === 'loan'
    ? `הלוואה ${charge.identifier}`
    : `יחידות ${charge.identifier}`;

  const isCurrentDay = selectedDay === charge.chargeDay;
  const isDisabled = !selectedDay || isCurrentDay;

  const totalMonthlyForCharge = charge.monthlyAmount;

  function getNextChargeDate(day: number) {
    const now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();
    if (now.getDate() >= day) {
      month += 1;
      if (month > 11) { month = 0; year += 1; }
    }
    const d = new Date(year, month, day);
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 2, 4, 0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: "min(520px, 92vw)",
          background: "linear-gradient(180deg, #F7F8FA 0%, #F7F8FA 100%)",
          borderRadius: "12px",
          border: "1px solid #E5E9F9",
          boxShadow: "0 0 12px rgba(24, 47, 67, 0.08), 0 32px 64px -16px rgba(23, 37, 84, 0.18)",
          overflow: "hidden",
        }}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{ padding: "20px 28px", borderBottom: "1px solid #E5E9F9" }}
        >
          <div style={{ width: "36px" }} />
          <h2 style={{
            fontSize: "20px",
            fontWeight: "var(--font-weight-bold)",
            color: "#141E44",
            lineHeight: "1.3",
            textAlign: "center",
          }}>
            החלפת יום חיוב
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.04)]"
            style={{ border: "none", cursor: "pointer", backgroundColor: "transparent" }}
            aria-label="סגור"
          >
            <X size={20} style={{ color: "#495157" }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "28px 28px 0" }}>
          {/* Dropdowns row */}
          <div className="flex gap-4" style={{ marginBottom: "28px" }}>
            {/* Payment method - read-only display */}
            <div className="flex flex-col gap-2 flex-1">
              <p style={{ fontSize: "14px", color: "#6B7280", fontWeight: "var(--font-weight-normal)", textAlign: "right" }}>
                אמצעי תשלום
              </p>
              <div
                className="flex items-center gap-2"
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "#FFFFFF",
                  height: "44px",
                }}
              >
                {paymentMethodType === 'bank'
                  ? <IconBank size={18} color="#495157" />
                  : <IconCreditCard size={18} color="#495157" />
                }
                <span style={{ fontSize: "15px", color: "#141E44", fontWeight: "var(--font-weight-normal)", flex: 1, textAlign: "right" }}>
                  {paymentMethodLabel}
                </span>
              </div>
            </div>

            {/* Charge selector dropdown */}
            <div className="flex flex-col gap-2 flex-1" ref={dropdownRef}>
              <p style={{ fontSize: "14px", color: "#6B7280", fontWeight: "var(--font-weight-normal)", textAlign: "right" }}>
                חיוב עבור
              </p>
              <div className="relative">
                <button
                  onClick={() => setIsChargeDropdownOpen(!isChargeDropdownOpen)}
                  className="flex items-center gap-2 transition-colors w-full"
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                    justifyContent: "space-between",
                    height: "44px",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; }}
                >
                  <span style={{ fontSize: "15px", color: "#141E44", fontWeight: "var(--font-weight-normal)" }}>
                    {chargeLabel}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: "#6B7280",
                      transform: isChargeDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
                {isChargeDropdownOpen && (
                  <div
                    className="absolute z-10 w-full"
                    style={{
                      top: "calc(100% + 4px)",
                      right: 0,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E9F9",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    {charges.map((c) => {
                      const label = c.type === 'loan'
                        ? `הלוואה ${c.identifier}`
                        : `יחידות ${c.identifier}`;
                      const subtitle = c.type === 'unit' && c.childName ? `עבור ${c.childName}` : null;
                      const isActive = c.id === charge.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCharge(c);
                            setSelectedDay(null);
                            setIsChargeDropdownOpen(false);
                          }}
                          className="w-full transition-colors"
                          style={{
                            padding: "10px 14px",
                            textAlign: "right",
                            fontSize: "15px",
                            color: isActive ? "#141E44" : "#495157",
                            fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
                            backgroundColor: isActive ? "#F0F4FF" : "#FFFFFF",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = "#F9FAFB";
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = "#FFFFFF";
                          }}
                        >
                          <span>{label}</span>
                          {subtitle && (
                            <span style={{ fontSize: "13px", color: "#9CA3AF" }}>{subtitle}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Day selection */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: "var(--font-weight-normal)",
              textAlign: "right",
              marginBottom: "12px",
            }}>
              יום חיוב בחודש
            </p>
            <div className="flex flex-wrap gap-2" style={{ justifyContent: "flex-end" }}>
              {AVAILABLE_CHARGE_DAYS.map((day) => {
                const isSelected = selectedDay === day;
                const isCurrent = day === charge.chargeDay;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className="transition-all"
                    style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      border: isSelected
                        ? "1.5px solid #172554"
                        : "1.5px solid #D1D5DB",
                      backgroundColor: isSelected ? "#172554" : "#FFFFFF",
                      color: isSelected ? "#FFFFFF" : "#141E44",
                      fontSize: "15px",
                      fontWeight: isSelected ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
                      cursor: "pointer",
                      boxShadow: isSelected ? "0 2px 8px rgba(23, 37, 84, 0.15)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "#172554";
                        e.currentTarget.style.backgroundColor = "#F8F9FC";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "#D1D5DB";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }
                    }}
                  >
                    {day} לחודש
                    {isCurrent && !isSelected && (
                      <span style={{ fontSize: "12px", color: "#9CA3AF", marginRight: "6px" }}>(נוכחי)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info banners */}
          {selectedDay && !isCurrentDay && (
            <div className="flex flex-col gap-3" style={{ marginBottom: "24px" }}>
              <div
                className="flex items-start gap-3"
                style={{
                  padding: "14px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#FEF9E7",
                  border: "1px solid #F5E6A3",
                }}
              >
                <AlertTriangle size={18} style={{ color: "#B8860B", marginTop: "1px", shrink: 0 }} />
                <p style={{ fontSize: "14px", color: "#6B5A00", lineHeight: "22px", fontWeight: "var(--font-weight-normal)" }}>
                  החל מהחיוב הקרוב, התשלום החודשי עבור {chargeLabel} יתבצע ב-<strong>{selectedDay} לחודש</strong>.
                </p>
              </div>
              <div
                className="flex items-start gap-3"
                style={{
                  padding: "14px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                }}
              >
                <Info size={18} style={{ color: "#3B82F6", marginTop: "1px", shrink: 0 }} />
                <p style={{ fontSize: "14px", color: "#1E40AF", lineHeight: "22px", fontWeight: "var(--font-weight-normal)" }}>
                  החיוב הבא, על סה&quot;כ {totalMonthlyForCharge}, יתבצע בתאריך <strong>{getNextChargeDate(selectedDay)}</strong>.
                </p>
              </div>
            </div>
          )}

          {selectedDay && isCurrentDay && (
            <div
              className="flex items-start gap-3"
              style={{
                padding: "14px 16px",
                borderRadius: "8px",
                backgroundColor: "#F3F5FA",
                border: "1px solid #E5E9F9",
                marginBottom: "24px",
              }}
            >
              <Info size={18} style={{ color: "#6B7280", marginTop: "1px" }} />
              <p style={{ fontSize: "14px", color: "#495157", lineHeight: "22px" }}>
                זהו יום החיוב הנוכחי. לא נדרש שינוי.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "0 28px 28px" }}>
          <button
            disabled={isDisabled}
            className="w-full inline-flex items-center justify-center transition-all"
            style={{
              height: "48px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "var(--font-weight-semibold)",
              color: isDisabled ? "#495157" : "#FFFFFF",
              backgroundColor: isDisabled ? "#E5E9F9" : "#172554",
              border: "none",
              cursor: isDisabled ? "not-allowed" : "pointer",
              opacity: isDisabled ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isDisabled) e.currentTarget.style.backgroundColor = "#0F1A3E";
            }}
            onMouseLeave={(e) => {
              if (!isDisabled) e.currentTarget.style.backgroundColor = "#172554";
            }}
            onClick={() => {
              onClose();
            }}
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}

interface ChargesTableProps {
  charges: ChargeRow[];
  paymentMethodLabel?: string;
  paymentMethodType?: 'bank' | 'credit';
}

export function ChargesTable({ charges, paymentMethodLabel = '', paymentMethodType = 'bank' }: ChargesTableProps) {
  const [editingCharge, setEditingCharge] = useState<ChargeRow | null>(null);
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
                  paddingTop: "var(--spacing-5, 20px)",
                  paddingBottom: "var(--spacing-5, 20px)",
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
                    onClick={() => setEditingCharge(charge)}
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
                  <div className="relative group">
                    <Button
                      variant="outline"
                      className="border-primary text-secondary-foreground hover:bg-primary/5 hover:text-secondary-foreground font-semibold rounded-lg h-10 min-h-10 px-3 lg:px-6"
                    >
                      <IconRefresh />
                      <span className="hidden lg:inline">החלפת אמצעי תשלום</span>
                    </Button>
                    <div className="lg:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      החלפת אמצעי תשלום
                    </div>
                  </div>
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
                      onClick={() => setEditingCharge(charge)}
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
              <IconRefresh />
              החלפת אמצעי תשלום
            </Button>
          </div>
        ))}
      </div>

      {/* Change Charge Day Popup */}
      {editingCharge && (
        <ChangeChargeDayPopup
          isOpen={!!editingCharge}
          onClose={() => setEditingCharge(null)}
          charge={editingCharge}
          charges={charges}
          paymentMethodLabel={paymentMethodLabel}
          paymentMethodType={paymentMethodType}
          onSelectCharge={(c) => setEditingCharge(c)}
        />
      )}
    </div>
  );
}
