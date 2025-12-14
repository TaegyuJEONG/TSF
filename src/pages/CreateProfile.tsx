import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ChevronLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateProfile: React.FC = () => {
    const navigate = useNavigate();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setPhotoPreview(objectUrl);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/')} // Placeholder link to "Marketplace"
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
                <form onSubmit={(e) => { e.preventDefault(); navigate('/select-role'); }}>

                    <Input label="Full Name" placeholder="" />
                    <Input label="Email" type="email" placeholder="" />
                    <Input label="Phone Number" type="tel" placeholder="" />

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
