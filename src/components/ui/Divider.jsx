/**
 * Divider Component - مكون الفاصل
 * 
 * @example
 * <Divider />
 * <Divider label="أو" />
 * <Divider orientation="vertical" />
 */

const Divider = ({
  orientation = 'horizontal',
  label,
  className = '',
  color = 'default',
  spacing = 'md',
  ...props
}) => {
  const colors = {
    default: 'bg-[var(--color-border-default)]',
    light: 'bg-[var(--color-border-light)]',
    primary: 'bg-[var(--color-primary)]',
  };
  
  const spacings = {
    none: '',
    sm: orientation === 'horizontal' ? 'my-3' : 'mx-3',
    md: orientation === 'horizontal' ? 'my-6' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-8' : 'mx-6',
  };
  
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px h-full ${colors[color]} ${spacings[spacing]} ${className}`}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }
  
  if (label) {
    return (
      <div
        className={`flex items-center ${spacings[spacing]} ${className}`}
        role="separator"
        {...props}
      >
        <div className={`flex-1 h-px ${colors[color]}`} />
        <span className="px-4 text-sm text-[var(--color-text-muted)]">{label}</span>
        <div className={`flex-1 h-px ${colors[color]}`} />
      </div>
    );
  }
  
  return (
    <div
      className={`h-px w-full ${colors[color]} ${spacings[spacing]} ${className}`}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    />
  );
};

export default Divider;

