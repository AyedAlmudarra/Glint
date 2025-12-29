import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Tooltip Component - مكون التلميح
 * 
 * @example
 * <Tooltip content="هذا تلميح">
 *   <button>مرر هنا</button>
 * </Tooltip>
 */

const positions = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-surface-1)] border-l-transparent border-r-transparent border-b-transparent',
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-surface-1)] border-l-transparent border-r-transparent border-t-transparent',
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-surface-1)] border-t-transparent border-b-transparent border-r-transparent',
    initial: { opacity: 0, x: 4 },
    animate: { opacity: 1, x: 0 },
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-surface-1)] border-t-transparent border-b-transparent border-l-transparent',
    initial: { opacity: 0, x: -4 },
    animate: { opacity: 1, x: 0 },
  },
};

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const posConfig = positions[position];
  
  const showTooltip = () => {
    if (disabled || !content) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  if (!content) {
    return children;
  }
  
  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      {...props}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute z-[var(--z-tooltip)]
              ${posConfig.tooltip}
            `}
            initial={posConfig.initial}
            animate={posConfig.animate}
            exit={posConfig.initial}
            transition={{ duration: 0.15 }}
          >
            {/* Tooltip Content */}
            <div
              className="
                px-3 py-2
                bg-[var(--color-surface-1)]
                border border-[var(--color-border-default)]
                rounded-lg
                shadow-lg
                text-sm text-[var(--color-text-primary)]
                whitespace-nowrap
                max-w-xs
              "
              role="tooltip"
            >
              {content}
            </div>
            
            {/* Arrow */}
            <div
              className={`
                absolute w-0 h-0
                border-[6px]
                ${posConfig.arrow}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Info Tooltip (with info icon)
export const InfoTooltip = ({ content, ...props }) => (
  <Tooltip content={content} {...props}>
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] text-xs cursor-help">
      ?
    </span>
  </Tooltip>
);

export default Tooltip;

