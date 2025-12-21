import React, { useState } from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import Button from '../components/ui/Button';
import heroImage from '../assets/listing_1.jpg';
import ContractInputForm, { type ContractData } from '../components/contract/ContractInputForm';
import ContractDocumentList from '../components/contract/ContractDocumentList';

const Contract: React.FC = () => {
    // Persistence Key
    const STORAGE_KEY = 'tsf_contract_page_state_v1';

    // Lazy Initializers
    const loadState = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error("Failed to load contract state", e);
            return null;
        }
    };

    const savedState = loadState();

    // UI State
    const [step, setStep] = useState<'input' | 'preview'>(savedState?.step || 'input');
    const [showForm, setShowForm] = useState(savedState?.showForm || false);
    const [isCompleted, setIsCompleted] = useState(savedState?.isCompleted || false);

    // Form State
    const [contractData, setContractData] = useState<ContractData>(savedState?.contractData || {
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

    // Success State Persistence
    const [completionData, setCompletionData] = useState<any>(savedState?.completionData || null);

    // Save State Effect
    React.useEffect(() => {
        const stateToSave = {
            step,
            showForm,
            isCompleted,
            contractData,
            completionData
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [step, showForm, isCompleted, contractData, completionData]);


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

    const handleComplete = (data: any) => {
        setIsCompleted(true);
        setCompletionData(data);
    };

    const handleNewContract = () => {
        // Reset for new contract
        const initialData: ContractData = {
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

        setContractData(initialData);
        setStep('input');
        setIsCompleted(false);
        setCompletionData(null);
        setShowForm(true);

        // Explicitly clear/overwrite storage right away to avoid race conditions
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            step: 'input',
            showForm: true,
            isCompleted: false,
            contractData: initialData,
            completionData: null
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setStep('input');
        setIsCompleted(false);
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
                        onClick={isCompleted ? handleNewContract : () => setShowForm(true)}
                        disabled={showForm && !isCompleted}
                        style={{
                            width: '100%',
                            height: '48px',
                            fontSize: '15px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            backgroundColor: (showForm && !isCompleted) ? '#f3f4f6' : '#000',
                            color: (showForm && !isCompleted) ? '#9ca3af' : 'white',
                            cursor: (showForm && !isCompleted) ? 'default' : 'pointer',
                            border: (showForm && !isCompleted) ? '1px solid #e5e7eb' : 'none'
                        }}
                    >
                        {isCompleted ? "New Contract" : "Build Contract"}
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
                                initialCompletionData={completionData}
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
