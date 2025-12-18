import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ChevronLeft, CheckCircle, Briefcase, DollarSign, PieChart, Shield, Calendar, Percent } from 'lucide-react';

const ProfileSummary: React.FC = () => {
    const navigate = useNavigate();

    // Mock Data matching the screenshot but structured for the new UI
    const profileData = {
        name: "Chris R.",
        employment: "Stable (3 years, full-time)",
        income: "$6,200/mo",
        dti: "38%",
        creditGrade: "B+ (660 equivalent)",
        downPayment: "$35,000 (12%)",
        pti: "28%",
        riskGrade: "Tier B",
        evaluationDate: "10-Dec-2025"
    };

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
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/buyer-preferences')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563', fontWeight: 500, cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
                >
                    <ChevronLeft size={18} /> Back to preferences
                </button>
            </div>

            {/* Profile Card */}
            <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
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

                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{profileData.name}</h1>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                        <Shield size={12} /> Verified Buyer
                    </div>
                </div>

                {/* Data Grid */}
                <div style={{ padding: '32px' }}>

                    {/* Risk Grade Highlight */}
                    <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Profile Grade</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#b45309' }}>{profileData.riskGrade}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={20} color="#d97706" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 16px' }}>
                        <LabelValue label="Monthly Income" value={profileData.income} icon={DollarSign} />
                        <LabelValue label="Employment" value="Stable (3 yrs)" icon={Briefcase} />
                        <LabelValue label="Credit Score" value={profileData.creditGrade} icon={Shield} />
                        <LabelValue label="Down Payment" value={profileData.downPayment} icon={PieChart} />
                        <LabelValue label="DTI Ratio" value={profileData.dti} icon={Percent} />
                        <LabelValue label="Evaluation Date" value={profileData.evaluationDate} icon={Calendar} />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ padding: '16px 32px 32px', display: 'grid', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/marketplace')}
                        style={{
                            width: '100%',
                            backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '8px',
                            padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        Confirm & Create Profile
                    </button>
                    <button
                        onClick={() => navigate('/buyer-preferences')}
                        style={{
                            width: '100%',
                            backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px',
                            padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}
                    >
                        Edit Information
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px', color: '#9ca3af', fontSize: '12px' }}>
                <p>Secured by Bank-Grade Encryption. Your data is never sold.</p>
            </div>
        </div>
    );
};

export default ProfileSummary;
