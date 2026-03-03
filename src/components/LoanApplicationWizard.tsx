'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronDown, ChevronLeft, AlertTriangle, Info, Check, ExternalLink, User, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MARITAL_OPTIONS = [
  { value: 'married', label: 'נשוי' },
  { value: 'engaged', label: 'מאורס' },
  { value: 'single', label: 'רווק' },
  { value: 'divorced', label: 'גרוש' },
  { value: 'widowed', label: 'אלמן' },
] as const;

const WIZARD_STEPS = [
  { id: 1, label: 'פרטי הלווה' },
  { id: 2, label: 'פרטי ההלוואה' },
  { id: 3, label: 'הגדרת ערבים' },
  { id: 4, label: 'פרטי התקשרות' },
  { id: 5, label: 'סיכום והגשה' },
] as const;

const RELATIONSHIP_OPTIONS = [
  { value: '', label: 'בחירת קרבה' },
  { value: 'parent', label: 'הורה' },
  { value: 'grandparent', label: 'סבים' },
  { value: 'uncle', label: 'דוד/דודה' },
  { value: 'other', label: 'אחר' },
];

/** ילדים + יחידות תרומה למימוש – תואם לנתוני דף יחידות תרומה */
export interface ChildForLoan {
  id: string;
  name: string;
  unitsCount: number;
}

const DEFAULT_CHILDREN_FOR_LOAN: ChildForLoan[] = [
  { id: 'child1', name: 'שמחה', unitsCount: 4 },
  { id: 'child2', name: 'דוד משה', unitsCount: 4 },
  { id: 'child3', name: 'יוני שמעון', unitsCount: 3 },
  { id: 'child4', name: 'חיים יעקב', unitsCount: 2 },
  { id: 'child5', name: 'יניב אהרון', unitsCount: 8 },
  { id: 'child6', name: 'מיכל שולמית', unitsCount: 4 },
];

export interface LoanWizardStep1Data {
  fullName: string;
  idNumber: string;
  birthDate: string;
  selectedChildId: string;
  phone: string;
  email: string;
  relationship: string;
  maritalStatus: string;
  spouseFullName: string;
  spouseIdNumber: string;
  spouseBirthDate: string;
  spousePhone: string;
  spouseEmail: string;
}

export interface DonationUnit {
  id: string;
  unitNumber: number;
  year: number;
  loanEntitlement: number;
  forName: string;
  fullyDonated: boolean;
  /** קבוצה: 'borrower' – יחידות שנתרמו עבור הלווה, 'additional' – יחידות נוספות */
  group: 'borrower' | 'additional';
}

const DEFAULT_DONATION_UNITS: DonationUnit[] = [
  { id: 'u5', unitNumber: 5, year: 2024, loanEntitlement: 40000, forName: 'שולמית אביה', fullyDonated: true, group: 'borrower' },
  { id: 'u6', unitNumber: 6, year: 2024, loanEntitlement: 40000, forName: 'שולמית אביה', fullyDonated: true, group: 'borrower' },
  { id: 'u7', unitNumber: 7, year: 2024, loanEntitlement: 40000, forName: 'שולמית אביה', fullyDonated: true, group: 'borrower' },
  { id: 'u8', unitNumber: 8, year: 2024, loanEntitlement: 40000, forName: 'שולמית אביה', fullyDonated: true, group: 'borrower' },
  { id: 'u9', unitNumber: 9, year: 2024, loanEntitlement: 40000, forName: 'שולמית אביה', fullyDonated: true, group: 'borrower' },
  { id: 'u10', unitNumber: 10, year: 2024, loanEntitlement: 40000, forName: 'שולמית אביה', fullyDonated: true, group: 'borrower' },
  { id: 'u11', unitNumber: 11, year: 2024, loanEntitlement: 40000, forName: 'דוד משה', fullyDonated: true, group: 'additional' },
  { id: 'u12', unitNumber: 12, year: 2024, loanEntitlement: 40000, forName: 'דוד משה', fullyDonated: true, group: 'additional' },
  { id: 'u13', unitNumber: 13, year: 2024, loanEntitlement: 40000, forName: 'יוני שמעון', fullyDonated: true, group: 'additional' },
  { id: 'u14', unitNumber: 14, year: 2024, loanEntitlement: 40000, forName: 'חיים יעקב', fullyDonated: true, group: 'additional' },
];

export interface LoanWizardStep2Data {
  loanPurpose: 'wedding' | 'apartment' | 'other' | '';
  selectedUnitIds: string[];
}

const LOAN_PURPOSE_OPTIONS = [
  { value: 'wedding' as const, label: 'חתונה', icon: '/icons/wedding.svg' },
  { value: 'apartment' as const, label: 'רכישת דירה', icon: '/icons/apartment.svg' },
  { value: 'other' as const, label: 'אחר', icon: '/icons/other.svg' },
];

const emptyStep2: LoanWizardStep2Data = {
  loanPurpose: '',
  selectedUnitIds: [],
};

export interface GuarantorData {
  firstName: string;
  lastName: string;
  idNumber: string;
  city: string;
  street: string;
  buildingNumber: string;
  workplace: string;
  role: string;
  relationship: string;
  phone: string;
  email: string;
  maritalStatus: string;
  isSaved: boolean;
}

const MARITAL_STATUS_OPTIONS = [
  { value: '', label: 'בחירה' },
  { value: 'single', label: 'רווק' },
  { value: 'married', label: 'נשוי' },
  { value: 'divorced', label: 'גרוש' },
  { value: 'widowed', label: 'אלמן' },
];

const CITY_OPTIONS = [
  { value: '', label: 'בחירת עיר' },
  { value: 'jerusalem', label: 'ירושלים' },
  { value: 'tel-aviv', label: 'תל אביב' },
  { value: 'haifa', label: 'חיפה' },
  { value: 'beer-sheva', label: 'באר שבע' },
  { value: 'bnei-brak', label: 'בני ברק' },
  { value: 'other', label: 'אחר' },
];

const emptyGuarantor: GuarantorData = {
  firstName: '',
  lastName: '',
  idNumber: '',
  city: '',
  street: '',
  buildingNumber: '',
  workplace: '',
  role: '',
  relationship: '',
  phone: '',
  email: '',
  maritalStatus: '',
  isSaved: false,
};

function createEmptyGuarantors(count: number): GuarantorData[] {
  return Array.from({ length: count }, () => ({ ...emptyGuarantor }));
}

export interface LoanWizardStep4Data {
  contactMethod: 'borrower_email' | 'donor_email' | 'borrower_fax' | 'other';
  borrowerEmail: string;
}

const CONTACT_METHOD_OPTIONS: { value: LoanWizardStep4Data['contactMethod']; label: string }[] = [
  { value: 'borrower_email', label: 'למייל של הלווה' },
  { value: 'donor_email', label: 'למייל של התורם' },
  { value: 'borrower_fax', label: 'לפקס של הלווה' },
  { value: 'other', label: 'אחר' },
];

const emptyStep4: LoanWizardStep4Data = {
  contactMethod: 'borrower_email',
  borrowerEmail: '',
};

interface LoanApplicationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onExitAndSave?: () => void;
  /** רשימת ילדים + יחידות למימוש (מתאימה לדף יחידות תרומה). אם לא מועבר – משתמשים ברשימה ברירת מחדל. */
  childrenForLoan?: ChildForLoan[];
}

