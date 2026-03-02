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
  <div class="modern-creator-layout h-screen">
    <Header />
    <div id="creator" class="creator-container container relative top-16 flex">
      <!-- 🎨 毛玻璃侧边栏 -->
      <div class="sider-wrapper">
        <Sider />
      </div>
      <!-- 🎨 主内容区域 -->
      <div class="content-wrapper">
        <div class="content-inner modern-scrollbar">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 创作中心现代化布局 */
.modern-creator-layout {
  background: var(--showmd-bg-color-primary);
}

.creator-container {
  height: calc(100% - 64px);
  gap: 0;
}

/* 🎨 侧边栏容器 */
.sider-wrapper {
  width: 240px;
  height: 100%;
  flex-shrink: 0;
  position: relative;
}

.sider-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--glass-border) 10%,
    var(--glass-border) 90%,
    transparent
  );
}

/* 🎨 内容区域 */
.content-wrapper {
  flex: 1;
  overflow: hidden;
  background: var(--showmd-bg-color-primary);
  position: relative;
}

.content-inner {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
}

/* 🎨 响应式设计 */
@media (max-width: 768px) {
  .sider-wrapper {
    width: 60px;
  }
  
  .content-inner {
    padding: 16px;
  }
}

/* 🎨 暗色主题适配 */
.dark .modern-creator-layout {
  background: rgba(17, 20, 27, 1);
}

.dark .content-wrapper {
  background: rgba(24, 24, 27, 0.8);
}
</style>
