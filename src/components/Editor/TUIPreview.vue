<script lang="ts" setup>
import { ref, onMounted, defineProps, toRefs } from 'vue';
import Editor from './TUIEditor';
import { querySelectorAll } from './domUtil';

interface Data {
  id: number;
  content?: string;
  codeTheme?: string;
  contentTheme?: string;
}

interface Props {
  data: Data;
}

const props = defineProps<{
  data: any;
}>();

const { data } = toRefs<Props>(props);

const tuiPreviewRef = ref();
// 编辑器实例
const tuiEditor = ref<Editor>();
// 目录
const catalogList = ref([]);

/**
 * 加载目录
 */
const loadCatalog = () => {
  const hList = querySelectorAll('h1,h2,h3,h4,h5,h6', tuiEditor.value.previewEl);
  if (hList?.length) {
    catalogList.value = hList.map((h) => ({
      id: `catalog-${h.dataset?.nodeid}`,
      title: h.innerText.replaceAll('#', ''),
      indent: h.nodeName,
      contentKey: 'data-nodeid',
      contentSelector: `${h.nodeName}[data-nodeid="${h.dataset?.nodeid}"]`
    }));
  }
};

onMounted(() => {
  tuiEditor.value = new Editor({
    el: tuiPreviewRef.value,
    height: '100%',
    value: data.value.content,
    viewer: true,
    preview: {
      theme: {
        current: data.value?.contentTheme,
        path: '/api/editor/theme',
      },
      hljs: data.value?.codeTheme
    },
  });
  loadCatalog();
});
</script>
<template>
  <div v-bind="$attrs" class="tui-preview-container w-full flex flex-row">
    <div ref="tuiPreviewRef" class="tui-preview px-12 pb-10 pt-2"></div>
    <div class="catalog relative w-1/4">
      <slot :catalog-list="catalogList"></slot>
    </div>
  </div>
</template>
<style>
@import url("./TUIEditor/index.less");

.tui-preview-container {
  --tui-preview-catalog-width: 260px;

  height: 100%;
  position: relative;
}

.tui-preview-container .tui-preview {
  width: calc(100% - 260px);
  background-color: var(--showmd-bg-color-primary);
}

.tui-preview-container .tui-preview img {
  cursor: zoom-in;
}

.tui-preview-container .catalog {
  width: var(--tui-preview-catalog-width);
  padding-left: 20px;
}
</style>