<script lang="ts" setup>
import { defineProps, toRefs, ref, onMounted } from 'vue';
import Vditor from 'vditor/dist/method.min';
import gsap from 'gsap';
// import 'vditor/dist/index.css';
import { querySelectorAll, getElementById, getBoundingClientRect, querySelector, createElement } from './domUtil';

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
              <div class='code-block-menus'>
                <i></i><i title='最小化' class='code-suofang-checkbox'></i><i title='全屏' class='code-fullscreen-checkbox'></i>
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
      // 代码块缩放
      codeblockZoom();
    },
  });
}

/**
 * 代码块支持全屏、全屏后的关闭、最小化、退出全屏
 */
function codeblockZoom() {
  // 全屏及全屏后的操作
  const fullscreenDom = querySelectorAll(getElementById('myPreviewEditor'), '.code-fullscreen-checkbox');
  fullscreenDom.forEach(dom => dom.addEventListener('click', function (e) {
    const target = (e.target as HTMLInputElement);
    const codeBlock = target.closest('.code-block');
    const { top, left, width, height } = getBoundingClientRect(codeBlock);
    const pre = querySelector(codeBlock, '.code-content pre');
    const container = createElement('div', {
      class: 'showmd',
      style: `position: fixed; top: ${top}px; left: ${left}px; z-index: 10000; width: ${width}px; height: ${height}px; background-color: #fff`
    },
      createElement('div', {
        class: 'code-block', style: 'height: 100%; margin: 0; border-radius: 0;'
      },
        createElement('div', { class: 'code-block-menus' },
          createElement('i', {
            style: 'width: 10px; height: 10px; background-color: #F87171; border-radius: 50%; cursor: pointer;',
            title: '关闭',
            onclick() {
              gsap.to(container, {
                scale: 2,
                opacity: 0,
                transformOrigin: '50vw 50vh',
                onStart() {
                  document.body.classList.remove('overflow-hidden');
                },
                onComplete() {
                  document.body.removeChild(container);
                }
              });
            }
          }),
          createElement('i', {
            style: 'width: 10px; height: 10px; background-color: #FBBF24; border-radius: 50%; cursor: pointer;',
            title: '最小化',
            onclick() {
              gsap.to(container, {
                width: `${width}px`,
                height: 0,
                top: `${top}px`,
                left: `${left}px`,
                overflow: 'hidden',
                onStart() {
                  document.body.classList.remove('overflow-hidden');
                },
                onComplete() {
                  document.body.removeChild(container);
                }
              });
            }
          }),
          createElement('i', {
            style: 'width: 10px; height: 10px; background-color: #34D399; border-radius: 50%; cursor: pointer;',
            title: '退出全屏',
            onclick() {
              gsap.to(container, {
                width: `${width}px`,
                height: `${height}px`,
                top: `${top}px`,
                left: `${left}px`,
                transformOrigin: '50vw 50vh',
                onStart() {
                  document.body.classList.remove('overflow-hidden');
                },
                onComplete() {
                  document.body.removeChild(container);
                }
              });
            }
          }),
        ),
        createElement('div', { style: 'position: relative; overflow: auto; max-height: calc(100% -20px)' },
          createElement(pre.cloneNode(true), {
            onmouseover: function () {
              querySelector(this, '.vditor-copy').style.display = 'block';
            },
            onmouseout: function () {
              querySelector(this, '.vditor-copy').style.display = 'none';
            },
          }))
      ));
    document.body.appendChild(container);
    gsap.to(container, {
      width: '100vw',
      height: '100vh',
      top: 0,
      left: 0,
      transformOrigin: '50vw 50vh',
      onComplete() {
        document.body.classList.add('overflow-hidden');
      }
    });
  }));

  // 收起/展开代码
  const suofangDom = querySelectorAll(getElementById('myPreviewEditor'), '.code-suofang-checkbox');
  suofangDom.forEach(dom => dom.addEventListener('click', function (e) {
    const target = (e.target as HTMLInputElement);
    const codeBlock = target.closest('.code-block');
    const { height } = getBoundingClientRect(codeBlock);
    const originHeight = codeBlock.getAttribute('origin-height');
    gsap.to(codeBlock, {
      height: originHeight ?? 20,
      onComplete() {
        codeBlock.setAttribute('origin-height', `${height}px`);
      }
    });
  }));
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
  copyNodeList.map((node) => {
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
    <div id="myPreviewEditorContainer" class="content rounded-b-md">
      <div id="myPreviewEditor" class="showmd px-12 pb-10 mt-2" style="min-height: 1140px" />
    </div>
    <div class="rightSider relative w-1/4" style="width: 260px; padding-left: 20px">
      <slot :catalog-list="outlineNodeList"></slot>
    </div>
  </div>
</template>

<style>
#myPreviewEditorContainer {
  width: calc(100% - 260px);
  background-color: var(--showmd-bg-color-primary);
}

#myPreviewEditor .vditor-toolbar--hide {
  display: none !important;
}

#myPreviewEditor img {
  cursor: zoom-in;
}
</style>
