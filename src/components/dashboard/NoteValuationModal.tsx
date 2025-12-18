import React, { useState, useEffect } from 'react';
import { X, ExternalLink, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

interface NoteValuationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onList: (price: number) => void;
    upb: number; // Unpaid Principal Balance
}

const NoteValuationModal: React.FC<NoteValuationModalProps> = ({ isOpen, onClose, onList, upb }) => {
    const [step, setStep] = useState<'pricing' | 'cashout' | 'processing' | 'confirmed'>('pricing');
    const [selectedPreset, setSelectedPreset] = useState<'fast' | 'market' | 'premium' | 'custom' | null>(null);
    const [customPrice, setCustomPrice] = useState<string>('500000');

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep('pricing');
            setSelectedPreset('market'); // Default selection
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Pricing Logic (Mock) based on UPB (~519k)
    const presets = {
        fast: { price: 480000, yield: '7.1%', label: 'Sell faster' },
        market: { price: 500000, yield: '6.0%', label: 'Market average' },
        premium: { price: 510000, yield: '5.5%', label: 'Premium' }
    };

    const getCurrentPrice = () => {
        if (selectedPreset === 'custom') return parseInt(customPrice.replace(/,/g, '')) || 0;
        if (selectedPreset && presets[selectedPreset]) return presets[selectedPreset].price;
        return 0;
    };

    const currentPrice = getCurrentPrice();
    const tokenizationFee = Math.round(currentPrice * 0.005); // 0.5%
    const successFee = Math.round(currentPrice * 0.01); // 1%

    // Mock Yield Calculation for Custom Price
    const calculateYield = (price: number) => {
        if (price === 0) return '0.0%';
        const baseYield = 6.0;
        const basePrice = 500000;
        const implied = baseYield * (basePrice / price);
        return implied.toFixed(1) + '%';
    };

    const currentYield = selectedPreset === 'custom' ? calculateYield(currentPrice) : (selectedPreset ? presets[selectedPreset].yield : '0.0%');

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const handleContinue = () => {
        setStep('cashout');
    };

    const handleList = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('confirmed');
            onList(currentPrice);
        }, 2500);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '16px', width: '520px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative',
                maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                            {step === 'pricing' ? 'Note Pricing' : (step === 'cashout' ? 'Cash Out' : (step === 'confirmed' ? 'Complete' : 'Processing'))}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                        <X size={20} color="#9ca3af" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ overflowY: 'auto' }}>
                    {step === 'pricing' && (
                        <div style={{ padding: '24px' }}>
                            {/* Section A: Estimated Value */}
                            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Estimated Note Value</div>
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                                    {formatCurrency(500000)}
                                </div>

                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#4b5563' }}>
                                    <span>As % of UPB: <strong>96%</strong></span>
                                    <span>Implied Buyer Yield: <strong>6.0%</strong></span>
                                </div>
                            </div>

                            {/* Section D: Rationale */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pricing Rationale</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>LTV</span> <strong>44% (Low Risk)</strong></li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Payment History</span> <strong>23/24 On-time</strong></li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seasoning</span> <strong>69 Months</strong></li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Buyer Credit</span> <strong>680-720</strong></li>
                                </ul>
                            </div>
                        </div>
                    )}


                    {step === 'cashout' && (
                        <div style={{ padding: '24px' }}>
                            {/* Section: Select Target Price (Moved from Step 1) */}
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Select Listing Price</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {(['fast', 'market', 'premium'] as const).map(key => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedPreset(key)}
                                            style={{
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: `1px solid ${selectedPreset === key ? 'black' : '#e5e7eb'}`,
                                                backgroundColor: selectedPreset === key ? '#f9fafb' : 'white',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                cursor: 'pointer', outline: 'none', transition: 'all 0.2s'
                                            }}
                                        >
                                            <span style={{ fontSize: '14px', color: '#374151' }}>{presets[key].label}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                                                {formatCurrency(presets[key].price)} <span style={{ color: '#6b7280', fontWeight: 400 }}>(IRR at maturity {presets[key].yield})</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {/* Custom Price Input */}
                                <div style={{ marginTop: '12px' }}>
                                    <div
                                        onClick={() => setSelectedPreset('custom')}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span style={{ fontSize: '14px', color: '#374151' }}>Or set custom amount</span>
                                        <div style={{
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: selectedPreset === 'custom' ? 'white' : 'white',
                                            border: `1px solid ${selectedPreset === 'custom' ? 'black' : '#d1d5db'}`,
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            width: '140px',
                                            transition: 'border-color 0.2s',
                                            boxShadow: selectedPreset === 'custom' ? '0 0 0 1px black' : 'none'
                                        }}>
                                            <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '4px' }}>$</span>
                                            <input
                                                type="text"
                                                value={customPrice}
                                                onChange={(e) => {
                                                    setCustomPrice(e.target.value);
                                                    setSelectedPreset('custom');
                                                }}
                                                style={{
                                                    width: '100%',
                                                    border: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: '#111827',
                                                    outline: 'none',
                                                    padding: 0,
                                                    textAlign: 'left' // Keeps text next to $
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Consolidated Fees */}
                            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', backgroundColor: 'white', marginBottom: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Fee Breakdown</div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '14px', color: '#4b5563' }}>Tokenization Fee (0.5%)</span>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{formatCurrency(tokenizationFee)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed #e5e7eb' }}>
                                    <span style={{ fontSize: '14px', color: '#4b5563' }}>Success Fee (1.0%)</span>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{formatCurrency(successFee)}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>Total Fees (1.5%)</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{formatCurrency(tokenizationFee + successFee)}</span>
                                </div>
                                <div style={{ borderTop: '2px solid #e5e7eb', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#059669' }}>Net Proceeds</span>
                                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>{formatCurrency(currentPrice - (tokenizationFee + successFee))}</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px', padding: '0 8px' }}>
                                <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', textAlign: 'center' }}>
                                    Fees are deducted from the investment proceeds only upon 100% funding completion within the 30-day investment period.
                                </div>
                            </div>

                            {/* Section C: Warning */}
                            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '8px', padding: '12px', display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                <AlertTriangle size={20} color="#ea580c" style={{ flexShrink: 0 }} />
                                <div style={{ fontSize: '13px', color: '#9a3412', lineHeight: '1.5' }}>
                                    <strong>Important:</strong> Once listed, you cannot modify contract terms.
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div style={{ padding: '64px 32px', textAlign: 'center' }}>
                            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f4f6', borderTop: '3px solid black', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }}></div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Preparing note for investor marketplace...</h3>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Creating SPV structure and tokenizing assets</p>
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        </div>
                    )}

                    {step === 'confirmed' && (
                        <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <CheckCircle size={32} color="#166534" />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Listed for Investment (Mock)</h2>

                            <div style={{ backgroundColor: '#111827', borderRadius: '8px', padding: '16px', marginBottom: '24px', textAlign: 'left', fontFamily: 'monospace', fontSize: '12px', color: '#e5e7eb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#9ca3af' }}>Status:</span>
                                    <span style={{ color: '#4ade80' }}>Confirmed on Testnet</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#9ca3af' }}>Tx Hash:</span>
                                    <span>0x71c...9a2b</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#9ca3af' }}>Contract:</span>
                                    <span>0x8f3...4k9p</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                {(step === 'pricing' || step === 'cashout' || step === 'confirmed') && (
                    <div style={{ padding: '20px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        {step === 'pricing' && (
                            <>
                                <Button onClick={onClose} variant="secondary" style={{ borderRadius: '50px', padding: '10px 20px' }}>Cancel</Button>
                                <Button onClick={handleContinue} style={{ backgroundColor: 'black', color: 'white', borderRadius: '50px', padding: '10px 24px' }}>Continue to Cash Out</Button>
                            </>
                        )}
                        {step === 'cashout' && (
                            <>
                                <Button onClick={() => setStep('pricing')} variant="secondary" style={{ borderRadius: '50px', padding: '10px 20px' }}>Back to Pricing</Button>
                                <Button onClick={handleList} style={{ backgroundColor: 'black', color: 'white', borderRadius: '50px', padding: '10px 24px' }}>List Note</Button>
                            </>
                        )}
                        {step === 'confirmed' && (
                            <>
                                <Button onClick={onClose} variant="secondary" style={{ borderRadius: '50px', padding: '10px 20px' }}>Close</Button>
                                <Button onClick={onClose} style={{ backgroundColor: 'black', color: 'white', borderRadius: '50px', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Go to Investor Marketplace (Mock) <ExternalLink size={16} />
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteValuationModal;
