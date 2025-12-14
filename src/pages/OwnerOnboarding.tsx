import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ChevronLeft, Home, MapPin, Calendar, Square, Link as LinkIcon, FileText } from 'lucide-react';

const OwnerOnboarding: React.FC = () => {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        address: '',
        propertyType: '',
        yearBuilt: '',
        bedrooms: '',
        surfaceArea: '',
        bathrooms: '',
        externalLink: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return formData.address && formData.propertyType && formData.yearBuilt;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/select-role')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                    <ChevronLeft size={18} /> Back to role selection
                </button>
            </div>

            <Card style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }} padding="32px">
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Home size={24} color="#2563eb" />
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px', color: '#111827' }}>Property Details</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Tell us about the property you'd like to offer with Seller Financing.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Address Section */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                            Property Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="e.g. 123 Maple Ave, Springfield, IL"
                                style={{ paddingLeft: '38px' }}
                            />
                        </div>
                    </div>

                    {/* Property Type */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                            Property Type
                        </label>
                        <Input
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            placeholder="e.g. Single Family Home, Condo, Townhouse"
                        />
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                Year Built
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <Input
                                    name="yearBuilt"
                                    value={formData.yearBuilt}
                                    onChange={handleChange}
                                    placeholder="e.g. 1995"
                                    style={{ paddingLeft: '38px' }}
                                    type="number"
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                Surface Area (sqft)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Square size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <Input
                                    name="surfaceArea"
                                    value={formData.surfaceArea}
                                    onChange={handleChange}
                                    placeholder="e.g. 2,400"
                                    style={{ paddingLeft: '38px' }}
                                    type="number"
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                Bedrooms
                            </label>
                            <Input
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                placeholder="e.g. 4"
                                type="number"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                Bathrooms
                            </label>
                            <Input
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                placeholder="e.g. 2.5"
                                type="number"
                            />
                        </div>
                    </div>

                    {/* Description Section */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                            About this Home
                        </label>
                        <div style={{ position: 'relative' }}>
                            <FileText size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '16px' }} />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Share what makes your home special... (e.g. key features, recent renovations, neighborhood vibes)"
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    padding: '12px 12px 12px 38px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    lineHeight: '1.5'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                    </div>

                    {/* External Link */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                            Link for more details (Optional)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <LinkIcon size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <Input
                                name="externalLink"
                                value={formData.externalLink}
                                onChange={handleChange}
                                placeholder="e.g. Zillow or Redfin URL"
                                style={{ paddingLeft: '38px' }}
                            />
                        </div>
                    </div>

                </div>

                {/* Footer Buttons */}
                <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/select-role')}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => navigate('/owner-verification')}
                        disabled={!isFormValid()}
                        style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}
                    >
                        Continue
                    </Button>
                </div>

            </Card>
        </div>
    );
};

export default OwnerOnboarding;
