import React, { useState } from 'react';
import Button from '../ui/Button';
import { getContractSnapshot, processPayment } from '../../services/paymentService';
import type { PaymentEvent } from '../../types/payment';
import { Shield, CheckCircle } from 'lucide-react';

interface PaymentProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    dueAmount: number;
    dueDate: string;
    onPaymentSuccess: (event: PaymentEvent) => void;
}

const PaymentProcessModal: React.FC<PaymentProcessModalProps> = ({
    isOpen,
    onClose,
    dueAmount,
    dueDate,
    onPaymentSuccess
}) => {
    const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');
    const [txHash, setTxHash] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    if (!isOpen) return null;

    const contractSnapshot = getContractSnapshot();
    const isGenesis = contractSnapshot.source === 'GENESIS';

    const handleConfirm = async () => {
        setStep('processing');
        setErrorMsg('');
        try {
            // Mock principal/interest split for this demo
            const principal = dueAmount * 0.6;
            const interest = dueAmount * 0.4;

            const result = await processPayment(
                { principal, interest, total: dueAmount, currency: 'USD' },
                dueDate
            );

            setTxHash(result.tx.hash);
            setStep('success');

            // Wait a moment before closing/callback to show success state
            setTimeout(() => {
                onPaymentSuccess(result.event);
            }, 3000);

        } catch (error: any) {
            console.error("Payment failed", error);
            setErrorMsg(error.message || "Payment processing failed");
            setStep('review'); // Go back to allow retry
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '480px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                {step === 'review' && (
                    <>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Complete Payment</h2>

                        {/* Amount */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Due</div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>
                                ${dueAmount.toLocaleString()}
                            </div>
                        </div>

                        {/* Contract Linkage Preview */}
                        <div style={{
                            backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px',
                            border: '1px solid #e5e7eb', marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={16} color="#4f46e5" />
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Contract Linkage</span>
                                </div>
                                {isGenesis ? (
                                    <span style={{
                                        backgroundColor: '#fffbeb', color: '#d97706', fontSize: '11px',
                                        padding: '2px 8px', borderRadius: '999px', fontWeight: 600, border: '1px solid #fcd34d'
                                    }}>
                                        GENESIS / MOCK
                                    </span>
                                ) : (
                                    <span style={{
                                        backgroundColor: '#ecfdf5', color: '#059669', fontSize: '11px',
                                        padding: '2px 8px', borderRadius: '999px', fontWeight: 600, border: '1px solid #6ee7b7'
                                    }}>
                                        VERIFIED
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: '13px', color: '#6b7280', display: 'grid', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Contract Hash:</span>
                                    <span style={{ fontFamily: 'monospace' }}>{contractSnapshot.contractHash.slice(0, 8)}...</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Credit Hash:</span>
                                    <span style={{ fontFamily: 'monospace' }}>{contractSnapshot.creditHash.slice(0, 8)}...</span>
                                </div>
                            </div>
                        </div>

                        {errorMsg && (
                            <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                                {errorMsg}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Button
                                onClick={onClose}
                                style={{ flex: 1, backgroundColor: 'white', border: '1px solid #d1d5db', color: '#374151' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                style={{ flex: 1, backgroundColor: '#000', color: 'white' }}
                            >
                                Confirm & Pay
                            </Button>
                        </div>
                    </>
                )}

                {step === 'processing' && (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div className="spinner" style={{
                            width: '40px', height: '40px', border: '4px solid #f3f3f3',
                            borderTop: '4px solid #4f46e5', borderRadius: '50%', margin: '0 auto 16px',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Processing Payment</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Anchoring to Mantle Sepolia...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Payment Recorded</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                            Successfully anchored to blockchain.
                        </p>
                        <div style={{
                            backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '8px',
                            fontSize: '12px', fontFamily: 'monospace', color: '#374151'
                        }}>
                            Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PaymentProcessModal;
