<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';
import storage from '@src/utils/storage';

import UserOprate from './UserOprate.vue';
import Holiday from '@components/Holiday.vue';

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
const theme = ref('light');

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

const changeTheme = () => {
  const x = 0;
  const y = 0;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  let hasDark = false;
  const transition = (document as any).startViewTransition(() => {
    const root = document.documentElement;
    hasDark = root.classList.contains('dark');
    root.classList.remove(hasDark ? 'dark' : 'light');
    root.classList.add(hasDark ? 'light' : 'dark');
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${innerWidth}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${innerHeight}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 500,
        easing: 'ease-in',
        pseudoElement: '::view-transition-new(root)',
      }
    );
    theme.value = !hasDark ? 'dark' : 'light';
    storage.setItem('theme', theme.value);
  });
};

onMounted(() => {
  document.addEventListener('scroll', onScroll);
  theme.value = storage.getItem('theme') ?? 'light';
  document.documentElement.classList.remove(document.documentElement.classList.item(0));
  document.documentElement.classList.add(theme.value);
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
  <div
    class="h-12 w-full bg-white border-b fixed top-0 z-2000 dark:border-indigo-900 dark:bg-zinc-900"
    :class="headerCls"
  >
    <Holiday />
    <header class="container h-full flex items-center">
      <div @click="toHomePage" class="lanis-logo mr-6 text-2xl font-bold text-indigo-500 cursor-pointer"></div>
      <div class="flex-1 flex items-center h-full">
        <List
          v-if="isShowMenu" :data-list="menuList" @click="changeNav" class="flex text-black mr-16 h-full flex-1"
          item-class="nav-list text-gray-800 dark:text-zinc-200 min-w-max hover:text-black"
        >
          <template #default="{ item }">
            <span :class="[item.key === activeKey ? 'text-indigo-500 font-bold' : '']">{{ item.title }}</span>
          </template>
        </List>
        <div v-if="title">{{ title }}</div>
      </div>
      <div v-if="isShowSearch" class="flex items-center h-10 relative w-80">
        <el-input
          :prefix-icon="Search" placeholder="Search projects"
          class="text-gray-400 caret-gray-400 w-full text-sm hover:border-gray-400"
        />
      </div>
      <div class="flex ml-16 items-center h-full">
        <UserOprate />
        <slot name="other"></slot>
      </div>
    </header>
    <span @click="changeTheme" class="absolute top-4 right-6 text-gray-300 text-sm cursor-pointer">
      <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" class="w-6 h-6">
        <path
          fill-rule="evenodd" clip-rule="evenodd"
          d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
          class="fill-gray-300/20"
        ></path>
        <path
          d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
          class="fill-gray-300"
        ></path>
        <path
          fill-rule="evenodd" clip-rule="evenodd"
          d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
          class="fill-gray-300"
        ></path>
      </svg>
      <svg
        v-else viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="w-6 h-6"
      >
        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" class="fill-orange-200/20 stroke-orange-200"></path>
        <path
          d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
          class="stroke-orange-300"
        ></path>
      </svg>
    </span>
  </div>
</template>

<style>
.lanis-logo {
  background-image: url('/api/lanis-logo.webp');
  background-size: 100% 100%;
  width: 83px;
  height: 32px;
}

.nav-list {
  @apply h-full cursor-pointer flex items-center mr-6 relative text-sm;
}

.nav-list:hover::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  bottom: 0;
  left: -2px;
  @apply bg-indigo-500;
}

.input-icon {
  @apply text-gray-400;
}
</style>
