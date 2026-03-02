<script lang="ts" setup>
import { defineProps, computed, ref, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import EnhancedImage from '@components/EnhancedImage/index.vue';
import ModernTag from '@components/ModernTag/index.vue';
import { findUserById } from '@service/user';

const store = useStore();

defineProps<{ data: any[] }>();

const router = useRouter();
const categorys = computed(() => store.getters.getCategoryList);

// 气泡相关状态
const bubbleVisible = ref(false);
const currentAuthor = ref(null);
const bubbleStyle = ref({});
const authorBubble = ref(null);

// 用户信息缓存
const userCache = ref(new Map());

// 防抖定时器
let showTimer: NodeJS.Timeout | null = null;
let hideTimer: NodeJS.Timeout | null = null;

// 当前悬浮的作者ID，用于避免重复触发
let currentHoveredAuthorId: number | null = null;

const toDetail = (id: number) => {
  const { href } = router.resolve(`/article/preview/${id}`);
  window.open(href, '_blank');
};

const toUserDetail = (id) => {
  console.log(id);
};

const onImgError = (item, e: Event) => {
  item.hasCover = false;
  (e?.target as HTMLElement)?.classList?.add?.('hidden');
};

// 显示作者气泡（带防抖和重复检查）
const showAuthorBubble = async (event: MouseEvent, author: any) => {
  // 阻止事件冒泡，避免与List组件事件冲突
  event.stopPropagation();

  // 如果已经在悬浮相同作者，直接返回
  if (currentHoveredAuthorId === author.id) {
    return;
  }

  // 更新当前悬浮的作者ID
  currentHoveredAuthorId = author.id;

  // 清除隐藏定时器
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  // 如果已经显示相同作者的气泡，直接返回
  if (bubbleVisible.value && currentAuthor.value?.id === author.id) {
    return;
  }

  // 清除之前的显示定时器
  if (showTimer) {
    clearTimeout(showTimer);
  }

  // 设置防抖延迟
  showTimer = setTimeout(async () => {
    // 再次检查是否还在悬浮相同作者（防止快速移动）
    if (currentHoveredAuthorId !== author.id) {
      return;
    }

    // 检查缓存，避免重复请求
    let authorData = userCache.value.get(author.id);
    if (!authorData) {
      authorData = await findUserById(author.id);
      if (authorData) {
        userCache.value.set(author.id, authorData);
      }
    }

    // 最后一次检查，确保用户还在悬浮
    if (currentHoveredAuthorId !== author.id) {
      return;
    }

    currentAuthor.value = authorData;
    bubbleVisible.value = true;

    await nextTick();

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const bubbleEl = authorBubble.value as HTMLElement;

    if (bubbleEl) {
      const bubbleRect = bubbleEl.getBoundingClientRect();

      bubbleStyle.value = {
        position: 'fixed',
        left: `${rect.left + rect.width / 2 - bubbleRect.width / 2}px`,
        top: `${rect.top - bubbleRect.height - 10}px`,
        zIndex: 1000
      };
    }
    showTimer = null;
  }, 300); // 增加到300ms防抖延迟，减少频繁触发
};

// 隐藏作者气泡（带防抖和状态重置）
const hideAuthorBubble = (event?: MouseEvent) => {
  // 阻止事件冒泡
  if (event) {
    event.stopPropagation();
  }

  // 重置当前悬浮的作者ID
  currentHoveredAuthorId = null;

  // 清除显示定时器
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }

  // 设置隐藏延迟，避免鼠标快速移动时闪烁
  hideTimer = setTimeout(() => {
    bubbleVisible.value = false;
    currentAuthor.value = null;
    hideTimer = null;
  }, 150); // 增加到150ms隐藏延迟
};

// 组件卸载时清理定时器和状态
onUnmounted(() => {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  // 重置状态
  currentHoveredAuthorId = null;
  bubbleVisible.value = false;
  currentAuthor.value = null;
});
</script>

