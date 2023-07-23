<script lang="ts" setup>
import { useRouter } from 'vue-router';
import Header from './Header.vue';
import Sider from './Sider.vue';

const { beforeEach } = useRouter();

beforeEach((to, from) => {
  console.log(to, from)
});
</script>

<template>
  <div class="h-screen">
    <Header />
    <div id="creator" class="container relative top-12 flex" style="height: calc(100% - 48px)">
      <div class="w-52 h-full">
        <Sider />
      </div>
      <div class="flex-1 overflow-hidden bg-white dark:bg-zinc-900">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
