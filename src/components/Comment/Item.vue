<script lang="ts" setup>
import { toRefs, ref, onMounted, computed } from 'vue';
import {
  Clock,
  ThumbsUp,
  MessageCircle,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Crown,
  User
} from 'lucide-vue-next';
import message from '@utils/message';
import { confirm } from '@utils/messageBox';
import AddItem from './AddItem.vue';
import { useStore } from 'vuex';

import { addClass, removeClass } from '@src/components/Editor/domUtil';
import { parse } from './utils';
import { formatDate } from '@src/utils/type';

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

const isMyself = computed(() => data.value.user?.id === currentUser.value?.id);
const isAuthor = computed(() => data.value.article?.user?.id === data.value.user?.id);
const isDigg = computed(() => data.value.diggUsers?.split(',')?.includes(`${currentUser.value.id}`));
</script>

<template>
  <div class="modern-comment-item">
    <!-- 头像 -->
    <Avatar :src="data.user?.avatar" :name="data.user?.name" :size="type === 'comment' ? 'medium' : 'small'"
      :show-ring="false" class="comment-avatar" />

    <!-- 评论内容 -->
    <div class="comment-content">
      <div class="comment-wrapper" @mouseenter="hoverItem = true" @mouseleave="hoverItem = false">
        <!-- 用户信息栏 -->
        <div class="user-info-bar">
          <div class="user-details">
            <span class="username">{{ data.user.name }}</span>
            <span v-if="isAuthor" class="user-badge author-badge">
              <Crown :size="14" />
              作者
            </span>
            <span v-if="isMyself" class="user-badge self-badge">
              <User :size="14" />
              我
            </span>
          </div>
          <div class="comment-time">
            <Clock :size="14" />
            {{ formatDate(data.createTime) }}
          </div>
        </div>

        <!-- 评论正文 -->
        <div class="comment-body">
          <div ref="contentDom" class="comment-text">
            <span v-if="type === 'reply' && data.replyToUserId" class="reply-mention">
              @{{ data.replyToUser.name }}
            </span>
            <span v-html="parse(data.content)"></span>
          </div>

          <!-- 展开/收起按钮 -->
          <div v-if="isShowLimit" @click="handleExpand" class="expand-button">
            <span>{{ isExpand ? '收起' : '展开全部' }}</span>
            <ChevronUp v-if="isExpand" :size="16" />
            <ChevronDown v-else :size="16" />
          </div>
        </div>

        <!-- 操作栏 -->
        <div class="comment-actions">
          <!-- 点赞按钮 -->
          <div class="action-button like-button" :class="{
            'is-liked': isDigg,
            'is-disabled': isMyself
          }" @click="() => !isMyself && handleDigg()">
            <ThumbsUp :size="16" :class="{ 'is-liked': isDigg }" />
            <span>{{ data.digg || '赞' }}</span>
          </div>

          <!-- 回复按钮 -->
          <div v-show="!isShowAddReply" class="action-button reply-button" @click="showAddReply">
            <MessageCircle :size="16" />
            <span>{{ data.replyCount || '回复' }}</span>
          </div>

          <!-- 取消回复按钮 -->
          <div v-show="isShowAddReply" class="action-button cancel-button" @click="hideAddReply">
            <X :size="16" />
            <span>取消</span>
          </div>

          <!-- 删除按钮 -->
          <div v-if="isMyself && hoverItem" class="action-button delete-button" @click="() => handleDelItem(data)">
            <Trash2 :size="16" />
            <span>删除</span>
          </div>
        </div>
      </div>

      <!-- 回复输入框 -->
      <AddItem v-if="isShowAddReply" @confirm="handleAddItem" @cancle="hideAddReply" ref="addItemDom" autofocus
        :placeholder="`回复 ${data.user.name}...`" class="reply-input" />

      <!-- 子回复列表 -->
      <slot name="replies" />
    </div>
  </div>
</template>

<style scoped>
/* 🎨 现代化评论项组件样式 */

/* ========================================
   💬 评论项布局
   ======================================== */
.modern-comment-item {
  display: flex;
  gap: 1rem;
  width: 100%;
  font-size: 0.875rem;
}

