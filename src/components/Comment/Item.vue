<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { ElMessageBox as messageBox } from 'element-plus';
import message from '@utils/message';
import AddItem from './AddItem.vue';
import { useStore } from 'vuex';

import { addClass, removeClass } from '@src/components/Editor/vditorEditor';

export default defineComponent({
  name: 'Item',
  components: { AddItem },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: 'comment', // comment评论 reply回复
    },
  },
  emits: ['add', 'del'],
  setup(props) {
    const store = useStore();
    // 内容dom
    const contentDom = ref();
    const addItemDom = ref();
    // 是否显示添加回复textarea
    const isShowAddReply = ref(false);
    // 是否显示'展开/收起'(内容过多时)
    const isShowLimit = ref(false);
    // 内容是否已展开(内容过多时)
    const isExpand = ref(false);
    // 选中了改条目
    const hoverItem = ref(false);

    onMounted(() => {
      // 判断内容是否超过了显示的最大行数，是则显示'展开/收起'
      const offsetHei = contentDom.value.offsetHeight;
      const scrollHei = contentDom.value.scrollHeight;
      if (offsetHei < scrollHei) {
        isShowLimit.value = true;
      } else {
        isShowLimit.value = false;
      }
    });

    /**
     * 显示添加回复框
     */
    const showAddReply = () => {
      isShowAddReply.value = true;
    };

    /**
     * 隐藏添加回复框
     */
    const hideAddReply = () => {
      isShowAddReply.value = false;
    };

    /**
     * 内容的展开与收起事件
     */
    const handleExpand = () => {
      if (isExpand.value) {
        removeClass(contentDom.value, 'expand');
      } else {
        addClass(contentDom.value, 'expand');
      }
      isExpand.value = !isExpand.value;
    };

    const delItem = async (item) => {
      const { id, commentId } = item;
      const isDel = await store.dispatch('delComment', { id, commentId, type: props.type });
      if (isDel) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    };

    /**
     * 删除条目
     */
    const handleDelItem = (item) => {
      messageBox.confirm('你确定要删除这条评论吗？', {
        callback(action) {
          if (action === 'confirm') {
            delItem(item);
          }
        },
      });
    };

    /**
     * 添加条目
     */
    const handleAddItem = async (itemValue) => {
      const { type, data } = props;
      let item = {
        content: itemValue, // 内容
        parentId: 0, // 父id
        commentId: data?.id,
        replyToUserId: null,
      };
      if (type === 'reply') {
        item = {
          ...item,
          parentId: data?.id ?? 0, // 父id
          commentId: data?.commentId,
          replyToUserId: data?.user?.id,
        };
      }
      const isSucc = await store.dispatch('addComment', { data: item, type: 'reply' });
      if (isSucc) {
        hideAddReply();
        addItemDom.value?.success();
        message.success('评论成功');
      } else {
        addItemDom.value?.failed();
        message.error('评论失败');
      }
    };

    const handleDigg = () => {
      const { type, data } = props;
      let payload = null;
      if (type === 'reply') {
        payload = {
          commentId: data?.commentId,
          replyId: data?.id,
          type,
        };
      } else {
        payload = {
          commentId: data?.id,
          articleId: data?.articleId,
          type,
        };
      }
      if (data.isDigg) {
        store.dispatch('undiggComment', payload); // 取消点赞
      } else {
        store.dispatch('diggComment', payload); // 点赞
      }
    };

    return {
      dayjs,
      contentDom,
      isShowAddReply,
      isShowLimit,
      isExpand,
      hoverItem,
      addItemDom,
      showAddReply,
      hideAddReply,
      handleExpand,
      handleDelItem,
      handleAddItem,
      handleDigg,
    };
  },
});
</script>

<template>
  <div class='common-item flex w-full text-sm'>
    <img
      :class='type === "comment" ? "w-8 h-8" : "w-6 h-6"'
      class='user-avatar rounded-full cursor-pointer'
      :src='data.user?.avatar'
      @error='(e) => e.target.src="/img/avatars.jpeg"'
    />
    <div class='content-box ml-3 flex-1 text-gray-500'>
      <div @mouseenter='hoverItem = true' @mouseleave='hoverItem = false' class='content-section'>
        <div class='user-box flex items-center'>
          <div class='user flex-1'>
            <span class='text-gray-800 cursor-pointer'>{{ data.user.name }}</span>
            <span v-if='data.isAuthor' class='ml-1 text-indigo-500 bg-indigo-100 text-xs px-1'>作者</span>
            <span v-if='data.isMyself' class='ml-1 text-block bg-gray-100 text-xs px-1'>本人</span>
          </div>
          <span class='time'>{{ dayjs(data.createTime).fromNow() }}</span>
        </div>
        <div class='content-box'>
          <div ref='contentDom' class='content pr-4 text-gray-700'>
            <span v-if='type === "reply" && data.replyToUserId' class='reply-to-user text-indigo-500 mr-1'>@{{ data.replyToUser.name }}</span>
            {{ data.content }}
          </div>
          <div v-if='isShowLimit' @click='handleExpand' class='limit text-indigo-500 cursor-pointer mt-2'>{{ isExpand ? '收起' : '展开' }}</div>
        </div>
        <div class='footer flex mt-4'>
          <div class='action-box text-sm' style='color:#8a8d90'>
            <span @click='handleDigg' :class='data.isDigg ? "text-indigo-500" : ""' class='digg cursor-pointer hover:text-indigo-500'>
              <i class='iconfont icon-digg mr-1' />
              <span>{{ data.digg || '点赞' }}</span>
            </span>
            <span v-show='!isShowAddReply' @click='showAddReply' class='reply mx-4 cursor-pointer hover:text-indigo-500'>
              <i class='iconfont icon-reply mr-1' />
              <span>{{ data.replies?.length || '回复' }}</span>
            </span>
            <span v-show='isShowAddReply' @click='hideAddReply' class='reply mx-4 cursor-pointer text-indigo-500'>
              <i class='iconfont icon-reply mr-1' />
              <span>取消回复</span>
            </span>
            <span v-if='data.isMyself && hoverItem' @click='() => handleDelItem(data)' class='del cursor-pointer hover:text-red-500'>
              <i class='iconfont icon-comment-del mr-1' />
              <span>删除</span>
            </span>
          </div>
        </div>
      </div>
      <AddItem v-if='isShowAddReply' @confirm='handleAddItem' @cancle='hideAddReply' ref='addItemDom' autofocus :placeholder='`回复${data.user.name}...`' class='add-reply mt-3' />
      <slot name='replies' />
    </div>
  </div>
</template>

<style scoped>
.common-item .content-box .content {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  font-weight: 400;
  color: #515767;
  -webkit-line-clamp: 6;
  margin-top: 1em;
  line-height: 22px;
}

.common-item .content-box .expand {
  -webkit-line-clamp: inherit;
}
</style>
