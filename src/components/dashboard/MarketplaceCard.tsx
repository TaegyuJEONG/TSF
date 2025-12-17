import React from 'react';
import { Bookmark } from 'lucide-react';

interface MarketplaceCardProps {
    image: string;
    price: number;
    sqft: number;
    address: string;
    specs: {
        dp: number;
        term: number;
        interest: number;
        beds: number;
        baths: number;
    };
    tier: string;
    negotiable: boolean;
    isUserListing?: boolean;
    showBookmark?: boolean;
    showPricePerSqft?: boolean;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
    image,
    price,
    sqft,
    address,
    specs,
    tier,
    negotiable,
    isUserListing = false,
    showBookmark = true,
    showPricePerSqft = true
}) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const getTierStyle = (tierVal: string) => {
        switch (tierVal) {
            case 'Tier A': return { bg: '#dcfce7', text: '#166534' };
            case 'Tier B': return { bg: '#fef3c7', text: '#b45309' };
            case 'Tier C': return { bg: '#fee2e2', text: '#991b1b' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white' }}>
            {/* Image Section */}
            <div style={{ height: '220px', backgroundColor: '#f3f4f6', position: 'relative' }}>
                <img src={image} alt={address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                    {[1, 2, 3].map(dot => (
                        <div key={dot} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dot === 1 ? 'white' : 'rgba(255,255,255,0.5)' }} />
                    ))}
                </div>
                {showBookmark && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <Bookmark color="white" fill={isUserListing ? "white" : "none"} size={20} />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 700 }}>{formatCurrency(price)}</span>
                        {showPricePerSqft && (
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>(${(price / sqft).toFixed(0)}/sqft)</span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px',
                            backgroundColor: getTierStyle(tier).bg, color: getTierStyle(tier).text
                        }}>
                            {tier}
                        </span>
                        {negotiable && (
                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: '#111827', color: 'white' }}>
                                Negotiable
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '12px', lineHeight: '1.6' }}>
                    DP {formatCurrency(specs.dp).replace('.00', '')} | Term {specs.term}y | Interest {specs.interest}%
                </div>

                <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '12px' }}>
                    {specs.beds} bds | {specs.baths} ba | {sqft} sqft
                </div>

                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {address}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceCard;
