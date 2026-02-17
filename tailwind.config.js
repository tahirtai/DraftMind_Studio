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
                    dark: '#111827', // Gray-900
                    light: '#f3f4f6', // Gray-100
                },
                surface: {
                    dark: '#1f2937', // Gray-800
                    light: '#ffffff',
                },
                text: {
                    primary: '#f9fafb', // Gray-50
                    secondary: '#9ca3af', // Gray-400
                },
                border: {
                    dark: '#374151', // Gray-700
                    light: '#e5e7eb', // Gray-200
                },
                sidebar: {
                    dark: '#111827', // Gray-900 (same as background for now, or darker)
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
