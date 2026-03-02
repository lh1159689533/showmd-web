<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const active = ref('/creator/manage/article');
const expandedMenus = ref(['manage']);

// 菜单配置
const menuItems = [
  {
    key: '/creator',
    icon: '🏠',
    title: '首页',
    type: 'item'
  },
  {
    key: 'manage',
    icon: '📁',
    title: '内容管理',
    type: 'submenu',
    children: [
      { key: '/creator/manage/article', icon: '📝', title: '文章管理' },
      { key: '/creator/manage/column', icon: '📚', title: '专栏管理' },
    ]
  }
];

watchEffect(() => {
  active.value = route.path;
});

const handleSelect = (path) => {
  router.push(path);
};

const toggleSubmenu = (key) => {
  const index = expandedMenus.value.indexOf(key);
  if (index > -1) {
    expandedMenus.value.splice(index, 1);
  } else {
    expandedMenus.value.push(key);
  }
};

const isExpanded = (key) => expandedMenus.value.includes(key);
const isActive = (key) => active.value === key;
const isChildActive = (item) => item.children?.some(child => child.key === active.value);
</script>

<template>
  <nav class="modern-sider">
    <!-- 🎨 侧边栏头部 -->
    <div class="sider-header">
      <div class="header-content">
        <span class="header-icon">🎨</span>
        <span class="header-title">创作中心</span>
      </div>
    </div>

    <!-- 🎨 菜单列表 -->
    <div class="sider-menu modern-scrollbar">
      <template v-for="item in menuItems" :key="item.key">
        <!-- 普通菜单项 -->
        <div 
          v-if="item.type === 'item'"
          class="menu-item"
          :class="{ active: isActive(item.key) }"
          @click="handleSelect(item.key)"
        >
          <div class="item-content">
            <span class="item-icon">{{ item.icon }}</span>
            <span class="item-title">{{ item.title }}</span>
          </div>
          <div class="item-indicator"></div>
        </div>

        <!-- 子菜单 -->
        <div v-else-if="item.type === 'submenu'" class="menu-submenu">
          <div 
            class="submenu-header"
            :class="{ expanded: isExpanded(item.key), 'has-active': isChildActive(item) }"
            @click="toggleSubmenu(item.key)"
          >
            <div class="item-content">
              <span class="item-icon">{{ item.icon }}</span>
              <span class="item-title">{{ item.title }}</span>
            </div>
            <span class="expand-arrow">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
                :class="{ rotated: isExpanded(item.key) }"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </span>
          </div>
          
          <transition name="submenu">
            <div v-show="isExpanded(item.key)" class="submenu-content">
              <div 
                v-for="child in item.children" 
                :key="child.key"
                class="submenu-item"
                :class="{ active: isActive(child.key) }"
                @click="handleSelect(child.key)"
              >
                <span class="child-icon">{{ child.icon }}</span>
                <span class="child-title">{{ child.title }}</span>
                <div class="item-indicator"></div>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </div>

    <!-- 🎨 底部快捷操作 -->
    <div class="sider-footer">
      <router-link to="/article/new" target="_blank" class="quick-write-btn">
        <span class="btn-icon">✏️</span>
        <span class="btn-text">写文章</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
/* 🎨 现代化侧边栏 */
.modern-sider {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
}

/* 🎨 侧边栏头部 */
.sider-header {
  padding: 20px 16px;
  border-bottom: 1px solid var(--glass-border);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 🎨 菜单列表 */
.sider-menu {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

/* 🎨 菜单项 */
.menu-item,
.submenu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition-smooth);
  position: relative;
}

.menu-item:hover,
.submenu-header:hover {
  background: var(--showmd-bg-color-hover);
}

.menu-item.active {
  background: var(--gradient-primary);
  box-shadow: var(--shadow-glow);
}

.menu-item.active .item-title {
  color: white;
  font-weight: 600;
}

.menu-item.active .item-icon {
  transform: scale(1.1);
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  font-size: 18px;
  transition: var(--transition-bounce);
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--showmd-text-color-primary);
  transition: var(--transition-smooth);
}

/* 🎨 活动指示器 */
.item-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: var(--gradient-primary);
  border-radius: 0 4px 4px 0;
  transition: height 0.2s ease;
}

.menu-item.active .item-indicator,
.submenu-item.active .item-indicator {
  height: 60%;
}

/* 🎨 子菜单头部 */
.submenu-header.has-active {
  background: rgba(139, 92, 246, 0.1);
}

.submenu-header.has-active .item-title {
  color: var(--vibrant-purple);
}

.expand-arrow {
  color: var(--showmd-text-color-weak);
  transition: var(--transition-smooth);
}

.expand-arrow svg {
  transition: transform 0.3s ease;
}

.expand-arrow svg.rotated {
  transform: rotate(180deg);
}

.submenu-header.expanded .expand-arrow {
  color: var(--vibrant-purple);
}

/* 🎨 子菜单内容 */
.submenu-content {
  padding-left: 16px;
  overflow: hidden;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  margin: 4px 0;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition-smooth);
  position: relative;
}

.submenu-item:hover {
  background: var(--showmd-bg-color-hover);
}

.submenu-item.active {
  background: rgba(139, 92, 246, 0.15);
}

.submenu-item.active .child-title {
  color: var(--vibrant-purple);
  font-weight: 600;
}

.child-icon {
  font-size: 14px;
  opacity: 0.8;
}

.child-title {
  font-size: 13px;
  color: var(--showmd-text-color-weak);
  transition: var(--transition-smooth);
}

/* 🎨 子菜单展开动画 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 🎨 底部快捷操作 */
.sider-footer {
  padding: 16px;
  border-top: 1px solid var(--glass-border);
}

.quick-write-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  background: var(--gradient-primary);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition-bounce);
  box-shadow: var(--shadow-float);
  position: relative;
  overflow: hidden;
}

.quick-write-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.quick-write-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.quick-write-btn:hover::before {
  left: 100%;
}

.btn-icon {
  font-size: 16px;
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
.dark .modern-sider {
  background: rgba(0, 0, 0, 0.4);
}

.dark .sider-header,
.dark .sider-footer {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .menu-item:hover,
.dark .submenu-header:hover,
.dark .submenu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark .submenu-item.active {
  background: rgba(157, 78, 221, 0.15);
}

.dark .submenu-item.active .child-title {
  color: var(--neon-purple);
}

.dark .submenu-header.has-active {
  background: rgba(157, 78, 221, 0.1);
}

.dark .submenu-header.has-active .item-title {
  color: var(--neon-purple);
}

/* 🎨 响应式设计 */
@media (max-width: 768px) {
  .header-title,
  .item-title,
  .child-title,
  .btn-text {
    display: none;
  }
  
  .sider-header {
    padding: 16px 12px;
    justify-content: center;
  }
  
  .menu-item,
  .submenu-header {
    justify-content: center;
    padding: 12px;
  }
  
  .expand-arrow {
    display: none;
  }
  
  .submenu-content {
    padding-left: 0;
  }
  
  .submenu-item {
    justify-content: center;
    padding: 10px;
  }
  
  .quick-write-btn {
    padding: 14px;
  }
}
</style>
