import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    containerStyle?: React.CSSProperties;
}

export const Input: React.FC<InputProps> = ({ label, helperText, style, containerStyle, ...props }) => {
    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px', ...containerStyle }}>
            {label && <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary-800)' }}>{label}</label>}
            <input
                style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    width: '100%',
                    boxSizing: 'border-box',
                    ...style
                }}
                {...props}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary-600)';
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    props.onBlur?.(e);
                }}
            />
            {helperText && <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{helperText}</span>}
        </div>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, style, ...props }) => {
    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary-800)' }}>{label}</label>}
            <select
                style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    ...style
                }}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};
