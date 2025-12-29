import { forwardRef } from 'react';

/**
 * Badge Component - مكون الشارة
 * 
 * Variants: primary, success, warning, error, neutral, info
 * Sizes: sm, md, lg
 * 
 * @example
 * <Badge variant="success">مكتمل</Badge>
 * <Badge variant="primary" icon={<StarIcon />}>مهارة جديدة</Badge>
 * <Badge variant="warning" dot>قيد التنفيذ</Badge>
 */

const variants = {
  primary: 'bg-[var(--color-primary-glow)] text-blue-300 border-blue-500/30',
  success: 'bg-[var(--color-success-bg)] text-emerald-300 border-emerald-500/30',
  warning: 'bg-[var(--color-warning-bg)] text-amber-300 border-amber-500/30',
  error: 'bg-[var(--color-error-bg)] text-red-300 border-red-500/30',
  info: 'bg-[var(--color-info-bg)] text-cyan-300 border-cyan-500/30',
  neutral: 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border-default)]',
};

const dotColors = {
  primary: 'bg-blue-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  info: 'bg-cyan-400',
  neutral: 'bg-gray-400',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

const Badge = forwardRef(({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border whitespace-nowrap';
  const variantStyles = variants[variant] || variants.neutral;
  const sizeStyles = sizes[size] || sizes.md;
  
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles}
    ${sizeStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <span ref={ref} className={combinedClassName} {...props}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      
      {icon && (
        <span className="shrink-0 w-4 h-4">{icon}</span>
      )}
      
      {children}
      
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="إزالة"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

// Skill Badge variant
export const SkillBadge = ({ skill, level, ...props }) => (
  <Badge 
    variant="primary" 
    className="bg-gradient-to-l from-blue-500/20 to-blue-600/20"
    {...props}
  >
    {skill}
    {level && (
      <span className="mr-1 text-blue-200">({level})</span>
    )}
  </Badge>
);

// Status Badge variant
export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    completed: { variant: 'success', text: 'مكتمل', dot: true },
    'in-progress': { variant: 'warning', text: 'قيد التنفيذ', dot: true },
    pending: { variant: 'neutral', text: 'لم يبدأ', dot: true },
    locked: { variant: 'neutral', text: 'مقفل', dot: false },
    error: { variant: 'error', text: 'خطأ', dot: true },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} dot={config.dot} {...props}>
      {config.text}
    </Badge>
  );
};

// Career Badge variant
export const CareerBadge = ({ career, ...props }) => {
  const careerConfig = {
    software: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', name: 'هندسة البرمجيات' },
    finance: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', name: 'التحليل المالي' },
    hr: { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', name: 'الموارد البشرية' },
    marketing: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', name: 'التسويق الرقمي' },
  };
  
  const config = careerConfig[career] || careerConfig.software;
  
  return (
    <Badge className={config.color} {...props}>
      {config.name}
    </Badge>
  );
};

// Notification Badge (for counts)
export const NotificationBadge = ({ count, max = 99, className = '', ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  if (count <= 0) return null;
  
  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[1.25rem] h-5
        px-1.5 text-xs font-bold
        bg-[var(--color-error)] text-white
        rounded-full
        ${className}
      `}
      {...props}
    >
      {displayCount}
    </span>
  );
};

export default Badge;

