import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronLeft, UploadCloud, FileText, CheckCircle, Shield, AlertCircle, X } from 'lucide-react';

const OwnerVerification: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/owner-onboarding')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                    <ChevronLeft size={18} /> Back to details
                </button>
            </div>

            <Card style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }} padding="32px">
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Shield size={24} color="#2563eb" />
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px', color: '#111827' }}>Verify Ownership</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                        To prevent fraud, we need to verify you are the legal owner. Please upload one of the accepted documents below.
                    </p>
                </div>

                {/* Accepted Documents Info */}
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Accepted Documents (Upload one):</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                            'Warranty Deed',
                            'Property Tax Bill (Latest)',
                            'Mortgage Statement',
                            'Homeowners Insurance Policy'
                        ].map(doc => (
                            <li key={doc} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                                <CheckCircle size={14} color="#16a34a" /> {doc}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Upload Area */}
                {!file ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                            border: `2px dashed ${isDragging ? '#2563eb' : '#d1d5db'}`,
                            borderRadius: '12px',
                            padding: '40px 24px',
                            textAlign: 'center',
                            backgroundColor: isDragging ? '#eff6ff' : '#ffffff',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <UploadCloud size={24} color="#6b7280" />
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                                Click to upload or drag & drop
                            </span>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                PDF, JPG or PNG (Max 10MB)
                            </span>
                        </label>
                    </div>
                ) : (
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f9fafb' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#e0f2fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                            <FileText size={20} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {file.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#9ca3af', display: 'flex' }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Footer Buttons */}
                <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/owner-onboarding')}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => navigate('/property-photos')}
                        disabled={!file}
                        style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}
                    >
                        Submit & Verify
                    </Button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '12px' }}>
                    <AlertCircle size={12} />
                    <span>Your documents are encrypted and only used for verification.</span>
                </div>

            </Card>
        </div>
    );
};

export default OwnerVerification;
