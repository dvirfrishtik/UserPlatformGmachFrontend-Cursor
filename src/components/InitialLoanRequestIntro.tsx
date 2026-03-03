'use client';

import Image from 'next/image';
import { X, ChevronLeft, Clock } from 'lucide-react';

interface InitialLoanRequestIntroProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProcess?: () => void;
}

export function InitialLoanRequestIntro({ isOpen, onClose, onStartProcess }: InitialLoanRequestIntroProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto"
      style={{ backgroundColor: '#FAFAFA', direction: 'rtl' }}
    >
      <div className="flex-1 flex flex-col min-h-full w-full" dir="rtl" style={{ direction: 'rtl' }}>
        {/* Header – רספונסיבי: מובייל מצומצם, דסקטופ מלא */}
        <header
          className="flex flex-row justify-between items-center shrink-0 px-4 py-3 min-h-[56px] md:min-h-[72px] md:px-[38px] md:py-4"
          style={{
            background: '#F8FAFC',
            borderBottom: '1px solid #E8EDF2',
            boxShadow: '9.53704px 7.80303px 43.3502px rgba(33, 132, 213, 0.1)',
            direction: 'rtl',
          }}
        >
          <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1" style={{ textAlign: 'right' }}>
            <span className="text-base md:text-xl font-bold truncate max-w-[85vw] md:max-w-none" style={{ fontFamily: 'SimplerPro', color: '#172554' }}>
              תהליך בקשת הלוואה
            </span>
            <span className="text-xs md:text-sm" style={{ fontFamily: 'SimplerPro', fontWeight: 400, color: '#495157' }}>
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

        {/* Main – ממורכז אנכית, גרסת מובייל + דסקטופ */}
        <div
          className="flex-1 flex items-center justify-center min-h-0 w-full overflow-auto"
          style={{ direction: 'rtl' }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-center w-full flex-1 md:flex-initial gap-6 md:gap-[min(107px,8vw)] px-4 py-6 md:py-10 max-w-[1250px] mx-auto"
            style={{
              paddingLeft: 'clamp(16px, 4vw, 40px)',
              paddingRight: 'clamp(16px, 4vw, 40px)',
            }}
          >
            {/* Content column – מובייל: מלמטה, דסקטופ: מימין */}
            <div
              className="flex flex-col items-start w-full md:w-auto order-2 md:order-0 flex-1 md:flex-initial min-w-0"
              style={{
                maxWidth: 'min(617px, 49%)',
                flex: '1 1 auto',
                textAlign: 'right',
                alignSelf: 'stretch',
                alignItems: 'flex-start',
                gap: 'clamp(24px, 5vw, 50px)',
              }}
            >
              {/* Title – תמיד שורה אחת, גודל רספונסיבי לרוחב המסך (לא נחתך) */}
              <h1
                className="text-right w-full whitespace-nowrap"
                style={{
                  fontFamily: 'SimplerPro',
                  fontWeight: 700,
                  fontSize: 'clamp(12px, 2.8vw, 45px)',
                  lineHeight: 1.2,
                  textAlign: 'right',
                  color: '#172554',
                  margin: 0,
                }}
              >
                תהליך בקשה ראשונית להלוואה
              </h1>

            {/* Block: מה כולל התהליך? – מובייל: גופנים קטנים יותר */}
            <div className="flex flex-col gap-3 md:gap-5 w-full" style={{ alignItems: 'flex-start' }}>
              <div className="flex flex-col gap-1 w-full" style={{ alignItems: 'flex-start' }}>
                <h2
                  className="text-lg md:text-2xl font-semibold"
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: 600,
                    lineHeight: '36px',
                    textAlign: 'right',
                    color: '#172554',
                    margin: 0,
                  }}
                >
                  מה כולל התהליך?
                </h2>
                <p
                  className="text-sm md:text-base"
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: 400,
                    lineHeight: '150%',
                    textAlign: 'right',
                    color: '#141E44',
                    margin: 0,
                  }}
                >
                  התהליך כולל בחירת יחידות למימוש, אימות פרטי הלווה, הגדרת מטרת ההלוואה, הוספת שני ערבים וחתימה דיגיטלית על המסמכים. לאחר השלמת הבקשה, היא תועבר לגמ״ח לבדיקה מקיפה שלנו.
                </p>
              </div>
              {/* Time badge – מובייל: קטן יותר */}
              <div
                className="flex flex-row justify-center items-center gap-2 shrink-0 px-3 py-2 md:px-4 md:py-2"
                style={{
                  background: '#CCA559',
                  borderRadius: '8px',
                  minHeight: '32px',
                  flexDirection: 'row-reverse',
                }}
              >
                <span
                  className="text-xs md:text-sm font-semibold"
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: 600,
                    lineHeight: '150%',
                    textAlign: 'right',
                    color: '#141E44',
                  }}
                >
                  זמן תהליך משוער 15-20 דקות
                </span>
                <Clock size={18} strokeWidth={1.25} className="shrink-0 md:w-5 md:h-5 w-4 h-4" style={{ color: '#141E44' }} />
              </div>
            </div>

            {/* Block: דברים שכדאי להכין */}
            <div className="flex flex-col gap-1 w-full" style={{ alignItems: 'flex-start' }}>
              <h2
                className="text-base md:text-xl font-semibold"
                style={{
                  fontFamily: 'SimplerPro',
                  fontWeight: 600,
                  lineHeight: '36px',
                  textAlign: 'right',
                  color: '#172554',
                  margin: 0,
                }}
              >
                דברים שכדאי להכין מראש
              </h2>
              <p
                className="text-sm md:text-base"
                style={{
                  fontFamily: 'SimplerPro',
                  fontWeight: 400,
                  lineHeight: '150%',
                  textAlign: 'right',
                  color: '#141E44',
                  margin: 0,
                }}
              >
                פרטים מלאים של הלווה, כולל ת.ז. וספח
                <br />
                פרטים מלאים של שני ערבים (כולל טלפון ואימייל)
              </p>
            </div>

            {/* Button – מובייל: full width, דסקטופ: 370px */}
            <button
              type="button"
              onClick={() => onStartProcess?.()}
              className="w-full md:w-[370px] inline-flex flex-row justify-center items-center gap-2 shrink-0 transition-colors border-0 cursor-pointer hover:opacity-90 h-12 md:h-12 px-6 py-3 rounded-lg text-base font-semibold"
              style={{
                background: '#172554',
                flexDirection: 'row-reverse',
              }}
            >
              <ChevronLeft size={24} strokeWidth={2} className="shrink-0 w-6 h-6" style={{ color: '#FFFFFF' }} />
              <span style={{ fontFamily: 'SimplerPro', fontWeight: 600, lineHeight: '100%', textAlign: 'right', color: '#FFFFFF' }}>
                להתחלת התהליך
              </span>
            </button>
          </div>

            {/* Illustration – מובייל: קטן יותר, דסקטופ: 515 */}
            <div
              className="flex-none flex items-center justify-center order-1 md:order-1 w-[min(260px,75vw)] h-[min(260px,75vw)] md:w-[min(515px,40vw)] md:h-[min(515px,40vw)] max-w-full"
              style={{
                filter: 'drop-shadow(9.53704px 7.80303px 43.3502px rgba(33, 132, 213, 0.1))',
              }}
            >
              <Image
                src="/icons/loan.svg"
                alt=""
                width={515}
                height={515}
                unoptimized
                className="object-contain"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
