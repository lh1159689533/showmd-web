<script lang='ts'>
import { defineComponent, toRefs, watch, onMounted, onBeforeUnmount } from 'vue';
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
      Vditor.preview(document.querySelector('#myPreviewEditor'), newVal, {
        after() {
          // 渲染文档大纲
          Vditor.outlineRender(document.querySelector('#myPreviewEditor'), document.querySelector('#myPreviewEditorOutline'));

          // 获取大纲节点列表
          const spanNodeList = document.querySelector('#myPreviewEditorOutline').querySelectorAll('span[data-target-id]');
          outlineNodeList = spanNodeList ? [].slice.call(spanNodeList) : [];

          // 默认第一个选中
          outlineNodeList[0].setAttribute('class', 'active');

          // 遍历大纲节点，添加点击事件
          outlineNodeList.map((node) =>
            node.addEventListener('click', function () {
              isOutlineClick = true;
              // 点击节点添加选中样式 active，其他节点去掉选中样式 active
              outlineNodeList.map((n) => n.setAttribute('class', ''));
              this.setAttribute('class', 'active');
            })
          );

          setTimeout(function () {
            // 获取大纲节点的top值
            const targetIdList = outlineNodeList.map((node) => node.getAttribute('data-target-id')).filter((id) => id !== '');

            targetList = targetIdList.map((id) => {
              const node = document.getElementById(id);
              const prevNode = node?.previousElementSibling;
              let top: number = 0;
              if (node && prevNode) {
                const nodeMarginTop = Number(window.getComputedStyle(node).marginTop?.replace('px', '')) || 0;
                const prevNodeMarginBottom = Number(window.getComputedStyle(prevNode).marginBottom?.replace('px', '')) || 0;
                top = node?.getBoundingClientRect()?.top - nodeMarginTop - prevNodeMarginBottom;
              }
              return {
                id,
                top,
              };
            });
          }, 500);
        },
      });
    });

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
      // 根据当前最顶部的内容(h1-6)的id找到对应的大纲节点，即当前选中大纲节点
      const activeNode = outlineNodeList.find((node) => node.getAttribute('data-target-id') === target?.id);
      if (activeNode) {
        // 当前选中大纲节点添加选中样式，其他大纲节点去掉选中样式
        outlineNodeList.map((node) => node.setAttribute('class', ''));
        activeNode.setAttribute('class', 'active');
        // 大纲节点显示到其滚动容器中心(有滚动条的时候)
        activeNode.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
    <div id='myPreviewEditorSider' class='fixed top-10 border right-44'>
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
