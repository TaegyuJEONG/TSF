import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, User } from 'lucide-react';
import '../../index.css';

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  // Helper to format title based on route
  const getPageTitle = (pathname: string) => {
    switch(pathname) {
      case '/': return 'Dashboard';
      case '/new-request': return 'New Financing Request';
      case '/term-sheet': return 'Term Sheet';
      case '/contracts': return 'Contracts';
      case '/contract-view': return 'Contract Review';
      default: return 'Dashboard';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--color-surface-white)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 500 }}>{getPageTitle(location.pathname)}</h2>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Acme Corp Ltd.</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                 <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
