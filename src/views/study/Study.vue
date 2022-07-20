<script lang="ts">
import { defineComponent, ref } from 'vue';
import ArticleList from '../article/ArticleList.vue';

export default defineComponent({
  name: 'Study',
  components: { ArticleList },
  setup() {
    const categoryList = [
      {
        key: 'all',
        title: '综合',
      },
      {
        key: 'front-dev',
        title: '前端',
      },
      {
        key: 'backend-dev',
        title: '后端',
      },
    ];
    const tagList = [
      {
        key: 'all',
        title: '全部',
      },
      {
        key: 'js',
        title: 'JavaScript',
      },
      {
        key: 'vue',
        title: 'Vue.js',
      },
      {
        key: 'react',
        title: 'React.js',
      },
      {
        key: 'css',
        title: 'CSS',
      },
      {
        key: 'node',
        title: 'Node.js',
      },
      {
        key: 'ts',
        title: 'TypeScript',
      },
    ];
    const sortList = [
      { title: '推荐', key: 'recommend' },
      { title: '最新', key: 'latest' },
    ];
    const activeKey = ref(categoryList[0].key);
    const tagActiveKey = ref(tagList[0].key);
    const sort = ref(sortList[0].key);

    return {
      categoryList,
      tagList,
      activeKey,
      tagActiveKey,
      sortList,
      sort,
    };
  },
});
</script>

<template>
  <div id='study' class>
    <nav class='fixed w-full h-12 left-0 top-14 z-10 shadow bg-white'>
      <List :data-list='categoryList' class='category-list h-full flex items-center text-sm text-gray-800'>
        <template #default='{ item }'>
          <span @click='() => activeKey = item.key' :class='[item.key === activeKey ? "text-indigo-500" : ""]' class='pr-6 cursor-pointer hover:text-indigo-500'>{{ item.title }}</span>
        </template>
      </List>
    </nav>
    <section class='mt-16'>
      <List :data-list='tagList' style='font-size: 0.85rem' class='sub-category-list flex items-center text-gray-800' item-class='mr-4'>
        <template #default='{ item }'>
          <span
            @click='() => tagActiveKey = item.key'
            :class='[item.key === tagActiveKey ? "bg-indigo-500 text-white hover:text-white" : ""]'
            class='cursor-pointer hover:text-indigo-500 bg-white rounded-full px-2 py-1 inline-block'
          >{{ item.title }}</span>
        </template>
      </List>
      <div class='mt-4 relative'>
        <div class='content-list bg-white' style='width: 73%'>
          <List :data-list='sortList' class='sort-list flex text-gray-800 p-3' style='font-size: 0.85rem'>
            <template #default='{ item }'>
              <span @click='() => sort = item.key' :class='[item.key === sort ? "text-indigo-500" : ""]' class='cursor-pointer hover:text-indigo-500 px-4'>{{ item.title }}</span>
            </template>
          </List>
          <ArticleList />
        </div>
        <aside class='content-aside right-0 top-0 absolute bg-white' style='width: 25%'>222</aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
#study,
#study .category-list {
  max-width: 1120px;
  margin: 0 auto;
}

#study .content-list .sort-list > li:nth-child(odd) > span {
  border-right: 1px solid #bbb;
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