import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Loader2 } from 'lucide-react';

const InvestorIdentityVerification = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartVerification = () => {
        setIsLoading(true);
        // Simulate redirect / verify process
        setTimeout(() => {
            navigate('/investor/verification-complete');
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-surface-gray)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Nav */}
            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/investor/connect-wallet')}
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

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: '80px'
            }}>
                <div style={{
                    backgroundColor: 'var(--color-surface-white)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '48px',
                    width: '100%',
                    maxWidth: '480px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF', // Light blue
                        color: '#2563EB', // Blue 600
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto'
                    }}>
                        <ShieldCheck size={32} />
                    </div>

                    <h1 style={{ marginBottom: '12px', fontSize: '24px' }}>Identity Verification</h1>

                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        marginBottom: '32px'
                    }}>
                        To comply with financial regulations, identity verification is required.
                        This process is securely handled by our licensed partner.
                    </p>

                    <div style={{
                        backgroundColor: 'var(--color-surface-gray)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '16px',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '8px'
                        }}>
                            Powered by
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontWeight: 700,
                            fontSize: '18px',
                            color: 'var(--color-text-main)'
                        }}>
                            <span style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#1e293b',
                                color: 'white',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px'
                            }}>S</span>
                            Securitize
                        </div>
                    </div>

                    <button
                        onClick={handleStartVerification}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            backgroundColor: isLoading ? 'var(--color-primary-600)' : 'var(--color-primary-900)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--border-radius-md)',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: 500,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {isLoading && <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
                        {isLoading ? 'Verifying...' : 'Start Verification'}
                    </button>

                    <p style={{
                        marginTop: '16px',
                        fontSize: '13px',
                        color: 'var(--color-text-muted)'
                    }}>
                        You will be redirected to a secure verification page.
                    </p>
                </div>
            </div>
            <style>
                {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default InvestorIdentityVerification;
