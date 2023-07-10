<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const active = ref('/creator/manage/article');

watchEffect(() => {
  active.value = route.path;
});

const handleSelect = (path) => {
  router.push(path);
};
</script>

<template>
  <el-menu @select="handleSelect" class="sider h-full" :default-openeds="['manage']" :default-active="active">
    <el-menu-item index="/creator">
      <i class="iconfont icon-home text-lg" style="padding: 1px 10px 0 0"></i>
      <template #title>首页</template>
    </el-menu-item>
    <el-sub-menu index="manage">
      <template #title>
        <i class="iconfont icon-guanli text-lg" style="padding: 1px 10px 0 0"></i>
        <span>内容管理</span>
      </template>
      <el-menu-item index="/creator/manage/article">文章管理</el-menu-item>
      <el-menu-item index="/creator/manage/column">专栏管理</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style>
.sider .el-menu .el-menu-item {
  padding-left: 54px !important;
}

.sider .el-menu-item {
  padding-left: 23px;
}
</style>
