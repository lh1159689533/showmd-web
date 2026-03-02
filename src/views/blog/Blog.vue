<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';
import { useStore } from 'vuex';

import ArticleList from '../article/ArticleList.vue';
import Category from './Category.vue';
import Top from './Top.vue';

import { findArticleList } from '../../service/article';

const store = useStore();

const articleList = ref(null);
const filters = reactive({ category: null, subCategory: null });
const currentSort = ref('latest'); // 默认时间排序
const showSubCategoryDropdown = ref(false); // 控制子分类下拉显示

const isShowHeader = computed(() => store.getters.isShowHeader);

async function getArticleList(category, subCategory, sort?) {
  let params = null;
  if (category && category.key !== 'all') {
    params = {
      filters: {
        category: category.key,
      },
    };
    subCategory && subCategory.key !== 'all' && (params.filters.tags = subCategory.key);
  }
  if (sort === 'latest') {
    params = {
      ...(params ?? {}),
      order: 'desc',
    };
  }
  findArticleList(params).then((result) => {
    articleList.value = result?.map((item) => ({
      ...item,
      tags: [item.category, ...item.tags.split(',')],
      fromNow: dayjs(item.updateTime).fromNow(),
      updateTime: dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
    }));
  });
}

const handleCategoryChange = (category) => {
  filters.category = category;
  // 当切换分类时，子分类默认重置为 null（显示"全部"）
  filters.subCategory = null;
  getArticleList(category, null, currentSort.value);

  // 使用平滑滚动到顶部，减少布局偏移感知
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 处理子分类下拉切换
const toggleSubCategoryDropdown = () => {
  showSubCategoryDropdown.value = !showSubCategoryDropdown.value;
};

// 处理子分类选择
const handleSubCategorySelect = (subCategory) => {
  filters.subCategory = subCategory;
  getArticleList(filters.category, subCategory, currentSort.value);
  showSubCategoryDropdown.value = false;

  // 使用平滑滚动到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.subcategory-dropdown');
  if (!dropdown && showSubCategoryDropdown.value) {
    showSubCategoryDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

getArticleList(filters.category, filters.subCategory, currentSort.value);
</script>

<template>
  <div id="blog" class="modern-blog">
    <!-- 🎨 主内容区域 -->
    <section class="modern-blog-content relative">
      <!-- 🎨 左侧分类导航 -->
      <aside class="category-sidebar">
        <div class="sidebar-sticky" :class="[isShowHeader ? 'top-20' : 'top-4']">
          <Category @change="handleCategoryChange" />
        </div>
      </aside>

      <!-- 中间文章列表 -->
      <div class="content-main relative">
        <!-- 🎨 面包屑导航 -->
        <div class="modern-breadcrumb z-3">
          <div class="breadcrumb-inner h-10">
            <span class="breadcrumb-icon">📚</span>
            <span class="breadcrumb-item active">{{ filters.category?.title || '综合' }}</span>
            <span class="breadcrumb-separator">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>

            <!-- 子分类下拉选择器 -->
            <div class="subcategory-dropdown" v-if="filters.category?.children?.length">
              <div class="subcategory-trigger" :class="{ 'active': showSubCategoryDropdown }"
                @click="toggleSubCategoryDropdown">
                <span class="subcategory-current">{{ filters.subCategory?.title || '全部' }}</span>
                <svg class="dropdown-arrow" :class="{ 'rotated': showSubCategoryDropdown }" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <!-- 下拉列表 -->
              <Transition name="dropdown">
                <div v-if="showSubCategoryDropdown" class="subcategory-list">
                  <div class="subcategory-option" :class="{ 'active': !filters.subCategory }"
                    @click="handleSubCategorySelect(null)">
                    <span class="option-dot"></span>
                    <span class="option-text">全部</span>
                  </div>
                  <div v-for="subCategory in filters.category.children" :key="subCategory.key"
                    class="subcategory-option" :class="{ 'active': filters.subCategory?.key === subCategory.key }"
                    @click="handleSubCategorySelect(subCategory)">
                    <span class="option-dot"></span>
                    <span class="option-text">{{ subCategory.title }}</span>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- 没有子分类时显示普通文本 -->
            <span v-else class="breadcrumb-item">{{ filters.subCategory?.title || '全部' }}</span>
          </div>
        </div>

        <!-- 文章列表容器 -->
        <div class="articles-container">
          <ArticleList :data="articleList" />
        </div>
      </div>

      <!-- 🎨 右侧边栏 -->
      <aside class="content-aside">
        <div class="aside-sticky" :class="[isShowHeader ? 'top-20' : 'top-4']">
          <!-- 热门文章卡片 -->
          <div class="modern-aside-card">
            <Top />
          </div>

          <!-- 🎨 快捷操作卡片 -->
          <div class="modern-aside-card quick-actions">
            <h5 class="quick-title">
              <span class="title-icon">✨</span>
              快捷操作
            </h5>
            <div class="quick-buttons">
              <router-link to="/article/new" target="_blank" class="quick-btn write-btn">
                <span class="btn-icon">✏️</span>
                <span>写文章</span>
              </router-link>
              <router-link to="/creator" class="quick-btn creator-btn">
                <span class="btn-icon">🎨</span>
                <span>创作中心</span>
              </router-link>
            </div>
          </div>

          <!-- 🎨 统计卡片 -->
          <div class="modern-aside-card stats-card">
            <div class="stats-item">
              <span class="stats-icon">📝</span>
              <span class="stats-label">文章数</span>
              <span class="stats-value">{{ articleList?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>

<style scoped>
/* 🎨 博客页面现代化样式 */
.modern-blog {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 🎨 主内容布局 - 三栏布局 */
.modern-blog-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  position: relative;
}

/* 🎨 左侧分类导航 */
.category-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.sidebar-sticky {
  position: fixed;
  width: 240px;
  transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 中间主内容区域 */
.content-main {
  flex: 1;
  min-width: 0;
  transition: padding-top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--showmd-bg-color-primary);
  border-radius: 20px;
  padding: 8px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-float);
  animation: fadeIn-d0d79c36 0.4s ease-out;
}

/* 🎨 右侧边栏 */
.content-aside {
  width: 320px;
  flex-shrink: 0;
}

.aside-sticky {
  position: fixed;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🎨 现代化面包屑 */
.modern-breadcrumb {
  margin-bottom: 8px;
  animation: slideUp 0.3s ease-out;
  margin-top: 0;
  /* 确保与侧边栏卡片顶部对齐 */
  position: relative;
}

.breadcrumb-inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: 25px;
  font-size: 14px;
}

.breadcrumb-icon {
  font-size: 16px;
}

.breadcrumb-item {
  color: var(--showmd-text-color-weak);
  transition: var(--transition-smooth);
}

.breadcrumb-item.active {
  color: var(--vibrant-purple);
  font-weight: 600;
}

.breadcrumb-separator {
  color: var(--showmd-border-color);
  display: flex;
  align-items: center;
}

/* 🎨 子分类下拉选择器 */
.subcategory-dropdown {
  position: relative;
  display: inline-block;
}

.subcategory-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition-smooth);
  border: 1px solid transparent;
  background: var(--glass-bg);
}

.subcategory-trigger:hover {
  background: var(--showmd-bg-color-hover);
  border-color: var(--glass-border);
}

.subcategory-trigger.active {
  background: var(--showmd-bg-color-active);
  border-color: var(--vibrant-purple);
  color: var(--vibrant-purple);
}

.subcategory-current {
  font-size: 14px;
  color: var(--showmd-text-color-weak);
  transition: var(--transition-smooth);
  min-width: 40px;
}

.subcategory-trigger.active .subcategory-current {
  color: var(--vibrant-purple);
  font-weight: 500;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  color: var(--showmd-text-color-weak);
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.subcategory-trigger.active .dropdown-arrow {
  color: var(--vibrant-purple);
}

/* 下拉列表 */
.subcategory-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--showmd-bg-color-primary);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: var(--shadow-float);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  z-index: 100;
  overflow: hidden;
  min-width: 120px;
}

.subcategory-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: var(--transition-smooth);
  border-bottom: 1px solid var(--glass-border);
}

