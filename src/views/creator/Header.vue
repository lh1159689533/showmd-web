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
      <div @click="handleNoticeClick" class="notice-list flex gap-4 text-sm">
        <el-badge is-dot>消息</el-badge>
        <span>足迹</span>
      </div>
    </template>
  </MainHeader>
</template>

<style>
.notice-list {
  color: var(--showmd-text-color-primary);
}

.notice-list > *:hover {
  cursor: pointer;
  color: var(--showmd-text-color-hover);
}
</style>
