import React from 'react';

import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input = ({ label, id, ...inputProps }: InputProps) => {
  return (
    <div className="container">
      <label htmlFor={id} className="label">
        {label}:
      </label>
      <input id={id} className="input" {...inputProps} />
    </div>
  );
};
