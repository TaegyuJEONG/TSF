import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';
import { Shield, Wallet, Loader2, CheckCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { BrowserProvider, Contract, ethers } from 'ethers';
import ListingABI from '../abis/Listing.json';

const LISTING_ADDRESS = "0x77f4C936dd0092b30521c4CBa95bcCe4c2CbCD3a";

interface PaymentEvent {
    receivedAt: string;
    depositAmount: number;
    yourShare: number;
    share: number;
    status: 'Paid' | 'Claimed';
    txHash: string;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const InvestorPayments: React.FC = () => {
    const navigate = useNavigate();
    const { address } = useWallet();

    // Data State
    const [events, setEvents] = useState<PaymentEvent[]>([]);
    const [claimableAmount, setClaimableAmount] = useState<number>(0);
    const [isClaiming, setIsClaiming] = useState(false);

    // Refresh Trigger
    const [refreshKey, setRefreshKey] = useState(0);

    // 1. Fetch YieldDeposited Events from Blockchain
    useEffect(() => {
        const fetchYieldEvents = async () => {
            if (!address) return;
            try {
                const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz');
                const listing = new Contract(LISTING_ADDRESS, ListingABI, provider);

                // Get investor's investment amount and total raised first
                const invested = await listing.invested(address);
                const raised = await listing.raised();

                // If investor hasn't invested, no need to fetch events
                if (Number(invested) === 0) {
                    setEvents([]);
                    return;
                }

                const share = (Number(invested) * 100) / Number(raised);

                // Get investor's current reward debt to determine what's been claimed
                const rewardDebt = await listing.rewardDebt(address);

                // Get all PaymentReceived events (limit to recent blocks to avoid RPC limit)
                const currentBlock = await provider.getBlockNumber();
                const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10k blocks

                const filter = listing.filters.PaymentReceived();
                const paymentEvents = await listing.queryFilter(filter, fromBlock, currentBlock);

                console.log(`Found ${paymentEvents.length} PaymentReceived events`);

                // Process each payment
                const processedEvents: PaymentEvent[] = [];
                for (const event of paymentEvents) {
                    try {
                        // Type guard to ensure event is EventLog
                        if ('args' in event && event.args) {
                            // PaymentReceived event: args[0]=payer, args[1]=amount, args[2]=newAccDivPerShare
                            const depositAmount = Number(event.args[1]) / 1_000_000; // 6 decimals
                            const investorShare = (depositAmount * share) / 100;

                            // Determine if this deposit has been claimed
                            const accDivPerShare = event.args[2]; // newAccDivPerShare
                            const earnedUpToThis = (Number(invested) * Number(accDivPerShare)) / 1e18;
                            const claimed = earnedUpToThis <= Number(rewardDebt);

                            // Use block number as timestamp approximation (or current time)
                            const timestamp = new Date().toISOString();

                            processedEvents.push({
                                receivedAt: timestamp,
                                depositAmount: depositAmount,
                                yourShare: investorShare,
                                share: share,
                                status: (claimed ? 'Claimed' : 'Paid') as 'Paid' | 'Claimed',
                                txHash: event.transactionHash
                            });
                        } else {
                            console.warn("Event has no args:", event);
                        }
                    } catch (eventErr) {
                        console.error("Error processing individual event:", eventErr);
                    }
                }

                console.log(`Processed ${processedEvents.length} events`);
                setEvents(processedEvents);
            } catch (err) {
                console.error("Error fetching yield events:", err);
                setEvents([]);
            }
        };

        fetchYieldEvents();
        const interval = setInterval(fetchYieldEvents, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [address, refreshKey]);

    // 2. Fetch Claimable Amount from Contract
    useEffect(() => {
        const fetchClaimable = async () => {
            if (!address) return;
            try {
                const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz');
                const listing = new Contract(LISTING_ADDRESS, ListingABI, provider);
                const amountWei = await listing.claimable(address);
                // Convert 6 decimals to number
                setClaimableAmount(Number(amountWei) / 1_000_000);
            } catch (err) {
                console.error("Error fetching claimable:", err);
            }
        };
        fetchClaimable();
        // Poll every 5 seconds for updates
        const interval = setInterval(fetchClaimable, 5000);
        return () => clearInterval(interval);
    }, [address, refreshKey]);

    const handleClaim = async () => {
        if (!window.ethereum) return;
        setIsClaiming(true);
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const listing = new Contract(LISTING_ADDRESS, ListingABI, signer);

            console.log("Claiming...");
            const tx = await listing.claim();
            await tx.wait();

            alert("Funds claimed successfully!");
            setClaimableAmount(0);
            setRefreshKey(prev => prev + 1); // Refresh to update event statuses
        } catch (err) {
            console.error("Claim failed:", err);
            alert("Claim failed. See console.");
        } finally {
            setIsClaiming(false);
        }
    };


    // --- UI Data Construction ---
    // Marketplace Card Data (same as before)
    const listingData = {
        image: listing1Image,
        price: 455000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 1982,
        specs: { dp: 45000, term: 30, interest: 6, beds: 3, baths: 2 },
        tier: 'Tier A',
        negotiable: true,
    };

    return (
        <div className="container" style={{ padding: '32px 0' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <MarketplaceCard
                        image={listingData.image}
                        price={listingData.price}
                        sqft={listingData.sqft}
                        address={listingData.address}
                        specs={listingData.specs}
                        tier={listingData.tier}
                        negotiable={listingData.negotiable}
                        isUserListing={true}
                        showBookmark={false}
                        showPricePerSqft={false}
                    />

                    {/* Contract Linkage / Status */}
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Shield size={18} color="#4f46e5" />
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Smart Contract Status</h3>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Listing Contract</div>
                            <code style={{ fontSize: '11px', color: '#374151', backgroundColor: '#f9fafb', padding: '4px', borderRadius: '4px', display: 'block', wordBreak: 'break-all' }}>
                                {LISTING_ADDRESS}
                            </code>
                            <div style={{ marginTop: '12px' }}>
                                <span style={{ fontSize: '11px', backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', border: '1px solid #6ee7b7' }}>ACTIVE ON SEPOLIA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Claim Dashboard */}
                    <div style={{
                        backgroundColor: '#1e1b4b', borderRadius: '16px', padding: '32px', color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        backgroundImage: 'linear-gradient(to right, #1e1b4b, #312e81)'
                    }}>
                        <div>
                            <div style={{ fontSize: '14px', color: '#a5b4fc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wallet size={16} /> Available to withdraw
                            </div>
                            <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                                {formatCurrency(claimableAmount)}
                            </div>
                            <div style={{ fontSize: '13px', color: '#a5b4fc', marginTop: '4px' }}>
                                Protocol: Pro-rata Pull Payment (DemoUSD)
                            </div>
                        </div>

                        <button
                            onClick={handleClaim}
                            disabled={claimableAmount <= 0 || isClaiming}
                            style={{
                                backgroundColor: claimableAmount > 0 ? '#4f46e5' : '#312e81',
                                color: 'white',
                                border: 'none', borderRadius: '50px',
                                padding: '16px 32px', fontSize: '16px', fontWeight: 600,
                                cursor: claimableAmount > 0 ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                opacity: claimableAmount > 0 ? 1 : 0.7
                            }}
                        >
                            {isClaiming && <Loader2 className="animate-spin" size={20} />}
                            {isClaiming ? 'Claiming...' : 'Claim Now'}
                        </button>
                    </div>

                    {/* Claim History Table */}
                    <div style={{
                        border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>Claim History</h2>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#374151', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Due Date</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Principal</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Interest</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Total</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Your Share</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Received on</th>
                                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                                                No claims yet. Available yield will appear above when SPV deposits.
                                            </td>
                                        </tr>
                                    ) : (
                                        events.map((evt, i) => {
                                            const date = new Date(evt.receivedAt);
                                            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

                                            // Calculate principal and interest (example split: 70% principal, 30% interest)
                                            const principal = evt.yourShare * 0.7;
                                            const interest = evt.yourShare * 0.3;
                                            const total = evt.yourShare;

                                            return (
                                                <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '12px 8px', color: '#111827' }}>{formattedDate}</td>
                                                    <td style={{ padding: '12px 8px', fontWeight: 500, color: '#111827' }}>
                                                        {formatCurrency(principal)}
                                                    </td>
                                                    <td style={{ padding: '12px 8px', fontWeight: 500, color: '#111827' }}>
                                                        {formatCurrency(interest)}
                                                    </td>
                                                    <td style={{ padding: '12px 8px', fontWeight: 600, color: '#111827' }}>
                                                        {formatCurrency(total)}
                                                    </td>
                                                    <td style={{ padding: '12px 8px', color: '#6b7280' }}>
                                                        {evt.share ? `${evt.share.toFixed(2)}%` : '-'}
                                                    </td>
                                                    <td style={{ padding: '12px 8px', color: '#111827' }}>
                                                        {formattedDate}
                                                    </td>
                                                    <td style={{ padding: '12px 8px' }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            color: evt.status === 'Claimed' ? '#059669' : '#d97706',
                                                            fontWeight: 500, fontSize: '13px'
                                                        }}>
                                                            {evt.status === 'Claimed' && <CheckCircle size={14} />}
                                                            {evt.status === 'Claimed' ? 'Claimed' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Hash Link */}
                        <div
                            onClick={() => navigate('/merkle-record')}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '16px', cursor: 'pointer' }}
                            title="View Merkle Record Details"
                        >
                            <span style={{ fontSize: '14px', color: '#374151' }}>Verify Ledger</span>
                            <div style={{
                                width: '24px', height: '24px', backgroundColor: '#111827', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorPayments;
