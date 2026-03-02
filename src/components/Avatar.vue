<script lang="ts" setup>
import { defineProps, computed } from 'vue';

const props = defineProps<{
  src?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showRing?: boolean;
}>();

const defaultSrc = '/api/avatars.png';

// 获取名字首字母
const initials = computed(() => {
  if (!props.name) return '';
  return props.name.charAt(0).toUpperCase();
});

// 尺寸映射
const sizeClass = computed(() => {
  const sizes = {
    small: 'w-5 h-5 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xlarge: 'w-16 h-16 text-lg'
  };
  return sizes[props.size || 'medium'];
});

// 随机渐变色（基于名字生成一致的颜色）
const gradientStyle = computed(() => {
  if (props.src) return {};
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  ];
  const index = props.name ? props.name.charCodeAt(0) % gradients.length : 0;
  return { background: gradients[index] };
});
</script>

<template>
  <div class="modern-avatar" :class="[
    sizeClass,
    { 'has-ring': showRing }
  ]">
    <!-- 渐变光环 -->
    <div v-if="showRing" class="avatar-ring"></div>

    <!-- 头像容器 -->
    <div class="avatar-inner" :style="!src ? gradientStyle : {}">
      <!-- 图片头像 -->
      <img v-if="src" :src="src" @error="(e) => (e.target as HTMLImageElement).src = defaultSrc" class="avatar-image"
        v-bind="$attrs" />
      <!-- 文字头像 -->
      <span v-else class="avatar-initials">{{ initials || '?' }}</span>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 现代化头像组件 */
.modern-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 🎨 渐变光环效果 */
.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: var(--gradient-primary);
  opacity: 0;
  transition: var(--transition-smooth);
  animation: ringPulse 2s ease-in-out infinite;
}

.modern-avatar.has-ring .avatar-ring {
  opacity: 0.6;
}

@keyframes ringPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }

  50% {
    transform: scale(1.02);
    opacity: 0.8;
  }
}

/* 🎨 头像内容容器 */
.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  transition: var(--transition-bounce);
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow-float);
}

/* 🎨 图片头像 */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

/* 🎨 文字头像 */
.avatar-initials {
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
