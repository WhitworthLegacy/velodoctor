import Link from 'next/link';

/**
 * Button Component - VeloDoctor Design System
 *
 * Variants:
 * - primary: Pumpkin (accent) background, white text (for CTAs)
 * - secondary: Moonstone (primary) outline, primary text
 * - ghost: Transparent with dark text
 *
 * Sizes:
 * - sm: Small padding
 * - md: Default medium padding
 * - lg: Large padding with bigger text
 */

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variants = {
    primary: 'bg-accent hover:bg-accent-dark text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-accent',
    secondary: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'bg-transparent text-dark hover:bg-gray-100 focus:ring-gray-300',
  };

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button className={buttonClasses} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
