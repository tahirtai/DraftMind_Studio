import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#f97316', // Orange-500
                secondary: '#3b82f6', // Blue-500
                background: {
                    dark: 'var(--bg-dark)', // Was #111827
                    light: '#f3f4f6',
                },
                surface: {
                    dark: 'var(--surface-dark)', // Was #1f2937
                    light: '#ffffff',
                },
                text: {
                    primary: 'var(--text-primary)', // Was #f9fafb
                    secondary: 'var(--text-secondary)', // Was #9ca3af
                },
                border: {
                    dark: 'var(--border-dark)', // Was #374151
                    light: '#e5e7eb',
                },
                sidebar: {
                    dark: 'var(--sidebar-bg)', // Was #111827
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
