import type { ReactElement } from 'react'

interface IconProps {
  className?: string
}

export const OverviewIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
)

export const TransactionsIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="5" cy="6" r="1" fill="currentColor" />
    <line x1="8" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="10" r="1" fill="currentColor" />
    <line x1="8" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="14" r="1" fill="currentColor" />
    <line x1="8" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const BudgetsIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M5 6 L7 8 L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="5" cy="10" r="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line x1="8" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="14" r="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line x1="8" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const SettingsIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="10" r="2" fill="currentColor" />
    <path
      d="M10 3 L10 5 M10 15 L10 17 M17 10 L15 10 M5 10 L3 10 M15.66 4.34 L14.24 5.76 M5.76 14.24 L4.34 15.66 M15.66 15.66 L14.24 14.24 M5.76 5.76 L4.34 4.34"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

