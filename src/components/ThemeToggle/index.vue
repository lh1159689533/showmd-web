<template>
  <div class="theme-toggle-wrapper">
    <!-- 🎨 现代化主题切换按钮 -->
    <button class="theme-toggle-btn" :class="{ 'dark-mode': isDark }" @click="toggleTheme"
      :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'">
      <!-- 🌟 动态背景渐变 -->
      <div class="toggle-bg"></div>

      <!-- 🎭 主题图标容器 -->
      <div class="icon-container">
        <!-- ☀️ 太阳图标 -->
        <div class="sun-icon" :class="{ 'active': !isDark }">
          <svg fill="none" viewBox="0 0 20 20" width="20" height="20">
            <!-- 中心圆 -->
            <circle class="sun-center" cx="10" cy="10" r="4.167" stroke="currentColor" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="1.25" />
            <!-- 光线 - 按顺时针顺序排列 -->
            <g class="sun-rays">
              <!-- 12点方向 -->
              <path class="ray ray-1" stroke="currentColor" d="M10 1.667v1.666" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
              <!-- 1:30方向 -->
              <path class="ray ray-2" stroke="currentColor" d="M15 5l1.25-1.25" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
              <!-- 3点方向 -->
              <path class="ray ray-3" stroke="currentColor" d="M16.667 10h1.666" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
              <!-- 4:30方向 -->
              <path class="ray ray-4" stroke="currentColor" d="M15 15l1.25 1.25" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
              <!-- 6点方向 -->
              <path class="ray ray-5" stroke="currentColor" d="M10 16.666v1.667" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
              <!-- 7:30方向 -->
              <path class="ray ray-6" stroke="currentColor" d="M3.75 16.25L5 15" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
              <!-- 9点方向 -->
              <path class="ray ray-7" stroke="currentColor" d="M1.667 10h1.666" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
              <!-- 10:30方向 -->
              <path class="ray ray-8" stroke="currentColor" d="M3.75 3.75 5 5" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.25" />
            </g>
          </svg>
        </div>

        <!-- 🌙 月亮图标 -->
        <div class="moon-icon" :class="{ 'active': isDark }">
          <svg fill="none" viewBox="0 0 20 20" width="20" height="20">
            <path class="moon-shape" stroke="currentColor"
              d="M2.5 9.54c0 4.396 3.474 7.96 7.76 7.96 3.3 0 6.117-2.112 7.24-5.09a6.729 6.729 0 0 1-2.93.668c-3.809 0-6.897-3.168-6.897-7.075a7.16 7.16 0 0 1 1.448-4.337C5.375 2.232 2.5 5.543 2.5 9.541Z"
              stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" />
          </svg>
        </div>
      </div>

      <!-- ✨ 装饰性星星 -->
      <div class="stars" :class="{ 'visible': isDark }">
        <div class="star star-1"></div>
        <div class="star star-2"></div>
        <div class="star star-3"></div>
      </div>

      <!-- 🌊 波纹效果 -->
      <div class="ripple-effect" ref="rippleRef"></div>
    </button>

    <!-- 📱 主题状态提示 -->
    <!-- <div class="theme-status" :class="{ 'show': showStatus }">
      <span class="status-text">
        {{ isDark ? '🌙 深色模式' : '☀️ 浅色模式' }}
      </span>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, } from 'vue';
import storage from '../../utils/storage';

// 🎯 响应式状态
const isDark = ref(false);
const showStatus = ref(false);
const rippleRef = ref<HTMLElement>();

// 🎨 计算属性
const themeClass = computed(() => isDark.value ? 'dark' : 'light');

