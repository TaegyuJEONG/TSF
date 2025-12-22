import React from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';

// Reusable Stat Card Component
const StatCard: React.FC<{ label: string; value: string; subValue?: string }> = ({ label, value, subValue }) => (
    <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100px'
    }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.2' }}>{label}</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{value}</div>
        {subValue && <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{subValue}</div>}
    </div>
);

const BuyerAsset: React.FC = () => {
    // Mock Listing Data for Buyer
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
        <div className="container" style={{ padding: '32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' }}>

                {/* Left Column: Marketplace Card */}
                <div>
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
                        variant='homeowner'
                    />
                </div>

                {/* Right Column: Asset Stats */}
                <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '32px',
                    backgroundColor: 'white'
                }}>

                    {/* Section 1: Payment Summary */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>My Payment Obligations</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <StatCard label="Total Loan Amount" value="$1 056 000" />
                            <StatCard label="Total Paid" value="$45 000" />
                            <StatCard label="Remaining Term" value="358 months" />
                            <StatCard label="Next Payment" value="$2,500" />
                        </div>
                    </div>

                    {/* Section 2: Property Value */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Asset Value</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <StatCard label="Current Valuation" value="$1.19M" />
                            <StatCard label="Appreciation" value="+4.2%" subValue="(Last 12 mo)" />
                            <StatCard label="Equity" value="$134K" />
                            <StatCard label="LTV" value="44%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerAsset;
