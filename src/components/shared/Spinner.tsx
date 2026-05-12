import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md';
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'sm', label }) => (
  <span className={`spinner spinner--${size}`} aria-label={label ?? 'Carregando'} role="status" />
);

export default Spinner;
