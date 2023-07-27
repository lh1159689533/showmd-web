<script lang="ts" setup>
import { defineProps, toRefs, withDefaults, ref, onMounted, computed } from 'vue';
import dayjs from 'dayjs';
import message from '@utils/message';
import { confirm } from '@utils/messageBox';
import AddItem from './AddItem.vue';
import { useStore } from 'vuex';

import { addClass, removeClass } from '@src/components/Editor/domUtil';
import { parse } from './utils';

const props = withDefaults(
  defineProps<{
    data: any;
    type: 'comment' | 'reply';
  }>(),
  {
    data: {},
    type: 'comment',
  }
);

const store = useStore();

const currentUser = computed(() => store.getters.getUser);

const { data, type } = toRefs(props);
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
  if (!currentUser.value?.id) {
    return store.commit('showLogin');
  }
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
  const isDel = await store.dispatch('delComment', { id, commentId, type: type.value });
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
  confirm('你确定要删除这条评论吗？', {
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
  let item = {
    content: itemValue, // 内容
    parentId: 0, // 父id
    commentId: data.value?.id,
    replyToUserId: null,
  };
  if (type.value === 'reply') {
    item = {
      ...item,
      parentId: data.value?.id ?? 0, // 父id
      commentId: data.value?.commentId,
      replyToUserId: data.value?.user?.id,
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
  if (!currentUser.value?.id) {
    return store.commit('showLogin');
  }
  let payload = null;
  if (type.value === 'reply') {
    payload = {
      commentId: data.value?.commentId,
      replyId: data.value?.id,
      type: type.value,
    };
  } else {
    payload = {
      commentId: data.value?.id,
      articleId: data.value?.articleId,
      type: type.value,
    };
  }
  if (isDigg.value) {
    store.dispatch('undiggComment', payload); // 取消点赞
  } else {
    store.dispatch('diggComment', payload); // 点赞
  }
};

const formatDate = (date) => {
  if (dayjs().isSame(date, 'day')) {
    return dayjs(date).fromNow();
  } else if (dayjs().isSame(date, 'year')) {
    return dayjs(date).format('MM-DD');
  } else {
    return dayjs(date).format('YYYY-MM-DD');
  }
};

const isMyself = computed(() => data.value.user?.id === currentUser.value?.id);
const isAuthor = computed(() => data.value.article?.user?.id === data.value.user?.id);
const isDigg = computed(() => data.value.diggUsers?.split(',')?.includes(`${currentUser.value.id}`));
</script>

<template>
  <div class="common-item-box flex w-full text-sm">
    <Avatar
      :src="data.user?.avatar" :class="type === 'comment' ? 'w-8 h-8' : 'w-6 h-6'"
      class="user-avatar rounded-full cursor-pointer"
    />
    <div class="common-item ml-3 flex-1 min-w-0">
      <div @mouseenter="hoverItem = true" @mouseleave="hoverItem = false">
        <div class="user-box flex items-center">
          <div class="flex-1">
            <span class="username cursor-pointer" style="font-size: 15px">{{ data.user.name }}</span>
            <span v-if="isAuthor" class="isauthor ml-1 text-indigo-500 text-xs px-1">作者</span>
            <span
              v-if="isMyself"
              class="ismyself ml-1 text-xs px-1 text-block"
            >本人</span>
          </div>
          <span class="time">{{ formatDate(data.createTime) }}</span>
        </div>
        <div>
          <div ref="contentDom" class="content pr-4">
            <span v-if="type === 'reply' && data.replyToUserId" class="reply-to-user text-indigo-500 mr-1">
              @{{ data.replyToUser.name }}
            </span>
            <span v-html="parse(data.content)"></span>
          </div>
          <div v-if="isShowLimit" @click="handleExpand" class="limit text-indigo-500 cursor-pointer mt-2">
            {{ isExpand ? '收起' : '展开' }}
          </div>
        </div>
        <div class="footer flex mt-4">
          <div class="action-box text-sm" style="color: #8a8d90">
            <span
              @click="() => !isMyself && handleDigg()"
              :class="[{ 'text-indigo-500': isDigg }, !isMyself ? 'cursor-pointer' : 'ismyself']"
              class="digg"
            >
              <i class="iconfont icon-digg mr-1" />
              <span>{{ data.digg || '点赞' }}</span>
            </span>
            <span v-show="!isShowAddReply" @click="showAddReply" class="reply mx-4 cursor-pointer">
              <i class="iconfont icon-reply mr-1" />
              <span>{{ data.replyCount || '回复' }}</span>
            </span>
            <span v-show="isShowAddReply" @click="hideAddReply" class="reply mx-4 cursor-pointer">
              <i class="iconfont icon-reply mr-1" />
              <span>取消回复</span>
            </span>
            <span
              v-if="isMyself && hoverItem" @click="() => handleDelItem(data)"
              class="del cursor-pointer flex-1"
            >
              <i class="iconfont icon-comment-del mr-1" />
              <span>删除</span>
            </span>
          </div>
        </div>
      </div>
      <AddItem
        v-if="isShowAddReply" @confirm="handleAddItem" @cancle="hideAddReply" ref="addItemDom" autofocus
        :placeholder="`回复${data.user.name}...`" class="add-reply mt-3"
      />
      <slot name="replies" />
    </div>
  </div>
</template>

<style scoped>
.common-item-box .common-item .content {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  font-weight: 400;
  -webkit-line-clamp: 3;
  margin-top: 1em;
  line-height: 22px;
  word-break: break-all;
  color: var(--showmd-text-color-weak);
}

.common-item-box .common-item .user-box .username {
  color: var(--showmd-text-color-primary);
}

.common-item-box .common-item .user-box .isauthor {
  background-color: var(--showmd-bg-color-weak);
}

.common-item-box .common-item .user-box .ismyself {
  color: var(--showmd-text-color-weak);
  background-color: var(--showmd-bg-color-weak);
}

.common-item-box .common-item .expand {
  -webkit-line-clamp: inherit;
}

.common-item-box .common-item .footer .digg.ismyself {
  color: var(--showmd-text-color-disable);
}

.common-item-box .common-item .footer :is(.digg:not(.ismyself), .reply):hover {
  color: var(--showmd-text-color-hover);
}

.common-item-box .common-item .footer .del:hover {
  color: var(--showmd-text-color-danger);
}
</style>
