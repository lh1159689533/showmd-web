<script lang="ts" setup>
import { computed, defineProps, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
import CanvasBG from '@components/CanvasBG/Index.vue';
import message from '@utils/message';
import { findById, findPrevColumnArticle, findNextColumnArticle } from '@service/article';
import { findByArticleId } from '@service/column';
import Catalog from '@src/components/Editor/Catalog.vue';

const props = defineProps<{
  id: number;
}>();

const router = useRouter();
const store = useStore();

const commentDom = ref();

const article = ref();
const prevColumnArticle = ref(); // 专栏上一篇文章
const nextColumnArticle = ref(); // 专栏下一篇文章
const loading = ref(true);
const isShowToTop = ref(false); // 是否显示回到顶部按钮

const isShowCatalog = ref(false); // 是否显示目录

const isShowHeader = computed(() => store.getters.isShowHeader);
const commentData = computed(() => store.state.comment.commentData);
const currentUser = computed(() => store.getters.getUser);
const catalogHeight = computed(() => store.getters.catalogHeight);

async function getArticle() {
  // 编辑文章,获取文章内容
  const result = await findById(props.id);
  if (!result) {
    return message.error('文章不存在');
  }
  const column = await findByArticleId(props.id);
  article.value = {
    ...result,
    content: decodeURIComponent(result.content),
    createTime: dayjs(result.createTime).format('YYYY年MM月DD日 HH:mm'),
    updateTime: dayjs(result.updateTime).format('YYYY年MM月DD日 HH:mm'),
    column,
  };

  // if (result.user) {
  //   store.commit('setArticleAuthor', result.user);
  // }
  const { id, name, user } = article.value;
  store.dispatch('listComment', { id, name, user });

  setTimeout(() => (loading.value = false), 1000);
}

async function prev() {
  const result = await findPrevColumnArticle(props.id);
  prevColumnArticle.value = result;
}

async function next() {
  const result = await findNextColumnArticle(props.id);
  nextColumnArticle.value = result;
}

async function init() {
  if (props.id) {
    await getArticle();
    next();
    prev();
  }
}

// 跳转到评论
const toComment = () => {
  commentDom.value?.scrollIntoView({ block: 'start' });
};

// 编辑
const toEdit = () => {
  router.push(`/article/edit/${props.id}`);
};

// 预览
const toPreview = (articleId) => {
  const { href } = router.resolve(`/article/preview/${articleId}`);
  window.open(href, '_blank');
};

// 置顶
const toTop = () => {
  document.documentElement.scrollTop = 0;
};

/**
 * 跳转专栏详情
 * @param columnId 专栏id
 */
const toColumnDetail = (columnId) => {
  const { href } = router.resolve(`/column/${columnId}`);
  window.open(href, '_blank');
};

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
}

onMounted(() => {
  document.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  document.removeEventListener('scroll', onScroll);
});

init();
</script>

