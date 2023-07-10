<script lang="ts" setup>
import { defineProps, defineEmits, defineExpose, ref, onMounted, onBeforeUnmount } from 'vue';
import Vditor from 'vditor';
import {
  querySelector,
  getElementById,
  addClass,
  removeClass,
  getNodeByClassName,
  querySelectorAll,
  getNodeByAttribute,
  getBoundingClientRect,
  getComputedStyleOf,
} from './domUtil';
import { upload } from '@src/utils/upload';
import message from '@utils/message';

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

const editor = ref<Vditor | null>(null);
// const editorMode = 'both';
let isEditorInited = false; // 编辑器是否初始化
let isOutlineInited = false; // 目录是否初始化
const isShowOutline = false; // 是否显示目录
let outlineNodeList = []; // 目录节点列表
const contentNodeTopList: { id: string; top: number }[] = []; // 编辑区h1-6节点id&top数据列表
const previewNodeTopList: { id: string; top: number }[] = []; // 预览区h1-6节点id&top数据列表
let isOutlineClick = false; // 是否是点击目录，如果是则不触发onScroll

const currentTheme = 'classic';
const currentTontentTheme = ref(props.data?.contentTheme ?? 'Chinese-red');
const currentCodeTheme = ref(props.data?.codeTheme ?? 'github');
const catalogList = ref([]);

