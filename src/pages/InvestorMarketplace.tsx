import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import heroImage from '../assets/listing_1.jpg';
import image2 from '../assets/listing_2.jpg';
import image3 from '../assets/listing_3.jpg';

const InvestorMarketplace: React.FC = () => {
    const navigate = useNavigate();

    const listings = [
        {
            id: 1,
            address: '5931 Abernathy Dr, Los Angeles, CA 90045',
            price: 450000,
            yield: 15.8,
            ltv: 44,
            available: 107000000, // using 107m representation
            progress: 80,
            image: heroImage,
            tier: 'Tier A',
        },
        {
            id: 2,
            address: '2845 Rolling Hills, Sherman Oaks, CA 91403',
            price: 455000,
            yield: 15.8,
            ltv: 44,
            available: 107000000,
            progress: 10,
            image: image2,
            tier: 'Tier B',
        },
        {
            id: 3,
            address: '1029 Vista Del Mar, Santa Monica, CA 90401',
            price: 455000,
            yield: 15.8,
            ltv: 44,
            available: 107000000,
            progress: 100,
            isInvested: true,
            image: image3,
            tier: 'Tier C',
        },
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
            <TopBar />

            {/* Filter Bar */}
            <div style={{ padding: '20px 40px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {['Loan Metrics', 'Property Information', 'Contract Structure'].map((filter) => (
                        <div key={filter} style={{
                            border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 16px',
                            fontSize: '14px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '100px'
                        }}>
                            {filter}
                        </div>
                    ))}
                </div>
            </div>

            {/* Listing Grid */}
            <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                    {listings.map(listing => (
                        <div key={listing.id} style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            transition: 'transform 0.2s'
                        }}
                            onClick={() => navigate(`/investor/listing/${listing.id}`)}
                        >
                            {/* Image */}
                            <div style={{ height: '220px', position: 'relative', backgroundColor: '#f3f4f6' }}>
                                <img src={listing.image} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {listing.isInvested && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <span style={{
                                            fontSize: '24px', fontWeight: 800, color: '#1e1b4b',
                                            textTransform: 'uppercase', letterSpacing: '1px'
                                        }}>
                                            Invested
                                        </span>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                                    <span style={{
                                        backgroundColor: listing.tier === 'Tier A' ? '#dcfce7' : listing.tier === 'Tier B' ? '#fef3c7' : '#fee2e2',
                                        color: listing.tier === 'Tier A' ? '#166534' : listing.tier === 'Tier B' ? '#b45309' : '#991b1b',
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600
                                    }}>
                                        {listing.tier}
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                                    {[1, 2, 3].map(dot => (
                                        <div key={dot} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dot === 1 ? 'white' : 'rgba(255,255,255,0.5)' }} />
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                                        {formatCurrency(listing.price)}
                                    </div>
                                    <span style={{
                                        fontSize: '13px', fontWeight: 700, color: '#dc2626',
                                        backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px'
                                    }}>
                                        D-17
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ position: 'relative', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute', left: 0, top: 0, bottom: 0,
                                        width: `${listing.progress}%`,
                                        backgroundColor: '#1e1b4b', // Indigo fill
                                        borderRadius: '4px'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '16px', marginTop: '-12px' }}>
                                    <span>Funded {listing.progress}%</span>
                                </div>

                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div style={{ backgroundColor: '#f9fafb', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Monthly Payment</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e1b4b' }}>$6,000</div>
                                    </div>
                                    <div style={{ backgroundColor: '#f9fafb', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Remaining Term</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e1b4b' }}>107m</div>
                                    </div>
                                    <div style={{ backgroundColor: '#f9fafb', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>LTV</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e1b4b' }}>{listing.ltv}%</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
                                    {listing.address}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InvestorMarketplace;
