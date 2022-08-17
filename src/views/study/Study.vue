<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import dayjs from 'dayjs';
import ArticleList from '../article/ArticleList.vue';
import Category from './Category.vue';
import Sort from './Sort.vue';
import { findArticleList } from '../../service/article';

export default defineComponent({
  name: 'Study',
  components: { ArticleList, Category, Sort },
  setup() {
    const articleList = ref(null);
    const filters = reactive({ category: '', subCategory: '' });
    const currentSort = ref('tuijian'); // 默认推荐排序

    async function getArticleList(category, subCategory, sort?) {
      let params = null;
      if (category && category !== 'all') {
        params = {
          filters: {
            category,
          },
        };
        subCategory && subCategory !== 'all' && (params.filters.tags = subCategory);
      }
      if (sort === 'latest') {
        params = {
          ...(params ?? {}),
          order: 'desc'
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
    };

    const handleSortChange = (sort) => {
      const { category, subCategory } = filters;
      currentSort.value = sort;
      getArticleList(category, subCategory, sort);
    };

    getArticleList(filters.category, filters.subCategory, currentSort.value);

    return {
      articleList,
      handleCategoryChange,
      handleSortChange,
    };
  },
});
</script>

<template>
  <div id='study' class>
    <nav class='fixed w-full h-12 left-0 top-14 z-1000 shadow bg-white'>
      <Category @change='handleCategoryChange' />
    </nav>
    <section class='mt-16'>
      <div class='mt-4 relative'>
        <div class='content-list bg-white' style='width: 73%'>
          <Sort @change='handleSortChange' />
          <ArticleList :data='articleList' />
        </div>
        <aside class='content-aside right-0 top-0 absolute bg-white' style='width: 25%'>222</aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
#study {
  max-width: 1380px;
  margin: 0 auto;
}

#study .content-list {
  box-shadow: 1px 1px 10px -8px #333;
}

@media (max-width: 960px) {
  #study .content-list {
    width: 100% !important;
  }
  #study .content-aside {
    display: none;
  }
}
</style>