const emptyStep1: LoanWizardStep1Data = {
  fullName: '',
  idNumber: '',
  birthDate: '',
  selectedChildId: '',
  phone: '',
  email: '',
  relationship: '',
  maritalStatus: '',
  spouseFullName: '',
  spouseIdNumber: '',
  spouseBirthDate: '',
  spousePhone: '',
  spouseEmail: '',
};

export function LoanApplicationWizard({ isOpen, onClose, onExitAndSave, childrenForLoan = DEFAULT_CHILDREN_FOR_LOAN }: LoanApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [step1, setStep1] = useState<LoanWizardStep1Data>(emptyStep1);
  const [step2, setStep2] = useState<LoanWizardStep2Data>(emptyStep2);
  const [guarantors, setGuarantors] = useState<GuarantorData[]>(() => createEmptyGuarantors(5));
  const [step4, setStep4] = useState<LoanWizardStep4Data>(emptyStep4);

  if (!isOpen) return null;

  /** ניווט רק לשלבים שכבר בוצעו או שהם כרגע במילוי */
  const canNavigateToStep = (stepId: number) => stepId <= currentStep;

  const handleContinue = () => {
    if (currentStep < 5) {
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      onExitAndSave?.();
      onClose();
    }
  };

  const handleExitAndSave = () => {
    onExitAndSave?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ backgroundColor: '#FAFAFA', direction: 'rtl' }}
      dir="rtl"
    >
      {/* ─── Header – זהה למסך המקדים ─── */}
      <header
        className="flex flex-row justify-between items-center shrink-0 px-4 py-3 min-h-[56px] md:min-h-[72px] md:px-[38px] md:py-4"
        style={{
          background: '#F8FAFC',
          borderBottom: '1px solid #E8EDF2',
          boxShadow: '9.53704px 7.80303px 43.3502px rgba(33, 132, 213, 0.1)',
        }}
      >
        <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1" style={{ textAlign: 'right' }}>
          <span
            className="text-base md:text-xl font-bold truncate"
            style={{ fontFamily: 'SimplerPro', color: '#172554' }}
          >
            תהליך בקשת הלוואה
          </span>
          <span
            className="text-xs md:text-sm"
            style={{ fontFamily: 'SimplerPro', fontWeight: 400, color: '#495157' }}
          >
            עבור ילד/ה או קרוב/ה
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.06)]"
          style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
          aria-label="סגור"
        >
          <X size={20} style={{ color: '#495157' }} />
        </button>
      </header>

      {/* ─── Body: sidebar נמשך עד למטה, תוכן + פוטר לצידו ─── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ── Wizard Sidebar – כחול כהה, full height ── */}
        <aside
          className="hidden md:flex flex-col shrink-0 py-10 px-5"
          style={{
            width: '200px',
            background: 'linear-gradient(196.765deg, rgb(23, 37, 84) 0%, rgb(7, 13, 35) 100%)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex flex-col">
            {WIZARD_STEPS.map((step, index) => {
              const active = step.id === currentStep;
              const completed = step.id < currentStep;
              const clickable = canNavigateToStep(step.id);
              const filled = active || completed;
              const isLast = index === WIZARD_STEPS.length - 1;

              return (
                <div key={step.id} className="flex flex-col">
                  <div className="flex flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => clickable && setCurrentStep(step.id)}
                      disabled={!clickable}
                      className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 border-0 transition-colors"
                      style={{
                        background: filled ? '#CCA559' : 'rgba(255,255,255,0.1)',
                        color: filled ? '#172554' : 'rgba(255,255,255,0.4)',
                        fontWeight: 700,
                        fontSize: '14px',
                        fontFamily: 'SimplerPro',
                        cursor: clickable ? 'pointer' : 'default',
                      }}
                    >
                      {String(step.id).padStart(2, '0')}
                    </button>
                    <span
                      style={{
                        fontFamily: 'SimplerPro',
                        fontWeight: active ? 700 : 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: active ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                        cursor: clickable ? 'pointer' : 'default',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: 0,
                        height: 32,
                        marginRight: 19,
                        marginTop: 6,
                        marginBottom: 6,
                        borderRight: `2px dashed ${completed ? '#CCA559' : 'rgba(255,255,255,0.15)'}`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Right side: content area + info panel + footer stacked ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 flex min-w-0 min-h-0 overflow-hidden relative">
            {/* Center – Form (animated step content) */}
            <div className="flex-1 min-w-0 overflow-y-auto py-8 px-6 md:px-12 lg:px-16">
              {/* Mobile step indicator */}
              <div className="md:hidden flex flex-row items-center gap-2 mb-5" style={{ justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'SimplerPro', fontSize: '12px', color: '#9CA3AF' }}>
                  שלב {currentStep} מתוך 5
                </span>
                <span style={{ fontFamily: 'SimplerPro', fontWeight: 600, fontSize: '14px', color: '#172554' }}>
                  {WIZARD_STEPS[currentStep - 1]?.label}
                </span>
              </div>

              <div key={currentStep} className="wizard-step-enter">
                {currentStep === 1 && (
                  <Step1Form step1={step1} setStep1={setStep1} childrenForLoan={childrenForLoan} />
                )}
                {currentStep === 2 && (
                  <Step2Form step2={step2} setStep2={setStep2} />
                )}
                {currentStep === 3 && (
                  <Step3Form guarantors={guarantors} setGuarantors={setGuarantors} />
                )}
                {currentStep === 4 && (
                  <Step4Form step4={step4} setStep4={setStep4} />
                )}
                {currentStep > 4 && (
                  <div
                    className="flex-1 flex items-center justify-center h-full"
                    style={{ color: '#9CA3AF', fontFamily: 'SimplerPro' }}
                  >
                    שלב {currentStep} – בהמשך יוטמע
                  </div>
                )}
              </div>
            </div>

            {/* ── Info Panel – קופסה צפה דבוקה לשמאל (לא מוצג בשלב פרטי התקשרות) ── */}
            {currentStep !== 4 && (
              <div
                className="hidden lg:block absolute top-8 bottom-8"
                style={{ left: 24 }}
              >
                <div
                  className="rounded-xl overflow-hidden flex flex-col h-full"
                  style={{
                    width: '280px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E9F9',
                    boxShadow: '0 4px 24px rgba(14, 78, 134, 0.08)',
                  }}
                >
                  {currentStep === 1 && <Step1InfoPanelContent />}
                  {currentStep === 2 && <Step2InfoPanelContent />}
                  {currentStep === 3 && <Step3InfoPanelContent />}
                  {currentStep > 4 && <Step1InfoPanelContent />}
                </div>
              </div>
            )}
          </div>

          {/* ─── Footer – בתוך אזור התוכן, לא חוצה את ה-sidebar ─── */}
          <footer
            className="flex flex-row items-center justify-between shrink-0 px-6 md:px-10 py-4"
            style={{
              background: 'var(--card)',
              borderTop: '1px solid var(--border)',
              minHeight: '72px',
            }}
          >
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg font-semibold cursor-pointer transition-all hover:bg-[rgba(0,0,0,0.03)]"
              style={{
                fontFamily: 'SimplerPro',
                fontSize: 'var(--text-base)',
                color: 'var(--primary)',
                background: 'transparent',
                border: '1.5px solid var(--primary)',
              }}
            >
              חזרה לשלב הקודם
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center h-11 px-8 rounded-lg font-semibold border-0 cursor-pointer transition-opacity hover:opacity-90"
              style={{
                fontFamily: 'SimplerPro',
                fontSize: 'var(--text-base)',
                color: 'var(--primary-foreground)',
                background: 'var(--primary)',
              }}
            >
              המשך לשלב הבא
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

/* ─── פופאפ: בחירת לווה אחר – אישור מיוחד (גודל וסגנון כמו שאר הפופאפים) ─── */
function OtherBorrowerApprovalPopup({
  isOpen,
  onClose,
  onProceed,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 2, 4, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      dir="rtl"
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header – זהה להוספת ילד/ה ורכישת יחידות */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid #E5E9F9',
          }}
        >
          <div style={{ width: '36px' }} />
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'var(--font-weight-bold)',
              color: '#141E44',
              lineHeight: '1.3',
              textAlign: 'center',
            }}
          >
            הוספת לווה אחר
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.04)]"
            style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
            aria-label="סגור"
          >
            <X size={20} style={{ color: '#495157' }} />
          </button>
        </div>

        {/* תוכן ממורכז */}
        <div
          className="flex-1 flex flex-col items-center justify-center overflow-y-auto"
          style={{ padding: '32px 40px' }}
        >
          <div className="flex flex-col items-center text-center max-w-[560px]">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full shrink-0 mb-6"
              style={{ background: 'rgba(23, 37, 84, 0.08)' }}
            >
              <AlertTriangle size={32} style={{ color: 'var(--primary)' }} strokeWidth={2} />
            </div>
            <h3
              className="mb-4"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#141E44',
                lineHeight: 1.35,
              }}
            >
              הוספת לווה שלא נתרמו עבורו יחידות דורשת אישור מיוחד
            </h3>
            <p
              className="mb-3"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
              }}
            >
              בקשת הלוואה עבור לווה עבורו לא נתרמו יחידות, מחייבת בדיקה ואישור מיוחד של הגמ"ח.
            </p>
            <p
              className="mb-8"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
              }}
            >
              המשך התהליך תלוי באישור הגמ"ח ועשוי להאריך משמעותית את זמן הטיפול בבקשה.
            </p>
          </div>
        </div>

        {/* פוטר כפתורים – ממורכזים */}
        <div
          className="flex flex-row-reverse justify-center gap-3 shrink-0"
          style={{
            padding: '20px 32px 24px',
            borderTop: '1px solid #E5E9F9',
          }}
        >
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-95"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'var(--text-sm)',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-button)',
            }}
          >
            הבנתי, ואני רוצה להמשיך
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-medium transition-colors border hover:bg-[rgba(0,0,0,0.02)]"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'var(--text-sm)',
              backgroundColor: '#fff',
              color: '#141E44',
              borderColor: '#E5E9F9',
              cursor: 'pointer',
              borderRadius: 'var(--radius-button)',
            }}
          >
            חזרה אחורה
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── פופאפ: מימוש יחידות תרומה שלא נועדו עבור הלווה ─── */
function UnitNotForBorrowerPopup({
  isOpen,
  onClose,
  onProceed,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 2, 4, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      dir="rtl"
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
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid #E5E9F9',
          }}
        >
          <div style={{ width: '36px' }} />
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'var(--font-weight-bold)',
              color: '#141E44',
              lineHeight: '1.3',
              textAlign: 'center',
            }}
          >
            מימוש יחידות תרומה שלא נועדו עבור הלווה
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.04)]"
            style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
            aria-label="סגור"
          >
            <X size={20} style={{ color: '#495157' }} />
          </button>
        </div>

        <div
          className="flex-1 flex flex-col items-center justify-center overflow-y-auto"
          style={{ padding: '32px 40px' }}
        >
          <div className="flex flex-col items-center text-center max-w-[560px]">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full shrink-0 mb-6"
              style={{ background: 'rgba(23, 37, 84, 0.08)' }}
            >
              <AlertTriangle size={32} style={{ color: 'var(--primary)' }} strokeWidth={2} />
            </div>
            <h3
              className="mb-4 text-right w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#141E44',
                lineHeight: 1.35,
              }}
            >
              מימוש יחידות תרומה שלא נועדו עבור הלווה
              <br />
              דורשות אישור מיוחד
            </h3>
            <p
              className="mb-3 text-right w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
              }}
            >
              בקשת הלוואה מכוח תרומת יחידה שלא נועדה עבור הלווה המבוקש מחייבת בדיקה ואישור מיוחד של הגמ"ח.
            </p>
            <p
              className="mb-8 text-right w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
              }}
            >
              המשך התהליך תלוי באישור הגמ"ח ועשוי להאריך משמעותית את זמן הטיפול בבקשה.
            </p>
          </div>
        </div>

        <div
          className="flex flex-row-reverse justify-center gap-3 shrink-0"
          style={{
            padding: '20px 32px 24px',
            borderTop: '1px solid #E5E9F9',
          }}
        >
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-95"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'var(--text-sm)',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-button)',
            }}
          >
            הבנתי, ואני רוצה להמשיך
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-medium transition-colors border hover:bg-[rgba(0,0,0,0.02)]"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'var(--text-sm)',
              backgroundColor: '#fff',
              color: '#141E44',
              borderColor: '#E5E9F9',
              cursor: 'pointer',
              borderRadius: 'var(--radius-button)',
            }}
          >
            חזרה אחורה
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: פרטי הלווה ─── */
function Step1Form({
  step1,
  setStep1,
  childrenForLoan,
}: {
  step1: LoanWizardStep1Data;
  setStep1: React.Dispatch<React.SetStateAction<LoanWizardStep1Data>>;
  childrenForLoan: ChildForLoan[];
}) {
  const [showOtherBorrowerPopup, setShowOtherBorrowerPopup] = useState(false);
  const [otherBorrowerApproved, setOtherBorrowerApproved] = useState(false);

  const handleFullNameChange = (v: string) => {
    const match = childrenForLoan.find((c) => c.name === v.trim());
    setStep1((p) => ({
      ...p,
      fullName: v,
      selectedChildId: match ? match.id : '',
    }));
  };

  const isNameInList = step1.fullName.trim() && childrenForLoan.some((c) => c.name === step1.fullName.trim());
  const handleIdNumberFocus = () => {
    if (step1.fullName.trim() && !isNameInList && !otherBorrowerApproved) {
      setShowOtherBorrowerPopup(true);
    }
  };

  const handleOtherBorrowerProceed = () => {
    setShowOtherBorrowerPopup(false);
    setOtherBorrowerApproved(true);
  };

  return (
    <>
      <OtherBorrowerApprovalPopup
        isOpen={showOtherBorrowerPopup}
        onClose={() => setShowOtherBorrowerPopup(false)}
        onProceed={handleOtherBorrowerProceed}
      />
      <h2
        style={{
          fontFamily: 'var(--font-family-base)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--text-xl)',
          color: 'var(--primary)',
          lineHeight: 1.3,
          textAlign: 'right',
          marginBottom: 32,
        }}
      >
        פרטי הלווה
      </h2>

      <div className="flex flex-col gap-5 max-w-[720px] w-full">
        {/* Row 1: שם מלא (עם דרופדאון ילדים) | ת.ז. | תאריך לידה */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FullNameWithChildDropdown
            label="שם מלא"
            value={step1.fullName}
            selectedChildId={step1.selectedChildId}
            onChange={handleFullNameChange}
            onSelectChild={(id) => setStep1((p) => ({ ...p, selectedChildId: id }))}
            childrenForLoan={childrenForLoan}
            placeholder="הזן שם מלא"
          />
          <WizardInput
            label="ת.ז."
            value={step1.idNumber}
            onChange={(v) => setStep1((p) => ({ ...p, idNumber: v }))}
            onFocus={handleIdNumberFocus}
            placeholder="מספר ת.ז."
          />
          <WizardInput
            label="תאריך לידה"
            type="date"
            value={step1.birthDate}
            onChange={(v) => setStep1((p) => ({ ...p, birthDate: v }))}
          />
        </div>

        {/* Row 2: טלפון | אימייל | הקשר שלי ללווה */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <WizardInput
            label="טלפון"
            value={step1.phone}
            onChange={(v) => setStep1((p) => ({ ...p, phone: v }))}
            placeholder="מס׳ טלפון"
          />
          <WizardInput
            label="אימייל"
            type="email"
            value={step1.email}
            onChange={(v) => setStep1((p) => ({ ...p, email: v }))}
            placeholder="דוא״ל"
          />
          <WizardSelect
            label="הקשר שלי ללווה"
            value={step1.relationship}
            onChange={(v) => setStep1((p) => ({ ...p, relationship: v }))}
            options={RELATIONSHIP_OPTIONS}
          />
        </div>

        {/* ─── מצב אישי של הלווה ─── */}
        <div className="mt-4">
          <label
            className="block mb-3"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--muted-foreground)',
              textAlign: 'right',
            }}
          >
            מצב אישי של הלווה
          </label>
          <div className="grid grid-cols-5 gap-0">
            {MARITAL_OPTIONS.map((opt, i) => {
              const selected = step1.maritalStatus === opt.value;
              const isFirst = i === 0;
              const isLast = i === MARITAL_OPTIONS.length - 1;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStep1((p) => ({ ...p, maritalStatus: opt.value }))}
                  className="inline-flex items-center justify-center gap-2 h-11 cursor-pointer transition-all border"
                  style={{
                    fontFamily: 'var(--font-family-base)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    color: selected ? 'var(--primary)' : 'var(--muted-foreground)',
                    background: selected ? '#EFF6FF' : 'var(--card)',
                    borderColor: selected ? 'var(--primary)' : 'var(--border)',
                    borderRadius: isFirst ? '0 8px 8px 0' : isLast ? '8px 0 0 8px' : '0',
                    marginRight: isFirst ? 0 : -1,
                    position: 'relative',
                    zIndex: selected ? 1 : 0,
                  }}
                >
                  <span
                    className="flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0"
                    style={{
                      border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >
                    {selected && (
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: 'var(--primary)' }}
                      />
                    )}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── פרטי בת/בן זוג / מאורסת (מוצג כשנשוי או מאורס) ─── */}
        {(step1.maritalStatus === 'married' || step1.maritalStatus === 'engaged') && (
          <div
            className="rounded-xl px-6 py-6 mt-2"
            style={{
              background: '#F1F5F9',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              className="mb-5"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--text-base)',
                color: 'var(--primary)',
                textAlign: 'right',
              }}
            >
              {step1.maritalStatus === 'married' ? 'פרטי בת הזוג של הלווה' : 'פרטי המאורסת של הלווה'}
            </h3>
            <div className="flex flex-col gap-4">
              {/* Row: שם מלא | ת.ז. | תאריך לידה */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <WizardInput
                  label="שם מלא"
                  value={step1.spouseFullName}
                  onChange={(v) => setStep1((p) => ({ ...p, spouseFullName: v }))}
                  placeholder="שם מלא"
                />
                <WizardInput
                  label="ת.ז."
                  value={step1.spouseIdNumber}
                  onChange={(v) => setStep1((p) => ({ ...p, spouseIdNumber: v }))}
                  placeholder="מספר ת.ז."
                />
                <WizardInput
                  label="תאריך לידה"
                  type="date"
                  value={step1.spouseBirthDate}
                  onChange={(v) => setStep1((p) => ({ ...p, spouseBirthDate: v }))}
                />
              </div>
              {/* Row: טלפון | אימייל */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WizardInput
                  label="טלפון"
                  value={step1.spousePhone}
                  onChange={(v) => setStep1((p) => ({ ...p, spousePhone: v }))}
                  placeholder="מס׳ טלפון"
                />
                <WizardInput
                  label="אימייל"
                  type="email"
                  value={step1.spouseEmail}
                  onChange={(v) => setStep1((p) => ({ ...p, spouseEmail: v }))}
                  placeholder="דוא״ל"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── שם מלא + אוטוקומפליט ילדים ─── */
function FullNameWithChildDropdown({
  label,
  value,
  selectedChildId,
  onChange,
  onSelectChild,
  childrenForLoan,
  placeholder,
}: {
  label: string;
  value: string;
  selectedChildId: string;
  onChange: (v: string) => void;
  onSelectChild: (id: string) => void;
  childrenForLoan: ChildForLoan[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const query = value.trim();
  const filteredOptions = query
    ? childrenForLoan.filter((c) => c.name.includes(query))
    : childrenForLoan;
  const showDropdown = isOpen && filteredOptions.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleFocus = () => setIsOpen(true);
  const handleSelect = (child: ChildForLoan) => {
    onChange(child.name);
    onSelectChild(child.id);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" dir="rtl" ref={containerRef}>
      {label && (
        <label
          className="block mb-2"
          style={{
            fontFamily: 'var(--font-family-base)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--muted-foreground)',
            textAlign: 'right',
          }}
        >
          {label}
        </label>
      )}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder}
        dir="rtl"
        className="w-full h-9 rounded-md border border-border bg-input-background text-right px-3 text-sm placeholder:text-[#9CA3AF]"
        style={{
          fontFamily: 'var(--font-family-base)',
          color: 'var(--foreground)',
        }}
      />
      {showDropdown && (
        <div
          className="absolute w-full z-50 rounded-lg border overflow-hidden"
          style={{
            top: '100%',
            marginTop: 4,
            background: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--elevation-sm)',
          }}
        >
          <ul className="list-none m-0 p-1 max-h-[220px] overflow-y-auto">
            {filteredOptions.map((child) => (
              <li key={child.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(child)}
                  className="w-full text-right px-3 py-2.5 rounded-md cursor-pointer transition-colors hover:bg-[var(--muted)]/50"
                  style={{
                    fontFamily: 'var(--font-family-base)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                  }}
                >
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{child.name}</span>
                  <span style={{ color: 'var(--muted-foreground)', marginRight: 6 }}>
                    {' '}
                    – {child.unitsCount} יחידות למימוש
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Form Field (DSM tokens) ─── */
function WizardInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  onFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'email';
  onFocus?: () => void;
}) {
  return (
    <div className="w-full" dir="rtl">
      {label && (
        <label
          className="block mb-2"
          style={{
            fontFamily: 'var(--font-family-base)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--muted-foreground)',
            textAlign: 'right',
          }}
        >
          {label}
        </label>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        dir="rtl"
        className="w-full h-9 rounded-md border border-border bg-input-background text-right px-3 text-sm placeholder:text-[#9CA3AF]"
        style={{
          fontFamily: 'var(--font-family-base)',
          color: 'var(--foreground)',
        }}
      />
    </div>
  );
}

/* ─── Select Field (DSM tokens) ─── */
function WizardSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="w-full" dir="rtl">
      {label && (
        <label
          className="block mb-2"
          style={{
            fontFamily: 'var(--font-family-base)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--muted-foreground)',
            textAlign: 'right',
          }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="rtl"
          className="w-full h-9 rounded-md border border-border bg-input-background text-right cursor-pointer appearance-none pr-3 pl-9 text-sm"
          style={{
            fontFamily: 'var(--font-family-base)',
            color: value ? 'var(--foreground)' : 'var(--muted-foreground)',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute pointer-events-none"
          style={{
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted-foreground)',
          }}
        />
      </div>
    </div>
  );
}

/* ─── Info Card (sidebar) ─── */
/* ─── Info Panel תוכן – שלב 1 ─── */
function Step1InfoPanelContent() {
  return (
    <>
      <div
        className="flex flex-row items-center gap-2 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid #E5E9F9' }}
      >
        <Image src="/icons/lamp.svg" alt="" width={20} height={20} unoptimized className="shrink-0" />
        <span style={{ fontFamily: 'SimplerPro', fontWeight: 700, fontSize: '15px', color: '#172554' }}>
          תנאים לזכאות לווה
        </span>
      </div>
      <div className="px-5 py-4 flex-1 overflow-y-auto min-h-0" style={{ background: '#F8FAFC' }}>
        <p
          className="mb-3"
          style={{ fontFamily: 'SimplerPro', fontSize: '12px', color: 'var(--muted-foreground)', margin: 0, marginBottom: 12 }}
        >
          תנאים לזכאות לווה
        </p>
        <div className="flex flex-col gap-2.5">
          <InfoCard>
            אם נמצאו במערכת מספר תיקים אפשריים לאותו לווה, הבקשה תועבר לבדיקה לפני המשך התהליך.
          </InfoCard>
          <InfoCard>
            אם היו ללווה שלוש החזרות לחיוב בשנה האחרונה, הבקשה תועבר לאישור מיוחד.
          </InfoCard>
          <InfoCard>
            אם ללווה יש הלוואות פעילות מאותו תורם, והסכום הכולל לאחר ההלוואה החדשה עולה על: 160,000 ₪ (הלוואה רגילה) – 240,000 ₪ (הלוואה למטרת דירה) – הבקשה תועבר לאישור מיוחד.
          </InfoCard>
        </div>
      </div>
    </>
  );
}

/* ─── Info Panel תוכן – שלב 2 ─── */
function Step2InfoPanelContent() {
  return (
    <>
      <div
        className="flex flex-row items-center gap-2 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid #E5E9F9' }}
      >
        <Image src="/icons/lamp.svg" alt="" width={20} height={20} unoptimized className="shrink-0" />
        <span style={{ fontFamily: 'SimplerPro', fontWeight: 700, fontSize: '15px', color: '#172554' }}>
          פירוט תנאי ההלוואה
        </span>
      </div>
      <div className="px-5 py-4 flex-1 overflow-y-auto min-h-0" style={{ background: '#F8FAFC' }}>
        <p
          className="mb-3"
          style={{ fontFamily: 'SimplerPro', fontSize: '12px', color: 'var(--muted-foreground)', margin: 0, marginBottom: 12 }}
        >
          בקשת ההלוואה
        </p>
        <div className="flex flex-col gap-2.5">
          <InfoCard>
            ההלוואה ניתנת אך ורק לילדיו של התורם (או לאדם אחר שיאושר ע״י הגמ״ח ע״פ בקשת התורם), אלא בשום אופן לא להורים עצמם.
          </InfoCard>
          <InfoCard>
            הגמ״ח מתכוון לתת את ההלוואה אך אינו מתחייב על כך ע״פ חוקי המדינה כמפורט בפרוספקט והצטרפות.
          </InfoCard>
          <InfoCard>
            ניתן להעביר את זכות ההלוואה מאת בגיר לאחר (בתנאי הלא ניצול את הסכסומות ההלוואות ללווה אחר), אך לא לזוכר.
          </InfoCard>
        </div>
        <p
          className="mt-5 mb-3"
          style={{ fontFamily: 'SimplerPro', fontSize: '12px', color: 'var(--muted-foreground)', margin: 0, marginTop: 16, marginBottom: 12 }}
        >
          הערות
        </p>
        <div className="flex flex-col gap-2.5">
          <InfoCard>
            הגמ״ח מתכוון לתת מענק בניכוי ההלוואה, אך יידעו כי המענק אינו מובטח לכל אירוע, אלא הוסכם אנ״ש נתן לראיים לכל, ואין ההתרמה על כדי כמפורט בפרוספקט והצטרפות.
          </InfoCard>
          <InfoCard>
            זכות בקשת ההלוואה היא של התורם, והתורם לבקש עבור עצמו או עבור הלווה.
          </InfoCard>
        </div>
      </div>
    </>
  );
}

/* ─── Step 2: מטרת ההלוואה ─── */
function Step2Form({
  step2,
  setStep2,
  donationUnits = DEFAULT_DONATION_UNITS,
  borrowerName = 'שולמית אביה',
}: {
  step2: LoanWizardStep2Data;
  setStep2: React.Dispatch<React.SetStateAction<LoanWizardStep2Data>>;
  donationUnits?: DonationUnit[];
  borrowerName?: string;
}) {
  const [showAdditional, setShowAdditional] = useState(false);
  const [showUnitNotForBorrowerPopup, setShowUnitNotForBorrowerPopup] = useState(false);
  const [pendingAdditionalUnitId, setPendingAdditionalUnitId] = useState<string | null>(null);

  const borrowerUnits = donationUnits.filter((u) => u.group === 'borrower');
  const additionalUnits = donationUnits.filter((u) => u.group === 'additional');

  const toggleUnit = (id: string) => {
    setStep2((p) => ({
      ...p,
      selectedUnitIds: p.selectedUnitIds.includes(id)
        ? p.selectedUnitIds.filter((uid) => uid !== id)
        : [...p.selectedUnitIds, id],
    }));
  };

  const totalSelected = step2.selectedUnitIds.length;
  const totalLoanAmount = donationUnits
    .filter((u) => step2.selectedUnitIds.includes(u.id))
    .reduce((sum, u) => sum + u.loanEntitlement, 0);
  const monthlyPayment = totalSelected > 0 ? Math.round(totalLoanAmount / 120) : 0;

  const handleAdditionalUnitClick = (unit: DonationUnit) => {
    if (step2.selectedUnitIds.includes(unit.id)) {
      toggleUnit(unit.id);
    } else {
      setPendingAdditionalUnitId(unit.id);
      setShowUnitNotForBorrowerPopup(true);
    }
  };

  const handleUnitNotForBorrowerProceed = () => {
    if (pendingAdditionalUnitId) {
      setStep2((p) => ({
        ...p,
        selectedUnitIds: p.selectedUnitIds.includes(pendingAdditionalUnitId)
          ? p.selectedUnitIds
          : [...p.selectedUnitIds, pendingAdditionalUnitId],
      }));
      setPendingAdditionalUnitId(null);
    }
    setShowUnitNotForBorrowerPopup(false);
  };

  return (
    <>
      <UnitNotForBorrowerPopup
        isOpen={showUnitNotForBorrowerPopup}
        onClose={() => {
          setShowUnitNotForBorrowerPopup(false);
          setPendingAdditionalUnitId(null);
        }}
        onProceed={handleUnitNotForBorrowerProceed}
      />
      {/* ─── מטרת ההלוואה ─── */}
      <h2
        style={{
          fontFamily: 'var(--font-family-base)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--text-xl)',
          color: 'var(--primary)',
          lineHeight: 1.3,
          textAlign: 'right',
          marginBottom: 24,
        }}
      >
        מטרת ההלוואה
      </h2>

      <div className="flex flex-col gap-5 max-w-[720px] w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LOAN_PURPOSE_OPTIONS.map((opt) => {
            const selected = step2.loanPurpose === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStep2((p) => ({ ...p, loanPurpose: opt.value }))}
                className="flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer transition-all"
                style={{
                  height: '160px',
                  background: selected ? '#F8FAFC' : '#FAFAFA',
                  border: selected ? '2px solid var(--primary)' : '1.5px solid #E5E9F9',
                  boxShadow: selected
                    ? '0 0 0 3px rgba(23, 37, 84, 0.08)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <Image
                  src={opt.icon}
                  alt={opt.label}
                  width={50}
                  height={50}
                  unoptimized
                  style={{ opacity: selected ? 1 : 0.5 }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-family-base)',
                    fontSize: 'var(--text-base)',
                    fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    color: selected ? '#172554' : '#6B7280',
                  }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── יחידות תרומה עבורן תבוקש ההלוואה ─── */}
      <h2
        style={{
          fontFamily: 'var(--font-family-base)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--text-xl)',
          color: 'var(--primary)',
          lineHeight: 1.3,
          textAlign: 'right',
          marginTop: 48,
          marginBottom: 24,
        }}
      >
        יחידות תרומה עבורן תבוקש ההלוואה:
      </h2>

      <div className="flex flex-col gap-6 max-w-[720px] w-full">
        {/* קבוצה 1 – יחידות שנתרמו עבור הלווה */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'var(--text-sm)',
              color: '#6B7280',
              textAlign: 'right',
              marginBottom: 12,
            }}
          >
            יחידות שנתרמו במלואן עבור {borrowerName} ({borrowerUnits.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {borrowerUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                selected={step2.selectedUnitIds.includes(unit.id)}
                onToggle={() => toggleUnit(unit.id)}
              />
            ))}
          </div>
        </div>

        {/* קבוצה 2 – יחידות נוספות (מתקפלת) */}
        {additionalUnits.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowAdditional((v) => !v)}
              className="flex flex-row-reverse items-center gap-2 cursor-pointer mb-3 w-full justify-end"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-sm)',
                color: '#6B7280',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
              dir="rtl"
            >
              <span>יחידות נוספות שנתרמו במלואן ({additionalUnits.length})</span>
              <ChevronLeft
                size={16}
                style={{
                  color: '#6B7280',
                  transform: showAdditional ? 'rotate(-90deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            {showAdditional && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {additionalUnits.map((unit) => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      selected={step2.selectedUnitIds.includes(unit.id)}
                      onToggle={() => handleAdditionalUnitClick(unit)}
                    />
                  ))}
                </div>
                <div className="flex justify-start mt-4" dir="rtl">
                <a
                  href="/donation-units?filter=unused"
                  className="inline-flex flex-row-reverse items-center justify-center gap-2 rounded-lg px-4 py-2.5 w-full sm:w-auto"
                  dir="rtl"
                  style={{
                    fontFamily: 'var(--font-family-base)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: '#374151',
                    background: '#E5E7EB',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D1D5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#E5E7EB';
                  }}
                >
                  <ExternalLink size={16} style={{ color: '#374151', flexShrink: 0 }} />
                  <span>לצפייה בשאר יחידות התרומה שלך, אשר טרם ניתנות למימוש</span>
                </a>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ─── Summary bar ─── */}
      {totalSelected > 0 && (
        <div
          className="flex flex-row items-center justify-between max-w-[720px] w-full rounded-xl mt-6 px-5 py-3.5"
          dir="rtl"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #CCA559',
            boxShadow: '0 2px 12px rgba(204, 165, 89, 0.1)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: '#172554',
            }}
          >
            סה״כ נבחרו: {totalSelected} יחידות
            <span style={{ margin: '0 8px', color: '#CCA559' }}>|</span>
            סכום להלוואה: {totalLoanAmount.toLocaleString('he-IL')}₪
          </span>
          <div className="flex flex-row items-center gap-2">
            <Info size={14} style={{ color: '#CCA559' }} />
            <span
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-sm)',
                color: '#6B7280',
              }}
            >
              החזר חודשי צפוי: ~{monthlyPayment.toLocaleString('he-IL')}₪
            </span>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── כרטיס יחידת תרומה ─── */
function UnitCard({
  unit,
  selected,
  onToggle,
}: {
  unit: DonationUnit;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      dir="rtl"
      className="flex flex-col rounded-xl cursor-pointer transition-all text-right"
      style={{
        background: selected ? '#F8FAFC' : '#FFFFFF',
        border: selected ? '2px solid var(--primary)' : '1.5px solid #E5E9F9',
        padding: '14px 16px',
        position: 'relative',
      }}
    >
      {/* Top row: icon+title on the right, checkbox on the left (RTL) */}
      <div className="flex flex-row items-center justify-between w-full mb-3">
        <div className="flex flex-row items-center gap-1.5">
          <Image src="/icons/units.svg" alt="" width={16} height={16} unoptimized className="shrink-0" />
          <span
            style={{
              fontFamily: 'var(--font-family-base)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: '14px',
              color: '#172554',
            }}
          >
            יחידה #{unit.unitNumber}
          </span>
        </div>
        <div
          className="flex items-center justify-center w-5 h-5 rounded shrink-0"
          style={{
            background: selected ? 'var(--primary)' : '#fff',
            border: selected ? '2px solid var(--primary)' : '2px solid #D1D5DB',
            transition: 'all 0.15s',
          }}
        >
          {selected && <Check size={13} style={{ color: '#fff' }} strokeWidth={3} />}
        </div>
      </div>

      {/* Data row – RTL: עבור, שנת ייעוד, זכאות הלוואה */}
      <div className="flex flex-row items-start justify-between w-full gap-2">
        <div className="flex flex-col items-center flex-1">
          <span style={{ fontFamily: 'var(--font-family-base)', fontSize: '11px', color: '#9CA3AF' }}>
            עבור
          </span>
          <span style={{ fontFamily: 'var(--font-family-base)', fontSize: '13px', fontWeight: 600, color: '#172554' }}>
            {unit.forName}
          </span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span style={{ fontFamily: 'var(--font-family-base)', fontSize: '11px', color: '#9CA3AF' }}>
            שנת ייעוד
          </span>
          <span style={{ fontFamily: 'var(--font-family-base)', fontSize: '13px', fontWeight: 600, color: '#172554' }}>
            {unit.year}
          </span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span style={{ fontFamily: 'var(--font-family-base)', fontSize: '11px', color: '#9CA3AF' }}>
            זכאות הלוואה
          </span>
          <span style={{ fontFamily: 'var(--font-family-base)', fontSize: '13px', fontWeight: 600, color: '#172554' }}>
            ₪{unit.loanEntitlement.toLocaleString('he-IL')}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ─── Info Panel תוכן – שלב 3 ─── */
function Step3InfoPanelContent() {
  return (
    <>
      <div
        className="flex flex-row items-center gap-2 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid #E5E9F9' }}
      >
        <Image src="/icons/lamp.svg" alt="" width={20} height={20} unoptimized className="shrink-0" />
        <span style={{ fontFamily: 'SimplerPro', fontWeight: 700, fontSize: '15px', color: '#172554' }}>
          מידע נוסף על ערבים
        </span>
      </div>
      <div className="px-5 py-4 flex-1 overflow-y-auto min-h-0" style={{ background: '#F8FAFC' }}>
        <p className="mb-3" style={{ fontFamily: 'SimplerPro', fontSize: '12px', color: 'var(--muted-foreground)', margin: 0, marginBottom: 12 }}>
          כמות ערבים נדרשים
        </p>
        <div className="flex flex-col gap-2.5">
          <InfoCard>
            לכל סכום הלוואה נדרשת כמות ערבים מסויימת. עבור הסכום המבוקש (₪240,000) נדרשים לפחות 5 ערבים.
          </InfoCard>
          <InfoCard>
            הוספת ערבים נוספים, מעבר לנדרש, עשויה לסייע בקידום הבקשה במקרה שאחד הערבים לא יאושר.
          </InfoCard>
        </div>
        <p className="mt-5 mb-3" style={{ fontFamily: 'SimplerPro', fontSize: '12px', color: 'var(--muted-foreground)', margin: 0, marginTop: 16, marginBottom: 12 }}>
          תנאים לקבלת ערב
        </p>
        <div className="flex flex-col gap-2.5">
          <InfoCard>
            ערב לא יכול להיות ערב לאותו לווה על הלוואה מצטברת בסכום כולל של יותר מ-80,000 ₪ (חישוב נעשה לפי סכום ההלוואות כולל בקשות שנמצאות בתהליך).
          </InfoCard>
          <InfoCard>
            ערב לא יכול להיות ערב לאותו תורם בסכום כולל העולה על ₪480,000 (חישוב נעשה לפי יתרת ההלוואות, כולל בקשות שנמצאות בתהליך).
          </InfoCard>
          <InfoCard>
            למפעת מנויים מהערבים לא יכולים להיות חובות על ערבויות, בתנאי כולל של מעל ₪640,000 ₪ ביתרת הלוואות מפעילות.
          </InfoCard>
          <InfoCard>
            ערבויות מקבלים רק אם אינם חתומים על יותר מ-12 ערבויות שטרם שהרו בהן האחרונות.
          </InfoCard>
        </div>
      </div>
    </>
  );
}

/* ─── Step 3: הגדרת ערבים ─── */
function Step3Form({
  guarantors,
  setGuarantors,
}: {
  guarantors: GuarantorData[];
  setGuarantors: React.Dispatch<React.SetStateAction<GuarantorData[]>>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const requiredCount = 5;
  const isExtraGuarantor = (index: number) => index >= requiredCount;

  const updateGuarantor = (index: number, field: keyof GuarantorData, value: string | boolean) => {
    setGuarantors((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = (index: number) => {
    updateGuarantor(index, 'isSaved', true);
    setOpenIndex(null);
  };

  const handleSaveAndNext = (index: number) => {
    updateGuarantor(index, 'isSaved', true);
    if (index < guarantors.length - 1) {
      setOpenIndex(index + 1);
    } else {
      setOpenIndex(null);
    }
  };

  const getDisplayName = (g: GuarantorData) => {
    const name = [g.firstName, g.lastName].filter(Boolean).join(' ');
    return name || '';
  };

  const handleAddGuarantor = () => {
    setGuarantors((prev) => [...prev, { ...emptyGuarantor }]);
    setOpenIndex(guarantors.length);
  };

  const handleRemoveGuarantor = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (guarantors.length <= requiredCount) return;
    setGuarantors((prev) => prev.filter((_, j) => j !== index));
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex !== null && openIndex > index) setOpenIndex(openIndex - 1);
  };

  return (
    <>
      <h2
        style={{
          fontFamily: 'var(--font-family-base)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--text-xl)',
          color: 'var(--primary)',
          lineHeight: 1.3,
          textAlign: 'right',
          marginBottom: 24,
        }}
      >
        הגדרת ערבים
      </h2>

      <div className="flex flex-col gap-3 max-w-[720px] w-full">
        {guarantors.map((g, i) => {
          const isOpen = openIndex === i;
          const displayName = getDisplayName(g);

          return (
            <div
              key={i}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                border: isOpen ? '1.5px solid rgba(23, 37, 84, 0.4)' : '1.5px solid #E5E9F9',
                background: isOpen ? '#FFFFFF' : g.isSaved ? '#FFFFFF' : '#F3F4F6',
              }}
              dir="rtl"
            >
              {/* Header – RTL: מינוס בצד ימין, אז בתוך ה-DOM מינוס ראשון (יופיע ימין) */}
              <div className="flex flex-row items-center w-full px-5 py-3.5 gap-2" dir="rtl">
                {isExtraGuarantor(i) && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveGuarantor(i, e)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    aria-label="הסרת ערב"
                  >
                    <Minus size={18} style={{ color: '#6B7280' }} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex flex-row items-center justify-between flex-1 min-w-0 cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.02)] -mx-2 px-2 py-1 rounded-lg"
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <div className="flex flex-row items-center gap-3">
                    {g.isSaved && displayName ? (
                      <Image src="/icons/checkmark-circle-01.svg" alt="" width={24} height={24} unoptimized className="shrink-0" />
                    ) : (
                      <User size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--font-family-base)',
                        fontSize: 'var(--text-base)',
                        fontWeight: g.isSaved ? 600 : 400,
                        color: g.isSaved ? '#172554' : '#6B7280',
                      }}
                    >
                      {g.isSaved && displayName ? displayName : `ערב #${i + 1}`}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    style={{
                      color: '#9CA3AF',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* Form content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t" style={{ borderColor: '#E5E9F9' }}>
                  <div className="flex flex-col gap-4">
                    {/* Row 1: שם פרטי, שם משפחה, ת.ז. */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <WizardInput label="שם פרטי" value={g.firstName} onChange={(v) => updateGuarantor(i, 'firstName', v)} placeholder="שם פרטי" />
                      <WizardInput label="שם משפחה" value={g.lastName} onChange={(v) => updateGuarantor(i, 'lastName', v)} placeholder="שם משפחה" />
                      <WizardInput label="ת.ז." value={g.idNumber} onChange={(v) => updateGuarantor(i, 'idNumber', v)} placeholder="מספר ת.ז." />
                    </div>
                    {/* Row 2: עיר, רחוב, מספר בניין */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <WizardSelect label="עיר" value={g.city} onChange={(v) => updateGuarantor(i, 'city', v)} options={CITY_OPTIONS} />
                      <WizardInput label="רחוב" value={g.street} onChange={(v) => updateGuarantor(i, 'street', v)} placeholder="שם רחוב" />
                      <WizardInput label="מספר בניין" value={g.buildingNumber} onChange={(v) => updateGuarantor(i, 'buildingNumber', v)} placeholder="מספר" />
                    </div>
                    {/* Row 3: מקום עבודה, תפקיד, קשר ללווה */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <WizardInput label="מקום עבודה" value={g.workplace} onChange={(v) => updateGuarantor(i, 'workplace', v)} placeholder="מקום עבודה" />
                      <WizardInput label="תפקיד" value={g.role} onChange={(v) => updateGuarantor(i, 'role', v)} placeholder="תפקיד" />
                      <WizardSelect label="קשר ללווה" value={g.relationship} onChange={(v) => updateGuarantor(i, 'relationship', v)} options={RELATIONSHIP_OPTIONS} />
                    </div>
                    {/* Row 4: טלפון, אימייל, מצב אישי */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <WizardInput label="טלפון" value={g.phone} onChange={(v) => updateGuarantor(i, 'phone', v)} placeholder="מס׳ טלפון" />
                      <WizardInput label="אימייל" type="email" value={g.email} onChange={(v) => updateGuarantor(i, 'email', v)} placeholder="דוא״ל" />
                      <WizardSelect label="מצב אישי" value={g.maritalStatus} onChange={(v) => updateGuarantor(i, 'maritalStatus', v)} options={MARITAL_STATUS_OPTIONS} />
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex flex-row items-center gap-3 mt-6" dir="rtl">
                    {i < guarantors.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleSaveAndNext(i)}
                        className="inline-flex items-center justify-center h-10 px-5 rounded-lg font-semibold border-0 cursor-pointer transition-opacity hover:opacity-90"
                        style={{
                          fontFamily: 'var(--font-family-base)',
                          fontSize: 'var(--text-sm)',
                          color: '#fff',
                          background: 'var(--primary)',
                        }}
                      >
                        שמירה והמשך לערב הבא
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSave(i)}
                      className="inline-flex items-center justify-center h-10 px-5 rounded-lg font-medium cursor-pointer transition-colors border hover:bg-[rgba(0,0,0,0.02)]"
                      style={{
                        fontFamily: 'var(--font-family-base)',
                        fontSize: 'var(--text-sm)',
                        color: '#141E44',
                        background: '#fff',
                        borderColor: '#E5E9F9',
                      }}
                    >
                      שמירה
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={handleAddGuarantor}
          className="flex flex-row-reverse items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 w-full max-w-[720px] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
          dir="rtl"
          style={{
            fontFamily: 'var(--font-family-base)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: '#6B7280',
            borderColor: '#D1D5DB',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <span>הוספת ערב נוסף</span>
          <span style={{ fontSize: '18px', lineHeight: 1, color: '#9CA3AF' }}>+</span>
        </button>
      </div>
    </>
  );
}

/* ─── Info Panel תוכן – שלב 4 ─── */
function Step4InfoPanelContent() {
  return (
    <>
      <div
        className="flex flex-row items-center gap-2 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid #E5E9F9' }}
      >
        <Image src="/icons/lamp.svg" alt="" width={20} height={20} unoptimized className="shrink-0" />
        <span style={{ fontFamily: 'SimplerPro', fontWeight: 700, fontSize: '15px', color: '#172554' }}>
          מידע נוסף – פרטי התקשרות
        </span>
      </div>
      <div className="px-5 py-4 flex-1 overflow-y-auto min-h-0" style={{ background: '#F8FAFC' }}>
        <div className="flex flex-col gap-2.5">
          <InfoCard>
            שטר ההלוואה יישלח אל הכתובת שתבחר. וודא שהפרטים מעודכנים כדי לקבל את המסמכים בהקדם.
          </InfoCard>
        </div>
      </div>
    </>
  );
}

/* ─── Step 4: פרטי התקשרות ─── */
const CONTACT_FIELD_CONFIG: Record<
  LoanWizardStep4Data['contactMethod'],
  { label: string; placeholder: string; inputType: 'email' | 'tel' | 'text' }
> = {
  borrower_email: { label: 'כתובת אימייל של הלווה', placeholder: 'הזן כתובת אימייל', inputType: 'email' },
  donor_email: { label: 'כתובת אימייל של התורם', placeholder: 'הזן כתובת אימייל', inputType: 'email' },
  borrower_fax: { label: "מס׳ פקס של הלווה", placeholder: "הזן מס׳ פקס", inputType: 'tel' },
  other: { label: 'פרטי התקשרות', placeholder: 'הזן פרטים', inputType: 'text' },
};

function Step4Form({
  step4,
  setStep4,
}: {
  step4: LoanWizardStep4Data;
  setStep4: React.Dispatch<React.SetStateAction<LoanWizardStep4Data>>;
}) {
  const fieldConfig = CONTACT_FIELD_CONFIG[step4.contactMethod];
  return (
    <div dir="rtl" className="flex flex-col max-w-[720px] w-full">
      <h2
        style={{
          fontFamily: 'var(--font-family-base)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--text-xl)',
          color: 'var(--primary)',
          lineHeight: 1.3,
          textAlign: 'right',
          marginBottom: 8,
        }}
      >
        למי לשלוח את שטר ההלוואה?
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          textAlign: 'right',
          marginBottom: 20,
        }}
      >
        יש לבחור את הגורם עמו ניתן ליצור קשר:
      </p>

      {/* Contact method options – each rounded and separate */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {CONTACT_METHOD_OPTIONS.map((opt) => {
          const selected = step4.contactMethod === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStep4((p) => ({ ...p, contactMethod: opt.value }))}
              className="inline-flex flex-row-reverse items-center justify-center gap-2 h-12 cursor-pointer transition-all border w-full rounded-lg"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-sm)',
                fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                color: selected ? 'var(--primary)' : 'var(--muted-foreground)',
                background: selected ? '#EFF6FF' : 'var(--card)',
                borderColor: selected ? 'var(--primary)' : 'var(--border)',
                textAlign: 'right',
              }}
            >
              <span
                className="flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0"
                style={{
                  border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {selected && (
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: 'var(--primary)' }}
                  />
                )}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      <label
        className="block mb-2"
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: 'var(--muted-foreground)',
          textAlign: 'right',
        }}
      >
        {fieldConfig.label}
      </label>
      <Input
        type={fieldConfig.inputType}
        value={step4.borrowerEmail}
        onChange={(e) => setStep4((p) => ({ ...p, borrowerEmail: e.target.value }))}
        placeholder={fieldConfig.placeholder}
        dir="rtl"
        className="w-full h-9 rounded-md border border-border bg-input-background text-right px-3 text-sm placeholder:text-[#9CA3AF]"
        style={{
          fontFamily: 'var(--font-family-base)',
          color: 'var(--foreground)',
        }}
      />
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{
        background: '#E8EDF2',
        border: '1px solid #D9DDEC',
      }}
    >
      <p
        className="m-0 leading-relaxed"
        style={{
          fontFamily: 'SimplerPro',
          fontSize: '13px',
          fontWeight: 400,
          color: '#495157',
          textAlign: 'right',
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: '#172554', fontWeight: 600 }}>• </span>
        {children}
      </p>
    </div>
  );
}
