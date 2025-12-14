import React from 'react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { RECENT_ACTIVITY } from '../mock-data/dashboard'; // Reusing mock data for now

const ContractsList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px' }}>My Contracts</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="outline" size="sm"><Filter size={16} style={{ marginRight: '6px' }} /> Filter</Button>
                    <Button onClick={() => navigate('/new-request')}>+ New Contract</Button>
                </div>
            </div>

            <Card padding="0">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-surface-gray)', textAlign: 'left' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Contract ID</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Asset Type</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Total Value</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Created</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px' }}>Status</th>
                            <th style={{ padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Doubling the data to look fuller */}
                        {[...RECENT_ACTIVITY, ...RECENT_ACTIVITY].map((item, idx) => (
                            <tr key={`${item.id}-${idx}`} style={{ borderTop: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => navigate('/contract-view')}>
                                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{item.id}-{idx}</td>
                                <td style={{ padding: '16px 24px' }}>{item.type}</td>
                                <td style={{ padding: '16px 24px' }}>{item.amount}</td>
                                <td style={{ padding: '16px 24px', color: 'var(--color-text-secondary)' }}>{item.date}</td>
                                <td style={{ padding: '16px 24px' }}><StatusBadge status={item.status} /></td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                Showing 10 of 12 contracts
            </div>
        </div>
    );
};
export default ContractsList;