<template>
  <div class="container relative z-100" style="margin-top: 104px;">
    <!-- 加载动画 -->
    <div v-if="loading" style="width: calc(100% - 260px); height: 100vh" class="p-6 bg-white dark:bg-zinc-900">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="h1" style="width: 300px; height: 30px" />
          <div style="display: flex; align-items: center">
            <el-skeleton-item variant="circle" style="width: 45px; height: 45px; margin-top: 6px" />
            <div style="padding: 0 0 0 8px">
              <el-skeleton-item variant="text" style="width: 100px; height: 12px" />
              <el-skeleton-item variant="text" style="display: block; width: 180px; height: 16px" />
            </div>
          </div>
          <el-skeleton-item variant="rect" style="width: 80%; height: 380px; margin-top: 20px" />
        </template>
      </el-skeleton>
    </div>
    <!-- 左侧操作栏 -->
    <ul class="action-box fixed -ml-24 top-40">
      <li @click="toComment">
        <el-badge :value="commentData?.count || ''" type="info" :max="999">
          <div class="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-zinc-800">
            <i class="iconfont icon-reply text-gray-600 dark:text-zinc-500"></i>
          </div>
        </el-badge>
      </li>
      <li @click="toEdit" v-if="currentUser?.id === article?.user?.id && isShowToTop" class="edit mt-6">
        <div class="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-zinc-800">
          <i class="iconfont icon-bianji text-gray-600 dark:text-zinc-500"></i>
        </div>
      </li>
    </ul>
    <!-- 内容区 -->
    <div>
      <div class="px-10 rounded-t-md bg-white dark:bg-zinc-900" style="width: calc(100% - 260px)">
        <h2 class="title font-bold pt-4 text-3xl text-gray-600 dark:text-zinc-300">{{ article?.name }}</h2>
        <div class="flex mt-5 text-gray-400 items-center">
          <Avatar :src="article?.user?.avatar" class="w-10 h-10 rounded-full mr-4 cursor-pointer" />
          <div class="flex flex-col">
            <span class="user mr-6 text-base cursor-pointer text-gray-600 dark:text-zinc-300">{{ article?.user?.name
            }}</span>
            <div>
              <span class="createTime text-sm dark:text-zinc-500">{{ article?.updateTime ?? article?.createTime }}</span>
              <span class="ml-6 text-sm dark:text-zinc-500">阅读 {{ article?.readCount ?? 0 }}</span>
              <a
                v-if="currentUser?.id === article?.user?.id" @click="() => toEdit()"
                class="ml-6 cursor-pointer text-sm text-indigo-500 hover:underline"
              >编辑</a>
            </div>
          </div>
        </div>
        <div
          v-if="article?.column"
          class="column-info mt-6 p-3 border rounded flex gap-2 items-center border-gray-100 dark:border-zinc-800"
        >
          <div
            @click="() => toColumnDetail(article?.column?.id)"
            class="flex gap-2 items-center cursor-pointer text-gray-600 hover:text-indigo-500"
          >
            <img
              :src="article?.column?.cover?.url" class="w-9 h-9"
              @error="(e) => (e.target as HTMLImageElement).src = '/img/column-default-cover.webp'"
            />
            <span class="name dark:text-zinc-300">{{ article?.column?.name }}</span>
          </div>
          <span class="detail text-sm flex-1 text-gray-400 dark:text-zinc-500">专栏收录该文章</span>
          <span class="text-sm flex gap-4 text-gray-400 dark:text-zinc-500">
            <span>{{ article?.column?.subscribeCnt }} 订阅</span>
            <span>{{ article?.column?.articleCnt }} 篇文章</span>
          </span>
        </div>
      </div>
      <MDPreview v-if="!loading && article?.editorType === 1" :data="article">
        <template #default="{ catalogList }">
          <Catalog v-if="catalogList?.length" :data="catalogList" @on-loaded="() => (isShowCatalog = true)" />
        </template>
      </MDPreview>
      <RTPreview v-if="!loading && article?.editorType === 2" :data="article">
        <template #default="{ catalogList }">
          <Catalog v-if="catalogList?.length" :data="catalogList" @on-loaded="() => (isShowCatalog = true)" />
        </template>
      </RTPreview>
    </div>
    <!-- 收录于同一专栏的上/下一篇文章 -->
    <div
      v-show="!loading" class="absolute right-0" style="width: 240px; transition: 300ms"
      :style="[isShowHeader ? (isShowCatalog ? `top: ${catalogHeight + 20}px` : 'top: 0px') : isShowCatalog ? `top: ${catalogHeight - 53}px` : 'top: -48px']"
    >
      <div class="flex-col fixed">
        <div
          v-if="prevColumnArticle" class="w-full h-24 px-4 py-2 mb-3 rounded bg-white dark:bg-zinc-900"
          style="box-shadow: 0px 0px 8px -6px #000; width: 260px"
        >
          <h4 class="font-bold py-2 border-b dark:text-zinc-300 dark:border-zinc-800">上一篇</h4>
          <el-tooltip effect="light" placement="left" :show-after="500">
            <template #content>
              <span class="overflow-clip inline-block" style="max-width: 350px">{{ prevColumnArticle?.name }}</span>
            </template>
            <p
              @click="() => toPreview(prevColumnArticle?.id)"
              class="text-sm pt-2 cursor-pointer truncate text-gray-600 hover:text-indigo-500 dark:text-zinc-300 dark:hover:text-indigo-500"
            >
              {{ prevColumnArticle?.name }}
            </p>
          </el-tooltip>
        </div>
        <div
          v-if="nextColumnArticle" class="w-full h-24 px-4 py-2 rounded bg-white dark:bg-zinc-900"
          style="box-shadow: 0px 0px 8px -6px #000; width: 260px"
        >
          <h4 class="font-bold py-2 border-b dark:text-zinc-300 dark:border-zinc-800">下一篇</h4>
          <el-tooltip effect="light" placement="left" :show-after="500">
            <template #content>
              <span class="overflow-clip inline-block" style="max-width: 350px">{{ nextColumnArticle?.name }}</span>
            </template>
            <p
              @click="() => toPreview(nextColumnArticle?.id)"
              class="text-sm pt-2 cursor-pointer truncate text-gray-600 hover:text-indigo-500 dark:text-zinc-500 dark:hover:text-indigo-500"
            >
              {{ nextColumnArticle?.name }}
            </p>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div
      v-if="!loading" ref="commentDom" class="comment px-10 py-2 pb-16 rounded-md mb-12 mt-4 bg-white dark:bg-zinc-900"
      style="width: calc(100% - 260px)"
    >
      <Comment :data="commentData" />
    </div>
    <div class="oprate flex flex-col fixed right-36 bottom-20">
      <div
        id="toTop" v-show="isShowToTop" @click="toTop"
        class="w-8 h-8 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-zinc-900"
      >
        <i title="回到顶部" class="iconfont icon-huidaodingbu text-block dark:text-zinc-500" />
      </div>
    </div>
  </div>
  <CanvasBG v-show="!loading" class="fixed w-screen h-screen top-0 left-0" />
