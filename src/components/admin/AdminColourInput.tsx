'use client'

import React, { useState } from 'react'
import { ATELIER_PALETTE, ColourOption, parseColour, serializeColour } from '@/lib/utils/colours'

interface AdminColourInputProps {
    colours: ColourOption[]
    onChange: (colours: ColourOption[]) => void
    label?: string
    description?: string
}

export function AdminColourInput({
    colours,
    onChange,
    label = 'Available Colours (Palette & Swatches)',
    description = 'Pick the exact shade using the color wheel or presets, specify a bespoke color name, and click Add.',
}: AdminColourInputProps) {
    const [selectedHex, setSelectedHex] = useState('#1C1C1C')
    const [colourName, setColourName] = useState('')
    const [showPresets, setShowPresets] = useState(false)

    const handleAddColour = () => {
        const name = colourName.trim() || selectedHex.toUpperCase()
        // Prevent duplicate names
        if (colours.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
            return
        }

        const newOption: ColourOption = {
            name,
            hex: selectedHex.toUpperCase(),
        }
        onChange([...colours, newOption])
        setColourName('')
    }

    const handleRemoveColour = (nameToRemove: string) => {
        onChange(colours.filter((c) => c.name !== nameToRemove))
    }

    const handleSelectPreset = (preset: ColourOption) => {
        setSelectedHex(preset.hex)
        setColourName(preset.name)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.2rem' }}>
                    {label}
                </label>
                {description && (
                    <p style={{ margin: 0, fontSize: '0.73rem', color: '#8A7A6E', marginBottom: '0.45rem' }}>
                        {description}
                    </p>
                )}
            </div>

            {/* Colour Creation Bar: Color Wheel Picker + Hex + Name Input + Add Button */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.65rem',
                    backgroundColor: '#FAF7F2',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #E0D7CB',
                }}
            >
                {/* Visual Color Wheel Picker Trigger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            backgroundColor: selectedHex,
                            border: '2px solid #FFFFFF',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Click to open Color Wheel / Selector"
                    >
                        <input
                            type="color"
                            value={selectedHex}
                            onChange={(e) => setSelectedHex(e.target.value.toUpperCase())}
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
                        <span style={{ fontSize: '0.7rem', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.6))', pointerEvents: 'none' }}>
                            🎨
                        </span>
                    </div>

                    {/* Hex Badge/Input */}
                    <input
                        type="text"
                        value={selectedHex}
                        onChange={(e) => {
                            let val = e.target.value
                            if (!val.startsWith('#')) val = `#${val}`
                            setSelectedHex(val.toUpperCase())
                        }}
                        maxLength={7}
                        placeholder="#1C1C1C"
                        style={{
                            width: '84px',
                            padding: '0.45rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #D5CBBF',
                            fontSize: '0.78rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#1C0F07',
                            backgroundColor: '#FFFFFF',
                            textAlign: 'center',
                        }}
                        title="Hexadecimal colour code"
                    />
                </div>

                {/* Colour Name Input */}
                <input
                    type="text"
                    placeholder="Enter colour name (e.g. Royal Emerald, Midnight Navy)..."
                    value={colourName}
                    onChange={(e) => setColourName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddColour()
                        }
                    }}
                    style={{
                        flex: '1 1 200px',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #D5CBBF',
                        fontSize: '0.825rem',
                        color: '#1C0F07',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                    }}
                />

                {/* Add Colour Button */}
                <button
                    type="button"
                    onClick={handleAddColour}
                    style={{
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 0.9rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 1px 2px rgba(196,151,90,0.25)',
                    }}
                >
                    <span>+</span>
                    <span>Add Colour</span>
                </button>

                {/* Quick Presets Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    style={{
                        backgroundColor: showPresets ? '#E8DFD3' : '#FFFFFF',
                        color: '#6E5D4F',
                        border: '1px solid #D5CBBF',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {showPresets ? 'Hide Palette' : 'Preset Palette'}
                </button>
            </div>

            {/* Quick Preset Palette Selector (Expandable) */}
            {showPresets && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        padding: '0.65rem',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #E5DFD7',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                >
                    <div style={{ width: '100%', fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                        Quick Select Signature Palette:
                    </div>
                    {ATELIER_PALETTE.map((preset) => {
                        const isCurrent = selectedHex.toUpperCase() === preset.hex.toUpperCase()
                        return (
                            <button
                                key={preset.name}
                                type="button"
                                onClick={() => handleSelectPreset(preset)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.25rem 0.55rem',
                                    borderRadius: '6px',
                                    border: isCurrent ? '1.5px solid #C4975A' : '1px solid #E5DFD7',
                                    backgroundColor: isCurrent ? '#FDF3E7' : '#FAF7F2',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    color: isCurrent ? '#C4975A' : '#3A2B20',
                                    fontWeight: isCurrent ? 700 : 500,
                                }}
                            >
                                <span
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '9999px',
                                        backgroundColor: preset.hex,
                                        display: 'inline-block',
                                        border: '1px solid rgba(0,0,0,0.15)',
                                    }}
                                />
                                <span>{preset.name}</span>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Configured / Added Colours Display */}
            <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Active Garment Palette ({colours.length} {colours.length === 1 ? 'colour' : 'colours'}):
                </div>

                {colours.length === 0 ? (
                    <div style={{ padding: '0.85rem', textAlign: 'center', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px dashed #D5CBBF', fontSize: '0.78rem', color: '#8A7A6E' }}>
                        No colours specified yet. Use the color wheel above to add available garment shades.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {colours.map((c) => (
                            <div
                                key={c.name}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #D5CBBF',
                                    borderRadius: '8px',
                                    padding: '0.35rem 0.65rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                                }}
                            >
                                {/* Color Swatch */}
                                <span
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '9999px',
                                        backgroundColor: c.hex,
                                        display: 'inline-block',
                                        border: '1px solid rgba(0,0,0,0.18)',
                                        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.2)',
                                        flexShrink: 0,
                                    }}
                                />
                                {/* Color Name */}
                                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {c.name}
                                </span>
                                {/* Hex Code Badge */}
                                <span
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        color: '#8A7A6E',
                                        backgroundColor: '#F3EFE9',
                                        padding: '0.1rem 0.35rem',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {c.hex}
                                </span>
                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveColour(c.name)}
                                    title={`Remove ${c.name}`}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#A8998C',
                                        cursor: 'pointer',
                                        padding: '0 0.15rem',
                                        fontSize: '0.9rem',
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#A8998C')}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
