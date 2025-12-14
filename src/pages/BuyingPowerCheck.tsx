import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ChevronLeft, Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyingPowerCheck: React.FC = () => {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/select-role')}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: 'var(--color-text-main)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            {/* Main Card */}
            <Card style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }} padding="32px">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#1e40af',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'
                    }}>
                        <ShieldCheck size={24} />
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Identity Verification</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                        To verify your eligibility, we need to perform a soft credit inquiry. <br />
                        <strong>This will not affect your credit score.</strong>
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); navigate('/income-verification'); }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '8px' }}>
                        <Input label="Date of Birth" placeholder="MM / DD / YYYY" type="date" />
                    </div>

                    <Input label="Current Address" placeholder="123 Main St, City, State ZIP" />

                    <div style={{ position: 'relative' }}>
                        <Input
                            label="Social Security Number"
                            placeholder="XXX - XX - XXXX"
                            type="password"
                            helperText="Your information is encrypted with bank-level security."
                        />
                        <Lock size={14} style={{ position: 'absolute', right: '12px', top: '38px', color: 'var(--color-text-muted)' }} />
                    </div>

                    <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '16px',
                        marginTop: '24px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <input
                            type="checkbox"
                            id="consent"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            style={{ marginTop: '3px' }}
                        />
                        <label htmlFor="consent" style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                            I authorize TSF to obtain my credit information for pre-qualification purposes. I understand this is a soft inquiry and does not impact my credit score.
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
                        <Button type="button" variant="secondary" onClick={() => navigate('/select-role')}>Cancel</Button>
                        <Button
                            type="submit"
                            disabled={!agreed}
                            style={{
                                backgroundColor: '#000',
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: '999px',
                                opacity: !agreed ? 0.5 : 1
                            }}
                        >
                            Verifiy & Continue
                        </Button>
                    </div>

                </form>
            </Card>

            <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                <Lock size={12} /> 256-bit SSL Encryption
            </div>

        </div>
    );
};

export default BuyingPowerCheck;
