'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { InitialLoanRequestIntro } from '@/components/InitialLoanRequestIntro';
import { LoanApplicationWizard } from '@/components/LoanApplicationWizard';

// Mock: whether user has units ready for loan realization (could come from API)
const hasUnitsReadyForLoan = true;
const inProgressCount = 0;

export default function LoanRequestsPage() {
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="w-full min-w-0 overflow-x-hidden" dir="rtl">
      {/* Page title */}
      <h1
        className="text-right mb-6 md:mb-8"
        style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 700,
          color: '#141E44',
          lineHeight: 1.3,
        }}
      >
        בקשות הלוואה
      </h1>

      {/* Block 1: יחידות זמינות למימוש + CTA */}
      <div
        className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[var(--border)]"
        style={{
          padding: 'clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 32px)',
          backgroundColor: 'var(--page-section)',
          marginBottom: '24px',
        }}
      >
        <p
          className="text-right flex-1 m-0"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--foreground)',
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: 1.5,
          }}
        >
          שמנו לב שיש לך יחידות זמינות למימוש
          <span style={{ color: 'var(--muted-foreground)', marginRight: '4px' }}>››</span>
        </p>
        <button
          type="button"
          onClick={() => setIsIntroOpen(true)}
          className="inline-flex items-center justify-center gap-2 shrink-0 transition-colors rounded-lg border-0 cursor-pointer"
          style={{
            height: '44px',
            padding: '0 24px',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-semibold)',
            color: '#FFFFFF',
            backgroundColor: '#141E44',
            flexDirection: 'row-reverse',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0F1A3E';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#141E44';
          }}
        >
          להגשת בקשה ראשונית להלוואה
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Block 2: בקשות בתהליך + empty state */}
      <div
        className="w-full rounded-xl border border-[var(--border)] overflow-hidden"
        style={{
          backgroundColor: 'var(--card)',
          boxShadow: '0px 0px 24px 0px rgba(14, 78, 134, 0.09)',
          padding: 'clamp(20px, 3vw, 32px)',
        }}
      >
        <h2
          className="text-right mb-6"
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)',
            lineHeight: 1.4,
          }}
        >
          בקשות הלוואה בתהליך ({inProgressCount})
        </h2>

        {inProgressCount === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{
              padding: 'clamp(48px, 8vw, 80px) 24px',
              minHeight: '280px',
            }}
          >
            <div
              className="flex items-center justify-center shrink-0 mb-5"
              style={{ width: '120px', height: '120px' }}
            >
              <Image
                src="/icons/docs.svg"
                alt=""
                width={120}
                height={120}
                unoptimized
                style={{ objectFit: 'contain', opacity: 0.9 }}
              />
            </div>
            <p
              className="m-0 mb-2"
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                lineHeight: 1.4,
              }}
            >
              טרם הוגשו בקשות
            </p>
            <p
              className="m-0 max-w-[320px]"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5,
              }}
            >
              כאן יופיעו סטטוס הבקשות הקיימות
            </p>
          </div>
        ) : (
          <div>
            {/* Future: list of in-progress requests */}
          </div>
        )}
      </div>

      <InitialLoanRequestIntro
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        onStartProcess={() => {
          setIsIntroOpen(false);
          setIsWizardOpen(true);
        }}
      />
      <LoanApplicationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onExitAndSave={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
