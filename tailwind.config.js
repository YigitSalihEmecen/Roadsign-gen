/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          cream: '#FAF7F2',
          lavender: '#F3EFFA',
          mint: '#EAF7F1',
          peach: '#FDF1EC',
          sky: '#EDF5FC',
          butter: '#FEF9E7',
          accent: '#7C83FD',
          coral: '#FF8B7B',
          sage: '#4BB38A',
          lilac: '#B085F5',
          ink: '#1E2430',
          muted: '#647084',
          border: '#E6E2EE'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        highway: ['HighwayGothic', 'Overpass', 'sans-serif'],
        highwayWide: ['HighwayGothicWide', 'Overpass', 'sans-serif'],
        highwayCond: ['HighwayGothicCond', 'Overpass', 'sans-serif'],
        highwayExp: ['HighwayGothicExp', 'Overpass', 'sans-serif'],
        din: ['DIN1451', 'Public Sans', 'sans-serif'],
        dinCond: ['DIN1451Cond', 'Public Sans', 'sans-serif'],
        jp: ['Noto Sans JP', 'HighwayGothic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
