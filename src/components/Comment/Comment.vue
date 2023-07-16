<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue';
import { useStore } from 'vuex';
import message from '@utils/message';
import Reply from './Reply.vue';
import Item from './Item.vue';
import AddItem from './AddItem.vue';
import CommentEmpty from './CommentEmpty.vue';

const props = defineProps<{ data: any }>();

const store = useStore();
const addItemDom = ref(null);
const currentUser = computed(() => store.getters.getUser);

const addItem = async (val) => {
  const item = {
    content: val, // 内容
    articleId: props.data.id,
  };
  const isSucc = await store.dispatch('addComment', { data: item, type: 'comment' });
  if (isSucc) {
    addItemDom.value?.success();
    message.success('评论成功');
  } else {
    addItemDom.value?.failed();
    message.error('评论失败');
  }
};

const loadMoreReply = (commentId) => {
  store.dispatch('loadMoreReply', commentId);
};
</script>

<template>
  <div class="add-comment flex mt-10">
    <Avatar :src="currentUser?.avatar ?? '/api/avatars.png'" class="w-8 h-8 rounded-full" />
    <AddItem v-if="currentUser?.id" @confirm="addItem" ref="addItemDom" class="flex-1 ml-3" placeholder="想对作者说点什么..." />
    <div v-else class="p-6 w-full rounded ml-3 border-gray-300 border">
      <span class="text-sm">看完啦，<span @click="() => store.commit('showLogin')" class="text-indigo-500 font-bold mr-1 cursor-pointer">登录</span>分享一下感受吧</span>
    </div>
  </div>
  <div v-if="data?.count" class="comment-list-box">
    <h2 class="text-lg my-6 font-bold">全部评论 {{ data.count }}</h2>
    <List class="comment-list" :data-list="data.list" item-class="mb-8">
      <template #default="{ item }">
        <Item :data="{...item, article: data?.article }" type="comment">
          <template #replies>
            <Reply v-if="item.replies?.length" :data="{...item, article: data?.article }" />
            <div
              v-if="item.replyCount > item.replies?.length"
              @click="() => loadMoreReply(item.id)"
              class="more mt-8 ml-3 rounded px-4 py-1 bg-gray-100 max-w-fit flex items-center text-sm font-bold cursor-pointer"
            >
              <span>展开其他 {{ item.replyCount - 2 }} 条回复</span>
              <i class="iconfont icon-more-reply" />
            </div>
          </template>
        </Item>
      </template>
    </List>
  </div>
  <CommentEmpty v-else />
</template>

<style scoped></style>
