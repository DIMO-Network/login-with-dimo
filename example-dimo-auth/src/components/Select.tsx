import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: Option[];
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

export const Select = ({
  label,
  id,
  options,
  containerStyle = {},
  labelStyle = {},
  ...selectProps
}: SelectProps) => {
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
      <select
        id={id}
        style={{ 
          width: '100%', 
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
