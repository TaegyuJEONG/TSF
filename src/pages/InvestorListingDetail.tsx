import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share, Heart, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import heroImage from '../assets/listing_1.jpg';
import InvestModal from '../components/investor/InvestModal';
import MerkleRecordModal from '../components/dashboard/MerkleRecordModal';

// Helper for currency formatting
const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

// Reusable Section Header
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>{children}</h2>
);

// Reusable Grid Card
const DetailCard: React.FC<{ label: string; value: string | React.ReactNode; subValue?: string; highlight?: boolean }> = ({ label, value, subValue, highlight }) => (
    <div style={{
        border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        backgroundColor: 'white', height: '100px'
    }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.2', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: highlight ? '20px' : '18px', fontWeight: 700, color: '#111827' }}>{value}</div>
        {subValue && <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{subValue}</div>}
    </div>
);

const InvestorListingDetail: React.FC = () => {
    const navigate = useNavigate();
    // const { id } = useParams(); // In a real app, fetch data based on ID

    const [isInvestModalOpen, setIsInvestModalOpen] = React.useState(false);
    const [isMerkleModalOpen, setIsMerkleModalOpen] = React.useState(false);

    // Mock Data
    const listing = {
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        price: 455000,
        investedAmount: 364000,
        investedPercent: 80,
        timeLeft: '17 days left',
        monthlyPayment: 6000,
        remainingTerm: 107,
        maturityDate: 'Jan 1, 2035',
        interestRate: 5.0,
        irr: 8.9,
        upb: 519000,
        lien: '1st',
        performing: 'Yes',
        ltv: 44,
        creditScore: '680-720',
        paymentHistory: '23/24 on-time',
        seasoning: '69 Months',
        employment: 'W2 employee',
        incomeScore: 'B+',
        dtiRisk: 'Moderate risk'
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', paddingBottom: '80px', fontFamily: 'Inter, sans-serif' }}>

            <InvestModal isOpen={isInvestModalOpen} onClose={() => setIsInvestModalOpen(false)} />
            <MerkleRecordModal isOpen={isMerkleModalOpen} onClose={() => setIsMerkleModalOpen(false)} />

            {/* Header */}
            <div style={{ padding: '16px 40px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 50 }}>
                <button
                    onClick={() => navigate('/investor-marketplace')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#374151' }}
                >
                    <ChevronLeft size={18} /> Back to list
                </button>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Hero Section */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', position: 'relative', marginBottom: '24px', backgroundColor: '#f3f4f6' }}>
                        <img src={heroImage} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                                Total Investment Needed {formatCurrency(listing.price)}
                            </h1>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Invested Amount {formatCurrency(listing.investedAmount)}({listing.investedPercent}%)
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                *This investment will proceed only if the offering is fully funded (100%)
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                                {listing.timeLeft}
                            </div>
                            <Button
                                onClick={() => setIsInvestModalOpen(true)}
                                style={{ backgroundColor: 'black', color: 'white', borderRadius: '50px', padding: '10px 32px', fontSize: '14px', fontWeight: 600 }}
                            >
                                Invest
                            </Button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ position: 'relative', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${listing.investedPercent}%`, backgroundColor: '#1e1b4b', height: '100%' }} />
                    </div>
                </div>

                {/* Overall Assessment */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <SectionTitle>Overall Assessment</SectionTitle>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '20px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            BPO <ExternalLink size={12} />
                        </div>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', maxWidth: '800px' }}>
                        This is a Seasoned Performing 1st Lien note backed by a $1.19~1.21M property in Missouri City, TX.
                        The borrower has demonstrated stable payment behavior, making consistent monthly payments of ${formatCurrency(listing.monthlyPayment).replace('$', '')} for {listing.remainingTerm} months.
                        With an estimated LTV of {listing.ltv}%, the collateral coverage is strong.
                    </p>
                </div>

                {/* Note Terms Summary */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Note Terms Summary</h2>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Payment & Term</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <DetailCard label="Monthly P&I Payment" value={`$${listing.monthlyPayment / 1000}K`} />
                            <DetailCard label="Remaining Term" value={`${listing.remainingTerm}m`} />
                            <DetailCard label="Maturity Date" value={listing.maturityDate} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Yield & Return</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <DetailCard label="Interest rate" value={`${listing.interestRate}%`} />
                            <DetailCard label="IRR at Maturity" value={`${listing.irr}%`} />
                            <div /> {/* Spacer */}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Principal & Structure</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <DetailCard label="Unpaid Principal Balance" value={`$${Math.round(listing.upb / 1000)}K`} />
                            <DetailCard label="Lien" value={listing.lien} />
                            <DetailCard label="Performing" value={listing.performing} />
                        </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Legal / State Context</div>
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
                        border: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
                        cursor: 'pointer', transition: 'all 0.2s',
                        color: '#374151', fontSize: '13px', fontWeight: 500
                    }}
                        onClick={() => setIsMerkleModalOpen(true)}
                        title="View Verified Merkle Record"
                    >
                        <span>Verified on Blockchain</span>
                        <div style={{
                            width: '20px', height: '20px', backgroundColor: '#111827', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Property Valuation */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Property Valuation</h2>
                    </div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', position: 'relative' }}>
                        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#6b7280' }}>
                                    <th style={{ padding: '8px', fontWeight: 600 }}>VALUE</th>
                                    <th style={{ padding: '8px', fontWeight: 600 }}>RANGE</th>
                                    <th style={{ padding: '8px', fontWeight: 600 }}>LTV</th>
                                    <th style={{ padding: '8px', fontWeight: 600 }}>DATE</th>
                                    <th style={{ padding: '8px', fontWeight: 600 }}>TYPE</th>
                                    <th style={{ padding: '8px', fontWeight: 600 }}>PROVIDED BY</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>$1,198,000.00</td>
                                    <td style={{ padding: '12px 8px', color: '#9ca3af' }}>N/A</td>
                                    <td style={{ padding: '12px 8px' }}>44%</td>
                                    <td style={{ padding: '12px 8px' }}>33 days ago</td>
                                    <td style={{ padding: '12px 8px', color: '#2563eb', fontWeight: 500 }}>BPO <ExternalLink size={10} style={{ display: 'inline' }} /></td>
                                    <td style={{ padding: '12px 8px' }}>Seller</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>$1,209,800.00</td>
                                    <td style={{ padding: '12px 8px' }}>$1.1M-1.31M</td>
                                    <td style={{ padding: '12px 8px' }}>43%</td>
                                    <td style={{ padding: '12px 8px' }}>About 20 hours ago</td>
                                    <td style={{ padding: '12px 8px' }}>Zestimate</td>
                                    <td style={{ padding: '12px 8px' }}>Zillow</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '10px', color: '#9ca3af', fontStyle: 'italic' }}>
                            Powered by Zillow
                        </div>
                    </div>
                </div>

                {/* Borrower Risk Summary */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Borrower Risk Summary</h2>
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
    );
};

export default InvestorListingDetail;
