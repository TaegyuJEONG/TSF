import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Settings, Briefcase } from 'lucide-react';

const Sidebar: React.FC = () => {
    const linkStyle = ({ isActive }: { isActive: boolean }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        color: isActive ? 'var(--color-surface-white)' : 'var(--color-text-muted)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        borderRadius: 'var(--border-radius-md)',
        marginBottom: '4px',
        transition: 'background-color 0.2s'
    });

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--color-primary-900)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--color-primary-800)'
        }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h1 style={{ color: 'white', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={20} />
                    <span>FinBridge</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '4px' }}>Seller Financing Platform</p>
            </div>

            <nav style={{ padding: '24px 16px', flex: 1 }}>
                <div style={{ marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Menu
                </div>

                <NavLink to="/" style={linkStyle}>
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>
                <NavLink to="/new-request" style={linkStyle}>
                    <PlusCircle size={18} />
                    New Request
                </NavLink>
                <NavLink to="/contracts" style={linkStyle}>
                    <FileText size={18} />
                    My Contracts
                </NavLink>

                <div style={{ marginTop: '32px', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    System
                </div>
                <NavLink to="/settings" style={linkStyle}>
                    <Settings size={18} />
                    Settings
                </NavLink>
            </nav>

            <div style={{ padding: '24px', fontSize: '12px', color: 'var(--color-text-muted)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                v1.0.0 Demo Build
            </div>
        </aside>
    );
};

export default Sidebar;
