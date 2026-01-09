import Container from './Container';

/**
 * Section Component - VeloDoctor Design System
 *
 * Provides consistent vertical spacing for page sections.
 * Desktop: py-16, Mobile: py-12
 */

export default function Section({
  children,
  className = '',
  containerSize = 'default',
  spacing = 'default',
  background = 'white',
}) {
  // Spacing variants
  const spacings = {
    sm: 'py-8 md:py-12',       // Smaller sections
    default: 'py-12 md:py-16', // Standard sections
    lg: 'py-16 md:py-24',      // Hero sections
    none: '',                   // No padding
  };

  // Background variants
  const backgrounds = {
    white: 'bg-white',
    light: 'bg-background-light',
    lighter: 'bg-background-lighter',
    dark: 'bg-dark text-white',
    primary: 'bg-primary text-white',
  };

  return (
    <section className={`${spacings[spacing]} ${backgrounds[background]} ${className}`}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
