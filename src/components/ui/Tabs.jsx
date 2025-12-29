import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Tabs Component - مكون التبويبات
 * 
 * @example
 * <Tabs
 *   tabs={[
 *     { id: 'overview', label: 'نظرة عامة', content: <Overview /> },
 *     { id: 'tasks', label: 'المهام', content: <Tasks /> },
 *   ]}
 *   defaultTab="overview"
 * />
 */

const Tabs = ({
  tabs = [],
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  const activeTab = controlledActiveTab ?? internalActiveTab;
  
  const handleTabChange = (tabId) => {
    setInternalActiveTab(tabId);
    onChange?.(tabId);
  };
  
  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  
  const variantStyles = {
    default: {
      list: 'bg-[var(--color-surface-1)] p-1 rounded-xl',
      tab: 'px-4 py-2 rounded-lg',
      activeTab: 'bg-[var(--color-primary)] text-white',
      inactiveTab: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]',
    },
    underline: {
      list: 'border-b border-[var(--color-border-default)]',
      tab: 'px-4 py-3 border-b-2 -mb-px',
      activeTab: 'border-[var(--color-primary)] text-[var(--color-primary)]',
      inactiveTab: 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-light)]',
    },
    pills: {
      list: 'gap-2',
      tab: 'px-4 py-2 rounded-full',
      activeTab: 'bg-[var(--color-primary)] text-white',
      inactiveTab: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-1)]',
    },
  };
  
  const styles = variantStyles[variant];
  
  return (
    <div className={className} {...props}>
      {/* Tab List */}
      <div
        className={`flex ${fullWidth ? '' : 'inline-flex'} ${styles.list}`}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                relative flex items-center justify-center gap-2
                font-medium text-sm
                transition-all duration-200
                ${fullWidth ? 'flex-1' : ''}
                ${styles.tab}
                ${isActive ? styles.activeTab : styles.inactiveTab}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold bg-[var(--color-primary)] text-white rounded-full">
                  {tab.badge}
                </span>
              )}
              
              {/* Active Indicator for underline variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Tab Panel */}
      {activeTabData && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabData.id}`}
          aria-labelledby={`tab-${activeTabData.id}`}
          className="mt-4"
        >
          <motion.div
            key={activeTabData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTabData.content}
          </motion.div>
        </div>
      )}
    </div>
  );
};

// TabList for custom layouts
export const TabList = ({
  children,
  variant = 'default',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[var(--color-surface-1)] p-1 rounded-xl',
    underline: 'border-b border-[var(--color-border-default)]',
    pills: 'gap-2',
  };
  
  return (
    <div
      className={`flex ${fullWidth ? '' : 'inline-flex'} ${variantStyles[variant]} ${className}`}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

// Tab trigger for custom layouts
export const TabTrigger = ({
  children,
  isActive,
  onClick,
  disabled,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: {
      base: 'px-4 py-2 rounded-lg',
      active: 'bg-[var(--color-primary)] text-white',
      inactive: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]',
    },
    underline: {
      base: 'px-4 py-3 border-b-2 -mb-px',
      active: 'border-[var(--color-primary)] text-[var(--color-primary)]',
      inactive: 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
    },
    pills: {
      base: 'px-4 py-2 rounded-full',
      active: 'bg-[var(--color-primary)] text-white',
      inactive: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-1)]',
    },
  };
  
  const styles = variantStyles[variant];
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-medium text-sm
        transition-all duration-200
        ${styles.base}
        ${isActive ? styles.active : styles.inactive}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Tab content for custom layouts
export const TabContent = ({
  children,
  isActive,
  className = '',
  ...props
}) => {
  if (!isActive) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Tabs;

