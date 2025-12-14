import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RequestVisitModal from '../components/RequestVisitModal';
import { ChevronLeft, Share, Heart, MapPin, Bed, Bath, Expand, ExternalLink, HelpCircle } from 'lucide-react';
import heroImage from '../assets/listing_1.jpg';
import image2 from '../assets/listing_2.jpg';
import image3 from '../assets/listing_3.jpg';

const ListingDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Default demo photos
    const demoPhotos = [
        { id: 1, url: heroImage, title: 'Living Room' },
        { id: 2, url: image2, title: 'Fireplace' },
        { id: 3, url: image3, title: 'Master Bedroom' }
    ];

    const statePhotos = location.state?.photos;
    const activePhotos = (statePhotos && statePhotos.length > 0) ? statePhotos : demoPhotos;

    const {
        price,
        downPayment,
        interestRate,
        termYears,
        monthlyPayment,
        riskCategory,
        zestimate
    } = location.state || {};

    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

    // Fallbacks for dev/demo if accessed directly
    const displayPrice = price || 450000;
    const displayDownPayment = downPayment || 45000;
    const displayRate = interestRate || 6;
    const displayTerm = termYears || 30;
    const displayMonthly = monthlyPayment || 2700;
    const displayRisk = riskCategory || 'Tier A';
    const displayZestimate = zestimate || 420000;

    // Use first photo as hero
    const mainPhoto = activePhotos[0].url;

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', paddingBottom: '80px' }}>

            {/* Navigation Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 50 }}>
                <button
                    onClick={() => navigate('/marketplace')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                >
                    <ChevronLeft size={18} /> Back to Marketplace
                </button>
            </div>

            {/* Hero Section */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '500px', position: 'relative', marginBottom: '24px' }}>
                    <img src={mainPhoto} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '12px' }}>
                        <button style={{ backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <Share size={18} />
                        </button>
                        <button style={{ backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <Heart size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>

                    {/* Left Column */}
                    <div>
                        <div style={{ marginBottom: '24px' }}>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                {formatCurrency(displayPrice)} <span style={{ fontSize: '16px', fontWeight: 500, color: '#6b7280' }}>(${(displayPrice / 1982).toFixed(0)}/sqft)</span>
                            </h1>
                            <div style={{ display: 'flex', gap: '24px', fontSize: '16px', fontWeight: 500, color: '#111827', marginBottom: '16px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Bed size={20} color="#6b7280" /> <strong>3</strong> beds</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Bath size={20} color="#6b7280" /> <strong>2</strong> baths</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Expand size={20} color="#6b7280" /> <strong>1,982</strong> sqft</span>
                            </div>
                            <div style={{ fontSize: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={18} color="#6b7280" /> 5931 Abernathy Dr, Los Angeles, CA 90045
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>About Home</h2>
                                <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', height: '32px' }}>
                                    More Detail <ExternalLink size={14} />
                                </Button>
                            </div>
                            <p style={{ lineHeight: '1.6', color: '#4b5563', fontSize: '15px' }}>
                                This beautiful newly painted 3 bedroom, 2 bath condo offers an open an open floor plan with abundant natural light and small private balcony with city view, perfect for relaxing, weekend coffee, or ice cream. Ideally located near the 101 freeway, Ventura Blvd. The master has a private mirrored vanity. The bedrooms have mirrored closet doors. Walking distance to Tarzana village safari, shopping centers, restaurants, grocery stores. Gated community, Complex has a Laundry room. Come see it yourself.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Financial Card */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <Card padding="0" style={{ border: '1px solid #000', borderRadius: '16px', overflow: 'hidden' }}>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span style={{ color: '#374151' }}>Home Price</span>
                                    <span style={{ fontWeight: 600 }}>{formatCurrency(displayPrice)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span style={{ color: '#374151' }}>Zestimate</span>
                                    <span style={{ fontWeight: 600 }}>{formatCurrency(displayZestimate)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span style={{ color: '#374151' }}>Down Payment</span>
                                    <span style={{ fontWeight: 600 }}>{formatCurrency(displayDownPayment)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span style={{ color: '#374151' }}>Term</span>
                                    <span style={{ fontWeight: 600 }}>{displayTerm} years</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span style={{ color: '#374151' }}>Interest rate</span>
                                    <span style={{ fontWeight: 600 }}>{displayRate}%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span style={{ color: '#374151' }}>Monthly P&I</span>
                                    <span style={{ fontWeight: 600 }}>{formatCurrency(displayMonthly)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', alignItems: 'center' }}>
                                    <span style={{ color: '#374151' }}>Category type</span>
                                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {displayRisk} <HelpCircle size={14} color="#9ca3af" />
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0', fontSize: '14px' }}>
                                    <span style={{ color: '#374151' }}>Negotiable</span>
                                    <span style={{ fontWeight: 600 }}>Yes</span>
                                </div>
                            </div>
                        </Card>
                        <Button onClick={() => setIsVisitModalOpen(true)} style={{ width: '100%', marginTop: '16px', backgroundColor: 'black', borderRadius: '12px', height: '48px', fontSize: '15px' }}>
                            Request a visit
                        </Button>
                    </div>

                </div>
            </div>

            <RequestVisitModal isOpen={isVisitModalOpen} onClose={() => setIsVisitModalOpen(false)} />
        </div>
    );
};

export default ListingDetail;
