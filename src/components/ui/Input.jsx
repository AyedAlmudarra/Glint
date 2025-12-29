import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * Input Component - مكون حقل الإدخال
 * 
 * @example
 * <Input label="البريد الإلكتروني" placeholder="أدخل بريدك" />
 * <Input type="password" label="كلمة المرور" />
 * <Input icon={<UserIcon />} error="هذا الحقل مطلوب" />
 */

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  icon,
  iconPosition = 'start',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  id,
  name,
  autoComplete,
  maxLength,
  min,
  max,
  pattern,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  const inputId = id || name || label?.toLowerCase().replace(/\s/g, '-');
  
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const baseInputStyles = `
    w-full
    bg-[var(--color-surface-1)]
    border-2
    rounded-lg
    px-4 py-3
    text-[var(--color-text-primary)]
    placeholder:text-[var(--color-text-muted)]
    transition-all duration-200
    focus:outline-none
  `;
  
  const stateStyles = error
    ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.3)]'
    : 'border-[var(--color-border-default)] hover:border-[var(--color-border-light)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-glow)]';
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const iconPadding = icon 
    ? iconPosition === 'start' ? 'pr-10' : 'pl-10'
    : '';
  
  const passwordPadding = isPassword ? 'pl-10' : '';
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
        >
          {label}
          {required && <span className="text-[var(--color-error)] mr-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Start Icon */}
        {icon && iconPosition === 'start' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          min={min}
          max={max}
          pattern={pattern}
          className={`
            ${baseInputStyles}
            ${stateStyles}
            ${disabledStyles}
            ${iconPadding}
            ${passwordPadding}
            ${inputClassName}
          `}
          {...props}
        />
        
        {/* End Icon */}
        {icon && iconPosition === 'end' && !isPassword && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
            tabIndex={-1}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        )}
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

Input.displayName = 'Input';

export default Input;

