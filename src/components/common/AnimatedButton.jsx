import React from 'react';

export const AnimatedButton = ({ 
  children, 
  icon, 
  variant = 'brand', 
  onClick, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  const variantClass = variant === 'emerald' 
    ? 'btn-emerald' 
    : variant === 'teal' 
    ? 'btn-teal' 
    : variant === 'blue' 
    ? 'btn-blue' 
    : variant === 'rose' 
    ? 'btn-rose' 
    : variant === 'dark' 
    ? 'btn-dark' 
    : 'btn-brand';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex items-center shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

export default AnimatedButton;
