'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, AlertTriangle, Info } from 'lucide-react';
import svgPaths from "../../imports/svg-uq5jcfbn1j";
import { Button } from "@/components/ui/button";

function IconAlertInfoBadge() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="#FF9800" />
      <path
        d="M11 5.6c.6 0 1.05.45 1.05 1.05v5.9c0 .6-.45 1.05-1.05 1.05s-1.05-.45-1.05-1.05v-5.9c0-.6.45-1.05 1.05-1.05Z"
        fill="#FFFFFF"
      />
      <circle cx="11" cy="16.2" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}

function ChangeChargeDayAnimatedCheckmark() {
  return (
    <div style={{ width: '120px', height: '120px', position: 'relative' }}>
      <style>{`
        @keyframes circle-draw {
          0% { stroke-dashoffset: 314; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes check-draw {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes circle-fill {
          0% { fill: transparent; }
          100% { fill: rgba(59, 130, 246, 0.08); }
        }
        @keyframes scale-bounce {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti-fall-1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-40px, 60px) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti-fall-2 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(35px, 55px) rotate(-270deg); opacity: 0; }
        }
        @keyframes confetti-fall-3 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-20px, 70px) rotate(180deg); opacity: 0; }
        }
        @keyframes confetti-fall-4 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(45px, 45px) rotate(-360deg); opacity: 0; }
        }
        @keyframes confetti-fall-5 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50px, 40px) rotate(270deg); opacity: 0; }
        }
        @keyframes confetti-fall-6 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(25px, 65px) rotate(-180deg); opacity: 0; }
        }
        .change-day-check-circle {
          stroke-dasharray: 314;
          stroke-dashoffset: 314;
          animation: circle-draw 0.6s ease-out 0.2s forwards, circle-fill 0.4s ease-out 0.7s forwards;
        }
        .change-day-check-mark {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: check-draw 0.4s ease-out 0.7s forwards;
        }
        .change-day-check-container {
          animation: scale-bounce 0.5s ease-out 0.1s both;
        }
        .change-day-confetti-dot { opacity: 0; }
        .change-day-confetti-1 { animation: confetti-fall-1 1s ease-out 1s forwards; }
        .change-day-confetti-2 { animation: confetti-fall-2 1.1s ease-out 1.05s forwards; }
        .change-day-confetti-3 { animation: confetti-fall-3 0.9s ease-out 1.1s forwards; }
        .change-day-confetti-4 { animation: confetti-fall-4 1.2s ease-out 1.02s forwards; }
        .change-day-confetti-5 { animation: confetti-fall-5 1s ease-out 1.08s forwards; }
        .change-day-confetti-6 { animation: confetti-fall-6 1.1s ease-out 1.15s forwards; }
      `}</style>
      <svg width="120" height="120" viewBox="0 0 120 120" className="change-day-check-container">
        <circle className="change-day-check-circle" cx="60" cy="60" r="50" stroke="#3B82F6" strokeWidth="4" fill="transparent" />
        <path className="change-day-check-mark" d="M38 62 L52 76 L82 46" fill="none" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="change-day-confetti-dot change-day-confetti-1" cx="30" cy="20" r="3" fill="#3B82F6" />
        <rect className="change-day-confetti-dot change-day-confetti-2" x="85" y="15" width="6" height="6" rx="1" fill="#CCA559" />
        <circle className="change-day-confetti-dot change-day-confetti-3" cx="15" cy="55" r="2.5" fill="#172554" />
        <rect className="change-day-confetti-dot change-day-confetti-4" x="97" y="50" width="5" height="5" rx="1" fill="#3B82F6" />
        <circle className="change-day-confetti-dot change-day-confetti-5" cx="25" cy="90" r="3" fill="#CCA559" />
        <rect className="change-day-confetti-dot change-day-confetti-6" x="90" y="85" width="6" height="6" rx="1" fill="#172554" />
      </svg>
    </div>
  );
}

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

type ChangeChargeDayOpenRequest = {
  scope: 'all';
};

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

const AVAILABLE_CHARGE_DAYS = [2, 10, 20];

