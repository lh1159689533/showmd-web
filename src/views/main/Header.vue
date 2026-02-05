<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';

import Holiday from '@components/Holiday.vue';
import UserOprate from './UserOprate.vue';
import ThemeIcon from './ThemeIcon.vue';

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
  const { scrollTop } = document.documentElement;
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
  document.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  document.removeEventListener('scroll', onScroll);
});

watchEffect(() => {
  // 根据路由适配导航菜单
  const menu = menuList.value.find((nav) => nav.path === route.path);
  activeKey.value = menu?.key ?? '';
});

init();
</script>

<template>
  <div class="header h-12 w-full border-b fixed top-0 z-2000" :class="headerCls">
    <Holiday />
    <header class="container h-full flex items-center">
      <div @click="toHomePage" class="lanis-logo mr-6 text-2xl font-bold text-indigo-500 cursor-pointer"></div>
      <div class="flex-1 flex items-center h-full">
        <List v-if="isShowMenu" :data-list="menuList" @click="changeNav" class="nav-list flex mr-16 h-full flex-1"
          item-class="min-w-max">
          <template #default="{ item }">
            <span :class="[item.key === activeKey ? 'text-indigo-500 font-bold' : '']">{{ item.title }}</span>
          </template>
        </List>
        <div v-if="title">{{ title }}</div>
      </div>
      <div v-if="isShowSearch" class="flex items-center h-10 relative w-80">
        <el-input :prefix-icon="Search" placeholder="Search projects" class="search w-full text-sm" />
      </div>
      <div class="flex ml-16 items-center h-full">
        <UserOprate />
        <slot name="other"></slot>
      </div>
    </header>
    <ThemeIcon />
  </div>
</template>

<style>
.header {
  background-color: var(--showmd-bg-color-primary);
  border-color: var(--showmd-border-color);
}

.header .search {
  color: var(--showmd-text-color-primary);
  caret-color: var(--showmd-text-color-primary);
}

.header .search:hover {
  border-color: var(--showmd-border-color-hover);
}

.lanis-logo {
  background-image: url('/api/lanis-logo.webp');
  background-size: 100% 100%;
  width: 83px;
  height: 32px;
}

.nav-list li {
  color: var(--showmd-text-color-primary);
  @apply h-full cursor-pointer flex items-center mr-6 relative text-sm;
}

.nav-list li:hover {
  color: var(--showmd-text-color-hover);
}

.nav-list li:hover::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  bottom: 0;
  left: -2px;
  @apply bg-indigo-500;
}
</style>
