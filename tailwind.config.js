import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
    extend: {
        colors: {
            escom: {
                DEFAULT: '#00853f', // The official Green
                dark: '#006430',
                light: '#4ade80',
            },
        },
    },
},

    plugins: [forms],
};
