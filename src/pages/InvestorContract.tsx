
import React from 'react';
// import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import heroImage from '../assets/listing_1.jpg';
import ContractDocumentList from '../components/contract/ContractDocumentList';
import { type ContractData } from '../components/contract/ContractInputForm';

const InvestorContract: React.FC = () => {
    // Load contract data from seller's contract page
    const loadSellerContractState = () => {
        try {
            const stored = localStorage.getItem('tsf_contract_page_state_v2');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error("Failed to load seller contract state", e);
            return null;
        }
    };

    const sellerContractState = loadSellerContractState();

    // Contract Data - Use seller's contract data
    const contractData: ContractData = sellerContractState?.contractData || {
        buyer: null,
        price: '475,000',
        downPaymentPercent: '30',
        closingDate: '',
        interestRate: '5.5',
        term: '30',
        termUnit: 'years',
        paymentStructure: 'Fully Amortized',
        balloonTerm: '',
        securityInstrument: 'Deed of Trust',
        lienPosition: '1st',
        gracePeriod: '15',
        prepaymentAllowed: 'Yes',
        prepaymentPenalty: false,
        confirmed: false
    };

    // Success State - Use seller's completion data
    const completionData = sellerContractState?.completionData || null;
    const isCompleted = sellerContractState?.isCompleted || false;

    // Derived Calculations
    const priceNum = parseInt(contractData.price.replace(/,/g, '')) || 0;
    const downPaymentNum = parseFloat(contractData.downPaymentPercent) || 0;
    const rateNum = parseFloat(contractData.interestRate) || 0;

    // Amortization/Term (Basis for Monthly Payment & Repayment)
    const termVal = parseInt(contractData.term) || 30;
    const isMonths = contractData.termUnit === 'months';
    const totalMonths = isMonths ? termVal : termVal * 12;

    const downPaymentAmount = priceNum * (downPaymentNum / 100);
    const loanAmount = priceNum - downPaymentAmount;

    // Monthly Payment Calculation
    const monthlyRate = rateNum / 100 / 12;

    let monthlyPayment = 0;
    if (loanAmount > 0) {
        if (rateNum === 0) {
            monthlyPayment = loanAmount / totalMonths;
        } else {
            // Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
            monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
    }

    // Total Repayment Calculation
    const totalRepayment = monthlyPayment * totalMonths;

    const contractFee = loanAmount * 0.01; // 1% of Note Principal (Loan Amount)

    // Risk Categorization
    const getRiskCategory = () => {
        if (!contractData.downPaymentPercent || !contractData.price) return null;
        if (downPaymentNum >= 30) return 'Tier A';
        if (downPaymentNum >= 15) return 'Tier B';
        return 'Tier C';
    };
    const riskCategory = getRiskCategory();

    // No-op handlers for read-only view
    const handleComplete = () => {
        // Read-only - no action needed
    };

    const handleClose = () => {
        // Read-only - no action needed
    };

    return (
        <div className="container" style={{ padding: '32px 0', backgroundColor: '#0f172a', minHeight: '100vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '48px', alignItems: 'start' }}>

                {/* Left Column: Listing Card */}
                <div>
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
                                <img src={heroImage} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                        $500,000
                                    </div>
                                    <span style={{
                                        fontSize: '13px', fontWeight: 700, color: '#dc2626',
                                        backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px'
                                    }}>
                                        D-30
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ position: 'relative', height: '8px', backgroundColor: '#334155', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute', left: 0, top: 0, bottom: 0,
                                        width: '100%',
                                        backgroundColor: '#7c3aed',
                                        borderRadius: '4px'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', marginTop: '-12px' }}>
                                    <span>Funded 100%</span>
                                </div>

                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Monthly Payment</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>$6,018</div>
                                    </div>
                                    <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Remaining Term</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>120m</div>
                                    </div>
                                    <div style={{ backgroundColor: '#334155', padding: '12px 8px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>LTV</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>43%</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
                                    5931 Abernathy Dr, Los Angeles, CA 90045
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contract Documents (Read-Only) */}
                {isCompleted && (
                    <div style={{
                        border: '1px solid #334155',
                        borderRadius: '24px',
                        padding: '32px',
                        backgroundColor: '#1e293b',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <ContractDocumentList
                            onComplete={handleComplete}
                            summary={{
                                monthlyPayment,
                                totalRepayment,
                                contractFee,
                                price: priceNum,
                                downPayment: downPaymentAmount,
                                loanAmount: loanAmount
                            }}
                            onClose={handleClose}
                            data={contractData}
                            initialCompletionData={completionData}
                            theme="dark"
                            showTokenizedNote={true}
                        />
                    </div>
                )}

                {!isCompleted && (
                    <div style={{
                        border: '1px solid #334155',
                        borderRadius: '24px',
                        padding: '48px',
                        backgroundColor: '#1e293b',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px' }}>
                            No Contract Available
                        </h2>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                            The seller has not completed the contract yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestorContract;
