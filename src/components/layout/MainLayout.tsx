import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../../index.css';

const MainLayout: React.FC = () => {


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: 'var(--color-surface-gray)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
