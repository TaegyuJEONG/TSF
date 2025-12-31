
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share, Heart, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import InvestModal from '../components/investor/InvestModal';
import MerkleRecordModal from '../components/dashboard/MerkleRecordModal';
import { ethers } from 'ethers';
import ListingABI from '../abis/Listing.json';
// import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';

declare global {
    interface Window {
        ethereum: any;
    }
}

// Helper for currency formatting
const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

// Reusable Section Header
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>{children}</h2>
);

// Reusable Grid Card
const DetailCard: React.FC<{ label: string; value: string | React.ReactNode; subValue?: string; highlight?: boolean }> = ({ label, value, subValue, highlight }) => (
    <div style={{
        border: '1px solid #334155', borderRadius: '12px', padding: '16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        backgroundColor: '#1e293b', height: '100px'
    }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', lineHeight: '1.2', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: highlight ? '20px' : '18px', fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
        {subValue && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{subValue}</div>}
    </div>
);

const InvestorDashboard: React.FC = () => {
    // Mock data matching Marketplace Listing #1
    // 5931 Abernathy Dr, Los Angeles, CA 90045
    // Price: $450,000 | DP: $45,000 | Term: 30y | Rate: 6%
    // 3 beds | 2 baths | 1982 sqft

    const navigate = useNavigate();
    const noteId = 1; // Default to 1

    // Fixed Listing Data (matching InvestorListingDetail)
    const listingBase = {
        price: 500000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        timeLeft: '30 days left',
        monthlyPayment: 6018,
        remainingTerm: 120,
        maturityDate: 'Jan 1, 2035',
        interestRate: 6.0,
        irr: 8.9,
        upb: 542100,
        lien: '1st',
        performing: 'Yes',
        ltv: 43,
        creditScore: '740-780',
        paymentHistory: '117/120 On-time',
        seasoning: '120 Months',
        employment: 'Stable (12 yrs)',
        incomeScore: 'A',
        dtiRisk: '25%',
        image: listing1Image // retain image import
    };

    const [isInvestModalOpen, setIsInvestModalOpen] = React.useState(false);
    const [isMerkleModalOpen, setIsMerkleModalOpen] = React.useState(false);

    // State for Note Metadata from blockchain
    const [noteMetadata, setNoteMetadata] = React.useState<{
        contractHash: string;
        creditHash: string;
        anchorHash: string;
        paymentLedgerRoot: string;
        listingPrice: number;
        listedAt: number;
        listingTxHash: string;
    } | null>(null);

    // State for dynamic investment data
    const [investedAmount, setInvestedAmount] = React.useState(0);
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    // Mantle Sepolia Contract Address
    const LISTING_ADDRESS = "0x155DC78c0d1512c934ca165B337D06BD62f0D3f4";

    // Data: Fetch 'raised' from contract with demo override
    React.useEffect(() => {
        const fetchRaised = async () => {
            try {
                const rpcProvider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
                const listingPublic = new ethers.Contract(LISTING_ADDRESS, ListingABI, rpcProvider);
                const noteStatus = await listingPublic.getNoteStatus(noteId);
                let raised = Number(noteStatus.raised) / 1_000_000;
                setInvestedAmount(raised);
            } catch (e) {
                console.error("Error fetching raised from RPC provider:", e);
                if (window.ethereum) {
                    try {
                        const browserProvider = new ethers.BrowserProvider(window.ethereum);
                        const listing = new ethers.Contract(LISTING_ADDRESS, ListingABI, browserProvider);
                        const noteStatus = await listing.getNoteStatus(noteId);
                        let raised = Number(noteStatus.raised) / 1_000_000;
                        setInvestedAmount(raised);
                    } catch (err) {
                        console.error("Browser provider also failed:", err);
                    }
                }
            }
        };

        fetchRaised();
        const interval = setInterval(fetchRaised, 3000);
        return () => clearInterval(interval);
    }, [refreshTrigger, noteId]);

    // Fetch Note Metadata from blockchain
    React.useEffect(() => {
        const fetchNoteMetadata = async () => {
            try {
                const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
                const listing = new ethers.Contract(LISTING_ADDRESS, ListingABI, provider);
                const metadata = await listing.getNoteMetadata(noteId);
                setNoteMetadata({
                    contractHash: metadata[1],
                    creditHash: metadata[2],
                    anchorHash: metadata[3],
                    paymentLedgerRoot: metadata[4],
                    listingPrice: Number(metadata[5]) / 1_000_000,
                    listedAt: Number(metadata[6]),
                    listingTxHash: ''
                });
            } catch (err) {
                console.error("Error fetching note metadata:", err);
            }
        };

        fetchNoteMetadata();
    }, []);

    // Goal is $500,000 for all notes
    const GOAL = 500000;
    const investedPercent = Math.min(100, Math.round((investedAmount / GOAL) * 100));

    const handleInvest = (amount: number) => {
        setInvestedAmount(prev => prev + amount);
        setTimeout(() => setRefreshTrigger(t => t + 1), 2000);
    };

    // Combine for render
    const listing = {
        ...listingBase,
        investedAmount,
        investedPercent,
        // Helper specifically for left card usage (though we are replacing it, nice to keep consistent data)
        daysLeft: 30,
        progress: investedPercent,
        ltv: listingBase.ltv,
        monthlyPayment: listingBase.monthlyPayment,
        remainingTerm: listingBase.remainingTerm
    };

    return (
        <div className="container" style={{ padding: '32px 0', backgroundColor: '#0f172a', minHeight: '100vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px' }}>

                {/* Left Column: Marketplace Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        backgroundColor: '#1e293b',
                    }}>
                        {/* Image */}
                        <div style={{ height: '220px', position: 'relative', backgroundColor: '#f3f4f6' }}>
                            <img src={listing.image} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                                {[1, 2, 3].map(dot => (
                                    <div key={dot} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dot === 1 ? 'white' : 'rgba(255,255,255,0.5)' }} />
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>
                                    ${listing.price.toLocaleString()}
                                </div>
                                <span style={{
                                    fontSize: '13px', fontWeight: 700, color: '#dc2626',
                                    backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px'
                                }}>
                                    D-{listing.daysLeft}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ position: 'relative', height: '8px', backgroundColor: '#334155', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                                <div style={{
                                    position: 'absolute', left: 0, top: 0, bottom: 0,
                                    width: `${listing.progress}%`,
                                    backgroundColor: '#7c3aed',
                                    borderRadius: '4px'
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', marginTop: '-12px' }}>
                                <span>Funded {listing.progress}%</span>
                            </div>

                            {/* Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Monthly Payment</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>${listing.monthlyPayment.toLocaleString()}</div>
                                </div>
                                <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Remaining Term</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>{listing.remainingTerm}m</div>
                                </div>
                                <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>LTV</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>{listing.ltv}%</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
                                {listing.address}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div>
                    <div style={{
                        border: '1px solid #334155', borderRadius: '12px', padding: '24px', backgroundColor: '#1e293b',
                        // Styles for embedded view
                        maxHeight: 'calc(100vh - 100px)', overflowY: 'auto'
                    }}>
                        <InvestModal
                            isOpen={isInvestModalOpen}
                            onClose={() => setIsInvestModalOpen(false)}
                            onInvest={handleInvest}
                            noteId={noteId}
                        />
                        <MerkleRecordModal
                            isOpen={isMerkleModalOpen}
                            onClose={() => setIsMerkleModalOpen(false)}
                            contractHash={noteMetadata?.contractHash}
                            creditHash={noteMetadata?.creditHash}
                            anchorHash={noteMetadata?.anchorHash}
                            paymentLedgerRoot={noteMetadata?.paymentLedgerRoot}
                            listingPrice={noteMetadata?.listingPrice}
                            listedAt={noteMetadata?.listedAt}
                            listingTxHash={noteMetadata?.listingTxHash}
                        />

                        {/* Hero Section */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '300px', position: 'relative', marginBottom: '24px', backgroundColor: '#f3f4f6' }}>
                                <img src={listing.image} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '12px' }}>
                                    <button style={{ backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                        <Share size={18} />
                                    </button>
                                    <button style={{ backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                        <Heart size={18} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
                                        Total Investment Needed {formatCurrency(listing.price)}
                                    </h1>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                                        Invested Amount {formatCurrency(listing.investedAmount)}({listing.investedPercent}%)
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                        *This investment will proceed only if the offering is fully funded (100%)
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
                                        {listing.timeLeft}
                                    </div>
                                    <Button
                                        onClick={() => setIsInvestModalOpen(true)}
                                        style={{ backgroundColor: '#7c3aed', color: 'white', borderRadius: '50px', padding: '10px 32px', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)' }}
                                    >
                                        Invest
                                    </Button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ position: 'relative', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${listing.investedPercent}%`, backgroundColor: '#7c3aed', height: '100%' }} />
                            </div>
                        </div>

                        {/* Overall Assessment */}
                        <div style={{ marginBottom: '48px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <SectionTitle>Overall Assessment</SectionTitle>
                                <div style={{ border: '1px solid #7c3aed', borderRadius: '20px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#a78bfa' }}>
                                    BPO <ExternalLink size={12} />
                                </div>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                                This is a Seasoned Performing 1st Lien note backed by a $1.19~1.21M property in Missouri City, TX.
                                The borrower has demonstrated stable payment behavior, making consistent monthly payments of ${formatCurrency(listing.monthlyPayment).replace('$', '')} for {listing.remainingTerm} months.
                                With an estimated LTV of {listing.ltv}%, the collateral coverage is strong.
                            </p>
                        </div>

                        {/* Note Terms Summary */}
                        <div style={{ marginBottom: '48px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9' }}>Note Terms Summary</h2>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f1f5f9' }}>Payment & Term</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                    <DetailCard label="Monthly P&I Payment" value={`$${listing.monthlyPayment / 1000}K`} />
                                    <DetailCard label="Remaining Term" value={`${listing.remainingTerm}m`} />
                                    <DetailCard label="Maturity Date" value={listing.maturityDate} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f1f5f9' }}>Yield & Return</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                    <DetailCard label="Interest rate" value={`${listing.interestRate}%`} />
                                    <DetailCard label="IRR at Maturity" value={`${listing.irr}%`} />
                                    <div /> {/* Spacer */}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f1f5f9' }}>Principal & Structure</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                    <DetailCard label="Unpaid Principal Balance" value={`$${Math.round(listing.upb / 1000)}K`} />
                                    <DetailCard label="Lien" value={listing.lien} />
                                    <DetailCard label="Performing" value={listing.performing} />
                                </div>
                            </div>

                            <div style={{ marginTop: '24px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f1f5f9' }}>Legal / State Context</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                    <DetailCard label="Non-Judicial State" value="Yes" />
                                    <DetailCard label="Servicer" value="ServiceMac" />
                                    <DetailCard label="Trustee" value="First American" />
                                </div>
                            </div>
                        </div>

                        {/* Blockchain Verification */}
                        <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '50px',
                                border: '1px solid #475569', backgroundColor: '#334155',
                                cursor: 'pointer', transition: 'all 0.2s',
                                color: '#cbd5e1', fontSize: '13px', fontWeight: 500
                            }}
                                onClick={() => navigate('/merkle-record')}
                                title="View Verified Merkle Record"
                            >
                                <span>Verified on Blockchain</span>
                                <div style={{
                                    width: '20px', height: '20px', backgroundColor: '#f1f5f9', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 17L12 22L22 17" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 12L12 17L22 12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Property Valuation */}
                        <div style={{ marginBottom: '48px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9' }}>Property Valuation</h2>
                            </div>
                            <div style={{ border: '1px solid #334155', borderRadius: '12px', padding: '24px', position: 'relative', backgroundColor: '#1e293b' }}>
                                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                                            <th style={{ padding: '8px', fontWeight: 600 }}>VALUE</th>
                                            <th style={{ padding: '8px', fontWeight: 600 }}>RANGE</th>
                                            <th style={{ padding: '8px', fontWeight: 600 }}>LTV</th>
                                            <th style={{ padding: '8px', fontWeight: 600 }}>DATE</th>
                                            <th style={{ padding: '8px', fontWeight: 600 }}>TYPE</th>
                                            <th style={{ padding: '8px', fontWeight: 600 }}>PROVIDED BY</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #334155' }}>
                                            <td style={{ padding: '12px 8px', fontWeight: 600, color: '#f1f5f9' }}>$1,198,000.00</td>
                                            <td style={{ padding: '12px 8px', color: '#64748b' }}>N/A</td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>44%</td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>33 days ago</td>
                                            <td style={{ padding: '12px 8px', color: '#2563eb', fontWeight: 500 }}>BPO <ExternalLink size={10} style={{ display: 'inline' }} /></td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>Seller</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #334155' }}>
                                            <td style={{ padding: '12px 8px', fontWeight: 600, color: '#f1f5f9' }}>$1,209,800.00</td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>$1.1M-1.31M</td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>43%</td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>About 20 hours ago</td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>Zestimate</td>
                                            <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>Zillow</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>
                                    Powered by Zillow
                                </div>
                            </div>
                        </div>

                        {/* Borrower Risk Summary */}
                        <div style={{ marginBottom: '48px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9' }}>Borrower Risk Summary</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                                <DetailCard label="Credit Score Band:" value={listing.creditScore} />
                                <DetailCard label="Payment consistency" value={listing.paymentHistory} />
                                <DetailCard label="Seasoning" value={listing.seasoning} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                <DetailCard label="Employment" value="W2 employee" subValue="(verified)" highlight />
                                <DetailCard label="Income stability score" value={listing.incomeScore} />
                                <DetailCard label="DTI Estimate" value="Moderate risk" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorDashboard;
