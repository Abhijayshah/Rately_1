import React from 'react';
import { AlertCircle } from 'lucide-react';

const Select = React.forwardRef((
  {
    label,
    error,
    options = [],
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) => {
  const selectClasses = `
    form-select
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
        <select
          ref={ref}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
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

Select.displayName = 'Select';

export default Select;