</template>

<style>
.action-box .el-badge__content--info {
  @apply bg-gray-400 dark: bg-zinc-500;
}

.action-box .edit {
  animation: bounceIn 600ms;
}

/* #toTop>i {
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjUyMjcxMDM2MjcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU0ODciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBmZWVkYmFjay1pY29uZm9udDsgc3JjOiB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmYyP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZjIiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzEwMzExNThfdTY5dzh5aHhkdS53b2ZmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LnR0Zj90PTE2MzAwMzM3NTk5NDQiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTgzMiA2NEgxOTJjLTE3LjYgMC0zMiAxNC40LTMyIDMyczE0LjQgMzIgMzIgMzJoNjQwYzE3LjYgMCAzMi0xNC40IDMyLTMycy0xNC40LTMyLTMyLTMyek04NTIuNDg0IDUxOS40NjlMNTM4LjU5MiAyMDUuNTc3YTMwLjc5IDMwLjc5IDAgMCAwLTMuNjkzLTQuNDc2Yy02LjI0MS02LjI0MS0xNC41NTYtOS4yNTgtMjIuODk5LTkuMDktOC4zNDMtMC4xNjgtMTYuNjU4IDIuODQ5LTIyLjg5OSA5LjA5YTMwLjc3OCAzMC43NzggMCAwIDAtMy42OTMgNC40NzZMMTcxLjQxOSA1MTkuNTY2QzE2NC40NDkgNTI1LjQ0OCAxNjAgNTM0LjIyOCAxNjAgNTQ0YzAgMC4wNTggMC4wMDQgMC4xMTUgMC4wMDQgMC4xNzItMC4xMjQgOC4yODUgMi44OTkgMTYuNTI5IDkuMDk2IDIyLjcyNyA2LjIwMiA2LjIwMiAxNC40NTMgOS4yMjQgMjIuNzQzIDkuMDk2IDAuMDY2IDAgMC4xMzEgMC4wMDUgMC4xOTcgMC4wMDVIMzUydjMyMGMwIDM1LjIgMjguOCA2NCA2NCA2NGgxOTJjMzUuMiAwIDY0LTI4LjggNjQtNjRWNTc2aDE2MGMwLjA1OCAwIDAuMTE1LTAuMDA0IDAuMTcyLTAuMDA0IDguMjg1IDAuMTI0IDE2LjUyOS0yLjg5OSAyMi43MjctOS4wOTYgNi4xOTgtNi4xOTggOS4yMi0xNC40NDIgOS4wOTYtMjIuNzI3IDAtMC4wNTggMC4wMDQtMC4xMTUgMC4wMDQtMC4xNzIgMC4wMDEtOS44MjYtNC40ODktMTguNjUtMTEuNTE1LTI0LjUzMnoiIHAtaWQ9IjU0ODgiPjwvcGF0aD48L3N2Zz4=);
} */

#toTop {
  box-shadow: 0px 1px 8px -5px #555;
  animation: bounceInUp 600ms;
}

#toTop:hover {
  box-shadow: 0px 1px 8px -2px #555;
}</style>
