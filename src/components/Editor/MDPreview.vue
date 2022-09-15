<script lang='ts'>
import { defineComponent, toRefs, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Vditor from 'vditor/dist/method.min';
// import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { querySelectorAll, getElementById } from './vditorEditor';

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
  setup(props) {
    const router = useRouter();

    const { data } = toRefs<Props>(props);
    const isShowToTop = ref(false); // 是否显示回到顶部按钮
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
        lazyLoadImage: 'http://localhost:1229/loading.webp',
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
        },
      });
    });

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
      if (scrollTop >= 500) {
        isShowToTop.value = true;
      } else {
        isShowToTop.value = false;
      }
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

    // 置顶
    const toTop = () => {
      outlineActiveChanged(outlineNodeList.value?.[0]?.id);
      document.documentElement.scrollTop = 0;
    };

    const edit = (id) => {
      router.push(`/article/edit/${id}`);
    };

    return {
      isShowToTop,
      toTop,
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
              <a v-if='isEdit' @click='() => edit(data?.id)' class='ml-6 cursor-pointer text-indigo-500 hover:underline'>编辑</a>
            </div>
          </div>
        </div>
      </div>
      <div id='myPreviewEditor' class='showmd px-12 mt-4' style='min-height: 1140px;' />
    </div>
    <div class='rightSider relative w-1/4' style='width: 260px; padding-left: 20px;'>
      <div id='myPreviewEditorSider' class='fixed bg-white'>
        <nav style='height: 580px' class='relative overflow-hidden'>
          <h1 class='title font-bold pl-4 py-2 border-b' style='height: 50px'>目录</h1>
          <div id='myPreviewEditorOutlineList' class='overflow-y-auto overflow-x-hidden absolute right-0 w-full' style='max-height: 530px;'>
            <List :data-list='outlineNodeList' @click='outlineLinkContent' class='w-full' item-class='py-2 truncate cursor-pointer hover:bg-gray-100 relative text-sm'>
              <template #default='{ item }'>
                <el-tooltip effect='light' placement='left' :show-after='500'>
                  <template #content>
                    <span class='overflow-clip inline-block' style='max-width:350px'>{{ item.title }}</span>
                  </template>
                  <span :id='item.id' :class='[`indent-${item.indent}`, item.id === outlineActiveNodeId ? "active" : ""]'>{{ item.title }}</span>
                </el-tooltip>
              </template>
            </List>
          </div>
        </nav>
      </div>
    </div>
    <div class='oprate flex flex-col fixed right-16 bottom-20'>
      <div id='toTop' v-show='isShowToTop' @click='toTop' class='w-8 h-8 bg-white flex justify-center items-center rounded-full cursor-pointer'>
        <i title='回到顶部' class='absolute w-4 h-4' />
      </div>
    </div>
  </div>
</template>

<style>
#toTop > i {
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjUyMjcxMDM2MjcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU0ODciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBmZWVkYmFjay1pY29uZm9udDsgc3JjOiB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmYyP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZjIiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzEwMzExNThfdTY5dzh5aHhkdS53b2ZmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LnR0Zj90PTE2MzAwMzM3NTk5NDQiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTgzMiA2NEgxOTJjLTE3LjYgMC0zMiAxNC40LTMyIDMyczE0LjQgMzIgMzIgMzJoNjQwYzE3LjYgMCAzMi0xNC40IDMyLTMycy0xNC40LTMyLTMyLTMyek04NTIuNDg0IDUxOS40NjlMNTM4LjU5MiAyMDUuNTc3YTMwLjc5IDMwLjc5IDAgMCAwLTMuNjkzLTQuNDc2Yy02LjI0MS02LjI0MS0xNC41NTYtOS4yNTgtMjIuODk5LTkuMDktOC4zNDMtMC4xNjgtMTYuNjU4IDIuODQ5LTIyLjg5OSA5LjA5YTMwLjc3OCAzMC43NzggMCAwIDAtMy42OTMgNC40NzZMMTcxLjQxOSA1MTkuNTY2QzE2NC40NDkgNTI1LjQ0OCAxNjAgNTM0LjIyOCAxNjAgNTQ0YzAgMC4wNTggMC4wMDQgMC4xMTUgMC4wMDQgMC4xNzItMC4xMjQgOC4yODUgMi44OTkgMTYuNTI5IDkuMDk2IDIyLjcyNyA2LjIwMiA2LjIwMiAxNC40NTMgOS4yMjQgMjIuNzQzIDkuMDk2IDAuMDY2IDAgMC4xMzEgMC4wMDUgMC4xOTcgMC4wMDVIMzUydjMyMGMwIDM1LjIgMjguOCA2NCA2NCA2NGgxOTJjMzUuMiAwIDY0LTI4LjggNjQtNjRWNTc2aDE2MGMwLjA1OCAwIDAuMTE1LTAuMDA0IDAuMTcyLTAuMDA0IDguMjg1IDAuMTI0IDE2LjUyOS0yLjg5OSAyMi43MjctOS4wOTYgNi4xOTgtNi4xOTggOS4yMi0xNC40NDIgOS4wOTYtMjIuNzI3IDAtMC4wNTggMC4wMDQtMC4xMTUgMC4wMDQtMC4xNzIgMC4wMDEtOS44MjYtNC40ODktMTguNjUtMTEuNTE1LTI0LjUzMnoiIHAtaWQ9IjU0ODgiPjwvcGF0aD48L3N2Zz4=);
}

#toTop {
  box-shadow: 0px 1px 8px -5px #555;
  animation: bounceInUp 600ms;
}

#toTop:hover {
  box-shadow: 0px 1px 8px -2px #555;
}

#myPreviewEditor .vditor-toolbar--hide {
  display: none !important;
}

#myPreviewEditorSider {
  box-shadow: 0px 0px 8px -6px #000;
  border-radius: 3px;
  width: 260px;
  top: 4.5rem;
}

#myPreviewEditorOutlineList ul > li > span.active::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 60%;
  @apply bg-indigo-600 left-0 rounded-tr-lg rounded-br-lg;
}

#myPreviewEditorOutlineList ul > li > span.active {
  @apply text-indigo-600;
}

#myPreviewEditorOutlineList ul > li > span {
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