.subcategory-option:last-child {
  border-bottom: none;
}

.subcategory-option:hover {
  background: var(--showmd-bg-color-hover);
}

.subcategory-option.active {
  background: var(--showmd-bg-color-active);
  color: var(--vibrant-purple);
}

.option-dot {
  width: 6px;
  height: 6px;
  background: var(--showmd-text-color-weak);
  border-radius: 50%;
  flex-shrink: 0;
  transition: var(--transition-smooth);
}

.subcategory-option:hover .option-dot {
  background: var(--vibrant-purple);
  transform: scale(1.2);
}

.subcategory-option.active .option-dot {
  background: var(--vibrant-purple);
  transform: scale(1.3);
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
}

.option-text {
  font-size: 13px;
  color: var(--showmd-text-color-secondary);
  transition: var(--transition-smooth);
}

.subcategory-option.active .option-text {
  color: var(--vibrant-purple);
  font-weight: 500;
}

/* 下拉动画 */
.dropdown-enter-active {
  transition: all 0.3s ease-out;
}

.dropdown-leave-active {
  transition: all 0.2s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

/* 🎨 文章列表容器 */
.articles-container {
  /* background: var(--showmd-bg-color-primary);
  border-radius: 20px;
  padding: 8px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-float);
  animation: fadeIn 0.4s ease-out; */
}

/* 🎨 统一对齐基准 */
.sidebar-sticky,
.aside-sticky {
  /* 确保所有固定元素都有相同的基准对齐 */
  box-sizing: border-box;
}

/* 确保中间内容区与固定侧边栏视觉对齐 */
.content-main.pt-20 {
  padding-top: 80px;
  /* 5rem = 80px */
}

.content-main.pt-4 {
  padding-top: 16px;
  /* 1rem = 16px */
}

/* 🎨 右侧边栏 */
.content-aside {
  width: 320px;
  flex-shrink: 0;
}

.aside-sticky {
  position: fixed;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🎨 侧边栏卡片 */
.modern-aside-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  transition: var(--transition-smooth);
  animation: slideUp 0.4s ease-out;
}

.modern-aside-card:hover {
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

/* 🎨 快捷操作卡片 */
.quick-actions {
  padding: 12px;
}

.quick-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin: 0 0 16px 0;
}

.title-icon {
  font-size: 18px;
}

.quick-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: var(--transition-bounce);
  position: relative;
  overflow: hidden;
}

