<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';

import Holiday from '@components/Holiday.vue';
import UserOprate from './UserOprate.vue';
import ThemeToggle from '../../components/ThemeToggle/index.vue';

const props = defineProps<{
  isShowMenu?: boolean;
  isShowSearch?: boolean;
  isToHome?: boolean;
  title?: string;
}>();

const router = useRouter();
const route = useRoute();
const store = useStore();
// 顶部导航菜单
// const menuList = ref([]);

// 选中的顶部导航菜单key
const activeKey = ref('');
const headerCls = ref('');
const currentScrollTop = ref(0);

// const isDark = computed(() => store.getters.isDark);
const isShowHeader = computed(() => store.getters.isShowHeader);
// 顶部导航菜单
const menuList = computed(() => store.getters.getMenus);

async function init() {
  store.dispatch('getUserInfo');
  store.dispatch('getUserMenu');
  // const menus = await listMenu();
  // menuList.value = menus.map((m) => ({
  //   ...m,
  //   key: m.title,
  // }));

  // // 根据路由适配导航菜单
  // const menu = menuList.value.find((nav) => nav.path === route.path);
  // activeKey.value = menu?.key ?? '';
}

// 导航变化
const changeNav = (nav) => {
  activeKey.value = nav.key;
  router.push(nav.path);
};

const toHomePage = () => {
  props.isToHome && router.push('/');
};

// 滚动事件，滚动高度大于500时隐藏header头
function onScroll() {
  const { scrollTop } = document.body;
  if (scrollTop > 500 && isShowHeader.value) {
    store.commit('hide');
    headerCls.value = 'animate__animated animate__slideOutUp animate__faster';
  }
  if (scrollTop < currentScrollTop.value && !isShowHeader.value) {
    store.commit('show');
    headerCls.value = 'animate__animated animate__slideInDown animate__faster';
  }
  currentScrollTop.value = scrollTop;
}

onMounted(() => {
  document.body.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('scroll', onScroll);
});

watchEffect(() => {
  // 根据路由适配导航菜单
  if (route.path === '/' || route.path === '/home') {
    activeKey.value = menuList.value.find(nav => nav.path === '/')?.key;
  } else {
    const menu = menuList.value.find((nav) => nav.path !== '/' && route.path.startsWith(nav.path));
    activeKey.value = menu?.key ?? '';
  }
});

init();
</script>

<template>
  <div class="modern-header h-16 w-full fixed top-0 z-2000" :class="headerCls">
    <Holiday />
    <header class="container h-full flex items-center">
      <!-- 🎨 升级后的 Logo -->
      <div @click="toHomePage" class="modern-logo mr-8 cursor-pointer group">
        <div class="logo-container">
          <div class="logo-icon"></div>
          <div class="logo-text">ShowMD</div>
        </div>
      </div>

      <div class="flex-1 flex items-center h-full">
        <!-- 🎨 升级后的导航菜单 -->
        <List v-if="isShowMenu" :data-list="menuList" @click="changeNav"
          class="modern-nav-list flex mr-16 h-full flex-1" item-class="min-w-max">
          <template #default="{ item }">
            <span class="nav-item" :class="[item.key === activeKey ? 'active' : '']">
              {{ item.title }}
            </span>
          </template>
        </List>
        <div v-if="title" class="page-title">{{ title }}</div>
      </div>

      <!-- 🎨 升级后的搜索框 -->
      <div v-if="isShowSearch" class="modern-search-container">
        <div class="search-wrapper">
          <el-input :prefix-icon="Search" placeholder="搜索内容..." class="modern-search" clearable />
          <div class="search-glow"></div>
        </div>
      </div>

      <div class="flex ml-8 items-center h-full">
        <UserOprate />
        <slot name="other"></slot>
        <ThemeToggle class="ml-8" />
      </div>
    </header>
  </div>
</template>

