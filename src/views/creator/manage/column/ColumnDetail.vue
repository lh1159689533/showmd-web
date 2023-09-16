<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { findById, findArticleList } from '@service/column';

const store = useStore();
const currentUser = computed(() => store.getters.getUser);

const router = useRouter();
const route = useRoute();

const column = ref();
const articleList = ref();

const toManageColumn = () => {
  // 跳转专栏管理文章
  const { href } = router.resolve(`/creator/manage/column?columnId=${column.value?.id}&action=manage`);
  window.open(href, '_blank');
};

const toDetail = (id) => {
  const { href } = router.resolve(`/article/preview/${id}`);
  window.open(href, '_blank');
};

watchEffect(() => {
  if (route.params?.id) {
    const columnId = +route.params.id;
    findById(columnId)
      .then((data) => {
        column.value = data;
      })
      .catch();
    findArticleList(columnId)
      .then((data) => {
        articleList.value = data?.articles;
      })
      .catch();
  }
});
</script>

<template>
  <div class="my-column-list mt-20 mb-8">
    <div class="header flex flex-col justify-between px-6 py-4">
      <div class="flex gap-8 mb-4">
        <img
          :src="`${column?.cover?.url}?t=${new Date(column?.updateTime).getTime()}`" class="w-36 h-24"
          @error="(e) => (e.target as HTMLImageElement).src = '/img/column-default-cover.webp'"
        />
        <div class="detail flex-1 flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span
              class="attrs px-1 text-sm"
              :style="{ borderRadius: '1px' }"
            >{{
              column?.isPrivate ? '私有' : '公开' }}</span>
            <span class="title text-xl flex-1">{{ column?.name }}</span>
          </div>
          <span class="desc text-sm my-2">{{ column?.desc }}</span>
          <div class="cnt flex flex-1 gap-4 text-sm">
            <span class="article-num">文章数: {{ column?.articleCnt }}</span>
            <span class="article-num">订阅数: {{ column?.subscribeCnt }}</span>
            <span class="create-time">创建于 {{ column?.createTime }}</span>
          </div>
        </div>
        <div>
          <el-button
            @click="toManageColumn" v-if="currentUser?.id === column?.user?.id" type="primary"
            plain
          >
            管理文章
          </el-button>
        </div>
      </div>
      <div class="user p-3 rounded">
        <span class="username text-base font-bold">
          作者: <span class="pl-4">{{ column?.user?.name }}</span>
        </span>
        <div class="cnt flex gap-4 text-sm mt-3">
          <span class="article-num">发表的文章: {{ column?.user?.articleCnt }}</span>
          <span class="article-num">创建的专栏: {{ column?.user?.columnCnt }}</span>
        </div>
      </div>
    </div>
    <el-skeleton v-if="!articleList" :rows="3" animated class="p-6" />
    <List v-else-if="articleList?.length" :data-list="articleList">
      <template #default="{ item: article }">
        <div
          @click="() => toDetail(article?.id)"
          class="article-list-item flex justify-between cursor-pointer text-sm px-6 py-4 border-t"
        >
          <div class="article-list-item-content flex flex-col flex-1">
            <div class="title text-xl mb-3">
              <span class="text-underline">{{ article.name }}</span>
            </div>
            <div class="desc truncate">{{ article.summary }}</div>
            <div class="flex mt-4 justify-between">
              <div class="cnt flex gap-4 delimiter">
                <span>{{ article.updateTime }}</span>
                <span>阅读 {{ article.readCount }}</span>
                <span>评论 {{ article.commentCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </List>
    <Empty v-else class="border-t">
      <div v-if="currentUser?.id === column?.user?.id">
        还没有文章，<span
          @click="toManageColumn"
          class="ml-2 text-indigo-500 cursor-pointer hover:underline"
        >快去收录文章吧</span>
      </div>
      <div v-else>暂无收录文章</div>
    </Empty>
  </div>
</template>

<style scoped>
.my-column-list {
  background-color: var(--showmd-bg-color-primary);
}

.my-column-list .header .detail .attrs {
  background-color: var(--showmd-bg-color-weak);
  color: var(--showmd-text-color-hover);
}

.my-column-list .header .detail .title {
  color: var(--showmd-text-color-primary);
}

.my-column-list .header .detail :is(.desc, .cnt) {
  color: var(--showmd-text-color-weak);
}

.my-column-list .header .user {
  background-color: var(--showmd-bg-color-hover);
}

.my-column-list .header .user .username {
  color: var(--showmd-text-color-primary);
}

.my-column-list .header .user .cnt {
  color: var(--showmd-text-color-weak);
}

.my-column-list .article-list-item {
  color: var(--showmd-text-color-primary);
  border-color: var(--showmd-border-color);
}

.my-column-list .article-list-item:hover {
  background-color: var(--showmd-bg-color-hover);
}

.my-column-list .article-list-item .title {
  color: var(--showmd-text-color-primary);
}

.my-column-list .article-list-item .title:hover {
  color: var(--showmd-text-color-hover);
}

.my-column-list .article-list-item :is(.desc, .cnt) {
  color: var(--showmd-text-color-weak);
}
</style>
