<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

interface Category {
  key: string;
  title: string;
  parent: string;
  children?: Category[];
  icon?: string;
}

interface IEmits {
  (e: 'change', activeCategory?: Category, activeSubCategory?: Category): void;
}

const emit = defineEmits<IEmits>();
const store = useStore();

const categoryAllList = ref<Category[]>([]);
const categoryList = ref<Category[]>([]);
const activeCategory = ref<Category | null>(null);
const activeSubCategory = ref<Category | null>(null);
const loading = ref(true);

// 分类图标映射 - 参考掘金风格
const categoryIcons: Record<string, string> = {
  // 前端技术
  'frontend': '🎨',
  'javascript': '🟨', 
  'vue': '💚',
  'react': '⚛️',
  'angular': '🔴',
  'typescript': '🔷',
  'css': '🎨',
  'html': '🌐',
  'webpack': '📦',
  'nodejs': '🟢',
  
  // 后端技术
  'backend': '⚙️',
  'java': '☕',
  'python': '🐍',
  'golang': '🐹',
  'php': '🐘',
  'csharp': '🔷',
  'ruby': '💎',
  'rust': '🦀',
  'spring': '🍃',
  'django': '🎸',
  
  // 移动开发
  'mobile': '📱',
  'android': '🤖',
  'ios': '🍎',
  'flutter': '🐦',
  'reactnative': '⚛️',
  'kotlin': '🟣',
  'swift': '🧡',
  
  // 数据库
  'database': '🗄️',
  'mysql': '🐬',
  'postgresql': '🐘',
  'mongodb': '🍃',
  'redis': '🔴',
  'elasticsearch': '🔍',
  
  // 运维部署
  'devops': '🚀',
  'docker': '🐳',
  'kubernetes': '☸️',
  'jenkins': '🔧',
  'nginx': '🌐',
  'linux': '🐧',
  'aws': '☁️',
  'git': '📝',
  
  // 人工智能
  'ai': '🤖',
  'machinelearning': '🧠',
  'deeplearning': '🔬',
  'nlp': '💬',
  'opencv': '👁️',
  'tensorflow': '🔥',
  'pytorch': '🔥',
  
  // 架构设计
  'architecture': '🏗️',
  'microservices': '🔗',
  'serverless': '⚡',
  'api': '🔌',
  'graphql': '📊',
  'restful': '🌐',
  
  // 工具效率
  'tools': '🔧',
  'vscode': '💙',
  'vim': '💚',
  'chrome': '🌐',
  'postman': '📮',
  'figma': '🎨',
  
  // 测试
  'testing': '🧪',
  'jest': '🃏',
  'cypress': '🌲',
  'selenium': '🕷️',
  
  // 安全
  'security': '🔒',
  'oauth': '🔐',
  'jwt': '🎫',
  'https': '🔒',
  
  // 性能优化
  'performance': '⚡',
  'cdn': '🌍',
  'cache': '💾',
  'optimization': '📈',
  
  // 其他
  'tutorial': '📚',
  'news': '📰',
  'career': '💼',
  'interview': '💬',
  'opensource': '🌟',
  'community': '👥',
  'conference': '🎤',
  'book': '📖',
  'course': '🎓',
  'blog': '✍️'
};

// 获取分类图标
const getCategoryIcon = (key: string): string => {
  return categoryIcons[key] || '📝';
};

// 初始化分类数据
const init = async () => {
  try {
    loading.value = true;
    categoryAllList.value = await store.dispatch('listCategory');
    categoryList.value = categoryAllList.value
      .filter((c) => c.parent === '0')
      .map((item) => ({
        ...item,
        children: categoryAllList.value.filter(({ parent }) => parent === item.key),
        icon: getCategoryIcon(item.key)
      }));
    
    // 设置默认选中第一个分类
    if (categoryList.value.length > 0) {
      activeCategory.value = categoryList.value[0];
      if (activeCategory.value.children?.length) {
        activeSubCategory.value = activeCategory.value.children[0];
      }
      // 触发初始选择事件
      emit('change', activeCategory.value, activeSubCategory.value || undefined);
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    loading.value = false;
  }
};

// 处理分类选择
const handleCategorySelect = (category: Category) => {
  activeCategory.value = category;
  activeSubCategory.value = null;
  
  if (category.children?.length) {
    activeSubCategory.value = category.children[0];
  }
  
  emit('change', category, activeSubCategory.value || undefined);
};

// 处理子分类选择
const handleSubCategorySelect = (subCategory: Category) => {
  activeSubCategory.value = subCategory;
  if (activeCategory.value) {
    emit('change', activeCategory.value, subCategory);
  }
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="sidebar-category-nav">
    <!-- 🎨 现代化标题栏 -->
    <div class="nav-header">
      <div class="header-decoration"></div>
      <div class="header-content">
        <span class="header-icon">📚</span>
        <h5 class="header-title">分类导航</h5>
        <span class="header-badge">{{ categoryList.length }}</span>
      </div>
    </div>

    <!-- 🎨 分类列表 -->
    <div class="nav-content modern-scrollbar">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-skeleton">
          <div v-for="i in 6" :key="i" class="skeleton-item">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-badge"></div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!categoryList.length" class="empty-state">
        <span class="empty-icon">📂</span>
        <p>暂无分类数据</p>
      </div>

      <!-- 主分类列表 -->
      <div v-else class="category-list">
        <div
          v-for="category in categoryList"
          :key="category.key"
          class="category-item"
          :class="{ 
            'active': activeCategory?.key === category.key,
            'has-children': category.children?.length 
          }"
          @click="handleCategorySelect(category)"
        >
          <!-- 分类图标和标题 -->
          <div class="category-main">
            <span class="category-icon">{{ getCategoryIcon(category.key) }}</span>
            <span class="category-title">{{ category.title }}</span>
            <span v-if="category.children?.length" class="category-count">
              {{ category.children.length }}
            </span>
          </div>

          <!-- 活跃指示器 -->
          <div v-if="activeCategory?.key === category.key" class="active-indicator"></div>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped>
/* 🎨 侧边栏分类导航 */
.sidebar-category-nav {
  background: var(--showmd-bg-color-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-float);
  border: 1px solid var(--glass-border);
}

/* 🎨 标题栏 */
.nav-header {
  position: relative;
  padding: 12px 16px;
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
  font-size: 18px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.header-title {
  flex: 1;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
}

.header-badge {
  padding: 2px 8px;
  background: var(--gradient-warm);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

/* 🎨 内容区域 */
.nav-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 8px 0;
}

/* 🎨 加载状态 */
.loading-state {
  padding: 8px;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--showmd-bg-color-weak);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--showmd-bg-color-active);
}

