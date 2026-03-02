<template>
  <div ref="loadingRef" class="modern-page-loading">
    <div class="loading-content">
      <!-- 🎨 现代化加载动画 -->
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-center">
          <span class="center-icon">✨</span>
        </div>
      </div>
      
      <!-- 加载文字 -->
      <div class="loading-text">
        <span class="text-content">加载中</span>
        <span class="loading-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      </div>
      
      <!-- 进度条 -->
      <div class="loading-progress">
        <div class="progress-bar"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineEmits } from 'vue';

const loadingRef = ref();

const emit = defineEmits(['checkLoaded']);

const enter = (next) => {
  console.log('enter');
  loadingRef.value?.classList.remove('out');
  loadingRef.value?.classList.add('enter');
  setTimeout(() => {
    next();
    emit('checkLoaded');
  }, 300);
};

const out = () => {
  console.log('out:', loadingRef.value);
  loadingRef.value?.classList.remove('enter');
  loadingRef.value?.classList.add('out');
};

defineExpose({
  enter,
  out,
});
</script>

<style>
/* 🎨 现代化全屏加载组件 */
.modern-page-loading {
  width: 100vw;
  height: 100vh;
  background: var(--showmd-bg-color-primary);
  z-index: 99999;
  position: fixed;
  top: 100vh;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 背景渐变装饰 */
.modern-page-loading::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0.03;
}

.enter {
  top: 0;
}

.out {
  top: 100vh;
}

/* 🎨 加载内容容器 */
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 1;
}

/* 🎨 旋转加载器 */
.loading-spinner {
  width: 80px;
  height: 80px;
  position: relative;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: spinRing 1.5s ease-in-out infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #667eea;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  inset: 8px;
  border-right-color: #764ba2;
  animation-delay: 0.15s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  inset: 16px;
  border-bottom-color: #f093fb;
  animation-delay: 0.3s;
}

@keyframes spinRing {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 中心图标 */
.spinner-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.center-icon {
  font-size: 24px;
  animation: pulseIcon 2s ease-in-out infinite;
}

@keyframes pulseIcon {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

/* 🎨 加载文字 */
.loading-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 500;
  color: var(--showmd-text-color-primary);
}

.text-content {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 跳动的点 */
.loading-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gradient-primary);
  animation: dotBounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* 🎨 进度条 */
.loading-progress {
  width: 200px;
  height: 4px;
  background: var(--showmd-bg-color-weak);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 30%;
  background: var(--gradient-primary);
  border-radius: 2px;
  animation: progressSlide 1.5s ease-in-out infinite;
}

@keyframes progressSlide {
  0% { transform: translateX(-100%); width: 30%; }
  50% { width: 60%; }
  100% { transform: translateX(400%); width: 30%; }
}

/* 🎨 暗色主题适配 */
.dark .modern-page-loading {
  background: rgba(17, 20, 27, 1);
}

.dark .modern-page-loading::before {
  opacity: 0.05;
}

.dark .loading-progress {
  background: rgba(255, 255, 255, 0.1);
}
</style>