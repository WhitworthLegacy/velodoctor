/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // VeloDoctor Brand Colors
        primary: {
          DEFAULT: "#00ACC2",  // Moonstone
          dark: "#009bb0",
          light: "#33bdcf",
        },
        accent: {
          DEFAULT: "#FF6D00",  // Pumpkin (CTA)
          dark: "#e66200",
          light: "#ff8833",
        },
        dark: {
          DEFAULT: "#293133",  // Gunmetal
          lighter: "#3d4547",
        },
        muted: {
          DEFAULT: "#6b7280",  // Gray-500
          light: "#9ca3af",    // Gray-400
        },
        border: {
          DEFAULT: "#e5e7eb",  // Gray-200
          dark: "#d1d5db",     // Gray-300
        },
        background: {
          DEFAULT: "#ffffff",
          light: "#f9fafb",    // Gray-50
          lighter: "#F4F6F8",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1', fontWeight: '800' }],      // 64px
        'display-sm': ['3rem', { lineHeight: '1.1', fontWeight: '800' }], // 48px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};