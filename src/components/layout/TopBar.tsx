import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Building2 } from 'lucide-react';
import Button from '../ui/Button';
import { useWallet } from '../../hooks/useWallet';

const TopBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { disconnect, isConnected, address } = useWallet();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => {
        if (path === '/marketplace' && (location.pathname === '/marketplace' || location.pathname === '/investor-marketplace')) return true;
        if (path === '/dashboard' && location.pathname !== '/marketplace' && location.pathname !== '/investor-marketplace') return true;
        return false;
    };

    const handleProfileClick = () => {
        if (location.pathname.includes('investor')) {
            setDropdownOpen(!dropdownOpen);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        setDropdownOpen(false);
        navigate('/investor/connect-wallet');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        onClick={handleProfileClick}
                    >
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                            {location.pathname.includes('investor')
                                ? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet')
                                : 'Michael Johnson'}
                        </span>
                        {location.pathname.includes('investor') ? (
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', // Dark Indigo (Trust/Asset)
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid white', boxShadow: '0 0 0 1px #e5e7eb'
                            }}>
                                <Building2 size={16} color="#e0e7ff" />
                            </div>
                        ) : (
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                                alt="Buyer Profile"
                                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                            />
                        )}
                    </div>
                    {dropdownOpen && location.pathname.includes('investor') && (
                        <div style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            width: '200px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb',
                            padding: '8px',
                            zIndex: 1000
                        }}>
                            <div style={{ padding: '8px 12px', fontSize: '13px', color: '#6b7280', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                                Wallet Settings
                            </div>
                            <div
                                onClick={handleDisconnect}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '14px',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <LogOut size={16} />
                                Disconnect Wallet
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
