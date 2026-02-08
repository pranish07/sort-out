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
                surface: {
                    DEFAULT: '#FAFAF9', // Warm, modern off-white
                    50: '#FFFFFF',
                    100: '#F5F5F4',
                    200: '#E7E5E4',
                },
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
                    100: '#F8F5F1', // Softened
                    200: '#F2ECE4', // Softened
                    300: '#E9E0D4',
                    400: '#D7C3A3',
                    500: '#CDB48C',
                },
                teal: {
                    DEFAULT: '#14B8A6',
                    50: '#E6F7F6',
                    100: '#CCEFEA',
                    200: '#99DFD6',
                    300: '#66CFC2',
                    400: '#33BFAD',
                    500: '#14B8A6',
                    600: '#0D9488', // Darker teal for pressed states
                    700: '#0F766E', // Even darker
                    800: '#115E59',
                    900: '#134E4A',
                },
                navy: {
                    DEFAULT: '#0F172A', // Deeper navy
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
                play: {
                    DEFAULT: '#A855F7',
                    50: '#FAF5FF',
                    100: '#F3E8FF',
                    200: '#E9D5FF',
                    300: '#D8B4FE',
                    400: '#C084FC',
                    500: '#A855F7',
                    600: '#9333EA',
                    700: '#7E22CE',
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
