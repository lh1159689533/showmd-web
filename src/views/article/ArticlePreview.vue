<script lang="ts" setup>
import { computed, defineProps, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
import CanvasBG from '@components/CanvasBG/Index.vue';
import EnhancedImage from '@components/EnhancedImage/index.vue';
import message from '@utils/message';
import { findById, findPrevColumnArticle, findNextColumnArticle } from '@service/article';
import { findByArticleId } from '@service/column';
import Catalog from '@components/Editor/Catalog.vue';
import TUIPreview from '@components/Editor/TUIPreview.vue';
import RTPreview from '@components/Editor/RTPreview.vue';
import Comment from '@components/Comment/Comment.vue';

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
// 目录
const catalogList = ref([]);

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
  document.body.scrollTop = 0;
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
  const scrollTop = document.body.scrollTop;
  if (scrollTop >= 500) {
    isShowToTop.value = true;
  } else {
    isShowToTop.value = false;
  }
}

const onLoaded = (catalogData) => {
  catalogList.value = catalogData;
}

onMounted(() => {
  document.body.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('scroll', onScroll);
});

init();
</script>

<template>
  <div class="article-preview-container relative z-100" style="margin-top: 104px;">
    <!-- 加载动画 -->
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-content">
        <div class="skeleton-header">
          <div class="skeleton-title"></div>
          <div class="skeleton-meta">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-info">
              <div class="skeleton-name"></div>
              <div class="skeleton-time"></div>
            </div>
          </div>
        </div>
        <div class="skeleton-body"></div>
      </div>
    </div>

    <!-- 左侧操作栏 -->
    <ul v-show="!loading" class="action-box fixed -ml-24 top-40">
      <li @click="toComment">
        <el-badge :value="commentData?.count || ''" type="info" :max="999">
          <div class="action-comment w-10 h-10 flex justify-center items-center rounded-full cursor-pointer">
            <i class="iconfont icon-reply"></i>
          </div>
        </el-badge>
      </li>
      <li @click="toEdit" v-if="currentUser?.id === article?.user?.id && isShowToTop" class="action-edit mt-6">
        <div class="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer">
          <i class="iconfont icon-bianji"></i>
        </div>
      </li>
    </ul>
    <!-- 内容区 -->
    <div v-show="!loading" class="article-preview">
      <div class="article-preview-header">
        <div class="header-background"></div>
        <div class="header-content">
          <h1 class="article-title">{{ article?.name }}</h1>
          <div class="article-meta">
            <div class="author-info">
              <Avatar :src="article?.user?.avatar" class="author-avatar" />
              <div class="author-details">
                <span class="author-name">{{ article?.user?.name }}</span>
                <div class="article-stats">
                  <span class="publish-time">{{ article?.updateTime ?? article?.createTime }}</span>
                  <span class="read-count">{{ article?.readCount ?? 0 }} 阅读</span>
                  <a v-if="currentUser?.id === article?.user?.id" @click="() => toEdit()" class="edit-link">编辑</a>
                </div>
              </div>
            </div>
          </div>
          <!-- 🎨 文章标签 -->
          <!-- <div v-if="article?.tags?.length" class="article-tags">
            <ModernTag v-for="(tag, index) in article.tags" :key="`tag-${tag}-${index}`" :text="tag"
              :variant="'gradient'" :size="'small'" :index="+index" :clickable="true"
              @click="() => handleTagClick(tag)" />
          </div> -->
        </div>
      </div>

      <div class="content-layout">
        <div class="content-wrapper">
          <TUIPreview v-if="!loading && article?.editorType === 1" :data="article" class="content-preview"
            @on-loaded="onLoaded">
          </TUIPreview>
          <RTPreview v-if="!loading && article?.editorType === 2" :data="article" class="content-preview"
            @on-loaded="onLoaded">
          </RTPreview>
        </div>

        <!-- 右侧目录 -->
        <div class="catalog-sidebar">
          <Catalog v-if="!!catalogList?.length" :data="catalogList" :threshold="article?.editorType === 1 ? 110 : 60"
            @on-loaded="() => (isShowCatalog = true)" />
        </div>
      </div>

      <!-- 专栏信息和上下篇文章导航 - 移动到文章内容下方 -->
      <div v-show="!loading" class="article-bottom-section">
        <!-- 专栏信息 -->
        <div v-if="article?.column" class="column-info-card">
          <div class="column-header">
            <span class="column-label">本文收录于以下专栏</span>
          </div>
          <div class="column-content-wrapper">
            <div @click="() => toColumnDetail(article?.column?.id)" class="column-main-info">
              <img :src="article?.column?.cover?.url" class="column-cover-img"
                @error="(e) => (e.target as HTMLImageElement).src = '/img/column-default-cover.webp'" />
              <div class="column-details">
                <span class="column-title">{{ article?.column?.name }}</span>
                <span class="column-description">{{ article?.column?.description || '让你拥有最基础的HTML知识' }}</span>
              </div>
            </div>
            <div class="column-stats">
              <span class="stat-item">{{ article?.column?.subscribeCnt || 31 }} 订阅</span>
              <span class="stat-separator">·</span>
              <span class="stat-item">{{ article?.column?.articleCnt || 66 }} 篇文章</span>
            </div>
          </div>
        </div>

        <!-- 上下篇文章导航 -->
        <div v-if="prevColumnArticle || nextColumnArticle" class="article-navigation">
          <div v-if="prevColumnArticle" class="nav-item prev-nav">
            <div class="nav-label">上一篇</div>
            <div @click="() => toPreview(prevColumnArticle?.id)" class="nav-content">
              <i class="iconfont icon-arrow-left nav-icon"></i>
              <span class="nav-title">{{ prevColumnArticle?.name }}</span>
            </div>
          </div>

          <div v-if="nextColumnArticle" class="nav-item next-nav">
            <div class="nav-label">下一篇</div>
            <div @click="() => toPreview(nextColumnArticle?.id)" class="nav-content">
              <span class="nav-title">{{ nextColumnArticle?.name }}</span>
              <i class="iconfont icon-arrow-right nav-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论区 -->
    <div v-show="!loading" ref="commentDom" class="comment px-10 py-2 pb-16 rounded-md mb-12 mt-4"
      style="width: calc(100% - 360px)">
      <Comment :data="commentData" />
    </div>

    <!-- 浮动操作按钮 -->
    <div class="oprate flex flex-col fixed right-36 bottom-20">
      <div v-show="isShowToTop" @click="toTop"
        class="toTop w-8 h-8 flex justify-center items-center rounded-full cursor-pointer">
        <i title="回到顶部" class="iconfont icon-huidaodingbu" />
      </div>
    </div>
  </div>
  <CanvasBG v-show="!loading" class="fixed w-screen h-screen top-0 left-0" />
