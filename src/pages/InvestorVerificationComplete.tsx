import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Check } from 'lucide-react';

const InvestorVerificationComplete = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        // Navigate to dashboard or marketplace
        navigate('/investor-marketplace');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-surface-gray)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
        }}>
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
                    maxWidth: '480px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: '#DCFCE7', // Light green
                            color: '#16A34A', // Green 600
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto'
                        }}>
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>Verification complete</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
                            You are now ready to invest.
                        </p>
                    </div>

                    <div style={{
                        borderRadius: 'var(--border-radius-md)',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        marginBottom: '32px'
                    }}>
                        <StatusRow
                            label="Wallet Connection"
                            value="Connected"
                            subValue="0xA3f...92C"
                        />
                        <StatusRow
                            label="Identity Verification"
                            value="Verified"
                            subValue="Level 1 Cleared"
                        />
                        <StatusRow
                            label="Investor Status"
                            value="Eligible"
                            subValue="Accreditation not required"
                            isLast
                        />
                    </div>

                    <button
                        onClick={handleContinue}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--color-primary-900)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--border-radius-md)',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        Continue to Marketplace
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatusRow = ({ label, value, subValue, isLast }: { label: string, value: string, subValue?: string, isLast?: boolean }) => (
    <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: 'var(--color-surface-white)',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border)'
    }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-main)' }}>{label}</span>
            {subValue && <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{subValue}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#16A34A' }}>{value}</span>
            <CheckCircle2 size={16} color="#16A34A" />
        </div>
    </div>
);

export default InvestorVerificationComplete;
