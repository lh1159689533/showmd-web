<script lang='ts'>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
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
} from './vditorEditor';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

interface IContentTheme {
  label: string;
  value: string;
  path: string;
}

interface ICodeTheme {
  label: string;
  value: string;
}

export default defineComponent({
  name: 'Editor',
  props: {
    // 内容
    data: Object,
    // 内容主题列表
    contentThemeList: {
      type: Array,
      default: () => [],
    },
    // 代码主题列表
    codeThemeList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const editor = ref<Vditor | null>(null);
    let editorMode = 'both';
    let isEditorInited = false; // 编辑器是否初始化
    let isOutlineInited = false; // 目录是否初始化
    let isShowOutline = false; // 是否显示目录
    let outlineNodeList = []; // 目录节点列表
    const contentNodeTopList: { id: string; top: number }[] = []; // 编辑区h1-6节点id&top数据列表
    const previewNodeTopList: { id: string; top: number }[] = []; // 预览区h1-6节点id&top数据列表
    let isOutlineClick = false; // 是否是点击目录，如果是则不触发onScroll

    const currentTheme = 'classic';
    const currentTontentTheme = ref(props.data?.contentTheme ?? 'Chinese-red');
    const currentCodeTheme = ref(props.data?.codeTheme ?? 'github');

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
            toolbar: props.codeThemeList.map((t: ICodeTheme) => ({
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
            toolbar: props.contentThemeList.map((t: IContentTheme) => ({
              icon: t.label,
              name: t.value,
              click: () => setContentTheme(t.value, t.path),
            })),
            click: () => {},
          },
          '|',
          {
            name: 'Outline',
            tip: '目录',
            tipPosition: 'n',
            className: 'right',
            icon: '<svg width="1em" height="1em" viewBox="0 0 48 48" style="fill:none" xmlns="http://www.w3.org/2000/svg"><path d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"></path><path d="M26 24H14M34 15H14M32 33H14" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            click() {
              showOutline();
            },
          },
          {
            name: 'help',
            tip: '帮助',
            tipPosition: 'n',
            className: 'right',
            icon: '<svg width="1em" height="1em" viewBox="0 0 48 48" style="fill:none" xmlns="http://www.w3.org/2000/svg"><path d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"></path><path d="M24 28.625v-4a6 6 0 1 0-6-6" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 37.625a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="currentColor"></path></svg>',
          },
          {
            name: 'Edit',
            tip: '仅编辑区',
            tipPosition: 'n',
            className: 'right',
            icon: '<svg width="1em" height="1em" viewBox="0 0 48 48" style="fill:none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="28" height="36" rx="2" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M42 6v36" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            click() {
              toggleMode('edit');
            },
          },
          {
            name: 'Preview',
            tip: '仅预览区',
            tipPosition: 'n',
            className: 'right',
            icon: '<svg width="1em" height="1em" viewBox="0 0 48 48" style="fill:none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="6" width="28" height="36" rx="2" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M6 6v36" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            click() {
              toggleMode('preview');
            },
          },
          'fullscreen',
        ],
        outline: {
          enable: false,
          position: 'right',
        },
        classes: {
          preview: 'showmd',
        },
        preview: {
          delay: 500,
          actions: [],
          theme: {
            current: props?.data?.contentTheme ?? 'Chinese-red',
            path: 'http://localhost:1229/editor/theme',
            list: previewThemeList,
          },
          hljs: {
            style: props?.data?.codeTheme ?? 'github',
          },
          mode: 'both', // editor both
          // transform(html) {
          //   console.log(html);
          //   if (html.includes('<pre>') && html.includes('</pre>')) {
          //     count ++;
          //     return html
          //       .replaceAll(
          //         '<pre>',
          //         `<div class="code-block"><input type='checkbox' id='codeSuofang${count}' class='code-suofang-checkbox' style='display: none' />
          //         <div class='code-block-menus'><label></label><label for='codeSuofang${count}'></label><label></label></div><div class='code-content'><pre>`
          //       )
          //       .replaceAll('</pre>', `</pre></div></div>`);
          //   }
          //   return html;
          // },
        },
        mode: 'sv',
        cache: {
          enable: false,
        },
        value: props?.data?.content ?? '',
        after() {
          if (isEditorInited) return;
          isEditorInited = true;
          onScroll();
          !isOutlineInited && setTimeout(initOutline, 1000);
          onPreviewScroll();
          const outlineTitle = querySelector(getElementById('myEditorContent'), '.vditor-content .vditor-outline .vditor-outline__title');
          if (outlineTitle) {
            outlineTitle.innerText = '目录';
          }
        },
        input(value) {
          const data = {
            content: value,
          };
          emit('change', data);
        },
        // 上传图片
        upload: {
          accept: 'image/*',
          url: '/api/showmd/file/upload',
          format(_, res) {
            // 对服务端返回的数据进行转换，以满足内置的数据结构
            const { data } = JSON.parse(res);
            const { name, path } = data;
            return JSON.stringify({
              code: 0,
              data: {
                errFiles: [],
                succMap: {
                  [`${name}`]: `/api/${path}`,
                },
              },
            });
          },
        },
      });
    });

    onBeforeUnmount(() => {
      // 组件销毁时销毁编辑器
      editor.value?.destroy();
    });

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
     * 编辑模式切换
     */
    function toggleMode(mode) {
      const editorContent = getElementById('myEditorContent');
      const content = querySelector(editorContent, '.vditor-content');
      const previewNode = querySelector(content, '.vditor-preview');
      const editorNode = querySelector(content, '.vditor-sv');
      if (editorMode === mode) {
        content.style.gridTemplateColumns = isShowOutline ? '1fr 1fr 250px' : '1fr 1fr';
        previewNode.style.display = 'block';
        editorNode.style.display = 'block';
        editorMode = 'both';
      } else if (mode === 'edit') {
        content.style.gridTemplateColumns = isShowOutline ? '1fr 250px' : '1fr';
        previewNode.style.display = 'none';
        editorNode.style.display = 'block';
        editorMode = mode;
      } else if (mode === 'preview') {
        content.style.gridTemplateColumns = isShowOutline ? '1fr 250px' : '1fr';
        editorNode.style.display = 'none';
        previewNode.style.display = 'block';
        editorMode = mode;
      }
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

    /**
     * 目录显示
     */
    function showOutline() {
      isShowOutline = !isShowOutline;
      const editorContent = getElementById('myEditorContent');
      const content = querySelector(editorContent, '.vditor-content');
      const outline = querySelector(content, '.vditor-outline');
      if (isShowOutline) {
        if (editorMode === 'preview') {
          content.style.gridTemplateColumns = '1fr 250px';
        } else if (editorMode === 'edit') {
          content.style.gridTemplateColumns = '1fr 250px';
        } else {
          content.style.gridTemplateColumns = '1fr 1fr 250px';
        }
        outline.style.display = 'block';
        const contentNode = querySelector(content, '.vditor-sv.vditor-reset');
        const targetId = findTargetIdNode(contentNode.scrollTop, contentNodeTopList);
        const newActiveNode = getNodeByAttribute(outlineNodeList, 'data-target-id', targetId) ?? outlineNodeList[0];
        const currentActiveNode = getNodeByClassName(outlineNodeList, 'active');
        removeClass(currentActiveNode, 'active');
        addClass(newActiveNode, 'active');
      } else {
        outline.style.display = 'none';
        if (editorMode === 'preview') {
          content.style.gridTemplateColumns = '1fr';
        } else if (editorMode === 'edit') {
          content.style.gridTemplateColumns = '1fr';
        } else {
          content.style.gridTemplateColumns = '1fr 1fr';
        }
      }
    }
  },
});
</script>

