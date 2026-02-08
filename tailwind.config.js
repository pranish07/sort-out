/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                blush: {
                    50: '#FFF5F4',
                    100: '#FFEBE9',
                    200: '#FFD6D2',
                    300: '#FFC2BC',
                    400: '#FFADA5',
                    500: '#FF998F',
                },
                sage: {
                    50: '#F4F8F4',
                    100: '#E9F1E9',
                    200: '#D4E4D4',
                    300: '#BFD7BF',
                    400: '#AACAAA',
                    500: '#95BD95',
                },
                beige: {
                    50: '#FDFCFB',
                    100: '#F5F0E8',
                    200: '#EBE1D1',
                    300: '#E1D2BA',
                    400: '#D7C3A3',
                    500: '#CDB48C',
                },
                teal: {
                    DEFAULT: '#14B8A6',
                    50: '#E6F7F5',
                    100: '#CCEFEB',
                    200: '#99DFD7',
                    300: '#66CFC3',
                    400: '#33BFAF',
                    500: '#14B8A6',
                    600: '#109688',
                    700: '#0C7169',
                    800: '#084C4A',
                    900: '#04262B',
                },
                navy: {
                    DEFAULT: '#1E293B',
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
            },
        },
    },
    plugins: [],
}
