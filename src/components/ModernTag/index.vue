<script lang="ts" setup>
import { computed } from 'vue';
import { Close } from '@element-plus/icons-vue';

interface Props {
  text: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined' | 'ghost' | 'gradient';
  clickable?: boolean;
  closable?: boolean;
  icon?: string;
  color?: string;
  index?: number;
}

interface Emits {
  (e: 'click', event: MouseEvent): void;
  (e: 'close', event: MouseEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  variant: 'filled',
  clickable: false,
  closable: false,
  index: 0
});

const emit = defineEmits<Emits>();

// 动态颜色系统
const colorVariants = {
  primary: { bg: '#667eea', border: '#667eea', text: '#ffffff' },
  success: { bg: '#48bb78', border: '#48bb78', text: '#ffffff' },
  warning: { bg: '#ed8936', border: '#ed8936', text: '#ffffff' },
  danger: { bg: '#f56565', border: '#f56565', text: '#ffffff' },
  info: { bg: '#4299e1', border: '#4299e1', text: '#ffffff' },
  default: { bg: '#e2e8f0', border: '#cbd5e0', text: '#4a5568' }
};

// 彩虹色彩系统
const rainbowColors = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: '#667eea', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: '#f093fb', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: '#4facfe', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', border: '#43e97b', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: '#fa709a', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', border: '#a8edea', text: '#2d3748' },
  { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', border: '#ffecd2', text: '#2d3748' },
  { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', border: '#ff9a9e', text: '#ffffff' }
];

const tagStyle = computed(() => {
  if (props.color) {
    return { '--tag-color': props.color };
  }
  
  if (props.type === 'default' && props.variant === 'gradient') {
    const colorSet = rainbowColors[props.index % rainbowColors.length];
    return {
      '--tag-bg': colorSet.bg,
      '--tag-border': colorSet.border,
      '--tag-text': colorSet.text
    };
  }
  
  const colorSet = colorVariants[props.type];
  return {
    '--tag-bg': colorSet.bg,
    '--tag-border': colorSet.border,
    '--tag-text': colorSet.text
  };
});

const tagClasses = computed(() => [
  'modern-tag',
  `modern-tag--${props.size}`,
  `modern-tag--${props.variant}`,
  `modern-tag--${props.type}`,
  {
    'modern-tag--clickable': props.clickable,
    'modern-tag--closable': props.closable
  }
]);

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event);
  }
};

const handleClose = (event: MouseEvent) => {
  event.stopPropagation();
  emit('close', event);
};
</script>

<template>
  <span 
    :class="tagClasses"
    :style="tagStyle"
    @click="handleClick"
  >
    <!-- 图标 -->
    <i v-if="icon" :class="icon" class="tag-icon"></i>
    
    <!-- 文本内容 -->
    <span class="tag-text">{{ text }}</span>
    
    <!-- 关闭按钮 -->
    <el-icon 
      v-if="closable" 
      class="tag-close"
      @click="handleClose"
    >
      <Close />
    </el-icon>
  </span>
</template>

<style scoped>
.modern-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 16px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 尺寸变体 */
.modern-tag--small {
  padding: 2px 8px;
  font-size: 11px;
  line-height: 1.4;
  min-height: 20px;
}

.modern-tag--medium {
  padding: 4px 12px;
  font-size: 12px;
  line-height: 1.5;
  min-height: 24px;
}

.modern-tag--large {
  padding: 6px 16px;
  font-size: 14px;
  line-height: 1.6;
  min-height: 32px;
}

/* 样式变体 */
.modern-tag--filled {
  background: var(--tag-bg);
  color: var(--tag-text);
  border: 1px solid var(--tag-border);
}

.modern-tag--outlined {
  background: transparent;
  color: var(--tag-border);
  border: 1px solid var(--tag-border);
}

.modern-tag--ghost {
  background: rgba(var(--tag-bg-rgb, 102, 126, 234), 0.1);
  color: var(--tag-border);
  border: 1px solid transparent;
}

.modern-tag--gradient {
  background: var(--tag-bg);
  color: var(--tag-text);
  border: 1px solid var(--tag-border);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

/* 交互状态 */
.modern-tag--clickable {
  cursor: pointer;
  transform: translateY(0);
}

.modern-tag--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  filter: brightness(1.1);
}

.modern-tag--clickable:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 特殊效果 */
.modern-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.modern-tag:hover::before {
  left: 100%;
}

/* 图标样式 */
.tag-icon {
  font-size: 0.9em;
  opacity: 0.8;
}

/* 关闭按钮样式 */
.tag-close {
  font-size: 0.8em;
  opacity: 0.6;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s;
}

.tag-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

/* 动画 */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modern-tag--large {
    padding: 4px 12px;
    font-size: 12px;
    min-height: 28px;
  }
  
  .modern-tag--medium {
    padding: 3px 10px;
    font-size: 11px;
    min-height: 22px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .modern-tag--outlined {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .modern-tag--ghost {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>