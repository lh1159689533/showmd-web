<script lang="ts" setup>
import { defineProps, defineEmits, computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { getElementById, querySelector } from './domUtil';

interface ICatalog {
  id: string; // 目录节点ID
  title: string; // 目录节点title
  indent: string; // 目录节点level
  contentKey: string; // 目录关联的内容区key，通过getAttribute(contentKey)获取内容区ID
  contentSelector: string; // 内容区Selector，通过querySelector查询内容区dom
}

const props = defineProps<{
  data: ICatalog[];
  threshold: number; // 内容区联动目录树阈值
}>();

const emit = defineEmits<{ (e: 'onLoaded'): void }>();

const store = useStore();

const isShowHeader = computed(() => store.getters.isShowHeader);

const activeId = ref('');
let isCatalogClick = false; // 是否是点击目录，如果是则不触发onScroll

// 根据body高度，计算出目录高度
const bodyHeight = window.screen.height;
const height = ref(bodyHeight * 1);

/**
 * 选中的目录节点变化
 * @param newActiveId 新选中的节点id
 */
const catalogActiveChanged = (newActiveId) => {
  if (!newActiveId) return;
  activeId.value = newActiveId;
  getElementById(activeId.value)?.scrollIntoView({ block: 'center', behavior: 'auto' });
};

/**
 * 内容关联目录(内容区滚动时目录关联滚动)
 */
const contentLinkCatalog = (headers) => {
  headers?.forEach(({ contentSelector, contentKey }) => {
    const node = querySelector(contentSelector);
    if (node) {
      const obeserver = new IntersectionObserver(
        function (entries) {
          const [entry] = entries;
          const { isIntersecting, boundingClientRect, target } = entry ?? {};
          // isOutlineClick=true说明是点击目录节点触发的Vditor内部的滚动事件，不需要再执行以下自定义滚动事件
          if (isCatalogClick) {
            return;
          }
          let newActiveId = null;
          const contentId = target.getAttribute(contentKey);
          if (isIntersecting === false && boundingClientRect?.y < props.threshold) {
            newActiveId = `catalog-${contentId}`;
          } else if (isIntersecting === true && boundingClientRect?.y < props.threshold) {
            const index = headers.findIndex((h) => h.id === `catalog-${contentId}`);
            newActiveId = headers[index === 0 ? 0 : index - 1].id;
          }
          if (newActiveId) catalogActiveChanged(newActiveId);
        },
        {
          rootMargin: '-60px 0px 0px 0px',
        }
      );
      obeserver.observe(node);
    }
  });
};

/**
 * 点击目录
 * @param catalog 目录数据
 */
const handleCatalogClick = (catalog: ICatalog) => {
  if (!catalog) return;
  isCatalogClick = true;
  activeId.value = catalog.id;
  querySelector(catalog.contentSelector)?.scrollIntoView?.({ block: 'start', behavior: 'auto' });
  setTimeout(() => (isCatalogClick = false), 800);
};

const onScroll = () => {
  const scrollTop = document.documentElement.scrollTop;
  if (scrollTop <= 0) {
    catalogActiveChanged(props.data[0].id);
  }
};

onMounted(() => {
  catalogActiveChanged(props.data[0].id);
  contentLinkCatalog(props.data);
  document.addEventListener('scroll', onScroll);
  emit('onLoaded');
  store.commit('catalogHeight', height.value);
});

onBeforeUnmount(() => {
  document.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div
    class="catalog-container" v-if="data?.length" :style="[isShowHeader ? 'top: 105px' : 'top: 32px']"
    style="transition: 300ms"
  >
    <nav class="relative h-full">
      <h4 class="title font-bold pl-4 py-2 border-b">目录</h4>
      <div class="catalog-list overflow-y-auto overflow-x-hidden absolute right-0 w-full">
        <List
          :data-list="data" @click="handleCatalogClick" class="w-full"
          item-class="py-2 truncate cursor-pointer relative text-sm"
        >
          <template #default="{ item }">
            <el-tooltip effect="customized" placement="left" :show-after="500">
              <template #content>
                <span class="overflow-clip inline-block" style="max-width: 350px">{{ item.title }}</span>
              </template>
              <span :id="item.id" :class="[`indent-${item.indent}`, item.id === activeId ? 'active' : '']">
                {{ item.title }}
              </span>
            </el-tooltip>
          </template>
        </List>
      </div>
    </nav>
  </div>
</template>

<style>
.catalog-container {
  width: 260px;
  height: 100%;
  background-color: var(--showmd-bg-color-primary);
  border-left: 1px solid #dadde6;
}

.catalog-container nav h4 {
  height: 50px;
  border-color: var(--showmd-border-color);
  color: var(--showmd-text-color-primary);
}

.catalog-list {
  height: calc(100% - 50px);
}

.catalog-list ul>li:hover {
  background-color: var(--showmd-bg-color-weak);
}

.catalog-list ul>li>span.active::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 60%;
  @apply left-0 rounded-tr-lg rounded-br-lg;
  background-color: var(--showmd-text-color-hover);
}

.catalog-list ul>li>span.active {
  color: var(--showmd-text-color-hover);
}

.catalog-list ul>li>span {
  color: var(--showmd-text-color-primary);
}

.indent-H1,
.indent-header1 {
  padding-left: 10px;
}

.indent-H2,
.indent-header2 {
  padding-left: 26px;
}

.indent-H3,
.indent-header3 {
  padding-left: 42px;
}

.indent-H4,
.indent-header4 {
  padding-left: 58px;
}

.indent-H5,
.indent-header5 {
  padding-left: 74px;
}

.indent-H6,
.indent-header6 {
  padding-left: 90px;
}
</style>
