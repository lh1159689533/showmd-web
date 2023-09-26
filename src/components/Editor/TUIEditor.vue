<script lang="ts" setup>
import { ref, onMounted, defineProps, defineEmits, toRefs } from 'vue';
import Editor from './TUIEditor';
import { querySelectorAll, getBoundingClientRect } from './domUtil';
import { Selection } from './TUIEditor/types';
import { createCatalogBtn } from './TUIEditor/util';

interface IContentTheme {
  label: string;
  value: string;
  path: string;
}

interface ICodeTheme {
  label: string;
  value: string;
}

interface IProps {
  data: {
    content: string;
    contentTheme: string;
    codeTheme: string;
  };
  contentThemeList: IContentTheme[];
  codeThemeList: ICodeTheme[];
}

interface IEmits {
  (e: 'change', data: { content?: string; contentTheme?: string; codeTheme?: string }): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { data, contentThemeList } = toRefs<IProps>(props);

const tuiEditorRef = ref();
const tuiEditor = ref<Editor>();
// 目录
const catalogList = ref([]);
const isScrollSync = ref(true);
const wordCount = ref(0); // 总字数
const lineCount = ref(0); // 总行数
const selection = ref<Partial<Selection>>({ startLine: 0, endColumn: 0, text: '' });
const showCatalog = ref(false); // 显示目录

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

const toggleScrollSync = (checked: boolean) => {
  tuiEditor.value.toggleScrollSync(checked);
};

const computeWordCount = () => {
  lineCount.value = tuiEditor.value.getText().split('\n')?.length;
  wordCount.value = tuiEditor.value.getText()?.length;
};

const scrollTop = () => tuiEditor.value?.scrollTop();

const toggleCatalog = () => {
  showCatalog.value = !showCatalog.value;
  tuiEditor.value.setWidth(showCatalog.value ? 'calc(100% - 260px)' : '100%');
};

onMounted(() => {
  tuiEditor.value = new Editor({
    el: tuiEditorRef.value,
    value: data.value.content ?? '',
    preview: {
      theme: {
        current: data.value.contentTheme ?? 'awesome-green',
        list: contentThemeList.value ?? []
      },
      hljs: data.value.codeTheme ?? 'vs'
    },
    height: getBoundingClientRect(tuiEditorRef.value).height ?? 500,
    width: '100%',
    toolbarItems: [
      {
        name: 'catalog',
        tooltip: '目录',
        el: createCatalogBtn(toggleCatalog)
      }
    ]
  });

  computeWordCount();
  tuiEditor.value.on('change', (data: IProps['data']) => {
    computeWordCount();
    emit('change', data)
  });
  tuiEditor.value.on('caretChange', (sel) => {
    selection.value = sel;
  });
  loadCatalog();
});
</script>
<template>
  <div class="tui-editor-container">
    <div ref="tuiEditorRef" class="tui-editor"></div>
    <div v-show="showCatalog" class="catalog absolute">
      <slot :catalog-list="catalogList"></slot>
    </div>
    <div class="tui-editor-footer">
      <div class="left-box flex gap-3 items-center">
        <span>总字数：{{ wordCount }}</span>
        <span>行数：{{ lineCount }}</span>
        <span>当前行：{{ selection.startLine }}</span>
        <span>当前列：{{ selection.startColumn }}</span>
        <span v-show="selection.text?.length">已选中：{{ selection.text?.length }}</span>
      </div>
      <div class="right-box flex gap-3 items-center cursor-pointer">
        <el-switch v-model="isScrollSync" active-text="同步滚动" @change="toggleScrollSync" size="small" />
        <span class="to-top" @click="scrollTop">回到顶部</span>
      </div>
    </div>
  </div>
</template>
<style>
@import url("./TUIEditor/index.less");

.tui-editor-container {
  --tui-editor-footer-height: 28px;
  --tui-editor-catalog-width: 260px;

  height: calc(100% - 64px);
  position: relative;
}

.tui-editor-container .tui-editor {
  height: calc(100% - var(--tui-editor-footer-height));
  /* width: calc(100% - var(--tui-editor-catalog-width)); */
}

.tui-editor-container .catalog {
  width: var(--tui-editor-catalog-width);
  height: calc(100% - var(--tui-editor-footer-height) - 46px);
  overflow: hidden;
  /* padding-left: 20px; */
  right: 0;
  top: 47px;
}

.tui-editor-container .tui-editor-footer {
  height: var(--tui-editor-footer-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  font-size: 12px;
  border-top: 1px solid #dadde6;
  position: relative;
}

.tui-editor-container .tui-editor-footer .right-box .to-top:hover {
  color: var(--showmd-text-color-hover);
}
</style>