import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Download } from 'lucide-react';

const TermSheet: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            {/* Header / Status */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                    <CheckCircle size={16} /> Draft Generated Successfully
                </div>
                <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Review Term Sheet</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>Review the generated terms before sending to the counterparty.</p>
            </div>

            {/* Main Document View */}
            <Card padding="40px" style={{ marginBottom: '32px', minHeight: '600px' }}>
                <div style={{ paddingBottom: '32px', borderBottom: '2px solid var(--color-primary-900)', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Term Sheet</h2>
                        <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Ref: TSF-2025-001</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>FinBridge Platform</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Generated: Oct 25, 2025</div>
                    </div>
                </div>

                {/* Mock Terms Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
                    <div>
                        <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Principal Amount</h4>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>$800,000.00</div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Interest Rate</h4>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>6.5% <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-text-secondary)' }}>Fixed / Annum</span></div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Amortization</h4>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>30 Years</div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Estimated Monthly Payment</h4>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>$5,056.54</div>
                    </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '16px' }}>Conditions Precedent</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--color-text-main)', lineHeight: '1.6', fontSize: '14px' }}>
                        <li>Execution of definitive loan documents satisfactory to Lender.</li>
                        <li>Receipt of satisfactory appraisal of the Collateral Property.</li>
                        <li>Borrower to provide proof of insurance coverage naming Lender as efficient loss payee.</li>
                        <li>KYC/AML clearance for all beneficial owners {'>'} 25%.</li>
                    </ul>
                </div>
            </Card>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', paddingBottom: '64px' }}>
                <Button onClick={() => navigate('/contract-view')} size="lg">Approve & Generate Contract</Button>
                <Button variant="secondary" size="lg"><Download size={18} style={{ marginRight: '8px' }} /> Download PDF</Button>
            </div>

        </div>
    );
};
export default TermSheet;
