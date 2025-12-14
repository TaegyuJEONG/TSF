import React from 'react';

type StatusType = 'active' | 'pending' | 'completed' | 'rejected' | 'draft';

interface StatusBadgeProps {
    status: StatusType | string;
}

const resolveStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    switch (normalized) {
        case 'active':
        case 'completed':
        case 'approved':
            return { bg: '#dcfce7', color: '#166534' }; // Green
        case 'pending':
        case 'review':
            return { bg: '#fef3c7', color: '#92400e' }; // Amber
        case 'rejected':
            return { bg: '#fee2e2', color: '#991b1b' }; // Red
        case 'draft':
        default:
            return { bg: '#f1f5f9', color: '#475569' }; // Gray
    }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = resolveStatusColor(status);

    return (
        <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'capitalize',
            backgroundColor: styles.bg,
            color: styles.color
        }}>
            {status}
        </span>
    );
};

export default StatusBadge;
