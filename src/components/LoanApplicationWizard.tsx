'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronDown, ChevronLeft, AlertTriangle, Info, Check, ExternalLink, User, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LoanRepaymentTable } from '@/components/LoanRepaymentTable';

/* ─── תנאים לבקשת הלוואה (תצוגה בפופאף) ─── */
const LOAN_TERMS_SECTIONS = [
  { title: '1. מטרת ההלוואה', body: 'ההלוואה ניתנת לצורכי מימון אישי/משפחתי בהתאם למדיניות הגמ"ח. השימוש בכספי ההלוואה חייב להיות בהתאם למטרה שצוינה בבקשה.' },
  { title: '2. זכאות', body: 'זכאי להגיש בקשה חבר/ת גמ"ח שמלאו לו 21 שנה, בעל עמדה פעילה (יחידות תרומה בתוקף) ומענה על דרישות הזכאות כפי שייקבעו מעת לעת.' },
  { title: '3. גובה ההלוואה והחזר', body: 'גובה ההלוואה נקבע לפי יחידות התרומה ומגבלות התקנון. ההחזר יבוצע בתשלומים חודשיים שווים לאורך תקופת ההלוואה (בדרך כלל עד 120 תשלומים), אלא אם נקבע אחרת.' },
  { title: '4. ריבית ועלויות', body: 'ההלוואה כפופה לריבית ולדמי ניהול כפי שייקבעו בתקנון הגמ"ח. כל עלות נוספת (ביטוח, עמלות וכו\') תתווסף בהתאם להסכם.' },
  { title: '5. לוח סילוקין', body: 'הגמ"ח ימסור ללווה לוח סילוקין מפורט. התאריך הראשון לתשלום ולמועדי התשלום החודשי ייקבעו בעת אישור ההלוואה.' },
  { title: '6. ערבות', body: 'בהתאם למדיניות הגמ"ח, ייתכן שיידרשו ערבים. הערבים יחויבו בהתחייבות כפי שייקבע בהסכם הערבות, ובמקרה של אי-עמידה בהחזר יופנה החיוב גם כלפיהם.' },
  { title: '7. ביטוח', body: 'הגמ"ח רשאי לדרוש ביטוח חיים או ביטוח משכנתא כנגד יתרת החוב, לטובת הגמ"ח, ככל שייקבע.' },
  { title: '8. איחור בתשלום', body: 'איחור בתשלום עלול לגרור ריבית פיגורים ו/או קנסות כפי שייקבעו בתקנון. אי-תשלום חוזר עלול להביא לפעולות לגביית החוב ולהשעיה או סיום חברות.' },
  { title: '9. ביטול והחזרה מוקדמת', body: 'הלווה רשאי להחזיר את ההלוואה לפני המועד, בהתאם להסדר החזרה מוקדמת שיפורסם. ביטול או שינוי לאחר חתימה עשויים להיות כרוכים בעלויות.' },
  { title: '10. שינוי תנאים', body: 'הגמ"ח שומר את הזכות לשנות תנאים (ריבית, דמי ניהול, כללים) בהתאם לתקנון ולהודיע על כך מראש. המשך שימוש בהלוואה לאחר שינוי עשוי להיחשב להסכמה.' },
  { title: '11. דיווח ומידע', body: 'הלווה מתחייב למסור מידע נכון ומלא ולעדכן על כל שינוי במצבו הכלכלי או האישי שעלול להשפיע על יכולת ההחזר.' },
  { title: '12. שמירת סודיות', body: 'כל המידע שמסר הלווה יישמר בסודיות וישמש רק לצורכי הטיפול בבקשה ובהלוואה, בהתאם לחוק ולמדיניות הגמ"ח.' },
  { title: '13. הגבלות', body: 'אסור להעביר את ההלוואה לצד שלישי או לשעבדה ללא אישור בכתב. שימוש בניגוד לתנאים עלול להביא לסיום ההלוואה ולדרישת החזר מיידי.' },
  { title: '14. דין וסמכות שיפוט', body: 'על ההלוואה והבקשה יחול דין מדינת ישראל. כל סכסוך יידון בפני הערכאות המוסמכות באזור מקום מושבו של הגמ"ח.' },
  { title: '15. אישור והצהרות', body: 'בהגשת הבקשה הלווה מצהיר שקרא והבין את התנאים, שהפרטים שמסר נכונים ומלאים, והוא מתחייב לעמוד בכל התנאים והחובות הנובעים מהלוואה זו.' },
];

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


/* ─── אווטר כרטיס (זהה לרכישת יחידות) ─── */
function BorrowerAvatarIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#EDD097" />
      <path fillRule="evenodd" clipRule="evenodd" d="M15.5008 14C15.5008 11.5147 17.5155 9.5 20.0008 9.5C22.4861 9.5 24.5008 11.5147 24.5008 14C24.5008 16.4853 22.4861 18.5 20.0008 18.5C17.5155 18.5 15.5008 16.4853 15.5008 14Z" fill="#172554" />
      <path fillRule="evenodd" clipRule="evenodd" d="M11.7521 28.1053C11.8294 23.6156 15.4928 20 20.0008 20C24.5089 20 28.1724 23.6157 28.2496 28.1056C28.2547 28.4034 28.0832 28.676 27.8125 28.8002C25.4335 29.8918 22.7873 30.5 20.0011 30.5C17.2147 30.5 14.5683 29.8917 12.1891 28.7999C11.9185 28.6757 11.7469 28.4031 11.7521 28.1053Z" fill="#172554" />
    </svg>
  );
}

