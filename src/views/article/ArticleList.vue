<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ArticleList',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const router = useRouter();

    const toDetail = (id: number) => {
      const { href } = router.resolve(`/article/preview/${id}`);
      window.open(href, '_blank');
    };

    const toUserDetail = (id) => {
      console.log(id);
    };

    return {
      toDetail,
      toUserDetail,
    };
  },
});
</script>

<template>
  <div id='articleList' class='article-list'>
    <el-skeleton v-if='!data' :rows='3' animated class='p-6' />
    <List v-else-if='data?.length' :data-list='data' @click='(item) => toDetail(item?.id)'>
      <template #default='{ item }'>
        <div class='article-list-item flex justify-between text-sm text-gray-800 px-6 pt-4 pb-4 cursor-pointer border-t hover:bg-gray-50'>
          <div class='flex flex-col'>
            <div class='article-list-item-header flex'>
              <a @click='toUserDetail' class='pr-3 cursor-pointer hover:text-indigo-500'>{{ item.user.name }}</a>
              <span class='modify-time relative px-3 flex items-center'>{{ item.updateTime }}</span>
              <span class='tag-list pl-3 flex items-center'>
                <a
                  v-for='(tag, index) in item.tags'
                  :key='`${tag}-${index}`'
                  class='cursor-pointer hover:text-indigo-500 px-2 flex items-center'
                  :class='[index !== item.tags.length - 1 ? "delimiter relative" : ""]'
                >{{ tag }}</a>
              </span>
            </div>
            <div class='article-list-item-content flex flex-col mt-3'>
              <div class='title text-lg mb-3 text-gray-900'>{{ item.name }}</div>
              <div class='desc truncate'>{{ item.summary }}</div>
            </div>
          </div>
          <img :src='item.cover' @error='(e) => e?.target?.classList?.add?.("hidden")' style='width: 120px; height: 80px;' />
        </div>
      </template>
    </List>
    <Empty v-else class='border-t' />
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