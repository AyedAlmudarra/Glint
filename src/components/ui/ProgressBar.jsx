import { motion } from 'framer-motion';

/**
 * ProgressBar Component - مكون شريط التقدم
 * 
 * @example
 * <ProgressBar value={65} />
 * <ProgressBar value={100} variant="success" showLabel />
 * <ProgressBar value={30} animated />
 */

const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  labelPosition = 'right',
  animated = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: 'bg-[var(--color-primary)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]',
    info: 'bg-[var(--color-info)]',
  };
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };
  
  const gradientVariants = {
    primary: 'from-blue-500 to-blue-400',
    success: 'from-emerald-500 to-emerald-400',
    warning: 'from-amber-500 to-amber-400',
    error: 'from-red-500 to-red-400',
    info: 'from-cyan-500 to-cyan-400',
  };
  
  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Label - Top */}
      {showLabel && labelPosition === 'top' && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--color-text-secondary)]">التقدم</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        {/* Progress Track */}
        <div
          className={`
            flex-1 rounded-full overflow-hidden
            bg-[var(--color-surface-2)]
            ${sizes[size]}
          `}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {/* Progress Fill */}
          <motion.div
            className={`
              h-full rounded-full
              ${animated 
                ? `bg-gradient-to-l ${gradientVariants[variant]} bg-[length:200%_100%]`
                : variants[variant]
              }
            `}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={animated ? {
              animation: 'progress-shine 2s linear infinite',
            } : undefined}
          />
        </div>
        
        {/* Label - Right */}
        {showLabel && labelPosition === 'right' && (
          <span className="text-sm font-medium text-[var(--color-text-primary)] min-w-[3ch] text-left">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
};

// Progress Steps variant
export const ProgressSteps = ({
  steps = [],
  currentStep = 0,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm
                    transition-colors duration-300
                    ${isCompleted 
                      ? 'bg-[var(--color-success)] text-white' 
                      : isCurrent 
                        ? 'bg-[var(--color-primary)] text-white' 
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                    }
                  `}
                  initial={false}
                  animate={isCompleted ? { scale: [1, 1.1, 1] } : {}}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                
                {/* Step Label */}
                {step.label && (
                  <span className={`
                    mt-2 text-xs text-center max-w-[80px]
                    ${isCurrent ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-muted)]'}
                  `}>
                    {step.label}
                  </span>
                )}
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-[var(--color-surface-2)]">
                  <motion.div
                    className="h-full bg-[var(--color-success)]"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Circular Progress
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const colors = {
    primary: 'stroke-[var(--color-primary)]',
    success: 'stroke-[var(--color-success)]',
    warning: 'stroke-[var(--color-warning)]',
    error: 'stroke-[var(--color-error)]',
    info: 'stroke-[var(--color-info)]',
  };
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} {...props}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-2)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={colors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

