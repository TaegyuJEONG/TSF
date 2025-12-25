import React, { useState } from 'react';
import Button from '../ui/Button';
import { savePaymentEvent } from '../../services/paymentService';
import type { PaymentEvent } from '../../types/payment';
import { Shield, CheckCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { callContractAsSPV } from '../../utils/blockchain';
import ListingABI from '../../abis/Listing.json';
import DemoUSD_ABI from '../../abis/DemoUSD.json';

interface PaymentProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    dueAmount: number;
    dueDate: string;
    onPaymentSuccess: (event: PaymentEvent) => void;
}

const LISTING_ADDRESS = "0x376EDcdbc2Ef192d74937BF61C0E0CB8c20c95b0";
const DEMOUSD_ADDRESS = "0x2f514963a095533590E1FB98eedC637D3947d219";

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

    const handleConfirm = async () => {
        setStep('processing');
        setErrorMsg('');
        try {
            // Check if funding is complete (100%)
            const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz');
            const listing = new ethers.Contract(LISTING_ADDRESS, ListingABI, provider);

            const raised = await listing.raised();
            const goal = await listing.goal();
            const isFundingComplete = Number(raised) >= Number(goal);

            console.log(`Funding status: ${Number(raised)}/${Number(goal)} = ${isFundingComplete ? 'COMPLETE' : 'INCOMPLETE'}`);

            if (!isFundingComplete) {
                // BEFORE 100%: TSF → TSF anchoring only (데이터만 기록)
                console.log("Funding incomplete. Anchoring payment data only (TSF→TSF)...");

                const principal = dueAmount * 0.6;
                const interest = dueAmount * 0.4;

                const paymentData = {
                    type: 'PAYMENT_RECORD',
                    scheduledDueDate: dueDate,
                    receivedAt: new Date().toISOString(),
                    amount: { principal, interest, total: dueAmount, currency: 'USD' },
                    status: 'ANCHORED_PRE_FUNDING'
                };

                const anchorResult = await submitCustodialTransaction(JSON.stringify(paymentData));
                console.log("Payment data anchored:", anchorResult.hash);
                setTxHash(anchorResult.hash);

                // Save event locally
                const paymentEvent: any = {
                    eventId: `payment_${Date.now()}`,
                    scheduledDueDate: dueDate,
                    receivedAt: new Date().toISOString(),
                    amount: { principal, interest, total: dueAmount, currency: 'USD' },
                    statusAfter: 'ANCHORED',
                    anchoredTxHash: anchorResult.hash
                };

                savePaymentEvent(paymentEvent);
                setStep('success');

                setTimeout(() => {
                    onPaymentSuccess(paymentEvent);
                }, 3000);

            } else {
                // AFTER 100%: SPV → Contract (실제 DemoUSD 전송)
                console.log("Funding complete. Transferring DemoUSD (SPV→Contract)...");

                const amountWei = ethers.parseUnits(dueAmount.toString(), 6);

                // 1. Approve DemoUSD spending
                console.log("Approving DemoUSD spending...");
                const approveTxResult = await callContractAsSPV(
                    DEMOUSD_ADDRESS,
                    DemoUSD_ABI,
                    'approve',
                    [LISTING_ADDRESS, amountWei]
                );
                console.log("DemoUSD approved:", approveTxResult.hash);

                // 2. Make payment to contract
                console.log("Making payment to Listing contract...");
                const paymentTxResult = await callContractAsSPV(
                    LISTING_ADDRESS,
                    ListingABI,
                    'makePayment',
                    [1, amountWei] // noteId = 1
                );

                console.log("Payment successful! TX:", paymentTxResult.hash);
                setTxHash(paymentTxResult.hash);

                // 3. Save event locally
                const principal = dueAmount * 0.6;
                const interest = dueAmount * 0.4;

                const paymentEvent: any = {
                    eventId: `payment_${Date.now()}`,
                    scheduledDueDate: dueDate,
                    receivedAt: new Date().toISOString(),
                    amount: { principal, interest, total: dueAmount, currency: 'USD' },
                    statusAfter: 'PAID',
                    anchoredTxHash: paymentTxResult.hash
                };

                savePaymentEvent(paymentEvent);
                setStep('success');

                setTimeout(() => {
                    onPaymentSuccess(paymentEvent);
                }, 3000);
            }

        } catch (error: any) {
            console.error("Payment failed", error);
            setErrorMsg(error.message || "Payment processing failed");
            setStep('review');
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
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Blockchain Payment</span>
                                </div>
                                <span style={{
                                    backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '11px',
                                    padding: '2px 8px', borderRadius: '999px', fontWeight: 600, border: '1px solid #93c5fd'
                                }}>
                                    ON-CHAIN
                                </span>
                            </div>

                            <div style={{ fontSize: '13px', color: '#6b7280', display: 'grid', gap: '8px' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Payment will be sent to:</div>
                                    <div style={{ fontWeight: 600, color: '#374151' }}>Listing Contract: {LISTING_ADDRESS.slice(0, 20)}...</div>
                                    <div style={{ fontWeight: 600, color: '#374151', marginTop: '4px' }}>Network: Mantle Sepolia</div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>
                                    💡 Payment will be automatically distributed pro-rata to all investors
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