.skeleton-text {
  flex: 1;
  height: 14px;
  border-radius: 7px;
  background: var(--showmd-bg-color-active);
}

.skeleton-badge {
  width: 20px;
  height: 16px;
  border-radius: 8px;
  background: var(--showmd-bg-color-active);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 🎨 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
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
.category-list {
  padding: 0;
}

.category-list .category-item {
  animation: slideInLeft 0.4s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.category-list .category-item:nth-child(1) { animation-delay: 0.1s; }
.category-list .category-item:nth-child(2) { animation-delay: 0.15s; }
.category-list .category-item:nth-child(3) { animation-delay: 0.2s; }
.category-list .category-item:nth-child(4) { animation-delay: 0.25s; }
.category-list .category-item:nth-child(5) { animation-delay: 0.3s; }
.category-list .category-item:nth-child(6) { animation-delay: 0.35s; }
.category-list .category-item:nth-child(7) { animation-delay: 0.4s; }
.category-list .category-item:nth-child(8) { animation-delay: 0.45s; }

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.category-item {
  position: relative;
  margin: 2px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition-smooth);
  overflow: hidden;
  border: 1px solid transparent;
}

.category-item::before {
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

.category-item::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: var(--transition-smooth);
}

.category-item:hover {
  background: var(--showmd-bg-color-hover);
  border-color: var(--glass-border);
  transform: translateX(2px);
}

.category-item:hover::before {
  width: 3px;
}

.category-item:hover::after {
  opacity: 0.03;
}

.category-item.active {
  background: var(--showmd-bg-color-active);
  border-color: var(--vibrant-purple);
  transform: translateX(4px);
}

.category-item.active::before {
  width: 3px;
  opacity: 1;
}

.category-item.active::after {
  opacity: 0.05;
}

.category-main {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  position: relative;
}

.category-icon {
  font-size: 16px;
  flex-shrink: 0;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--showmd-bg-color-weak);
  position: relative;
}

.category-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: var(--transition-smooth);
}

.category-item:hover .category-icon {
  transform: scale(1.1);
  background: var(--showmd-bg-color-active);
}

.category-item:hover .category-icon::before {
  opacity: 0.1;
}

.category-item.active .category-icon {
  transform: scale(1.1);
  background: var(--vibrant-purple);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.category-item.active .category-icon::before {
  opacity: 0.2;
}

.category-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--showmd-text-color-primary);
  transition: var(--transition-smooth);
}

.category-item.active .category-title {
  color: var(--vibrant-purple);
  font-weight: 600;
}

.category-count {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--showmd-bg-color-weak);
  border-radius: 10px;
  color: var(--showmd-text-color-weak);
  min-width: 16px;
  text-align: center;
  transition: var(--transition-smooth);
  font-weight: 600;
  border: 1px solid var(--glass-border);
}

.category-item:hover .category-count {
  background: var(--showmd-bg-color-active);
  border-color: var(--vibrant-purple);
  color: var(--showmd-text-color-primary);
  transform: scale(1.05);
}

.category-item.active .category-count {
  background: var(--vibrant-purple);
  color: white;
  border-color: var(--vibrant-purple);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
  transform: scale(1.05);
}

.active-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: var(--vibrant-purple);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 8px rgba(102, 126, 234, 0.5); }
  to { box-shadow: 0 0 12px rgba(102, 126, 234, 0.8); }
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
.dark .sidebar-category-nav {
  background: rgba(24, 24, 27, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .nav-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark .category-count {
  background: rgba(255, 255, 255, 0.1);
}
</style>
