import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

/**
 * Alert Component - مكون التنبيه
 * 
 * @example
 * <Alert variant="success" title="تم بنجاح">تم حفظ التغييرات</Alert>
 * <Alert variant="error" dismissible onDismiss={() => {}}>حدث خطأ</Alert>
 */

const variants = {
  success: {
    icon: FiCheckCircle,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-300',
  },
  error: {
    icon: FiAlertCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    iconColor: 'text-red-400',
    titleColor: 'text-red-300',
  },
  warning: {
    icon: FiAlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-300',
  },
  info: {
    icon: FiInfo,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
};

const Alert = ({
  variant = 'info',
  title,
  children,
  icon: CustomIcon,
  dismissible = false,
  onDismiss,
  action,
  className = '',
  ...props
}) => {
  const config = variants[variant];
  const Icon = CustomIcon || config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        flex items-start gap-3 p-4
        ${config.bg}
        border ${config.border}
        rounded-xl
        ${className}
      `}
      role="alert"
      {...props}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold ${config.titleColor} mb-1`}>
            {title}
          </h4>
        )}
        {children && (
          <div className="text-sm text-[var(--color-text-secondary)]">
            {children}
          </div>
        )}
        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>
      
      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={onDismiss}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label="إغلاق"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

// Alert with auto-dismiss
export const AutoDismissAlert = ({
  duration = 5000,
  onDismiss,
  ...props
}) => {
  return (
    <AnimatePresence>
      <Alert
        dismissible
        onDismiss={onDismiss}
        {...props}
      />
    </AnimatePresence>
  );
};

export default Alert;

