<script lang="ts" setup>
import { h, defineAsyncComponent } from 'vue';
import { confirm } from '@utils/messageBox';
const ImageProcess = defineAsyncComponent(() => import('@src/views/mytool/ImageProcess.vue'));
const DiffEditor = defineAsyncComponent(() => import('@src/views/mytool/DiffEditor.vue'));
const SourceEventTest = defineAsyncComponent(() => import('@src/views/mytool/SourceEventTest.vue'));
const PackageTestRun = defineAsyncComponent(() => import('@src/views/mytool/PackageTestRun.vue'));

interface ITool {
  name: string;
  description: string;
  component: any;
}

const tools: ITool[] = [
  {
    name: '图片处理',
    description: '图片的格式转换、压缩、去白边等。',
    component: ImageProcess,
  },
  {
    name: 'js包测试运行',
    description: '实时引入js的CDN包，即可测试运行该包的方法。',
    component: PackageTestRun,
  },
  {
    name: '代码对比',
    description: '对比代码的差异性。',
    component: DiffEditor,
  },
  {
    name: 'sse',
    description: '测试sse',
    component: SourceEventTest,
  },
];

const show = (tool: ITool) => {
  confirm(h(tool.component), {
    title: tool.name,
    customClass: 'mytool-modal',
    showConfirmButton: false,
    showCancelButton: false,
  });
};
</script>

<template>
  <div class="mytool flex flex-col items-center h-full">
    <List
      :data-list="tools" @click="(item) => show(item)"
      class="mt-4 tool-list py-8 w-full flex flex-row flex-wrap gap-4 pl-4"
      item-class="tool-item-box cursor-pointer text-base rounded-sm bg-white dark:bg-zinc-900"
    >
      <template #default="{ item }">
        <div class="tool-item flex flex-col">
          <div class="tool-item-body flex-1 box-border p-4">
            <div class="tool-item-name text font-medium text-base cursor-pointer truncate text-gray-900 dark:text-zinc-300">
              {{ item.name }}
            </div>
            <div class="tool-item-desc my-2 text-sm h-10 text-gray-600 dark:text-zinc-500">{{ item.description }}</div>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>

<style>
.mytool-modal {
  max-width: 72% !important;
  height: 90%;
  padding: 0;
}

.mytool-modal .el-message-box__btns {
  display: none;
}

.mytool-modal .el-message-box__header {
  border-bottom: 1px solid;
  @apply border-gray-200 dark:border-zinc-800;
}

.mytool-modal .el-message-box__content {
  padding: 0;
  height: calc(100% - 44px);
}

.mytool-modal .el-message-box__container {
  height: 100%;
}

.mytool-modal .el-message-box__message {
  height: 100%;
}

.mytool-modal .el-message-box__headerbtn {
  z-index: 2001;
}

.mytool .tool-list {
  --column-gap: 16px;
  --row-gap: 16px;
}

.mytool .tool-list .tool-item-box {
  transition: box-shadow 0.3s, border-color 0.3s;
  transform-origin: center;
  border: 1px solid;
  @apply border-gray-200 dark: border-zinc-900;
}

.mytool .tool-list .tool-item-box:hover {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
  border-color: transparent;
}

.dark .mytool .tool-list .tool-item-box:hover {
  box-shadow: 0 1px 2px -2px rgba(255, 255, 255, 0.10), 0 3px 6px 0 rgba(255, 255, 255, 0.10), 0 5px 12px 4px rgba(255, 255, 255, 0.10);
  border-color: transparent;
}

.mytool .tool-list .tool-item-box .tool-item-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (min-width: 1200px) {
  .tool-item-box {
    display: block;
    flex: 0 0 25%;
    min-width: 0;
    max-width: calc(25% - var(--column-gap));
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .tool-item-box {
    display: block;
    flex: 0 0 50%;
    min-width: 0;
    max-width: calc(50% - var(--column-gap));
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .tool-item-box {
    display: block;
    flex: 0 0 50%;
    min-width: 0;
    max-width: calc(50% - var(--column-gap));
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .tool-item-box {
    display: block;
    flex: 0 0 50%;
    min-width: 0;
    max-width: calc(50% - var(--column-gap));
  }
}
</style>