.quick-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.quick-btn:hover::before {
  left: 100%;
}

.write-btn {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-float);
}

.write-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.creator-btn {
  background: var(--glass-bg);
  color: var(--showmd-text-color-primary);
  border: 1px solid var(--glass-border);
}

.creator-btn:hover {
  border-color: var(--vibrant-purple);
  color: var(--vibrant-purple);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 18px;
}

/* 🎨 统计卡片 */
.stats-card {
  padding: 12px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-icon {
  font-size: 24px;
}

.stats-label {
  flex: 1;
  color: var(--showmd-text-color-weak);
  font-size: 14px;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 🎨 动画关键帧 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 🎨 响应式设计 */
@media (max-width: 1200px) {
  .content-aside {
    display: none;
  }

  .content-main {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .category-sidebar {
    display: none;
  }

  .modern-blog-content {
    flex-direction: column;
  }

  .content-main {
    width: 100%;
  }

  /* 在移动端显示简化的分类选择 */
  .content-main::before {
    content: '';
    display: block;
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .modern-blog {
    padding: 0 12px;
  }

  .modern-blog-content {
    padding-top: 0;
  }

  .content-main {
    padding-top: 20px !important;
  }

  .breadcrumb-inner {
    padding: 8px 16px;
    font-size: 13px;
  }

  .articles-container {
    border-radius: 16px;
    padding: 12px;
  }
}

/* 🎨 暗色主题适配 */
.dark .breadcrumb-inner {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .subcategory-trigger {
  background: rgba(0, 0, 0, 0.3);
}

.dark .subcategory-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .subcategory-list {
  background: rgba(24, 24, 27, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .subcategory-option {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark .subcategory-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .articles-container {
  background: rgba(24, 24, 27, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .modern-aside-card {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .creator-btn {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .creator-btn:hover {
  border-color: var(--neon-purple);
  color: var(--neon-purple);
}
</style>