// 🚀 主题切换核心逻辑
const toggleTheme = async (event?: MouseEvent) => {
  // 🎪 创建波纹效果
  if (event && rippleRef.value) {
    createRippleEffect(event);
  }

  // 🎬 使用 View Transition API（如果支持）
  if ('startViewTransition' in document) {
    const transition = (document as any).startViewTransition(() => {
      updateTheme();
    });

    // 🎨 自定义过渡动画
    await transition.ready;

    // 🌊 圆形展开动画
    if (event) {
      const { clientX, clientY } = event;
      const endRadius = Math.hypot(
        Math.max(clientX, window.innerWidth - clientX),
        Math.max(clientY, window.innerHeight - clientY)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${clientX}px ${clientY}px)`,
            `circle(${endRadius}px at ${clientX}px ${clientY}px)`
          ]
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    }
  } else {
    // 🔄 降级方案：直接切换
    updateTheme();
  }

  // 💾 保存主题偏好
  storage.setItem('theme', themeClass.value);

  // 📢 显示状态提示
  showThemeStatus();
};

// 🔄 更新主题状态
const updateTheme = () => {
  isDark.value = !isDark.value;
  const root = document.documentElement;

  // 🎨 更新 DOM 类名
  root.classList.remove('light', 'dark');
  root.classList.add(themeClass.value);

  // 🎯 触发自定义事件
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme: themeClass.value, isDark: isDark.value }
  }));
};

// 🌊 创建波纹效果
const createRippleEffect = (event: MouseEvent) => {
  if (!rippleRef.value) return;

  const rect = rippleRef.value.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
  `;

  rippleRef.value.appendChild(ripple);

  // 🧹 清理波纹元素
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// 📢 显示主题状态
const showThemeStatus = () => {
  showStatus.value = true;
  setTimeout(() => {
    showStatus.value = false;
  }, 2000);
};

// 🎯 检测系统主题偏好
const detectSystemTheme = () => {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches;
  }
  return false;
};

// 🚀 初始化主题
const initTheme = () => {
  // 📱 优先级：本地存储 > 系统偏好 > 默认浅色
  const savedTheme = storage.getItem('theme');
  const systemPrefersDark = detectSystemTheme();

  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = systemPrefersDark;
  }

  // 🎨 应用初始主题
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(themeClass.value);

  // 💾 保存初始主题
  storage.setItem('theme', themeClass.value);
};

// 🎧 监听系统主题变化
const watchSystemTheme = () => {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // 🎯 只有在没有用户偏好时才跟随系统
      if (!storage.getItem('theme')) {
        isDark.value = e.matches;
        updateTheme();
      }
    });
  }
};

// 🎪 组件挂载
onMounted(() => {
  initTheme();
  watchSystemTheme();
});

// 🎁 暴露方法给父组件
defineExpose({
  toggleTheme,
  isDark: computed(() => isDark.value),
  theme: themeClass
});
</script>

<style scoped>
/* 🎨 主题切换包装器 */
.theme-toggle-wrapper {
  position: relative;
  display: inline-block;
}

/* 🎯 主题切换按钮 */
.theme-toggle-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  transition: var(--transition-smooth);
  background: var(--glass-bg);
  /* backdrop-filter: var(--glass-backdrop); */
  border: 2px solid var(--glass-border);
  /* box-shadow: var(--shadow-float); */
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-glow);
}

.theme-toggle-btn:active {
  transform: translateY(0) scale(0.95);
}

/* 🌟 动态背景 */
.toggle-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--gradient-primary);
  opacity: 0;
  transition: var(--transition-smooth);
}

.theme-toggle-btn.dark-mode .toggle-bg {
  opacity: 0.1;
}

/* 🎭 图标容器 */
.icon-container {
  position: relative;
  width: 24px;
  height: 24px;
  z-index: 2;
}

