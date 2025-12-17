import React, { useState } from 'react';
import Button from '../ui/Button';
import { Calendar, Clock, MessageSquare, Check } from 'lucide-react';

interface Slot {
    date: string;
    time: string;
    ampm: string;
}

interface VisitRequestScheduleProps {
    slots: Slot[];
    message: string;
    onAccept: (index: number) => void;
}

const VisitRequestSchedule: React.FC<VisitRequestScheduleProps> = ({ slots, message, onAccept }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
            </div>
        </div>
    );
};

export default VisitRequestSchedule;
