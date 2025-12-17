import React from 'react';
import { CheckCircle, Briefcase, DollarSign, PieChart, Shield, Calendar, Percent } from 'lucide-react';

interface BuyerProfileData {
    name: string;
    employment: string;
    income: string;
    dti: string;
    creditGrade: string;
    downPayment: string;
    pti: string;
    riskGrade: string;
    evaluationDate: string;
}

interface BuyerProfileCardProps {
    data: BuyerProfileData;
}

const BuyerProfileCard: React.FC<BuyerProfileCardProps> = ({ data }) => {

    const LabelValue = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>
                <Icon size={14} /> {label}
            </div>
            <div style={{ color: '#111827', fontWeight: 600, fontSize: '14px', paddingLeft: '20px' }}>
                {value}
            </div>
        </div>
    );

    return (
        <div style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            {/* Header Section */}
            <div style={{ padding: '32px', textAlign: 'center', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 16px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <div style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#10b981', borderRadius: '50%', padding: '4px', border: '2px solid white' }}>
                        <CheckCircle size={16} color="white" />
                    </div>
                </div>

                <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{data.name}</h1>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                    <Shield size={12} /> Verified Buyer
                </div>
            </div>

            {/* Data Grid */}
            <div style={{ padding: '32px' }}>

                {/* Risk Grade Highlight */}
                <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Risk Grade</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#b45309' }}>{data.riskGrade}</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={20} color="#d97706" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 16px' }}>
                    <LabelValue label="Monthly Income" value={data.income} icon={DollarSign} />
                    <LabelValue label="Employment" value="Stable (3 yrs)" icon={Briefcase} />
                    <LabelValue label="Credit Score" value={data.creditGrade} icon={Shield} />
                    <LabelValue label="Down Payment" value={data.downPayment} icon={PieChart} />
                    <LabelValue label="DTI Ratio" value={data.dti} icon={Percent} />
                    <LabelValue label="Evaluation Date" value={data.evaluationDate} icon={Calendar} />
                </div>
            </div>
        </div>
    );
};

export default BuyerProfileCard;
