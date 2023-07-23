<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import message from '@utils/message';
import { confirm } from '@utils/messageBox';
import { findListByUserId, deleteById } from '@service/article';

const router = useRouter();

const articleList = ref();
const searchKeyword = ref('');

const oprateList = [
  {
    key: 'edit',
    title: '编辑',
    handle(id) {
      const { href } = router.resolve(`/article/edit/${id}`);
      window.open(href, '_blank');
    },
  },
  {
    key: 'preview',
    title: '预览',
    handle(id) {
      const { href } = router.resolve(`/article/preview/${id}`);
      window.open(href, '_blank');
    },
  },
  {
    key: 'del',
    title: '删除',
    handle(id) {
      confirm('确定要删除文章吗？', {
        callback(action) {
          if (action === 'confirm') {
            delArticle(id);
          }
        },
      });
    },
  },
];

watchEffect(() => {
  // if (currentUser.value?.id) {
  findListByUserId()
    .then((data) => {
      articleList.value = data ?? [];
    })
    .catch((e) => {
      console.log('查询出错:', e);
    });
  // }
});

const toDetail = (id) => {
  const { href } = router.resolve(`/article/preview/${id}`);
  window.open(href, '_blank');
};

const delArticle = async (id) => {
  const result = await deleteById(id);
  if (result) {
    message.success('删除成功');
    handleSearch();
  } else {
    message.error('删除失败');
  }
};

const handleSearch = async () => {
  const data = await findListByUserId(searchKeyword.value);
  articleList.value = data;
};
</script>

<template>
  <div class="article-list h-full overflow-auto p-4">
    <div class="search flex w-1/3 relative left-2/3 gap-8 p-4">
      <el-input v-model="searchKeyword" placeholder="请输入关键词" clearable />
      <el-button @click="handleSearch" type="primary">搜索</el-button>
    </div>
    <el-skeleton v-if="!articleList" :rows="3" animated class="p-6" />
    <List v-else-if="articleList?.length" :data-list="articleList">
      <template #default="{ item: article }">
        <div
          class="article-list-item flex justify-between text-sm px-6 py-4 border-t text-gray-800 hover:bg-gray-50 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          <div class="article-list-item-content flex flex-col flex-1">
            <div
              @click="() => toDetail(article?.id)"
              class="title text-base mb-3 cursor-pointer text-gray-900 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-600"
            >
              {{ article.name }}
            </div>
            <div class="truncate text-gray-600 dark:text-zinc-500">{{ article.summary }}</div>
            <div class="flex mt-4 justify-between">
              <div class="flex gap-4 delimiter text-gray-500 dark:text-zinc-500">
                <span class="create-time">{{ article.updateTime }}</span>
                <span>阅读 {{ article.readCount }}</span>
                <span>评论 {{ article.commentCount }}</span>
              </div>
              <List
                :data-list="oprateList" class="oprate flex gap-4 text-gray-600"
                item-class="cursor-pointer hover:text-indigo-500 dark:text-zinc-500 dark:hover:text-indigo-500 " @click="(item) => item.handle?.(article?.id)"
              >
                <template #default="{ item }">
                  <span :class="[item.key === 'del' ? 'hover:text-red-500' : 'hover:text-indigo-500']">{{ item.title
                  }}</span>
                </template>
              </List>
            </div>
          </div>
        </div>
      </template>
    </List>
    <Empty v-else class="border-t">
      还没有文章，快来发表第一篇文章吧
      <router-link to="/article/new" target="_blank" class="ml-2 text-indigo-500 hover:underline">写文章</router-link>
    </Empty>
  </div>
</template>

<style scoped></style>
