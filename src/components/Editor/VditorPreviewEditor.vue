<script lang='ts'>
import { defineComponent, toRefs, watch, onMounted, onBeforeUnmount } from 'vue';
import {
  querySelector,
  querySelectorAll,
  addClass,
  removeClass,
  getNodeByClassName,
  getNodeByAttribute,
  getElementById,
  getComputedStyleOf,
  getBoundingClientRect,
} from './vditorEditor';
import Vditor from 'vditor/dist/method.min';
import 'vditor/dist/index.css';

export default defineComponent({
  name: 'PreviewEditor',
  props: {
    value: String,
  },
  setup(props) {
    const { value } = toRefs(props);
    let outlineNodeList = []; // 大纲节点列表
    let targetList = []; // 大纲节点列表
    let isOutlineClick = false; // 是否是点击大纲，如果是则不触发onScroll

    watch(value, (newVal: string) => {
      document.documentElement.scrollTop = 0;
      querySelector(document, '#myPreviewEditorOutlineList').scrollTop = 0;
      Vditor.preview(querySelector(document, '#myPreviewEditor'), newVal, {
        hljs: {
          style: 'vs',
        },
        after() {
          // 文档大纲渲染，并添加事件
          outlineRender();
          // 代码复制
          codeCopy();
        },
        lazyLoadImage: 'https://cdn.jsdelivr.net/npm/vditor/dist/images/img-loading.svg',
        renderers: {
          renderBlockquote: (node, entering) => {
            const text = node.Text();
            let className = 'explain';
            if (text?.trim()?.startsWith('注意')) {
              className = 'notice';
            }
            if (entering) {
              return [`<blockquote class='${className}'>`, Lute.WalkContinue];
            }
            return ['</blockquote>', Lute.WalkContinue];
          },
        },
      });
    });

    /**
     * 代码片段复制按钮点击复制后显示 '已复制'
     */
    function codeCopy() {
      const copyNodeList = querySelectorAll(document, '.vditor-copy>span[aria-label="复制"]');
      (window as any).copyNodeList = copyNodeList;
      [].slice.call(copyNodeList).map((node) => {
        node?.addEventListener('click', function () {
          this.setAttribute('aria-label', '已复制');
        });
      });
    }

    /**
     * 初始化大纲，并添加事件
     */
    function initOutline(outline) {
      // 获取大纲节点列表
      outlineNodeList = querySelectorAll(outline, 'span[data-target-id]');

      // 默认第一个选中
      addClass(outlineNodeList[0], 'active');

      // 遍历大纲节点，添加点击事件
      outlineNodeList?.map((node) =>
        node.addEventListener('click', function () {
          isOutlineClick = true;
          // 点击节点添加选中样式 active，其他节点去掉选中样式 active
          const currentActiveNode = getNodeByClassName(outlineNodeList, 'active');
          removeClass(currentActiveNode, 'active');
          addClass(this, 'active');
        })
      );

      setTimeout(function () {
        // 获取大纲节点的top值
        const targetIdList = outlineNodeList.map((node) => node.getAttribute('data-target-id')).filter((id) => id !== '');

        targetList = targetIdList?.map((id) => {
          const node = getElementById(id);
          const prevNode = node?.previousElementSibling;
          let top: number = 0;
          if (node && prevNode) {
            const nodeMarginTop = getComputedStyleOf(node, 'marginTop');
            const prevNodeMarginBottom = getComputedStyleOf(prevNode, 'marginBottom');
            top = getBoundingClientRect(node)?.top - nodeMarginTop - prevNodeMarginBottom;
          }
          return {
            id,
            top,
          };
        });
      }, 500);
    }

    /**
     * 文档大纲渲染
     */
    function outlineRender() {
      const outline = getElementById('myPreviewEditorOutline');
      // 渲染文档大纲
      Vditor.outlineRender(getElementById('myPreviewEditor'), outline);

      if (outline.innerText.trim() !== '') {
        getElementById('myPreviewEditorSider').style.display = 'block';
        initOutline(outline);
      } else {
        getElementById('myPreviewEditorSider').style.display = 'none';
      }
    }

    /**
     * 文档内容区滚动事件，主要处理与大纲的联动效果
     */
    function onScroll() {
      // isOutlineClick=true说明是点击大纲节点触发的Vditor内部的滚动事件，不需要再执行以下自定义滚动事件
      if (isOutlineClick) return (isOutlineClick = false);
      // 根据滚动条top值与大纲每个节点top值做对比，找到当前最顶部的内容(主要是h1-6，因为只有h1-6才会显示到大纲，内容区h1-6的id与大纲节点data-target-id有关联)
      const scrollTop = document.documentElement.scrollTop;
      let target;
      if (scrollTop <= targetList[0].top) {
        target = targetList[0];
      } else if (scrollTop >= targetList.at(-1).top) {
        target = targetList.at(-1);
      } else {
        target = targetList.find((node, i) => node.top < scrollTop && targetList[i + 1]?.top > scrollTop);
      }
      const currentActiveNode = getNodeByClassName(outlineNodeList, 'active');
      // 根据当前最顶部的内容(h1-6)的id找到对应的大纲节点，即当前选中大纲节点
      const newActiveNode = getNodeByAttribute(outlineNodeList, 'data-target-id', target?.id);
      if (newActiveNode) {
        // 要选中的大纲节点添加选中样式，当前选中大纲节点去掉选中样式
        removeClass(currentActiveNode, 'active');
        addClass(newActiveNode, 'active');
        // 大纲节点显示到其滚动容器中心(有滚动条的时候)
        newActiveNode.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }

    onMounted(() => {
      document.addEventListener('scroll', onScroll);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('scroll', onScroll);
    });
  },
});
</script>

<template>
  <div v-bind='$attrs' class>
    <div id='myPreviewEditor' class='min-h-screen px-12 absolute' style='width: calc(100% - 260px)'></div>
    <div id='myPreviewEditorSider' class='fixed top-10 border right-44 hidden'>
      <nav style='height: 580px' class='relative overflow-hidden'>
        <h1 class='title font-bold pl-4 py-2 border-b' style='height: 50px'>目录</h1>
        <div id='myPreviewEditorOutlineList' class='overflow-y-auto overflow-x-hidden absolute right-0' style='max-height: 530px;margin: 8px 4px 0 0;'>
          <div id='myPreviewEditorOutline' style='padding-left: 2px'></div>
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
@import url('./blockquote.css');

#myPreviewEditor .vditor-toolbar--hide {
  display: none !important;
}

#myPreviewEditorSider {
  box-shadow: 0px 0px 8px -6px #000;
  border-radius: 3px;
  width: 260px;
}

#myPreviewEditorOutline.vditor-outline {
  display: block !important;
}

#myPreviewEditorOutline.vditor-outline ul {
  padding-left: 0 !important;
}

#myPreviewEditorOutline.vditor-outline li > span {
  @apply relative;
}

#myPreviewEditorOutline.vditor-outline li > span.active::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 60%;
  @apply bg-indigo-600 left-0 rounded-tr-lg rounded-br-lg;
}

#myPreviewEditorOutline.vditor-outline li > span:hover {
  @apply bg-gray-50;
}

#myPreviewEditorOutline.vditor-outline li > span > span {
  color: #333;
  font-size: 0.9rem;
}

#myPreviewEditorOutline.vditor-outline li > span.active > span {
  @apply text-indigo-600;
}
</style>
