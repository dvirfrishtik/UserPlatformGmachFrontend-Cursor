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
      className="fixed inset-0 z-[100] flex flex-col min-w-0 overflow-x-hidden overflow-y-auto"
      style={{ backgroundColor: '#FAFAFA', direction: 'rtl' }}
    >
      <div className="flex-1 flex flex-col min-h-full w-full min-w-0" dir="rtl" style={{ direction: 'rtl' }}>
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

        {/* Main – ממורכז אנכית, מותאם מובייל */}
        <div
          className="flex-1 flex items-center justify-center min-h-0 w-full min-w-0 overflow-x-hidden overflow-y-auto"
          style={{ direction: 'rtl' }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-center w-full flex-1 md:flex-initial gap-5 sm:gap-6 md:gap-[min(107px,8vw)] px-4 py-5 sm:py-6 md:py-10 max-w-[1250px] mx-auto min-w-0"
            style={{
              paddingLeft: 'max(16px, env(safe-area-inset-left))',
              paddingRight: 'max(16px, env(safe-area-inset-right))',
            }}
          >
            {/* Content column – מובייל: מתחת לאיור, דסקטופ: מימין; רוחב מלא במובייל */}
            <div
              className="flex flex-col items-start w-full md:w-auto order-2 md:order-0 flex-1 md:flex-initial min-w-0 max-w-full md:max-w-[min(480px,42%)]"
              style={{
                textAlign: 'right',
                alignSelf: 'stretch',
                alignItems: 'flex-start',
                gap: 'clamp(20px, 4vw, 50px)',
              }}
            >
              {/* Title – במובייל עטיפה, גודל קריא */}
              <h1
                className="text-right w-full md:whitespace-nowrap"
                style={{
                  fontFamily: 'SimplerPro',
                  fontWeight: 700,
                  fontSize: 'clamp(18px, 4vw, 32px)',
                  lineHeight: 1.25,
                  textAlign: 'right',
                  color: '#172554',
                  margin: 0,
                }}
              >
                תהליך בקשה ראשונית להלוואה
              </h1>

            {/* Block: מה כולל התהליך? */}
            <div className="flex flex-col gap-3 md:gap-5 w-full min-w-0" style={{ alignItems: 'flex-start' }}>
              <div className="flex flex-col gap-1.5 w-full min-w-0" style={{ alignItems: 'flex-start' }}>
                <h2
                  className="text-base sm:text-lg md:text-2xl font-semibold w-full"
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    textAlign: 'right',
                    color: '#172554',
                    margin: 0,
                  }}
                >
                  מה כולל התהליך?
                </h2>
                <p
                  className="text-sm md:text-base w-full min-w-0"
                  style={{
                    fontFamily: 'SimplerPro',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    textAlign: 'right',
                    color: '#141E44',
                    margin: 0,
                  }}
                >
                  מילוי פרטי הלווה המלאים, פרטי ההלוואה, בחירת יחידות למימוש, בחירת סכום להלוואה והגדרת ערבים (כמות הערבים הנדרשת תלויה בסכום ההלוואה).
                </p>
              </div>
              {/* Time badge */}
              <div
                className="flex flex-row justify-center items-center gap-1.5 shrink-0 px-2.5 py-1.5 md:px-3 md:py-2"
                style={{
                  background: '#CCA559',
                  borderRadius: '6px',
                  flexDirection: 'row-reverse',
                }}
              >
                <span
                  className="text-[11px] md:text-xs font-semibold"
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
                <Clock size={14} strokeWidth={1.25} className="shrink-0 md:w-4 md:h-4 w-3.5 h-3.5" style={{ color: '#141E44' }} />
              </div>
            </div>

            {/* Block: דברים שכדאי להכין */}
            <div className="flex flex-col gap-1 w-full min-w-0" style={{ alignItems: 'flex-start' }}>
              <h2
                className="text-sm sm:text-base md:text-xl font-semibold w-full"
                style={{
                  fontFamily: 'SimplerPro',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  textAlign: 'right',
                  color: '#172554',
                  margin: 0,
                }}
              >
                דברים שכדאי להכין מראש
              </h2>
              <p
                className="text-sm md:text-base w-full min-w-0"
                style={{
                  fontFamily: 'SimplerPro',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  textAlign: 'right',
                  color: '#141E44',
                  margin: 0,
                }}
              >
                ת.ז. וספח של הלווה
                <br />
                פרטי ערבים מלאים
              </p>
            </div>

            {/* Button – מובייל: full width, גובה נוח למגע */}
            <button
              type="button"
              onClick={() => onStartProcess?.()}
              className="w-full md:w-[370px] inline-flex flex-row justify-center items-center gap-2 shrink-0 transition-colors border-0 cursor-pointer hover:opacity-90 min-h-[48px] h-12 px-6 py-3 rounded-lg text-sm sm:text-base font-semibold"
              style={{
                background: '#172554',
                flexDirection: 'row-reverse',
                color: '#FFFFFF',
              }}
            >
              <ChevronLeft size={22} strokeWidth={2} className="shrink-0 w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#FFFFFF' }} />
              <span style={{ fontFamily: 'SimplerPro', fontWeight: 600, lineHeight: '100%', textAlign: 'right', color: '#FFFFFF' }}>
                להתחלת התהליך
              </span>
            </button>
          </div>

            {/* Illustration – מובייל: גודל נוח, דסקטופ: 515 */}
            <div
              className="flex-none flex items-center justify-center order-1 md:order-1 w-[min(220px,70vw)] h-[min(220px,70vw)] sm:w-[min(260px,75vw)] sm:h-[min(260px,75vw)] md:w-[min(515px,40vw)] md:h-[min(515px,40vw)] max-w-full min-w-0"
              style={{
                filter: 'drop-shadow(9.53704px 7.80303px 43.3502px rgba(33, 132, 213, 0.1))',
              }}
            >
              <Image
                src="/icons/loanreq1.svg"
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
