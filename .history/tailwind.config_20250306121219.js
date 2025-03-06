/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'pi-red': '#FF6B6B',
        'pi-teal': '#4ECDC4',
        'pi-dark': '#121212',
        'pi-darker': '#0A0A0A',
        'pi-light-blue': '#8a9caa',
      },
    },
  },
  plugins: [],
}
