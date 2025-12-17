import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet, ExternalLink, X, CheckCircle } from 'lucide-react';

const InvestorConnectWallet = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        setIsModalOpen(true);
    };

    const handleWalletSelect = (_walletName: string) => {
        // Mock connection
        setTimeout(() => {
            setWalletAddress('0xA3f...92C');
            setIsConnected(true);
            setIsModalOpen(false);
        }, 500);
    };

    const handleNext = () => {
        navigate('/investor/identity-verification');
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
                    onClick={() => navigate('/select-role')}
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
                paddingBottom: '80px' // visual balance
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
                    <h1 style={{ marginBottom: '12px', fontSize: '24px' }}>Connect your wallet</h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        marginBottom: '32px'
                    }}>
                        Wallet is used for ownership records and distributions only.
                    </p>

                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
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
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <Wallet size={20} />
                            Connect Wallet
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{
                                backgroundColor: '#F0FDF4', // Light green
                                border: '1px solid #DCFCE7',
                                borderRadius: 'var(--border-radius-md)',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textAlign: 'left'
                            }}>
                                <CheckCircle size={24} color="#16A34A" />
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#14532D' }}>Wallet connected</div>
                                    <div style={{ fontSize: '13px', color: '#166534', fontFamily: 'monospace' }}>{walletAddress}</div>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'var(--color-primary-900)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--border-radius-md)',
                                    padding: '14px',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '400px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: 600 }}>Connect a Wallet</span>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} color="var(--color-text-secondary)" />
                            </button>
                        </div>
                        <div style={{ padding: '16px' }}>
                            {[
                                { name: 'MetaMask', color: '#F16822' }, // Orange
                                { name: 'Coinbase Wallet', color: '#0052FF' }, // Blue
                                { name: 'WalletConnect', color: '#3B99FC' } // Light Blue
                            ].map((wallet) => (
                                <button
                                    key={wallet.name}
                                    onClick={() => handleWalletSelect(wallet.name)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        backgroundColor: 'white',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        color: 'var(--color-text-main)',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-gray)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    {wallet.name}
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: wallet.color,
                                        opacity: 0.2
                                    }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestorConnectWallet;
