import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChevronLeft, HelpCircle } from 'lucide-react';

const SellerFinancingTerms: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const photos = location.state?.photos || [];

    // Mock Zillestimate Data
    const mockZestimate = 1209800;

    // Form State
    const [price, setPrice] = useState<string>('');
    const [downPaymentPercent, setDownPaymentPercent] = useState<string>('');
    const [interestRate, setInterestRate] = useState<string>('');
    const [termYears, setTermYears] = useState<string>('30');
    const [isNegotiable, setIsNegotiable] = useState(false);
    const [showRiskTooltip, setShowRiskTooltip] = useState(false);

    // Derived State
    const priceNum = parseInt(price.replace(/,/g, '')) || 0;
    const downPaymentNum = parseFloat(downPaymentPercent) || 0;
    const rateNum = parseFloat(interestRate) || 0;
    const termNum = parseInt(termYears) || 30;

    // Calculations
    const downPaymentAmount = priceNum * (downPaymentNum / 100);
    const loanAmount = priceNum - downPaymentAmount;
    const monthlyRate = rateNum / 100 / 12;
    const numberOfPayments = termNum * 12;

    const monthlyPayment = (loanAmount > 0)
        ? (rateNum > 0)
            ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
            : loanAmount / numberOfPayments
        : 0;

    const totalRepayment = monthlyPayment * numberOfPayments;

    // Formatting
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    // Logic for Guidance Messages
    const getPriceGuidance = () => {
        if (!priceNum) {
            return { type: 'info', text: `See "Estimated Value (Zillow)" on the right for market reference.` };
        }
        if (priceNum > mockZestimate * 1.1) {
            return { type: 'warning', text: `Your price is >10% above the estimated value ($${mockZestimate.toLocaleString()}). High prices may increase sales time.` };
        }
        return { type: 'success', text: `Aligned with market estimate ($${mockZestimate.toLocaleString()}).` };
    };

    const getDownPaymentGuidance = () => {
        if (!downPaymentPercent) {
            return { type: 'info', text: 'See "Contract Categories" on the right for guidance.' };
        }
        if (downPaymentNum < 10) return { type: 'warning', text: "Too low (<10%) increases default risk." };
        if (downPaymentNum > 30) return { type: 'warning', text: "Too high (>30%) may decrease the pool of eligible buyers." };
        return { type: 'success', text: "Standard down payment range." };
    };

    const getRateGuidanceRange = () => {
        // High Down Payment -> Lower Rate (Safe)
        // Low Down Payment -> Higher Rate (Risk Premium)
        if (downPaymentNum >= 30) return "5.5% - 6.5%";
        if (downPaymentNum >= 10) return "6.5% - 8.0%";
        return "8.0% - 10.0%";
    };

    const getRateGuidance = () => {
        const range = getRateGuidanceRange();
        if (!downPaymentPercent) {
            return { type: 'info', text: 'Enter down payment first to see suggested interest rate range.' };
        }

        // Check if interest rate is entered and validate against range
        if (rateNum > 0) {
            let minRate = 0;
            let maxRate = 0;

            if (downPaymentNum >= 30) {
                minRate = 5.5;
                maxRate = 6.5;
            } else if (downPaymentNum >= 10) {
                minRate = 6.5;
                maxRate = 8.0;
            } else {
                minRate = 8.0;
                maxRate = 10.0;
            }

            if (rateNum < minRate) {
                return { type: 'warning', text: `Rate is below market range (${range}) for ${downPaymentNum}% down payment.` };
            } else if (rateNum > maxRate) {
                return { type: 'warning', text: `Rate is above market range (${range}) for ${downPaymentNum}% down payment.` };
            } else {
                return { type: 'success', text: `Rate is within market range (${range}) for ${downPaymentNum}% down payment.` };
            }
        }

        return { type: 'info', text: `Market range for ${downPaymentNum}% down payment: ${range}` };
    };

    // Risk Categorization Logic (Owner Perspective)
    // If Owner accepts Low Down Payment -> They are taking Tier C Risk (High Risk/Return)
    // If Owner accepts High Down Payment -> They are taking Tier A Risk (Low Risk/Return)
    const getRiskCategory = () => {
        if (!downPaymentPercent || !price) return null;
        if (downPaymentNum >= 30) return 'Tier A';
        if (downPaymentNum >= 10) return 'Tier B';
        return 'Tier C';
    };

    const riskCategory = getRiskCategory();

    const getRiskColor = (cat: string | null) => {
        switch (cat) {
            case 'Tier A': return { bg: '#dcfce7', text: '#166534', label: 'Conservative' };
            case 'Tier B': return { bg: '#fef3c7', text: '#b45309', label: 'Balanced' };
            case 'Tier C': return { bg: '#fee2e2', text: '#991b1b', label: 'Opportunistic' };
            default: return { bg: '#f3f4f6', text: '#374151', label: 'N/A' };
        }
    };

    const riskStyle = getRiskColor(riskCategory);

    const handlePreview = () => {
        navigate('/listing-preview', {
            state: {
                photos,
                price: priceNum,
                downPayment: downPaymentNum,
                interestRate: rateNum,
                termYears: termNum,
                monthlyPayment,
                riskCategory,
                zestimate: mockZestimate
            }
        });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/property-photos')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                    <ChevronLeft size={18} /> Back to photos
                </button>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: '32px' }}>

                {/* Left Column: Input Form */}
                <Card padding="32px">
                    <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: '#111827' }}>Define Financing Terms</h2>

                    {/* Home Price */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                            Home Price ($)
                        </label>
                        <Input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 500,000"
                            style={{ margin: 0 }}
                        />
                        {getPriceGuidance() && (
                            <div style={{
                                fontSize: '12px',
                                color: getPriceGuidance()?.type === 'warning' ? '#dc2626' : getPriceGuidance()?.type === 'success' ? '#059669' : '#6b7280',
                                marginTop: '6px'
                            }}>
                                {getPriceGuidance()?.text}
                            </div>
                        )}
                    </div>

                    {/* Down Payment */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                            Down Payment (%)
                        </label>
                        <Input
                            value={downPaymentPercent}
                            onChange={(e) => setDownPaymentPercent(e.target.value)}
                            placeholder="e.g. 10"
                            style={{ margin: 0 }}
                        />
                        {getDownPaymentGuidance() && (
                            <div style={{
                                fontSize: '12px',
                                color: getDownPaymentGuidance()?.type === 'warning' ? '#dc2626' : getDownPaymentGuidance()?.type === 'success' ? '#059669' : '#6b7280',
                                marginTop: '6px'
                            }}>
                                {getDownPaymentGuidance()?.text}
                            </div>
                        )}
                    </div>

                    {/* Interest Rate */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                            Interest Rate (%)
                        </label>
                        <Input
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            placeholder="e.g. 6.5"
                            style={{ margin: 0 }}
                        />
                        {getRateGuidance() && (
                            <div style={{
                                fontSize: '12px',
                                color: getRateGuidance()?.type === 'warning' ? '#dc2626' : getRateGuidance()?.type === 'success' ? '#059669' : '#6b7280',
                                marginTop: '6px'
                            }}>
                                {getRateGuidance()?.text}
                            </div>
                        )}
                    </div>

                    {/* Loan Term */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                            Loan Term (years)
                        </label>
                        <Input
                            value={termYears}
                            onChange={(e) => setTermYears(e.target.value)}
                            placeholder="e.g. 30"
                            style={{ margin: 0 }}
                        />
                    </div>

                    {/* Summary Box */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#f9fafb', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span style={{ color: '#6b7280' }}>Monthly P&I:</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(monthlyPayment)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span style={{ color: '#6b7280' }}>Total Repayment:</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(totalRepayment)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ color: '#6b7280' }}>Amortization:</span>
                            <span style={{ fontWeight: 600 }}>{numberOfPayments} Months</span>
                        </div>

                        {/* Risk Category Badge */}
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Your Deal Category</span>
                            <div
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    backgroundColor: riskStyle.bg, color: riskStyle.text,
                                    padding: '4px 12px', borderRadius: '99px',
                                    fontWeight: 600, fontSize: '14px',
                                    cursor: 'pointer', position: 'relative'
                                }}
                                onMouseEnter={() => setShowRiskTooltip(true)}
                                onMouseLeave={() => setShowRiskTooltip(false)}
                            >
                                {riskCategory || 'Pending Input'} <HelpCircle size={14} />

                                {showRiskTooltip && riskCategory && (
                                    <div style={{
                                        position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                                        width: '240px', backgroundColor: '#1f2937', color: 'white', padding: '12px', borderRadius: '8px',
                                        fontSize: '12px', textAlign: 'left', marginBottom: '8px', zIndex: 10, fontWeight: 400
                                    }}>
                                        <strong>{riskCategory}: {riskStyle.label}</strong>
                                        <p style={{ marginTop: '4px', opacity: 0.9 }}>
                                            {riskCategory === 'Tier A' && "Low risk, lower return. Similar to a standard bank mortgage."}
                                            {riskCategory === 'Tier B' && "Balanced risk/return profile. Most common seller financing structure."}
                                            {riskCategory === 'Tier C' && "High risk, potentially high return. Requires premium interest rates."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            id="negotiable"
                            checked={isNegotiable}
                            onChange={(e) => setIsNegotiable(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                        />
                        <label htmlFor="negotiable" style={{ fontSize: '14px', color: '#374151' }}>Open to negotiation</label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="outline" onClick={() => navigate('/property-photos')} style={{ flex: 1 }}>
                            Back
                        </Button>
                        <Button onClick={handlePreview} style={{ flex: 1, backgroundColor: '#000' }}>
                            Preview
                        </Button>
                    </div>

                </Card>

                {/* Right Column: Dynamic Feedback Guide */}
                <div style={{ paddingTop: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deal Analysis</h3>

                    {/* Zestimate Card */}
                    <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Estimated Value (Zillow)</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>${mockZestimate.toLocaleString()}</div>
                        <div style={{ fontSize: '13px', color: getPriceGuidance()?.type === 'warning' ? '#dc2626' : '#059669', marginTop: '8px' }}>
                            {getPriceGuidance()?.text || "Enter a price to compare."}
                        </div>
                    </div>

                    {/* Risk Spectrum Legend */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Contract Categories</h4>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: '#166534', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Tier A (Conservative)</div>
                            <ul style={{ fontSize: '13px', color: '#4b5563', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                                <li>High Down Payment ({'>'}30%)</li>
                                <li>Long-term cash flow</li>
                                <li>Easy to liquidate</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: '#b45309', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Tier B (Balanced)</div>
                            <ul style={{ fontSize: '13px', color: '#4b5563', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                                <li>Medium Down Payment (10-30%)</li>
                                <li>Mid-term cash flow</li>
                                <li>Standard Market Rates</li>
                            </ul>
                        </div>

                        <div>
                            <div style={{ color: '#991b1b', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Tier C (Opportunistic)</div>
                            <ul style={{ fontSize: '13px', color: '#4b5563', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                                <li>Low Down Payment ({'<'}10%)</li>
                                <li>Short-term cash flow strategy</li>
                                <li>Highest potential return (Rate {'>'}8%)</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerFinancingTerms;
