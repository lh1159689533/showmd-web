<script lang='ts'>
import { defineComponent, toRefs, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { querySelectorAll, addClass, removeClass, getNodeByClassName, getNodeByAttribute, getElementById } from './vditorEditor';
import Vditor from 'vditor/dist/method.min';
import 'vditor/dist/index.css';

export default defineComponent({
  name: 'PreviewEditor',
  props: ['data'],
  setup(props) {
    const { data } = toRefs(props);
    const isShowToTop = ref(false); // 是否显示回到顶部按钮
    let outlineNodeList = []; // 大纲节点列表
    let targetIdList = []; // 大纲节点id列表
    const isOutlineClick = false; // 是否是点击大纲，如果是则不触发onScroll

    watch(data, (newVal) => {
      let count = 0;
      document.documentElement.scrollTop = 0;
      getElementById('myPreviewEditorOutlineList').scrollTop = 0;
      Vditor.preview(getElementById('myPreviewEditor'), newVal?.content, {
        hljs: {
          style: props.data?.codeTheme ?? 'github',
        },
        theme: {
          current: props.data?.contentTheme ?? 'Chinese-red',
          path: 'http://localhost:1229/editor/theme',
        },
        lazyLoadImage: 'https://cdn.jsdelivr.net/npm/vditor/dist/images/img-loading.svg',
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
          // 文档大纲渲染，并添加事件
          outlineRender();
          // 代码复制
          codeCopy();
        },
      });
    });

    /**
     * 代码片段复制按钮点击复制后显示 '已复制'
     */
    function codeCopy() {
      const editor = getElementById('myPreviewEditor');
      const copyNodeList = querySelectorAll(editor, '.vditor-copy>span[aria-label="复制"]');
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
      outlineNodeList?.map((node) => {
        node.addEventListener('click', function () {
          // isOutlineClick = true;
          // 点击节点添加选中样式 active，其他节点去掉选中样式 active
          const currentActiveNode = getNodeByClassName(outlineNodeList, 'active');
          removeClass(currentActiveNode, 'active');
          addClass(this, 'active');
        });
      });

      setTimeout(outlineNodeTopChanged, 500);
    }

    function outlineNodeTopChanged() {
      // 获取大纲节点的top值
      targetIdList = outlineNodeList.map((node) => node.getAttribute('data-target-id')).filter((id) => id !== '');

      targetIdList?.map((id) => {
        const node = getElementById(id);
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
              const index = targetIdList.findIndex((id) => id === target.id);
              newActiveNodeId = targetIdList[index === 0 ? 0 : index - 1];
            }
            outlineActiveChanged(newActiveNodeId);
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
      const currentActiveNode = getNodeByClassName(outlineNodeList, 'active');
      // 根据当前最顶部的内容(h1-6)的id找到对应的大纲节点，即当前选中大纲节点
      const newActiveNode = getNodeByAttribute(outlineNodeList, 'data-target-id', newActiveNodeId);
      if (newActiveNode && currentActiveNode) {
        // 大纲节点显示到其滚动容器中心(有滚动条的时候)
        newActiveNode.scrollIntoView({ block: 'center', behavior: 'auto' });
        // 要选中的大纲节点添加选中样式，当前选中大纲节点去掉选中样式
        removeClass(currentActiveNode, 'active');
        addClass(newActiveNode, 'active');
      }
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
        outline.style.display = 'block';
        initOutline(outline);
      } else {
        getElementById('myPreviewEditorSider').style.display = 'none';
      }
    }

    /**
     * 文档内容区滚动事件，主要处理与大纲的联动效果
     */
    function onScroll() {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop >= 500) {
        isShowToTop.value = true;
      } else {
        isShowToTop.value = false;
      }
      if (scrollTop <= 0) {
        outlineActiveChanged(targetIdList[0]);
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
      outlineActiveChanged(targetIdList[0]);
      document.documentElement.scrollTop = 0;
    };

    return {
      isShowToTop,
      toTop,
    };
  },
  methods: {
    edit() {
      this.$router.push(`/article/edit/${this.data?.id}`);
    },
  },
});
</script>

<template>
  <div v-bind='$attrs' class='w-full flex flex-row'>
    <div id='myPreviewEditorContainer' class='content bg-white' style='width: calc(100% - 260px);'>
      <div class='pl-10'>
        <h1 class='title font-bold pt-4 text-3xl text-gray-600'>{{ data?.name }}</h1>
        <div class='flex mt-3 text-gray-400 items-center'>
          <img :src='data?.user?.avatar' class='w-10 h-10 rounded-full mr-4 cursor-pointer' />
          <div class='flex flex-col'>
            <span class='user mr-6 text-xl text-gray-600 cursor-pointer'>{{ data?.user?.name }}</span>
            <div>
              <span class='createTime'>{{ data?.updateTime ?? data?.createTime }}</span>
              <span class='ml-6'>阅读 {{ data?.readCount ?? 0 }}</span>
              <a @click='edit' class='ml-6 cursor-pointer text-indigo-500 hover:underline'>编辑</a>
            </div>
          </div>
        </div>
      </div>
      <div id='myPreviewEditor' class='showmd px-12 mt-4' style='min-height: 1140px;' />
    </div>
    <div class='rightSider relative w-1/4' style='width: 260px; padding-left: 20px;'>
      <div id='myPreviewEditorSider' class='fixed border hidden bg-white'>
        <nav style='height: 580px' class='relative overflow-hidden'>
          <h1 class='title font-bold pl-4 py-2 border-b' style='height: 50px'>目录</h1>
          <div id='myPreviewEditorOutlineList' class='overflow-y-auto overflow-x-hidden absolute right-0' style='max-height: 530px;margin: 8px 4px 0 0;'>
            <div id='myPreviewEditorOutline' style='padding-left: 2px' />
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

/* .vditor-outline {
  display: block !important;
} */

.vditor-outline ul {
  padding-left: 0 !important;
}

.vditor-outline li > span {
  @apply relative;
}

.vditor-outline li > span.active::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 60%;
  @apply bg-indigo-600 left-0 rounded-tr-lg rounded-br-lg;
}

.vditor-outline li > span:hover {
  @apply bg-gray-50;
}

.vditor-outline li > span > span {
  color: #333;
  font-size: 0.9rem;
}

.vditor-outline li > span.active > span {
  @apply text-indigo-600;
}
</style>