/* ─── כרטיס בחירת ילד (זהה לרכישת יחידות) ─── */
function BorrowerChildCard({
  child,
  isSelected,
  onClick,
}: {
  child: ChildForLoan;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      className="flex items-center gap-3 sm:gap-4 w-full min-w-0 transition-all text-right"
      style={{
        padding: 'clamp(14px, 3vw, 20px) clamp(16px, 3.5vw, 24px)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: isSelected ? '1.5px solid #3B82F6' : '1.5px solid transparent',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: isSelected
          ? '0 0 12px rgba(59, 130, 246, 0.12)'
          : isHovered
            ? '0 0 12px rgba(24, 47, 67, 0.12)'
            : '0 0 12px rgba(24, 47, 67, 0.06)',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="shrink-0">
        <BorrowerAvatarIcon size={40} />
      </div>
      <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
        <p
          className="truncate w-full"
          style={{
            fontFamily: 'var(--font-family-base)',
            fontSize: 'clamp(15px, 2.5vw, 17px)',
            fontWeight: isSelected ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
            color: isSelected ? '#141E44' : '#495157',
            lineHeight: '24px',
            transition: 'color 0.2s ease',
          }}
        >
          {child.name}
        </p>
        <span
          style={{
            fontSize: 'clamp(13px, 2vw, 14px)',
            color: '#6B7280',
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: '20px',
          }}
        >
          {child.unitsCount} יח׳ ניתנות למימוש
        </span>
      </div>
    </button>
  );
}

/* ─── כרטיס "לווה אחר" (סגנון זהה, בלי אווטר ויחידות) ─── */
function BorrowerOtherCard({ isSelected, onClick }: { isSelected: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      className="flex items-center justify-center w-full min-w-0 transition-all text-right"
      style={{
        padding: 'clamp(14px, 3vw, 20px) clamp(16px, 3.5vw, 24px)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: isSelected ? '1.5px solid #3B82F6' : '1.5px solid transparent',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: isSelected
          ? '0 0 12px rgba(59, 130, 246, 0.12)'
          : isHovered
            ? '0 0 12px rgba(24, 47, 67, 0.12)'
            : '0 0 12px rgba(24, 47, 67, 0.06)',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: 'clamp(15px, 2.5vw, 17px)',
          fontWeight: isSelected ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
          color: isSelected ? '#141E44' : '#495157',
          lineHeight: '24px',
        }}
      >
        לווה אחר
      </span>
    </button>
  );
}

export interface LoanWizardStep1Data {
  fullName: string;
  idNumber: string;
  birthDate: string;
  selectedChildId: string;
  /** 'child' = נבחר ילד מהמשבצות, 'other' = לווה אחר (מציג שדה שם מלא) */
  borrowerType: 'child' | 'other' | '';
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

/* ─── כרטיס מטרת הלוואה (עיצוב זהה לכרטיסי ילדים) ─── */
function LoanPurposeCard({
  option,
  isSelected,
  onClick,
}: {
  option: (typeof LOAN_PURPOSE_OPTIONS)[number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      className="flex items-center gap-3 sm:gap-4 w-full min-w-0 transition-all text-right"
      style={{
        padding: 'clamp(14px, 3vw, 20px) clamp(16px, 3.5vw, 24px)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: isSelected ? '1.5px solid #3B82F6' : '1.5px solid transparent',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: isSelected
          ? '0 0 12px rgba(59, 130, 246, 0.12)'
          : isHovered
            ? '0 0 12px rgba(24, 47, 67, 0.12)'
            : '0 0 12px rgba(24, 47, 67, 0.06)',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
        <Image
          src={option.icon}
          alt={option.label}
          width={48}
          height={48}
          unoptimized
          style={{ opacity: isSelected ? 1 : 0.7, objectFit: 'contain' }}
        />
      </div>
      <div className="flex flex-col items-start min-w-0 flex-1">
        <p
          style={{
            fontFamily: 'var(--font-family-base)',
            fontSize: 'clamp(15px, 2.5vw, 17px)',
            fontWeight: isSelected ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
            color: isSelected ? '#141E44' : '#495157',
            lineHeight: '24px',
            transition: 'color 0.2s ease',
          }}
        >
          {option.label}
        </p>
      </div>
    </button>
  );
}

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
  contactMethod: 'borrower_email' | 'borrower_fax';
  borrowerEmail: string;
}

const CONTACT_METHOD_OPTIONS: { value: LoanWizardStep4Data['contactMethod']; label: string }[] = [
  { value: 'borrower_email', label: 'למייל' },
  { value: 'borrower_fax', label: 'לפקס' },
];

/* ─── כרטיס שיטת התקשרות (עיצוב זהה לכרטיסי ילדים/מטרת הלוואה, רדיו מימין לטקסט) ─── */
function ContactMethodCard({
  option,
  isSelected,
  onClick,
}: {
  option: (typeof CONTACT_METHOD_OPTIONS)[number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      className="flex items-center gap-3 sm:gap-4 w-full min-w-0 transition-all text-right"
      dir="rtl"
      style={{
        padding: 'clamp(14px, 3vw, 20px) clamp(16px, 3.5vw, 24px)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: isSelected ? '1.5px solid #3B82F6' : '1.5px solid transparent',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: isSelected
          ? '0 0 12px rgba(59, 130, 246, 0.12)'
          : isHovered
            ? '0 0 12px rgba(24, 47, 67, 0.12)'
            : '0 0 12px rgba(24, 47, 67, 0.06)',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* רדיו מימין לטקסט (ב-RTL האלמנט הראשון מופיע מימין) */}
      <span
        className="flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0"
        style={{
          border: `2px solid ${isSelected ? '#3B82F6' : 'var(--border)'}`,
        }}
      >
        {isSelected && (
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: '#3B82F6' }}
          />
        )}
      </span>
      <span
        className="flex-1 min-w-0 text-right"
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: 'clamp(15px, 2.5vw, 17px)',
          fontWeight: isSelected ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
          color: isSelected ? '#141E44' : '#495157',
          lineHeight: '24px',
          transition: 'color 0.2s ease',
        }}
      >
        {option.label}
      </span>
    </button>
  );
}

const emptyStep4: LoanWizardStep4Data = {
  contactMethod: 'borrower_email',
  borrowerEmail: '',
};

export interface LoanWizardStep5Data {
  termsAccepted: boolean;
}

const emptyStep5: LoanWizardStep5Data = {
  termsAccepted: false,
};

/** סכום זכאות למענק – לדוגמה (ניתן לחישוב לפי כללים) */
const DEFAULT_GRANT_ELIGIBILITY = 6000;

interface LoanApplicationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onExitAndSave?: () => void;
  /** נקרא בשלב 5 בלחיצה על "שליחת בקשה" */
  onSubmit?: () => void;
  /** רשימת ילדים + יחידות למימוש (מתאימה לדף יחידות תרומה). אם לא מועבר – משתמשים ברשימה ברירת מחדל. */
  childrenForLoan?: ChildForLoan[];
}

const emptyStep1: LoanWizardStep1Data = {
  fullName: '',
  idNumber: '',
  birthDate: '',
  selectedChildId: '',
  borrowerType: '',
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

export function LoanApplicationWizard({ isOpen, onClose, onExitAndSave, onSubmit, childrenForLoan = DEFAULT_CHILDREN_FOR_LOAN }: LoanApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [step1, setStep1] = useState<LoanWizardStep1Data>(emptyStep1);
  const [step2, setStep2] = useState<LoanWizardStep2Data>(emptyStep2);
  const [guarantors, setGuarantors] = useState<GuarantorData[]>(() => createEmptyGuarantors(5));
  const [step4, setStep4] = useState<LoanWizardStep4Data>(emptyStep4);
  const [step5, setStep5] = useState<LoanWizardStep5Data>(emptyStep5);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

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

  const handleSubmitRequest = () => {
    onSubmit?.();
    setShowSuccessScreen(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col min-w-0 overflow-x-hidden"
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

      {/* ─── Body: sidebar נמשך עד למטה, תוכן + פוטר לצידו (או מסך הצלחה) ─── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {showSuccessScreen ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-x-hidden overflow-y-auto py-8 px-4 sm:py-12 sm:px-6">
            <LoanWizardSuccessScreen contactEmail={step4.borrowerEmail} onClose={onClose} />
          </div>
        ) : (
          <>
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
                      role={clickable ? 'button' : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onClick={() => clickable && setCurrentStep(step.id)}
                      onKeyDown={(e) => {
                        if (!clickable) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setCurrentStep(step.id);
                        }
                      }}
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
            {/* Center – Form: כשתפריט המידע גלוי, האזור = בדיוק בין תפריט המידע (280+24) לוויזארד – בלי padding ימין כדי שהמרכז יהיה מדויק */}
            <div
              className={`flex-1 min-w-0 overflow-x-hidden overflow-y-auto py-6 px-4 sm:py-8 sm:px-6 md:px-12 flex flex-col items-center ${currentStep >= 1 && currentStep <= 3 ? 'lg:pl-[304px] lg:pr-0' : 'lg:px-16'}`}
            >
              {/* Mobile step indicator */}
              <div className="md:hidden flex flex-row items-center gap-2 mb-4 w-full max-w-full" style={{ justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'SimplerPro', fontSize: '12px', color: '#9CA3AF' }}>
                  שלב {currentStep} מתוך 5
                </span>
                <span style={{ fontFamily: 'SimplerPro', fontWeight: 600, fontSize: '14px', color: '#172554' }}>
                  {WIZARD_STEPS[currentStep - 1]?.label}
                </span>
              </div>

              <div key={currentStep} className="wizard-step-enter w-full max-w-full flex flex-col min-w-0">
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
                  <Step4Form step1={step1} step4={step4} setStep4={setStep4} />
                )}
                {currentStep === 5 && (
                  <Step5Form step1={step1} step2={step2} step5={step5} setStep5={setStep5} />
                )}
              </div>
            </div>

            {/* ── Info Panel – קופסה צפה דבוקה לשמאל (לא מוצג בשלבים 4 ו-5) ── */}
            {currentStep !== 4 && currentStep !== 5 && (
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
                </div>
              </div>
            )}
          </div>

          {/* ─── Footer – בתוך אזור התוכן, מותאם מובייל ─── */}
          <footer
            className="flex flex-row flex-wrap items-center justify-between gap-3 shrink-0 px-4 py-3 sm:px-6 sm:py-4 md:px-10"
            style={{
              background: 'var(--card)',
              borderTop: '1px solid var(--border)',
              minHeight: '64px',
            }}
          >
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center min-h-[44px] h-11 px-4 sm:px-6 rounded-lg font-semibold cursor-pointer transition-all hover:bg-[rgba(0,0,0,0.03)] text-sm sm:text-base"
              style={{
                fontFamily: 'SimplerPro',
                color: 'var(--primary)',
                background: 'transparent',
                border: '1.5px solid var(--primary)',
              }}
            >
              חזרה לשלב הקודם
            </button>

            <button
              type="button"
              onClick={currentStep === 5 ? handleSubmitRequest : handleContinue}
              className="inline-flex items-center justify-center min-h-[44px] h-11 px-5 sm:px-8 rounded-lg font-semibold border-0 cursor-pointer transition-opacity hover:opacity-90 text-sm sm:text-base"
              style={{
                fontFamily: 'SimplerPro',
                color: 'var(--primary-foreground)',
                background: 'var(--primary)',
              }}
            >
              {currentStep === 5 ? 'שליחת בקשה' : 'המשך לשלב הבא'}
            </button>
          </footer>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── אנימציית צ׳ק מארק – מסך הצלחה שליחת בקשה ─── */
function LoanWizardAnimatedCheckmark() {
  return (
    <div style={{ width: '120px', height: '120px', position: 'relative' }}>
      <style>{`
        @keyframes loan-success-circle-draw {
          0% { stroke-dashoffset: 314; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes loan-success-check-draw {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes loan-success-circle-fill {
          0% { fill: transparent; }
          100% { fill: rgba(59, 130, 246, 0.08); }
        }
        @keyframes loan-success-scale-bounce {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes loan-success-confetti-fall-1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-40px, 60px) rotate(360deg); opacity: 0; }
        }
        @keyframes loan-success-confetti-fall-2 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(35px, 55px) rotate(-270deg); opacity: 0; }
        }
        @keyframes loan-success-confetti-fall-3 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-20px, 70px) rotate(180deg); opacity: 0; }
        }
        @keyframes loan-success-confetti-fall-4 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(45px, 45px) rotate(-360deg); opacity: 0; }
        }
        @keyframes loan-success-confetti-fall-5 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50px, 40px) rotate(270deg); opacity: 0; }
        }
        @keyframes loan-success-confetti-fall-6 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(25px, 65px) rotate(-180deg); opacity: 0; }
        }
        .loan-success-check-circle {
          stroke-dasharray: 314;
          stroke-dashoffset: 314;
          animation: loan-success-circle-draw 0.6s ease-out 0.2s forwards, loan-success-circle-fill 0.4s ease-out 0.7s forwards;
        }
        .loan-success-check-mark {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: loan-success-check-draw 0.4s ease-out 0.7s forwards;
        }
        .loan-success-check-container {
          animation: loan-success-scale-bounce 0.5s ease-out 0.1s both;
        }
        .loan-success-confetti-dot { opacity: 0; }
        .loan-success-confetti-1 { animation: loan-success-confetti-fall-1 1s ease-out 1s forwards; }
        .loan-success-confetti-2 { animation: loan-success-confetti-fall-2 1.1s ease-out 1.05s forwards; }
        .loan-success-confetti-3 { animation: loan-success-confetti-fall-3 0.9s ease-out 1.1s forwards; }
        .loan-success-confetti-4 { animation: loan-success-confetti-fall-4 1.2s ease-out 1.02s forwards; }
        .loan-success-confetti-5 { animation: loan-success-confetti-fall-5 1s ease-out 1.08s forwards; }
        .loan-success-confetti-6 { animation: loan-success-confetti-fall-6 1.1s ease-out 1.15s forwards; }
      `}</style>
      <svg width="120" height="120" viewBox="0 0 120 120" className="loan-success-check-container">
        <circle className="loan-success-check-circle" cx="60" cy="60" r="50" stroke="#3B82F6" strokeWidth="4" fill="transparent" />
        <path className="loan-success-check-mark" d="M38 62 L52 76 L82 46" fill="none" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="loan-success-confetti-dot loan-success-confetti-1" cx="30" cy="20" r="3" fill="#3B82F6" />
        <rect className="loan-success-confetti-dot loan-success-confetti-2" x="85" y="15" width="6" height="6" rx="1" fill="#CCA559" />
        <circle className="loan-success-confetti-dot loan-success-confetti-3" cx="15" cy="55" r="2.5" fill="#172554" />
        <rect className="loan-success-confetti-dot loan-success-confetti-4" x="97" y="50" width="5" height="5" rx="1" fill="#3B82F6" />
        <circle className="loan-success-confetti-dot loan-success-confetti-5" cx="25" cy="90" r="3" fill="#CCA559" />
        <rect className="loan-success-confetti-dot loan-success-confetti-6" x="90" y="85" width="6" height="6" rx="1" fill="#172554" />
      </svg>
    </div>
  );
}

/* ─── מסך הצלחה לאחר שליחת בקשה ─── */
function LoanWizardSuccessScreen({
  contactEmail,
  onClose,
}: {
  contactEmail: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center max-w-[560px] w-full" style={{ textAlign: 'center' }}>
      <div style={{ width: '160px', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoanWizardAnimatedCheckmark />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: '22px',
          fontWeight: 'var(--font-weight-bold)',
          color: '#141E44',
          lineHeight: '30px',
          textAlign: 'center',
          marginTop: '32px',
          marginBottom: '8px',
        }}
      >
        הבקשה נשלחה בהצלחה
      </p>
      <p
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: '16px',
          color: '#495157',
          lineHeight: '24px',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        הגמ״ח יצור איתך קשר בהקדם.
      </p>
      <p
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: '16px',
          color: '#495157',
          lineHeight: '24px',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        {contactEmail
          ? `שטר ההלוואה יישלח לכתובת האימייל שמילאת: ${contactEmail}`
          : 'שטר ההלוואה יישלח לכתובת האימייל שמילאת בשלב פרטי התקשרות.'}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold border-0 cursor-pointer transition-opacity hover:opacity-90"
        style={{
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--text-base)',
          color: 'var(--primary-foreground)',
          backgroundColor: 'var(--primary)',
        }}
      >
        סגור
      </button>
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!isOpen) return null;
  const overlay = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-6 box-border"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 2, 4, 0.5)',
        backdropFilter: 'blur(6px)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative flex flex-col shrink-0"
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
  if (!mounted || typeof document === 'undefined' || !document.body) return null;
  return createPortal(overlay, document.body);
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!isOpen) return null;
  const overlay = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-6 box-border"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 2, 4, 0.5)',
        backdropFilter: 'blur(6px)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative flex flex-col shrink-0"
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
          <div className="flex flex-col items-center max-w-[560px] w-full mx-auto text-center">
            <Image
              src="/icons/warning.svg"
              alt=""
              width={80}
              height={80}
              unoptimized
              className="shrink-0 mb-6"
            />
            <h3
              className="mb-4 w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#141E44',
                lineHeight: 1.35,
                textAlign: 'center',
              }}
            >
              מימוש יחידות תרומה שלא נועדו עבור הלווה
              <br />
              דורשות אישור מיוחד
            </h3>
            <p
              className="mb-3 w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
                textAlign: 'center',
              }}
            >
              בקשת הלוואה מכוח תרומת יחידה שלא נועדה עבור הלווה המבוקש מחייבת בדיקה ואישור מיוחד של הגמ"ח.
            </p>
            <p
              className="mb-8 w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
                textAlign: 'center',
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
  if (!mounted || typeof document === 'undefined' || !document.body) return null;
  return createPortal(overlay, document.body);
}

