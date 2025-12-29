import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

/**
 * Toast/Notification System - نظام الإشعارات
 * 
 * @example
 * // Wrap your app with ToastProvider
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * 
 * // Use the hook anywhere
 * const { showToast } = useToast();
 * showToast({ type: 'success', title: 'تم الحفظ بنجاح' });
 */

// Toast Context
const ToastContext = createContext(null);

// Toast variants
const toastVariants = {
  success: {
    icon: FiCheck,
    borderColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: FiX,
    borderColor: 'border-l-red-500',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
  },
  warning: {
    icon: FiAlertTriangle,
    borderColor: 'border-l-amber-500',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
  info: {
    icon: FiInfo,
    borderColor: 'border-l-blue-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
};

// Individual Toast Component
const Toast = ({ toast, onDismiss }) => {
  const variant = toastVariants[toast.type] || toastVariants.info;
  const Icon = variant.icon;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={`
        flex items-start gap-3 p-4
        bg-[var(--color-surface-1)]
        border border-[var(--color-border-default)]
        border-l-4 ${variant.borderColor}
        rounded-xl
        shadow-xl
        max-w-sm w-full
        pointer-events-auto
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 w-8 h-8 rounded-full ${variant.iconBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${variant.iconColor}`} />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-[var(--color-text-primary)] font-medium text-sm">
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        aria-label="إغلاق"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 left-4 z-[var(--z-toast)] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);
  
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  const showToast = useCallback(({
    type = 'info',
    title,
    description,
    duration = 5000,
    action,
  }) => {
    const id = Date.now().toString();
    
    const newToast = {
      id,
      type,
      title,
      description,
      action,
    };
    
    setToasts((prev) => {
      // Keep only the last maxToasts - 1 toasts
      const updated = prev.slice(-(maxToasts - 1));
      return [...updated, newToast];
    });
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    
    return id;
  }, [maxToasts, dismissToast]);
  
  const value = {
    toasts,
    showToast,
    dismissToast,
    // Convenience methods
    success: (title, description) => showToast({ type: 'success', title, description }),
    error: (title, description) => showToast({ type: 'error', title, description }),
    warning: (title, description) => showToast({ type: 'warning', title, description }),
    info: (title, description) => showToast({ type: 'info', title, description }),
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default Toast;

