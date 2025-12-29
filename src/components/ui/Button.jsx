import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Button Component - مكون الزر
 * 
 * Variants: primary, secondary, ghost, success, danger, outline
 * Sizes: sm, md, lg, xl
 * 
 * @example
 * <Button variant="primary" size="lg">ابدأ الآن</Button>
 * <Button variant="ghost" icon={<Icon />}>إعدادات</Button>
 * <Button variant="outline" isLoading>جاري الحفظ...</Button>
 */

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-glow-primary)]',
  secondary: 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-3)] hover:border-[var(--color-border-light)]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-1)] hover:text-[var(--color-text-primary)]',
  success: 'bg-[var(--color-success)] text-white hover:bg-[var(--color-success-dark)] hover:shadow-[var(--shadow-glow-success)]',
  danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-dark)] hover:shadow-[var(--shadow-glow-error)]',
  outline: 'bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
};

const sizes = {
  sm: 'text-sm py-2 px-4 gap-1.5',
  md: 'text-base py-3 px-6 gap-2',
  lg: 'text-lg py-4 px-8 gap-2.5',
  xl: 'text-xl py-5 px-10 gap-3 rounded-xl',
};

const iconSizes = {
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
  xl: 'p-5',
};

const Spinner = ({ className = '' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  isLoading = false,
  isDisabled = false,
  isFullWidth = false,
  isPill = false,
  isIconOnly = false,
  className = '',
  onClick,
  type = 'button',
  as: Component = 'button',
  href,
  ...props
}, ref) => {
  const isLink = Component === 'a' || href;
  const Element = isLink ? motion.a : motion.button;
  
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold
    rounded-lg
    border-0
    cursor-pointer
    transition-all duration-200 ease-in-out
    focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;
  
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = isIconOnly ? iconSizes[size] : sizes[size];
  const widthStyles = isFullWidth ? 'w-full' : '';
  const pillStyles = isPill ? 'rounded-full' : '';
  
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles}
    ${sizeStyles}
    ${widthStyles}
    ${pillStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const motionProps = {
    whileHover: isDisabled || isLoading ? {} : { y: -1, scale: 1.02 },
    whileTap: isDisabled || isLoading ? {} : { y: 0, scale: 0.98 },
    transition: { duration: 0.15 },
  };
  
  const content = (
    <>
      {isLoading && (
        <Spinner className="shrink-0" />
      )}
      
      {!isLoading && icon && iconPosition === 'start' && (
        <span className="shrink-0">{icon}</span>
      )}
      
      {!isIconOnly && children && (
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      )}
      
      {isIconOnly && !isLoading && icon}
      
      {!isLoading && icon && iconPosition === 'end' && !isIconOnly && (
        <span className="shrink-0">{icon}</span>
      )}
    </>
  );
  
  return (
    <Element
      ref={ref}
      type={!isLink ? type : undefined}
      href={isLink ? href : undefined}
      className={combinedClassName}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {content}
    </Element>
  );
});

Button.displayName = 'Button';

export default Button;

// Named exports for specific variants
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;

