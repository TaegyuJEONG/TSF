import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Mail, Phone, Calendar, Clock } from 'lucide-react';


interface VisitAcceptanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: { date: string; time: string; ampm: string } | null;
    visitor: { name: string; email: string; phone: string };
}

const VisitAcceptanceModal: React.FC<VisitAcceptanceModalProps> = ({ isOpen, onClose, slot, visitor }) => {
    if (!slot) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Visit Confirmed</h2>
                <div style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>
                    You have accepted the visit request. Here are the details and next steps.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    {/* Visitor Info */}
                    <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '16px', textTransform: 'uppercase' }}>Visitor Contact</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#111827', fontWeight: 500 }}>
                                <Mail size={16} color="#6b7280" /> {visitor.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#111827', fontWeight: 500 }}>
                                <Phone size={16} color="#6b7280" /> {visitor.phone}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Info */}
                    <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '16px', textTransform: 'uppercase' }}>Scheduled Time</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#111827', fontWeight: 500 }}>
                                <Calendar size={16} color="#6b7280" /> {slot.date}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#111827', fontWeight: 500 }}>
                                <Clock size={16} color="#6b7280" /> {slot.time} {slot.ampm}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contract Guide */}
                <div style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#166534', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Next Steps for Contract
                    </h3>
                    <div style={{ fontSize: '15px', color: '#14532d', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <p>
                            Once you have finalized negotiations during the visit, please go to the <strong>Contract</strong> tab in your dashboard.
                        </p>
                        <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li><strong>Automated Contracts:</strong> Enter the final negotiated terms, and we will automatically generate the legal contract.</li>
                            <li><strong>Service & Trust Connection:</strong> We connect you directly with service and trust companies for seamless execution.</li>
                            <li><strong>Blockchain Storage:</strong> All contract details are securely stored on the blockchain for transparency and security.</li>
                            <li><strong>One-Stop Tokenization:</strong> If desired, proceed directly to securitization and tokenization for easy monetization.</li>
                        </ul>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={onClose}
                        style={{ backgroundColor: '#111827', color: 'white', borderRadius: '12px', padding: '0 32px', height: '44px' }}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default VisitAcceptanceModal;
