import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Button from '../ui/Button';

const TopBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/marketplace' && (location.pathname === '/marketplace' || location.pathname === '/investor-marketplace')) return true;
        if (path === '/dashboard' && location.pathname !== '/marketplace' && location.pathname !== '/investor-marketplace') return true;
        return false;
    };

    return (
        <div style={{
            height: '70px',
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div
                    style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    TSF
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 500 }}>
                    {location.pathname !== '/investor-marketplace' && (
                        <span
                            style={{ cursor: 'pointer', color: '#6b7280' }}
                            onClick={() => navigate('/owner-onboarding')}
                        >
                            Sell My Home
                        </span>
                    )}
                    <span
                        style={{
                            cursor: 'pointer',
                            color: isActive('/dashboard') ? '#111827' : '#6b7280',
                            fontWeight: isActive('/dashboard') ? 600 : 500
                        }}
                        onClick={() => navigate('/listed-home')} // Linking to the new Seller Dashboard page
                    >
                        Dashboard
                    </span>
                    <span
                        style={{
                            cursor: 'pointer',
                            color: isActive('/marketplace') ? '#111827' : '#6b7280',
                            fontWeight: isActive('/marketplace') ? 600 : 500
                        }}
                        onClick={() => navigate('/marketplace')}
                    >
                        Marketplace
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Button
                    style={{ height: '36px', fontSize: '14px', backgroundColor: '#1e1b4b', padding: '0 20px' }}
                    onClick={() => navigate(location.pathname === '/investor-marketplace' ? '/marketplace' : '/investor-marketplace')}
                >
                    {location.pathname === '/investor-marketplace' ? 'For Home Owner/Buyer →' : 'For Investment →'}
                </Button>
                <Bell size={20} color="#374151" />
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>MJ</div>
            </div>
        </div>
    );
};

export default TopBar;
