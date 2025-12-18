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
    variant?: 'homeowner' | 'investor';
    investorProps?: {
        progress: number;
        monthlyPayment: number;
        remainingTerm: number;
        ltv: number;
        yield: number;
        badge?: string; // e.g. "D-30"
    };
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
    showPricePerSqft = true,
    variant = 'homeowner',
    investorProps
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
                {/* Investor Badge (Top Left? Or right if bookmark is there. Actually Investor page has Tier top right. Let's put D-30 somewhere prominent if props exist) */}
                {/* Actually, existing Investor page puts Tier top right. And D-30 in content. But user asked for D-30 badge like the card. Wait, in InvestorMarketplace, D-30 is a badge in the content area next to price. But here user said "Show 0%, D-30, Funded 0%".
                   Okay, let's stick to the InvestorMarketplace layout which has D-30 next to price.
                   BUT, the User might want the Tier badge too.
                   Let's keep the Tier badge on image as is for consistency with Homeowner card? The Investor card ALSO has Tier on Image.
                   So we keep standard Image section.
                */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                    {!showBookmark && ( // If no bookmark, showed Tier here on Investor page. But here bookmark is optional.
                        <span style={{
                            backgroundColor: getTierStyle(tier).bg, color: getTierStyle(tier).text,
                            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600
                        }}>
                            {tier}
                        </span>
                    )}
                    {showBookmark && isUserListing && ( // For User Listing, maybe don't start with Bookmark? The mock didn't have one on Investor page.
                        <Bookmark color="white" fill="white" size={20} />
                    )}
                </div>
                {/* Re-add Tier if we removed it for bookmark, or just overlay it.
                    Actually, let's stick to the original code for image section, just maybe conditionally hide bookmark if variant is investor?
                    The InvestorMarketplace.tsx used:
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}> <span tier...> </div>
                    Let's use the provided content logic.
                 */}
                <div style={{ position: 'absolute', top: '12px', right: showBookmark ? '40px' : '12px', display: 'flex', gap: '8px' }}>
                    <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px',
                        backgroundColor: getTierStyle(tier).bg, color: getTierStyle(tier).text
                    }}>
                        {tier}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '20px' }}>
                {variant === 'homeowner' ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 700 }}>{formatCurrency(price)}</span>
                                {showPricePerSqft && (
                                    <span style={{ fontSize: '13px', color: '#6b7280' }}>(${(price / sqft).toFixed(0)}/sqft)</span>
                                )}
                            </div>
                            {negotiable && (
                                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: '#111827', color: 'white' }}>
                                    Negotiable
                                </span>
                            )}
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
                    </>
                ) : (
                    // Investor Variant
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                                {formatCurrency(price)}
                            </div>
                            {investorProps?.badge && (
                                <span style={{
                                    fontSize: '13px', fontWeight: 700, color: '#dc2626',
                                    backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px'
                                }}>
                                    {investorProps.badge}
                                </span>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ position: 'relative', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                width: `${investorProps?.progress || 0}%`,
                                backgroundColor: '#1e1b4b',
                                borderRadius: '4px'
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '16px', marginTop: '-12px' }}>
                            <span>Funded {investorProps?.progress || 0}%</span>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <div style={{ backgroundColor: '#f9fafb', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Monthly Payment</div>
                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e1b4b' }}>{formatCurrency(investorProps?.monthlyPayment || 0).replace('.00', '')}</div>
                            </div>
                            <div style={{ backgroundColor: '#f9fafb', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Remaining Term</div>
                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e1b4b' }}>{investorProps?.remainingTerm}m</div>
                            </div>
                            <div style={{ backgroundColor: '#f9fafb', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>LTV</div>
                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e1b4b' }}>{investorProps?.ltv}%</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
                            {address}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MarketplaceCard;
