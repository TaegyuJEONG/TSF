import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ChevronLeft, Check, Lock, Info, RefreshCw, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyerPreferences: React.FC = () => {
    const navigate = useNavigate();

    // Steps: 0=Price, 1=DownPayment, 2=Rate, 3=Result
    const [step, setStep] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);

    const [price, setPrice] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [interestRate, setInterestRate] = useState('');

    // Handlers to advance steps
    const confirmPrice = () => {
        if (price && parseInt(price.replace(/,/g, '')) > 0) setStep(1);
    }
    const confirmDownPayment = () => {
        if (downPayment && parseInt(downPayment.replace(/,/g, '')) > 0) setStep(2);
    }
    const confirmRate = () => {
        if (interestRate) setStep(3);
    }

    const handleReset = () => {
        setStep(0);
        setShowTooltip(false);
        setPrice('');
        setDownPayment('');
        setInterestRate('');
    }

    // Dynamic Rate Guidance based on LTV
    const getRateGuidance = () => {
        if (!price || !downPayment) return "Current market rates vary.";

        const p = parseInt(price.replace(/,/g, ''));
        const d = parseInt(downPayment.replace(/,/g, ''));
        if (isNaN(p) || isNaN(d) || p === 0) return "Current market rates vary.";

        const ltv = (p - d) / p; // Loan to Value

        if (ltv <= 0.70) { // High Down Payment (>30%)
            return "With your strong equity position (>30% down), you can expect competitive rates of **6.0% - 7.0%**.";
        } else if (ltv <= 0.85) { // Medium Down Payment (15-30%)
            return "For this standard leverage profile, market rates are typically **7.0% - 8.5%**.";
        } else { // Low Down Payment (<15%)
            return "With lower equity (<15% down), sellers usually require higher rates of **8.5% - 10.0%** to offset risk.";
        }
    };

    // Risk Calculation Mock Logic
    const calculateRisk = () => {
        if (!price || !downPayment) return 'N/A';
        const p = parseInt(price.replace(/,/g, ''));
        const d = parseInt(downPayment.replace(/,/g, ''));
        const ratio = d / p;

        if (ratio >= 0.3) return 'Tier A';
        if (ratio >= 0.15) return 'Tier B';
        return 'Tier C';
    };

    const riskGrade = calculateRisk();

    const getRiskColor = (grade: string) => {
        switch (grade) {
            case 'Tier A': return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
            case 'Tier B': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
            case 'Tier C': return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
            default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
        }
    }

    const getRiskDefinition = (grade: string) => {
        switch (grade) {
            case 'Tier A': return "Conservative. High down payment (>30%). Sellers see you as a safe bet.";
            case 'Tier B': return "Balanced. Average down payment (15-30%). The standard for most deals.";
            case 'Tier C': return "Opportunistic. Low down payment (<15%). May require terms adjustments.";
            default: return "";
        }
    }

    const riskStyle = getRiskColor(riskGrade);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/income-verification')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            <Card style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }} padding="32px">
                <div style={{ marginBottom: '32px', textAlign: 'center', position: 'relative' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>Build Your Offer Profile</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                        Step-by-step configuration based on your Verified Income & Credit.
                    </p>
                    {step > 0 && (
                        <button
                            onClick={handleReset}
                            style={{
                                position: 'absolute', right: 0, top: 0,
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px',
                                fontSize: '12px'
                            }}
                            title="Reset Form"
                        >
                            <RefreshCw size={14} /> Reset
                        </button>
                    )}
                </div>

                {/* Step 1: Home Price */}
                <div style={{ marginBottom: '32px', opacity: step >= 0 ? 1 : 0.5, transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary-900)' }}>1. Expected Home Price</label>
                        {step > 0 && <Check size={18} color="#166534" />}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                placeholder="e.g. 750,000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={step !== 0}
                                style={{ margin: 0 }} // Override default margin
                            />
                        </div>
                        {step === 0 && (
                            <Button onClick={confirmPrice} disabled={!price} style={{ height: '42px' }}>
                                Next
                            </Button>
                        )}
                    </div>

                    {step === 0 && (
                        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '4px', border: '1px solid #dbeafe', display: 'flex', gap: '8px', fontSize: '13px', color: '#1e40af' }}>
                            <Info size={16} style={{ flexShrink: 0 }} />
                            <span>Based on your income, a price range of <strong>$600k - $850k</strong> is recommended for easy approval.</span>
                        </div>
                    )}
                </div>

                {/* Step 2: Down Payment */}
                <div style={{ marginBottom: '32px', opacity: step >= 1 ? 1 : 0.5, pointerEvents: step >= 1 ? 'auto' : 'none', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary-900)' }}>
                            2. Expected Down Payment
                        </label>
                        {step < 1 ? <Lock size={14} color="#94a3b8" /> : (step > 1 && <Check size={18} color="#166534" />)}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                placeholder="e.g. 150,000"
                                value={downPayment}
                                onChange={(e) => setDownPayment(e.target.value)}
                                disabled={step !== 1}
                                style={{ margin: 0 }}
                            />
                        </div>
                        {step === 1 && (
                            <Button onClick={confirmDownPayment} disabled={!downPayment} style={{ height: '42px' }}>
                                Next
                            </Button>
                        )}
                    </div>
                    {step === 1 && (
                        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '4px', border: '1px solid #dbeafe', display: 'flex', gap: '8px', fontSize: '13px', color: '#1e40af' }}>
                            <Info size={16} style={{ flexShrink: 0 }} />
                            <span>For a ${price} home, a down payment of <strong>10% - 20%</strong> ($S{(parseInt(price || '0') * 0.1).toLocaleString()} - ${(parseInt(price || '0') * 0.2).toLocaleString()}) matches your credit profile.</span>
                        </div>
                    )}
                </div>

                {/* Step 3: Interest Rate */}
                <div style={{ marginBottom: '32px', opacity: step >= 2 ? 1 : 0.5, pointerEvents: step >= 2 ? 'auto' : 'none', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary-900)' }}>
                            3. Maximum Interest Rate (%)
                        </label>
                        {step < 2 ? <Lock size={14} color="#94a3b8" /> : (step > 2 && <Check size={18} color="#166534" />)}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                placeholder="e.g. 7.5"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                disabled={step !== 2}
                                style={{ margin: 0 }}
                            />
                        </div>
                        {step === 2 && (
                            <Button onClick={confirmRate} disabled={!interestRate} style={{ height: '42px' }}>
                                Calculate Risk
                            </Button>
                        )}
                    </div>
                    {step === 2 && (
                        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '4px', border: '1px solid #dbeafe', display: 'flex', gap: '8px', fontSize: '13px', color: '#1e40af' }}>
                            <Info size={16} style={{ flexShrink: 0 }} />
                            <span>{getRateGuidance()}</span>
                        </div>
                    )}
                </div>

                {/* Step 4: Risk Result */}
                {step >= 3 && (
                    <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease' }}>
                        <div style={{
                            backgroundColor: riskStyle.bg,
                            border: `1px solid ${riskStyle.border}`,
                            borderRadius: '8px',
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: riskStyle.text, marginBottom: '8px', fontWeight: 600 }}>
                                Profile Grade
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                <div style={{ fontSize: '32px', fontWeight: 700, color: riskStyle.text }}>
                                    {riskGrade}
                                </div>
                                <div
                                    style={{ position: 'relative', cursor: 'pointer', display: 'flex' }}
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <HelpCircle size={20} color={riskStyle.text} style={{ opacity: 0.7 }} />
                                    {showTooltip && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#1f2937',
                                            color: 'white',
                                            padding: '12px',
                                            borderRadius: '6px',
                                            width: '240px',
                                            fontSize: '12px',
                                            lineHeight: '1.4',
                                            marginBottom: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            zIndex: 10,
                                            textAlign: 'left'
                                        }}>
                                            <div style={{ fontWeight: 600, marginBottom: '4px', borderBottom: '1px solid #374151', paddingBottom: '4px' }}>
                                                {riskGrade} Profile
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                {getRiskDefinition(riskGrade)}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                                                Calculated from Credit, Price, Down Payment & Interest Rate.
                                            </div>
                                            {/* Tooltip Triangle */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                borderLeft: '6px solid transparent',
                                                borderRight: '6px solid transparent',
                                                borderTop: '6px solid #1f2937'
                                            }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ fontSize: '13px', color: riskStyle.text, maxWidth: '80%', margin: '0 auto' }}>
                                Your down payment and rate place you in the <strong>{riskGrade}</strong> category.
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                            <Button size="lg" onClick={() => navigate('/profile-summary')} style={{ minWidth: '200px', backgroundColor: '#000' }}>
                                Generate Profile
                            </Button>
                        </div>
                    </div>
                )}

            </Card>

        </div>
    );
};

export default BuyerPreferences;
