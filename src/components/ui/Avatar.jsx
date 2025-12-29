import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Avatar Component - مكون الصورة الرمزية
 * 
 * @example
 * <Avatar src="/path/to/image.jpg" name="أحمد محمد" />
 * <Avatar name="سارة" size="lg" />
 * <AvatarGroup avatars={users} max={4} />
 */

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
  '3xl': 'w-24 h-24 text-3xl',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
  '2xl': 'w-4 h-4 border-2',
  '3xl': 'w-5 h-5 border-2',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
};

// Generate initials from name
const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Generate color from name
const getColorFromName = (name) => {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name?.length || 0; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({
  src,
  name,
  size = 'md',
  status,
  bordered = false,
  className = '',
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  
  const showFallback = !src || imageError;
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);
  
  const baseStyles = `
    relative inline-flex items-center justify-center
    rounded-full overflow-hidden
    font-semibold text-white
    shrink-0
    ${bordered ? 'ring-2 ring-[var(--color-border-default)]' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;
  
  return (
    <div
      className={`${baseStyles} ${sizes[size]} ${showFallback ? bgColor : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {/* Image */}
      {!showFallback && (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
      
      {/* Fallback Initials */}
      {showFallback && (
        <span className="select-none">{initials}</span>
      )}
      
      {/* Status Indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 left-0
            rounded-full
            border-[var(--color-surface-1)]
            ${statusSizes[size]}
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
};

// Avatar Group
export const AvatarGroup = ({
  avatars = [],
  max = 4,
  size = 'md',
  className = '',
  ...props
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;
  
  const overlapMargins = {
    xs: '-mr-1.5',
    sm: '-mr-2',
    md: '-mr-2.5',
    lg: '-mr-3',
    xl: '-mr-4',
    '2xl': '-mr-5',
    '3xl': '-mr-6',
  };
  
  return (
    <div className={`flex items-center ${className}`} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <motion.div
          key={avatar.id || index}
          className={`${index > 0 ? overlapMargins[size] : ''}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <Avatar
            src={avatar.src}
            name={avatar.name}
            size={size}
            bordered
          />
        </motion.div>
      ))}
      
      {/* Overflow Count */}
      {remainingCount > 0 && (
        <motion.div
          className={`${overlapMargins[size]}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: visibleAvatars.length * 0.05 }}
        >
          <div
            className={`
              inline-flex items-center justify-center
              rounded-full
              font-semibold text-[var(--color-text-secondary)]
              bg-[var(--color-surface-2)]
              ring-2 ring-[var(--color-surface-1)]
              ${sizes[size]}
            `}
          >
            <span className="text-[0.7em]">+{remainingCount}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Avatar with Badge
export const AvatarWithBadge = ({
  badge,
  badgePosition = 'top-right',
  ...props
}) => {
  const positions = {
    'top-right': 'top-0 left-0',
    'top-left': 'top-0 right-0',
    'bottom-right': 'bottom-0 left-0',
    'bottom-left': 'bottom-0 right-0',
  };
  
  return (
    <div className="relative inline-flex">
      <Avatar {...props} />
      {badge && (
        <span className={`absolute ${positions[badgePosition]} transform translate-x-1/4 -translate-y-1/4`}>
          {badge}
        </span>
      )}
    </div>
  );
};

export default Avatar;

