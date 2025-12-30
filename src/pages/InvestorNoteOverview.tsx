import React from 'react';
// import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';

// Reusable Stat Card Component
const StatCard: React.FC<{ label: string; value: string; subValue?: string }> = ({ label, value, subValue }) => (
    <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100px' // Fixed height for consistency
    }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', lineHeight: '1.2' }}>{label}</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
        {subValue && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{subValue}</div>}
    </div>
);

const InvestorNoteOverview: React.FC = () => {
    // Mock Listing Data (Consistent with other tabs)
    // Mock data matching Marketplace Listing #1 (Same as SellerListedHome)
    const listingData = {
        image: listing1Image,
        price: 450000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 1982,
        specs: {
            dp: 45000,
            term: 30,
            interest: 6,
            beds: 3,
            baths: 2
        },
        tier: 'Tier A',
        negotiable: true,
    };

    return (
        <div className="container" style={{ padding: '32px 0', backgroundColor: '#0f172a', minHeight: '100vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' }}>

                {/* Left Column: Marketplace Card */}
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            backgroundColor: '#1e293b',
                        }}>
                            {/* Image */}
                            <div style={{ height: '220px', position: 'relative', backgroundColor: '#f3f4f6' }}>
                                <img src={listing1Image} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                                    {[1, 2, 3].map(dot => (
                                        <div key={dot} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dot === 1 ? 'white' : 'rgba(255,255,255,0.5)' }} />
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>
                                        $500,000
                                    </div>
                                    <span style={{
                                        fontSize: '13px', fontWeight: 700, color: '#dc2626',
                                        backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px'
                                    }}>
                                        D-30
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ position: 'relative', height: '8px', backgroundColor: '#334155', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute', left: 0, top: 0, bottom: 0,
                                        width: '100%',
                                        backgroundColor: '#7c3aed',
                                        borderRadius: '4px'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', marginTop: '-12px' }}>
                                    <span>Funded 100%</span>
                                </div>

                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Monthly Payment</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>$6,018</div>
                                    </div>
                                    <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Remaining Term</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>120m</div>
                                    </div>
                                    <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>LTV</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>43%</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
                                    5931 Abernathy Dr, Los Angeles, CA 90045
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Dashboard Stats */}
                <div style={{
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '32px',
                    backgroundColor: '#1e293b'
                }}>

                    {/* Section 1: Cash Flow Summary */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>Cash Flow Summary</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <StatCard label="Total Repayment Amount" value="$1,444,320" />
                            <StatCard label="Total Paid P&I" value="$722,160" />
                            <StatCard label="Payments Remaining(m)" value="120" />
                            <StatCard label="Remaining P&I" value="$722,160" />
                        </div>
                    </div>

                    {/* Section 2: Note Value Summary */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>Note Value Summary</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <StatCard label="Property Value" value="$1.25M" />
                            <StatCard label="LTV" value="43%" />
                            <StatCard label="UPB" value="$542.1K" />
                            <StatCard label="Interest rate" value="6%" />
                        </div>
                    </div>

                    {/* Section 3: Buyer Summary */}
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>Buyer Summary</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <StatCard label="Credit Score Band:" value="740-780" />
                            <StatCard label="Payment consistency" value="117/120 On-time" />
                            <StatCard label="Seasoning" value="120 Months" />
                            <StatCard label="Employment" value="Stable (12 yrs)" subValue="(verified)" />
                            <StatCard label="Income stability score" value="A" />
                            <StatCard label="DTI Estimate" value="25%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorNoteOverview;
