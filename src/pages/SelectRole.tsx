import React, { useState } from 'react';

import { ChevronLeft, Home, Key, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SelectRole: React.FC = () => {
    const navigate = useNavigate();
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    const roles = [
        {
            id: 'buyer',
            title: 'Buyer',
            description: 'I’m looking for a home to buy',
            icon: <Home size={32} />
        },
        {
            id: 'owner',
            title: 'Owner',
            description: 'I want to sell my home',
            icon: <Key size={32} />
        },
        {
            id: 'investor',
            title: 'Investor',
            description: 'I want to invest in a tokenized Mortgage-backed security',
            icon: <TrendingUp size={32} />
        }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-gray)', padding: '24px', display: 'flex', flexDirection: 'column' }}>

            {/* Top Navigation */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', marginBottom: '64px' }}>
                <button
                    onClick={() => navigate('/create-profile')}
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
                    <ChevronLeft size={18} /> Back to list
                </button>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '48px', fontSize: '24px', fontWeight: 600 }}>Select your primary role</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => navigate(role.id === 'buyer' ? '/buying-power' : (role.id === 'owner' ? '/owner-onboarding' : '/investor/connect-wallet'))}
                            onMouseEnter={() => setHoveredRole(role.id)}
                            onMouseLeave={() => setHoveredRole(null)}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--border-radius-md)',
                                border: hoveredRole === role.id ? '2px solid var(--color-primary-900)' : '1px solid var(--color-border)',
                                padding: '48px 24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '320px',
                                boxShadow: hoveredRole === role.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                transform: hoveredRole === role.id ? 'translateY(-2px)' : 'none'
                            }}
                        >
                            <div style={{
                                marginBottom: '24px',
                                color: hoveredRole === role.id ? 'var(--color-primary-900)' : 'var(--color-text-secondary)',
                                transition: 'color 0.2s'
                            }}>
                                {role.icon}
                            </div>
                            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--color-text-main)' }}>{role.title}</h2>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.5', maxWidth: '200px' }}>
                                {role.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SelectRole;
