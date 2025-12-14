import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronLeft, UploadCloud, FileText, X, Plus, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncomeVerification: React.FC = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<{ name: string; size: string }[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
            }));
            setFiles([...files, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/buying-power')}
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
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            {/* Main Card */}
            <Card style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }} padding="32px">
                <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Income Verification</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                        Please upload proof of income documents. <br />
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Accepted: Bank Statements (Last 3 months), W-2, or Pay Stubs.</span>
                    </p>
                </div>

                {/* Upload Area */}
                <div style={{ marginBottom: '24px' }}>
                    <input
                        type="file"
                        multiple
                        id="file-upload"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <label
                        htmlFor="file-upload"
                        style={{
                            border: '2px dashed var(--color-border)',
                            borderRadius: 'var(--border-radius-md)',
                            padding: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.2s',
                            color: 'var(--color-text-secondary)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                    >
                        <div style={{ width: '48px', height: '48px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: 'var(--shadow-sm)' }}>
                            <UploadCloud size={24} color="var(--color-primary-900)" />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary-900)' }}>Click to upload documents</span>
                        <span style={{ fontSize: '12px', marginTop: '4px' }}>PDF, PNG, JPG up to 10MB</span>
                    </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {files.map((file, idx) => (
                            <div key={idx} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-sm)',
                                backgroundColor: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FileText size={20} color="var(--color-primary-600)" />
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{file.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{file.size} • Uploaded</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(idx)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94a3b8' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <label htmlFor="file-upload" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            padding: '12px', border: '1px dashed var(--color-border)', borderRadius: 'var(--border-radius-sm)',
                            cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)'
                        }}>
                            <Plus size={16} /> Add another file
                        </label>
                    </div>
                )}

                {/* Security Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#ecfdf5', borderRadius: 'var(--border-radius-sm)', marginBottom: '32px' }}>
                    <Shield size={16} color="#059669" />
                    <span style={{ fontSize: '12px', color: '#065f46', fontWeight: 500 }}>Documents are encrypted and stored largely offline.</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="secondary" onClick={() => navigate('/')}>Skip for now</Button>
                    <Button
                        onClick={() => navigate('/buyer-preferences')} // Final destination after flow
                        style={{
                            backgroundColor: '#000',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '999px'
                        }}
                    >
                        Complete Verification
                    </Button>
                </div>
            </Card>

        </div>
    );
};

export default IncomeVerification;
