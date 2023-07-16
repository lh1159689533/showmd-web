<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import dayjs from 'dayjs';
import { useStore } from 'vuex';

import ArticleList from '../article/ArticleList.vue';
import Category from './Category.vue';
import Top from './Top.vue';

import { findArticleList } from '../../service/article';

const store = useStore();

const articleList = ref(null);
const filters = reactive({ category: null, subCategory: null });
const currentSort = ref('latest'); // 默认时间排序

const isShowHeader = computed(() => store.getters.isShowHeader);

async function getArticleList(category, subCategory, sort?) {
  let params = null;
  if (category && category.key !== 'all') {
    params = {
      filters: {
        category: category.key,
      },
    };
    subCategory && subCategory.key !== 'all' && (params.filters.tags = subCategory.key);
  }
  if (sort === 'latest') {
    params = {
      ...(params ?? {}),
      order: 'desc',
    };
  }
  findArticleList(params).then((result) => {
    articleList.value = result?.map((item) => ({
      ...item,
      tags: [{ 'front-dev': '前端', 'backend-dev': '后端' }[item.category], ...item.tags.split(',')],
      updateTime: dayjs(item.updateTime).fromNow(),
    }));
  });
}

const handleCategoryChange = (category, subCategory) => {
  filters.category = category;
  filters.subCategory = subCategory;
  getArticleList(category, subCategory, currentSort.value);
  document.documentElement.scrollTop = 0;
};

getArticleList(filters.category, filters.subCategory, currentSort.value);
</script>

<template>
  <div id="study">
    <nav
      class="fixed w-full h-12 left-0 z-1000 shadow bg-white" :class="[isShowHeader ? 'top-12' : 'top-0']"
      style="transition: top 500ms"
    >
      <Category @change="handleCategoryChange" />
    </nav>
    <section class="pt-20 relative">
      <div class="relative pr-8" style="width: 78%">
        <div class="content bg-white">
          <div class="pl-6 py-3 text-sm text-indigo-500">
            <span>{{ filters.category?.title || '综合' }}</span>
            <span class="separator px-2 text-gray-300">/</span>
            <span>{{ filters.subCategory?.title || '全部' }}</span>
          </div>
          <ArticleList :data="articleList" />
        </div>
      </div>
      <aside class="content-aside right-0 top-0 absolute" style="width: 22%">
        <div class="fixed w-80" :class="[isShowHeader ? 'top-32' : 'top-16']" style="transition: 500ms">
          <Top />
        </div>
      </aside>
    </section>
  </div>
</template>

<style scoped>
#study {
  max-width: 1380px;
  margin: 0 auto;
}

#study .content {
  box-shadow: 1px 1px 10px -8px #333;
}

@media (max-width: 960px) {
  #study .content {
    width: 100% !important;
  }

  #study .content-aside {
    display: none;
  }
}
</style>
