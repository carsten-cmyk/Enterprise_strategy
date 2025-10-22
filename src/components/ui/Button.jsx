export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  className = '',
  disabled = false,
  type = 'button'
}) {
  const baseClasses = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
    secondary: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-900 focus:ring-cyan-400',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };

  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
