<script lang='ts'>
import { defineComponent, toRefs, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Vditor from 'vditor/dist/method.min';
import 'vditor/dist/index.css';
import { querySelectorAll, getElementById, getBoundingClientRect } from './vditorEditor';

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
  isEdit: boolean;
}

interface OutlineNode {
  id: string;
  title: string;
  indent: string;
}

export default defineComponent({
  name: 'MDPreview',
  props: ['data', 'isEdit'],
  emits: ['onToTop'],
  setup(props, { emit }) {
    const router = useRouter();

    const { data } = toRefs<Props>(props);
    const outlineNodeList = ref<OutlineNode[]>([]); // 目录对象
    const outlineActiveNodeId = ref('');
    let isOutlineClick = false; // 是否是点击大纲，如果是则不触发onScroll

    watch(data, (newVal) => {
      let count = 0;
      document.documentElement.scrollTop = 0;
      getElementById('myPreviewEditorOutlineList').scrollTop = 0;
      Vditor.preview(getElementById('myPreviewEditor'), newVal?.content, {
        hljs: {
          style: newVal?.codeTheme ?? 'github',
        },
        theme: {
          current: newVal?.contentTheme ?? 'Chinese-red',
          path: 'http://localhost:1229/editor/theme',
        },
        lazyLoadImage: 'http://localhost:1229/editor/loading.webp',
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
    });

    /**
     * 预览图片(图片点击放大)
     */
    function previewImg() {
      const editorNode = getElementById('myPreviewEditor');
      const imgList = querySelectorAll(editorNode, 'img');
      imgList.map(img => {
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
          imgWrapper.setAttribute('style', `position:fixed;left:0;top:0;bottom:0;right:0;background-color:rgba(0,0,0,.8);z-index:2001;
            cursor:zoom-out;opacity:0;transition:opacity ${duration}ms cubic-bezier(.2,0,.2,1);`);

          // 新建一个img元素
          const imgPreview = document.createElement('img');
          imgPreview.setAttribute('src', (img as HTMLImageElement).currentSrc);
          imgPreview.setAttribute('style', `position:absolute;left:${left}px;top:${top + scrollTop}px;width:${width}px;
            height:${height}px;z-index:2001;cursor:zoom-out;transform:scale(1) translate(0,0);transition:transform ${duration}ms cubic-bezier(.2,0,.2,1);`);

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
      const editorNode = getElementById('myPreviewEditor');
      const hList = querySelectorAll(editorNode, 'h1,h2,h3,h4,h5,h6');
      if (hList?.length) {
        outlineNodeList.value = hList.map((h) => ({
          id: `outline-${h.id}`,
          title: h.innerText,
          indent: h.nodeName,
        }));
        setTimeout(() => contentLinkOutline(hList), 1000);
        outlineActiveNodeId.value = outlineNodeList.value[0].id;
      }
    }

    /**
     * 内容关联目录(内容区滚动时目录关联滚动)
     */
    function contentLinkOutline(hList) {
      hList?.map((node) => {
        const obeserver = new IntersectionObserver(
          function (entries) {
            const [entry] = entries;
            const { isIntersecting, boundingClientRect, target } = entry ?? {};
            // isOutlineClick=true说明是点击大纲节点触发的Vditor内部的滚动事件，不需要再执行以下自定义滚动事件
            if (isOutlineClick) {
              return;
            }
            let newActiveNodeId = null;
            if (isIntersecting === false && boundingClientRect?.y < 60) {
              newActiveNodeId = target?.id;
            } else if (isIntersecting === true && boundingClientRect?.y < 60) {
              const index = hList.findIndex((h) => h.id === target.id);
              newActiveNodeId = hList[index === 0 ? 0 : index - 1].id;
            }
            if (newActiveNodeId) outlineActiveChanged(`outline-${newActiveNodeId}`);
          },
          {
            rootMargin: '-60px 0px 0px 0px',
          }
        );
        obeserver.observe(node);
      });
    }

    /**
     * 选中的大纲节点变化
     * @param newActiveNodeId 新选中的节点id
     */
    function outlineActiveChanged(newActiveNodeId) {
      if (!newActiveNodeId) return;
      outlineActiveNodeId.value = newActiveNodeId;
      getElementById(outlineActiveNodeId.value)?.scrollIntoView({ block: 'center', behavior: 'auto' });
    }

    /**
     * 目录关联内容(目录滚动时内容区关联滚动)
     */
    function outlineLinkContent(outline) {
      if (!outline) return;
      isOutlineClick = true;
      outlineActiveNodeId.value = outline.id;
      const contentNodeId = outline.id.replace('outline-', '');
      getElementById(contentNodeId)?.scrollIntoView?.({ block: 'start', behavior: 'auto' });
      setTimeout(() => (isOutlineClick = false), 800);
    }

    /**
     * 文档内容区滚动事件，主要处理header头的隐现与置顶按钮隐现
     */
    function onScroll() {
      const scrollTop = document.documentElement.scrollTop;
      emit('onToTop', scrollTop >= 500);
      if (scrollTop <= 0) {
        outlineActiveChanged(outlineNodeList.value?.[0]?.id);
      }
    }

    onMounted(() => {
      document.addEventListener('scroll', onScroll);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('scroll', onScroll);
    });

    const edit = (id) => {
      router.push(`/article/edit/${id}`);
    };

    return {
      edit,
      outlineNodeList,
      outlineActiveNodeId,
      outlineLinkContent,
    };
  },
});
</script>

<template>
  <div v-bind='$attrs' class='w-full flex flex-row'>
    <div id='myPreviewEditorContainer' class='content bg-white mb-4 rounded-md' style='width: calc(100% - 260px);'>
      <div class='pl-10'>
        <h1 class='title font-bold pt-4 text-3xl text-gray-600'>{{ data?.name }}</h1>
        <div class='flex mt-3 text-gray-400 items-center'>
          <img :src='data?.user?.avatar' class='w-10 h-10 rounded-full mr-4 cursor-pointer' />
          <div class='flex flex-col'>
            <span class='user mr-6 text-xl text-gray-600 cursor-pointer'>{{ data?.user?.name }}</span>
            <div>
              <span class='createTime'>{{ data?.updateTime ?? data?.createTime }}</span>
              <span class='ml-6'>阅读 {{ data?.readCount ?? 0 }}</span>
              <a
                v-if='isEdit' @click='() => edit(data?.id)'
                class='ml-6 cursor-pointer text-indigo-500 hover:underline'
              >编辑</a>
            </div>
          </div>
        </div>
      </div>
      <div id='myPreviewEditor' class='showmd px-12 pb-10 mt-4' style='min-height: 1140px;' />
    </div>
    <div class='rightSider relative w-1/4' style='width: 260px; padding-left: 20px;'>
      <div id='myPreviewEditorSider' class='fixed bg-white'>
        <nav style='height: 580px' class='relative overflow-hidden'>
          <h1 class='title font-bold pl-4 py-2 border-b' style='height: 50px'>目录</h1>
          <div
            id='myPreviewEditorOutlineList' class='overflow-y-auto overflow-x-hidden absolute right-0 w-full'
            style='max-height: 530px;'
          >
            <List
              :data-list='outlineNodeList' @click='outlineLinkContent' class='w-full'
              item-class='py-2 truncate cursor-pointer hover:bg-gray-100 relative text-sm'
            >
              <template #default='{ item }'>
                <el-tooltip effect='light' placement='left' :show-after='500'>
                  <template #content>
                    <span class='overflow-clip inline-block' style='max-width:350px'>{{ item.title }}</span>
                  </template>
                  <span
                    :id='item.id'
                    :class='[`indent-${item.indent}`, item.id === outlineActiveNodeId ? "active" : ""]'
                  >{{ item.title
                  }}</span>
                </el-tooltip>
              </template>
            </List>
          </div>
        </nav>
      </div>
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

#myPreviewEditorSider {
  box-shadow: 0px 0px 8px -6px #000;
  border-radius: 3px;
  width: 260px;
  /* top: 4.5rem; */
}

#myPreviewEditorOutlineList ul>li>span.active::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 60%;
  @apply bg-indigo-600 left-0 rounded-tr-lg rounded-br-lg;
}

#myPreviewEditorOutlineList ul>li>span.active {
  @apply text-indigo-600;
}

#myPreviewEditorOutlineList ul>li>span {
  @apply text-gray-600;
}

.indent-H1 {
  padding-left: 10px;
}

.indent-H2 {
  padding-left: 26px;
}

.indent-H3 {
  padding-left: 42px;
}

.indent-H4 {
  padding-left: 58px;
}

.indent-H5 {
  padding-left: 74px;
}

.indent-H6 {
  padding-left: 90px;
}
</style>
