// OLD
// /** @type {import('tailwindcss').Config} */
// export default {
// 	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [
// 		require('tailwindcss-animated')
// 	],
// }


const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
      extend: {
        margin: {
          '100': '26rem',  // 400px
          '120': '30rem',  // 480px
          '140': '35rem',  // 560px
        }
    }
  },
  plugins: [
    require("tailwindcss-animated"),
  ],
});

