import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

export const Input = ({
  label,
  id,
  containerStyle = {},
  labelStyle = {},
  ...inputProps
}: InputProps) => {
  return (
    <div style={{ marginBottom: '15px', ...containerStyle }}>
      <label 
        htmlFor={id} 
        style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: '500',
          ...labelStyle 
        }}
      >
        {label}:
      </label>
      <input
        id={id}
        style={{ 
          width: '100%', 
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px',
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        {...inputProps}
      />
    </div>
  );
};

export default Input;
