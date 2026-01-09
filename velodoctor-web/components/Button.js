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
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles - HIGH CONTRAST
  const variants = {
    primary: 'bg-vdAccent hover:brightness-95 text-white shadow-vd-sm hover:shadow-vd-md focus:ring-vdAccent',
    secondary: 'bg-transparent border-2 border-vdPrimary text-vdPrimary hover:bg-vdPrimary hover:text-white focus:ring-vdPrimary',
    ghost: 'bg-transparent text-vdDark hover:bg-vdSurface focus:ring-vdPrimary',
  };

  // Size styles
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg',
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
