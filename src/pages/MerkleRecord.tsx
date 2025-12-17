import React from 'react';
import { Shield, Link, Layers, CheckCircle, ExternalLink, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MerkleRecord: React.FC = () => {
    const navigate = useNavigate();

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
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                    Contract Payment Merkle Root
                </h1>
                <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.5' }}>
                    This Merkle root represents a cryptographic summary of all payment records associated with this contract at a specific point in time.
                    Individual payments remain off-chain. The hash is anchored on blockchain to ensure integrity and tamper resistance.
                </p>
            </div>

            {/* Section 1: Merkle Root Summary */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Layers size={20} color="#4f46e5" />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Merkle Root Summary</h2>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Merkle Root Hash</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '15px', color: '#111827', wordBreak: 'break-all', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            0xA7f391B2C8D4E5F6A7B8C9D0E1F2A3B4C5D6E7F892C1
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Record Type</div>
                            <div style={{ fontWeight: 500, color: '#111827' }}>Contract Payment Records</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Included Payments</div>
                            <div style={{ fontWeight: 500, color: '#111827' }}>10</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Snapshot Timestamp</div>
                            <div style={{ fontWeight: 500, color: '#111827' }}>2025-10-22 14:03 UTC</div>
                        </div>
                    </div>
                    <div>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            borderRadius: '999px',
                            fontSize: '13px',
                            fontWeight: 500
                        }}>
                            <CheckCircle size={14} />
                            Anchored (Testnet)
                        </span>
                    </div>
                </div>
            </div>

            {/* Section 2: Blockchain Anchoring Details */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Link size={20} color="#4f46e5" />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Blockchain Anchoring Details</h2>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Network</div>
                            <div style={{ fontWeight: 500, color: '#111827' }}>Testnet (Sepolia)</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Block Number</div>
                            <div style={{ fontWeight: 500, color: '#111827' }}>12,483,221</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Transaction Hash</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#111827' }}>0xF91c...8D2A</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Confirmations</div>
                            <div style={{ fontWeight: 500, color: '#111827' }}>12 / 12</div>
                        </div>
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Anchoring Method</div>
                        <div style={{ fontSize: '14px', color: '#374151' }}>Merkle root of off-chain payment records recorded as proof-of-existence via Smart Contract.</div>
                    </div>

                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        maxWidth: 'fit-content'
                    }}>
                        View on Blockchain Explorer (Mock)
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>

            {/* Section 3: What This Proves */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Shield size={20} color="#4f46e5" />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>What This Proves</h2>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#374151', display: 'grid', gap: '8px' }}>
                        <li>Payment records existed in this exact state at the snapshot time.</li>
                        <li>Any modification to past payments would cryptographically change the Merkle root.</li>
                        <li>Enables third-party verification without exposing private banking data.</li>
                    </ul>
                </div>
            </div>

            {/* Section 4: Disclaimer */}
            <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fcd34d',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                gap: '12px',
                marginBottom: '32px'
            }}>
                <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
                <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#92400e', fontSize: '14px', fontWeight: 600 }}>What This Does NOT Mean</h4>
                    <p style={{ margin: 0, color: '#b45309', fontSize: '14px' }}>
                        Payments are not executed on-chain. Funds are not held or transferred via blockchain.
                        This record serves as an audit trail and does not replace legal, escrow, or banking systems.
                    </p>
                </div>
            </div>

            {/* Section 5: Verification Concept */}
            <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#6b7280', marginBottom: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Verification Concept
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#4b5563' }}>
                    <div style={{ textAlign: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>Off-chain Data</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Payment Records</div>
                    </div>
                    <ArrowRight size={16} color="#9ca3af" />
                    <div style={{ textAlign: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>Merkle Tree</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Hash Aggregation</div>
                    </div>
                    <ArrowRight size={16} color="#9ca3af" />
                    <div style={{ textAlign: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>Blockchain</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Anchored Root</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MerkleRecord;
