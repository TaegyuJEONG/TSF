import React from 'react';
import Card from '../ui/Card';
import { ExternalLink, Bed, Bath, Expand } from 'lucide-react';

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
}

const ListingDetailPreview: React.FC<ListingDetailPreviewProps> = ({
    image,
    price,
    sqft,
    address,
    specs,
    description
}) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <Card padding="0" style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: 'none' }}>
            <div style={{ padding: '16px' }}>
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
            </div>

            <div style={{ padding: '0 24px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(price)}</h2>
                            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>(${(price / sqft).toFixed(0)}/sqft)</span>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', fontSize: '16px', fontWeight: 500, color: '#111827', marginBottom: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Bed size={18} color="#6b7280" /> <strong>{specs.beds}</strong> beds</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Bath size={18} color="#6b7280" /> <strong>{specs.baths}</strong> baths</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Expand size={18} color="#6b7280" /> <strong>{sqft}</strong> sqft</span>
                        </div>

                        <div style={{ fontSize: '16px', color: '#374151' }}>
                            {address}
                        </div>
                    </div>

                    <button style={{
                        padding: '8px 24px',
                        backgroundColor: '#000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        marginLeft: '16px'
                    }}>
                        Edit
                    </button>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, fontSize: '16px' }}>About Home</span>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: '1px solid #000',
                            borderRadius: '20px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            More Detail <ExternalLink size={12} />
                        </button>
                    </div>
                    <p style={{ lineHeight: '1.6', color: '#4b5563', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {description}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default ListingDetailPreview;
