import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronLeft, ChevronRight, UploadCloud, X, Plus } from 'lucide-react';
import { Input } from '../components/ui/Input';

const PropertyPhotos: React.FC = () => {
    const navigate = useNavigate();

    // State for Photos
    const [photos, setPhotos] = useState<{ id: number, url: string, title: string }[]>([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        setIsSaved(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
        setIsSaved(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhotos = [...photos];
        newPhotos[currentIndex].title = e.target.value;
        setPhotos(newPhotos);
        setIsSaved(false);
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const removePhoto = () => {
        const newPhotos = photos.filter((_, idx) => idx !== currentIndex);
        setPhotos(newPhotos);
        if (currentIndex >= newPhotos.length) setCurrentIndex(Math.max(0, newPhotos.length - 1));
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAddPhoto = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newUrl = URL.createObjectURL(file);
            const newId = Math.max(...photos.map(p => p.id), 0) + 1;

            setPhotos([...photos, {
                id: newId,
                url: newUrl,
                title: ''
            }]);
            setCurrentIndex(photos.length); // Move to the new photo
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                accept="image/*"
            />

            {/* Top Navigation */}
            <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/owner-verification')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            <Card style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }} padding="32px">
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px', color: '#111827' }}>Showcase Your Home</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Upload high-quality photos to attract buyers.
                    </p>
                </div>

                {photos.length > 0 ? (
                    <div style={{ marginBottom: '40px' }}>
                        {/* Add Photo Button (Top Right) */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                            <Button
                                variant="outline"
                                onClick={handleAddPhoto}
                                style={{ fontSize: '13px', padding: '8px 12px', height: 'auto' }}
                            >
                                <Plus size={14} style={{ marginRight: '4px' }} /> Add Another Photo
                            </Button>
                        </div>

                        {/* Carousel Area */}
                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '400px', backgroundColor: '#f3f4f6', marginBottom: '24px' }}>
                            <img
                                src={photos[currentIndex].url}
                                alt="Property"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* Navigation Arrows */}
                            {photos.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        style={{
                                            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)',
                                            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        style={{
                                            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                                            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)',
                                            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={removePhoto}
                                style={{
                                    position: 'absolute', top: '16px', right: '16px',
                                    padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.9)', color: 'white',
                                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                    fontSize: '12px', fontWeight: 600
                                }}
                            >
                                <X size={14} /> Remove
                            </button>

                            {/* Counter */}
                            <div style={{
                                position: 'absolute', bottom: '16px', right: '16px',
                                padding: '4px 12px', borderRadius: '99px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white',
                                fontSize: '12px', fontWeight: 500
                            }}>
                                {currentIndex + 1} / {photos.length}
                            </div>
                        </div>

                        {/* Title Input */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                {/* Override margin-bottom of container div inside Input via CSS module is hard, but we know Input has mb-16. 
								    We can just align the button to match. 
									Input wrapper has label + input + mb-16.
									We need to manually construct the Label here to control layout or rely on Input.
									Let's try to pass className or just use inline style hack.
									Actually, simpler: Just structure it so Button is OUTSIDE the flex alignment issue or enforce height.
									The Input component has a hardcoded mb-16 on the WRAPPER.
									So we can apply mb-16 to the button too (I did that before).
									If heights differ, it's likely font/padding. 
									Input: p-10px 12px. Font 14px. Border 1px. Total Height = 14 + 20 + 2 = 36px? No line-height usually adds some.
									Button (variant outline): Check Button.tsx. Usually has padding.
									Let's enforce height: '42px' on both? pass style to Input to force height?
								*/}
                                <Input
                                    label="Photo Title / Caption"
                                    value={photos[currentIndex].title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g. Spacious Living Room with plenty of light"
                                    style={{ height: '42px', boxSizing: 'border-box' }} // Force input height
                                />
                            </div>
                            <Button
                                variant={isSaved ? "outline" : "primary"}
                                onClick={handleSave}
                                style={{
                                    height: '42px',
                                    marginBottom: '16px',
                                    backgroundColor: isSaved ? 'white' : 'black',
                                    color: isSaved ? 'green' : 'white',
                                    borderColor: isSaved ? 'green' : 'transparent',
                                    minWidth: '100px'
                                }}
                            >
                                {isSaved ? (
                                    <>Saved!</>
                                ) : (
                                    <>Save</>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Empty State / Upload
                    <div
                        onClick={handleAddPhoto}
                        style={{
                            border: '2px dashed #d1d5db', borderRadius: '12px', padding: '64px', textAlign: 'center',
                            backgroundColor: '#f9fafb', marginBottom: '40px', cursor: 'pointer'
                        }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <UploadCloud size={32} color="#2563eb" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Upload Property Photos</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Drag and drop or click to upload</p>
                    </div>
                )}

                {/* Footer Buttons */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button variant="outline" onClick={() => navigate('/owner-verification')}>
                        Back
                    </Button>
                    <Button onClick={() => navigate('/seller-financing-terms', { state: { photos } })} style={{ backgroundColor: '#000', minWidth: '140px' }}>
                        Continue
                    </Button>
                </div>

            </Card>
        </div>
    );
};

export default PropertyPhotos;
