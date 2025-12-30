import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/dashboard/ProfileCard';

const BuyerProfile: React.FC = () => {
    const navigate = useNavigate();

    // Mock Buyer Profile Data 
    // Mock Buyer Profile Data 
    const profileData = {
        name: "Chris R.",
        employment: "Stable (12 years, full-time)",
        income: "$20,000/mo",
        dti: "25%",
        creditGrade: "A (760 equivalent)",
        downPayment: "$360,000 (30%)",
        pti: "28%",
        riskGrade: "Tier A",
        evaluationDate: "29-Dec-2025"
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 0' }}>
            <div className="container">

                {/* Profile Card */}
                {/* Profile Card */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <ProfileCard data={profileData} />

                    {/* Footer Buttons */}
                    <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
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
            </div>
        </div>
    );
};

export default BuyerProfile;
