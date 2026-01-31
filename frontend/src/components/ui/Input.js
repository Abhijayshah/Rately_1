import React from 'react';
import { AlertCircle } from 'lucide-react';

const Input = React.forwardRef((
  {
    label,
    error,
    type = 'text',
    placeholder,
    required = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) => {
  const inputClasses = `
    form-input
    ${error ? 'form-input-error' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-error-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="form-error">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;