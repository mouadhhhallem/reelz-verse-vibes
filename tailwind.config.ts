
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				reelz: {
					purple: '#7C3AED',
					teal: '#14B8A6',
					dark: '#121212',
					light: '#F9FAFB',
					'purple-light': '#9F7AEA',
					'purple-dark': '#6D28D9',
					'energetic': '#F97316',
					'calm': '#0EA5E9',
					'happy': '#FACC15',
					'sad': '#6D28D9',
					'cosmic': '#8B5CF6',
					'nebula': '#D6BCFA',
					'aurora': '#10B981',
                    'space-black': '#1A1F2C',
                    'space-purple': '#6E59A5',
                    'gem-purple': '#9b87f5',
                    'gem-blue': '#33C3F0'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-up': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'bounce-soft': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
                'cosmic-shimmer': {
                    '0%': { opacity: '0.4', transform: 'translateX(-5%) translateY(5%)' },
                    '50%': { opacity: '0.7', transform: 'translateX(5%) translateY(-5%)' },
                    '100%': { opacity: '0.4', transform: 'translateX(-5%) translateY(5%)' }
                },
                'nebula-pulse': {
                    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' }
                },
                'star-twinkle': {
                    '0%, 100%': { opacity: '0.7' },
                    '50%': { opacity: '1' }
                },
                'aurora-wave': {
                    '0%': { transform: 'translateY(0) scaleX(1)' },
                    '50%': { transform: 'translateY(-10px) scaleX(1.1)' },
                    '100%': { transform: 'translateY(0) scaleX(1)' }
                },
                'neumorphic-press': {
                    '0%': { boxShadow: '5px 5px 15px rgba(0,0,0,0.3), -5px -5px 15px rgba(255,255,255,0.1)' },
                    '100%': { boxShadow: '2px 2px 5px rgba(0,0,0,0.3), -2px -2px 5px rgba(255,255,255,0.1)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-down': 'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
				'fade-in': 'fade-in 0.2s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 6s ease-in-out infinite',
				'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 15s linear infinite',
				'shimmer': 'shimmer 3s ease-in-out infinite',
                'cosmic-shimmer': 'cosmic-shimmer 8s ease-in-out infinite',
                'nebula-pulse': 'nebula-pulse 4s ease-in-out infinite',
                'star-twinkle': 'star-twinkle 2s ease-in-out infinite',
                'aurora-wave': 'aurora-wave 10s ease-in-out infinite',
                'neumorphic-press': 'neumorphic-press 0.2s ease-out forwards'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'shimmer-gradient': 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 100%)',
                'nebula-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
                'aurora-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
                'cosmic-gradient': 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