<style>
/* 🎨 现代化 Header 样式 */
.modern-header {
  /* 毛玻璃背景效果 */
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: var(--transition-smooth);
}

.modern-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-primary);
  opacity: 0.05;
  z-index: -1;
}

/* 🎨 现代化 Logo 设计 */
.modern-logo {
  position: relative;
  transition: var(--transition-bounce);
}

.modern-logo:hover {
  transform: translateY(-2px);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 12px;
  position: relative;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-float);
}

.logo-icon::before {
  content: '✨';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  animation: logoGlow 2s ease-in-out infinite alternate;
}

.modern-logo:hover .logo-icon {
  transform: rotate(5deg) scale(1.05);
  box-shadow: var(--shadow-glow);
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

@keyframes logoGlow {
  0% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* 🎨 现代化导航菜单 */
.modern-nav-list li {
  color: var(--showmd-text-color-primary);
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 32px;
  position: relative;
  font-size: 15px;
  font-weight: 500;
  transition: var(--transition-smooth);
}

.modern-nav-list .nav-item {
  padding: 8px 16px;
  border-radius: 20px;
  position: relative;
  transition: var(--transition-smooth);
}

.modern-nav-list .nav-item:hover {
  color: var(--vibrant-green);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  transform: translateY(-1px);
}

.modern-nav-list .nav-item.active {
  color: white;
  background: var(--gradient-primary);
  box-shadow: var(--shadow-glow);
  font-weight: 600;
}

.modern-nav-list .nav-item.active::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--gradient-primary);
  border-radius: 22px;
  z-index: -1;
  opacity: 0.3;
  animation: activeGlow 2s ease-in-out infinite alternate;
}

@keyframes activeGlow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }

  100% {
    opacity: 0.5;
    transform: scale(1.02);
  }
}

/* 🎨 现代化搜索框 */
.modern-search-container {
  position: relative;
  width: 320px;
}

.search-wrapper {
  position: relative;
  transition: var(--transition-smooth);
}

.search-wrapper:hover {
  transform: translateY(-1px);
}

.modern-search {
  width: 100%;
  border-radius: 25px !important;
  transition: var(--transition-smooth);
}

.modern-search .el-input__wrapper {
  background: var(--glass-bg) !important;
  backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border) !important;
  border-radius: 25px !important;
  box-shadow: var(--shadow-float) !important;
  transition: var(--transition-smooth) !important;
  padding: 0 20px !important;
  height: 44px !important;
}

.modern-search .el-input__wrapper:hover {
  border-color: var(--vibrant-green) !important;
  box-shadow: var(--shadow-glow) !important;
}

.modern-search .el-input__wrapper.is-focus {
  border-color: var(--vibrant-green) !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1), var(--shadow-glow) !important;
}

.modern-search .el-input__inner {
  color: var(--showmd-text-color-primary) !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

.modern-search .el-input__inner::placeholder {
  color: var(--showmd-text-color-weak) !important;
}

.modern-search .el-input__prefix-inner {
  color: var(--vibrant-green) !important;
}

.search-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 25px;
  background: var(--gradient-primary);
  opacity: 0;
  z-index: -1;
  transition: var(--transition-smooth);
}

.search-wrapper:focus-within .search-glow {
  opacity: 0.1;
  animation: searchPulse 2s ease-in-out infinite;
}

@keyframes searchPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.1;
  }

  50% {
    transform: scale(1.02);
    opacity: 0.15;
  }
}

/* 🎨 页面标题样式 */
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 🎨 响应式设计 */
@media (max-width: 768px) {
  .modern-header {
    height: 60px;
  }

  .modern-nav-list {
    display: none;
  }

  .modern-search-container {
    width: 200px;
  }

  .logo-text {
    display: none;
  }
}

/* 🎨 暗色主题适配 */
.dark .modern-header {
  background: rgba(0, 0, 0, 0.4);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark .modern-search .el-input__wrapper {
  background: rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
