'use client'

import React, { useState, useMemo } from 'react'
import { ColourOption, parseColour } from '@/lib/utils/colours'

interface ColourSelectorProps {
    options: Array<ColourOption | string>
    value: string
    onChange: (colorNameOrFormatted: string, option: ColourOption) => void
    allowCustomWheel?: boolean
    darkMode?: boolean
    label?: string
}

export function ColourSelector({
    options,
    value,
    onChange,
    allowCustomWheel = true,
    darkMode = false,
    label = 'Garment Colour Selection',
}: ColourSelectorProps) {
    const parsedOptions: ColourOption[] = useMemo(() => {
        return options.map((opt) => (typeof opt === 'string' ? parseColour(opt) : opt))
    }, [options])

    // Current parsed selection
    const currentOption = useMemo(() => {
        if (!value) return parsedOptions[0] || { name: 'Midnight Black', hex: '#1C1C1C' }
        const matched = parsedOptions.find(
            (o) => o.name.toLowerCase() === value.toLowerCase() || o.hex.toLowerCase() === value.toLowerCase()
        )
        if (matched) return matched
        return parseColour(value)
    }, [value, parsedOptions])

    // Custom color wheel state
    const [isCustomMode, setIsCustomMode] = useState(false)
    const [customHex, setCustomHex] = useState(currentOption.hex || '#C4975A')
    const [customName, setCustomName] = useState(
        currentOption.name && !parsedOptions.some((p) => p.name === currentOption.name)
            ? currentOption.name
            : 'Custom Color Shade'
    )

    const handleSelectOption = (opt: ColourOption) => {
        setIsCustomMode(false)
        onChange(opt.name, opt)
    }

    const handleApplyCustom = (hex: string, name: string) => {
        const finalName = name.trim() || hex.toUpperCase()
        const customOpt: ColourOption = { name: finalName, hex: hex.toUpperCase() }
        onChange(`${finalName} (${hex.toUpperCase()})`, customOpt)
    }

    const theme = {
        bgCard: darkMode ? '#1A120B' : '#FFFFFF',
        bgSubtle: darkMode ? '#2B1E14' : '#FAF7F2',
        border: darkMode ? '#3D2A1C' : '#E8DFD5',
        borderActive: '#C4975A',
        textPrimary: darkMode ? '#FAF5EA' : '#1C0F07',
        textSecondary: darkMode ? '#A8998C' : '#6E5D4F',
        badgeBg: darkMode ? '#26180E' : '#F3EFE9',
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
            {/* Header with active selection summary */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {label}
                </span>

                {/* Active Colour Pill */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: theme.bgSubtle,
                        border: `1px solid ${theme.border}`,
                    }}
                >
                    <span
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '9999px',
                            backgroundColor: currentOption.hex,
                            display: 'inline-block',
                            border: '1px solid rgba(0,0,0,0.2)',
                            boxShadow: '0 0 3px rgba(0,0,0,0.15)',
                        }}
                    />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.textPrimary }}>
                        {currentOption.name}
                    </span>
                    <span
                        style={{
                            fontSize: '0.7rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#C4975A',
                        }}
                    >
                        {currentOption.hex}
                    </span>
                </div>
            </div>

            {/* Visual Color Cards Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    gap: '0.6rem',
                }}
            >
                {parsedOptions.map((opt) => {
                    const isSelected = !isCustomMode && currentOption.name.toLowerCase() === opt.name.toLowerCase()

                    return (
                        <button
                            key={opt.name}
                            type="button"
                            onClick={() => handleSelectOption(opt)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '10px',
                                border: isSelected ? `2px solid ${theme.borderActive}` : `1px solid ${theme.border}`,
                                backgroundColor: isSelected ? (darkMode ? '#2E1E12' : '#FDF7EE') : theme.bgCard,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 2px 6px rgba(196,151,90,0.2)' : 'none',
                                outline: 'none',
                            }}
                        >
                            {/* Visual Swatch Circle */}
                            <span
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '9999px',
                                    backgroundColor: opt.hex,
                                    border: '1.5px solid #FFFFFF',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {isSelected && (
                                    <span
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: '11px',
                                            fontWeight: 900,
                                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))',
                                        }}
                                    >
                                        ✓
                                    </span>
                                )}
                            </span>

                            {/* Label & Hex */}
                            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <span
                                    style={{
                                        fontSize: '0.8rem',
                                        fontWeight: isSelected ? 800 : 600,
                                        color: isSelected ? '#C4975A' : theme.textPrimary,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {opt.name}
                                </span>
                                <span
                                    style={{
                                        fontSize: '0.68rem',
                                        fontFamily: 'monospace',
                                        fontWeight: 600,
                                        color: isSelected ? '#C4975A' : theme.textSecondary,
                                    }}
                                >
                                    {opt.hex}
                                </span>
                            </div>
                        </button>
                    )
                })}

                {/* Custom Color Wheel Button */}
                {allowCustomWheel && (
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustomMode(true)
                            handleApplyCustom(customHex, customName)
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '10px',
                            border: isCustomMode ? `2px solid ${theme.borderActive}` : `1px dashed ${theme.border}`,
                            backgroundColor: isCustomMode ? (darkMode ? '#2E1E12' : '#FDF7EE') : theme.bgSubtle,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span
                            style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '9999px',
                                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                                border: '1.5px solid #FFFFFF',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: isCustomMode ? 800 : 700, color: isCustomMode ? '#C4975A' : theme.textPrimary }}>
                                Color Wheel
                            </span>
                            <span style={{ fontSize: '0.68rem', color: theme.textSecondary }}>
                                Bespoke shade
                            </span>
                        </div>
                    </button>
                )}
            </div>

            {/* Custom Color Wheel Interactive Panel */}
            {allowCustomWheel && isCustomMode && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.75rem',
                        backgroundColor: theme.bgSubtle,
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: `1px solid ${theme.borderActive}`,
                        marginTop: '0.25rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Native Color Wheel / Picker Input */}
                        <div
                            style={{
                                position: 'relative',
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                backgroundColor: customHex,
                                border: '2px solid #FFFFFF',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            title="Click to open Color Wheel"
                        >
                            <input
                                type="color"
                                value={customHex}
                                onChange={(e) => {
                                    const newHex = e.target.value.toUpperCase()
                                    setCustomHex(newHex)
                                    handleApplyCustom(newHex, customName)
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    left: '-8px',
                                    width: '54px',
                                    height: '54px',
                                    opacity: 0,
                                    cursor: 'pointer',
                                }}
                            />
                            <span style={{ fontSize: '0.75rem', pointerEvents: 'none' }}>🎨</span>
                        </div>

                        {/* Hex Code Input */}
                        <input
                            type="text"
                            value={customHex}
                            onChange={(e) => {
                                let val = e.target.value
                                if (!val.startsWith('#')) val = `#${val}`
                                const upper = val.toUpperCase()
                                setCustomHex(upper)
                                handleApplyCustom(upper, customName)
                            }}
                            maxLength={7}
                            style={{
                                width: '84px',
                                padding: '0.45rem',
                                borderRadius: '6px',
                                border: `1px solid ${theme.border}`,
                                fontSize: '0.78rem',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                textAlign: 'center',
                                backgroundColor: theme.bgCard,
                                color: theme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Custom Shade Name */}
                    <input
                        type="text"
                        placeholder="Name this bespoke shade (e.g. Vintage Bronze, Midnight Teal)..."
                        value={customName}
                        onChange={(e) => {
                            setCustomName(e.target.value)
                            handleApplyCustom(customHex, e.target.value)
                        }}
                        style={{
                            flex: '1 1 180px',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '6px',
                            border: `1px solid ${theme.border}`,
                            fontSize: '0.8rem',
                            backgroundColor: theme.bgCard,
                            color: theme.textPrimary,
                            outline: 'none',
                        }}
                    />

                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>
                        ✓ Bespoke Color Selected
                    </span>
                </div>
            )}
        </div>
    )
}
