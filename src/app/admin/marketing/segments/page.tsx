'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    MarketingSegment,
    MarketingSegmentCondition,
    ConditionField,
    ConditionOperator,
    getAllSegments,
    saveSegment,
    deleteSegment,
    getAllSubscribers,
    MarketingSubscriber,
} from '@/data/adminMarketingData'

export default function SegmentsPage() {
    const [segments, setSegments] = useState<MarketingSegment[]>([])
    const [subscribers, setSubscribers] = useState<MarketingSubscriber[]>([])
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [logic, setLogic] = useState<'AND' | 'OR'>('AND')
    const [conditions, setConditions] = useState<MarketingSegmentCondition[]>([
        { id: 'cond-1', field: 'language', operator: 'is', value: 'EN' },
    ])

    useEffect(() => {
        setSegments(getAllSegments())
        setSubscribers(getAllSubscribers())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // Dynamic evaluation function: evaluates how many subscribers match the condition set
    const calculateMatches = (condList: MarketingSegmentCondition[], groupLogic: 'AND' | 'OR') => {
        if (!condList.length) return subscribers.filter((s) => s.status === 'active').length

        return subscribers.filter((sub) => {
            const results = condList.map((cond) => {
                const val = cond.value.toLowerCase().trim()
                if (cond.field === 'language') {
                    return cond.operator === 'is' ? sub.language.toLowerCase() === val : sub.language.toLowerCase() !== val
                }
                if (cond.field === 'location') {
                    return cond.operator === 'is' ? sub.location.toLowerCase() === val : sub.location.toLowerCase() !== val
                }
                if (cond.field === 'status') {
                    return cond.operator === 'is' ? sub.status === val : sub.status !== val
                }
                if (cond.field === 'signup_source') {
                    return cond.operator === 'is' ? sub.signupSource === val : sub.signupSource !== val
                }
                if (cond.field === 'order_count') {
                    // Approximate check via customer link or mock
                    const count = sub.linkedCustomerId ? 2 : 0
                    const numVal = parseInt(val, 10) || 0
                    if (cond.operator === 'greater_than') return count > numVal
                    if (cond.operator === 'less_than') return count < numVal
                    return count === numVal
                }
                if (cond.field === 'referral_count') {
                    const count = sub.linkedCustomerId ? 1 : 0
                    const numVal = parseInt(val, 10) || 0
                    if (cond.operator === 'greater_than') return count > numVal
                    return count === numVal
                }
                return true
            })

            return groupLogic === 'AND' ? results.every(Boolean) : results.some(Boolean)
        }).length
    }

    const liveMatchCount = useMemo(() => {
        return calculateMatches(conditions, logic)
    }, [conditions, logic, subscribers])

    const handleOpenCreateModal = () => {
        setEditingSegmentId(null)
        setName('')
        setDescription('')
        setLogic('AND')
        setConditions([{ id: `cond-${Date.now()}`, field: 'language', operator: 'is', value: 'EN' }])
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (seg: MarketingSegment) => {
        setEditingSegmentId(seg.id)
        setName(seg.name)
        setDescription(seg.description)
        setLogic(seg.logic || 'AND')
        setConditions(
            seg.conditions.length > 0
                ? seg.conditions
                : [{ id: `cond-${Date.now()}`, field: 'status', operator: 'is', value: 'active' }]
        )
        setIsModalOpen(true)
    }

    const handleAddCondition = () => {
        setConditions([
            ...conditions,
            { id: `cond-${Date.now()}`, field: 'location', operator: 'is', value: 'Italy' },
        ])
    }

    const handleRemoveCondition = (id: string) => {
        if (conditions.length <= 1) return
        setConditions(conditions.filter((c) => c.id !== id))
    }

    const handleUpdateCondition = (id: string, updates: Partial<MarketingSegmentCondition>) => {
        setConditions(conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    }

    const handleSaveSegment = () => {
        if (!name.trim()) return
        const newSeg: MarketingSegment = {
            id: editingSegmentId || `seg-${Date.now()}`,
            name: name.trim(),
            description: description.trim() || 'Custom audience segment defined by filters',
            subscriberCount: liveMatchCount,
            lastUsedDate: editingSegmentId
                ? segments.find((s) => s.id === editingSegmentId)?.lastUsedDate
                : 'Not used yet',
            isPrebuilt: editingSegmentId ? segments.find((s) => s.id === editingSegmentId)?.isPrebuilt || false : false,
            logic,
            conditions,
        }

        const updated = saveSegment(newSeg)
        setSegments(updated)
        setIsModalOpen(false)
        showToast(editingSegmentId ? 'Segment updated successfully' : 'New segment created successfully')
    }

    const handleDeleteSegment = (id: string) => {
        if (!confirm('Are you sure you want to delete this segment? Existing campaigns using it will fallback to all subscribers.')) {
            return
        }
        const updated = deleteSegment(id)
        setSegments(updated)
        showToast('Segment deleted')
    }

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 0 80px' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '28px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 500,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                        border: '1px solid #C4975A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* HEADER BAR */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8C827A', marginBottom: '8px' }}>
                        <Link href="/admin/marketing" style={{ color: '#8C827A', textDecoration: 'none' }}>
                            Marketing
                        </Link>
                        <span>/</span>
                        <span style={{ color: '#C4975A' }}>Audience Segments</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h1
                            style={{
                                fontFamily: 'serif',
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: 0,
                            }}
                        >
                            Audience Segments
                        </h1>
                        <span
                            style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#C4975A',
                            }}
                        >
                            {segments.length} Segments
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: '4px 0 0' }}>
                        Target bespoke dispatches by location, language preference, order history, and engagement cohorts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        backgroundColor: '#C4975A',
                        color: '#1C0F07',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                    }}
                >
                    + Create Segment
                </button>
            </div>

            {/* SEGMENT CARDS GRID */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '20px',
                }}
            >
                {segments.map((seg) => (
                    <div
                        key={seg.id}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #E8E2D9',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '16px',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    marginBottom: '8px',
                                }}
                            >
                                <h3
                                    style={{
                                        fontFamily: 'serif',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        margin: 0,
                                    }}
                                >
                                    {seg.name}
                                </h3>
                                {seg.isPrebuilt && (
                                    <span
                                        style={{
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            backgroundColor: '#FAF7F2',
                                            border: '1px solid #E8E2D9',
                                            color: '#8C827A',
                                            flexShrink: 0,
                                        }}
                                    >
                                        Pre-built
                                    </span>
                                )}
                            </div>

                            <p
                                style={{
                                    fontSize: '13px',
                                    color: '#8C827A',
                                    lineHeight: 1.5,
                                    margin: '0 0 16px',
                                }}
                            >
                                {seg.description}
                            </p>

                            {/* Conditions preview badges */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {seg.conditions.map((c, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: '11px',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            backgroundColor: '#FAF7F2',
                                            border: '1px solid #E8E2D9',
                                            color: '#4A3D36',
                                        }}
                                    >
                                        {c.field} {c.operator.replace('_', ' ')} <strong>{c.value}</strong>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer details */}
                        <div
                            style={{
                                paddingTop: '16px',
                                borderTop: '1px solid #F5F1EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <strong style={{ fontSize: '18px', color: '#1C0F07', display: 'block' }}>
                                    {seg.subscriberCount}
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Active patrons • Last: {seg.lastUsedDate || 'Never'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(seg)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E8E2D9',
                                        backgroundColor: '#FFFFFF',
                                        fontSize: '12px',
                                        color: '#1C0F07',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Edit
                                </button>

                                {!seg.isPrebuilt && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSegment(seg.id)}
                                        style={{
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(199, 43, 43, 0.2)',
                                            backgroundColor: '#FFFFFF',
                                            fontSize: '12px',
                                            color: '#C72B2B',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE / EDIT SEGMENT MODAL WITH DYNAMIC CONDITION BUILDER */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.7)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            maxWidth: '680px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: '28px',
                            border: '1px solid #E8E2D9',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h2 style={{ fontFamily: 'serif', fontSize: '22px', color: '#1C0F07', margin: '0 0 6px' }}>
                            {editingSegmentId ? 'Edit Audience Segment' : 'Create Audience Segment'}
                        </h2>
                        <p style={{ fontSize: '13px', color: '#8C827A', margin: '0 0 20px' }}>
                            Define rule-based conditions to group subscribers for targeted atelier announcements.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Segment Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. VIP Milan Gala Attendees"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Description (Internal)
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief note on who is included in this audience..."
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            {/* CONDITION BUILDER */}
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                                        Matching Criteria (Condition Rules)
                                    </label>

                                    {/* Match ALL vs Match ANY */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '11px', color: '#8C827A' }}>Combine using:</span>
                                        <select
                                            value={logic}
                                            onChange={(e) => setLogic(e.target.value as any)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid #E8E2D9',
                                                fontSize: '11px',
                                                backgroundColor: '#FAF7F2',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <option value="AND">AND (All conditions must match)</option>
                                            <option value="OR">OR (At least one must match)</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {conditions.map((cond, idx) => (
                                        <div
                                            key={cond.id}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1.4fr 1fr 1.6fr 36px',
                                                gap: '8px',
                                                alignItems: 'center',
                                                backgroundColor: '#FAF7F2',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: '1px solid #E8E2D9',
                                            }}
                                        >
                                            {/* Field */}
                                            <select
                                                value={cond.field}
                                                onChange={(e) =>
                                                    handleUpdateCondition(cond.id, {
                                                        field: e.target.value as ConditionField,
                                                    })
                                                }
                                                style={{
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #E8E2D9',
                                                    fontSize: '12px',
                                                    backgroundColor: '#FFFFFF',
                                                }}
                                            >
                                                <option value="language">Language Preference</option>
                                                <option value="location">Location</option>
                                                <option value="status">Status</option>
                                                <option value="signup_source">Signup Source</option>
                                                <option value="order_count">Total Orders</option>
                                                <option value="referral_count">Referral Rewards</option>
                                            </select>

                                            {/* Operator */}
                                            <select
                                                value={cond.operator}
                                                onChange={(e) =>
                                                    handleUpdateCondition(cond.id, {
                                                        operator: e.target.value as ConditionOperator,
                                                    })
                                                }
                                                style={{
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #E8E2D9',
                                                    fontSize: '12px',
                                                    backgroundColor: '#FFFFFF',
                                                }}
                                            >
                                                <option value="is">is</option>
                                                <option value="is_not">is not</option>
                                                <option value="greater_than">greater than</option>
                                                <option value="less_than">less than</option>
                                                <option value="contains">contains</option>
                                            </select>

                                            {/* Value */}
                                            {cond.field === 'language' ? (
                                                <select
                                                    value={cond.value}
                                                    onChange={(e) => handleUpdateCondition(cond.id, { value: e.target.value })}
                                                    style={{
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #E8E2D9',
                                                        fontSize: '12px',
                                                        backgroundColor: '#FFFFFF',
                                                    }}
                                                >
                                                    <option value="EN">EN (English)</option>
                                                    <option value="IT">IT (Italian)</option>
                                                </select>
                                            ) : cond.field === 'location' ? (
                                                <select
                                                    value={cond.value}
                                                    onChange={(e) => handleUpdateCondition(cond.id, { value: e.target.value })}
                                                    style={{
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #E8E2D9',
                                                        fontSize: '12px',
                                                        backgroundColor: '#FFFFFF',
                                                    }}
                                                >
                                                    <option value="Italy">Italy</option>
                                                    <option value="Nigeria">Nigeria</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={cond.value}
                                                    onChange={(e) => handleUpdateCondition(cond.id, { value: e.target.value })}
                                                    placeholder="value..."
                                                    style={{
                                                        padding: '7px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #E8E2D9',
                                                        fontSize: '12px',
                                                        backgroundColor: '#FFFFFF',
                                                    }}
                                                />
                                            )}

                                            {/* Remove condition */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCondition(cond.id)}
                                                disabled={conditions.length <= 1}
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    color: conditions.length <= 1 ? '#D1C9BE' : '#C72B2B',
                                                    cursor: conditions.length <= 1 ? 'default' : 'pointer',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddCondition}
                                        style={{
                                            alignSelf: 'flex-start',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px dashed #C4975A',
                                            backgroundColor: '#FAF7F2',
                                            color: '#1C0F07',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            marginTop: '4px',
                                        }}
                                    >
                                        + Add Condition Row
                                    </button>
                                </div>
                            </div>

                            {/* LIVE PREVIEW BANNER */}
                            <div
                                style={{
                                    padding: '14px 18px',
                                    borderRadius: '10px',
                                    backgroundColor: '#FAF5EE',
                                    border: '1px solid #E8DED1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span style={{ fontSize: '13px', color: '#1C0F07' }}>
                                    Estimated Audience Reach:
                                </span>
                                <strong style={{ fontSize: '15px', color: '#C4975A' }}>
                                    Matches {liveMatchCount} of {subscribers.length} subscribers (
                                    {Math.round((liveMatchCount / (subscribers.length || 1)) * 100)}%)
                                </strong>
                            </div>
                        </div>

                        {/* MODAL FOOTER ACTIONS */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    padding: '9px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #E8E2D9',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveSegment}
                                style={{
                                    padding: '9px 20px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#C4975A',
                                    color: '#1C0F07',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {editingSegmentId ? 'Save Changes' : 'Create Segment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
