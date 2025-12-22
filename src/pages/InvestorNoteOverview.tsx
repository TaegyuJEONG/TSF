import React from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';
import Button from '../components/ui/Button';
import NoteValuationModal from '../components/dashboard/NoteValuationModal';

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
        height: '100px' // Fixed height for consistency
    }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.2' }}>{label}</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{value}</div>
        {subValue && <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{subValue}</div>}
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

    const [listingStatus, setListingStatus] = React.useState<'active' | 'listed' | 'sold'>('active');
    const [isValuationModalOpen, setIsValuationModalOpen] = React.useState(false);

    // Mock handler for listing
    const handleListNote = (price: number) => {
        console.log("Listing note at price:", price);
        setListingStatus('listed');
        setIsValuationModalOpen(false);
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
                        specs={{
                            dp: listingData.specs.dp,
                            term: listingData.specs.term,
                            interest: listingData.specs.interest,
                            beds: listingData.specs.beds,
                            baths: listingData.specs.baths
                        }}
                        tier={listingData.tier}
                        negotiable={listingData.negotiable}
                        isUserListing={true}
                        showBookmark={false}
                        showPricePerSqft={false}
                        variant={listingStatus === 'active' ? 'homeowner' : 'investor'}
                        investorProps={listingStatus === 'active' ? undefined : {
                            progress: 0,
                            monthlyPayment: 6000,
                            remainingTerm: 107,
                            ltv: 44,
                            yield: 15.8, // Not used in display explicitly but part of type
                            badge: 'D-30'
                        }}
                    />
                    {listingStatus === 'sold' && (
                        <div style={{
                            marginTop: '24px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '16px', color: '#991b1b', fontSize: '14px', fontWeight: 500, textAlign: 'center'
                        }}>
                            Note Sold & Transferred
                        </div>
                    )}
                </div>

                {/* Right Column: Dashboard Stats */}
                <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '32px',
                    backgroundColor: 'white',
                    position: 'relative',
                    overflow: 'hidden' // For overlay
                }}>

                    {/* SOLD Overlay */}
                    {listingStatus === 'sold' && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(255,255,255,0.6)',
                            backdropFilter: 'grayscale(100%)',
                            zIndex: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{
                                fontSize: '80px', fontWeight: 900, color: '#ef4444',
                                textTransform: 'uppercase', letterSpacing: '4px',
                                transform: 'rotate(-10deg)',
                                textShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                border: '8px solid #ef4444',
                                padding: '16px 48px',
                                borderRadius: '16px',
                                opacity: 0.9
                            }}>
                                Sold
                            </div>
                        </div>
                    )}

                    {/* Section 1: Cash Flow Summary */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Cash Flow Summary</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <StatCard label="Total Repayment Amount" value="$1 056 000" />
                            <StatCard label="Total Paid P&I" value="$414 000" />
                            <StatCard label="Payments Remaining(m)" value="107" />
                            <StatCard label="Remaining P&I" value="$642 000" />
                        </div>
                    </div>

                    {/* Section 2: Note Value Summary */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Note Value Summary</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <StatCard label="Property Value" value="$1.19M" />
                            <StatCard label="LTV" value="44%" />
                            <StatCard label="UPB" value="$519.2K" />
                            <StatCard label="Interest rate" value="5%" />
                        </div>
                    </div>

                    {/* Section 3: Buyer Summary */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Buyer Summary</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <StatCard label="Credit Score Band:" value="680-720" />
                            <StatCard label="Payment consistency" value="23/24 on-time" />
                            <StatCard label="Seasoning" value="69 Months" />
                            <StatCard label="Employment" value="W2 employee" subValue="(verified)" />
                            <StatCard label="Income stability score" value="B+" />
                            <StatCard label="DTI Estimate" value="Moderate risk" /> {/* Split text handling might be needed if strictly matching formatting "Moder ate risk" linebreak, but "Moderate risk" is cleaner */}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>

                        {/* Dev Toggle for Sold State */}
                        <button
                            onClick={() => setListingStatus(s => s === 'sold' ? 'active' : 'sold')}
                            style={{ fontSize: '12px', color: '#d1d5db', cursor: 'pointer', background: 'none', border: 'none' }}
                            title="Dev Toggle: Sold State"
                        >
                            [Dev: Toggle Sold]
                        </button>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {listingStatus === 'listed' && (
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    ● Listed for Investment
                                </span>
                            )}
                            <Button
                                onClick={() => setIsValuationModalOpen(true)}
                                disabled={listingStatus !== 'active'}
                                style={{
                                    backgroundColor: listingStatus === 'active' ? 'black' : '#e5e7eb',
                                    color: listingStatus === 'active' ? 'white' : '#9ca3af',
                                    borderRadius: '50px',
                                    padding: '12px 24px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: listingStatus === 'active' ? 'pointer' : 'not-allowed'
                                }}>
                                {listingStatus === 'active' ? 'Cash Out' : (listingStatus === 'listed' ? 'Listed for Investment' : 'Sold')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <NoteValuationModal
                isOpen={isValuationModalOpen}
                onClose={() => setIsValuationModalOpen(false)}
                onList={handleListNote}
                upb={519200}
            />

        </div>
    );
};

export default InvestorNoteOverview;
