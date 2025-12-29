import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Card Component - مكون البطاقة
 * 
 * Variants: default, glass, career
 * 
 * @example
 * <Card>محتوى البطاقة</Card>
 * <Card variant="glass" isHoverable>بطاقة زجاجية</Card>
 * <Card variant="career" careerType="software">مسار البرمجة</Card>
 */

const variants = {
  default: 'bg-[var(--color-surface-1)] border border-[var(--color-border-default)]',
  glass: 'bg-[rgba(30,41,59,0.6)] backdrop-blur-xl border border-white/10',
  elevated: 'bg-[var(--color-surface-1)] border border-[var(--color-border-default)] shadow-lg',
  outline: 'bg-transparent border-2 border-[var(--color-border-default)]',
};

const careerColors = {
  software: {
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  finance: {
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  hr: {
    gradient: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  marketing: {
    gradient: 'from-amber-500 to-amber-700',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
};

const paddings = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  careerType,
  isHoverable = false,
  isClickable = false,
  isSelected = false,
  className = '',
  onClick,
  header,
  footer,
  ...props
}, ref) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';
  const variantStyles = variant === 'career' ? '' : variants[variant];
  const paddingStyles = paddings[padding];
  
  const hoverStyles = isHoverable || isClickable
    ? 'hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-light)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5'
    : '';
  
  const clickableStyles = isClickable ? 'cursor-pointer' : '';
  const selectedStyles = isSelected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg-primary)]' : '';
  
  const careerConfig = careerType ? careerColors[careerType] : null;
  const careerStyles = careerConfig 
    ? `${careerConfig.bg} ${careerConfig.border} border relative overflow-hidden`
    : '';
  
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles}
    ${careerStyles}
    ${paddingStyles}
    ${hoverStyles}
    ${clickableStyles}
    ${selectedStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const motionProps = isHoverable || isClickable
    ? {
        whileHover: { y: -2 },
        whileTap: { y: 0, scale: 0.99 },
        transition: { duration: 0.15 },
      }
    : {};
  
  return (
    <motion.div
      ref={ref}
      className={combinedClassName}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {/* Career accent bar */}
      {careerType && careerConfig && (
        <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${careerConfig.gradient}`} />
      )}
      
      {/* Header */}
      {header && (
        <div className="border-b border-[var(--color-border-default)] pb-4 mb-4">
          {header}
        </div>
      )}
      
      {/* Content */}
      {children}
      
      {/* Footer */}
      {footer && (
        <div className="border-t border-[var(--color-border-default)] pt-4 mt-4">
          {footer}
        </div>
      )}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Card Header subcomponent
export const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={`flex items-center justify-between mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card Title subcomponent
export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component 
    className={`text-xl font-semibold text-[var(--color-text-primary)] ${className}`}
    {...props}
  >
    {children}
  </Component>
);

// Card Description subcomponent
export const CardDescription = ({ children, className = '', ...props }) => (
  <p 
    className={`text-[var(--color-text-secondary)] text-sm mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

// Card Content subcomponent
export const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// Card Footer subcomponent
export const CardFooter = ({ children, className = '', ...props }) => (
  <div 
    className={`flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-border-default)] ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;

