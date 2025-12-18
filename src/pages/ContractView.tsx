import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PenTool, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContractView: React.FC = () => {
    const [signed, setSigned] = useState(false);
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '20px' }}>Contract Agreement #8842</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Version 1.0 • Created Oct 25, 2025</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {signed && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 600, fontSize: '14px' }}><ShieldCheck size={18} /> Signed on Chain</span>}
                </div>
            </div>

            {/* Contract Text */}
            <Card padding="40px" style={{ height: '500px', overflowY: 'auto', marginBottom: '24px', backgroundColor: '#fff', border: '1px solid #cbd5e1' }}>
                <div style={{ fontFamily: '"Times New Roman", serif', lineHeight: '1.6', fontSize: '16px', color: '#334155' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '32px' }}>PROMISSORY NOTE AND SECURITY AGREEMENT</h3>

                    <p style={{ marginBottom: '16px' }}><strong>THIS NOT</strong> (the "Note") is made this 25th day of October, 2025...</p>

                    <p style={{ marginBottom: '16px' }}>
                        <strong>1. PROMISE TO PAY.</strong> FOR VALUE RECEIVED, the undersigned Borrower(s) jointly and severally promise to pay to the order of FinBridge Lender LLC...
                    </p>

                    <p style={{ marginBottom: '16px' }}>
                        <strong>2. INTEREST.</strong> Interest shall accrue on the unpaid principal balance of this Note at the rate of SIX AND ONE HALF PERCENT (6.5%) per annum...
                    </p>

                    <p style={{ marginBottom: '16px' }}>
                        <strong>3. PAYMENTS.</strong> Principal and interest shall be payable in consecutive monthly installments of $5,056.54...
                    </p>

                    <p style={{ marginBottom: '16px' }}>
                        [... truncated for preview ...]
                    </p>

                    <div style={{ marginTop: '64px', borderTop: '1px solid #000', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ marginBottom: '40px' }}>AGREED AND ACCEPTED:</div>
                            <div style={{ width: '200px', borderBottom: '1px solid #000', height: '40px' }}>
                                {signed && <div style={{ fontFamily: 'Cursive', fontSize: '24px', color: '#1e3a8a' }}>Acme Corp</div>}
                            </div>
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>Authorized Signature</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Signing Action */}
            {!signed ? (
                <Card padding="24px" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>Ready to Execute?</h4>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>By signing, you agree to the terms listed above and will record this action on-chain.</p>
                        </div>
                        <Button onClick={() => setSigned(true)} size="lg">
                            <PenTool size={18} style={{ marginRight: '8px' }} /> Sign Contract
                        </Button>
                    </div>
                </Card>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Contract Executed Successfully</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>The transaction hash has been generated and the asset is now live.</p>
                    <Button variant="outline" onClick={() => navigate('/')}>Return to Dashboard</Button>
                </div>
            )}

        </div>
    );
};
export default ContractView;
