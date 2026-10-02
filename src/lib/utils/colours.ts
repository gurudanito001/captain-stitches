/**
 * Colour Utilities for CaptainStitches
 * Supports rich hexadecimal color selection, parsing, serialization, and preset palettes.
 */

export interface ColourOption {
    name: string
    hex: string
}

/**
 * Standard bespoke colour palette for quick selection.
 */
export const STUDIO_PALETTE: ColourOption[] = [
    { name: 'Midnight Black', hex: '#1C1C1C' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Royal Ivory', hex: '#FAF5EA' },
    { name: 'Imperial Gold', hex: '#C4975A' },
    { name: 'Midnight Navy', hex: '#0B2240' },
    { name: 'Royal Blue', hex: '#1D4ED8' },
    { name: 'Emerald Green', hex: '#10B981' },
    { name: 'Forest Green', hex: '#14532D' },
    { name: 'Wine Burgundy', hex: '#58111A' },
    { name: 'Ruby Crimson', hex: '#DC2626' },
    { name: 'Burnt Ochre', hex: '#D97706' },
    { name: 'Caramel Brown', hex: '#78350F' },
    { name: 'Slate Grey', hex: '#475569' },
    { name: 'Silver Mist', hex: '#94A3B8' },
    { name: 'Champagne', hex: '#F7E7CE' },
    { name: 'Deep Purple', hex: '#581C87' },
]

export const ATELIER_PALETTE = STUDIO_PALETTE

/**
 * Parse a raw colour string (e.g. "Name|#HEX", "Name (#HEX)", "#HEX", or plain "Name")
 * into a typed ColourOption { name, hex }.
 */
export function parseColour(raw: string): ColourOption {
    if (!raw || typeof raw !== 'string') {
        return { name: 'Custom Shade', hex: '#1C1C1C' }
    }
    const trimmed = raw.trim()

    // Format 1: "Name|#HEX" (preferred persistence format)
    if (trimmed.includes('|')) {
        const parts = trimmed.split('|')
        const name = parts[0].trim()
        let hex = parts[1]?.trim() || '#1C1C1C'
        if (!hex.startsWith('#')) hex = `#${hex}`
        return { name: name || hex.toUpperCase(), hex: hex.toUpperCase() }
    }

    // Format 2: "Name (#HEX)"
    const parenMatch = trimmed.match(/^(.*?)\s*\((#[0-9A-Fa-f]{3,8})\)$/)
    if (parenMatch) {
        return { name: parenMatch[1].trim(), hex: parenMatch[2].trim().toUpperCase() }
    }

    // Format 3: Raw hex only (e.g. "#10B981")
    if (/^#[0-9A-Fa-f]{3,8}$/.test(trimmed)) {
        return { name: trimmed.toUpperCase(), hex: trimmed.toUpperCase() }
    }

    // Format 4: Pure name fallback with intelligent colour keyword inference
    const lower = trimmed.toLowerCase()
    let hex = '#1C1C1C'
    if (lower.includes('white') || lower.includes('ivory') || lower.includes('cream')) hex = '#FAF5EA'
    else if (lower.includes('blue') || lower.includes('navy')) hex = '#0B2240'
    else if (lower.includes('emerald') || lower.includes('green') || lower.includes('teal')) hex = '#10B981'
    else if (lower.includes('burgundy') || lower.includes('wine') || lower.includes('maroon') || lower.includes('red')) hex = '#58111A'
    else if (lower.includes('gold') || lower.includes('caramel') || lower.includes('champagne')) hex = '#C4975A'
    else if (lower.includes('grey') || lower.includes('gray') || lower.includes('silver')) hex = '#7C6F64'
    else if (lower.includes('brown') || lower.includes('tan')) hex = '#78350F'
    else if (lower.includes('purple') || lower.includes('violet')) hex = '#581C87'
    else if (lower.includes('orange') || lower.includes('ochre') || lower.includes('rust')) hex = '#D97706'
    else if (lower.includes('pink') || lower.includes('rose')) hex = '#DB2777'

    return { name: trimmed, hex: hex.toUpperCase() }
}

/**
 * Serialize a ColourOption into persistence format: "Name|#HEX".
 */
export function serializeColour(c: { name: string; hex?: string }): string {
    const hex = c.hex && c.hex.startsWith('#') ? c.hex.toUpperCase() : (c.hex ? `#${c.hex.toUpperCase()}` : '#1C1C1C')
    const name = c.name?.trim() || hex
    return `${name}|${hex}`
}
