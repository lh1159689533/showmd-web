<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { IBabyGrowth, getMediaUrl } from '@service/babyGrowth';
import Avatar from '@src/components/Avatar.vue';

interface Props {
  show: boolean;
  record: IBabyGrowth | null;
  cardRect: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  finalRect: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const modalAnimating = ref(false);
const currentImageIndex = ref(0);
const currentImages = ref<string[]>([]);

// 媒体类型常量
const MEDIA_TYPE = {
  IMAGE: 1,
  VIDEO: 2,
};

// 监听 record 变化，初始化图片数据
watch(() => props.record, (newRecord) => {
  if (newRecord) {
    // 初始化图片数据
    if (newRecord.mediaType === MEDIA_TYPE.IMAGE) {
      currentImages.value = newRecord.mediaUrls || [getMediaUrl(newRecord.id!)];
    } else {
      currentImages.value = [];
    }
    currentImageIndex.value = 0;
  }
});

// 监听显示状态变化
watch(() => props.show, async (show) => {
  if (show) {
    modalAnimating.value = true;
    await nextTick();
    modalAnimating.value = false;
  }
});

// 上一张图片
function prevImage() {
  if (currentImages.value.length > 1 && currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}

// 下一张图片
function nextImage() {
  if (currentImages.value.length > 1 && currentImageIndex.value < currentImages.value.length - 1) {
    currentImageIndex.value++;
  }
}

// 跳转到指定图片
function goToImage(index: number) {
  if (index >= 0 && index < currentImages.value.length) {
    currentImageIndex.value = index;
  }
}

// 关闭弹窗
function closeModal() {
  modalAnimating.value = true;

  // 动画结束后关闭弹窗
  setTimeout(() => {
    emit('close');
    modalAnimating.value = false;
    currentImages.value = [];
    currentImageIndex.value = 0;
  }, 250);
}

// 键盘事件处理
function handleKeydown(event: KeyboardEvent) {
  if (!props.show || currentImages.value.length <= 1) return;

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (currentImageIndex.value > 0) {
      prevImage();
    }
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (currentImageIndex.value < currentImages.value.length - 1) {
      nextImage();
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div v-if="show" class="modal-overlay" :class="{ 'animating': modalAnimating }" @click="closeModal">
    <div class="modal-content" :class="{ 'animating': modalAnimating }" :style="{
      '--card-width': cardRect.width + 'px',
      '--card-height': cardRect.height + 'px',
      '--card-top': cardRect.top + 'px',
      '--card-left': cardRect.left + 'px',
      '--final-width': finalRect.width + 'px',
      '--final-height': finalRect.height + 'px',
      '--final-top': finalRect.top + 'px',
      '--final-left': finalRect.left + 'px'
    }" @click.stop>
      <!-- 关闭按钮 -->
      <button class="modal-close-btn" @click="closeModal">
        <X :size="24" />
      </button>

      <div class="modal-body">
        <!-- 左侧：媒体展示区 -->
        <div class="modal-left">
          <!-- 图片轮播区域 -->
          <div v-if="record?.mediaType === MEDIA_TYPE.IMAGE" class="image-carousel">
            <div class="carousel-container">
              <div class="carousel-track" :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
                <div v-for="(image, index) in currentImages" :key="index" class="carousel-slide">
                  <img :src="image" :alt="record.title" class="carousel-image" />
                </div>
              </div>

              <!-- 切换按钮 -->
              <button v-if="currentImages.length > 1 && currentImageIndex > 0" class="carousel-btn prev-btn"
                @click="prevImage">
                <ChevronLeft :size="18" />
              </button>
              <button v-if="currentImages.length > 1 && currentImageIndex < currentImages.length - 1"
                class="carousel-btn next-btn" @click="nextImage">
                <ChevronRight :size="18" />
              </button>

              <!-- 切换按钮（置灰状态） -->
              <button v-if="currentImages.length > 1 && currentImageIndex === 0" class="carousel-btn prev-btn disabled"
                disabled>
                <ChevronLeft :size="18" />
              </button>
              <button v-if="currentImages.length > 1 && currentImageIndex === currentImages.length - 1"
                class="carousel-btn next-btn disabled" disabled>
                <ChevronRight :size="18" />
              </button>

              <!-- 图片指示器 -->
              <div v-if="currentImages.length > 1" class="carousel-indicators">
                <button v-for="(_, index) in currentImages" :key="index" class="indicator"
                  :class="{ 'active': index === currentImageIndex }" @click="goToImage(index)"></button>
              </div>

              <!-- 图片计数 -->
              <div v-if="currentImages.length > 1" class="image-counter">
                {{ currentImageIndex + 1 }}/{{ currentImages.length }}
              </div>
            </div>
          </div>

          <!-- 视频播放区域 -->
          <div v-else-if="record?.mediaType === MEDIA_TYPE.VIDEO" class="video-container">
            <video :src="getMediaUrl(record.id!)" class="modal-video" controls preload="metadata" autoplay />
          </div>
        </div>

        <!-- 右侧：信息展示区 -->
        <div class="modal-right">
          <!-- 作者信息 -->
          <div class="author-info">
            <div class="author-avatar">
              <Avatar :src="record?.user?.avatar" :name="record?.user?.name" size="medium"
                class="user-avatar avatar-active" show-ring />
            </div>
            <div class="author-details">
              <h3 class="author-name">{{ record?.user?.name }}</h3>
            </div>
          </div>

          <!-- 内容描述 -->
          <div class="content-section">
            <h2 class="content-title">{{ record?.title }}</h2>
            <p v-if="record?.description" class="content-description">
              <span v-html="record.description"></span>
            </p>
            <p class="publish-time">{{ record?.formattedTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2001;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-overlay.animating {
  animation: fadeOut 0.25s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.modal-content {
  position: fixed;
  background: var(--showmd-bg-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);

  /* 初始状态：卡片的位置和尺寸 */
  width: var(--card-width);
  height: var(--card-height);
  top: var(--card-top);
  left: var(--card-left);

  /* 动画到最终状态 */
  animation: morphToModal 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.modal-content.animating {
  /* 关闭时从最终状态回到卡片状态 */
  width: var(--final-width);
  height: var(--final-height);
  top: var(--final-top);
  left: var(--final-left);
  animation: morphToCard 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes morphToModal {
  from {
    width: var(--card-width);
    height: var(--card-height);
    top: var(--card-top);
    left: var(--card-left);
  }

  to {
    width: var(--final-width);
    height: var(--final-height);
    top: var(--final-top);
    left: var(--final-left);
  }
}

@keyframes morphToCard {
  from {
    width: var(--final-width);
    height: var(--final-height);
    top: var(--final-top);
    left: var(--final-left);
  }

  to {
    width: var(--card-width);
    height: var(--card-height);
    top: var(--card-top);
    left: var(--card-left);
  }
}

/* 关闭按钮 */
.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  color: var(--showmd-text-color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close-btn:hover {
  background: var(--showmd-danger-color);
  color: white;
  transform: scale(1.1);
}

/* 弹窗主体 - 左右布局 */
.modal-body {
  display: flex;
  height: 100%;
  overflow: hidden;
}

/* 左侧媒体区域 */
.modal-left {
  flex: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  position: relative;
}

/* 图片轮播容器 */
.image-carousel {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* 轮播切换按钮 */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
  opacity: 0;
}

.carousel-btn:hover:not(.disabled) {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.disabled {
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
  transform: translateY(-50%);
}

.modal-left:hover .carousel-btn,
.modal-left:hover .image-counter {
  opacity: 1;
}

.prev-btn {
  left: 16px;
}

.next-btn {
  right: 16px;
}

/* 图片指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

/* 图片计数 */
.image-counter {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  z-index: 5;
  opacity: 0;
}

/* 视频容器 */
.video-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-video {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

/* 右侧信息区域 */
.modal-right {
  flex: 0.6;
  display: flex;
  flex-direction: column;
  background: var(--showmd-bg-color);
  border-left: 1px solid var(--glass-border);
  overflow-y: auto;
}

/* 作者信息 */
.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border-radius: 50%;
  color: var(--showmd-text-color-secondary);
}

.author-name {
  color: var(--showmd-text-color-primary);
}

.publish-time {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--showmd-text-color-weak);
}

/* 内容区域 */
.content-section {
  padding: 20px 24px;
  border-bottom: 1px solid var(--glass-border);
}

.content-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  line-height: 1.4;
}

.content-description {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--showmd-text-color-secondary);
  line-height: 1.6;
}

/* 弹窗响应式 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-content {
    /* 移动端使用简化的缩放动画 */
    position: fixed !important;
    animation: mobileScaleIn 0.3s ease-out forwards !important;
  }

  .modal-content.animating {
    animation: mobileScaleOut 0.2s ease-in forwards !important;
  }

  .modal-body {
    flex-direction: column;
    height: auto;
  }

  .modal-left {
    flex: none;
    height: 300px;
    border-bottom: 1px solid var(--glass-border);
  }

  .modal-right {
    flex: none;
    border-left: none;
    max-height: 400px;
  }

  .author-info,
  .content-section {
    padding-left: 16px;
    padding-right: 16px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
  }

  .prev-btn {
    left: 12px;
  }

  .next-btn {
    right: 12px;
  }

  /* 移动端动画 */
  @keyframes mobileScaleIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes mobileScaleOut {
    from {
      transform: scale(1);
      opacity: 1;
    }

    to {
      transform: scale(0.8);
      opacity: 0;
    }
  }
}

/* 弹窗暗色主题 */
.dark .modal-content {
  background: rgba(24, 24, 27, 0.95);
  backdrop-filter: blur(20px);
}

.dark .modal-left {
  background: rgba(0, 0, 0, 0.3);
}
</style>