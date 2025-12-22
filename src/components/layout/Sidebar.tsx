import { NavLink, useLocation } from 'react-router-dom';
import { useUserRole } from '../../contexts/UserRoleContext';
import { LayoutDashboard, FileText, Calendar, CreditCard, PieChart, User, Briefcase, Building } from 'lucide-react';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { userRole } = useUserRole();
    const isInvestor = location.pathname.startsWith('/investor');
    // We prioritize the explicit path check, but fallback to state for generic pages
    const isBuyerPath = location.pathname.startsWith('/buyer');
    const isBuyer = isBuyerPath || userRole === 'buyer';

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
            {/* Logo removed to avoid duplication with TopBar */}


            <nav style={{ padding: '24px 16px', flex: 1 }}>
                {isInvestor ? (
                    <>
                        {/* Investor Navigation */}
                        <NavLink to="/investor/invested" style={linkStyle}>
                            <Briefcase size={18} />
                            Invested
                        </NavLink>
                        {/* Visit Requests excluded for Investor */}
                        <NavLink to="/investor/contract" style={linkStyle}>
                            <FileText size={18} />
                            Contract
                        </NavLink>
                        <NavLink to="/investor/payments" style={linkStyle}>
                            <CreditCard size={18} />
                            Payments
                        </NavLink>
                        <NavLink to="/investor/asset" style={linkStyle}>
                            <Building size={18} />
                            Asset
                        </NavLink>
                        <NavLink to="/profile" style={linkStyle}>
                            <User size={18} />
                            Profile
                        </NavLink>
                    </>
                ) : isBuyer ? (
                    <>
                        {/* Buyer Navigation */}
                        <NavLink to="/buyer/visit-requests" style={linkStyle}>
                            <Calendar size={18} />
                            Visit Requests
                        </NavLink>
                        <NavLink to="/buyer/contract" style={linkStyle}>
                            <FileText size={18} />
                            Contract
                        </NavLink>
                        <NavLink to="/buyer/payments" style={linkStyle}>
                            <CreditCard size={18} />
                            Payments
                        </NavLink>
                        <NavLink to="/buyer/asset" style={linkStyle}>
                            <Building size={18} />
                            In Progress Asset
                        </NavLink>
                        <NavLink to="/buyer/profile" style={linkStyle}>
                            <User size={18} />
                            Profile
                        </NavLink>
                    </>
                ) : (
                    <>
                        {/* Owner Navigation (Default) */}
                        <NavLink to="/listed-home" style={linkStyle}>
                            <LayoutDashboard size={18} />
                            Listed home
                        </NavLink>
                        <NavLink to="/visit-requests" style={linkStyle}>
                            <Calendar size={18} />
                            Visit requests
                        </NavLink>
                        <NavLink to="/contract" style={linkStyle}>
                            <FileText size={18} />
                            Contract
                        </NavLink>
                        <NavLink to="/payments" style={linkStyle}>
                            <CreditCard size={18} />
                            Payments
                        </NavLink>
                        <NavLink to="/note-overview" style={linkStyle}>
                            <PieChart size={18} />
                            Note Overview
                        </NavLink>
                        <NavLink to="/profile" style={linkStyle}>
                            <User size={18} />
                            Profile
                        </NavLink>
                    </>
                )
                }
            </nav >

            <div style={{ padding: '24px', fontSize: '12px', color: 'var(--color-text-muted)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                v1.0.0 Demo Build
            </div>
        </aside >
    );
};

export default Sidebar;
