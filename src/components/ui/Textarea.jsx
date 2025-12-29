import { forwardRef, useState } from 'react';

/**
 * Textarea Component - مكون مربع النص
 * 
 * @example
 * <Textarea
 *   label="الوصف"
 *   placeholder="اكتب وصفاً..."
 *   rows={4}
 *   maxLength={500}
 *   showCount
 * />
 */

const Textarea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  resize = 'vertical', // 'none' | 'vertical' | 'horizontal' | 'both'
  className = '',
  textareaClassName = '',
  id,
  name,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaId = id || name || label?.toLowerCase().replace(/\s/g, '-');
  const charCount = value?.length || 0;
  
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };
  
  const baseStyles = `
    w-full
    bg-[var(--color-surface-1)]
    border-2
    rounded-lg
    px-4 py-3
    text-[var(--color-text-primary)]
    placeholder:text-[var(--color-text-muted)]
    transition-all duration-200
    focus:outline-none
    min-h-[120px]
  `;
  
  const stateStyles = error
    ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.3)]'
    : 'border-[var(--color-border-default)] hover:border-[var(--color-border-light)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-glow)]';
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
        >
          {label}
          {required && <span className="text-[var(--color-error)] mr-1">*</span>}
        </label>
      )}
      
      {/* Textarea */}
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`
          ${baseStyles}
          ${stateStyles}
          ${disabledStyles}
          ${resizeStyles[resize]}
          ${textareaClassName}
        `}
        {...props}
      />
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-1.5">
        {/* Helper/Error Text */}
        <p className={`text-sm ${error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`}>
          {error || helperText || '\u00A0'}
        </p>
        
        {/* Character Count */}
        {showCount && maxLength && (
          <span className={`text-sm ${charCount >= maxLength ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;