onMounted(() => {
  const previewThemeList = {};
  props.contentThemeList.forEach((t: IContentTheme) => {
    previewThemeList[t.label] = t.value;
  });
  editor.value = new Vditor('myEditorContent', {
    toolbarConfig: {
      pin: true,
    },
    toolbar: [
      'headings',
      'bold',
      'italic',
      'quote',
      'link',
      'upload',
      'code',
      'inline-code',
      'list',
      'ordered-list',
      'strike',
      'check',
      'table',
      {
        name: 'codeTheme',
        tip: '代码主题',
        tipPosition: 'n',
        className: 'right toolbar__item',
        icon: '<svg width="1em" height="1em" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M25.785 24.935c1.681 0 3.054-1.392 3.054-3.096 0-2.058-3.054-5.416-3.054-5.416s-3.054 3.358-3.054 5.416c0 1.704 1.373 3.096 3.054 3.096zM11.28 23.239c0.273 0.273 0.715 0.273 0.985 0l9.851-9.847c0.273-0.273 0.273-0.715 0-0.985l-9.847-9.847c-0.023-0.023-0.050-0.046-0.077-0.065l-3.008-3.008c-0.063-0.062-0.15-0.101-0.246-0.101s-0.183 0.039-0.246 0.101l-1.846 1.846c-0.062 0.063-0.101 0.15-0.101 0.246s0.039 0.183 0.101 0.246l2.585 2.585-7.993 7.997c-0.273 0.273-0.273 0.715 0 0.985l9.843 9.847zM11.777 5.984l6.881 6.881h-13.759l6.878-6.881zM31.078 27.693h-30.157c-0.169 0-0.308 0.138-0.308 0.308v3.077c0 0.169 0.138 0.308 0.308 0.308h30.157c0.169 0 0.308-0.138 0.308-0.308v-3.077c0-0.169-0.138-0.308-0.308-0.308z"></path></svg>',
        toolbar: props.codeThemeList?.map((t: ICodeTheme) => ({
          icon: t.label,
          name: t.value,
          className: `${currentCodeTheme.value}`,
          click: () => setCodeTheme(t.value),
        })),
        click: () => {},
      },
      {
        name: 'contentTheme',
        tip: '内容主题',
        tipPosition: 'n',
        className: 'right toolbar__item',
        icon: '<svg width="1em" height="1em" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M30.249 0.637h-8.207c-0.693 0-1.309 0.474-1.473 1.166-0.497 2.102-2.38 3.61-4.569 3.61s-4.072-1.508-4.569-3.61c-0.161-0.673-0.758-1.166-1.47-1.166-0.001 0-0.002 0-0.003 0h-8.207c-0.967 0-1.751 0.784-1.751 1.751v0 10.030c0 0.967 0.784 1.751 1.751 1.751v0h2.985v15.443c0 0.967 0.784 1.751 1.751 1.751v0h19.025c0.967 0 1.751-0.784 1.751-1.751v0-15.443h2.985c0.967 0 1.751-0.784 1.751-1.751v0-10.030c0-0.967-0.784-1.751-1.751-1.751v0zM29.134 11.303h-4.736v17.194h-16.796v-17.194h-4.736v-7.801h6.101c1.122 2.834 3.881 4.776 7.033 4.776s5.91-1.942 7.033-4.776h6.102v7.801z"></path></svg>',
        toolbar: props.contentThemeList?.map((t: IContentTheme) => ({
          icon: t.label,
          name: t.value,
          click: () => setContentTheme(t.value, t.path),
        })),
        click: () => {},
      },
    ],
    outline: {
      enable: false,
      position: 'right',
    },
    preview: {
      delay: 500,
      actions: [],
      theme: {
        current: props?.data?.contentTheme ?? 'Chinese-red',
        path: '/api/editor/theme',
        list: previewThemeList,
      },
      hljs: {
        style: props?.data?.codeTheme ?? 'github',
      },
      mode: 'both', // editor both
    },
    mode: 'ir',
    cache: {
      enable: false,
    },
    tab: '\t',
    value: (props?.data?.content ?? '').concat('\n\n'),
    after() {
      // (window as any).editor = editor.value;
      editor.value?.focus();
      if (isEditorInited) return;
      isEditorInited = true;
      onScroll();
      !isOutlineInited && setTimeout(initOutline, 1000);
      onPreviewScroll();
      const editorContent = querySelector(getElementById('myEditorContent'), '.vditor-ir');
      addClass(editorContent, 'showmd');
      const outlineTitle = querySelector(getElementById('myEditorContent'), '.vditor-content .vditor-outline .vditor-outline__title');
      if (outlineTitle) {
        outlineTitle.innerText = '目录';
      }
      querySelector(getElementById('myEditorContent'), '.vditor-wysiwyg')?.remove();
      querySelector(getElementById('myEditorContent'), '.vditor-sv')?.remove();
      querySelector(getElementById('myEditorContent'), '.vditor-preview')?.remove();
      loadCatalog(); // 加载目录
    },
    input(value) {
      const data = {
        content: value,
      };
      emit('change', data);
      loadCatalog(); // 加载目录
    },
    // 上传图片
    upload: {
      accept: 'image/*',
      multiple: false, // 不支持多个文件同时上传
      filename(name) {
        return name
          .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
          .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
          .replace('/\\s/g', '');
      },
      // 自定义上传
      async handler(files: File[]) {
        const file = files[0];
        const [err, res] = await upload(file);
        if (!err && res.code === 0) {
          editor.value.insertValue(`![${this.filename(file?.name)}](/api/${res?.data?.path})\n`);
          message.success('图片上传成功');
        } else {
          message.error('图片上传失败');
        }
        return null;
      },
    },
  });
});

const loadCatalog = () => {
  const editorNode = getElementById('myEditorContent');
  const hList = querySelectorAll(editorNode, 'h1,h2,h3,h4,h5,h6');
  if (hList?.length) {
    catalogList.value = hList.map((h) => ({
      id: `catalog-${h.id}`,
      title: h.innerText.replaceAll('#', ''),
      indent: h.nodeName,
    }));
  }
};

function setContentTheme(contentTheme, contentThemePath) {
  emit('change', { contentTheme });
  currentTontentTheme.value = contentTheme;
  editor.value.setTheme(currentTheme, contentTheme, currentCodeTheme.value, contentThemePath);
}

function setCodeTheme(codeTheme) {
  emit('change', { codeTheme });
  currentCodeTheme.value = codeTheme;
  editor.value.setTheme(currentTheme, currentTontentTheme.value, codeTheme);
}

/**
 * 根据编辑区滚动，联动目录区
 */
