import React from 'react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import { DASHBOARD_STATS, RECENT_ACTIVITY } from '../mock-data/dashboard';
import Button from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px' }}>

            {/* Top Action Area */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => navigate('/new-request')}>
                    + New Financing Request
                </Button>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {DASHBOARD_STATS.map((stat) => (
                    <Card key={stat.label} padding="20px">
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                            {stat.label}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-primary-900)' }}>
                            {stat.value}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Table */}
            <Card padding="0">
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Activity</h3>
                    <Button variant="outline" size="sm" onClick={() => navigate('/contracts')}>
                        View All <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                    </Button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-surface-gray)', textAlign: 'left' }}>
                            <th style={{ padding: '12px 24px', fontWeight: 500, color: 'var(--color-text-secondary)', fontSize: '12px' }}>ID</th>
                            <th style={{ padding: '12px 24px', fontWeight: 500, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Type</th>
                            <th style={{ padding: '12px 24px', fontWeight: 500, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Amount</th>
                            <th style={{ padding: '12px 24px', fontWeight: 500, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Date</th>
                            <th style={{ padding: '12px 24px', fontWeight: 500, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Status</th>
                            <th style={{ padding: '12px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_ACTIVITY.map((item) => (
                            <tr key={item.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{item.id}</td>
                                <td style={{ padding: '16px 24px' }}>{item.type}</td>
                                <td style={{ padding: '16px 24px' }}>{item.amount}</td>
                                <td style={{ padding: '16px 24px', color: 'var(--color-text-secondary)' }}>{item.date}</td>
                                <td style={{ padding: '16px 24px' }}><StatusBadge status={item.status} /></td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <Button variant="outline" size="sm" style={{ padding: '4px 8px' }}>Details</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
export default Dashboard;
