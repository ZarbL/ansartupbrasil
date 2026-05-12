import React, { ReactNode } from 'react';
import './FormField.css';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}) => (
  <div className="form-field">
    <label htmlFor={htmlFor} className="form-field__label">
      {label}
      {required && <span className="form-field__required" aria-hidden="true"> *</span>}
    </label>
    {children}
    {error && (
      <span className="form-field__error" role="alert">
        {error}
      </span>
    )}
    {hint && !error && (
      <span className="form-field__hint">{hint}</span>
    )}
  </div>
);

export default FormField;