function onScroll() {
  const contentNode = querySelector(getElementById('myEditorContent'), '.vditor-sv.vditor-reset');
  contentNode?.addEventListener('scroll', function () {
    if (!isShowOutline) return;
    if (isOutlineClick) return (isOutlineClick = false);
    const scrollTop = (this as HTMLElement).scrollTop;
    const targetId = findTargetIdNode(scrollTop, contentNodeTopList);
    // 根据当前最顶部的内容(h1-6)的id找到对应的目录节点，即当前选中目录节点
    activeOutlineMove(targetId);
  });
}

function onPreviewScroll() {
  const previewNode = querySelector(getElementById('myEditorContent'), '.vditor-preview');
  previewNode?.addEventListener('scroll', function () {
    if (!isShowOutline) return;
    if (isOutlineClick) return (isOutlineClick = false);
    const scrollTop = (this as HTMLElement).scrollTop;
    const targetId = findTargetIdNode(scrollTop, previewNodeTopList);
    // 根据当前最顶部的内容(h1-6)的id找到对应的目录节点，即当前选中目录节点
    activeOutlineMove(targetId);
  });
}

function activeOutlineMove(targetId) {
  // 根据当前最顶部的内容(h1-6)的id找到对应的目录节点，即当前选中目录节点
  const newActiveNode = getNodeByAttribute(outlineNodeList, 'data-target-id', targetId);
  const currentActiveNode = getNodeByClassName(outlineNodeList, 'active');
  if (newActiveNode && currentActiveNode) {
    // 要选中的目录节点添加选中样式，当前选中目录节点去掉选中样式
    removeClass(currentActiveNode, 'active');
    addClass(newActiveNode, 'active');
    // 目录节点显示到其滚动容器中心(有滚动条的时候)
    newActiveNode.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

/**
 * 根据scrollTop查找最顶部的目录节点id
 */
function findTargetIdNode(scrollTop, nodeTopList) {
  if (!nodeTopList?.length) return '';
  let target;
  if (scrollTop <= nodeTopList[0].top) {
    target = nodeTopList[0];
  } else if (scrollTop >= nodeTopList.at(-1).top) {
    target = nodeTopList.at(-1);
  } else {
    target = nodeTopList.find((node, i) => node.top < scrollTop && nodeTopList[i + 1]?.top > scrollTop);
  }
  return target?.id;
}

/**
 * 初始化目录
 */
function initOutline() {
  isOutlineInited = true;
  const outline = querySelector(getElementById('myEditorContent'), '.vditor-outline__content');
  // 获取目录节点列表
  outlineNodeList = querySelectorAll(outline, 'span[data-target-id]');

  // 默认第一个选中
  // addClass(outlineNodeList[0], 'active');

  // 遍历目录节点，添加点击事件
  outlineNodeList?.map((node) =>
    node.addEventListener('click', function () {
      isOutlineClick = true;
      const { targetId } = this.dataset;
      const contentNode = querySelector(getElementById('myEditorContent'), '.vditor-sv.vditor-reset');
      const content_tid = +targetId.replace('_', '') + 1;
      const targetContentNode = querySelector(contentNode, `div[data-block]:nth-of-type(${content_tid})`);
      targetContentNode?.scrollIntoView({ block: 'start' });
      // 点击节点添加选中样式 active，其他节点去掉选中样式 active
      const currentActiveNode = getNodeByClassName(outlineNodeList, 'active');
      removeClass(currentActiveNode, 'active');
      addClass(this, 'active');
    })
  );

  // 获取目录节点的top值
  const targetIdList = outlineNodeList.map((node) => node.getAttribute('data-target-id')).filter((id) => id !== '');
  const contentNode = querySelector(getElementById('myEditorContent'), '.vditor-sv.vditor-reset');

  targetIdList?.map((id) => {
    const content_tid = +id.replace('_', '') + 1;
    const targetContentNode = querySelector(contentNode, `div[data-block]:nth-of-type(${content_tid})`);
    let cntop = 0;
    if (targetContentNode) {
      cntop = getBoundingClientRect(targetContentNode)?.top - 36 - 76;
    }
    contentNodeTopList.push({ id, top: cntop });

    const targetPreviewNode = getElementById(id);
    const prevNode = targetPreviewNode?.previousElementSibling;
    let pntop = 0;
    if (targetPreviewNode && prevNode) {
      const nodeMarginTop = getComputedStyleOf(targetPreviewNode, 'marginTop');
      const prevNodeMarginBottom = getComputedStyleOf(prevNode, 'marginBottom');
      pntop = getBoundingClientRect(targetPreviewNode)?.top - nodeMarginTop + prevNodeMarginBottom - 109;
    }
    previewNodeTopList.push({ id, top: pntop });
  });
}

onBeforeUnmount(() => {
  // 组件销毁时销毁编辑器
  editor.value?.destroy();
});

const getText = () => {
  //定义script的正则表达式，去除js可以防止注入
  const scriptRegex = /<script[^>]*?>[\s\S]*?<\/script>/g;
  //定义style的正则表达式，去除style样式，防止css代码过多时只截取到css样式代码
  const styleRegex = /<style[^>]*?>[\s\S]*?<\/style>/g;
  //定义HTML标签的正则表达式，去除标签，只提取文字内容
  const htmlRegex = /<[^>]+>/g;
  //定义空格,回车,换行符,制表符
  const spaceRegex = /\s+|\t|\r|\n/g;
  const html = editor.value.getHTML();
  return html?.replace(scriptRegex, '').replace(styleRegex, '').replace(htmlRegex, '').replace(spaceRegex, ' ');
};

defineExpose({
  getText,
});
</script>

<template>
  <div id="myEditorIR" class="flex-1">
    <div id="myEditorContent" v-bind="$attrs"></div>
    <div class="absolute right-28" style="width: 260px; padding-left: 20px">
      <slot :catalog-list="catalogList"></slot>
    </div>
  </div>
</template>

<style>
#myEditorIR .vditor-toolbar__item {
  padding-right: 10px;
}

#myEditorIR .vditor-toolbar__item > button[data-type='record'],
#myEditorIR .vditor-toolbar__item > button[data-type='undo'],
#myEditorIR .vditor-toolbar__item > button[data-type='edit-mode'],
#myEditorIR .vditor-toolbar__item > button[data-type='redo'] {
  display: none;
}

