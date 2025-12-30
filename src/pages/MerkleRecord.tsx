import React, { useState, useEffect } from 'react';
import { Layers, ExternalLink, Download, FileText, Database, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getContractSnapshot, getAuditPackageData } from '../services/paymentService';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';
import ListingABI from '../abis/Listing.json';
import type { ContractSnapshotRef } from '../types/payment';

const LISTING_ADDRESS = "0xe7eF33fB46292312C43AFef9f1a60799AEa0C91a";

const MerkleRecord: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isInvestor = location.pathname.startsWith('/investor/');
    const { address } = useWallet();

    const [activeTab, setActiveTab] = useState<'contract' | 'payments' | 'position'>(isInvestor ? 'position' : 'payments');
    const [contractSnapshot, setContractSnapshot] = useState<ContractSnapshotRef | null>(null);
    const [paymentAuditData, setPaymentAuditData] = useState<any>(null);

    // Investor position data
    const [investorData, setInvestorData] = useState<{
        ownership: number;
        totalInvested: number;
        claimable: number;
        totalClaimed: number;
        raised: number;
    } | null>(null);

    // Claim transaction data (for Your Position tab)
    const [claimTransactions, setClaimTransactions] = useState<{ [eventIndex: number]: string }>({});

    useEffect(() => {
        setContractSnapshot(getContractSnapshot());
        getAuditPackageData().then(setPaymentAuditData);
    }, []);

    // Fetch investor position data from blockchain
    useEffect(() => {
        if (!isInvestor || !address) return;

        const fetchInvestorData = async () => {
            try {
                const noteId = localStorage.getItem('tsf_last_note_id');
                if (!noteId) return;

                const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz');
                const listing = new ethers.Contract(LISTING_ADDRESS, ListingABI, provider);

                const [invested, noteStatus, claimableAmount] = await Promise.all([
                    listing.invested(Number(noteId), address),
                    listing.getNoteStatus(Number(noteId)),
                    listing.claimable(Number(noteId), address)
                ]);

                const totalInvested = Number(ethers.formatUnits(invested, 6));
                const raised = Number(ethers.formatUnits(noteStatus.raised, 6));
                const ownership = raised > 0 ? (totalInvested / raised) * 100 : 0;
                const claimable = Number(ethers.formatUnits(claimableAmount, 6));

                // Fetch Claimed events to get claim transaction hashes
                const currentBlock = await provider.getBlockNumber();
                const fromBlock = Math.max(0, currentBlock - 5000);
                const claimFilter = listing.filters.Claimed(Number(noteId), address);
                const claimEvents = await listing.queryFilter(claimFilter, fromBlock, currentBlock);

                console.log(`Found ${claimEvents.length} Claimed events for investor`);

                // Build map of claim transactions
                const claimTxMap: { [eventIndex: number]: string } = {};
                for (let i = 0; i < claimEvents.length; i++) {
                    const claimEvent = claimEvents[i];
                    if ('args' in claimEvent && claimEvent.args) {
                        claimTxMap[i] = claimEvent.transactionHash;
                    }
                }
                setClaimTransactions(claimTxMap);

                // Calculate total claimed from payment history (will be computed after paymentAuditData loads)
                setInvestorData({
                    ownership,
                    totalInvested,
                    claimable,
                    totalClaimed: 0, // Will be calculated from payment events
                    raised
                });
            } catch (error) {
                console.error('Failed to fetch investor data:', error);
            }
        };

        fetchInvestorData();
    }, [isInvestor, address]);


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

    // Dark mode colors for investor view
    const colors = isInvestor ? {
        bg: '#0f172a',
        cardBg: '#1e293b',
        text: '#f1f5f9',
        textMuted: '#94a3b8',
        border: '#334155',
        green: '#22c55e',
        orange: '#fb923c',
        violet: '#a78bfa',
        blue: '#60a5fa'
    } : {
        bg: 'white',
        cardBg: 'white',
        text: '#111827',
        textMuted: '#6b7280',
        border: '#e5e7eb',
        green: '#059669',
        orange: '#ea580c',
        violet: '#8b5cf6',
        blue: '#2563eb'
    };

    return (
        <div className="container" style={{
            padding: '40px 0',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: isInvestor ? colors.bg : 'transparent',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}
                >
                    ← Back to Payments
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>
                            Merkle Anchoring Record
                        </h1>
                        <p style={{ color: colors.textMuted, fontSize: '16px', lineHeight: '1.5', maxWidth: '600px' }}>
                            Cryptographic proof of off-chain data integrity. Verified against Mantle Sepolia.
                        </p>
                    </div>
                    <button
                        onClick={handleDownloadAudit}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                            backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '8px',
                            color: colors.text, fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        <Download size={16} />
                        Audit Package
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: isInvestor ? '#1e293b' : '#f3f4f6', borderRadius: '8px', marginBottom: '32px', width: 'fit-content' }}>
                <button
                    onClick={() => setActiveTab('contract')}
                    style={{
                        padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                        backgroundColor: activeTab === 'contract' ? (isInvestor ? colors.cardBg : 'white') : 'transparent',
                        color: activeTab === 'contract' ? colors.text : colors.textMuted,
                        boxShadow: activeTab === 'contract' ? (isInvestor ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)') : 'none'
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
                        backgroundColor: activeTab === 'payments' ? (isInvestor ? colors.cardBg : 'white') : 'transparent',
                        color: activeTab === 'payments' ? colors.text : colors.textMuted,
                        boxShadow: activeTab === 'payments' ? (isInvestor ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)') : 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} /> Payment Ledger
                    </div>
                </button>
                {isInvestor && (
                    <button
                        onClick={() => setActiveTab('position')}
                        style={{
                            padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                            backgroundColor: activeTab === 'position' ? colors.cardBg : 'transparent',
                            color: activeTab === 'position' ? colors.text : colors.textMuted,
                            boxShadow: activeTab === 'position' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={16} /> Your Position
                        </div>
                    </button>
                )}
            </div>

            {/* Content: Contract Snapshot */}
            {activeTab === 'contract' && (
                <div style={{
                    backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`, padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={20} color={colors.violet} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.text }}>Contract Base Snapshot</h2>
                        </div>
                        {isGenesis ? (
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#d97706', backgroundColor: isInvestor ? '#422006' : '#fffbeb', padding: '4px 8px', borderRadius: '99px', border: `1px solid ${isInvestor ? '#d97706' : '#fcd34d'}` }}>GENESIS / MOCK</span>
                        ) : (
                            <span style={{ fontSize: '12px', fontWeight: 600, color: colors.green, backgroundColor: isInvestor ? '#064e3b' : '#ecfdf5', padding: '4px 8px', borderRadius: '99px', border: `1px solid ${colors.green}` }}>ANCHORED</span>
                        )}
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Contract Document Hash</div>
                            <code style={{ fontSize: '13px', color: colors.text, backgroundColor: isInvestor ? '#0f172a' : '#f9fafb', padding: '8px', borderRadius: '6px', display: 'block', wordBreak: 'break-all' }}>
                                {contractSnapshot.contractHash}
                            </code>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Credit Assessment Hash</div>
                            <code style={{ fontSize: '13px', color: colors.text, backgroundColor: isInvestor ? '#0f172a' : '#f9fafb', padding: '8px', borderRadius: '6px', display: 'block', wordBreak: 'break-all' }}>
                                {contractSnapshot.creditHash}
                            </code>
                        </div>
                        <div style={{ paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
                            <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Anchor Transaction Hash</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <code style={{ fontSize: '13px', color: colors.text, fontFamily: 'monospace' }}>
                                    {contractSnapshot.contractTxHash}
                                </code>
                                {contractSnapshot.source !== 'GENESIS' && (
                                    <a
                                        href={`https://explorer.sepolia.mantle.xyz/tx/${contractSnapshot.contractTxHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: colors.blue, textDecoration: 'none' }}
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
                        backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`, padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <Layers size={20} color={colors.violet} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.text }}>Payment Ledger Root</h2>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Current Merkle Root</div>
                                <code style={{ fontSize: '15px', color: colors.text, backgroundColor: isInvestor ? '#0f172a' : '#f9fafb', padding: '12px', borderRadius: '6px', border: `1px solid ${colors.border}`, display: 'block', wordBreak: 'break-all', fontWeight: 600 }}>
                                    {paymentLedger.calculatedRoot}
                                </code>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: colors.textMuted }}>Included Events</div>
                                    <div style={{ fontWeight: 500, color: colors.text }}>{paymentLedger.events.length}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: colors.textMuted }}>Ordering Rule</div>
                                    <div style={{ fontWeight: 500, color: colors.text, fontSize: '13px' }}>{paymentLedger.orderingRule}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Proof */}
                    <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`, padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text, marginBottom: '16px' }}>Verification Chain</h3>
                        <div style={{ position: 'relative', paddingLeft: '24px' }}>
                            {/* Line */}
                            <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', backgroundColor: colors.border }}></div>

                            {/* Items */}
                            {paymentLedger.events.slice().reverse().map((event: any, i: number) => {
                                // Fallback for legacy data without fee fields
                                const grossAmount = event.amount?.total || 0;
                                const platformFee = event.platformFee ?? (grossAmount * 0.01);
                                const netAmount = event.netAmount ?? (grossAmount - platformFee);
                                const fundingStatus = event.fundingStatus || (i >= paymentLedger.events.length - 1 ? "PRE_FUNDING" : "POST_FUNDING");

                                const isPreFunding = fundingStatus === "PRE_FUNDING";
                                const feeRecipient = isPreFunding ? "Homeowner" : "Smart Contract";
                                const feeColor = isPreFunding ? colors.orange : colors.violet;

                                return (
                                    <div key={i} style={{ position: 'relative', marginBottom: '32px' }}>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{
                                                flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%',
                                                backgroundColor: colors.green, border: `2px solid ${colors.cardBg}`,
                                                position: 'absolute', left: '-23px', top: '4px'
                                            }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>
                                                        Payment Received by {isPreFunding ? 'Homeowner' : 'Smart Contract'}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: colors.textMuted }}>{new Date(event.receivedAt).toLocaleDateString()}</span>
                                                </div>

                                                {/* Payment Breakdown */}
                                                <div style={{
                                                    backgroundColor: isInvestor ? '#0f172a' : '#f9fafb',
                                                    border: `1px solid ${colors.border}`,
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    marginBottom: '12px'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ fontSize: '12px', color: colors.textMuted }}>Gross Amount</span>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
                                                            ${grossAmount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingBottom: '8px', borderBottom: `1px dashed ${colors.border}` }}>
                                                        <span style={{ fontSize: '12px', color: colors.textMuted }}>
                                                            Platform Fee (1%)
                                                        </span>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: feeColor }}>
                                                            -${platformFee.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.green }}>Net Distributable</span>
                                                        <span style={{ fontSize: '14px', fontWeight: 700, color: colors.green }}>
                                                            ${netAmount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Technical Details */}
                                                <div style={{ fontSize: '12px', color: colors.textMuted, display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: 600, color: colors.text }}>Leaf Hash:</span>
                                                        <code style={{ backgroundColor: isInvestor ? '#1e293b' : '#f3f4f6', color: colors.text, padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px' }}
                                                            onClick={() => navigator.clipboard.writeText(paymentLedger.leaves[paymentLedger.events.length - 1 - i])}
                                                            title="Click to copy full hash"
                                                        >
                                                            {paymentLedger.leaves[paymentLedger.events.length - 1 - i].slice(0, 10)}...{paymentLedger.leaves[paymentLedger.events.length - 1 - i].slice(-8)}
                                                        </code>
                                                    </div>
                                                    {event.anchoredTxHash && (
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <span style={{ fontWeight: 600, color: colors.text }}>Anchored in Tx:</span>
                                                            <a
                                                                href={`https://explorer.sepolia.mantle.xyz/tx/${event.anchoredTxHash}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                style={{ color: colors.blue, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontSize: '11px' }}
                                                            >
                                                                {event.anchoredTxHash.slice(0, 10)}... <ExternalLink size={10} />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Funding Status Badge - Only show POST_FUNDING milestone */}
                                                {!isPreFunding && (i === paymentLedger.events.length - 1 || fundingStatus !== (paymentLedger.events.slice().reverse()[i + 1]?.fundingStatus || (i + 1 >= paymentLedger.events.length - 1 ? "PRE_FUNDING" : "POST_FUNDING"))) && (
                                                    <div style={{
                                                        padding: '12px 16px',
                                                        backgroundColor: isInvestor ? '#064e3b' : '#f0fdf4',
                                                        border: `1px solid ${isInvestor ? '#059669' : '#86efac'}`,
                                                        borderRadius: '12px'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            fontWeight: 700,
                                                            color: isInvestor ? '#6ee7b7' : '#15803d',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            marginBottom: '4px'
                                                        }}>
                                                            🎯 Note Funding Complete (100% Raised)
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: isInvestor ? '#86efac' : '#166534', lineHeight: '1.4' }}>
                                                            Payments now processed on-chain • Automatic pro-rata distribution to investors via smart contract
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {paymentLedger.events.length === 0 && (
                                <div style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>No payment events recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content: Your Position (Investor Only) */}
            {activeTab === 'position' && isInvestor && (
                <div>
                    {investorData ? (
                        <>
                            {/* Overview Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                <div style={{
                                    backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`,
                                    padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '8px', fontWeight: 500 }}>Your Ownership</div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, color: colors.text }}>{investorData.ownership.toFixed(2)}%</div>
                                    <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>
                                        ${investorData.totalInvested.toLocaleString()} / ${investorData.raised.toLocaleString()}
                                    </div>
                                </div>


                                <div style={{
                                    backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`,
                                    padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '8px', fontWeight: 500 }}>Total Invested</div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, color: colors.text }}>
                                        ${investorData.totalInvested.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>
                                        On-chain verified
                                    </div>
                                </div>


                                <div style={{
                                    backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`,
                                    padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '8px', fontWeight: 500 }}>Total Claimed</div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, color: colors.green }}>
                                        ${(() => {
                                            // Calculate total claimed from payment events
                                            let totalDistributed = 0;
                                            if (paymentAuditData?.paymentLedger?.events) {
                                                paymentAuditData.paymentLedger.events.forEach((event: any, idx: number) => {
                                                    const fundingStatus = event.fundingStatus || (idx >= paymentAuditData.paymentLedger.events.length - 1 ? "PRE_FUNDING" : "POST_FUNDING");
                                                    if (fundingStatus === "POST_FUNDING") {
                                                        const grossAmount = event.amount?.total || 0;
                                                        const platformFee = event.platformFee ?? (grossAmount * 0.01);
                                                        const netAmount = event.netAmount ?? (grossAmount - platformFee);
                                                        const yourShare = netAmount * (investorData.ownership / 100);
                                                        totalDistributed += yourShare;
                                                    }
                                                });
                                            }
                                            return (totalDistributed - investorData.claimable).toFixed(2);
                                        })()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>
                                        Already withdrawn
                                    </div>
                                </div>

                                <div style={{
                                    backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`,
                                    padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '8px', fontWeight: 500 }}>Claimable</div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, color: investorData.claimable > 0 ? colors.orange : colors.text }}>
                                        ${investorData.claimable.toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>
                                        Available to withdraw
                                    </div>
                                </div>
                            </div>

                            {/* Payment History Timeline */}
                            <div style={{
                                backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`,
                                padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text, marginBottom: '16px' }}>
                                    Payment History & Your Share
                                </h3>
                                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                                    {/* Timeline Line */}
                                    <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', backgroundColor: colors.border }}></div>

                                    {/* Payment Items */}
                                    {paymentAuditData?.paymentLedger?.events.slice().reverse()
                                        .filter((event: any, i: number) => {
                                            const fundingStatus = event.fundingStatus || (i >= paymentAuditData.paymentLedger.events.length - 1 ? "PRE_FUNDING" : "POST_FUNDING");
                                            return fundingStatus === "POST_FUNDING"; // Only show POST_FUNDING payments
                                        })
                                        .map((event: any, i: number) => {
                                            const grossAmount = event.amount?.total || 0;
                                            const platformFee = event.platformFee ?? (grossAmount * 0.01);
                                            const netAmount = event.netAmount ?? (grossAmount - platformFee);
                                            const yourShare = netAmount * (investorData.ownership / 100);
                                            const feeRecipient = "Smart Contract"; // Always Smart Contract in POST_FUNDING
                                            const feeColor = colors.violet;

                                            return (
                                                <div key={i} style={{ position: 'relative', marginBottom: '32px' }}>
                                                    <div style={{ display: 'flex', gap: '16px' }}>
                                                        <div style={{
                                                            flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%',
                                                            backgroundColor: colors.green, border: `2px solid ${colors.cardBg}`,
                                                            position: 'absolute', left: '-23px', top: '4px'
                                                        }}></div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                                <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>
                                                                    Payment Received by {feeRecipient}
                                                                </span>
                                                                <span style={{ fontSize: '12px', color: colors.textMuted }}>{new Date(event.receivedAt).toLocaleDateString()}</span>
                                                            </div>

                                                            {/* Payment Breakdown */}
                                                            <div style={{
                                                                backgroundColor: isInvestor ? '#0f172a' : '#f9fafb',
                                                                border: `1px solid ${colors.border}`,
                                                                borderRadius: '8px',
                                                                padding: '12px',
                                                                marginBottom: '12px'
                                                            }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                                    <span style={{ fontSize: '12px', color: colors.textMuted }}>Gross Amount</span>
                                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
                                                                        ${grossAmount.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingBottom: '8px', borderBottom: `1px dashed ${colors.border}` }}>
                                                                    <span style={{ fontSize: '12px', color: colors.textMuted }}>
                                                                        Platform Fee (1%)
                                                                    </span>
                                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: feeColor }}>
                                                                        -${platformFee.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                                    <span style={{ fontSize: '12px', color: colors.textMuted }}>Net Distributable</span>
                                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
                                                                        ${netAmount.toFixed(2)}
                                                                    </span>
                                                                </div>

                                                                {/* Investor Share (Always shown since filtered to POST_FUNDING) */}
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingTop: '8px', borderTop: `1px solid ${colors.border}` }}>
                                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.green }}>Your Share</span>
                                                                    <span style={{ fontSize: '14px', fontWeight: 700, color: colors.green }}>
                                                                        ${yourShare.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted }}>Status</span>
                                                                    <span style={{
                                                                        fontSize: '12px',
                                                                        fontWeight: 600,
                                                                        color: investorData.claimable > 0 ? colors.orange : colors.green
                                                                    }}>
                                                                        {investorData.claimable > 0 ? '⏳ Pending' : '🟢 Claimed'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Technical Details */}
                                                            <div style={{ fontSize: '12px', color: colors.textMuted, display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                    <span style={{ fontWeight: 600, color: colors.text }}>Leaf Hash:</span>
                                                                    <code style={{ backgroundColor: isInvestor ? '#1e293b' : '#f3f4f6', color: colors.text, padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px' }}>
                                                                        {paymentAuditData.paymentLedger.leaves[paymentAuditData.paymentLedger.events.length - 1 - i].slice(0, 10)}...{paymentAuditData.paymentLedger.leaves[paymentAuditData.paymentLedger.events.length - 1 - i].slice(-8)}
                                                                    </code>
                                                                </div>
                                                                {event.anchoredTxHash && (
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <span style={{ fontWeight: 600, color: colors.text }}>Deposit Tx:</span>
                                                                        <a
                                                                            href={`https://explorer.sepolia.mantle.xyz/tx/${event.anchoredTxHash}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            style={{ color: colors.blue, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontSize: '11px' }}
                                                                        >
                                                                            {event.anchoredTxHash.slice(0, 10)}... <ExternalLink size={10} />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                {claimTransactions[i] && (
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <span style={{ fontWeight: 600, color: colors.text }}>Claim Tx:</span>
                                                                        <a
                                                                            href={`https://explorer.sepolia.mantle.xyz/tx/${claimTransactions[i]}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            style={{ color: colors.green, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontSize: '11px' }}
                                                                        >
                                                                            {claimTransactions[i].slice(0, 10)}... <ExternalLink size={10} />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {(!paymentAuditData?.paymentLedger?.events || paymentAuditData.paymentLedger.events.length === 0) && (
                                        <div style={{ fontSize: '14px', color: colors.textMuted, fontStyle: 'italic' }}>No payment events recorded yet.</div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`,
                            padding: '32px', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', color: colors.textMuted }}>
                                {address ? 'Loading investor data...' : 'Please connect your wallet to view your position.'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MerkleRecord;