/* ☀️ 太阳图标 */
.sun-icon {
  position: absolute;
  inset: 0;
  color: var(--warning-color, #fbbf24);
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-icon.active {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.sun-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 8px var(--warning-glow, rgba(251, 191, 36, 0.4)));
}

/* 太阳中心圆 */
.sun-center {
  opacity: 0;
  transform: scale(0);
  transform-origin: center;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-icon.active .sun-center {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.5s;
}

/* 太阳光线 */
.sun-rays .ray {
  opacity: 0;
  stroke-dasharray: 10;
  stroke-dashoffset: 10;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-icon.active .sun-rays .ray {
  opacity: 1;
  stroke-dashoffset: 0;
}

/* 光线顺时针依次出现的延迟 */
.sun-icon.active .ray-1 {
  transition-delay: 1s;
}

/* 12点 */
.sun-icon.active .ray-2 {
  transition-delay: 1.3s;
}

/* 1:30 */
.sun-icon.active .ray-3 {
  transition-delay: 1.6s;
}

/* 3点 */
.sun-icon.active .ray-4 {
  transition-delay: 1.9s;
}

/* 4:30 */
.sun-icon.active .ray-5 {
  transition-delay: 2.2s;
}

/* 6点 */
.sun-icon.active .ray-6 {
  transition-delay: 2.5s;
}

/* 7:30 */
.sun-icon.active .ray-7 {
  transition-delay: 2.8s;
}

/* 9点 */
.sun-icon.active .ray-8 {
  transition-delay: 3.1s;
}

/* 10:30 */

/* 太阳消失时光线逆时针消失 */
.sun-icon:not(.active) .ray-8 {
  transition-delay: 0s;
}

/* 10:30 */
.sun-icon:not(.active) .ray-7 {
  transition-delay: 0.3s;
}

/* 9点 */
.sun-icon:not(.active) .ray-6 {
  transition-delay: 0.6s;
}

/* 7:30 */
.sun-icon:not(.active) .ray-5 {
  transition-delay: 0.9s;
}

/* 6点 */
.sun-icon:not(.active) .ray-4 {
  transition-delay: 1.2s;
}

/* 4:30 */
.sun-icon:not(.active) .ray-3 {
  transition-delay: 1.5s;
}

/* 3点 */
.sun-icon:not(.active) .ray-2 {
  transition-delay: 1.8s;
}

/* 1:30 */
.sun-icon:not(.active) .ray-1 {
  transition-delay: 2.1s;
}

/* 12点 */
.sun-icon:not(.active) .sun-center {
  transition-delay: 2.4s;
}

/* 太阳激活后的持续动画 - 光线顺时针闪烁 */
.sun-icon.active .sun-rays {
  animation: rays-glow 3s ease-in-out infinite;
  animation-delay: 3.5s;
  /* 等待所有光线出现后开始 */
}

@keyframes rays-glow {

  0%,
  100% {
    filter: brightness(1) drop-shadow(0 0 8px var(--warning-glow, rgba(251, 191, 36, 0.4)));
  }

  50% {
    filter: brightness(1.2) drop-shadow(0 0 12px var(--warning-glow-intense, rgba(251, 191, 36, 0.6)));
  }
}

/* 单个光线的顺时针依次闪烁动画 */
.sun-icon.active .ray-1 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 3.5s;
}

/* 12点 */
.sun-icon.active .ray-2 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 3.7s;
}

/* 1:30 */
.sun-icon.active .ray-3 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 3.9s;
}

/* 3点 */
.sun-icon.active .ray-4 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 4.1s;
}

/* 4:30 */
.sun-icon.active .ray-5 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 4.3s;
}

/* 6点 */
.sun-icon.active .ray-6 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 4.5s;
}

/* 7:30 */
.sun-icon.active .ray-7 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 4.7s;
}

/* 9点 */
.sun-icon.active .ray-8 {
  animation: ray-clockwise-pulse 3s ease-in-out infinite;
  animation-delay: 4.9s;
}

/* 10:30 */

@keyframes ray-clockwise-pulse {

  0%,
  85% {
    opacity: 1;
    stroke-width: 1.25;
    filter: drop-shadow(0 0 4px var(--warning-glow-soft, rgba(251, 191, 36, 0.3)));
  }

  5% {
    opacity: 1;
    stroke-width: 2;
    filter: drop-shadow(0 0 12px var(--warning-glow-bright, rgba(251, 191, 36, 1)));
  }

  15% {
    opacity: 1;
    stroke-width: 1.25;
    filter: drop-shadow(0 0 4px var(--warning-glow-soft, rgba(251, 191, 36, 0.3)));
  }
}

