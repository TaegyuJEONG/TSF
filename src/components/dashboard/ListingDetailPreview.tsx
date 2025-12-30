import React from 'react';
import Card from '../ui/Card';
import { ExternalLink, Bed, Bath, Expand, Edit } from 'lucide-react';

interface ListingDetailPreviewProps {
    image: string;
    price: number;
    sqft: number;
    address: string;
    specs: {
        beds: number;
        baths: number;
    };
    description: string;
    theme?: 'light' | 'dark';
    showEditButton?: boolean;
    // New Financial Props
    zestimate?: number;
    downPayment?: number;
    term?: number;
    interestRate?: number;
    monthlyPayment?: number;
    riskCategory?: string;
    negotiable?: boolean;
}

const ListingDetailPreview: React.FC<ListingDetailPreviewProps> = ({
    image,
    price,
    sqft,
    address,
    specs,
    description,
    theme = 'light',
    showEditButton = false,
    zestimate,
    downPayment,
    term,
    interestRate,
    monthlyPayment,
    riskCategory,
    negotiable
}) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <Card padding="0" style={{ border: `1px solid ${theme === 'dark' ? '#334155' : '#e5e7eb'}`, borderRadius: '12px', overflow: 'hidden', boxShadow: 'none', backgroundColor: theme === 'dark' ? '#1e293b' : 'white' }}>
            <div style={{ padding: '16px', position: 'relative' }}>
                <img
                    src={image}
                    alt="Property Detail"
                    style={{
                        width: '100%',
                        height: '340px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        display: 'block'
                    }}
                />
                {showEditButton && (
                    <button
                        style={{
                            position: 'absolute',
                            top: '28px',
                            right: '28px',
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#111827',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        <Edit size={16} /> Edit
                    </button>
                )}
            </div>

            <div style={{ padding: '0 24px 24px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{formatCurrency(price)}</h2>
                        <span style={{ fontSize: '14px', color: theme === 'dark' ? '#94a3b8' : '#6b7280', fontWeight: 500 }}>(${(price / sqft).toFixed(0)}/sqft)</span>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', fontSize: '16px', fontWeight: 500, color: theme === 'dark' ? '#e2e8f0' : '#374151', marginBottom: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Bed size={18} color={theme === 'dark' ? '#94a3b8' : '#6b7280'} /> <strong>{specs.beds}</strong> beds</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Bath size={18} color={theme === 'dark' ? '#94a3b8' : '#6b7280'} /> <strong>{specs.baths}</strong> baths</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Expand size={18} color={theme === 'dark' ? '#94a3b8' : '#6b7280'} /> <strong>{sqft}</strong> sqft</span>
                    </div>

                    <div style={{ fontSize: '16px', color: theme === 'dark' ? '#cbd5e1' : '#6b7280' }}>
                        {address}
                    </div>
                </div>

                <div style={{ borderTop: `1px solid ${theme === 'dark' ? '#334155' : '#e5e7eb'}`, paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, fontSize: '16px', color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>About Home</span>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: `1px solid ${theme === 'dark' ? '#f1f5f9' : '#111827'}`,
                            color: theme === 'dark' ? '#f1f5f9' : '#111827',
                            borderRadius: '20px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            More Detail <ExternalLink size={12} />
                        </button>
                    </div>
                    <p style={{ lineHeight: '1.6', color: theme === 'dark' ? '#94a3b8' : '#6b7280', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {description}
                    </p>
                </div>
            </div>

            {/* Financial Summary Section (Only if monthlyPayment is provided) */}
            {monthlyPayment && (
                <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${theme === 'dark' ? '#334155' : '#e5e7eb'}` }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827', marginTop: '16px', marginBottom: '16px' }}>Financial Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Home Price</span>
                            <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{formatCurrency(price)}</span>
                        </div>
                        {zestimate && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Zestimate</span>
                                <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{formatCurrency(zestimate)}</span>
                            </div>
                        )}
                        {downPayment && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Down Payment</span>
                                <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{((downPayment / price) * 100).toFixed(0)}%</span>
                            </div>
                        )}
                        {term && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Term</span>
                                <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{term} months</span>
                            </div>
                        )}
                        {interestRate && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Interest rate</span>
                                <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{interestRate}%</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Monthly P&I</span>
                            <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{formatCurrency(monthlyPayment)}</span>
                        </div>
                        {riskCategory && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', alignItems: 'center' }}>
                                <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Category type</span>
                                <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {riskCategory}
                                </span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>Negotiable</span>
                            <span style={{ fontWeight: 600, color: theme === 'dark' ? '#f1f5f9' : '#111827' }}>{negotiable ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ListingDetailPreview;