.comment-avatar {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-wrapper {
  position: relative;
  transition: var(--transition-smooth, all 0.3s ease);
}

/* ========================================
   👤 用户信息栏
   ======================================== */
.user-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.username {
  font-size: 1rem;
  font-weight: 700;
  color: var(--showmd-text-color-primary);
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.username:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.author-badge {
  background: linear-gradient(135deg,
      #fef3c7 0%,
      #fde68a 50%,
      #fcd34d 100%);
  color: #92400e;
  border: 2px solid #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.self-badge {
  background: linear-gradient(135deg,
      #dbeafe 0%,
      #bfdbfe 50%,
      #93c5fd 100%);
  color: #1e40af;
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.comment-time {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--showmd-text-color-weak);
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.comment-time i {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* ========================================
   📝 评论正文
   ======================================== */
.comment-body {
  margin-bottom: 1rem;
}

.comment-text {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 1.6;
  color: var(--showmd-text-color-weak);
  word-break: break-word;
  margin-bottom: 0.5rem;
}

.comment-text.expand {
  -webkit-line-clamp: inherit;
}

.reply-mention {
  color: #f87171;
  font-weight: 700;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  padding: 0.125rem 0.5rem;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.reply-mention:hover {
  color: #ef4444;
  background: rgba(248, 113, 113, 0.2);
  transform: translateY(-1px);
}

.expand-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg,
      #fef2f2 0%,
      #fff1f2 50%,
      #fce7e7 100%);
  border: 2px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
}

.expand-button:hover {
  background: linear-gradient(135deg,
      #fce7e7 0%,
      #fca5a5 50%,
      #f87171 100%);
  border-color: #f87171;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.3);
}

.expand-button i {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

/* ========================================
   🎯 操作栏
   ======================================== */
.comment-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 242, 242, 0.3) 100%);
  border: 2px solid rgba(248, 113, 113, 0.2);
  border-radius: 12px;
  color: var(--showmd-text-color-weak);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  overflow: hidden;
}

.action-button:hover:not(.is-disabled) {
  background: linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(252, 165, 165, 0.5) 100%);
  border-color: rgba(248, 113, 113, 0.4);
  color: var(--showmd-text-color-primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.2);
}

.action-button i {
  font-size: 1rem;
}

/* 🎯 点赞按钮特殊样式 */
.like-button.is-liked {
  background: linear-gradient(135deg,
      #fce7e7 0%,
      #fca5a5 50%,
      #f87171 100%);
  border-color: #f87171;
  color: #dc2626;
  position: relative;
}

.like-button.is-liked i.is-liked {
  color: #f87171;
}

.like-button.is-disabled {
  color: var(--showmd-text-color-disable);
  cursor: not-allowed;
}

.like-button.is-disabled:hover {
  transform: none;
  box-shadow: none;
  background: rgba(255, 255, 255, 0.6);
  border-color: var(--showmd-border-color);
}

/* 🗑️ 删除按钮特殊样式 */
.delete-button {
  border-color: var(--red-light-3, #fca5a5);
  animation: slideInRight 0.3s ease-out;
}

.delete-button:hover {
  background: linear-gradient(135deg,
      var(--red-light-1, #fee2e2) 0%,
      var(--red-light-2, #fecaca) 100%);
  border-color: var(--red-light-4, #f87171);
  color: var(--red-light-6, #dc2626);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ========================================
   💬 回复输入框
   ======================================== */
.reply-input {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg,
      var(--coral-50, #fef2f2) 0%,
      var(--rose-50, #fff1f2) 100%);
  border: 1px solid var(--coral-100, #fee2e2);
  border-radius: 12px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================================
   🌙 暗色主题适配
   ======================================== */
.dark .action-button {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .action-button:hover:not(.is-disabled) {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .like-button.is-liked {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.15) 0%,
      rgba(239, 68, 68, 0.15) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .expand-button {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.1) 0%,
      rgba(239, 68, 68, 0.1) 100%);
  border-color: rgba(248, 113, 113, 0.2);
}

.dark .expand-button:hover {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.15) 0%,
      rgba(239, 68, 68, 0.15) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .author-badge {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.15) 0%,
      rgba(251, 146, 60, 0.15) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .reply-input {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.1) 0%,
      rgba(239, 68, 68, 0.1) 100%);
  border-color: rgba(248, 113, 113, 0.2);
}

.dark .delete-button:hover {
  background: linear-gradient(135deg,
      rgba(239, 68, 68, 0.15) 0%,
      rgba(220, 38, 38, 0.15) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

/* ========================================
   📱 响应式适配
   ======================================== */
@media (max-width: 768px) {
  .modern-comment-item {
    gap: 0.75rem;
  }

  .user-info-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .comment-actions {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
  }

  .action-button i {
    font-size: 0.875rem;
  }

  .username {
    font-size: 0.875rem;
  }

  .comment-time {
    font-size: 0.75rem;
  }

  .user-badge {
    font-size: 0.6875rem;
    padding: 0.125rem 0.375rem;
  }
}

@media (max-width: 480px) {
  .modern-comment-item {
    gap: 0.5rem;
  }

  .comment-actions {
    gap: 0.375rem;
  }

  .action-button span {
    display: none;
  }

  .action-button {
    min-width: 2rem;
    justify-content: center;
    padding: 0.375rem;
  }

  .reply-input {
    padding: 0.75rem;
  }
}
</style>
