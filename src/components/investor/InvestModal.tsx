import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { BrowserProvider, Contract, ethers } from 'ethers';
import ListingABI from '../../abis/Listing.json';

// ERC20 Minimal ABI for Approve
const ERC20ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)"
];

interface InvestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvest: (amount: number) => void;
    noteId: number;
}

// Mantle Sepolia Contract Addresses
const LISTING_ADDRESS = "0x376EDcdbc2Ef192d74937BF61C0E0CB8c20c95b0";
const DEMOUSD_ADDRESS = "0x2f514963a095533590E1FB98eedC637D3947d219";

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

const InvestModal: React.FC<InvestModalProps> = ({ isOpen, onClose, onInvest, noteId }) => {
    const { address } = useWallet();
    const [step, setStep] = useState<1 | 2>(1);
    const [agreed, setAgreed] = useState(false);
    const [expandedDoc, setExpandedDoc] = useState<string | null>('Tokenized Note (Investment Certificate)');
    const [investmentAmount, setInvestmentAmount] = useState<number>(10000); // Default $10k

    // Transaction State
    const [isApproving, setIsApproving] = useState(false);
    const [isInvesting, setIsInvesting] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // State for Dynamic Data
    const [myInvestment, setMyInvestment] = useState<number>(0);
    const [totalRaised, setTotalRaised] = useState<number>(0);

    // Fetch Contract Data
    // Fetch Contract Data
    React.useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                // 1. Total Raised (Public - Try RPC first)
                try {
                    const rpcProvider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
                    const listingPublic = new Contract(LISTING_ADDRESS, ListingABI, rpcProvider);
                    const noteStatus = await listingPublic.getNoteStatus(noteId);
                    setTotalRaised(Number(noteStatus.raised) / 1_000_000);
                } catch (e) {
                    // Fallback to browser provider if RPC fails
                    if (window.ethereum) {
                        const browserProvider = new BrowserProvider(window.ethereum);
                        const listing = new Contract(LISTING_ADDRESS, ListingABI, browserProvider);
                        const noteStatus = await listing.getNoteStatus(noteId);
                        setTotalRaised(Number(noteStatus.raised) / 1_000_000);
                    }
                }

                // 2. My Investment (Private - Needs Wallet)
                if (window.ethereum && address) {
                    const browserProvider = new BrowserProvider(window.ethereum);
                    const listingUser = new Contract(LISTING_ADDRESS, ListingABI, browserProvider);
                    const myInvWei = await listingUser.invested(noteId, address);
                    setMyInvestment(Number(myInvWei) / 1_000_000);
                }
            } catch (err) {
                console.error("Error fetching modal data:", err);
            }
        };
        fetchData();
    }, [isOpen, address, txHash]); // Refresh on open or after transaction

    // Mock calculations
    const noteSize = 455000;
    const availableAmount = noteSize - totalRaised;
    const share = investmentAmount / noteSize;
    const totalMonthlyPayment = 6000;
    const monthlyPI = totalMonthlyPayment * share;
    const servicingFee = monthlyPI * 0.01;
    const netCashFlow = monthlyPI - servicingFee;

    const documents = [
        {
            title: 'Tokenized Note (Investment Certificate)',
            content: (
                <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#4b5563' }}>
                    <p style={{ marginBottom: '8px' }}><strong>Underlying Asset:</strong> 1st lien seller-financed promissory note</p>
                    <p style={{ marginBottom: '8px' }}><strong>Total Note Size:</strong> $455,000</p>
                    <p style={{ marginBottom: '8px' }}><strong>Remaining Term:</strong> 107 months</p>
                    <p style={{ marginBottom: '8px' }}><strong>Interest Rate:</strong> 5%</p>
                    <p>Investor receives pro-rata principal & interest. Serviced by licensed loan servicer. Trustee and documentation handled by regulated partners.</p>
                </div>
            )
        },
        { title: 'Purchase Agreement', content: 'Standard agreement outlining the purchase terms of the tokenized note representation.' },
        { title: 'Seller Financing Addendum', content: 'Addendum detailing the seller financing specific terms attached to the property.' },
        { title: 'Promissory Note', content: 'The original promissory note signed by the borrower.' },
        { title: 'Deed of Trust', content: 'Security instrument recorded against the property.' },
        { title: 'Amortization Schedule', content: 'Complete schedule of payments over the life of the loan.' }
    ];

    const toggleDoc = (title: string) => {
        setExpandedDoc(expandedDoc === title ? null : title);
    };

    const handleNext = () => {
        if (agreed) setStep(2);
    };

    const handlePay = async () => {
        if (!window.ethereum) {
            setError("No crypto wallet found. Please install MetaMask.");
            return;
        }

        setError(null);
        setIsApproving(true);

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const amountWei = BigInt(investmentAmount) * 1_000_000n; // 6 decimals

            // 1. Approve
            const demoUSD = new Contract(DEMOUSD_ADDRESS, ERC20ABI, signer);
            console.log("Approving...", DEMOUSD_ADDRESS, LISTING_ADDRESS);
            const approveTx = await demoUSD.approve(LISTING_ADDRESS, amountWei);
            await approveTx.wait();
            setIsApproving(false);

            // 2. Invest
            setIsInvesting(true);
            const listing = new Contract(LISTING_ADDRESS, ListingABI, signer);
            console.log("Investing...", LISTING_ADDRESS);
            const investTx = await listing.invest(noteId, amountWei); // Pass noteId
            const receipt = await investTx.wait();

            console.log("Invested!", receipt.hash);
            setTxHash(receipt.hash);
            setIsInvesting(false);

            // Mock persistence for UI sync (optional, can rely on on-chain read)
            const newInvestment = {
                walletAddress: address || '0xWalletNotConnected',
                amount: investmentAmount,
                share: share,
                timestamp: new Date().toISOString(),
                txHash: receipt.hash
            };
            const storedInvestments = localStorage.getItem('investor_investments');
            const investments = storedInvestments ? JSON.parse(storedInvestments) : [];
            investments.push(newInvestment);
            localStorage.setItem('investor_investments', JSON.stringify(investments));

            onInvest(investmentAmount);
            // alert(`Investment confirmed! Tx: ${receipt.hash}`);
            // Don't close immediately, let them see the success state

        } catch (err: any) {
            console.error(err);
            setError(err.reason || err.message || "Transaction failed");
            setIsApproving(false);
            setIsInvesting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div style={{ fontFamily: 'Inter, sans-serif' }}>

                {/* Header Steps */}
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step === 1 ? 'black' : '#10b981', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600
                    }}>
                        {step === 1 ? '1' : <CheckCircle size={14} />}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: step === 1 ? 'black' : '#10b981' }}>Documents</span>
                    <div style={{ width: '40px', height: '1px', backgroundColor: '#e5e7eb' }} />
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step === 2 ? 'black' : '#f3f4f6', color: step === 2 ? 'white' : '#9ca3af',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600
                    }}>2</div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: step === 2 ? 'black' : '#9ca3af' }}>Investment</span>
                </div>

                {step === 1 ? (
                    <>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Review & Agree to Investment Documents</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>This investment is based on the underlying seller-financed real estate note.</p>

                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
                            {documents.map((doc, idx) => (
                                <div key={doc.title} style={{ borderBottom: idx !== documents.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                                    <button
                                        onClick={() => toggleDoc(doc.title)}
                                        style={{
                                            width: '100%', padding: '16px', background: 'white', border: 'none',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{doc.title}</span>
                                        {expandedDoc === doc.title ? <ChevronDown size={16} color="#6b7280" /> : <ChevronRight size={16} color="#6b7280" />}
                                    </button>
                                    {expandedDoc === doc.title && (
                                        <div style={{ padding: '0 16px 16px 16px', backgroundColor: '#f9fafb', fontSize: '13px', color: '#4b5563' }}>
                                            {typeof doc.content === 'string' ? <p>{doc.content}</p> : doc.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', backgroundColor: '#fff7ed', padding: '12px', borderRadius: '8px' }}>
                            <AlertCircle size={16} color="#c2410c" />
                            <span style={{ fontSize: '12px', color: '#9a3412', fontWeight: 500 }}>
                                *This investment will proceed only if the offering is fully funded (100%).
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                style={{ marginTop: '4px', cursor: 'pointer' }}
                            />
                            <label htmlFor="agree" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer', lineHeight: '1.5' }}>
                                I have reviewed and agree to all documents above, including the Tokenized Note terms and risks.
                            </label>
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={!agreed}
                            style={{
                                width: '100%', backgroundColor: agreed ? 'black' : '#e5e7eb', color: agreed ? 'white' : '#9ca3af',
                                borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: 600,
                                cursor: agreed ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Agree & Continue
                        </Button>
                    </>
                ) : (
                    <>
                        {txHash ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{
                                    width: '64px', height: '64px', backgroundColor: '#d1fae5', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto',
                                    color: '#059669'
                                }}>
                                    <CheckCircle size={32} />
                                </div>
                                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Investment Successful!</h2>
                                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                                    Your funds have been securely transferred to the listing contract.
                                </p>

                                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'left' }}>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Transaction Hash</div>
                                    <div style={{ fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all', color: '#374151' }}>
                                        {txHash}
                                    </div>
                                    <a
                                        href={`https://explorer.sepolia.mantle.xyz/tx/${txHash}`} // Mantle Sepolia Explorer
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}
                                    >
                                        View on Block Explorer ↗
                                    </a>
                                </div>

                                <Button
                                    onClick={onClose}
                                    style={{ width: '100%', borderRadius: '50px', backgroundColor: 'black', color: 'white' }}
                                >
                                    Done
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Make Investment</h2>
                                        <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Time Left: <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>30 Days</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Total Note Size</div>
                                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{formatCurrency(noteSize)}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Invested</div>
                                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{formatCurrency(myInvestment)} ({(myInvestment / noteSize * 100).toFixed(1)}%)</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Available</div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>{formatCurrency(availableAmount)}</div>
                                    </div>
                                </div>

                                {/* Input */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Investment Amount (min $1,000)</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#374151' }}>$</span>
                                        <input
                                            type="number"
                                            value={investmentAmount}
                                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                            disabled={isApproving || isInvesting}
                                            style={{
                                                width: '100%', padding: '12px 16px 12px 32px', borderRadius: '8px', border: '1px solid #d1d5db',
                                                fontSize: '16px', fontWeight: 500
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Calculations */}
                                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '14px', color: '#64748b' }}>Ownership Share</span>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{(share * 100).toFixed(2)}%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '14px', color: '#64748b' }}>Expected Monthly P&I</span>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{formatCurrency(monthlyPI)} / mo</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Net Monthly Cash Flow</span>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#166534' }}>{formatCurrency(netCashFlow)} / mo</span>
                                    </div>
                                </div>

                                {error && (
                                    <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#b91c1c', fontSize: '14px' }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Button
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        disabled={isApproving || isInvesting}
                                        style={{ flex: 1, borderRadius: '50px', padding: '14px' }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handlePay}
                                        disabled={isApproving || isInvesting}
                                        style={{
                                            flex: 2, backgroundColor: 'black', color: 'white',
                                            borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: 600,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        {(isApproving || isInvesting) && <Loader2 className="animate-spin" size={18} />}
                                        {isApproving ? 'Approving...' : isInvesting ? 'Processing...' : `Pay ${formatCurrency(investmentAmount)}`}
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}

            </div>
        </Modal>
    );
};

export default InvestModal;
