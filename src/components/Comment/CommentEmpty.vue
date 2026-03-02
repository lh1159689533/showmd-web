<script setup>
import { MessageCircle, ArrowDown } from 'lucide-vue-next';
</script>

<template>
  <div class="modern-comment-empty">
    <!-- 背景装饰 -->
    <div class="empty-bg-decoration">
      <div class="floating-bubble bubble-1">💬</div>
      <div class="floating-bubble bubble-2">💭</div>
      <div class="floating-bubble bubble-3">✨</div>
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
    </div>

    <!-- 主图标 -->
    <div class="empty-icon-wrapper">
      <div class="icon-container">
        <MessageCircle :size="80" class="comment-icon" />
        <div class="icon-ring"></div>
      </div>
    </div>

    <!-- 文字内容 -->
    <div class="empty-content">
      <h3 class="empty-title">还没有评论</h3>
      <p class="empty-description">快来发表第一条评论，开启精彩讨论！</p>
    </div>

    <!-- 引导提示 -->
    <div class="empty-hint">
      <div class="hint-arrow">
        <ArrowDown :size="20" />
      </div>
      <span>在上方输入框写下你的想法</span>
    </div>
  </div>
</template>

<style scoped>
.modern-comment-empty {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  overflow: hidden;
}

/* 背景装饰 */
.empty-bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-bubble {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.3;
  animation: float 4s ease-in-out infinite;
}

.bubble-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.bubble-2 {
  top: 30%;
  right: 20%;
  animation-delay: 1s;
}

.bubble-3 {
  bottom: 25%;
  left: 25%;
  animation-delay: 2s;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.15;
}

.orb-1 {
  width: 150px;
  height: 150px;
  top: 10%;
  left: 10%;
  background: var(--gradient-start, #667eea);
  animation: pulse 4s ease-in-out infinite;
}

.orb-2 {
  width: 120px;
  height: 120px;
  bottom: 20%;
  right: 15%;
  background: var(--gradient-end, #764ba2);
  animation: pulse 4s ease-in-out infinite 2s;
}

/* 图标区域 */
.empty-icon-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.icon-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-icon {
  width: 80px;
  height: 80px;
  z-index: 1;
  color: #667eea;
  opacity: 0.8;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.icon-ring {
  position: absolute;
  inset: -10px;
  border: 2px dashed rgba(99, 102, 241, 0.3);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

/* 动画 */
.empty-content {
  text-align: center;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--showmd-text-color-primary) 0%, var(--gradient-start, #667eea) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-description {
  font-size: 0.875rem;
  color: var(--showmd-text-color-weak);
}

/* 引导提示 */
.empty-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  font-size: 0.8125rem;
  color: var(--showmd-text-color-weak);
  animation: bounce 2s ease-in-out infinite;
}

.hint-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--gradient-start, #667eea), var(--gradient-end, #764ba2));
  border-radius: 50%;
  color: white;
  animation: arrowBounce 1.5s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 暗色主题适配 */
.dark .glow-orb {
  opacity: 0.1;
}

.dark .empty-hint {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
}
</style>
