<script lang="ts" setup>
import Header from '@src/views/main/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleNoticeClick = (e) => {
  if (e.target.dataset?.link) {
    router.push(e.target.dataset?.link);
  }
};
</script>

<template>
  <Header is-show-menu>
    <template #other>
      <div @click='handleNoticeClick' class='notice-list flex gap-4 text-sm text-gray-600'>
        <el-badge is-dot class='cursor-pointer hover:text-indigo-500'>消息</el-badge>
        <span class='cursor-pointer hover:text-indigo-500'>足迹</span>
        <span data-link='/creator' class='cursor-pointer hover:text-indigo-500'>创作中心</span>
      </div>
    </template>
  </Header>
  <div id='main' class='container relative top-12'>
    <router-view />
  </div>
</template>

<style scoped>

</style>