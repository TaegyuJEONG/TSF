
import React, { useState, useEffect, useRef } from 'react';
import { Input, Select } from '../ui/Input';
import Button from '../ui/Button';
import { User, X, Search } from 'lucide-react';

export interface Buyer {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface ContractData {
    // Buyer
    buyer?: Buyer | null;

    // A. Deal Basics
    price: string;
    downPaymentPercent: string;
    closingDate: string;

    // B. Financing Terms
    interestRate: string;
    term: string; // years
    termUnit: 'years' | 'months';
    paymentStructure: 'Fully Amortized' | 'Interest Only' | 'Balloon';
    balloonTerm: string;

    // C. Security
    securityInstrument: 'Deed of Trust' | 'Mortgage';
    lienPosition: '1st' | '2nd';

    // D. Risk
    gracePeriod: '10' | '15' | '30';
    prepaymentAllowed: 'Yes' | 'No';
    prepaymentPenalty: boolean;

    // F. Confirmed
    confirmed: boolean;
}

// Mock Buyers Data
const MOCK_BUYERS: Buyer[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Michael Brown', email: 'michael.b@example.com', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@realestate.com', avatar: 'https://i.pravatar.cc/150?u=4' },
];

interface ContractInputFormProps {
    data: ContractData;
    onChange: (data: ContractData) => void;
    onGenerate: () => void;
    calculated: {
        monthlyPayment: number;
        totalRepayment: number;
        contractFee: number;
    };
    onClose: () => void;
}

const ContractInputForm: React.FC<ContractInputFormProps> = ({ data, onChange, onGenerate, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChange = (field: keyof ContractData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleSelectBuyer = (buyer: Buyer) => {
        handleChange('buyer', buyer);
        setSearchTerm('');
        setShowSuggestions(false);
    };

    const handleRemoveBuyer = () => {
        handleChange('buyer', null);
    };

    // Close suggestions on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const filteredBuyers = MOCK_BUYERS.filter(buyer =>
        buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sectionStyle: React.CSSProperties = {
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e5e7eb'
    };

    const headerStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: 600,
        color: '#111827',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const rowStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '16px'
    };

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid #e5e7eb', position: 'relative' }}>

            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#9ca3af'
                }}
            >
                &times;
            </button>

            {/* Buyer Selection Section */}
            <div style={sectionStyle}>
                <div style={headerStyle}>Buyer Information</div>

                {data.buyer ? (
                    // Selected State
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                backgroundColor: '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {data.buyer.avatar ? (
                                    <img src={data.buyer.avatar} alt={data.buyer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={20} color="#9ca3af" />
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{data.buyer.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{data.buyer.email}</div>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveBuyer}
                            style={{
                                background: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                padding: '6px',
                                cursor: 'pointer',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Remove Buyer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    // Search Input State
                    <div style={{ position: 'relative' }} ref={wrapperRef}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search buyer by name or email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box' // Fix sizing issues
                                }}
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && searchTerm.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: '4px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                zIndex: 10,
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {filteredBuyers.length > 0 ? (
                                    filteredBuyers.map(buyer => (
                                        <div
                                            key={buyer.id}
                                            onClick={() => handleSelectBuyer(buyer)}
                                            style={{
                                                padding: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #f3f4f6',
                                                transition: 'background-color 0.1s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        >
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                backgroundColor: '#e5e7eb',
                                                flexShrink: 0
                                            }}>
                                                {buyer.avatar ? (
                                                    <img src={buyer.avatar} alt={buyer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <User size={16} color="#9ca3af" style={{ margin: '8px' }} />
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{buyer.name}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{buyer.email}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '12px', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
                                        No buyers found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Section A: Deal Basics */}
            <div style={sectionStyle}>
                <div style={headerStyle}>A. Deal Basics</div>
                <div style={rowStyle}>
                    <Input
                        label="Purchase Price ($)"
                        value={data.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                    />
                    <Input
                        label="Down Payment (%)"
                        value={data.downPaymentPercent}
                        onChange={(e) => handleChange('downPaymentPercent', e.target.value)}
                    />
                </div>
                <div style={rowStyle}>
                    <Input
                        label="Est. Closing Date"
                        type="date"
                        value={data.closingDate}
                        onChange={(e) => handleChange('closingDate', e.target.value)}
                    />
                </div>
            </div>

            {/* Section B: Financing Terms */}
            <div style={sectionStyle}>
                <div style={headerStyle}>B. Seller Financing Terms</div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Payment Structure</label>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {['Fully Amortized', 'Interest Only', 'Balloon'].map((opt) => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="paymentStructure"
                                    checked={data.paymentStructure === opt}
                                    onChange={() => handleChange('paymentStructure', opt)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={rowStyle}>
                    <Input
                        label="Interest Rate (%)"
                        value={data.interestRate}
                        onChange={(e) => handleChange('interestRate', e.target.value)}
                    />
                </div>

                <div style={rowStyle}>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <Input
                            label="Term"
                            value={data.term}
                            onChange={(e) => handleChange('term', e.target.value)}
                            containerStyle={{ flex: 1 }}
                        />
                        <Select
                            label="Unit"
                            value={data.termUnit}
                            onChange={(e) => handleChange('termUnit', e.target.value)}
                            options={[{ value: 'years', label: 'Years' }, { value: 'months', label: 'Months' }]}
                            style={{ width: '100px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Section C: Security Structure */}
            <div style={sectionStyle}>
                <div style={headerStyle}>C. Security Structure</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Security Instrument</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {['Deed of Trust', 'Mortgage'].map((opt) => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="securityInstrument"
                                        checked={data.securityInstrument === opt}
                                        onChange={() => handleChange('securityInstrument', opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Lien Position</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {['1st', '2nd'].map((opt) => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="lienPosition"
                                        checked={data.lienPosition === opt}
                                        onChange={() => handleChange('lienPosition', opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section D: Risk & Flexibility */}
            <div style={sectionStyle}>
                <div style={headerStyle}>D. Risk & Flexibility</div>
                <div style={rowStyle}>
                    <Select
                        label="Grace Period"
                        value={data.gracePeriod}
                        onChange={(e) => handleChange('gracePeriod', e.target.value)}
                        options={[
                            { value: '10', label: '10 Days' },
                            { value: '15', label: '15 Days' },
                            { value: '30', label: '30 Days' }
                        ]}
                    />
                    <Select
                        label="Prepayment Allowed"
                        value={data.prepaymentAllowed}
                        onChange={(e) => handleChange('prepaymentAllowed', e.target.value)}
                        options={[
                            { value: 'Yes', label: 'Yes' },
                            { value: 'No', label: 'No' }
                        ]}
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={data.prepaymentPenalty}
                            onChange={(e) => handleChange('prepaymentPenalty', e.target.checked)}
                        />
                        Prepayment Penalty
                    </label>
                </div>
            </div>

            {/* Confirmation */}
            <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                        type="checkbox"
                        id="confirm"
                        checked={data.confirmed}
                        onChange={(e) => handleChange('confirmed', e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'black' }}
                    />
                    <label htmlFor="confirm" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
                        I confirm the above terms to generate contracts.
                    </label>
                </div>
            </div>

            <Button
                onClick={onGenerate}
                disabled={!data.confirmed}
                fullWidth
                style={{ height: '52px', backgroundColor: '#000', color: 'white', fontSize: '16px', fontWeight: 600 }}
            >
                Generate Contract Documents
            </Button>

        </div>
    );
};

export default ContractInputForm;