<template>
  <div id="articleList" class="modern-article-list">
    <el-skeleton v-if="!data" :rows="3" animated class="p-6" />
    <List v-else-if="data?.length" :data-list="data" @click="(item) => toDetail(item?.id)" item-class="">
      <template #default="{ item }">
        <article class="modern-article-card group">
          <!-- 🎨 渐变边框容器 -->
          <div class="card-border-gradient"></div>

          <!-- 🎨 主要内容区域 -->
          <div class="card-content">
            <div class="content-main" :style="`max-width: ${!item?.hasCover ? '100%' : '75%'};`">
              <!-- 标题和描述 -->
              <div class="article-content">
                <h3 class="article-title">{{ item.name }}</h3>
                <p class="article-summary">{{ item.summary }}</p>
              </div>

              <!-- 底部信息栏 -->
              <div class="article-meta">
                <!-- 作者信息 -->
                <div class="author-info" @click.stop="toUserDetail" @mouseenter="showAuthorBubble($event, item.user)"
                  @mouseleave="hideAuthorBubble($event)">
                  <span class="author-name">{{ item.user.name }}</span>
                </div>

                <!-- 时间信息 -->
                <div class="publish-time">
                  <el-tooltip :content="item.updateTime || item.createTime" effect="light" :show-after="500">
                    <span class="time-text">{{ item.fromNow }}</span>
                  </el-tooltip>
                </div>

                <!-- 🎨 现代化标签 -->
                <div class="tag-container">
                  <ModernTag
                    v-for="(tag, index) in item.tags?.map(tag => categorys?.find(c => c.key === tag)?.title).filter(Boolean)"
                    :key="`${tag}-${index}`" :text="tag" :variant="'gradient'" :size="'small'" :index="index"
                    :clickable="true" @click="() => handleTagClick(tag)" />
                </div>
              </div>
            </div>

            <!-- 🎨 增强封面图片 -->
            <div v-if="item?.hasCover" class="article-cover">
              <EnhancedImage :src="item.cover" :alt="`${item.name} 封面`" :title="item.name" fit="cover" :preview="true"
                :rounded="true" :shadow="true" :hover="true" aspect-ratio="1.4/1"
                @error="() => onImgError(item, $event)" />
            </div>
          </div>

          <!-- 🎨 悬浮效果光晕 -->
          <div class="card-glow"></div>
        </article>
      </template>
    </List>
    <Empty v-else class="modern-empty">
      <div class="empty-content">
        <div class="empty-icon">✨</div>
        <p>还没有文章，快来发表第一篇文章吧</p>
        <router-link to="/article/new" target="_blank" class="create-article-btn">
          <span>写文章</span>
        </router-link>
      </div>
    </Empty>

    <!-- 作者信息气泡 -->
    <div ref="authorBubble" class="author-bubble" :class="{ 'show': bubbleVisible }" :style="bubbleStyle"
      @mouseenter="() => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }"
      @mouseleave="hideAuthorBubble">
      <div class="bubble-content">
        <div class="author-header">
          <div class="author-avatar-large">
            <img v-if="currentAuthor?.avatar" :src="currentAuthor.avatar" :alt="currentAuthor.name" />
            <span v-else>{{ currentAuthor?.name?.charAt(0) }}</span>
          </div>
          <div class="author-details">
            <div class="author-name-large">{{ currentAuthor?.name }}</div>
          </div>
        </div>
        <div class="author-stats">
          <span class="stat-item">文章 {{ currentAuthor?.articleCnt || 0 }}</span>
          <span class="stat-item">专栏 {{ currentAuthor?.columnCnt || 0 }}</span>
        </div>
      </div>
      <div class="bubble-arrow"></div>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 现代化文章列表样式 */
.modern-article-list {
  padding: 0;
  margin: 0;
}

.modern-article-list>ul {
  padding: 8px;
}

/* 🎨 现代化文章卡片 */
.modern-article-card {
  position: relative;
  margin: 0 0 10px 0;
  padding: 6px 10px;
  background: var(--showmd-bg-color-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition-smooth);
  overflow: hidden;
  border: 1px solid var(--showmd-border-color);
}

/* 🎨 渐变边框效果 */
.card-border-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-primary);
  border-radius: 16px;
  opacity: 0;
  z-index: -1;
  transition: var(--transition-smooth);
}

.modern-article-card::before {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  background: var(--showmd-bg-color-primary);
  border-radius: 15px;
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 🎨 悬浮动画效果 */
.modern-article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-float);
}

.modern-article-card:hover .card-border-gradient {
  opacity: 0.1;
}

.modern-article-card:hover .card-glow {
  opacity: 1;
  transform: scale(1.02);
}

