import React, { useState } from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import Button from '../components/ui/Button';
import heroImage from '../assets/listing_1.jpg';
import ContractInputForm, { type ContractData } from '../components/contract/ContractInputForm';
import ContractDocumentList from '../components/contract/ContractDocumentList';

const Contract: React.FC = () => {
    // UI State
    const [step, setStep] = useState<'input' | 'preview'>('input');
    const [showForm, setShowForm] = useState(false); // To toggle the right side initially

    // Form State
    const [contractData, setContractData] = useState<ContractData>({
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
    });

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

    const handleGenerate = () => {
        setStep('preview');
    };

    const handleComplete = () => {
        // alert("Contracts Finalized! (Mock Action)");
    };

    const handleClose = () => {
        setShowForm(false);
        setStep('input'); // Reset to input step when re-opening
    };

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '48px', alignItems: 'start' }}>

                {/* Left Column: Listing Card & Action */}
                <div>
                    <div style={{ marginBottom: '24px' }}>
                        <MarketplaceCard
                            address="5931 Abernathy Dr, Los Angeles, CA 90045"
                            price={475000}
                            specs={{
                                dp: 45000,
                                term: 30,
                                interest: 6,
                                beds: 3,
                                baths: 2
                            }}
                            sqft={1982}
                            image={heroImage}
                            tier={riskCategory || 'Tier A'}
                            negotiable={true}
                            showBookmark={false}
                            showPricePerSqft={false}
                        />
                    </div>

                    <Button
                        onClick={() => setShowForm(true)}
                        disabled={showForm}
                        style={{
                            width: '100%',
                            height: '48px',
                            fontSize: '15px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            backgroundColor: showForm ? '#f3f4f6' : '#000',
                            color: showForm ? '#9ca3af' : 'white',
                            cursor: showForm ? 'default' : 'pointer',
                            border: showForm ? '1px solid #e5e7eb' : 'none'
                        }}
                    >
                        Build Contract
                    </Button>
                </div>

                {/* Right Column: Contract Workflow */}
                {showForm && (
                    <div style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '24px',
                        padding: '32px',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        {step === 'input' ? (
                            <ContractInputForm
                                data={contractData}
                                onChange={setContractData}
                                onGenerate={handleGenerate}
                                calculated={{ monthlyPayment, totalRepayment, contractFee }}
                                onClose={handleClose}
                            />
                        ) : (
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
                            />
                        )}
                    </div>
                )}
            </div>
            {/* Yellow decoration circle */}
            <div style={{
                position: 'fixed',
                bottom: '80px',
                right: '80px',
                width: '120px',
                height: '120px',
                backgroundColor: '#fbbf24',
                borderRadius: '50%',
                zIndex: -1
            }}></div>
        </div>
    );
};

export default Contract;
