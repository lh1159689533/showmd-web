<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Header from '@src/views/main/Header.vue';

const router = useRouter();
const store = useStore();

const currentUser = computed(() => store.getters.getUser);
// 顶部导航菜单
// const menuList = computed(() => store.getters.getMenus);

const handleNoticeClick = (e) => {
  if (!currentUser.value?.id) {
    store.commit('showLogin');
  } else if (e.target.dataset?.link) {
    router.push(e.target.dataset?.link);
  }
};

// TODO-没有权限的菜单，直接url访问如何处理
// watchEffect(() => {
//   if (!menuList.value?.length) {
//     return;
//   }
//   const menu = menuList.value.find((nav) => nav.path === route.path);
//   if (!menu) {
//     router.push('/404');
//   }
// });
</script>

<template>
  <Header is-show-menu>
    <template #other>
      <div @click="handleNoticeClick" class="notice-list flex gap-4 text-sm">
        <el-badge is-dot>消息</el-badge>
        <span>足迹</span>
        <span data-link="/creator">创作中心</span>
      </div>
    </template>
  </Header>
  <div id="main" class="container mt-12">
    <router-view />
  </div>
</template>

<style scoped>
.notice-list {
  color: var(--showmd-text-color-primary);
}

.notice-list > *:hover {
  cursor: pointer;
  color: var(--showmd-text-color-hover);
}
</style>
