'use client';

import * as React from 'react';

/**
 * Checkbox – עיצוב לפי Figma (Gmach User platform, node 14001:73114).
 * 20×20 (סקלה מ-16 ב-Figma), רקע לבן, מסגרת #D9DDEC / #141E44, סימן V במצב מסומן.
 */
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
        width: 20,
        height: 20,
        minWidth: 20,
        minHeight: 20,
        background: '#FFFFFF',
        border: `1px solid ${checked ? '#141E44' : '#D9DDEC'}`,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      {checked && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 16 16"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          aria-hidden
        >
          <path
            d="M3.5 8.2 L6.5 11.2 L12.5 4.8"
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
