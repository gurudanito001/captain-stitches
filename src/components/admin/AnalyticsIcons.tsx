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

export const FiUsers = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

export const FiTrendingUp = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
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

export const FiAward = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
)

export const FiAlertCircle = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

export const FiDownload = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)

export const FiArrowUpRight = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
    </svg>
)

export const FiArrowDownRight = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="7" y1="7" x2="17" y2="17" />
        <polyline points="17 7 17 17 7 17" />
    </svg>
)

export const FiArrowLeft = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
)

export const FiSend = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)

export const FiExternalLink = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
)

export const FiUserCheck = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
    </svg>
)

export const FiPieChart = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
)

export const FiLayers = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
)

export const FiStar = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

export const FiAlertTriangle = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

export const FiFilter = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
)

export const FiBarChart2 = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

export const FiEye = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

export const FiShoppingBag = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
)

export const FiShare2 = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
)

export const FiCheckCircle = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

export const FiGift = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
)

export const FiDollarSign = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
)

export const FiMail = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
)

export const FiPercent = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
)

export const FiBookOpen = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
)

export const FiClock = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

export const FiSearch = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

export const FiTarget = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
)

export const FiCalendar = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

export const FiSettings = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

export const FiSave = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
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

export const FiGlobe = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

export const FiActivity = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg {...defaultProps(size, color)} {...props}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
)
