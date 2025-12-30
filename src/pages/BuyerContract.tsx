import React from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import heroImage from '../assets/listing_1.jpg';
import ContractDocumentList from '../components/contract/ContractDocumentList';
import type { ContractData } from '../components/contract/ContractInputForm';

const BuyerContract: React.FC = () => {
    // Read from seller's contract storage (read-only)
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
        price: '1,200,000',
        downPaymentPercent: '30',
        closingDate: '',
        interestRate: '6.0',
        term: '240',
        termUnit: 'months',
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

    const termVal = parseInt(contractData.term) || 30;
    const isMonths = contractData.termUnit === 'months';
    const totalMonths = isMonths ? termVal : termVal * 12;

    const downPaymentAmount = priceNum * (downPaymentNum / 100);
    const loanAmount = priceNum - downPaymentAmount;

    const monthlyRate = rateNum / 100 / 12;

    let monthlyPayment = 0;
    if (loanAmount > 0) {
        if (rateNum === 0) {
            monthlyPayment = loanAmount / totalMonths;
        } else {
            monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
    }

    const totalRepayment = monthlyPayment * totalMonths;
    const contractFee = loanAmount * 0.01;

    const getRiskCategory = () => {
        if (!contractData.downPaymentPercent || !contractData.price) return null;
        if (downPaymentNum >= 30) return 'Tier A';
        if (downPaymentNum >= 15) return 'Tier B';
        return 'Tier C';
    };
    const riskCategory = getRiskCategory();

    // No-op handlers for read-only view
    const handleComplete = () => { /* Read-only - no action needed */ };
    const handleClose = () => { /* Read-only - no action needed */ };

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '48px', alignItems: 'start' }}>

                {/* Left Column: Listing Card */}
                <div>
                    <MarketplaceCard
                        address="5931 Abernathy Dr, Los Angeles, CA 90045"
                        price={1200000}
                        specs={{
                            dp: 360000,
                            term: 240,
                            interest: 6,
                            beds: 6,
                            baths: 5
                        }}
                        sqft={5922}
                        image={heroImage}
                        tier={riskCategory || 'Tier A'}
                        negotiable={true}
                        showBookmark={false}
                        showPricePerSqft={false}
                    />
                </div>

                {/* Right Column: Contract Documents (Read-Only) */}
                {isCompleted && (
                    <div style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '24px',
                        padding: '32px',
                        backgroundColor: 'white',
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
                        />
                    </div>
                )}

                {!isCompleted && (
                    <div style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '24px',
                        padding: '32px',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px'
                    }}>
                        <div style={{ textAlign: 'center', color: '#6b7280' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>No Contract Available</h3>
                            <p style={{ fontSize: '14px' }}>The seller has not yet created a contract for this property.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerContract;
