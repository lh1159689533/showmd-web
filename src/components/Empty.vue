<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  icon?: string;
  title?: string;
  description?: string;
  showAction?: boolean;
  actionText?: string;
}>();
</script>

<template>
  <div class="modern-empty">
    <!-- 🎨 装饰背景 -->
    <div class="empty-decoration">
      <div class="decoration-circle"></div>
      <div class="decoration-circle"></div>
      <div class="decoration-circle"></div>
    </div>

    <!-- 🎨 主要内容 -->
    <div class="empty-content">
      <!-- 图标或插图 -->
      <div class="empty-icon">
        <span class="icon-main">{{ icon || '📭' }}</span>
        <div class="icon-glow"></div>
      </div>

      <!-- 标题 -->
      <h3 v-if="title" class="empty-title">{{ title }}</h3>

      <!-- 描述文字 -->
      <p class="empty-description">
        <slot>{{ description || '暂无数据' }}</slot>
      </p>

      <!-- 操作按钮 -->
      <div v-if="showAction || $slots.action" class="empty-action">
        <slot name="action">
          <button class="action-btn">
            <span>{{ actionText || '去看看' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </slot>
      </div>
    </div>

    <!-- 🎨 底部装饰插图 -->
    <div class="empty-illustration">
      <svg viewBox="0 0 200 60" class="wave-svg">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.3" />
            <stop offset="50%" style="stop-color:#764ba2;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#f093fb;stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <path 
          d="M0,30 Q25,10 50,30 T100,30 T150,30 T200,30 V60 H0 Z" 
          fill="url(#waveGradient)"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 现代化空状态组件 */
.modern-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  position: relative;
  overflow: hidden;
  min-height: 280px;
}

/* 🎨 装饰背景 */
.empty-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: var(--gradient-primary);
  opacity: 0.05;
  animation: floatCircle 8s ease-in-out infinite;
}

.decoration-circle:nth-child(1) {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.decoration-circle:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.decoration-circle:nth-child(3) {
  width: 40px;
  height: 40px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes floatCircle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(180deg); }
}

/* 🎨 主要内容 */
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 🎨 图标 */
.empty-icon {
  position: relative;
  margin-bottom: 20px;
}

.icon-main {
  font-size: 64px;
  display: block;
  animation: bounceIcon 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

@keyframes bounceIcon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(20px);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.25; }
}

/* 🎨 标题 */
.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin: 0 0 8px 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 🎨 描述文字 */
.empty-description {
  font-size: 14px;
  color: var(--showmd-text-color-weak);
  margin: 0 0 24px 0;
  max-width: 280px;
  line-height: 1.6;
}

/* 🎨 操作按钮 */
.empty-action {
  margin-top: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-bounce);
  box-shadow: var(--shadow-float);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn svg {
  transition: transform 0.3s ease;
}

.action-btn:hover svg {
  transform: translateX(4px);
}

/* 🎨 底部波浪装饰 */
.empty-illustration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.wave-svg {
  width: 100%;
  height: 60px;
  animation: waveMove 4s ease-in-out infinite;
}

@keyframes waveMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-10px); }
}

/* 🎨 响应式设计 */
@media (max-width: 480px) {
  .modern-empty {
    padding: 32px 16px;
    min-height: 220px;
  }
  
  .icon-main {
    font-size: 48px;
  }
  
  .empty-description {
    font-size: 13px;
  }
}

/* 🎨 暗色主题适配 */
.dark .decoration-circle {
  opacity: 0.08;
}

.dark .icon-glow {
  opacity: 0.2;
}
</style>
