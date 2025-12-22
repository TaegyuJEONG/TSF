import React, { useState, useEffect } from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';
import { CheckCircle } from 'lucide-react';
import PaymentProcessModal from '../components/payments/PaymentProcessModal';
import { getPaymentEvents } from '../services/paymentService';
import type { PaymentEvent } from '../types/payment';

const BuyerPayments: React.FC = () => {

    // Modal State
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [selectedOverdueItem, setSelectedOverdueItem] = useState<{ amount: number, date: string } | null>(null);

    // Data State
    const [events, setEvents] = useState<PaymentEvent[]>([]);

    // Load Data
    useEffect(() => {
        setEvents(getPaymentEvents());
    }, []);

    const handlePaymentSuccess = (newEvent: PaymentEvent) => {
        setEvents(prev => [...prev, newEvent]); // Optimistic update
        setEvents(getPaymentEvents());
        setPayModalOpen(false);
    };

    const handleOpenPayModal = (amount: number, date: string) => {
        setSelectedOverdueItem({ amount, date });
        setPayModalOpen(true);
    };

    // --- Mock Data Construction based on stored events ---
    const initialSchedule = [
        { date: '2025-01-22', principal: 1500, interest: 1000 },
        { date: '2025-02-22', principal: 1500, interest: 1000 },
        { date: '2025-03-22', principal: 1500, interest: 1000 },
        { date: '2025-04-22', principal: 1500, interest: 1000 },
        { date: '2025-05-22', principal: 1500, interest: 1000 },
        { date: '2025-06-22', principal: 1500, interest: 1000 },
    ];

    const mergedSchedule = initialSchedule.map((item, index) => {
        let status = 'Unpaid';
        let receivedOn = '-';
        let isOverdue = false;

        if (index < events.length) {
            status = 'Paid';
            const evt = events[index];
            const dateObj = new Date(evt.receivedAt);
            receivedOn = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
        } else {
            if (item.date === '2025-04-22') {
                status = 'Unpaid';
                isOverdue = true;
            }
        }

        return {
            ...item,
            status,
            receivedOn,
            isOverdue,
            total: item.principal + item.interest
        };
    });

    const listingData = {
        image: listing1Image,
        price: 450000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 1982,
        specs: { dp: 45000, term: 30, interest: 6, beds: 3, baths: 2 },
        tier: 'Tier A',
        negotiable: true,
    };

    const visibleCount = Math.min(mergedSchedule.length, events.length + 1);
    const itemsToShow = mergedSchedule.slice(0, visibleCount);
    const nextDueItem = mergedSchedule[events.length];

    return (
        <div className="container" style={{ padding: '32px 0' }}>

            {selectedOverdueItem && (
                <PaymentProcessModal
                    isOpen={isPayModalOpen}
                    onClose={() => setPayModalOpen(false)}
                    dueAmount={selectedOverdueItem.amount}
                    dueDate={selectedOverdueItem.date}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <MarketplaceCard
                        image={listingData.image}
                        price={listingData.price}
                        sqft={listingData.sqft}
                        address={listingData.address}
                        specs={listingData.specs}
                        tier={listingData.tier}
                        negotiable={listingData.negotiable}
                        isUserListing={true} // Shows "Your Listing" badge
                        showBookmark={false}
                        showPricePerSqft={false}
                    />
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Table */}
                    <div style={{
                        border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Outgoing Payment Schedule</h2>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                Next due: <span style={{ fontWeight: 600, color: '#111827' }}>{nextDueItem ? nextDueItem.date : 'All Paid'}</span>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#374151', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Due Date</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Principal</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Interest</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Total</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Paid on</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Status</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsToShow.map((p, i) => {
                                        return (
                                            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px 8px', color: '#111827' }}>{p.date}</td>
                                                <td style={{ padding: '12px 8px', color: '#111827' }}>${p.principal}</td>
                                                <td style={{ padding: '12px 8px', color: '#111827' }}>${p.interest}</td>
                                                <td style={{ padding: '12px 8px', fontWeight: 500, color: '#111827' }}>${p.total}</td>
                                                <td style={{ padding: '12px 8px', color: '#6b7280' }}>{p.receivedOn}</td>
                                                <td style={{ padding: '12px 8px' }}>
                                                    {p.status === 'Paid' && (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            color: '#059669', fontWeight: 500, fontSize: '13px'
                                                        }}>
                                                            <CheckCircle size={14} /> Paid
                                                        </span>
                                                    )}
                                                    {p.isOverdue && p.status !== 'Paid' && (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            color: '#dc2626', fontWeight: 500, fontSize: '13px'
                                                        }}>
                                                            Overdue
                                                        </span>
                                                    )}
                                                    {!p.isOverdue && p.status !== 'Paid' && (
                                                        <span style={{ color: '#9ca3af' }}>Unpaid</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 8px' }}>
                                                    {p.status !== 'Paid' && (
                                                        <button
                                                            onClick={() => handleOpenPayModal(p.total, p.date)}
                                                            style={{
                                                                backgroundColor: '#000', color: 'white', border: 'none',
                                                                borderRadius: '6px', padding: '6px 12px', fontSize: '12px',
                                                                fontWeight: 600, cursor: 'pointer'
                                                            }}
                                                        >
                                                            Make Payment
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerPayments;