/* 🌙 月亮图标 */
.moon-icon {
  position: absolute;
  inset: 0;
  color: var(--text-tertiary, #9ca3af);
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.moon-icon.active {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.moon-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 8px var(--moon-glow, rgba(156, 163, 175, 0.4)));
}

/* 月亮形状动画 */
.moon-shape {
  opacity: 0;
  transform: scale(0.3);
  transform-origin: center;
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.moon-icon.active .moon-shape {
  opacity: 1;
  transform: scale(1);
  transition-delay: 1.5s;
}

/* 月亮出现动画 - 模拟从圆形到月牙的过程 */
.moon-icon.active .moon-shape {
  animation: moon-appear 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 1s;
}

@keyframes moon-appear {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-30deg);
    filter: brightness(2) drop-shadow(0 0 12px var(--moon-glow-bright, rgba(156, 163, 175, 0.8)));
  }

  30% {
    opacity: 0.7;
    transform: scale(0.8) rotate(-15deg);
    filter: brightness(1.5) drop-shadow(0 0 10px var(--moon-glow-medium, rgba(156, 163, 175, 0.6)));
  }

  70% {
    opacity: 0.9;
    transform: scale(1.1) rotate(5deg);
    filter: brightness(1.2) drop-shadow(0 0 8px var(--moon-glow-soft, rgba(156, 163, 175, 0.5)));
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    filter: brightness(1) drop-shadow(0 0 8px var(--moon-glow, rgba(156, 163, 175, 0.4)));
  }
}

/* ✨ 装饰性星星 */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.stars.visible {
  opacity: 1;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--warning-color, #fbbf24);
  border-radius: 50%;
  animation: twinkle 2s infinite;
}

.star-1 {
  top: 12px;
  left: 8px;
  animation-delay: 0s;
}

.star-2 {
  top: 8px;
  right: 12px;
  animation-delay: 0.7s;
}

.star-3 {
  bottom: 10px;
  left: 12px;
  animation-delay: 1.4s;
}

@keyframes twinkle {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

/* 🌊 波纹效果容器 */
.ripple-effect {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

/* 🌊 波纹动画 */
.ripple-effect :deep(.ripple) {
  position: absolute;
  border-radius: 50%;
  background: var(--primary-ripple, rgba(248, 113, 113, 0.3));
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
}

@keyframes ripple-animation {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

/* 📱 主题状态提示 */
.theme-status {
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--showmd-bg-color-primary);
  color: var(--showmd-text-color-primary);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: var(--shadow-float);
  border: 1px solid var(--showmd-border-color);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.theme-status.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.theme-status::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--showmd-bg-color-primary);
}

/* 🎨 暗色主题适配 */
.dark .theme-toggle-btn {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .theme-status {
  background: rgba(24, 24, 27, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .theme-status::after {
  border-top-color: rgba(24, 24, 27, 0.95);
}

/* 🎯 聚焦状态 */
.theme-toggle-btn:focus-visible {
  outline: 2px solid var(--primary-400, var(--vibrant-coral, #f87171));
  outline-offset: 2px;
}

/* 📱 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle-btn {
    width: 48px;
    height: 48px;
  }

  .icon-container {
    width: 20px;
    height: 20px;
  }

  .theme-status {
    font-size: 11px;
    padding: 6px 12px;
  }
}

/* 🎪 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {

  .theme-toggle-btn,
  .sun-icon,
  .moon-icon,
  .stars,
  .theme-status,
  .sun-center,
  .sun-rays .ray,
  .moon-shape,
  .sun-rays {
    transition: none;
    animation: none;
  }

  .star {
    animation: none;
  }

  /* 禁用所有光线动画 */
  .sun-icon.active .ray-1,
  .sun-icon.active .ray-2,
  .sun-icon.active .ray-3,
  .sun-icon.active .ray-4,
  .sun-icon.active .ray-5,
  .sun-icon.active .ray-6,
  .sun-icon.active .ray-7,
  .sun-icon.active .ray-8 {
    animation: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(1.2);
      opacity: 0;
    }
  }

  @keyframes moon-appear {
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
      filter: brightness(1) drop-shadow(0 0 8px var(--moon-glow, rgba(156, 163, 175, 0.4)));
    }
  }

  @keyframes rays-glow {
    to {
      filter: brightness(1) drop-shadow(0 0 8px var(--warning-glow, rgba(251, 191, 36, 0.4)));
    }
  }

  @keyframes ray-clockwise-pulse {
    to {
      opacity: 1;
      stroke-width: 1.25;
      filter: drop-shadow(0 0 4px var(--warning-glow-soft, rgba(251, 191, 36, 0.3)));
    }
  }
}
</style>