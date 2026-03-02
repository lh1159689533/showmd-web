<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, watchEffect } from 'vue';
import { useTheme } from '../../utils/themeManager';

// 🎨 使用新的主题管理器
const { currentTheme, isDark, toggle } = useTheme();

const changeTheme = (event?: MouseEvent) => {
  // 🎪 使用增强的主题切换逻辑
  if ('startViewTransition' in document) {
    const transition = (document as any).startViewTransition(() => {
      toggle();
    });

    transition.ready.then(() => {
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
    });
  } else {
    // 🔄 降级方案
    toggle();
  }
};

onMounted(() => {
  // 🎯 设置初始checkbox状态
  const checkbox = document.getElementById('themeSwitch') as HTMLInputElement;
  if (checkbox) {
    checkbox.checked = isDark.value;
  }
});
</script>
<template>
  <span class="absolute top-3 right-6 text-sm cursor-pointer">
    <div class="theme-switcher">
      <div class="switch-container">
        <input 
          type="checkbox" 
          class="switch-input" 
          id="themeSwitch" 
          :checked="isDark"
          @click="changeTheme($event)"
        >
        <label for="themeSwitch" class="switch">
          <div class="switch-thumb">
            <div class="theme-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- 太阳中心圆 -->
                <circle class="sun-center" cx="12" cy="12" r="3" stroke="var(--warning-color, #fcd34d)" fill="none"/>
                
                <!-- 太阳光芒 - 8条射线 -->
                <g class="sun-rays">
                  <path class="ray" d="M12 4v2" stroke="var(--warning-color, #fcd34d)"/>
                  <path class="ray" d="M17.66 6.34l-1.41 1.41" stroke="var(--warning-color, #fcd34d)"/>
                  <path class="ray" d="M20 12h-2" stroke="var(--warning-color, #fcd34d)"/>
                  <path class="ray" d="M17.66 17.66l-1.41-1.41" stroke="var(--warning-color, #fcd34d)"/>
                  <path class="ray" d="M12 20v-2" stroke="var(--warning-color, #fcd34d)"/>
                  <path class="ray" d="M6.34 17.66l1.41-1.41" stroke="var(--warning-color, #fcd34d)"/>
                  <path class="ray" d="M4 12h2" stroke="var(--warning-color, #fcd34d)"/>
                  <path class="ray" d="M6.34 6.34l1.41 1.41" stroke="var(--warning-color, #fcd34d)"/>
                </g>
                
                <!-- 月亮形状 - 抽象月牙 -->
                <path class="moon-shape" 
                  d="M12 4 A8 8 0 0 0 12 20 A6 6 0 0 1 12 4 Z" 
                  stroke="var(--text-tertiary, #9ca3af)" 
                  fill="none"/>
                
                <!-- 月亮装饰点 -->
                <g class="moon-dots">
                  <circle class="dot" cx="17" cy="8" r="0.5" fill="var(--text-tertiary, #9ca3af)"/>
                  <circle class="dot" cx="19" cy="11" r="0.3" fill="var(--text-tertiary, #9ca3af)"/>
                  <circle class="dot" cx="18" cy="15" r="0.4" fill="var(--text-tertiary, #9ca3af)"/>
                </g>
              </svg>
            </div>
          </div>
        </label>
      </div>
    </div>
  </span>
