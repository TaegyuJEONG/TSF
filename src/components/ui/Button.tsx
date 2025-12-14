import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    style,
    ...props
}) => {
    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: 'none',
        borderRadius: 'var(--border-radius-sm)',
        width: fullWidth ? '100%' : 'auto',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary-900)',
            color: 'white',
            border: '1px solid var(--color-primary-900)'
        },
        secondary: {
            backgroundColor: 'var(--color-surface-gray)',
            color: 'var(--color-primary-900)',
            border: '1px solid var(--color-border)'
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--color-primary-900)',
            border: '1px solid var(--color-border)'
        },
        danger: {
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            border: '1px solid #fecaca'
        }
    };

    const sizes = {
        sm: { padding: '6px 12px', fontSize: '13px' },
        md: { padding: '10px 20px', fontSize: '14px' },
        lg: { padding: '14px 24px', fontSize: '16px' }
    };

    return (
        <button
            style={{
                ...baseStyle,
                ...variants[variant],
                ...sizes[size],
                opacity: props.disabled ? 0.6 : 1,
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                ...style
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
