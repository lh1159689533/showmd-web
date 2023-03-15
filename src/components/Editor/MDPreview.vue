<script lang="ts" setup>
import { defineProps, toRefs, ref, onMounted } from 'vue';
import Vditor from 'vditor/dist/method.min';
import 'vditor/dist/index.css';
import { querySelectorAll, getElementById, getBoundingClientRect } from './domUtil';

interface User {
  name: string;
  avatar: string;
}

interface Data {
  id: number;
  content?: string;
  codeTheme?: string;
  contentTheme?: string;
  updateTime?: string;
  createTime?: string;
  readCount?: number;
  user?: User;
}

interface Props {
  data: Data;
}

const props = defineProps<{
  data: any;
}>();

const { data } = toRefs<Props>(props);
const outlineNodeList = ref([]); // 目录对象

function initPreview() {
  let count = 0;
  Vditor.preview(getElementById('myPreviewEditor'), data.value?.content, {
    hljs: {
      style: data.value?.codeTheme ?? 'github',
    },
    theme: {
      current: data.value?.contentTheme ?? 'Chinese-red',
      path: '/api/editor/theme',
    },
    lazyLoadImage: '/api/editor/loading.webp',
    renderers: {
      renderBlockquote: (node, entering) => {
        const text = node.Text();
        let className = '';
        if (text?.trim()?.startsWith('注意')) {
          className = 'notice';
        }
        if (entering) {
          // eslint-disable-next-line
          return [`<blockquote class='${className}'>`, Lute.WalkContinue];
        }
        // eslint-disable-next-line
        return ['</blockquote>', Lute.WalkContinue];
      },
      renderCodeBlock: (_, entering) => {
        if (entering) {
          return [
            `<div class="code-block">
                  <input type='checkbox' id='codeSuofang${count}' class='code-suofang-checkbox' style='display: none' />
                  <div class='code-block-menus'>
                    <label></label><label for='codeSuofang${count++}'></label><label></label>
                  </div>
                  <div class='code-content'>`,
            // eslint-disable-next-line
            Lute.WalkContinue,
          ];
        }
        // eslint-disable-next-line
        return ['</div></div>', Lute.WalkContinue];
      },
    },
    after() {
      // 代码复制
      codeCopy();
      // 文档大纲渲染，并添加事件
      outlineRender();
      // 预览图片的处理
      previewImg();
    },
  });
}

/**
 * 预览图片(图片点击放大)
 */
function previewImg() {
  const editorNode = getElementById('myPreviewEditor');
  const imgList = querySelectorAll(editorNode, 'img');
  imgList.map((img) => {
    // 遍历img添加click事件
    img.addEventListener('click', function () {
      const { width, height, top, left } = getBoundingClientRect(img) ?? {};
      const scrollTop = document.documentElement.scrollTop;
      const { innerWidth, innerHeight } = window;
      const duration = 300;
      // const scale = Math.min(innerWidth / width, innerHeight / height) - 0.5;
      const scale = Math.min(innerWidth / width, innerHeight / height, 2) - 0.5;
      // 添加遮罩层
      const imgWrapper = document.createElement('div');
      imgWrapper.setAttribute(
        'style',
        `position:fixed;left:0;top:0;bottom:0;right:0;background-color:rgba(0,0,0,.8);z-index:2001;
            cursor:zoom-out;opacity:0;transition:opacity ${duration}ms cubic-bezier(.2,0,.2,1);`
      );

      // 新建一个img元素
      const imgPreview = document.createElement('img');
      imgPreview.setAttribute('src', (img as HTMLImageElement).currentSrc);
      imgPreview.setAttribute(
        'style',
        `position:absolute;left:${left}px;top:${top + scrollTop}px;width:${width}px;
            height:${height}px;z-index:2001;cursor:zoom-out;transform:scale(1) translate(0,0);transition:transform ${duration}ms cubic-bezier(.2,0,.2,1);`
      );

      document.body.appendChild(imgWrapper);
      document.body.appendChild(imgPreview);

      setTimeout(() => {
        img.style.visibility = 'hidden';
        imgWrapper.style.opacity = '1';
        imgPreview.style.transform = `scale(${scale}) translate(${((innerWidth - width) / 2 - left) / scale}px, ${((innerHeight - height) / 2 - top) / scale}px)`;
      }, 0);

      // 关闭
      function close() {
        imgWrapper.style.opacity = '0';
        imgPreview.style.transform = `scale(1) translate(0,0)`;
        imgWrapper.removeEventListener('click', close);
        imgPreview.removeEventListener('click', close);
        document.removeEventListener('scroll', close);
        setTimeout(() => {
          img.style.visibility = 'visible';
          document.body.removeChild(imgWrapper);
          document.body.removeChild(imgPreview);
        }, duration);
      }
      imgWrapper.addEventListener('click', close);
      imgPreview.addEventListener('click', close);
      document.addEventListener('scroll', close);
    });
  });
}

/**
 * 代码片段复制按钮点击复制后显示 '已复制'
 */
function codeCopy() {
  const editorNode = getElementById('myPreviewEditor');
  const copyNodeList = querySelectorAll(editorNode, '.vditor-copy>span[aria-label="复制"]');
  [].slice.call(copyNodeList).map((node) => {
    node?.addEventListener('click', function () {
      this.setAttribute('aria-label', '已复制');
    });
  });
}

/**
 * 文档目录渲染
 */
function outlineRender() {
  document.documentElement.scrollTop = 0;
  const editorNode = getElementById('myPreviewEditor');
  const hList = querySelectorAll(editorNode, 'h1,h2,h3,h4,h5,h6');
  if (hList?.length) {
    outlineNodeList.value = hList.map((h) => ({
      id: `catalog-${h.id}`,
      title: h.innerText,
      indent: h.nodeName,
    }));
  }
}

onMounted(() => {
  initPreview();
});
</script>

<template>
  <div v-bind="$attrs" class="w-full flex flex-row">
    <div id="myPreviewEditorContainer" class="content bg-white rounded-b-md" style="width: calc(100% - 260px)">
      <div id="myPreviewEditor" class="showmd px-12 pb-10 mt-4" style="min-height: 1140px" />
    </div>
    <div class="rightSider relative w-1/4" style="width: 260px; padding-left: 20px">
      <slot :catalog-list="outlineNodeList"></slot>
    </div>
  </div>
</template>

<style>
#myPreviewEditor .vditor-toolbar--hide {
  display: none !important;
}

#myPreviewEditor img {
  cursor: zoom-in;
}
</style>
