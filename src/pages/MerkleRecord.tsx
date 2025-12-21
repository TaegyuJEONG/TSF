import React, { useState, useEffect } from 'react';
import { Layers, ExternalLink, Download, FileText, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getContractSnapshot, getAuditPackageData } from '../services/paymentService';
import type { ContractSnapshotRef } from '../types/payment';

const MerkleRecord: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'contract' | 'payments'>('payments');
    const [contractSnapshot, setContractSnapshot] = useState<ContractSnapshotRef | null>(null);
    const [paymentAuditData, setPaymentAuditData] = useState<any>(null);

    useEffect(() => {
        setContractSnapshot(getContractSnapshot());
        getAuditPackageData().then(setPaymentAuditData);
    }, []);

    const handleDownloadAudit = () => {
        if (!paymentAuditData) return;
        const packageData = {
            readme: "TSF Payment Audit Package v1",
            generatedAt: new Date().toISOString(),
            ...paymentAuditData
        };

        const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payment-ledger-audit-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!contractSnapshot || !paymentAuditData) return <div>Loading records...</div>;

    const { paymentLedger } = paymentAuditData;
    const isGenesis = contractSnapshot.source === 'GENESIS';

    return (
        <div className="container" style={{ padding: '40px 0', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}
                >
                    ← Back to Payments
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                            Merkle Anchoring Record
                        </h1>
                        <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.5', maxWidth: '600px' }}>
                            Cryptographic proof of off-chain data integrity. Verified against Mantle Sepolia.
                        </p>
                    </div>
                    <button
                        onClick={handleDownloadAudit}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                            backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
                            color: '#374151', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        <Download size={16} />
                        Audit Package
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '32px', width: 'fit-content' }}>
                <button
                    onClick={() => setActiveTab('contract')}
                    style={{
                        padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                        backgroundColor: activeTab === 'contract' ? 'white' : 'transparent',
                        color: activeTab === 'contract' ? '#111827' : '#6b7280',
                        boxShadow: activeTab === 'contract' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> Contract Snapshot
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    style={{
                        padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                        backgroundColor: activeTab === 'payments' ? 'white' : 'transparent',
                        color: activeTab === 'payments' ? '#111827' : '#6b7280',
                        boxShadow: activeTab === 'payments' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} /> Payment Ledger
                    </div>
                </button>
            </div>

            {/* Content: Contract Snapshot */}
            {activeTab === 'contract' && (
                <div style={{
                    backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={20} color="#4f46e5" />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Contract Base Snapshot</h2>
                        </div>
                        {isGenesis ? (
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#d97706', backgroundColor: '#fffbeb', padding: '4px 8px', borderRadius: '99px', border: '1px solid #fcd34d' }}>GENESIS / MOCK</span>
                        ) : (
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669', backgroundColor: '#ecfdf5', padding: '4px 8px', borderRadius: '99px', border: '1px solid #6ee7b7' }}>ANCHORED</span>
                        )}
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Contract Document Hash</div>
                            <code style={{ fontSize: '13px', color: '#374151', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px', display: 'block', wordBreak: 'break-all' }}>
                                {contractSnapshot.contractHash}
                            </code>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Credit Assessment Hash</div>
                            <code style={{ fontSize: '13px', color: '#374151', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px', display: 'block', wordBreak: 'break-all' }}>
                                {contractSnapshot.creditHash}
                            </code>
                        </div>
                        <div style={{ paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Anchor Transaction Hash</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <code style={{ fontSize: '13px', color: '#374151', fontFamily: 'monospace' }}>
                                    {contractSnapshot.contractTxHash}
                                </code>
                                {contractSnapshot.source !== 'GENESIS' && (
                                    <a
                                        href={`https://explorer.sepolia.mantle.xyz/tx/${contractSnapshot.contractTxHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}
                                    >
                                        MantleScan <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content: Payment Ledger */}
            {activeTab === 'payments' && (
                <div>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <Layers size={20} color="#4f46e5" />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Payment Ledger Root</h2>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Current Merkle Root</div>
                                <code style={{ fontSize: '15px', color: '#111827', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', display: 'block', wordBreak: 'break-all', fontWeight: 600 }}>
                                    {paymentLedger.calculatedRoot}
                                </code>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Included Events</div>
                                    <div style={{ fontWeight: 500, color: '#111827' }}>{paymentLedger.events.length}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Ordering Rule</div>
                                    <div style={{ fontWeight: 500, color: '#111827', fontSize: '13px' }}>{paymentLedger.orderingRule}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Proof */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Verification Chain</h3>
                        <div style={{ position: 'relative', paddingLeft: '24px' }}>
                            {/* Line */}
                            <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#e5e7eb' }}></div>

                            {/* Items */}
                            {paymentLedger.events.slice().reverse().map((event: any, i: number) => (
                                <div key={i} style={{ position: 'relative', marginBottom: '24px', display: 'flex', gap: '16px' }}>
                                    <div style={{
                                        flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%',
                                        backgroundColor: '#10b981', border: '2px solid white',
                                        position: 'absolute', left: '-23px', top: '4px'
                                    }}></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Payment Received</span>
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(event.receivedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 600, color: '#4b5563' }}>Leaf Hash:</span>
                                                <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace' }}
                                                    onClick={() => navigator.clipboard.writeText(paymentLedger.leaves[paymentLedger.events.length - 1 - i])}
                                                    title="Click to copy full hash"
                                                >
                                                    {paymentLedger.leaves[paymentLedger.events.length - 1 - i].slice(0, 10)}...{paymentLedger.leaves[paymentLedger.events.length - 1 - i].slice(-8)}
                                                </code>
                                            </div>
                                            {event.anchoredTxHash && (
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 600, color: '#4b5563' }}>Anchored in Tx:</span>
                                                    <a
                                                        href={`https://explorer.sepolia.mantle.xyz/tx/${event.anchoredTxHash}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace' }}
                                                    >
                                                        {event.anchoredTxHash.slice(0, 10)}... <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>
                                            Amount: ${event.amount.total.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {paymentLedger.events.length === 0 && (
                                <div style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>No payment events recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MerkleRecord;
