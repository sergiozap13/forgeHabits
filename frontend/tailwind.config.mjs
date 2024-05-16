const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  options: {
    safelist: [
      'bg-red-200', 'bg-red-500',
      'bg-blue-200', 'bg-blue-500',
      'bg-green-200', 'bg-green-500'
    ]
  },
  theme: {
      screens: {
        // xd personalizado
        'xs': '480px',

        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '768px',
        // => @media (min-width: 768px) { ... }

        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
      extend: {
        margin: {
          '100': '26rem',  // 400px
          '120': '30rem',  // 480px
          '140': '35rem',  // 560px
        }, 
        colors: {
          blue: {
            500: '#7da2d4',  // Azul pastel
            600: '#6591c8'   // Azul pastel un poco más oscuro
          },
          red: {
            500: '#f28b82',  // Rojo pastel
            600: '#e57373'   // Rojo pastel un poco más oscuro
          },
          lime: {
            500: '#bef264',  // Lima pastel
            600: '#aee255'   // Lima pastel un poco más oscuro
          },
          gray: {
            500: '#cbd5e1',  // Gris pastel
            600: '#b4c2d0'   // Gris pastel un poco más oscuro
          },
          yellow: {
            500: '#fff475',  // Amarillo pastel
            600: '#fff166'   // Amarillo pastel un poco más oscuro
          },
          green: {
            500: '#a6d3a0',  // Verde pastel
            600: '#8cc294'   // Verde pastel un poco más oscuro
          },
          indigo: {
            500: '#9fa8da',  // Índigo pastel
            600: '#7986cb'   // Índigo pastel un poco más oscuro
          },
          purple: {
            500: '#b39ddb',  // Púrpura pastel
            600: '#9575cd'   // Púrpura pastel un poco más oscuro
          }
        },
        backgroundImage: {
          'grid-lines': 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        },
        backgroundSize: {
          'grid-lines': '24px 24px',
        },
        keyframes: {
          'fade-right': {
            '0%': { opacity: 0, transform: 'translateX(-20px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          'fade-left': {
            '0%': { opacity: 0, transform: 'translateX(20px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' },
          },
        },
        animation: {
          'fade-right': 'fade-right 1s ease-in-out',  // Ajuste de duración a 1 segundo
          'fade-left': 'fade-left 1s ease-in-out',    // Ajuste de duración a 1 segundo
        },
        
    }
  },
  plugins: [
    require("tailwindcss-animated"),
  ],
});

