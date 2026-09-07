import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string
    color?: string
}

const defaultProps = (size: number | string = 16, color: string = 'currentColor') => ({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
})

export const FiSettings = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

export const FiBriefcase = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

export const FiCreditCard = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
)

export const FiDollarSign = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
)

export const FiBell = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

export const FiGlobe = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

export const FiUsers = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

export const FiRepeat = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
)

export const FiCpu = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
)

export const FiAlertTriangle = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

export const FiSearch = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

export const FiChevronRight = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

export const FiArrowLeft = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
)

export const FiCheck = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

export const FiCheckCircle = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

export const FiCopy = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
)

export const FiEye = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

export const FiEyeOff = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

export const FiRefreshCw = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
)

export const FiShield = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)

export const FiLock = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

export const FiTrash2 = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
)

export const FiDownload = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)

export const FiSend = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)

export const FiKey = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M21 2l-2 2m-1.5 1.5L14 9l-3-3-4 4 3 3-5 5H2v3h3v-2h2v-2h2l5-5 3 3 3.5-3.5" />
        <circle cx="7.5" cy="7.5" r=".5" />
    </svg>
)

export const FiExternalLink = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
)

export const FiPlus = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

export const FiEdit2 = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
)

export const FiSave = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
)

export const FiClock = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

export const FiMapPin = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
)

export const FiMessageSquare = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

export const FiX = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

export const FiHelpCircle = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

export const FiCloud = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
)
