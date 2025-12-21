import React, { useState } from 'react';
import Button from '../ui/Button';
import confetti from 'canvas-confetti';
import { canonicalStringify, sha256 } from '../../utils/crypto';
import { submitCustodialTransaction, verifyTransaction, type TransactionResult } from '../../utils/blockchain';
import { saveContractSnapshot, clearPaymentEvents } from '../../services/paymentService';
import { type ContractData } from './ContractInputForm';
import { Download, ExternalLink, Copy, CheckCircle } from 'lucide-react';

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
    onComplete: (data: { txResult: TransactionResult, auditData: any }) => void;
    summary: {
        monthlyPayment: number;
        totalRepayment: number;
        contractFee: number;
        price: number;
        downPayment: number;
        loanAmount: number;
    };
    onClose: () => void;
    data: ContractData;
    initialCompletionData?: {
        txResult: TransactionResult;
        auditData: any;
    } | null;
}

const ContractDocumentList: React.FC<ContractDocumentListProps> = ({ onComplete, summary, onClose, data, initialCompletionData }) => {
    // If we have initial data, we are completed.
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'registering' | 'completed' | 'error'>(
        initialCompletionData ? 'completed' : 'pending'
    );
    const [txResult, setTxResult] = useState<TransactionResult | null>(initialCompletionData?.txResult || null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // Verification State
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'match' | 'mismatch' | null>(
        initialCompletionData ? 'match' : null
    );
    const [auditData, setAuditData] = useState<any>(initialCompletionData?.auditData || null);

    const documents = [
        "Purchase Agreement",
        "Seller Financing Addendum",
        "Promissory Note",
        "Deed of Trust",
        "Amortization Schedule"
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show a toast here
    };

    const handleDownloadAudit = () => {
        if (!auditData) return;
        const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-package-${auditData.anchorHash.slice(0, 8)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handlePayment = async () => {
        try {
            setPaymentStatus('registering');
            setErrorMsg("");
            setVerificationStatus(null);
            setAuditData(null);

            // 1. Build Mock Contract Data (State + Defaults)
            const mockContractData = {
                property: {
                    address: "5931 Abernathy Dr, Los Angeles, CA 90045",
                    price: summary.price
                },
                buyer: data.buyer || { name: "Unknown", email: "unknown@example.com" },
                terms: {
                    downPayment: summary.downPayment,
                    interestRate: parseFloat(data.interestRate),
                    term: data.term,
                    termUnit: data.termUnit,
                    paymentStructure: data.paymentStructure,
                    securityInstrument: data.securityInstrument,
                    lienPosition: data.lienPosition,
                    gracePeriodDays: parseInt(data.gracePeriod),
                    prepaymentAllowed: data.prepaymentAllowed === 'Yes',
                    prepaymentPenalty: data.prepaymentPenalty
                },
                calculated: {
                    monthlyPayment: summary.monthlyPayment,
                    totalRepayment: summary.totalRepayment,
                    contractFee: summary.contractFee
                },
                generatedDocs: documents
            };

            // 2. Build Mock Credit Assessment
            const mockCreditAssessment = {
                bureauScore: 720,
                dti: 0.28,
                incomeBand: "100k-150k",
                riskTier: "A",
                decision: "Approve",
                onChainCheck: true,
                assessmentTimestamp: new Date().toISOString()
            };

            // 3. Compute Hashes (Deterministic)
            const contractHash = await sha256(canonicalStringify(mockContractData));
            const creditHash = await sha256(canonicalStringify(mockCreditAssessment));

            console.log("Computed Hashes:", { contractHash, creditHash });

            // 4. Create Anchor Payload
            const anchorPayload = {
                version: "1.0",
                algo: "sha256",
                chainId: 5003, // Mantle Sepolia
                contractHash,
                creditHash,
                timestamp: new Date().toISOString(),
                propertyId: "prop_12345"
            };

            const anchorPayloadString = canonicalStringify(anchorPayload);
            const anchorHash = await sha256(anchorPayloadString);

            // 5. Submit Transaction (Anchor Payload)
            const result = await submitCustodialTransaction(anchorPayloadString);
            setTxResult(result);

            // 6. Verify Transaction (Read back from chain)
            setVerificationStatus('verifying');
            const onChainData = await verifyTransaction(result.hash);

            // Recompute local hash to verify integrity
            const recomputedAnchorHash = await sha256(onChainData);

            // Compare
            const isMatch = (recomputedAnchorHash === anchorHash) && (onChainData === anchorPayloadString);
            setVerificationStatus(isMatch ? 'match' : 'mismatch');


            // ... existing imports

            // ... existing code

            // 7. Prepare Audit Package
            setAuditData({
                mockContractData,
                mockCreditAssessment,
                anchorPayload,
                contractHash,
                creditHash,
                anchorHash,
                txHash: result.hash,
                chainId: 5003,
                network: "Mantle Sepolia Testnet",
                verification: isMatch ? "MATCH" : "MISMATCH"
            });

            // --- SAVE SNAPSHOT FOR PAYMENTS PAGE ---
            // Construct the snapshot reference expected by paymentService
            const newSnapshot: any = { // Utilizing 'any' temporarily to match ContractSnapshotRef structure easily
                schemaVersion: "contract_snapshot_ref_v1",
                contractId: `contract_${Date.now()}`,
                propertyId: anchorPayload.propertyId,
                chainId: 5003,
                contractHash,
                creditHash,
                anchorHash,
                contractTxHash: result.hash,
                anchoredAt: new Date().toISOString(),
                source: "LIVE"
            };
            saveContractSnapshot(newSnapshot);
            // Clear old payment history to start fresh for the new contract
            clearPaymentEvents();
            // ---------------------------------------

            setPaymentStatus('completed');

            // 8. Fire Confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

            if (onComplete) onComplete({
                txResult: result, // result is from scope above
                auditData: {
                    mockContractData,
                    mockCreditAssessment,
                    anchorPayload,
                    contractHash,
                    creditHash,
                    anchorHash,
                    txHash: result.hash,
                    chainId: 5003,
                    network: "Mantle Sepolia Testnet",
                    verification: isMatch ? "MATCH" : "MISMATCH"
                }
            });

        } catch (err: unknown) {
            console.error("Payment Error:", err);
            setPaymentStatus('error');
            setVerificationStatus('mismatch');
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

            {paymentStatus === 'completed' && txResult && auditData && (
                <div>
                    <div style={{
                        marginTop: '0px',
                        marginBottom: '24px',
                        padding: '16px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px'
                    }}>
                        {/* Success Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #bbf7d0' }}>
                            <CheckCircle size={20} color="#16a34a" />
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#166534' }}>RWA Contract Registered</span>
                        </div>

                        {/* Audit Verification Section */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Audit Verification</span>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: verificationStatus === 'match' ? '#16a34a' : '#dc2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    {verificationStatus === 'match' ? (
                                        <>✅ MATCH</>
                                    ) : (
                                        <>❌ MISMATCH</>
                                    )}
                                </span>
                            </div>

                            {/* Hashes */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.6)', padding: '4px 8px', borderRadius: '4px' }}>
                                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Contract Hash</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <code style={{ fontSize: '11px', color: '#374151' }}>{auditData.contractHash.slice(0, 8)}...{auditData.contractHash.slice(-6)}</code>
                                        <Copy size={12} color="#9ca3af" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(auditData.contractHash)} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.6)', padding: '4px 8px', borderRadius: '4px' }}>
                                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Credit Hash</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <code style={{ fontSize: '11px', color: '#374151' }}>{auditData.creditHash.slice(0, 8)}...{auditData.creditHash.slice(-6)}</code>
                                        <Copy size={12} color="#9ca3af" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(auditData.creditHash)} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '4px', border: '1px solid #86efac' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#166534' }}>Anchor Hash</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <code style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>{auditData.anchorHash.slice(0, 8)}...{auditData.anchorHash.slice(-6)}</code>
                                        <Copy size={12} color="#166534" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(auditData.anchorHash)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                            <a
                                href={`https://explorer.sepolia.mantle.xyz/tx/${txResult.hash}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    padding: '8px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#2563eb',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    border: '1px solid #bfdbfe',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <ExternalLink size={14} />
                                Verify on MantleScan
                            </a>
                            <button
                                onClick={handleDownloadAudit}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    padding: '8px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#374151',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    cursor: 'pointer'
                                }}
                            >
                                <Download size={14} />
                                Download Audit Pkg
                            </button>
                        </div>
                    </div>

                    <Button
                        disabled
                        fullWidth
                        style={{ height: '52px', backgroundColor: '#22c55e', color: 'white', fontSize: '16px', fontWeight: 600, cursor: 'default', border: 'none' }}
                    >
                        Process Complete
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ContractDocumentList;
