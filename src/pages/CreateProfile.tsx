import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ChevronLeft, Upload } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CreateProfile: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'buyer'; // default to buyer if not specified

    // State for form fields
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [isFilled, setIsFilled] = useState(false);

    // Initial photo state should be null, will be filled on click
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Pre-fill data configuration
    const demoValues = {
        buyer: {
            fullName: 'Chris Richardson',
            email: 'chris.r@example.com',
            phone: '(555) 123-4567',
            photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
        },
        owner: {
            fullName: 'Michael Johnson',
            email: 'michael.j@example.com',
            phone: '(555) 123-4567',
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        }
    };

    // Magic fill on click
    React.useEffect(() => {
        const handleGlobalClick = () => {
            if (!isFilled) {
                const data = role === 'owner' ? demoValues.owner : demoValues.buyer;
                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone
                });
                setPhotoPreview(data.photo);
                setIsFilled(true);
            }
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [isFilled, role]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setPhotoPreview(objectUrl);
        }
    };

    const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate to appropriate onboarding page based on role
        if (role === 'buyer') {
            navigate('/buying-power');
        } else if (role === 'owner') {
            navigate('/owner-onboarding');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent magic fill if clicking back
                        navigate('/select-role');
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: 'var(--color-text-main)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <ChevronLeft size={18} /> Back to list
                </button>
            </div>

            {/* Main Card */}
            <Card style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }} padding="32px">
                <form onSubmit={handleContinue}>

                    <Input
                        label="Full Name"
                        placeholder="Type your name"
                        value={formData.fullName}
                        onChange={handleInputChange('fullName')}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                    />

                    {/* Custom Photo Upload Field */}
                    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary-800)' }}>Profile Photo</label>

                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                style={{ display: 'none' }}
                                id="photo-upload"
                            />

                            <label
                                htmlFor="photo-upload"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: photoPreview ? 'auto' : '48px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--border-radius-sm)',
                                    cursor: 'pointer',
                                    backgroundColor: 'white',
                                    overflow: 'hidden',
                                    transition: 'border-color 0.2s',
                                    padding: photoPreview ? '12px' : '0'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-600)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            >
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                                ) : (
                                    <Upload size={20} color="var(--color-text-main)" />
                                )}
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                        <Button type="submit" style={{ backgroundColor: '#000', color: 'white', padding: '10px 24px', borderRadius: '999px', fontSize: '14px' }}>
                            Continue
                        </Button>
                    </div>

                </form>
            </Card>

        </div>
    );
};

export default CreateProfile;
