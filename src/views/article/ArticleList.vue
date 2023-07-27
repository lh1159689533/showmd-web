<script lang="ts" setup>
import { defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();

defineProps<{ data: any[] }>();

const router = useRouter();
const categorys = computed(() => store.getters.getCategoryList);

const toDetail = (id: number) => {
  const { href } = router.resolve(`/article/preview/${id}`);
  window.open(href, '_blank');
};

const toUserDetail = (id) => {
  console.log(id);
};

const onImgError = (item, e: Event) => {
  item.hasCover = false;
  (e?.target as HTMLElement)?.classList?.add?.('hidden');
};
</script>

<template>
  <div id="articleList" class="article-list">
    <el-skeleton v-if="!data" :rows="3" animated class="p-6" />
    <List v-else-if="data?.length" :data-list="data" @click="(item) => toDetail(item?.id)" item-class="">
      <template #default="{ item }">
        <div class="article-list-item flex text-sm px-6 pt-4 pb-4 cursor-pointer border-t hover:bg-gray-50 dark:hover:bg-zinc-800">
          <div class="flex flex-col flex-1" :style="`max-width: ${!item?.hasCover ? '100%' : '80%'};`">
            <div class="article-list-item-header flex">
              <a @click="toUserDetail" class="username pr-3 cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-500">{{ item.user.name }}</a>
              <span class="modify-time relative px-3 flex items-center">{{ item.updateTime }}</span>
              <span class="tag-list pl-3 flex items-center">
                <a
                  v-for="(tag, index) in item.tags?.map(tag => categorys?.find(c => c.key === tag)?.title)"
                  :key="`${tag}-${index}`"
                  class="cursor-pointer hover:text-indigo-500 px-2 flex items-center"
                  :class="[index !== item.tags.length - 1 ? 'delimiter relative' : '']"
                >
                  {{ tag }}
                </a>
              </span>
            </div>
            <div class="article-list-item-content flex flex-col mt-3">
              <div class="title text-lg mb-3">{{ item.name }}</div>
              <div class="desc truncate">{{ item.summary }}</div>
            </div>
          </div>
          <img :src="item.cover" @error="(e) => onImgError(item, e)" style="width: 120px; height: 80px" />
        </div>
      </template>
    </List>
    <Empty v-else class="border-t">
      还没有文章，快来发表第一篇文章吧
      <router-link to="/article/new" target="_blank" class="ml-2 text-indigo-500 hover:underline">写文章</router-link>
    </Empty>
  </div>
</template>

<style scoped>
.article-list .article-list-item .article-list-item-header .modify-time::before,
.article-list .article-list-item .article-list-item-header .modify-time::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 70%;
  background-color: var(--showmd-border-color);
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
  border-radius: 50%;
  right: -2px;
  background-color: var(--showmd-text-color-weak);
}

.article-list-item {
  border-color: var(--showmd-border-color);
  color: var(--showmd-text-color-weak);
}

.article-list-item-header .username {
  color: var(--showmd-text-color-primary);
}

.article-list-item-content .title {
  color: var(--showmd-text-color-primary);
}

.article-list-item-content .desc {
  color: var(--showmd-text-color-weak);
}
</style>
