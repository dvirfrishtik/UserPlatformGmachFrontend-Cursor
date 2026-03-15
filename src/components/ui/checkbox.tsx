'use client';

import * as React from 'react';

/** עיצוב לפי קומפוננטת Checkbox מ-Figma: 16×16, רקע לבן, מסגרת, V מסומן */
export function Checkbox({
  checked = false,
  className = '',
  'aria-label': ariaLabel,
}: {
  checked?: boolean;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <div
      className={className}
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      style={{
        width: 16,
        height: 16,
        minWidth: 16,
        minHeight: 16,
        background: '#FFFFFF',
        border: `1px solid ${checked ? '#141E44' : '#D9DDEC'}`,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          aria-hidden
        >
          <path
            d="M3 8.5L6.5 12L13 4.5"
            stroke="#141E44"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