</template>
<style>
.switch-label {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 15px;
  color: var(--text-tertiary, #666666);
}

.switch-container {
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 999px;
  background: var(--blue-light-1);
}

.switch-input {
  display: none;
}

.switch {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.switch-thumb {
  position: absolute;
  left: 6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.switch-input:checked~.switch .switch-thumb {
  transform: translateX(30px);
}

.theme-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
}

.theme-icon svg {
  width: 100%;
  height: 100%;
}

/* 初始状态 - 太阳模式 */
.sun-center {
  stroke-dasharray: 18.85; /* 圆的周长 2πr = 2π×3 ≈ 18.85 */
  stroke-dashoffset: 0;
  opacity: 1;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.3s ease-out;
}

.sun-rays .ray {
  stroke-dasharray: 2.83; /* 每条光芒的长度 */
  stroke-dashoffset: 0;
  opacity: 1;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.4s ease-out;
}

.moon-shape {
  stroke-dasharray: 50.27; /* 月牙路径的总长度 */
  stroke-dashoffset: 50.27; /* 初始完全隐藏 */
  opacity: 0;
  transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, 
              opacity 0.3s ease-out 0.4s;
}

.moon-dots {
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.4s ease-out 1.2s, 
              transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s;
}

.moon-dots .dot {
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 切换到月亮状态 */
.switch-input:checked ~ .switch .sun-center {
  stroke-dashoffset: 18.85; /* 圆形消失 */
  opacity: 0;
}

.switch-input:checked ~ .switch .sun-rays .ray {
  stroke-dashoffset: 2.83; /* 光芒消失 */
  opacity: 0;
}

.switch-input:checked ~ .switch .moon-shape {
  stroke-dashoffset: 0; /* 月牙绘制出现 */
  opacity: 1;
}

.switch-input:checked ~ .switch .moon-dots {
  opacity: 1;
  transform: scale(1);
}

.switch-input:checked ~ .switch .moon-dots .dot {
  transform: scale(1);
}

/* 光芒逐个消失的延迟效果 */
.sun-rays .ray:nth-child(1) { transition-delay: 0s, 0s; }
.sun-rays .ray:nth-child(2) { transition-delay: 0.08s, 0.08s; }
.sun-rays .ray:nth-child(3) { transition-delay: 0.16s, 0.16s; }
.sun-rays .ray:nth-child(4) { transition-delay: 0.24s, 0.24s; }
.sun-rays .ray:nth-child(5) { transition-delay: 0.32s, 0.32s; }
.sun-rays .ray:nth-child(6) { transition-delay: 0.4s, 0.4s; }
.sun-rays .ray:nth-child(7) { transition-delay: 0.48s, 0.48s; }
.sun-rays .ray:nth-child(8) { transition-delay: 0.56s, 0.56s; }

/* 月亮装饰点逐个出现 */
.moon-dots .dot:nth-child(1) { transition-delay: 1.3s; }
.moon-dots .dot:nth-child(2) { transition-delay: 1.4s; }
.moon-dots .dot:nth-child(3) { transition-delay: 1.5s; }

/* 反向动画 - 月亮到太阳 */
.switch-input:not(:checked) ~ .switch .sun-center {
  transition-delay: 0.6s, 0.6s;
}

.switch-input:not(:checked) ~ .switch .moon-shape {
  transition-delay: 0s, 0s;
}

.switch-input:not(:checked) ~ .switch .moon-dots {
  transition-delay: 0s, 0s;
}

/* 反向光芒出现延迟 */
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(1) { transition-delay: 1s, 1s; }
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(2) { transition-delay: 0.92s, 0.92s; }
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(3) { transition-delay: 0.84s, 0.84s; }
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(4) { transition-delay: 0.76s, 0.76s; }
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(5) { transition-delay: 0.68s, 0.68s; }
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(6) { transition-delay: 0.6s, 0.6s; }
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(7) { transition-delay: 0.52s, 0.52s; }
.switch-input:not(:checked) ~ .switch .sun-rays .ray:nth-child(8) { transition-delay: 0.44s, 0.44s; }

/* 添加微妙的发光效果 */
.switch-input:not(:checked) ~ .switch .sun-center,
.switch-input:not(:checked) ~ .switch .sun-rays .ray {
  filter: drop-shadow(0 0 2px var(--warning-glow, rgba(252, 211, 77, 0.5)));
}

.switch-input:checked ~ .switch .moon-shape {
  filter: drop-shadow(0 0 2px var(--moon-glow, rgba(156, 163, 175, 0.3)));
}

.content {
  background-color: var(--showmd-bg-color-secondary, #f0f0f0);
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.section {
  margin-bottom: 30px;
}

.section h2 {
  color: var(--showmd-text-color-primary, #333333);
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.section p {
  color: var(--showmd-text-color-weak, #666666);
  line-height: 1.6;
  margin-bottom: 15px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background-color: var(--showmd-bg-color-primary, #ffffff);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin-bottom: 10px;
  color: var(--showmd-text-color-primary, #333333);
}

.card p {
  color: var(--showmd-text-color-weak, #666666);
  font-size: 0.95rem;
}

.button {
  background-color: var(--showmd-text-color-primary, #333333);
  color: var(--showmd-bg-color-primary, #ffffff);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 10px;
  transition: opacity 0.3s;
}

.button:hover {
  opacity: 0.85;
}

@media (max-width: 600px) {
  .cards {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>