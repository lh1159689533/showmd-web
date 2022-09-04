<script lang='ts'>
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import message from '@utils/message';
import Item from './Item.vue';
import AddItem from './AddItem.vue';

export default defineComponent({
  name: 'Comment',
  components: { Item, AddItem },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const store = useStore();
    const addItemDom = ref(null);
    const currentUser = computed(() => store.state.user.user);

    const addItem = async (val) => {
      const item = {
        content: val, // 内容
        articleId: props.data.articleId,
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

    return {
      currentUser,
      addItem,
      addItemDom,
    };
  },
});
</script>

<template>
  <div class='add-comment flex mt-10'>
    <img :src='currentUser?.avatar' @error='(e) => e.target.src="/img/avatars.jpeg"' class='w-8 h-8 rounded-full' />
    <AddItem @confirm='addItem' ref='addItemDom' class='flex-1 ml-3' placeholder='想对作者说点什么...' />
  </div>
  <div v-if='data?.count' class='comment-list-box'>
    <h1 class='text-lg my-6'>全部评论 {{ data.count }}</h1>
    <List class='comment-list' :data-list='data.list' item-class>
      <template #default='{ item }'>
        <Item :data='item' type='comment'>
          <template #replies>
            <Reply v-if='item.replies?.length' :replies='item.replies' class='mt-8' />
            <div v-if='item.replyCount > 2' class='more mb-8 ml-3 rounded px-4 py-1 bg-gray-100 max-w-fit flex items-center text-sm font-bold cursor-pointer'>
              <span>展开其他 {{ item.replyCount - 2 }} 条回复</span>
              <i class='iconfont icon-more-reply' />
            </div>
          </template>
        </Item>
      </template>
    </List>
  </div>
</template>

<style scoped>
</style>
