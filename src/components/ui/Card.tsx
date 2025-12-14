import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    padding?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', style = {}, padding = '24px' }) => {
    return (
        <div
            className={className}
            style={{
                backgroundColor: 'var(--color-surface-white)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                padding: padding,
                ...style
            }}
        >
            {children}
        </div>
    );
};

export default Card;
