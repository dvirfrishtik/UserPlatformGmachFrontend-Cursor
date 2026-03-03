'use client';

import { useState } from 'react';
import { X, ChevronRight, Lightbulb, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

const WIZARD_STEPS = [
  { id: 1, label: 'פרטי הלווה' },
  { id: 2, label: 'פרטי ההלוואה' },
  { id: 3, label: 'הגדרת ערבים' },
  { id: 4, label: 'פרטי התקשרות' },
  { id: 5, label: 'סיכום והגשה' },
] as const;

// Mock – במקור יגיע מרשימת הילדים/קרובים
const CHILD_OPTIONS = [
  { value: '', label: 'בחירת ילד/ה או קרוב/ה' },
  { value: '1', label: 'ילד א' },
  { value: '2', label: 'ילד ב' },
];
const RELATIONSHIP_OPTIONS = [
  { value: '', label: 'בחירת קרבה' },
  { value: 'parent', label: 'הורה' },
  { value: 'grandparent', label: 'סבים' },
  { value: 'uncle', label: 'דוד/דודה' },
  { value: 'other', label: 'אחר' },
];

export interface LoanWizardStep1Data {
  fullName: string;
  idNumber: string;
  birthDate: string;
  selectedChildId: string;
  email: string;
  relationship: string;
  phone: string;
}

interface LoanApplicationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onExitAndSave?: () => void;
}

const emptyStep1: LoanWizardStep1Data = {
  fullName: '',
  idNumber: '',
  birthDate: '',
  selectedChildId: '',
  email: '',
  relationship: '',
  phone: '',
};

