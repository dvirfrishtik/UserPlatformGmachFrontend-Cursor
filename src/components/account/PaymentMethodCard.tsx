'use client';

import { useState, useRef, useEffect } from "react";
import svgPathsBank from "../../imports/svg-gu3atsm2x8";
import svgPathsCard from "../../imports/svg-ghcztcsik0";
import svgPathsRefresh from "../../imports/svg-uq5jcfbn1j";
import IconOutlineEllipsisVertical from "../../imports/IconOutlineEllipsisVertical";

function IconOutlineBank() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPathsBank.pc548680} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
      <path d={svgPathsBank.p9cc3480} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
      <path d={svgPathsBank.p363d500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
      <path d={svgPathsBank.p10ea2300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
    </svg>
  );
}

function IconOutlineCreditCard() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d={svgPathsCard.p3bcd8300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M10 16H11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
      <path d="M14.5 16H18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
      <path d="M2 9H22" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className={className}>
      <path clipRule="evenodd" d={svgPathsBank.p3d44a900} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d="M8.25825 10C8.25825 10.9665 9.03342 11.7417 9.99992 11.7417C10.9664 11.7417 11.7416 10.9665 11.7416 10C11.7416 9.03354 10.9664 8.25837 9.99992 8.25837C9.03342 8.25837 8.25825 9.03354 8.25825 10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
      <path d="M9.99992 15.8916C12.9416 15.8916 15.6833 14.1583 17.5916 11.1583C18.3416 9.98326 18.3416 8.00826 17.5916 6.83326C15.6833 3.83326 12.9416 2.09993 9.99992 2.09993C7.05825 2.09993 4.31659 3.83326 2.40825 6.83326C1.65825 8.00826 1.65825 9.98326 2.40825 11.1583C4.31659 14.1583 7.05825 15.8916 9.99992 15.8916Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d={svgPathsRefresh.p16638f80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

interface PaymentMethodCardProps {
  bankName: string;
  lastFourDigits: string;
  monthlyCharge: string;
  nextChargeDate: string;
  activeChargesCount?: number;
  isSelected?: boolean;
  onDetailsClick?: () => void;
  hasAnySelected?: boolean;
  paymentType?: "bank" | "credit-card";
  paymentMethodId?: number;
  onTransferAllCharges?: (paymentMethodId: number) => void;
}

export function PaymentMethodCard({
  bankName,
  lastFourDigits,
  monthlyCharge,
  nextChargeDate,
  activeChargesCount,
  isSelected = false,
  onDetailsClick,
  hasAnySelected = false,
  paymentType = "bank",
  paymentMethodId = 1,
  onTransferAllCharges,
}: PaymentMethodCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    onDetailsClick?.();
  };

  const handleMenuAction = (action: string) => {
    setIsMenuOpen(false);
    if (action === "change-payment" && onTransferAllCharges) {
      onTransferAllCharges(paymentMethodId);
    }
  };

  const cardOpacity = isSelected || isHovered || !hasAnySelected ? 1 : 0.5;

  useEffect(() => {
    const currentRef = menuRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="bg-page-section flex flex-col items-start w-full transition-all"
      style={{
        borderRadius: "var(--radius-card)",
        border: isSelected ? "1px solid var(--muted-foreground)" : "1px solid var(--border)",
        opacity: cardOpacity,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Section */}
      <div
        className="flex flex-col items-start justify-start w-full"
        style={{
          gap: "var(--spacing-6, 24px)",
          padding: "var(--spacing-6, 24px)",
        }}
      >
        {/* Bank Badge */}
        <div className="flex items-center justify-between w-full">
          <div
            className="bg-primary text-primary-foreground flex items-center justify-start shrink-0"
            style={{
              gap: "var(--spacing-2, 8px)",
              paddingLeft: "var(--spacing-4, 16px)",
              paddingRight: "var(--spacing-4, 16px)",
              paddingTop: "var(--spacing-2, 8px)",
              paddingBottom: "var(--spacing-2, 8px)",
              borderRadius: "9999px",
            }}
          >
            {paymentType === "bank" ? <IconOutlineBank /> : <IconOutlineCreditCard />}
            <p
              className="text-right whitespace-nowrap"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-bold)",
                lineHeight: "18px",
              }}
            >
              {bankName} {lastFourDigits}
            </p>
          </div>

          {/* More Menu */}
          {(isSelected || isHovered) && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center justify-center"
                style={{ width: "32px", height: "32px", borderRadius: "var(--radius-md, 6px)" }}
              >
                <IconOutlineEllipsisVertical />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute bg-card border-border shadow-lg z-50"
                  style={{
                    top: "calc(100% + 4px)",
                    left: "0",
                    minWidth: "220px",
                    borderRadius: "var(--radius-lg, 8px)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--elevation-sm)",
                  }}
                  dir="rtl"
                  ref={menuRef}
                >
                  <div className="flex flex-col" style={{ padding: "var(--spacing-1, 4px)" }}>
                    <button
                      onClick={() => handleMenuAction("view-details")}
                      className="text-foreground hover:bg-muted/60 text-right transition-colors w-full flex items-center justify-start gap-3"
                      style={{
                        padding: "var(--spacing-3, 12px) var(--spacing-4, 16px)",
                        borderRadius: "var(--radius-md, 6px)",
                        fontSize: "var(--text-base)",
                        fontWeight: "var(--font-weight-normal)",
                        lineHeight: "20px",
                      }}
                    >
                      <div className="flex items-center justify-center shrink-0" style={{ width: "20px", height: "20px" }}>
                        <IconEye />
                      </div>
                      <span>צפייה בפירוט תנועות</span>
                    </button>
                    <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "var(--spacing-1, 4px) 0" }} />
                    <button
                      onClick={() => handleMenuAction("change-payment")}
                      className="text-foreground hover:bg-muted/60 text-right transition-colors w-full flex items-center justify-start gap-3"
                      style={{
                        padding: "var(--spacing-3, 12px) var(--spacing-4, 16px)",
                        borderRadius: "var(--radius-md, 6px)",
                        fontSize: "var(--text-base)",
                        fontWeight: "var(--font-weight-normal)",
                        lineHeight: "20px",
                      }}
                    >
                      <div className="flex items-center justify-center shrink-0" style={{ width: "20px", height: "20px" }}>
                        <IconRefresh />
                      </div>
                      <span>העברת כלל החיובים לאמצעי אחר</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-start justify-start w-full" style={{ gap: "var(--spacing-8, 32px)" }}>
          <div className="flex flex-col items-start justify-start self-start" style={{ gap: "var(--spacing-0-5, 2px)" }}>
            <p className="text-right whitespace-nowrap" style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-bold)", lineHeight: "24px" }}>
              {monthlyCharge}
            </p>
            <p className="text-muted-foreground text-right whitespace-nowrap" style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-normal)", lineHeight: "16px" }}>
              חיוב חודשי לבנק
            </p>
          </div>
          {activeChargesCount !== undefined && (
            <div className="flex flex-col items-start justify-start self-start" style={{ gap: "var(--spacing-0-5, 2px)" }}>
              <p className="text-foreground text-right whitespace-nowrap" style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-bold)", lineHeight: "24px" }}>
                {activeChargesCount}
              </p>
              <p className="text-muted-foreground text-right whitespace-nowrap" style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-normal)", lineHeight: "16px" }}>
                חיובים פעילים
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Details Button */}
      <button
        onClick={handleToggle}
        className={`flex items-center justify-start w-full transition-colors ${
          isSelected
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "bg-card hover:bg-muted"
        }`}
        style={{
          borderTop: "1px solid var(--border)",
          borderBottomLeftRadius: "var(--radius-card)",
          borderBottomRightRadius: "var(--radius-card)",
          paddingLeft: "var(--spacing-6, 24px)",
          paddingRight: "var(--spacing-6, 24px)",
          paddingTop: "var(--spacing-4, 16px)",
          paddingBottom: "var(--spacing-4, 16px)",
          gap: "var(--spacing-1, 4px)",
        }}
      >
        <p
          className={`text-right whitespace-nowrap ${isSelected ? "text-primary-foreground" : "text-primary"}`}
          style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-bold)", lineHeight: "20px" }}
        >
          פירוט חיובים
        </p>
        <IconChevronDown className={`transition-transform ${isSelected ? "text-primary-foreground rotate-180" : "text-primary"}`} />
      </button>
    </div>
  );
}
