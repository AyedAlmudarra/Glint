/**
 * Skeleton Loading Component - مكون التحميل الهيكلي
 * 
 * @example
 * <Skeleton className="w-full h-8" />
 * <SkeletonCard />
 * <SkeletonAvatar size="lg" />
 */

// Base Skeleton
const Skeleton = ({ className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    text: 'rounded-md h-4',
  };
  
  return (
    <div
      className={`
        bg-gradient-to-l from-[var(--color-surface-1)] via-[var(--color-surface-2)] to-[var(--color-surface-1)]
        bg-[length:200%_100%]
        animate-[skeleton-loading_1.5s_ease-in-out_infinite]
        ${variants[variant]}
        ${className}
      `}
      {...props}
    />
  );
};

// Skeleton Text (multiple lines)
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

// Skeleton Avatar
export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };
  
  return (
    <Skeleton
      variant="circular"
      className={`${sizes[size]} ${className}`}
    />
  );
};

// Skeleton Button
export const SkeletonButton = ({ size = 'md', fullWidth = false, className = '' }) => {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };
  
  return (
    <Skeleton
      className={`${sizes[size]} ${fullWidth ? 'w-full' : ''} rounded-lg ${className}`}
    />
  );
};

// Skeleton Card
export const SkeletonCard = ({ className = '' }) => (
  <div
    className={`
      bg-[var(--color-surface-1)]
      border border-[var(--color-border-default)]
      rounded-2xl p-6
      ${className}
    `}
  >
    <div className="flex items-center gap-4 mb-4">
      <SkeletonAvatar />
      <div className="flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex gap-2 mt-4">
      <SkeletonButton size="sm" />
      <SkeletonButton size="sm" />
    </div>
  </div>
);

// Skeleton Simulation Card
export const SkeletonSimulationCard = ({ className = '' }) => (
  <div
    className={`
      bg-[var(--color-surface-1)]
      border border-[var(--color-border-default)]
      rounded-2xl p-6
      ${className}
    `}
  >
    <div className="flex items-start gap-4">
      <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
    <div className="mt-4">
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  </div>
);

// Skeleton Dashboard Stats
export const SkeletonDashboardStats = ({ className = '' }) => (
  <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-[var(--color-surface-1)] border border-[var(--color-border-default)] rounded-xl p-4"
      >
        <Skeleton className="w-10 h-10 rounded-lg mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

// Skeleton Progress Card
export const SkeletonProgressCard = ({ className = '' }) => (
  <div
    className={`
      bg-[var(--color-surface-1)]
      border border-[var(--color-border-default)]
      rounded-2xl p-6
      ${className}
    `}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton variant="circular" className="w-16 h-16" />
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

// Skeleton Chat Message
export const SkeletonChatMessage = ({ isUser = false, className = '' }) => (
  <div
    className={`
      flex gap-3 ${isUser ? 'flex-row-reverse' : ''}
      ${className}
    `}
  >
    <SkeletonAvatar size="sm" />
    <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : ''}`}>
      <Skeleton className={`h-24 rounded-2xl ${isUser ? 'bg-[var(--color-primary)]/20' : ''}`} />
    </div>
  </div>
);

// Skeleton Table Row
export const SkeletonTableRow = ({ columns = 4, className = '' }) => (
  <div className={`flex items-center gap-4 p-4 ${className}`}>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === 0 ? 'w-8' : 'flex-1'}`}
      />
    ))}
  </div>
);

// Skeleton List
export const SkeletonList = ({ items = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-1)]">
        <SkeletonAvatar size="sm" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton Task Card
export const SkeletonTaskCard = ({ className = '' }) => (
  <div
    className={`
      bg-[var(--color-surface-1)]
      border border-[var(--color-border-default)]
      rounded-2xl p-6
      ${className}
    `}
  >
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-4 mb-6">
      <Skeleton className="h-32 rounded-xl" />
      <SkeletonText lines={2} />
    </div>
    <div className="flex justify-end gap-3">
      <SkeletonButton size="md" />
      <SkeletonButton size="md" />
    </div>
  </div>
);

export default Skeleton;

