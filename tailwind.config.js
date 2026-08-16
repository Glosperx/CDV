/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scanează HTML-ul și JS-ul: main.js și dark.js adaugă clase dinamic
  // (text-primary-blue, font-bold, text-gray-700, clasele butonului de temă).
  content: ['./index.html', './404.html', './pagini/*.html', './js/*.js'],

  darkMode: 'class',

  theme: {
    // Păstrează limita de 1200px pe care o avea CSS-ul inline din index.html
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        // Paleta e cu un pas mai închisă decât varianta din CDN, ca textul alb
        // pe fundal albastru să treacă WCAG AA (înainte: 3.68:1, sub pragul 4.5:1).
        'primary-blue': '#2563eb', // 5.17:1 cu alb
        'light-blue': '#3b82f6', // doar accente și hover
        'dark-blue': '#1d4ed8', // 6.70:1 cu alb
        'blue-custom': '#1e40af', // 8.72:1 pe alb - titluri H2
      },
    },
  },

  plugins: [],
}
