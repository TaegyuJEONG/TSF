import React, { useState } from 'react';
import Button from '../ui/Button';
import confetti from 'canvas-confetti';
import { generateContractHash, generateCreditHash } from '../../utils/crypto';
import { submitCustodialTransaction, type TransactionResult } from '../../utils/blockchain';

interface DocumentItemProps {
    title: string;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '12px', overflow: 'hidden', backgroundColor: 'white' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: isOpen ? '#f9fafb' : 'white'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* PDF Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 13H16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 17H12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="6.5" y="16.5" fontFamily="Arial" fontSize="6" fill="#EF4444" fontWeight="bold">PDF</text>
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{title}</span>
                </div>
                {/* Chevrons */}
                {isOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>

            {isOpen && (
                <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    <div style={{
                        height: '200px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '13px'
                    }}>
                        PDF Preview Placeholder for {title}
                    </div>
                </div>
            )}
        </div>
    );
};

interface ContractDocumentListProps {
    onComplete: () => void;
    summary: {
        monthlyPayment: number;
        totalRepayment: number;
        contractFee: number;
        price: number;
        downPayment: number;
        loanAmount: number;
    };
    onClose: () => void;
}

const ContractDocumentList: React.FC<ContractDocumentListProps> = ({ onComplete, summary, onClose }) => {
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'registering' | 'completed' | 'error'>('pending');
    const [txResult, setTxResult] = useState<TransactionResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const documents = [
        "Purchase Agreement",
        "Seller Financing Addendum",
        "Promissory Note",
        "Deed of Trust",
        "Amortization Schedule"
    ];

    const handlePayment = async () => {
        try {
            setPaymentStatus('registering');
            setErrorMsg("");

            // 1. Prepare Data
            const contractData = {
                documents,
                summary,
                version: "1.0",
                timestamp: Date.now()
            };

            // Mock Credit Summary (No PII)
            const creditSummary = {
                verified: true,
                scoreTier: "Excellent",
                checkDate: new Date().toISOString().split('T')[0],
                provider: "TrustPartnerAuth"
            };

            // 2. Hash Data
            const contractHash = generateContractHash(contractData);
            const creditHash = generateCreditHash(creditSummary);

            console.log("Anchoring Hashes:", { contractHash, creditHash });

            // 3. Submit Transaction
            const result = await submitCustodialTransaction(contractHash, creditHash);

            setTxResult(result);
            setPaymentStatus('completed');

            // 4. Fire Confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

            if (onComplete) onComplete();

        } catch (err: unknown) {
            console.error("Payment Error:", err);
            setPaymentStatus('error');
            const message = err instanceof Error ? err.message : "Transaction failed";
            setErrorMsg(message);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '0px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    zIndex: 10
                }}
            >
                &times;
            </button>

            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Contract Documents</h2>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Generated based on the agreed terms.</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
                {documents.map((doc, index) => (
                    <DocumentItem key={index} title={doc} />
                ))}
            </div>

            {/* Fee Summary */}
            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>House Price</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.price)}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Down Payment</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.downPayment)}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #d1d5db' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Contract Fee (1% of Principal)</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.contractFee)}
                    </span>
                </div>
            </div>

            {/* Payment Button & Status */}
            {paymentStatus === 'pending' && (
                <Button
                    onClick={handlePayment}
                    fullWidth
                    style={{ height: '52px', backgroundColor: '#000', color: 'white', fontSize: '16px', fontWeight: 600 }}
                >
                    Payment
                </Button>
            )}

            {paymentStatus === 'registering' && (
                <Button
                    disabled
                    fullWidth
                    style={{ height: '52px', backgroundColor: '#374151', color: 'white', fontSize: '16px', fontWeight: 600, cursor: 'wait' }}
                >
                    Registering Contract on Blockchain...
                </Button>
            )}

            {paymentStatus === 'error' && (
                <div>
                    <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '14px', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                    <Button
                        onClick={() => setPaymentStatus('pending')} // Retry
                        fullWidth
                        style={{ height: '52px', backgroundColor: '#dc2626', color: 'white', fontSize: '16px', fontWeight: 600 }}
                    >
                        Retry Payment
                    </Button>
                </div>
            )}

            {paymentStatus === 'completed' && txResult && (
                <div>
                    <div style={{
                        marginTop: '0px',
                        marginBottom: '24px',
                        padding: '16px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 4L12 14.01L9 11.01" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#166534' }}>RWA Contract Registered</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#374151' }}>Transaction Hash</span>
                                <a
                                    href={`https://explorer.sepolia.mantle.xyz/tx/${txResult.hash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: '12px', fontFamily: 'monospace', color: '#2563eb', backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #bbf7d0', textDecoration: 'none', cursor: 'pointer' }}
                                >
                                    {txResult.hash.slice(0, 6)}...{txResult.hash.slice(-4)}
                                </a>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#374151' }}>Recorded By</span>
                                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6b7280', backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                                    Trust Partner
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#374151' }}>Network Status</span>
                                <span style={{ fontSize: '12px', fontWeight: 500, color: '#16a34a' }}>
                                    ● Confirmed on Mantle Testnet
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled
                        fullWidth
                        style={{ height: '52px', backgroundColor: '#22c55e', color: 'white', fontSize: '16px', fontWeight: 600, cursor: 'default', border: 'none' }}
                    >
                        Success
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ContractDocumentList;