</template>

<style>
/* 加载骨架屏 */
.article-preview-container .loading-skeleton {
  width: 100%;
  max-width: 1200px;
  height: 100vh;
  padding: 2rem;
  background: var(--gradient-bg-subtle);
  border-radius: 16px;
  margin: 0 auto;
}

.skeleton-content {
  max-width: 800px;
  margin: 0 auto;
}

.skeleton-header {
  margin-bottom: 3rem;
}

.skeleton-title {
  height: 48px;
  background: linear-gradient(90deg, var(--glass-bg) 25%, var(--glass-border) 50%, var(--glass-bg) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.skeleton-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--glass-bg) 25%, var(--glass-border) 50%, var(--glass-bg) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.skeleton-info {
  flex: 1;
}

.skeleton-name {
  height: 16px;
  width: 120px;
  background: linear-gradient(90deg, var(--glass-bg) 25%, var(--glass-border) 50%, var(--glass-bg) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.skeleton-time {
  height: 14px;
  width: 200px;
  background: linear-gradient(90deg, var(--glass-bg) 25%, var(--glass-border) 50%, var(--glass-bg) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
}

.skeleton-body {
  height: 400px;
  background: linear-gradient(90deg, var(--glass-bg) 25%, var(--glass-border) 50%, var(--glass-bg) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 16px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* 左侧操作栏 */
.article-preview-container .action-box {
  z-index: 100;
}

.action-item {
  margin-bottom: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-item:hover {
  transform: translateX(-4px) scale(1.05);
}

.action-comment,
.action-edit>div {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-comment::before,
.action-edit>div::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--neon-blue-alpha), transparent);
  transition: left 0.5s;
}

.action-comment:hover::before,
.action-edit>div:hover::before {
  left: 100%;
}

.action-comment:hover,
.action-edit>div:hover {
  border-color: var(--neon-blue);
  box-shadow: 0 0 20px var(--neon-blue-alpha);
  transform: scale(1.1);
}

.action-comment>i,
.action-edit>div>i {
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.action-edit {
  animation: slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 文章预览区域 */
.article-preview {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  /* 保持内容不会水平溢出，但不影响 sticky */
  min-height: 100vh;
  position: relative;
}

.article-preview-header {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 0 auto;
  border-radius: 20px;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-bg-primary);
  opacity: 0.95;
}

.header-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-mesh);
  opacity: 0.1;
}

.header-content {
  position: relative;
  z-index: 2;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 2rem;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-meta {
  margin-bottom: 2rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid var(--glass-border);
  transition: all 0.3s ease;
  cursor: pointer;
}

.author-avatar:hover {
  border-color: var(--neon-blue);
  box-shadow: 0 0 20px var(--neon-blue-alpha);
  transform: scale(1.1);
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.author-name:hover {
  color: var(--neon-blue);
}

.article-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.publish-time,
.read-count {
  color: var(--text-secondary);
}

.edit-link {
  color: var(--neon-blue);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.edit-link:hover {
  color: var(--neon-purple);
  text-decoration: underline;
}

/* 专栏卡片 */
.column-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.column-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--neon-purple-alpha), transparent);
  transition: left 0.5s;
}

.column-card:hover::before {
  left: 100%;
}

.column-card:hover {
  border-color: var(--neon-purple);
  box-shadow: 0 8px 32px var(--neon-purple-alpha);
  transform: translateY(-2px);
}

.column-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  flex: 1;
}

.column-cover {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.column-cover :deep(.enhanced-image) {
  border-radius: 12px;
  border: 2px solid var(--glass-border);
  transition: all 0.3s ease;
}

.column-content:hover .column-cover :deep(.enhanced-image) {
  border-color: var(--neon-purple);
  transform: scale(1.1);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 0 0 1px var(--neon-purple);
}

.column-info {
  flex: 1;
}

.column-name {
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.column-content:hover .column-name {
  color: var(--neon-purple);
}

.column-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.column-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 内容区域 */
.content-layout {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 3px;
  overflow: visible;
  box-shadow: var(--shadow-elevated);
  padding: 0;
}

.catalog-sidebar {
  width: 280px;
  flex-shrink: 0;
  height: fit-content;
  max-height: calc(100vh - 140px);
  z-index: 100;
  align-self: flex-start;
}

.content-preview {
  min-height: 600px;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
  z-index: 1;
}

/* 文章底部区域 */
.article-bottom-section {
  width: calc(100% - 310px);
  margin-top: 2em;
}

/* 专栏信息卡片 */
.column-info-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.column-header {
  margin-bottom: 1rem;
}

.column-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.column-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.column-main-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.column-main-info:hover {
  transform: translateX(4px);
}

.column-cover-img {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid var(--glass-border);
  transition: all 0.3s ease;
}

.column-main-info:hover .column-cover-img {
  border-color: var(--neon-blue);
  box-shadow: 0 4px 12px var(--neon-blue-alpha);
}

.column-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.column-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.column-main-info:hover .column-title {
  color: var(--neon-blue);
}

.column-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.column-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.stat-separator {
  color: var(--glass-border);
}

/* 文章导航 */
.article-navigation {
  display: flex;
  gap: 1rem;
}

.article-navigation .nav-item {
  flex: 1;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.article-navigation .nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--neon-cyan-alpha), transparent);
  transition: left 0.5s;
}

.article-navigation .nav-item:hover::before {
  left: 100%;
}

.article-navigation .nav-item:hover {
  border-color: var(--neon-cyan);
  box-shadow: 0 4px 16px var(--neon-cyan-alpha);
  transform: translateY(-2px);
}

.article-navigation .nav-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.article-navigation .nav-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prev-nav .nav-content {
  justify-content: flex-start;
}

.next-nav .nav-content {
  justify-content: flex-end;
}

.nav-icon {
  font-size: 0.875rem;
  color: var(--neon-cyan);
  flex-shrink: 0;
}

.nav-title {
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.4;
  transition: color 0.3s ease;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-navigation .nav-item:hover .nav-title {
  color: var(--neon-cyan);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .article-bottom-section {
    padding: 0 1rem;
  }

  .column-content-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .column-stats {
    align-self: flex-start;
  }

  .article-navigation {
    flex-direction: column;
  }
}

/* 评论区域 */
.comment-section {
  width: 100%;
  max-width: 1200px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  margin: 2rem auto 3rem auto;
  overflow: hidden;
  box-shadow: var(--shadow-elevated);
}

.comment-header {
  padding: 2rem 2rem 1rem;
}

.comment-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.comment-title i {
  color: var(--neon-blue);
  font-size: 1.125rem;
}

.comment-count {
  color: var(--text-secondary);
  font-weight: 400;
}


.to-top {
  animation: bounceInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式设计 */
@media (max-width: 1024px) {

  .article-preview-header,
  .comment-section {
    width: 100%;
    max-width: none;
  }

  .content-layout {
    flex-direction: column;
    gap: 1rem;
  }

  .content-wrapper {
    width: 100%;
    max-width: none;
  }

  .content-preview {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .article-title {
    font-size: 2rem;
  }

  .header-content {
    padding: 2rem 1.5rem;
  }

  .action-box {
    display: none;
  }

  .column-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .content-wrapper {
    margin: 20px 10px;
    border-radius: 16px;
  }

  .content-preview {
    padding: 20px;
  }
}

/* 动画效果 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 🎨 文章标签样式 */
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 🎨 阅读增强器集成样式 */
.article-preview :deep(.reading-enhancer) {
  background: transparent;
  width: 100%;
}

.article-preview :deep(.content-wrapper) {
  transition: all 0.3s ease;
  width: 100%;
}

/* 确保内容可以正常滚动 */
.article-preview :deep(.content-preview) {
  overflow: visible;
}

.article-preview :deep(.content-preview > *) {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .article-tags {
    gap: 6px;
  }
}

@media (max-width: 480px) {

  .content-wrapper {
    margin: 10px 5px;
    border-radius: 12px;
  }

  .content-preview {
    padding: 16px;
  }

  .article-preview-header {
    margin-bottom: 1rem;
  }
}
</style>
