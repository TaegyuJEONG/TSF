import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';
import { Shield, CheckCircle } from 'lucide-react';
import PaymentProcessModal from '../components/payments/PaymentProcessModal';
import { getPaymentEvents, getContractSnapshot } from '../services/paymentService';
import type { PaymentEvent } from '../types/payment';

const InvestorPayments: React.FC = () => {
    const navigate = useNavigate();

    // Modal State
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [selectedOverdueItem, setSelectedOverdueItem] = useState<{ amount: number, date: string } | null>(null);

    // Data State
    const [events, setEvents] = useState<PaymentEvent[]>([]);
    const [contractSnapshot, setContractSnapshot] = useState(getContractSnapshot());

    // Load Data
    useEffect(() => {
        setEvents(getPaymentEvents());
        setContractSnapshot(getContractSnapshot());
    }, []);

    // --- Investment State for "Your Share" ---
    const NOTE_SIZE = 455000;
    const [mySharePct, setMySharePct] = useState(0);

    useEffect(() => {
        const storedInvestments = localStorage.getItem('investor_investments');
        if (storedInvestments) {
            const investments = JSON.parse(storedInvestments);
            const total = investments.reduce((sum: number, item: any) => sum + item.amount, 0);
            setMySharePct(total / NOTE_SIZE);
        }
    }, []);

    const handlePaymentSuccess = (newEvent: PaymentEvent) => {
        setEvents(prev => [...prev, newEvent]); // Optimistic update, or reload
        // In reality, service handles persistence, so we just reload from service or append
        setEvents(getPaymentEvents());
        setPayModalOpen(false);
    };

    const handleOpenPayModal = (amount: number, date: string) => {
        // setSelectedOverdueItem({ amount, date }); // Button removed
        // setPayModalOpen(true);
    };

    // --- Mock Data Construction based on stored events ---
    // We combine "Official History" (from events) with "Projected Schedule" (mock)

    // 1. Initial Schedule (Mock)
    const initialSchedule = [
        { date: '2025-01-22', principal: 1500, interest: 1000 },
        { date: '2025-02-22', principal: 1500, interest: 1000 },
        { date: '2025-03-22', principal: 1500, interest: 1000 }, // Paid in mock
        { date: '2025-04-22', principal: 1500, interest: 1000 }, // Overdue!
        { date: '2025-05-22', principal: 1500, interest: 1000 },
        { date: '2025-06-22', principal: 1500, interest: 1000 },
    ];

    // 2. Merge Logic
    // For this demo, we will check if an event exists for a month. A real app would match IDs.
    // We just check if we have events.
    const mergedSchedule = initialSchedule.map((item, index) => {
        // Try to find a matching event? 
        // For simplicity: We map index 0, 1, 2 to existing events if they exist.
        // If index 3 (April), we force it to be Overdue unless an event exists.

        // Let's rely on the events list length to mark "Paid".
        // If we have 2 events, then Jan and Feb are paid.
        // We need a specific strategy for the "Overdue" item to be clickable.

        let status = 'Unpaid';
        let receivedOn = '-';
        let isOverdue = false;

        // Naive matching by index for demo
        if (index < events.length) {
            status = 'Paid';
            const evt = events[index]; // Assuming sort order matches schedule
            const dateObj = new Date(evt.receivedAt);
            receivedOn = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
        } else {
            // Specific Mock Logic for April: Overdue
            if (item.date === '2025-04-22') {
                status = 'Unpaid'; // It is technically unpaid, but we mark it overdrive for logic
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



    // Marketplace Card Data
    const listingData = {
        image: listing1Image,
        price: 455000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 1982,
        specs: { dp: 45000, term: 30, interest: 6, beds: 3, baths: 2 },
        tier: 'Tier A',
        negotiable: true,
    };

    // Logic for display:
    // Show all PAID items + the FIRST UNPAID item (the next due).
    // mergedSchedule matches events by index. events.length = number of paid items.
    // So we show 0 to events.length.
    const visibleCount = Math.min(mergedSchedule.length, events.length + 1);
    const itemsToShow = mergedSchedule.slice(0, visibleCount);
    const nextDueItem = mergedSchedule[events.length]; // usage: mergedSchedule[events.length] is the next unpaid one

    return (
        <div className="container" style={{ padding: '32px 0' }}>

            {/* Payment Modal */}
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
                        isUserListing={true}
                        showBookmark={false}
                        showPricePerSqft={false}
                    />

                    {/* Verification Card (Contract Linkage) */}
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Shield size={18} color="#4f46e5" />
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Contract Linkage</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Status</span>
                                {contractSnapshot.source === 'GENESIS' ? (
                                    <span style={{ fontSize: '11px', backgroundColor: '#fffbeb', color: '#d97706', padding: '2px 8px', borderRadius: '99px', border: '1px solid #fcd34d' }}>GENESIS / MOCK</span>
                                ) : (
                                    <span style={{ fontSize: '11px', backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', border: '1px solid #6ee7b7' }}>ANCHORED & VERIFIED</span>
                                )}
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#f3f4f6' }}></div>

                            <div>
                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Contract Hash</div>
                                <code style={{ fontSize: '11px', color: '#374151', backgroundColor: '#f9fafb', padding: '4px', borderRadius: '4px', display: 'block' }}>
                                    {contractSnapshot.contractHash.slice(0, 16)}...
                                </code>
                            </div>

                            <div>
                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Latest Ledger Root</div>
                                {events.length > 0 ? (
                                    <code style={{ fontSize: '11px', color: '#374151', backgroundColor: '#f9fafb', padding: '4px', borderRadius: '4px', display: 'block' }}>
                                        {/* In real app, we'd store the latest root in state. For now just placeholder or recompute. 
                                            Since we want to be fast, we can just say "Available" or fetch.
                                            Let's just show "Syncing..." or similar if complex, but here we can't easily get it without async.
                                        */}
                                        (View in Merkle Record)
                                    </code>
                                ) : (
                                    <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>No payments yet</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Table */}
                    <div style={{
                        border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Monthly Incoming Payment</h2>
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
                                        <th style={{ padding: '12px 8px', fontWeight: 600, color: '#111827' }}>Your Share</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Received on</th>
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
                                                <td style={{ padding: '12px 8px', fontWeight: 600, color: '#166534' }}>
                                                    ${(p.total * mySharePct).toFixed(2)}
                                                </td>
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
                                                        <span style={{ fontSize: '13px', color: '#6b7280' }}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Hash Link */}
                        <div
                            onClick={() => navigate('/merkle-record')}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '16px', cursor: 'pointer' }}
                            title="View Merkle Record Details"
                        >
                            <span style={{ fontSize: '14px', color: '#374151' }}>Verify Ledger</span>
                            <div style={{
                                width: '24px', height: '24px', backgroundColor: '#111827', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorPayments;
