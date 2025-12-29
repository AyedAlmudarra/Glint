import { motion } from 'framer-motion';
import Button from './Button';

/**
 * EmptyState Component - مكون الحالة الفارغة
 * 
 * Used when there's no data to display
 * 
 * @example
 * <EmptyState
 *   icon={<FolderIcon />}
 *   title="لا توجد محاكاة"
 *   description="ابدأ رحلتك المهنية باختيار محاكاة"
 *   action={{ label: "استكشف المحاكاة", onClick: () => {} }}
 * />
 */

const illustrations = {
  noData: (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="56" fill="var(--color-surface-2)" />
      <circle cx="64" cy="64" r="40" fill="var(--color-surface-1)" />
      <path
        d="M48 60h32M48 68h24"
        stroke="var(--color-text-muted)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="64" cy="48" r="8" fill="var(--color-primary)" opacity="0.5" />
    </svg>
  ),
  noSimulations: (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="24" y="32" width="80" height="64" rx="8" fill="var(--color-surface-2)" />
      <rect x="32" y="40" width="64" height="8" rx="2" fill="var(--color-surface-1)" />
      <rect x="32" y="56" width="48" height="8" rx="2" fill="var(--color-surface-1)" />
      <rect x="32" y="72" width="32" height="8" rx="2" fill="var(--color-surface-1)" />
      <circle cx="96" cy="80" r="20" fill="var(--color-primary)" opacity="0.2" />
      <path
        d="M90 80l4 4 8-8"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  noSkills: (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64 24l12 24 26 4-18 18 4 26-24-12-24 12 4-26-18-18 26-4z"
        fill="var(--color-surface-2)"
        stroke="var(--color-text-muted)"
        strokeWidth="2"
      />
      <circle cx="64" cy="64" r="16" fill="var(--color-surface-1)" />
      <path
        d="M58 64h12M64 58v12"
        stroke="var(--color-text-muted)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  noAchievements: (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="52" r="32" fill="var(--color-surface-2)" />
      <circle cx="64" cy="52" r="20" fill="var(--color-surface-1)" />
      <rect x="52" y="84" width="24" height="24" rx="2" fill="var(--color-surface-2)" />
      <path
        d="M64 44v16M56 52h16"
        stroke="var(--color-text-muted)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  noChat: (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 40h64c4.4 0 8 3.6 8 8v32c0 4.4-3.6 8-8 8H56l-16 16v-16h-8c-4.4 0-8-3.6-8-8V48c0-4.4 3.6-8 8-8z"
        fill="var(--color-surface-2)"
      />
      <circle cx="48" cy="64" r="4" fill="var(--color-text-muted)" />
      <circle cx="64" cy="64" r="4" fill="var(--color-text-muted)" />
      <circle cx="80" cy="64" r="4" fill="var(--color-text-muted)" />
    </svg>
  ),
  error: (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="48" fill="var(--color-error-bg)" />
      <circle cx="64" cy="64" r="32" fill="var(--color-surface-1)" />
      <path
        d="M56 56l16 16M72 56l-16 16"
        stroke="var(--color-error)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  ),
  search: (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="56" cy="56" r="32" fill="var(--color-surface-2)" />
      <circle cx="56" cy="56" r="20" fill="var(--color-surface-1)" />
      <path
        d="M80 80l20 20"
        stroke="var(--color-text-muted)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M48 56h16"
        stroke="var(--color-text-muted)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const EmptyState = ({
  icon,
  illustration = 'noData',
  title,
  description,
  action,
  secondaryAction,
  className = '',
  size = 'md',
}) => {
  const sizes = {
    sm: {
      container: 'py-8',
      illustration: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      illustration: 'w-32 h-32',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      container: 'py-16',
      illustration: 'w-40 h-40',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };
  
  const sizeConfig = sizes[size];
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center ${sizeConfig.container} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Illustration or Icon */}
      <motion.div
        className={`mb-6 ${sizeConfig.illustration}`}
        variants={itemVariants}
      >
        {icon || (
          <div className="text-[var(--color-text-muted)]">
            {illustrations[illustration] || illustrations.noData}
          </div>
        )}
      </motion.div>
      
      {/* Title */}
      {title && (
        <motion.h3
          className={`font-semibold text-[var(--color-text-primary)] mb-2 ${sizeConfig.title}`}
          variants={itemVariants}
        >
          {title}
        </motion.h3>
      )}
      
      {/* Description */}
      {description && (
        <motion.p
          className={`text-[var(--color-text-secondary)] max-w-md mb-6 ${sizeConfig.description}`}
          variants={itemVariants}
        >
          {description}
        </motion.p>
      )}
      
      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          className="flex items-center gap-3"
          variants={itemVariants}
        >
          {action && (
            <Button
              variant="primary"
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
              icon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Preset Empty States
export const NoSimulationsEmpty = ({ onExplore }) => (
  <EmptyState
    illustration="noSimulations"
    title="لم تبدأ أي محاكاة بعد"
    description="استكشف المسارات المهنية المتاحة وابدأ رحلتك نحو المستقبل"
    action={{
      label: "استكشف المحاكاة",
      onClick: onExplore,
    }}
  />
);

export const NoSkillsEmpty = ({ onStart }) => (
  <EmptyState
    illustration="noSkills"
    title="لم تكتسب أي مهارات بعد"
    description="أكمل المهام في المحاكاة لاكتساب مهارات جديدة"
    action={{
      label: "ابدأ التعلم",
      onClick: onStart,
    }}
  />
);

export const NoAchievementsEmpty = () => (
  <EmptyState
    illustration="noAchievements"
    title="لا توجد إنجازات حتى الآن"
    description="أكمل المحاكاة واكتسب المهارات لفتح الإنجازات"
  />
);

export const NoChatEmpty = () => (
  <EmptyState
    illustration="noChat"
    title="مرحباً! أنا سَند"
    description="مساعدك الذكي في منصة جلينت. اسألني أي سؤال عن المهن والمسارات وأنا هنا لدعمك!"
    size="lg"
  />
);

export const SearchEmpty = ({ query, onClear }) => (
  <EmptyState
    illustration="search"
    title="لا توجد نتائج"
    description={`لم نجد نتائج تطابق "${query}"`}
    action={{
      label: "مسح البحث",
      onClick: onClear,
    }}
  />
);

export const ErrorEmpty = ({ onRetry }) => (
  <EmptyState
    illustration="error"
    title="حدث خطأ"
    description="لم نتمكن من تحميل البيانات. يرجى المحاولة مرة أخرى."
    action={{
      label: "إعادة المحاولة",
      onClick: onRetry,
    }}
  />
);

export default EmptyState;

