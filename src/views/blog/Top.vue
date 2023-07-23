<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { findTopArticleList } from '../../service/article';

export default defineComponent({
  name: 'Top',
  setup() {
    const router = useRouter();
    const topList = ref([]);

    findTopArticleList().then((data) => (topList.value = data));

    const toDetail = (id: number) => {
      const { href } = router.resolve(`/article/preview/${id}`);
      window.open(href, '_blank');
    };

    return {
      topList,
      toDetail,
    };
  },
});
</script>

<template>
  <div class="top-article-list bg-white dark:bg-zinc-900" style="max-height: 610px; height: 330px">
    <h5 class="top-title text-sm py-2 pl-8 border-b dark:text-zinc-300 dark:border-zinc-800">热门文章</h5>
    <List
      v-if="topList?.length" :data-list="topList" @click="(item) => toDetail(item?.id)"
      class="overflow-y-hidden h-full py-2" item-class="py-2 px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
    >
      <template #default="{ item, index }">
        <el-tooltip effect="customized" placement="left" :show-after="500">
          <template #content>
            <span class="overflow-clip inline-block" style="max-width: 350px">{{ item.summary ?? item.name }}</span>
          </template>
          <div>
            <div class="title flex items-center">
              <span
                :class="`hotnum-${index + 1} hotnum`"
                class="px-1 tabular-nums text-white flex justify-center items-center h-5 mr-1"
                style="border-bottom-right-radius: 50%; border-bottom-left-radius: 50%"
              >
                {{ index + 1 }}
              </span>
              <span class="text-sm text-gray-800 truncate dark:text-zinc-300">{{ item.name }}</span>
            </div>
            <p class="text-xs text-gray-500 truncate pt-1 dark:text-zinc-500">{{ item.summary }}</p>
          </div>
        </el-tooltip>
      </template>
    </List>
    <Empty v-else />
  </div>
  <!-- <div class='top-author-list mt-8 bg-white' style='max-height: 610px; height: 330px'>
    <h3 class='top-title text-sm py-2 pl-8 border-b'>推荐作者</h3>
    <List v-if='topList?.length' :data-list='topList' class='overflow-y-hidden h-full' item-class='py-2 px-6 cursor-pointer hover:bg-gray-50'>
      <template #default='{ item, index }'>
        <el-tooltip effect='light' placement='left' :show-after='500'>
          <template #content>
            <span class='overflow-clip inline-block' style='max-width:350px'>{{ item.summary }}</span>
          </template>
          <div>
            <div class='title flex items-center'>
              <span
                :class='`hotnum-${index + 1} hotnum`'
                class='px-1 tabular-nums text-white flex justify-center items-center h-5 mr-1'
                style='border-bottom-right-radius: 50%'
              >{{ index + 1 }}</span>
              <span class='text-sm text-gray-800'>{{ item.name }}</span>
            </div>
            <p class='text-xs text-gray-500 truncate pt-1'>{{ item.summary }}</p>
          </div>
        </el-tooltip>
      </template>
    </List>
    <Empty v-else />
  </div>-->
</template>

<style>
.top-article-list .top-title {
  @apply relative overflow-hidden;
}

.top-article-list .top-title::before {
  content: '推荐';
}

/* .top-author-list .top-title::before {
  content: '推荐';
} */

.top-article-list .top-title::before,
.top-author-list .top-title::before {
  width: 60px;
  height: 20px;
  top: 1px;
  left: -19px;
  position: absolute;
  transform: rotateZ(-45deg);
  @apply bg-indigo-500 text-xs text-white text-center leading-5;
}

.top-article-list .hotnum {
  background: #9ca3af;
}

.top-article-list .hotnum-1 {
  background: linear-gradient(135deg, #ef4444, #f59e0b);
}

.top-article-list .hotnum-2 {
  background: linear-gradient(135deg, #f87171, #fbbf24);
}

.top-article-list .hotnum-3 {
  background: linear-gradient(135deg, #fca5a5, #fcd34d);
}
</style>
