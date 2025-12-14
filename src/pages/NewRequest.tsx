import React from 'react';
import Card from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

const NewRequest: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', maxWidth: '1100px' }}>

            {/* Form Section */}
            <Card>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px' }}>Deal Basics</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Enter the primary details of the asset and financing terms.
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); navigate('/term-sheet'); }}>
                    <Select
                        label="Deal Type"
                        options={[
                            { value: 're', label: 'Real Estate' },
                            { value: 'biz', label: 'Small Business Acquisition' },
                            { value: 'equip', label: 'Equipment Financing' },
                            { value: 'other', label: 'Other Assets' }
                        ]}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Input label="Purchase Price ($)" placeholder="1,000,000" />
                        <Input label="Down Payment ($)" placeholder="200,000" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Input label="Proposed Interest Rate (%)" placeholder="5.5" />
                        <Select
                            label="Amortization Period"
                            options={[
                                { value: '10', label: '10 Years' },
                                { value: '20', label: '20 Years' },
                                { value: '30', label: '30 Years' },
                                { value: 'interest_only', label: 'Interest Only' }
                            ]}
                        />
                    </div>

                    <div style={{ marginTop: '24px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px' }}>Counterparty</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Input label="Borrower Name / Entity" placeholder="Enter legal entity name" />
                        <Input label="Structure" placeholder="LLC" />
                    </div>
                    <Input label="Borrower Email" type="email" placeholder="contact@borrower.com" helperText="We will send them an invite to review terms." />

                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                        <Button type="submit" size="lg">Generate Term Sheet</Button>
                        <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/')}>Cancel</Button>
                    </div>
                </form>
            </Card>

            {/* Helper Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ backgroundColor: '#eff6ff', borderRadius: 'var(--border-radius-md)', padding: '24px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af', marginBottom: '12px' }}>
                        <Info size={18} /> Default Terms
                    </h4>
                    <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#1e3a8a' }}>
                        Based on current market conditions for <strong>Real Estate</strong> assets, we recommend an interest rate between <strong>6.0% - 8.5%</strong>.
                    </p>
                </div>

                <Card padding="20px" style={{ backgroundColor: 'var(--color-surface-gray)' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Projections Preview</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Monthly Payment</span>
                        <span style={{ fontWeight: 600 }}>~$5,503.24</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Total Interest</span>
                        <span style={{ fontWeight: 600 }}>~$324,500</span>
                    </div>
                </Card>
            </div>

        </div>
    );
};
export default NewRequest;
