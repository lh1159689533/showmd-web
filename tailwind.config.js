module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 🌿 护眼绿色系统
      colors: {
        vibrant: {
          green: '#10b981',
          emerald: '#059669',
          teal: '#14b8a6',
          lime: '#84cc16',
          mint: '#6ee7b7',
        },
        neon: {
          blue: '#06b6d4',
          pink: '#ec4899',
          green: '#10b981',
          emerald: '#059669',
          orange: '#f59e0b',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.3)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
      },
      // 🌿 护眼绿色渐变背景
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        'gradient-accent': 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-cool': 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        'gradient-rainbow': 'linear-gradient(90deg, #ec4899, #10b981, #06b6d4, #84cc16, #f59e0b)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      },
      // 🎨 动画系统
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'gradient-flow': 'gradientFlow 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.5', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      // 🎨 毛玻璃模糊
      backdropBlur: {
        xs: '2px',
        glass: '8px',
        'glass-heavy': '16px',
      },
      // 🌿 护眼绿色阴影系统
      boxShadow: {
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
        'glow-blue': '0 0 20px rgba(6, 182, 212, 0.3)',
        'float': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'float-lg': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'press': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'inner-glow': 'inset 0 0 20px rgba(16, 185, 129, 0.1)',
      },
      // 🎨 过渡时间
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // 🎨 边框圆角
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // 🎨 字体
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
    zIndex: {
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      25: 25,
      75: 75,
      100: 100,
      200: 200,
      300: 300,
      400: 400,
      500: 500,
      600: 600,
      700: 700,
      800: 800,
      900: 900,
      1000: 1000,
      2000: 2000,
      auto: 'auto',
    },
  },
  plugins: [
    // 🎨 自定义毛玻璃效果插件
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        },
        '.gradient-border': {
          position: 'relative',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '2px',
          borderRadius: '16px',
        },
        '.gradient-text': {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },
        '.text-shadow-glow': {
          textShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
        },
        '.hover-lift': {
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.hover-lift:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover', 'dark']);
    },
  ],
  corePlugins: {
    container: false,
  },
  darkMode: 'class'
};
