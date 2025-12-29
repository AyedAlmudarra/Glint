import { forwardRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

/**
 * Select Component - مكون القائمة المنسدلة
 * 
 * @example
 * <Select
 *   label="المستوى التعليمي"
 *   options={[
 *     { value: 'high-school', label: 'ثانوي' },
 *     { value: 'bachelor', label: 'بكالوريوس' },
 *   ]}
 *   value={level}
 *   onChange={setLevel}
 * />
 */

const Select = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  onBlur,
  placeholder = 'اختر...',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const selectId = id || name || label?.toLowerCase().replace(/\s/g, '-');
  
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const baseStyles = `
    w-full
    appearance-none
    bg-[var(--color-surface-1)]
    border-2
    rounded-lg
    px-4 py-3
    pr-4 pl-10
    text-[var(--color-text-primary)]
    transition-all duration-200
    focus:outline-none
    cursor-pointer
  `;
  
  const stateStyles = error
    ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.3)]'
    : 'border-[var(--color-border-default)] hover:border-[var(--color-border-light)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-glow)]';
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const placeholderStyles = !value ? 'text-[var(--color-text-muted)]' : '';
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
        >
          {label}
          {required && <span className="text-[var(--color-error)] mr-1">*</span>}
        </label>
      )}
      
      {/* Select Container */}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={`
            ${baseStyles}
            ${stateStyles}
            ${disabledStyles}
            ${placeholderStyles}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
          <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${isFocused ? 'transform rotate-180' : ''}`} />
        </div>
      </div>
      
      {/* Helper/Error Text */}
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