#myEditorIR #myEditorContent {
  height: 100% !important;
  position: relative;
}

#myEditorIR #myEditorContent .vditor-content .vditor-ir .vditor-reset {
  background-color: transparent;
  position: relative;
  padding: 10px 50px 50px 50px !important;
  min-height: 50px;
}

#myEditorIR #myEditorContent .vditor-content {
  display: flex;
  overflow: auto;
}

/* #myEditorIR #myEditorContent .vditor-content .vditor-preview {
  display: inline-block;
  vertical-align: top;
  flex: none;
}

#myEditorIR #myEditorContent .vditor-content .vditor-preview .showmd {
  min-height: 100%;
} */

#myEditorIR #myEditorContent .vditor-toolbar--pin {
  display: flex;
  @apply px-8 !important;
}

#myEditorIR #myEditorContent .vditor-toolbar__item {
  float: none;
  display: block !important;
}

#myEditorIR .vditor-toolbar__divider {
  float: none;
  flex: 1;
  border-left: none;
}

#myEditorIR .vditor-messageElementtip,
#myEditorIR .vditor-tip {
  display: none;
}

#myEditorIR .toolbar__item > div {
  max-height: 600px;
  overflow-y: auto;
}

.showmd .vditor-reset {
  width: 1380px !important;
  margin: 0 auto !important;
  /* height: auto !important; */
  overflow-x: hidden;
}

@media screen and (max-width: 1439px) {
  .showmd .vditor-reset {
    max-width: 1190px;
  }
}

@media screen and (min-width: 1440px) and (max-width: 1535px) {
  .showmd .vditor-reset {
    max-width: 1280px;
  }
}
</style>
