<script lang="ts" setup>
import { defineProps, defineEmits, computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { getElementById } from './domUtil';

interface ICatalog {
  id: string;
  title: string;
  indent: string;
}

const props = defineProps<{
  data: ICatalog[];
}>();

const emit = defineEmits<{ (e: 'onLoaded'): void }>();

const store = useStore();

const isShowHeader = computed(() => store.getters.isShowHeader);

const activeId = ref('');
let isCatalogClick = false; // 是否是点击目录，如果是则不触发onScroll

// 根据body高度，计算出目录高度
const bodyHeight = window.screen.height;
const height = ref(bodyHeight * 0.5);

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
  headers?.forEach(({ id }) => {
    const node = getElementById(id?.replace('catalog-', ''));
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
          if (isIntersecting === false && boundingClientRect?.y < 60) {
            newActiveId = `catalog-${target.id}`;
          } else if (isIntersecting === true && boundingClientRect?.y < 60) {
            const index = headers.findIndex((h) => h.id === `catalog-${target.id}`);
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
  const contentNodeId = catalog.id.replace('catalog-', '');
  getElementById(contentNodeId)?.scrollIntoView?.({ block: 'start', behavior: 'auto' });
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
    id="myPreviewEditorSider" v-if="data?.length" class="fixed bg-white dark:bg-zinc-900"
    :style="[isShowHeader ? 'top: 105px' : 'top: 32px']" style="transition: 300ms"
  >
    <nav :style="{ height: `${height}px` }" class="relative">
      <h4 class="title font-bold pl-4 py-2 border-b dark:border-zinc-800 dark:text-zinc-300" style="height: 50px">目录</h4>
      <div
        id="myPreviewEditorOutlineList" class="overflow-y-auto overflow-x-hidden absolute right-0 w-full"
        :style="{ maxHeight: `${height - 50}px` }"
      >
        <List
          :data-list="data" @click="handleCatalogClick" class="w-full"
          item-class="py-2 truncate cursor-pointer relative text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
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

<style scoped>
#myPreviewEditorSider {
  box-shadow: 0px 0px 8px -6px #000;
  border-radius: 3px;
  width: 260px;
  z-index: 2000;
}

#myPreviewEditorOutlineList ul>li>span.active::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 60%;
  @apply bg-indigo-600 left-0 rounded-tr-lg rounded-br-lg;
}

#myPreviewEditorOutlineList ul>li>span.active {
  @apply text-indigo-600 dark:text-indigo-500;
}

#myPreviewEditorOutlineList ul>li>span {
  @apply text-gray-600 dark:text-zinc-400;
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
}</style>
