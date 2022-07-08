<script lang="ts">
import { defineComponent, ref } from 'vue';
import { findArticleList } from './article';

export default defineComponent({
  name: 'ArticleList',
  setup() {
    const articleList = ref();

    findArticleList().then((result) => {
      articleList.value = result?.map((item) => ({
        ...item,
        tags: [{ 'front-dev': '前端', 'backend-dev': '后端' }[item.category], ...item.tags.split(',')],
      }));
    });

    return {
      articleList,
    };
  },
});
</script>

<template>
  <div id='articleList' class='article-list'>
    <List :dataList='articleList'>
      <template #default='{ item }'>
        <div class='article-list-item flex flex-col text-sm text-gray-800 px-6 py-4 cursor-pointer border-t hover:bg-gray-50'>
          <div class='article-list-item-header flex'>
            <a class='pr-3 cursor-pointer hover:text-indigo-500'>{{item.creator}}</a>
            <span class='modify-time relative px-3 flex items-center'>{{item.modifyTime}}</span>
            <span class='tag-list pl-3 flex items-center'>
              <a
                v-for='(tag, index) in item.tags'
                :key='`${tag}-${index}`'
                class='cursor-pointer hover:text-indigo-500 px-2 flex items-center'
                :class='[index !== item.tags.length - 1 ? "delimiter relative" : ""]'
              >{{tag}}</a>
            </span>
          </div>
          <div class='article-list-item-content flex flex-col my-2'>
            <div class='title text-lg mb-2 text-gray-900'>{{item.name}}</div>
            <div class='desc truncate'>{{item.summary}}</div>
          </div>
          <div class='article-list-item-footer flex items-center'>
            <i class='iconfont icon-eye text-gray-500 text-2xl' />
            <span class='read-count ml-1'>{{item.readCount}}</span>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>

<style>
.article-list .article-list-item .article-list-item-header .modify-time::before,
.article-list .article-list-item .article-list-item-header .modify-time::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 70%;
  background-color: #dddddd;
}

.article-list .article-list-item .article-list-item-header .modify-time::before {
  left: 0;
}

.article-list .article-list-item .article-list-item-header .modify-time::after {
  right: 0;
}

.article-list .article-list-item .article-list-item-header .tag-list > a.delimiter::after {
  content: ' ';
  position: absolute;
  display: block;
  width: 2px;
  height: 2px;
  background-color: #666;
  border-radius: 50%;
  right: -2px;
}
</style>