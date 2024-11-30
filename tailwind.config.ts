import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' }
        }
      },
      animation: {
        'fall-full': 'fall linear forwards'
      }
    },
  },
  plugins: [],
  
};

export default config;