/* 🎨 悬浮光晕效果 */
.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--gradient-primary);
  border-radius: 18px;
  opacity: 0;
  z-index: -2;
  filter: blur(8px);
  transition: var(--transition-smooth);
}

/* 🎨 内容区域 */
.content-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-content {
  flex: 1;
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
  transition: var(--transition-smooth);
}

.modern-article-card:hover .article-title {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-summary {
  font-size: 14px;
  color: var(--showmd-text-color-weak);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 🎨 文章元信息 */
.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--showmd-text-color-weak);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.author-info:hover {
  color: var(--vibrant-green);
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
  transition: var(--transition-smooth);
}

.author-info:hover .author-avatar {
  transform: scale(1.1);
  box-shadow: var(--shadow-glow);
}

.author-name {
  font-weight: 500;
}

.publish-time {
  position: relative;
  padding-left: 16px;
}

.time-text {
  transition: var(--transition-smooth);
  border-bottom: 1px dotted transparent;
  padding: 2px 4px;
  border-radius: 4px;
}

.time-text:hover {
  color: var(--vibrant-green);
  border-bottom-color: var(--vibrant-green);
  background: rgba(16, 185, 129, 0.05);
}

.publish-time::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 12px;
  background: var(--showmd-border-color);
}

/* 🎨 现代化标签容器 */
.tag-container {
  display: flex;
  gap: 6px;
  margin-left: auto;
  flex-wrap: wrap;
  align-items: center;
}

/* 🎨 增强封面图片 */
.article-cover {
  position: relative;
  width: 140px;
  height: 100px;
  flex-shrink: 0;
}

.article-cover :deep(.enhanced-image) {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.modern-article-card:hover .article-cover :deep(.enhanced-image) {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* 🎨 空状态样式 */
.modern-empty {
  border: none;
  background: var(--showmd-bg-color-primary);
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.empty-icon {
  font-size: 48px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.empty-content p {
  color: var(--showmd-text-color-weak);
  font-size: 16px;
  margin: 0;
}

.create-article-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: var(--transition-bounce);
  box-shadow: var(--shadow-float);
}

.create-article-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
  text-decoration: none;
  color: white;
}

/* 🎨 响应式设计 */
@media (max-width: 768px) {
  .modern-article-card {
    margin: 0 0 16px 0;
    padding: 20px;
  }

  .card-content {
    flex-direction: column;
    gap: 16px;
  }

  .content-main {
    max-width: 100% !important;
  }

  .article-cover {
    width: 100%;
    height: 160px;
    order: -1;
  }

  .article-meta {
    flex-wrap: wrap;
    gap: 12px;
  }

  .tag-container {
    margin-left: 0;
    width: 100%;
  }
}

/* 🎨 暗色主题适配 */
.dark .time-text:hover {
  background: rgba(16, 185, 129, 0.1);
}

/* 🎨 暗色主题适配 */
.dark .modern-article-card {
  background: rgba(24, 24, 27, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .modern-article-card::before {
  background: rgba(24, 24, 27, 0.95);
}

.dark .modern-empty {
  background: rgba(24, 24, 27, 0.8);
}

/* 🎨 作者信息气泡样式 */
.author-bubble {
  position: fixed;
  background: var(--showmd-bg-color-primary);
  border: 1px solid var(--showmd-border-color);
  border-radius: 12px;
  padding: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px) scale(0.95);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  min-width: 200px;
  backdrop-filter: blur(20px);
}

.author-bubble.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.bubble-content {
  position: relative;
}

.author-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.author-avatar-large {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  flex-shrink: 0;
}

.author-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  flex: 1;
}

.author-name-large {
  font-size: 16px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin: 0;
}

.author-stats {
  display: flex;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid var(--showmd-border-color);
}

.stat-item {
  font-size: 13px;
  color: var(--showmd-text-color-weak);
  white-space: nowrap;
}

.bubble-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: var(--showmd-bg-color-primary);
  border: 1px solid var(--showmd-border-color);
  border-top: none;
  border-left: none;
  transform: translateX(-50%) rotate(45deg);
}

/* 🎨 暗色主题适配 */
.dark .author-bubble {
  background: rgba(24, 24, 27, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark .bubble-arrow {
  background: rgba(24, 24, 27, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