export function LoanApplicationWizard({ isOpen, onClose, onExitAndSave }: LoanApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [step1, setStep1] = useState<LoanWizardStep1Data>(emptyStep1);

  if (!isOpen) return null;

  const canNavigateToStep = (stepId: number) => stepId <= currentStep || completedSteps.includes(stepId);
  const isStepActive = (stepId: number) => stepId === currentStep;

  const handleContinue = () => {
    if (currentStep < 5) {
      setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      setCurrentStep((s) => s + 1);
    }
  };

  const handleExitAndSave = () => {
    onExitAndSave?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ backgroundColor: '#FAFAFA', direction: 'rtl' }}
      dir="rtl"
    >
      {/* ─── Header ─── */}
      <header
        className="flex flex-row justify-between items-center shrink-0 px-4 py-3 min-h-[56px] md:min-h-[72px] md:px-[38px] md:py-4"
        style={{
          background: '#F8FAFC',
          borderBottom: '1px solid #E8EDF2',
          boxShadow: '9.53704px 7.80303px 43.3502px rgba(33, 132, 213, 0.1)',
        }}
      >
        <div className="flex flex-col items-end gap-0.5 min-w-0 flex-1" style={{ textAlign: 'right' }}>
          <div className="flex flex-row items-center gap-2" style={{ justifyContent: 'flex-end' }}>
            <span className="text-base md:text-xl font-bold truncate max-w-[85vw] md:max-w-none" style={{ fontFamily: 'SimplerPro', color: '#172554' }}>
              תהליך בקשת הלוואה
            </span>
            <ChevronRight size={20} className="shrink-0" style={{ color: '#172554' }} />
          </div>
          <span className="text-xs md:text-sm" style={{ fontFamily: 'SimplerPro', fontWeight: 400, color: '#495157' }}>
            עבור ילד/ה או קרוב/ה
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.06)] shrink-0"
          style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
          aria-label="סגור"
        >
          <X size={20} style={{ color: '#495157' }} />
        </button>
      </header>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ─── Right: Wizard steps sidebar ─── */}
        <aside
          className="hidden md:flex flex-col shrink-0 border-l border-[#E8EDF2] py-6 pl-6 pr-5"
          style={{ width: '220px', background: '#FFFFFF' }}
        >
          {WIZARD_STEPS.map((step, index) => {
            const active = isStepActive(step.id);
            const completed = completedSteps.includes(step.id);
            const clickable = canNavigateToStep(step.id);
            const isLast = index === WIZARD_STEPS.length - 1;
            return (
              <div key={step.id} className="flex flex-row items-center gap-3" style={{ alignSelf: 'flex-end' }}>
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => clickable && setCurrentStep(step.id)}
                    disabled={!clickable}
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 border-0 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-100"
                    style={{
                      background: active ? '#172554' : completed ? '#172554' : '#E5E9F0',
                      color: active || completed ? '#FFFFFF' : '#9CA3AF',
                      fontWeight: 700,
                      fontSize: '13px',
                      fontFamily: 'SimplerPro',
                    }}
                  >
                    {String(step.id).padStart(2, '0')}
                  </button>
                  {!isLast && (
                    <div
                      className="mt-2"
                      style={{
                        width: 0,
                        height: '24px',
                        borderRight: '2px dashed #E5E9F0',
                        marginRight: '15px',
                      }}
                    />
                  )}
                </div>
                <span
                  className="text-right"
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: active ? 700 : 400,
                    fontSize: '14px',
                    color: active ? '#172554' : '#6B7280',
                    cursor: clickable ? 'pointer' : 'default',
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </aside>

        {/* ─── Center: Main content ─── */}
        <main className="flex-1 flex min-w-0 overflow-auto">
          <div className="flex-1 flex min-w-0">
            {/* Form area – grows in center */}
            <div
              className="flex-1 min-w-0 flex flex-col py-6 px-4 md:px-8"
              style={{ background: '#FAFAFA' }}
            >
              {/* מובייל: אינדיקציה לשלב נוכחי */}
              <div className="md:hidden flex flex-row items-center gap-2 mb-4" style={{ justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'SimplerPro', fontSize: '13px', color: '#6B7280' }}>
                  שלב {currentStep} מתוך 5
                </span>
                <span
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#172554',
                  }}
                >
                  {WIZARD_STEPS[currentStep - 1]?.label}
                </span>
              </div>
              {currentStep === 1 && (
                <>
                  <h2
                    className="text-right mb-6"
                    style={{
                      fontFamily: 'SimplerPro',
                      fontWeight: 600,
                      fontSize: 'clamp(18px, 2vw, 22px)',
                      color: '#172554',
                      lineHeight: 1.3,
                    }}
                  >
                    פרטי הלווה
                  </h2>
                  <div className="flex flex-col gap-4 max-w-2xl" style={{ marginRight: 0, marginLeft: 'auto' }}>
                    {/* Row 1: שם מלא, ת.ז., תאריך לידה */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        label="שם מלא"
                        value={step1.fullName}
                        onChange={(v) => setStep1((p) => ({ ...p, fullName: v }))}
                        placeholder="הזן שם מלא"
                      />
                      <FormField
                        label="ת.ז."
                        value={step1.idNumber}
                        onChange={(v) => setStep1((p) => ({ ...p, idNumber: v }))}
                        placeholder="מספר ת.ז."
                      />
                      <FormField
                        label="תאריך לידה"
                        type="date"
                        value={step1.birthDate}
                        onChange={(v) => setStep1((p) => ({ ...p, birthDate: v }))}
                        dir="rtl"
                        withCalendarIcon
                      />
                    </div>
                    {/* Row 2: בחירת ילד/ה, אימייל, הקשר */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <SelectField
                        label="בחירת ילד/ה או קרוב/ה"
                        value={step1.selectedChildId}
                        onChange={(v) => setStep1((p) => ({ ...p, selectedChildId: v }))}
                        options={CHILD_OPTIONS}
                      />
                      <FormField
                        label="אימייל"
                        type="email"
                        value={step1.email}
                        onChange={(v) => setStep1((p) => ({ ...p, email: v }))}
                        placeholder="דוא״ל"
                      />
                      <SelectField
                        label="הקשר שלי ללווה"
                        value={step1.relationship}
                        onChange={(v) => setStep1((p) => ({ ...p, relationship: v }))}
                        options={RELATIONSHIP_OPTIONS}
                      />
                    </div>
                    {/* Row 3: טלפון – ימין */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-start-3">
                        <FormField
                          label="טלפון"
                          value={step1.phone}
                          onChange={(v) => setStep1((p) => ({ ...p, phone: v }))}
                          placeholder="מס׳ טלפון"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {currentStep > 1 && (
                <div className="flex-1 flex items-center justify-center text-right" style={{ color: 'var(--muted-foreground)' }}>
                  שלב {currentStep} – בהמשך יוטמע
                </div>
              )}
            </div>

            {/* ─── Left: Info sidebar (תנאים לזכאות) ─── */}
            <aside
              className="hidden lg:flex flex-col shrink-0 w-[280px] xl:w-[320px] py-6 pr-6 pl-4 border-r border-[#E8EDF2] overflow-auto"
              style={{ background: '#F1F5F9' }}
            >
              <div className="flex flex-row items-center gap-2 mb-4" style={{ justifyContent: 'flex-end' }}>
                <Lightbulb size={20} style={{ color: '#64748B' }} />
                <h3
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#172554',
                    margin: 0,
                    textAlign: 'right',
                  }}
                >
                  תנאים לזכאות לווה
                </h3>
              </div>
              <ul className="list-none m-0 p-0 space-y-3" style={{ textAlign: 'right', paddingRight: '0' }}>
                <li
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: 'SimplerPro', color: '#475569', paddingRight: '8px', position: 'relative' }}
                >
                  <span style={{ position: 'absolute', right: 0, top: '0.35em', width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8' }} />
                  אם נמצאו במערכת מספר תיקים אפשריים לאותו לווה, הבקשה תועבר לבדיקה לפני המשך התהליך.
                </li>
                <li
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: 'SimplerPro', color: '#475569', paddingRight: '8px', position: 'relative' }}
                >
                  <span style={{ position: 'absolute', right: 0, top: '0.35em', width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8' }} />
                  אם היו ללווה שלוש החזרות לחיוב בשנה האחרונה, הבקשה תועבר לאישור מיוחד.
                </li>
                <li
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: 'SimplerPro', color: '#475569', paddingRight: '8px', position: 'relative' }}
                >
                  <span style={{ position: 'absolute', right: 0, top: '0.35em', width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8' }} />
                  אם ללווה יש הלוואות פעילות מאותו תורם, והסכום הכולל לאחר ההלוואה החדשה עולה על: 160,000 ₪ (הלוואה רגילה) – 240,000 ₪ (הלוואה למטרת דירה) – הבקשה תועבר לאישור מיוחד.
                </li>
              </ul>
            </aside>
          </div>
        </main>
      </div>

      {/* ─── Footer ─── */}
      <footer
        className="flex flex-row items-center justify-end gap-3 shrink-0 px-4 md:px-8 py-4"
        style={{
          background: '#2C3E50',
          borderTop: '1px solid #E8EDF2',
        }}
      >
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center h-12 px-6 rounded-lg font-semibold transition-colors cursor-pointer border-0"
          style={{
            fontFamily: 'SimplerPro',
            fontSize: '16px',
            color: '#FFFFFF',
            background: '#172554',
          }}
        >
          המשך
        </button>
        <button
          type="button"
          onClick={handleExitAndSave}
          className="inline-flex items-center justify-center h-12 px-6 rounded-lg font-semibold transition-colors cursor-pointer border"
          style={{
            fontFamily: 'SimplerPro',
            fontSize: '16px',
            color: '#172554',
            background: '#FFFFFF',
            borderColor: '#172554',
          }}
        >
          יציאה ושמירה
        </button>
      </footer>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  dir,
  withCalendarIcon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'email';
  dir?: 'rtl' | 'ltr';
  withCalendarIcon?: boolean;
}) {
  return (
    <div dir={dir ?? 'rtl'} className="w-full">
      <label
        style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: 'var(--muted-foreground)',
          marginBottom: '8px',
          textAlign: 'right',
        }}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {withCalendarIcon && (
          <span className="absolute right-3 pointer-events-none flex items-center" style={{ color: 'var(--muted-foreground)' }}>
            <Calendar size={18} />
          </span>
        )}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full text-right rounded-[6px] px-3.5 py-2 border-border bg-input-background text-foreground pr-10"
          dir={dir}
          style={dir === 'rtl' ? { direction: 'rtl', textAlign: 'right' } : undefined}
        />
      </div>
    </div>
  );
}

function SelectField({
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
    <div dir="rtl" className="w-full">
      <label
        style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: 'var(--muted-foreground)',
          marginBottom: '8px',
          textAlign: 'right',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-[6px] px-3.5 py-2 border border-[var(--border)] bg-[var(--input-background)] text-foreground text-right cursor-pointer appearance-none pr-10"
        style={{
          fontFamily: 'SimplerPro',
          fontSize: 'var(--text-sm)',
          direction: 'rtl',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