<template>
  <div id='myEditor'>
    <div id='myEditorContent' v-bind='$attrs' />
  </div>
</template>

<style>
#myEditor .vditor-toolbar__item {
  padding-right: 10px;
}

#myEditor .vditor-toolbar__item > button[data-type='record'],
#myEditor .vditor-toolbar__item > button[data-type='undo'],
#myEditor .vditor-toolbar__item > button[data-type='edit-mode'],
#myEditor .vditor-toolbar__item > button[data-type='redo'] {
  display: none;
}

#myEditor #myEditorContent {
  height: calc(100vh - 74px);
}

#myEditor #myEditorContent .vditor-content .vditor-preview .vditor-reset {
  padding-top: 0;
  /* height: 100%; */
}

#myEditor #myEditorContent .vditor-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#myEditor #myEditorContent .vditor-content .vditor-sv {
  padding: 10px 60px;
  display: inline-block;
  /* width: 50%; */
  vertical-align: top;
  flex: none;
}

#myEditor #myEditorContent .vditor-content .vditor-preview {
  display: inline-block;
  /* width: 50%; */
  vertical-align: top;
  flex: none;
}

#myEditor #myEditorContent .vditor-content .vditor-preview .showmd {
  min-height: 100%;
}

#myEditor #myEditorContent .vditor-toolbar--pin {
  display: flex;
  @apply px-8 !important;
}

#myEditor #myEditorContent .vditor-toolbar__item {
  float: none;
  display: block !important;
}

#myEditor .vditor-toolbar__divider {
  float: none;
  flex: 1;
  border-left: none;
}
#myEditor .vditor-messageElementtip,
#myEditor .vditor-tip {
  display: none;
}

#myEditor .toolbar__item > div {
  max-height: 600px;
  overflow-y: auto;
}
</style>
