<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue';
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

export default defineComponent({
  name: 'Editor',
  props: ['value'],
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

    onMounted(() => {
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
          'code-theme',
          'content-theme',
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
            current: 'Chinese-red',
            list: { 'Chinese-red': 'Chinese-red', 'awesome-green': 'awesome-green' },
            path: 'http://localhost:1229/editor/theme',
          },
          mode: 'both', // editor both
        },
        mode: 'sv',
        cache: {
          enable: false,
        },
        value: props?.value ?? '',
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
          emit('change', value);
        }
      });
    });

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
    <div id='myEditorContent' v-bind='$attrs'></div>
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
  padding: 0 60px;
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
</style>
