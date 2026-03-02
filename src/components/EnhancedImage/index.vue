<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

interface Props {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  lazy?: boolean;
  preview?: boolean;
  previewSrcList?: string[];
  zIndex?: number;
  hideOnClickModal?: boolean;
  teleported?: boolean;
  infinite?: boolean;
  initialIndex?: number;
  closeOnPressEscape?: boolean;
  zoomRate?: number;
  minScale?: number;
  maxScale?: number;
  crossorigin?: string;
  loading?: 'eager' | 'lazy';
  referrerPolicy?: string;
  rounded?: boolean;
  shadow?: boolean;
  hover?: boolean;
  aspectRatio?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fit: 'cover',
  lazy: true,
  preview: false,
  zIndex: 2000,
  hideOnClickModal: true,
  teleported: true,
  infinite: true,
  initialIndex: 0,
  closeOnPressEscape: true,
  zoomRate: 1.2,
  minScale: 0.2,
  maxScale: 7,
  loading: 'lazy',
  rounded: false,
  shadow: false,
  hover: true
});

const imageRef = ref<HTMLImageElement>();
const isLoaded = ref(false);
const isError = ref(false);
const isIntersecting = ref(false);

// 计算样式
const imageStyle = computed(() => {
  const style: Record<string, any> = {
    objectFit: props.fit,
  };
  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }
  
  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio;
  }
  
  return style;
});

const containerClass = computed(() => [
  'enhanced-image',
  {
    'enhanced-image--rounded': props.rounded,
    'enhanced-image--shadow': props.shadow,
    'enhanced-image--hover': props.hover,
    'enhanced-image--loaded': isLoaded.value,
    'enhanced-image--error': isError.value,
  }
]);

// 懒加载
let observer: IntersectionObserver | null = null;

const initLazyLoad = () => {
  if (!props.lazy || !imageRef.value) return;
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isIntersecting.value = true;
          observer?.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '50px'
    }
  );
  
  observer.observe(imageRef.value);
};

const handleLoad = () => {
  isLoaded.value = true;
  isError.value = false;
};

const handleError = () => {
  isError.value = true;
  isLoaded.value = false;
};

onMounted(() => {
  if (props.lazy) {
    initLazyLoad();
  } else {
    isIntersecting.value = true;
  }
});
</script>

<template>
  <div :class="containerClass" :style="imageStyle">
    <!-- 加载占位符 -->
    <div v-if="lazy && !isIntersecting" class="image-placeholder">
      <div class="placeholder-shimmer"></div>
    </div>
    
    <!-- 错误占位符 -->
    <div v-else-if="isError" class="image-error">
      <i class="iconfont icon-image-error"></i>
      <span>图片加载失败</span>
    </div>
    
    <!-- Element Plus Image 组件 -->
    <el-image
      v-else
      ref="imageRef"
      :src="src"
      :alt="alt"
      :fit="fit"
      :lazy="false"
      :preview="preview"
      :preview-src-list="previewSrcList || [src]"
      :z-index="zIndex"
      :hide-on-click-modal="hideOnClickModal"
      :teleported="teleported"
      :infinite="infinite"
      :initial-index="initialIndex"
      :close-on-press-escape="closeOnPressEscape"
      :zoom-rate="zoomRate"
      :min-scale="minScale"
      :max-scale="maxScale"
      :crossorigin="crossorigin"
      :loading="loading"
      :referrer-policy="referrerPolicy"
      @load="handleLoad"
      @error="handleError"
    >
      <!-- 加载中插槽 -->
      <template #placeholder>
        <div class="image-loading">
          <div class="loading-spinner"></div>
        </div>
      </template>
      
      <!-- 错误插槽 -->
      <template #error>
        <div class="image-error">
          <i class="iconfont icon-image-error"></i>
          <span>加载失败</span>
        </div>
      </template>
    </el-image>
    
    <!-- 悬停遮罩 -->
    <div v-if="hover && preview" class="image-overlay">
      <i class="iconfont icon-zoom-in"></i>
      <span v-if="title">{{ title }}</span>
    </div>
  </div>
</template>

<style scoped>
.enhanced-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.enhanced-image--rounded {
  border-radius: 12px;
}

.enhanced-image--shadow {
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.enhanced-image--hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.enhanced-image--loaded {
  background: transparent;
}

.enhanced-image :deep(.el-image) {
  width: 100%;
  height: 100%;
  display: block;
}

.enhanced-image :deep(.el-image__inner) {
  transition: transform 0.3s ease;
}

.enhanced-image--hover:hover :deep(.el-image__inner) {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  position: relative;
  overflow: hidden;
  min-height: 200px;
}

.placeholder-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.image-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(64, 158, 255, 0.2);
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  color: #999;
  min-height: 200px;
}

.image-error i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.image-error span {
  font-size: 0.9rem;
  opacity: 0.7;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.enhanced-image:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.image-overlay span {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  max-width: 80%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-image--hover:hover {
    transform: none;
  }
  
  .enhanced-image--hover:hover :deep(.el-image__inner) {
    transform: none;
  }
  
  .image-overlay {
    display: none;
  }
}
</style>