function ChangeChargeDayPopup({
  isOpen,
  onClose,
  charge,
  charges,
  paymentMethodLabel,
  paymentMethodType,
  onSelectCharge,
  defaultAllChargesSelected = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  charge: ChargeRow;
  charges: ChargeRow[];
  paymentMethodLabel: string;
  paymentMethodType: 'bank' | 'credit';
  onSelectCharge: (charge: ChargeRow) => void;
  defaultAllChargesSelected?: boolean;
}) {
  const currentChargeDay = charge.chargeDay ?? AVAILABLE_CHARGE_DAYS[0];
  const [selectedDay, setSelectedDay] = useState<number>(currentChargeDay);
  const [isAllChargesSelected, setIsAllChargesSelected] = useState(false);
  const [isChargeDropdownOpen, setIsChargeDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedDay(charge.chargeDay ?? AVAILABLE_CHARGE_DAYS[0]);
      setIsAllChargesSelected(defaultAllChargesSelected);
      setIsChargeDropdownOpen(false);
      setShowSuccess(false);
    }
  }, [isOpen, charge.id, charge.chargeDay, defaultAllChargesSelected]);

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

  const chargeScopeLabel = isAllChargesSelected ? 'כל החיובים' : chargeLabel;

  const hasChanged = selectedDay !== currentChargeDay;
  const canSubmit = hasChanged;

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
      style={{ backgroundColor: 'rgba(0, 2, 4, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: 'min(1100px, 92vw)',
          height: 'min(900px, 90vh)',
          background: 'linear-gradient(180deg, #F7F8FA 0%, #F7F8FA 100%)',
          borderRadius: '12px',
          border: '1px solid #E5E9F9',
          boxShadow: '0 0 12px rgba(24, 47, 67, 0.08), 0 32px 64px -16px rgba(23, 37, 84, 0.18)',
          overflow: 'hidden',
        }}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header – identical to PurchaseUnitsWizard / AddChildPopup */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)' }}
        >
          <div style={{ width: '36px' }} />
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            lineHeight: '1.3',
            textAlign: 'center',
          }}>
            החלפת יום חיוב
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.04)]"
            style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
            aria-label="סגור"
          >
            <X size={20} style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '32px 40px' }}>
          {showSuccess ? (
            <div className="w-full h-full flex flex-col items-center justify-center" style={{ minHeight: '520px' }}>
              <div style={{ width: '160px', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChangeChargeDayAnimatedCheckmark />
              </div>
              <h3
                style={{
                  marginTop: '10px',
                  fontSize: '22px',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                  textAlign: 'center',
                  lineHeight: '1.3',
                }}
              >
                יום החיוב בחודש השתנה בהצלחה
              </h3>
              <p
                style={{
                  marginTop: '10px',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--muted-foreground)',
                  textAlign: 'center',
                  lineHeight: '22px',
                }}
              >
                החיוב הקרוב המעודכן יתבצע בתאריך{' '}
                <strong style={{ color: 'var(--foreground)' }}>{getNextChargeDate(selectedDay)}</strong>
              </p>
            </div>
          ) : (
            <>
              {/* Dropdowns row */}
              <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '32px' }}>
            {/* Payment method - read-only */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--muted-foreground)',
                marginBottom: '8px',
                textAlign: 'right',
              }}>
                אמצעי תשלום
              </label>
              <div
                className="flex items-center gap-2 h-9 w-full rounded-[6px] px-3.5 py-2 border-border bg-input-background text-foreground"
                style={{ border: '1px solid var(--border)' }}
              >
                {paymentMethodType === 'bank'
                  ? <IconBank size={16} color="var(--muted-foreground)" />
                  : <IconCreditCard size={16} color="var(--muted-foreground)" />
                }
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-normal)',
                  flex: 1,
                  textAlign: 'right',
                }}>
                  {paymentMethodLabel}
                </span>
              </div>
            </div>

            {/* Charge selector dropdown */}
            <div ref={dropdownRef}>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--muted-foreground)',
                marginBottom: '8px',
                textAlign: 'right',
              }}>
                חיוב עבור
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsChargeDropdownOpen(!isChargeDropdownOpen)}
                  className="flex items-center gap-2 transition-colors w-full h-9 rounded-[6px] px-3.5 py-2"
                  style={{
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--input-background)',
                    cursor: 'pointer',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--input-background)'; }}
                >
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}>
                    {chargeScopeLabel}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: 'var(--muted-foreground)',
                      transform: isChargeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {isChargeDropdownOpen && (
                  <div
                    className="absolute z-10 w-full"
                    style={{
                      top: 'calc(100% + 4px)',
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      key="all-charges"
                      onClick={() => {
                        setIsAllChargesSelected(true);
                        setIsChargeDropdownOpen(false);
                      }}
                      className="w-full transition-colors"
                      style={{
                        padding: '10px 14px',
                        textAlign: 'right',
                        fontSize: 'var(--text-sm)',
                        color: isAllChargesSelected ? 'var(--foreground)' : 'var(--muted-foreground)',
                        fontWeight: isAllChargesSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                        backgroundColor: isAllChargesSelected ? '#F0F4FF' : '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                      onMouseEnter={(e) => {
                        if (!isAllChargesSelected) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (!isAllChargesSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      <span>כל החיובים</span>
                    </button>
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
                            setIsAllChargesSelected(false);
                            onSelectCharge(c);
                            setSelectedDay(c.chargeDay ?? AVAILABLE_CHARGE_DAYS[0]);
                            setIsChargeDropdownOpen(false);
                          }}
                          className="w-full transition-colors"
                          style={{
                            padding: '10px 14px',
                            textAlign: 'right',
                            fontSize: 'var(--text-sm)',
                            color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                            fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                            backgroundColor: isActive ? '#F0F4FF' : '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }}
                        >
                          <span>{label}</span>
                          {subtitle && (
                            <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{subtitle}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Day selection – connected pill strip (same as loan request marital status) */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--muted-foreground)',
              marginBottom: '12px',
              textAlign: 'right',
            }}>
              יום חיוב בחודש
            </label>
            {(() => {
              const days = [...AVAILABLE_CHARGE_DAYS];
              if (typeof currentChargeDay === 'number' && !days.includes(currentChargeDay)) {
                days.push(currentChargeDay);
                days.sort((a, b) => a - b);
              }
              const count = days.length;
              return (
                <>
                  {/* Desktop: connected pill strip */}
                  <div className="hidden sm:flex" style={{ direction: 'rtl' }}>
                    {days.map((day, i) => {
                      const selected = selectedDay === day;
                      const isCurrent = day === currentChargeDay;
                      const isFirst = i === 0;
                      const isLast = i === count - 1;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className="inline-flex items-center justify-center gap-2 min-h-[44px] h-11 cursor-pointer transition-all border"
                          style={{
                            fontFamily: 'var(--font-family-base)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                            color: selected ? '#141E44' : 'var(--muted-foreground)',
                            background: '#FFFFFF',
                            borderColor: selected ? '#3B82F6' : 'var(--border)',
                            borderWidth: selected ? '1.5px' : '1px',
                            borderRadius: isFirst ? '0 999px 999px 0' : isLast ? '999px 0 0 999px' : '0',
                            marginRight: isFirst ? 0 : -1,
                            position: 'relative',
                            zIndex: selected ? 1 : 0,
                            boxShadow: selected ? '0 0 12px rgba(59, 130, 246, 0.12)' : 'none',
                            padding: '0 20px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span
                            className="flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0"
                            style={{ border: `2px solid ${selected ? '#3B82F6' : 'var(--border)'}` }}
                          >
                            {selected && <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#3B82F6' }} />}
                          </span>
                          {day} לחודש
                          {isCurrent && <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', marginRight: '2px' }}>(נוכחי)</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile: individual pills */}
                  <div className="flex sm:hidden flex-row gap-2 overflow-x-auto pb-1" dir="rtl">
                    {days.map((day) => {
                      const selected = selectedDay === day;
                      const isCurrent = day === currentChargeDay;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] h-10 px-3 shrink-0 cursor-pointer transition-all"
                          style={{
                            fontFamily: 'var(--font-family-base)',
                            fontSize: '13px',
                            fontWeight: selected ? 600 : 400,
                            color: selected ? '#141E44' : 'var(--muted-foreground)',
                            background: '#FFFFFF',
                            border: `${selected ? '1.5px' : '1px'} solid ${selected ? '#3B82F6' : 'var(--border)'}`,
                            borderRadius: '999px',
                            boxShadow: selected ? '0 0 12px rgba(59, 130, 246, 0.12)' : 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span
                            className="flex items-center justify-center w-4 h-4 rounded-full shrink-0"
                            style={{ border: `2px solid ${selected ? '#3B82F6' : 'var(--border)'}` }}
                          >
                            {selected && <span className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} />}
                          </span>
                          {day} לחודש
                          {isCurrent && <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>(נוכחי)</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Info banners – match provided inspector styles */}
          {hasChanged && (
            <div className="flex flex-col gap-3">
              <div
                className="w-full flex items-center"
                style={{
                  backgroundColor: '#fff3e0',
                  border: '1px solid #ff9800',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  gap: '12px',
                }}
              >
                <p
                  className="min-w-0"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    lineHeight: '20px',
                    fontWeight: 'var(--font-weight-normal)',
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  {isAllChargesSelected ? (
                    <>
                      לאחר אישור השינויים, החל מהחיוב הקרוב, התשלום החודשי עבור כל החיובים תחת האמצעי הנבחר יתבצע ב-
                      <strong>{selectedDay} לחודש</strong>.
                    </>
                  ) : (
                    <>
                      לאחר אישור השינויים, החל מהחיוב הקרוב, התשלום החודשי עבור {chargeScopeLabel} יתבצע ב-
                      <strong>{selectedDay} לחודש</strong>.
                    </>
                  )}
                </p>
                <div className="shrink-0 flex items-center justify-center" style={{ width: 22, height: 22 }}>
                  <IconAlertInfoBadge />
                </div>
              </div>

              <div
                className="w-full flex items-center"
                style={{
                  backgroundColor: '#fff3e0',
                  border: '1px solid #ff9800',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  gap: '12px',
                }}
              >
                <p
                  className="min-w-0"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    lineHeight: '20px',
                    fontWeight: 'var(--font-weight-normal)',
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  לאחר אישור השינויים, החיוב הבא, על סה&quot;כ <strong>{totalMonthlyForCharge}</strong>, יתבצע בתאריך{' '}
                  <strong>{getNextChargeDate(selectedDay)}</strong>.
                </p>
                <div className="shrink-0 flex items-center justify-center" style={{ width: 22, height: 22 }}>
                  <IconAlertInfoBadge />
                </div>
              </div>
            </div>
          )}
              </>
          )}
        </div>

        {/* Footer – identical to AddChildPopup / PurchaseUnitsWizard */}
        <div
          className="shrink-0 w-full"
          style={{ padding: '20px 40px 30px 40px' }}
        >
          <button
            disabled={!showSuccess && !canSubmit}
            className="w-full inline-flex items-center justify-center transition-all"
            style={{
              height: '48px',
              padding: '0 24px',
              borderRadius: 'var(--radius-button)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: (showSuccess || canSubmit) ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              backgroundColor: (showSuccess || canSubmit) ? 'var(--primary)' : 'var(--muted)',
              border: 'none',
              cursor: (showSuccess || canSubmit) ? 'pointer' : 'not-allowed',
              opacity: (showSuccess || canSubmit) ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (showSuccess || canSubmit) e.currentTarget.style.backgroundColor = '#0F1A3E';
            }}
            onMouseLeave={(e) => {
              if (showSuccess || canSubmit) e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
            onClick={() => {
              if (showSuccess) {
                onClose();
                return;
              }
              if (!canSubmit) return;
              setShowSuccess(true);
            }}
          >
            {showSuccess ? 'סגירה' : 'אישור'}
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
  openChangeChargeDayAllCharges?: boolean;
  onCloseChangeChargeDayAllCharges?: () => void;
}

export function ChargesTable({
  charges,
  paymentMethodLabel = '',
  paymentMethodType = 'bank',
  openChangeChargeDayAllCharges,
  onCloseChangeChargeDayAllCharges,
}: ChargesTableProps) {
  const [editingCharge, setEditingCharge] = useState<ChargeRow | null>(null);

  useEffect(() => {
    if (openChangeChargeDayAllCharges) {
      setEditingCharge(charges[0] ?? null);
    }
  }, [openChangeChargeDayAllCharges, charges]);

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
          onClose={() => {
            setEditingCharge(null);
            onCloseChangeChargeDayAllCharges?.();
          }}
          charge={editingCharge}
          charges={charges}
          paymentMethodLabel={paymentMethodLabel}
          paymentMethodType={paymentMethodType}
          onSelectCharge={(c) => setEditingCharge(c)}
          defaultAllChargesSelected={!!openChangeChargeDayAllCharges}
        />
      )}
    </div>
  );
}
