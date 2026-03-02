<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { findTopArticleList } from '../../service/article';

export default defineComponent({
  name: 'Top',
  setup() {
    const router = useRouter();
    const topList = ref([]);

    findTopArticleList().then((data) => (topList.value = data));

    const toDetail = (id: number) => {
      const { href } = router.resolve(`/article/preview/${id}`);
      window.open(href, '_blank');
    };

    return {
      topList,
      toDetail,
    };
  },
});
</script>

<template>
  <div class="modern-top-list">
    <!-- 🎨 现代化标题栏 -->
    <div class="top-header">
      <div class="header-decoration"></div>
      <div class="header-content">
        <span class="header-icon">🔥</span>
        <h5 class="header-title">热门文章</h5>
        <span class="header-badge">TOP {{ topList?.length || 0 }}</span>
      </div>
    </div>

    <!-- 🎨 文章列表 -->
    <div class="top-content modern-scrollbar">
      <List
        v-if="topList?.length"
        :data-list="topList"
        @click="(item) => toDetail(item?.id)"
        class="article-list"
        item-class=""
      >
        <template #default="{ item, index }">
          <div class="modern-top-item" :class="{ 'top-three': index < 3 }">
            <!-- 🎨 排名徽章 -->
            <div class="rank-badge" :class="`rank-${index + 1}`">
              <span class="rank-number">{{ index + 1 }}</span>
              <div class="rank-glow"></div>
            </div>

            <!-- 文章信息 -->
            <div class="article-info">
              <h6 class="article-name">{{ item.name }}</h6>
              <p class="article-summary">{{ item.summary }}</p>
            </div>

            <!-- 悬浮箭头 -->
            <div class="hover-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </template>
      </List>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无热门文章</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 现代化热门文章列表 */
.modern-top-list {
  background: var(--showmd-bg-color-primary);
  border-radius: 16px;
  overflow: hidden;
}

/* 🎨 标题栏 */
.top-header {
  position: relative;
  padding: 10px 12px;
  border-bottom: 1px solid var(--glass-border);
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--gradient-primary);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.header-title {
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
}

.header-badge {
  padding: 4px 10px;
  background: var(--gradient-warm);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

/* 🎨 内容区域 */
.top-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 4px 0;
}

.article-list {
  padding: 0;
}

/* 🎨 文章条目 */
.modern-top-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: var(--transition-smooth);
  position: relative;
}

.modern-top-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: var(--gradient-primary);
  opacity: 0.1;
  transition: width 0.3s ease;
}

.modern-top-item:hover {
  background: var(--showmd-bg-color-hover);
}

.modern-top-item:hover::before {
  width: 4px;
}

.modern-top-item:hover .hover-arrow {
  opacity: 1;
  transform: translateX(0);
}

.modern-top-item:hover .article-name {
  color: var(--vibrant-purple);
}

/* 🎨 排名徽章 */
.rank-badge {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--showmd-bg-color-weak);
  transition: var(--transition-bounce);
}

.rank-number {
  font-size: 13px;
  font-weight: 700;
  color: var(--showmd-text-color-weak);
  position: relative;
  z-index: 1;
}

.rank-glow {
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  opacity: 0;
  transition: var(--transition-smooth);
}

/* 🎨 前三名特殊样式 */
.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffb800);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.rank-1 .rank-number {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rank-1 .rank-glow {
  background: linear-gradient(135deg, #ffd700, #ffb800);
}

.rank-2 {
  background: linear-gradient(135deg, #e8e8e8, #c0c0c0);
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3);
}

.rank-2 .rank-number {
  color: #666;
}

.rank-2 .rank-glow {
  background: linear-gradient(135deg, #e8e8e8, #c0c0c0);
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #b8860b);
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.3);
}

.rank-3 .rank-number {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rank-3 .rank-glow {
  background: linear-gradient(135deg, #cd7f32, #b8860b);
}

.modern-top-item:hover .rank-badge .rank-glow {
  opacity: 0.3;
}

.top-three:hover .rank-badge {
  transform: scale(1.1) rotate(-5deg);
}

/* 🎨 文章信息 */
.article-info {
  flex: 1;
  min-width: 0;
}

.article-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--showmd-text-color-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: var(--transition-smooth);
}

.article-summary {
  margin: 0;
  font-size: 12px;
  color: var(--showmd-text-color-weak);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 🎨 悬浮箭头 */
.hover-arrow {
  color: var(--vibrant-purple);
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-smooth);
  flex-shrink: 0;
}

/* 🎨 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 30px 20px;
  color: var(--showmd-text-color-weak);
}

.empty-icon {
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 🎨 滚动条美化 */
.modern-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.modern-scrollbar::-webkit-scrollbar-thumb {
  background: var(--gradient-primary);
  border-radius: 2px;
}

.modern-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

/* 🎨 暗色主题适配 */
.dark .modern-top-list {
  background: rgba(24, 24, 27, 0.8);
}

.dark .top-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark .rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: rgba(255, 255, 255, 0.1);
}

.dark .modern-top-item:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>
