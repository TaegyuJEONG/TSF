import React, { useState } from 'react';
import Button from '../ui/Button';
import { Calendar, Clock, MessageSquare, Check, Mail, Phone } from 'lucide-react';

interface Slot {
    date: string;
    time: string;
    ampm: string;
}

interface VisitRequestScheduleProps {
    slots: Slot[];
    message: string;
    onAccept: (index: number) => void;
    viewMode?: 'seller' | 'buyer'; // 'seller' = viewing incoming requests, 'buyer' = viewing sent request
    confirmedSlotIndex?: number; // For buyer mode: which slot was confirmed by seller
    ownerContact?: { // For buyer mode: owner contact information
        name: string;
        email: string;
        phone: string;
    };
}

const VisitRequestSchedule: React.FC<VisitRequestScheduleProps> = ({
    slots,
    message,
    onAccept,
    viewMode = 'seller',
    confirmedSlotIndex = 0, // Default to first slot
    ownerContact
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(viewMode === 'buyer' ? confirmedSlotIndex : null);
    const confirmedSlot = viewMode === 'buyer' ? slots[confirmedSlotIndex] : null;

    return (
        <div style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <div style={{ padding: '32px' }}>
                {/* Only show schedule selection and message for seller mode */}
                {viewMode === 'seller' && (
                    <>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={20} color="#4b5563" /> Proposed Schedule
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                            {slots.map((slot, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        border: selectedIndex === index ? '2px solid #111827' : '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedIndex === index ? '#f9fafb' : 'white',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Checkbox */}
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '4px',
                                        border: selectedIndex === index ? 'none' : '2px solid #d1d5db',
                                        backgroundColor: selectedIndex === index ? '#111827' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '16px',
                                        transition: 'all 0.2s'
                                    }}>
                                        {selectedIndex === index && <Check size={14} color="white" />}
                                    </div>

                                    <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontWeight: 500 }}>
                                            <span style={{ color: '#6b7280' }}>Date:</span> {slot.date}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', fontWeight: 600 }}>
                                            <Clock size={16} color="#6b7280" /> {slot.time} {slot.ampm}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={18} color="#4b5563" /> Message from Visitor
                        </h3>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            border: '1px solid #f3f4f6',
                            color: '#4b5563',
                            lineHeight: '1.6',
                            fontSize: '15px',
                            marginBottom: '32px'
                        }}>
                            "{message}"
                        </div>
                    </>
                )}

                {/* Buyer Mode: Visit Confirmation Details */}
                {viewMode === 'buyer' && ownerContact && confirmedSlot && (
                    <>
                        {/* Home Owner Contact and Scheduled Time */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            {/* Home Owner Contact */}
                            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '12px', textTransform: 'uppercase' }}>Home Owner Contact</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                                        <Mail size={14} color="#6b7280" /> {ownerContact.email}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                                        <Phone size={14} color="#6b7280" /> {ownerContact.phone}
                                    </div>
                                </div>
                            </div>

                            {/* Scheduled Time */}
                            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '12px', textTransform: 'uppercase' }}>Scheduled Time</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                                        <Calendar size={14} color="#6b7280" /> {confirmedSlot.date}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                                        <Clock size={14} color="#6b7280" /> {confirmedSlot.time} {confirmedSlot.ampm}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms to Finalize */}
                        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Terms to Finalize during Visit</h3>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '14px' }}>
                                Please ensure you discuss and agree upon these key terms to build the contract later.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                                <div>
                                    <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Deal Basics</h4>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#4b5563', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        <li>Purchase Price</li>
                                        <li>Down Payment (%)</li>
                                        <li>Est. Closing Date</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Financing Terms</h4>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#4b5563', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        <li>Interest Rate (%)</li>
                                        <li>Loan Term (Years/Months)</li>
                                        <li>Payment Structure</li>
                                        <li>Balloon Term (if applicable)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Security & Position</h4>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#4b5563', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        <li>Security Instrument</li>
                                        <li>Lien Position (1st/2nd)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Risk & Flexibility</h4>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#4b5563', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        <li>Grace Period</li>
                                        <li>Prepayment Rules</li>
                                        <li>Late Fee Terms</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps for Buyer */}
                        <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#166534', marginBottom: '12px' }}>Next Steps</h3>
                            <div style={{ fontSize: '14px', color: '#14532d', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p>
                                    Once the home owner creates the contract based on finalized terms, you will be able to proceed with payments.
                                </p>
                                <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <li><strong>Payments Tab:</strong> View your payment schedule and make principal & interest payments through our platform.</li>
                                    <li><strong>Secure Service:</strong> All payments are processed securely and delivered to the home owner through our trusted servicing partners.</li>
                                    <li><strong>Blockchain Record:</strong> Every payment is recorded on the blockchain for full transparency and verification.</li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}

                {viewMode === 'seller' ? (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button
                            disabled={selectedIndex === null}
                            onClick={() => selectedIndex !== null && onAccept(selectedIndex)}
                            style={{
                                flex: 1,
                                backgroundColor: selectedIndex !== null ? '#111827' : '#e5e7eb',
                                color: selectedIndex !== null ? 'white' : '#9ca3af',
                                borderRadius: '12px',
                                height: '48px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: selectedIndex !== null ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outline"
                            style={{
                                flex: 1,
                                borderRadius: '12px',
                                height: '48px',
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#ef4444',
                                borderColor: '#ef4444'
                            }}
                        >
                            Reject
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={() => console.log('Reschedule clicked')}
                        style={{
                            width: '100%',
                            backgroundColor: '#111827',
                            color: 'white',
                            borderRadius: '12px',
                            height: '48px',
                            fontSize: '15px',
                            fontWeight: 600
                        }}
                    >
                        Reschedule Visit
                    </Button>
                )}
            </div>
        </div>
    );
};

export default VisitRequestSchedule;
