/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#070B12',
          900: '#0B0F19',
          850: '#111726',
          800: '#161F30',
          750: '#1E293B',
          700: '#334155',
        },
        trident: {
          eng: '#06B6D4',       // Electric Cyan / Blue (Engineering)
          engDark: '#0891B2',
          vet: '#F59E0B',       // Bio-Amber / Gold (Veterinary)
          vetDark: '#D97706',
          agro: '#10B981',      // Emerald / Bio-Green (Agricultural)
          agroDark: '#059669',
          alert: '#EF4444',     // Crimson Red (Critical Intrusion / Musth Alert)
          alertDark: '#DC2626',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'radar-pulse': 'radarPulse 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan-line': 'scanLine 4s linear infinite',
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite'
      },
      keyframes: {
        radarPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '100%': { transform: 'scale(2.6)', opacity: '0' }
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      }
    },
  },
  plugins: [],
}
