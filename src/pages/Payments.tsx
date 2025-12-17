import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg'; // Assuming we reuse the same image
import { Pencil, Info } from 'lucide-react'; // Simulating RWA icon with Globe if needed, or custom SVG

const Payments: React.FC = () => {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    // ... (rest of code)
    // Mock Data for Left Card (Same as SellerListedHome)
    const listingData = {
        image: listing1Image,
        price: 450000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 1982,
        specs: { dp: 45000, term: 30, interest: 6, beds: 3, baths: 2 },
        tier: 'Tier A',
        negotiable: true,
    };

    // Payment History Data
    // Mocking 12 months for the table
    const payments = [
        { date: '01.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '02.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '04.02.2025', principal: 1500, interest: 1000, status: 'Delayed' }, // Delayed example
        { date: '04.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '05.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '06.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '07.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '08.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '09.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
        { date: '10.22.2025', principal: 1500, interest: 1000, status: 'On-time' },
    ];

    // Fee Calculation: 0.5% / 12 of UPB
    // Mocking UPB roughly for display, assuming decreasing principal
    const initialUPB = 405000; // 450k - 45k
    const calculateFee = (upb: number) => (upb * 0.005) / 12;

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px' }}>

                {/* Left Column: Marketplace Card */}
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
                </div>

                {/* Right Column: Payment History & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Monthly Incoming Payment Table */}
                    <div style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '24px',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Monthly Incoming Payment</h2>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#374151', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Principal</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Interest</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Total</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Received on</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Status</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500, textAlign: 'right', position: 'relative' }}>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', cursor: 'help', position: 'relative' }}
                                                onMouseEnter={() => setShowTooltip(true)}
                                                onMouseLeave={() => setShowTooltip(false)}
                                            >
                                                <span>Fee</span>
                                                <Info size={14} color="#9ca3af" />

                                                {showTooltip && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        right: '0',
                                                        marginTop: '8px',
                                                        backgroundColor: '#1f2937',
                                                        color: 'white',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        whiteSpace: 'nowrap',
                                                        zIndex: 20,
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                    }}>
                                                        0.5%/12 of UPB
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '100%',
                                                            right: '6px',
                                                            borderWidth: '4px',
                                                            borderStyle: 'solid',
                                                            borderColor: 'transparent transparent #1f2937 transparent'
                                                        }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p, i) => {
                                        const total = p.principal + p.interest;
                                        // Mock UPB decreasing by principal each month
                                        const currentUPB = initialUPB - (p.principal * i);
                                        const fee = calculateFee(currentUPB);

                                        return (
                                            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px 8px', color: p.status === 'Delayed' ? '#ef4444' : '#111827' }}>${p.principal}</td>
                                                <td style={{ padding: '12px 8px', color: p.status === 'Delayed' ? '#ef4444' : '#111827' }}>${p.interest}</td>
                                                <td style={{ padding: '12px 8px', color: p.status === 'Delayed' ? '#ef4444' : '#111827', fontWeight: 500 }}>${total}</td>
                                                <td style={{ padding: '12px 8px', color: '#4b5563' }}>{p.date}</td>
                                                <td style={{ padding: '12px 8px', color: p.status === 'Delayed' ? '#ef4444' : '#111827' }}>{p.status}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'right', color: '#6b7280', fontFamily: 'monospace' }}>
                                                    {fee.toFixed(8)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Blockchain Hash */}
                        <div
                            onClick={() => navigate('/merkle-record')}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '16px', cursor: 'pointer' }}
                            title="View Merkle Record Details"
                        >
                            <span style={{ fontSize: '14px', color: '#374151' }}>Hash</span>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#111827',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Simple spinner/hash icon mock */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Bank Account Information */}
                    <div style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '24px',
                        backgroundColor: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Bank Account Information</h2>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                padding: '8px',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Pencil size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '16px', fontSize: '14px' }}>
                            <div style={{ color: '#6b7280' }}>Account holder name</div>
                            <div style={{ color: '#111827', fontWeight: 500 }}>Mark J.</div>

                            <div style={{ color: '#6b7280' }}>Bank name</div>
                            <div style={{ color: '#111827', fontWeight: 500 }}>Bank of America</div>

                            <div style={{ color: '#6b7280' }}>Account number</div>
                            <div style={{ color: '#111827', fontWeight: 500 }}>1234567890</div>

                            <div style={{ color: '#6b7280' }}>Routing number</div>
                            <div style={{ color: '#111827', fontWeight: 500 }}>021000021</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Payments;
