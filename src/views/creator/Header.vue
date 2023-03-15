<script lang="ts" setup>
import { useRouter } from 'vue-router';
import MainHeader from '@src/views/main/Header.vue';

const router = useRouter();

const handleNoticeClick = (e) => {
  if (e.target.dataset?.link) {
    router.push(e.target.dataset?.link);
  }
};
</script>

<template>
  <MainHeader title="创作中心" is-to-home>
    <template #other>
      <div @click="handleNoticeClick" class="notice-list flex gap-4 text-sm text-gray-600">
        <el-badge is-dot class="cursor-pointer hover:text-indigo-500">消息</el-badge>
        <span class="cursor-pointer hover:text-indigo-500">足迹</span>
      </div>
    </template>
  </MainHeader>
</template>

<style></style>