/** גיל מינימלי: 17 שנים ו־10 חודשים (בחודשים) */
const MIN_AGE_MONTHS = 17 * 12 + 10;

function isUnderMinAge(birthDateStr: string): boolean {
  if (!birthDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(birthDateStr)) return false;
  const birth = new Date(birthDateStr + 'T12:00:00');
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months--;
  return months < MIN_AGE_MONTHS;
}

/* ─── פופאפ: גיל הלווה מתחת ל־17 ו־10 חודשים – דורש אישור מיוחד ─── */
function UnderAgeApprovalPopup({
  isOpen,
  onClose,
  onProceed,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!isOpen) return null;
  const overlay = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-6 box-border"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 2, 4, 0.5)',
        backdropFilter: 'blur(6px)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative flex flex-col shrink-0"
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
            גיל הלווה דורש אישור מיוחד
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
          <div className="flex flex-col items-center max-w-[560px] w-full mx-auto text-center">
            <Image
              src="/icons/warning.svg"
              alt=""
              width={80}
              height={80}
              unoptimized
              className="shrink-0 mb-6"
            />
            <h3
              className="mb-4 w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#141E44',
                lineHeight: 1.35,
                textAlign: 'center',
              }}
            >
              תאריך הלידה שנבחר מראה שהלווה צעיר מ־17 שנים ו־10 חודשים.
              <br />
              בקשת הלוואה במצב זה דורשת אישור מיוחד.
            </h3>
            <p
              className="mb-3 w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
                textAlign: 'center',
              }}
            >
              בקשת הלוואה עבור לווה מתחת לגיל המינימלי מחייבת בדיקה ואישור מיוחד של הגמ״ח.
            </p>
            <p
              className="mb-8 w-full"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                color: '#495157',
                lineHeight: 1.6,
                textAlign: 'center',
              }}
            >
              המשך התהליך תלוי באישור הגמ״ח ועשוי להאריך משמעותית את זמן הטיפול בבקשה.
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
              borderColor: 'var(--border)',
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
  if (!mounted || typeof document === 'undefined' || !document.body) return null;
  return createPortal(overlay, document.body);
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
  const [showUnderAgePopup, setShowUnderAgePopup] = useState(false);

  const isNameInList = step1.fullName.trim() && childrenForLoan.some((c) => c.name === step1.fullName.trim());
  const handleIdNumberFocus = () => {
    // בוטל: לא מציגים פופאף "הוספת לווה שלא נתרמו עבורו יחידות" בעת הקלדת שם אחר
  };

  const handleOtherBorrowerProceed = () => {
    setShowOtherBorrowerPopup(false);
    setOtherBorrowerApproved(true);
  };

  const handleBirthDateChange = (v: string) => {
    setStep1((p) => ({ ...p, birthDate: v }));
    if (isUnderMinAge(v)) setShowUnderAgePopup(true);
  };

  return (
    <>
      <OtherBorrowerApprovalPopup
        isOpen={showOtherBorrowerPopup}
        onClose={() => setShowOtherBorrowerPopup(false)}
        onProceed={handleOtherBorrowerProceed}
      />
      <UnderAgeApprovalPopup
        isOpen={showUnderAgePopup}
        onClose={() => setShowUnderAgePopup(false)}
        onProceed={() => setShowUnderAgePopup(false)}
      />
      <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[720px] mb-8" style={{ textAlign: 'right' }}>
        <h2
          style={{
            fontFamily: 'var(--font-family-base)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--text-xl)',
            color: 'var(--primary)',
            lineHeight: 1.3,
          }}
        >
          פרטי הלווה
        </h2>
      </div>
      <div className="flex flex-col gap-5 max-w-[720px] w-full min-w-0">
        {/* כרטיסיות ילדים + לווה אחר – כמו בפופאפ רכישת יחידות */}
        <div className="w-full flex flex-col items-end" dir="rtl">
          <p
            className="w-full mb-4 sm:mb-5"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              color: '#141E44',
              fontWeight: 'var(--font-weight-normal)',
              textAlign: 'right',
              lineHeight: '20px',
            }}
          >
            יש לבחור ילד/ה או לווה אחר:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-3 sm:gap-[14px]">
            {childrenForLoan.map((child) => {
              const isSelected = step1.borrowerType === 'child' && step1.selectedChildId === child.id;
              return (
                <BorrowerChildCard
                  key={child.id}
                  child={child}
                  isSelected={isSelected}
                  onClick={() =>
                    setStep1((p) => ({
                      ...p,
                      borrowerType: 'child',
                      selectedChildId: child.id,
                      fullName: child.name,
                    }))
                  }
                />
              );
            })}
            <BorrowerOtherCard
              isSelected={step1.borrowerType === 'other'}
              onClick={() =>
                setStep1((p) => ({
                  ...p,
                  borrowerType: 'other',
                  selectedChildId: '',
                  fullName: '',
                }))
              }
            />
          </div>
        </div>

        {/* שם מלא (רק בלווה אחר) | ת.ז. | תאריך לידה – באותה שורה */}
        <div
          className={`grid gap-4 ${step1.borrowerType === 'other' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}
        >
          {step1.borrowerType === 'other' && (
            <WizardInput
              label="שם מלא"
              value={step1.fullName}
              onChange={(v) => setStep1((p) => ({ ...p, fullName: v }))}
              placeholder="הזן שם מלא"
            />
          )}
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
            onChange={handleBirthDateChange}
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-0">
            {MARITAL_OPTIONS.map((opt, i) => {
              const selected = step1.maritalStatus === opt.value;
              const isFirst = i === 0;
              const isLast = i === MARITAL_OPTIONS.length - 1;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStep1((p) => ({ ...p, maritalStatus: opt.value }))}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] h-11 cursor-pointer transition-all border"
                  style={{
                    fontFamily: 'var(--font-family-base)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    color: selected ? '#172554' : 'var(--muted-foreground)',
                    background: selected ? '#EFF6FF' : 'var(--card)',
                    borderColor: selected ? '#BFDBFE' : 'var(--border)',
                    borderRadius: isFirst ? '0 999px 999px 0' : isLast ? '999px 0 0 999px' : 0,
                    marginRight: isFirst ? 0 : -1,
                    position: 'relative',
                    zIndex: selected ? 1 : 0,
                  }}
                >
                  <span
                    className="flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0"
                    style={{
                      border: `2px solid ${selected ? '#93C5FD' : 'var(--border)'}`,
                    }}
                  >
                    {selected && (
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: '#3B82F6' }}
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
            className="rounded-xl px-4 py-4 sm:px-6 sm:py-6 mt-2"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E9F9',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.06)',
            }}
          >
            <h3
              className="mb-4"
              style={{
                fontFamily: 'var(--font-family-base)',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--text-base)',
                color: '#141E44',
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
        className={
          type === 'date'
            ? 'wizard-date-input w-full h-9 rounded-md border border-border bg-input-background px-3 text-sm placeholder:text-[#9CA3AF]'
            : 'w-full h-9 rounded-md border border-border bg-input-background text-right px-3 text-sm placeholder:text-[#9CA3AF]'
        }
        style={{
          fontFamily: 'var(--font-family-base)',
          color: 'var(--foreground)',
          direction: 'rtl',
          textAlign: 'right',
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
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[720px] mb-6" style={{ textAlign: 'right' }}>
          <h2
            style={{
              fontFamily: 'var(--font-family-base)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: 'var(--text-xl)',
              color: 'var(--primary)',
              lineHeight: 1.3,
            }}
          >
            מטרת ההלוואה
          </h2>
        </div>
        <div className="flex flex-col gap-5 max-w-[720px] w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-3 sm:gap-[14px]">
            {LOAN_PURPOSE_OPTIONS.map((opt) => (
              <LoanPurposeCard
                key={opt.value}
                option={opt}
                isSelected={step2.loanPurpose === opt.value}
                onClick={() => setStep2((p) => ({ ...p, loanPurpose: opt.value }))}
              />
            ))}
          </div>
          {step2.loanPurpose === 'other' && (
            <div className="mt-1">
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
                יש לפרט את מטרת ההלוואה
              </label>
              <Input
                type="text"
                dir="rtl"
                placeholder="לדוגמה: סגירת הלוואות קיימות, הוצאות רפואיות, שיפוץ דירה וכד׳"
                className="w-full h-auto min-h-[44px] rounded-md border border-border bg-input-background text-right px-3 py-2 text-sm placeholder:text-[#9CA3AF]"
                style={{
                  fontFamily: 'var(--font-family-base)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── יחידות תרומה עבורן תבוקש ההלוואה ─── */}
      <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[720px] mt-12 mb-6" style={{ textAlign: 'right' }}>
        <h2
          style={{
            fontFamily: 'var(--font-family-base)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--text-xl)',
            color: 'var(--primary)',
            lineHeight: 1.3,
          }}
        >
          יחידות תרומה עבורן תבוקש ההלוואה:
        </h2>
      </div>
      <div className="flex flex-col gap-6 max-w-[720px] w-full min-w-0">
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

      {/* ─── Summary bar – fixed at bottom, gradient background ─── */}
      {totalSelected > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center pointer-events-none">
          <div
            className="pointer-events-auto flex flex-row flex-wrap items-center justify-between gap-2 max-w-[720px] w-[min(720px,92vw)] rounded-full px-5 py-3 sm:px-6 sm:py-3.5"
            dir="rtl"
            style={{
              background: 'linear-gradient(196.765deg, rgb(23, 37, 84) 0%, rgb(7, 13, 35) 100%)',
              border: '1.5px solid rgba(250, 204, 21, 0.75)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.45)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: '#F9FAFB',
              }}
            >
              סה״כ נבחרו: {totalSelected} יחידות
              <span style={{ margin: '0 8px', color: '#FACC15' }}>|</span>
              סכום להלוואה: {totalLoanAmount.toLocaleString('he-IL')}₪
            </span>
            <div className="flex flex-row items-center gap-2">
              <Info size={14} style={{ color: '#FACC15' }} />
              <span
                style={{
                  fontFamily: 'var(--font-family-base)',
                  fontSize: 'var(--text-sm)',
                  color: '#E5E7EB',
                }}
              >
                החזר חודשי צפוי: ~{monthlyPayment.toLocaleString('he-IL')}₪
              </span>
            </div>
          </div>
        </div>
      )}
      </div>
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
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onToggle}
      dir="rtl"
      className="flex flex-col w-full min-w-0 transition-all text-right cursor-pointer outline-none"
      style={{
        padding: 'clamp(14px, 3vw, 20px) clamp(16px, 3.5vw, 24px)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: selected ? '1.5px solid #3B82F6' : '1.5px solid transparent',
        boxShadow: selected
          ? '0 0 12px rgba(59, 130, 246, 0.12)'
          : isHovered
            ? '0 0 12px rgba(24, 47, 67, 0.12)'
            : '0 0 12px rgba(24, 47, 67, 0.06)',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top row: icon+title on the right, checkbox on the left (RTL) */}
      <div className="flex flex-row items-center justify-between w-full mb-3">
        <div className="flex flex-row items-center gap-1.5">
          <Image src="/icons/units.svg" alt="" width={16} height={16} unoptimized className="shrink-0" />
          <span
            style={{
              fontFamily: 'var(--font-family-base)',
              fontWeight: selected ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              color: selected ? '#141E44' : '#495157',
              transition: 'color 0.2s ease',
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

      {/* Data row – RTL: עבור, שנת ייעוד, זכאות הלוואה – יישור לימין, ללא שבירת שורות */}
      <div className="flex flex-row items-stretch w-full gap-4" style={{ direction: 'rtl' }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-end flex-1 min-w-0 cursor-help">
              <span
                className="block w-full"
                style={{
                  fontFamily: 'var(--font-family-base)',
                  fontSize: '11px',
                  color: '#9CA3AF',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}
              >
                עבור
              </span>
              <span
                className="block w-full truncate"
                style={{
                  fontFamily: 'var(--font-family-base)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#172554',
                  textAlign: 'right',
                }}
              >
                {unit.forName}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={6}
            className="max-w-[280px] break-words text-right"
          >
            {unit.forName}
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-col items-end flex-1 min-w-0">
          <span
            className="block w-full"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: '11px',
              color: '#9CA3AF',
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            שנת ייעוד
          </span>
          <span
            className="block w-full"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#172554',
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            {unit.year}
          </span>
        </div>
        <div className="flex flex-col items-end flex-1 min-w-0">
          <span
            className="block w-full"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: '11px',
              color: '#9CA3AF',
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            זכאות הלוואה
          </span>
          <span
            className="block w-full"
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#172554',
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
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
      <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[720px] mb-6" style={{ textAlign: 'right' }}>
        <h2
          style={{
            fontFamily: 'var(--font-family-base)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--text-xl)',
            color: 'var(--primary)',
            lineHeight: 1.3,
          }}
        >
          הגדרת ערבים
        </h2>
      </div>
      <div className="flex flex-col gap-3 max-w-[720px] w-full min-w-0">
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
                    <Trash2 size={18} style={{ color: '#6B7280' }} />
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
  { label: string; placeholder: string; inputType: 'email' | 'tel' }
> = {
  borrower_email: { label: 'כתובת אימייל לשליחת השטר', placeholder: 'הזן כתובת אימייל', inputType: 'email' },
  borrower_fax: { label: "מס׳ פקס לשליחת השטר", placeholder: "הזן מס׳ פקס", inputType: 'tel' },
};

function Step4Form({
  step1,
  step4,
  setStep4,
}: {
  step1: LoanWizardStep1Data;
  step4: LoanWizardStep4Data;
  setStep4: React.Dispatch<React.SetStateAction<LoanWizardStep4Data>>;
}) {
  const fieldConfig = CONTACT_FIELD_CONFIG[step4.contactMethod];
  return (
    <>
      <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[720px] mb-6" style={{ textAlign: 'right' }}>
        <h2
          style={{
            fontFamily: 'var(--font-family-base)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--text-xl)',
            color: 'var(--primary)',
            lineHeight: 1.3,
          }}
        >
          לאן לשלוח את שטר ההלוואה?
        </h2>
      </div>
      <div dir="rtl" className="flex flex-col max-w-[720px] w-full min-w-0">
      {/* Contact method options – כרטיסים כמו בשלב 1 ו-2, רדיו מימין לטקסט */}
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3 sm:gap-[14px] mb-6">
        {CONTACT_METHOD_OPTIONS.map((opt) => (
          <ContactMethodCard
            key={opt.value}
            option={opt}
            isSelected={step4.contactMethod === opt.value}
            onClick={() =>
              setStep4((p) => ({
                ...p,
                contactMethod: opt.value,
                borrowerEmail: opt.value === 'borrower_email' ? step1.email : p.borrowerEmail,
              }))
            }
          />
        ))}
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
      </div>
    </>
  );
}

/* ─── Step 5: סיכום והגשה ─── */
function Step5Form({
  step1,
  step2,
  step5,
  setStep5,
}: {
  step1: LoanWizardStep1Data;
  step2: LoanWizardStep2Data;
  step5: LoanWizardStep5Data;
  setStep5: React.Dispatch<React.SetStateAction<LoanWizardStep5Data>>;
}) {
  const [showPaymentDetailTable, setShowPaymentDetailTable] = useState(false);
  const [termsPopupOpen, setTermsPopupOpen] = useState(false);
  const [termsScrollError, setTermsScrollError] = useState(false);
  const termsScrollRef = useRef<HTMLDivElement>(null);
  const totalUnits = step2.selectedUnitIds.length;
  const totalLoanAmount = DEFAULT_DONATION_UNITS
    .filter((u) => step2.selectedUnitIds.includes(u.id))
    .reduce((sum, u) => sum + u.loanEntitlement, 0);
  const monthlyPayment = totalUnits > 0 ? Math.round(totalLoanAmount / 120) : 0;
  const grantAmount = DEFAULT_GRANT_ELIGIBILITY;
  /** רשימת מס׳ יחידות שנבחרו (ממוינת, עם פסיקים, לדוגמה: 7,8,12,15) */
  const selectedUnitNumbersList = DEFAULT_DONATION_UNITS
    .filter((u) => step2.selectedUnitIds.includes(u.id))
    .map((u) => u.unitNumber)
    .sort((a, b) => a - b)
    .join(',');

  const cardStyle = {
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px 20px',
    flex: '1 1 0',
    minWidth: 0,
  };
  const labelStyle = {
    fontFamily: 'var(--font-family-base)' as const,
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--muted-foreground)',
    textAlign: 'right' as const,
    marginBottom: 4,
  };
  const valueStyle = {
    fontFamily: 'var(--font-family-base)' as const,
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--primary)',
    textAlign: 'right' as const,
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[720px] mb-6" style={{ textAlign: 'right' }}>
        <h2
          style={{
            fontFamily: 'var(--font-family-base)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--text-xl)',
            color: 'var(--primary)',
            lineHeight: 1.3,
          }}
        >
          סיכום הבקשה להלוואה
        </h2>
      </div>
    <div dir="rtl" className="flex flex-col max-w-[720px] w-full min-w-0 gap-6">
      {/* 4 כרטיסי סיכום – RTL: ראשון מימין עבור + שם, אחריו סכום הלוואה, זכאות למענק, יח׳ תרומה (רשימת מספרים) */}
      <div className="flex flex-row gap-4 flex-wrap" style={{ direction: 'rtl' }}>
        <div style={cardStyle}>
          <div style={labelStyle}>עבור</div>
          <div style={valueStyle}>{step1.fullName || '—'}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>סכום ההלוואה</div>
          <div style={valueStyle}>₪{totalLoanAmount.toLocaleString('he-IL')}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>סכום זכאות למענק</div>
          <div style={valueStyle}>₪{grantAmount.toLocaleString('he-IL')}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>עבור יח׳ תרומה</div>
          <div style={valueStyle}>{selectedUnitNumbersList || '—'}</div>
        </div>
      </div>

      {/* החזר חודשי צפוי + כפתור פירוט – רקע לבן; מימין: הטקסט, משמאל: הכפתור */}
      <div
        className="rounded-xl w-full flex flex-col gap-3"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '20px',
        }}
      >
        <div
          className="flex flex-row items-center gap-4"
          style={{ direction: 'rtl', justifyContent: 'space-between', flexWrap: 'wrap' }}
        >
          <div className="flex flex-row items-center gap-2" style={{ direction: 'rtl' }}>
            <span
              style={{
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--foreground)',
              }}
            >
              החזר חודשי צפוי: ~₪{monthlyPayment.toLocaleString('he-IL')}
            </span>
            <Info size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} aria-hidden />
          </div>
          <button
            type="button"
            onClick={() => setShowPaymentDetailTable((v) => !v)}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[rgba(0,0,0,0.04)] shrink-0"
            style={{
              fontFamily: 'var(--font-family-base)',
              color: 'var(--muted-foreground)',
              background: '#F8FAFC',
              borderColor: 'var(--border)',
            }}
          >
            {showPaymentDetailTable ? 'צמצום תצוגה' : 'הצגת פירוט תשלומים צפוי'}
          </button>
        </div>
        {showPaymentDetailTable && (
          <LoanRepaymentTable principal={totalLoanAmount} months={120} />
        )}
      </div>

      {/* תנאים ואישור – לחיצה פותחת פופאף; הצ'ק בוקס מסומן רק אחרי אישור בפופאף */}
      <div
        className="rounded-xl w-full flex flex-row-reverse items-start gap-3"
        style={{
          background: '#F1F5F9',
          border: '1px solid #E2E8F0',
          padding: '16px 20px',
        }}
      >
        <button
          type="button"
          onClick={() => setTermsPopupOpen(true)}
          className="flex-1 text-right cursor-pointer border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
          style={{
            fontFamily: 'var(--font-family-base)',
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground)',
            lineHeight: 1.5,
          }}
        >
          אני מאשר שקראתי והבנתי את התנאים המשפטיים להגשת בקשה ראשונית להלוואה דרך הגמ"ח המרכזי
        </button>
        <Checkbox
          checked={step5.termsAccepted}
          aria-label="אישור תנאים"
        />
      </div>

      {/* פופאף תנאים – גודל כמו שאר הפופאפים, dir=rtl כדי שה-X יהיה בימין */}
      <Dialog
        open={termsPopupOpen}
        onOpenChange={(open) => {
          setTermsPopupOpen(open);
          if (!open) setTermsScrollError(false);
        }}
      >
        <DialogContent
          dir="rtl"
          className="p-0 gap-0 flex flex-col"
          style={{
            width: 'min(1100px, 92vw)',
            maxWidth: 'min(1100px, 92vw)',
            height: 'min(900px, 90vh)',
            maxHeight: '90vh',
            background: 'linear-gradient(180deg, #F7F8FA 0%, #F7F8FA 100%)',
            borderRadius: '12px',
            border: '1px solid #E5E9F9',
            boxShadow: '0 0 12px rgba(24, 47, 67, 0.08), 0 32px 64px -16px rgba(23, 37, 84, 0.18)',
            overflow: 'hidden',
          }}
        >
          <DialogHeader
            className="flex flex-row items-center justify-between shrink-0 px-6 sm:px-8 py-5 border-b border-[var(--border)]"
            style={{ direction: 'rtl' }}
          >
            <div style={{ width: '36px' }} />
            <DialogTitle
              className="text-xl font-bold leading-tight m-0 flex-1 text-center"
              style={{
                fontFamily: 'var(--font-family-base)',
                color: 'var(--foreground)',
              }}
            >
              תנאים לבקשת הלוואה
            </DialogTitle>
            <div style={{ width: '36px' }} />
          </DialogHeader>
          <div
            ref={termsScrollRef}
            className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 min-h-0 flex justify-center"
            dir="rtl"
            onScroll={() => {
              const el = termsScrollRef.current;
              if (!el || !termsScrollError) return;
              const threshold = 30;
              if (el.scrollHeight - el.scrollTop - el.clientHeight <= threshold) setTermsScrollError(false);
            }}
          >
            <div
              className="text-right w-full"
              style={{
                maxWidth: 'min(42rem, 85%)',
                fontFamily: 'var(--font-family-base)',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: 1.6,
                marginInline: 'auto',
              }}
            >
              {LOAN_TERMS_SECTIONS.map((section) => (
                <div key={section.title} className="mb-4 last:mb-0">
                  <div
                    className="font-semibold mb-1"
                    style={{ color: 'var(--primary)' }}
                  >
                    {section.title}
                  </div>
                  <p className="m-0 text-[var(--foreground)]">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
          {termsScrollError && (
            <div
              className="shrink-0 mx-6 mb-2 px-4 py-2 rounded-lg text-right text-sm font-medium"
              style={{
                fontFamily: 'var(--font-family-base)',
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                color: 'var(--destructive)',
              }}
              role="alert"
            >
              יש לגלול עד הסוף ולקרוא את כל התנאים
            </div>
          )}
          <div
            className="w-full flex flex-row justify-center items-center gap-3 shrink-0 px-6 sm:px-8 py-5 border-t border-[var(--border)]"
            style={{ direction: 'rtl' }}
          >
            <button
              type="button"
              onClick={() => setTermsPopupOpen(false)}
              className="inline-flex items-center justify-center min-h-[44px] h-11 px-4 sm:px-6 rounded-lg font-semibold cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.03)] text-sm sm:text-base"
              style={{
                fontFamily: 'SimplerPro',
                color: 'var(--primary)',
                background: 'transparent',
                border: '1.5px solid var(--primary)',
              }}
            >
              סגירת חלון
            </button>
            <button
              type="button"
              onClick={() => {
                const el = termsScrollRef.current;
                if (!el) return;
                const threshold = 30;
                const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
                if (!atBottom) {
                  setTermsScrollError(true);
                  el.focus();
                  return;
                }
                setTermsScrollError(false);
                setStep5((p) => ({ ...p, termsAccepted: true }));
                setTermsPopupOpen(false);
              }}
              className="inline-flex items-center justify-center min-h-[44px] h-11 px-5 sm:px-8 rounded-lg font-semibold border-0 cursor-pointer transition-opacity hover:opacity-90 text-sm sm:text-base"
              style={{
                fontFamily: 'SimplerPro',
                color: 'var(--primary-foreground)',
                background: 'var(--primary)',
              }}
            >
              אני מאשר את התנאים
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
      </div>
    </>
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
