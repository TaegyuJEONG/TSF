import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import heroImage from '../assets/listing_1.jpg';
import image2 from '../assets/listing_2.jpg';
import image3 from '../assets/listing_3.jpg';

const Marketplace: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // User's listing data passed from Preview
    const userListing = location.state || {};

    // Mock Listings
    const listings = [
        {
            id: 1,
            address: '5931 Abernathy Dr, Los Angeles, CA 90045',
            price: userListing.price || 450000,
            downPayment: userListing.downPayment || 45000,
            term: userListing.termYears || 30,
            rate: userListing.interestRate || 6,
            beds: 3,
            baths: 2,
            sqft: 1982,
            image: heroImage,
            tier: userListing.riskCategory || 'Tier A',
            negotiable: true,
            isUserListing: true
        },
        {
            id: 2,
            address: '2845 Rolling Hills, Sherman Oaks, CA 91403',
            price: 850000,
            downPayment: 127500,
            term: 30,
            rate: 6.2,
            beds: 4,
            baths: 3,
            sqft: 2400,
            image: image2,
            tier: 'Tier B',
            negotiable: false
        },
        {
            id: 3,
            address: '1029 Vista Del Mar, Santa Monica, CA 90401',
            price: 1200000,
            downPayment: 120000,
            term: 15,
            rate: 7.5,
            beds: 2,
            baths: 2,
            sqft: 1100,
            image: image3, // Reuse for mock
            tier: 'Tier C',
            negotiable: true
        }
    ];

    const getTierStyle = (tier: string) => {
        switch (tier) {
            case 'Tier A': return { bg: '#dcfce7', text: '#166534' };
            case 'Tier B': return { bg: '#fef3c7', text: '#b45309' };
            case 'Tier C': return { bg: '#fee2e2', text: '#991b1b' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <TopBar />

            {/* Filter Bar */}
            <div style={{ padding: '20px 40px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
                {['Address', 'Price', 'Down Payment', 'Beds & Baths', 'Surface', 'Home Type', 'Contract Type'].map((filter) => (
                    <div key={filter} style={{
                        border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 16px',
                        fontSize: '14px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '100px'
                    }}>
                        {filter}
                    </div>
                ))}
            </div>

            {/* Listing Grid */}
            <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                    {listings.map(listing => (
                        <div
                            key={listing.id}
                            onClick={() => {
                                if (listing.isUserListing) {
                                    navigate('/listing-detail', {
                                        state: {
                                            photos: userListing.photos, // Pass photos back
                                            price: listing.price,
                                            downPayment: listing.downPayment,
                                            termYears: listing.term,
                                            interestRate: listing.rate,
                                            riskCategory: listing.tier,
                                            monthlyPayment: userListing.monthlyPayment, // Pass original P&I
                                            zestimate: userListing.zestimate
                                        }
                                    });
                                }
                            }}
                            style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}
                        >
                            {/* Image Section */}
                            <div style={{ height: '220px', backgroundColor: '#f3f4f6', position: 'relative' }}>
                                <img src={listing.image} alt={listing.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                                    {[1, 2, 3].map(dot => (
                                        <div key={dot} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dot === 1 ? 'white' : 'rgba(255,255,255,0.5)' }} />
                                    ))}
                                </div>
                                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                    <Bookmark color="white" fill={listing.isUserListing ? "white" : "none"} size={20} />
                                </div>
                            </div>

                            {/* Content Section */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 700 }}>{formatCurrency(listing.price)}</span>
                                        <span style={{ fontSize: '13px', color: '#6b7280' }}>(${(listing.price / listing.sqft).toFixed(0)}/sqft)</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <span style={{
                                            fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px',
                                            backgroundColor: getTierStyle(listing.tier).bg, color: getTierStyle(listing.tier).text
                                        }}>
                                            {listing.tier}
                                        </span>
                                        {listing.negotiable && (
                                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: '#111827', color: 'white' }}>
                                                Negotiable
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '12px', lineHeight: '1.6' }}>
                                    DP {formatCurrency(listing.downPayment).replace('.00', '')} | Term {listing.term}y | Interest {listing.rate}%
                                </div>

                                <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '12px' }}>
                                    {listing.beds} bds | {listing.baths} ba | {listing.sqft} sqft
                                </div>

                                <div style={{ fontSize: '13px', color: '#6b7280' }}>
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

export default Marketplace;
