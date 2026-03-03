'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronDown, AlertTriangle } from 'lucide-react';
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

  if (!isOpen) return null;

  const canNavigateToStep = (stepId: number) =>
    stepId <= currentStep || completedSteps.includes(stepId);

  const handleContinue = () => {
    if (currentStep < 5) {
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );
      setCurrentStep((s) => s + 1);
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
          className="hidden md:flex flex-col shrink-0 py-10 px-8"
          style={{
            width: '240px',
            background: '#172554',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex flex-col">
            {WIZARD_STEPS.map((step, index) => {
              const active = step.id === currentStep;
              const completed = completedSteps.includes(step.id);
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
            {/* Center – Form */}
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

              {currentStep === 1 && (
                <Step1Form step1={step1} setStep1={setStep1} childrenForLoan={childrenForLoan} />
              )}
              {currentStep > 1 && (
                <div
                  className="flex-1 flex items-center justify-center h-full"
                  style={{ color: '#9CA3AF', fontFamily: 'SimplerPro' }}
                >
                  שלב {currentStep} – בהמשך יוטמע
                </div>
              )}
            </div>

            {/* ── Info Panel – קופסה צפה דבוקה לשמאל, בגובה הכותרת ── */}
            <div
              className="hidden lg:block absolute top-8"
              style={{ left: 24 }}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  width: '280px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E9F9',
                  boxShadow: '0 4px 24px rgba(14, 78, 134, 0.08)',
                }}
              >
                {/* כותרת הקופסה */}
                <div
                  className="flex flex-row items-center gap-2 px-5 py-3"
                  style={{
                    borderBottom: '1px solid #E5E9F9',
                  }}
                >
                  <Image src="/icons/lamp.svg" alt="" width={20} height={20} unoptimized className="shrink-0" />
                  <span
                    style={{
                      fontFamily: 'SimplerPro',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: '#172554',
                    }}
                  >
                    תנאים לזכאות לווה
                  </span>
                </div>
                {/* תוכן */}
                <div
                  className="px-5 py-4"
                  style={{ background: '#F8FAFC' }}
                >
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: 'SimplerPro',
                      fontSize: '12px',
                      color: 'var(--muted-foreground)',
                      margin: 0,
                      marginBottom: 12,
                    }}
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
              </div>
            </div>
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
              onClick={handleExitAndSave}
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg font-semibold cursor-pointer transition-all hover:bg-[rgba(0,0,0,0.03)]"
              style={{
                fontFamily: 'SimplerPro',
                fontSize: 'var(--text-base)',
                color: 'var(--primary)',
                background: 'transparent',
                border: '1.5px solid var(--primary)',
              }}
            >
              יציאה ושמירה
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
              המשך
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

        {/* ─── פרטי בת הזוג של הלווה (מוצג רק כשנשוי) ─── */}
        {step1.maritalStatus === 'married' && (
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
              פרטי בת הזוג של הלווה
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
        className="w-full h-9 rounded-md border border-border bg-input-background text-right px-3 text-sm"
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
        className="w-full h-9 rounded-md border border-border bg-input-background text-right px-3 text-sm"
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
