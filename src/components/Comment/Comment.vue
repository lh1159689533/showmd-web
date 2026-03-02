<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { MessageCircle, ChevronDown, LogIn } from 'lucide-vue-next';
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
  <!-- 评论输入区域 -->
  <div class="modern-comment-input">
    <div class="input-container">
      <Avatar 
        :src="currentUser?.avatar" 
        :name="currentUser?.name" 
        size="medium" 
        :show-ring="true"
        class="input-avatar"
      />

      <!-- 已登录用户输入框 -->
      <AddItem 
        v-if="currentUser?.id" 
        @confirm="addItem" 
        ref="addItemDom" 
        class="modern-add-item"
        placeholder="说点什么..." 
      />

      <!-- 未登录提示 -->
      <div v-else class="login-prompt">
        <div class="prompt-content">
          <div class="prompt-icon">
            <LogIn :size="24" />
          </div>
          <div class="prompt-text">
            <p class="prompt-title">参与讨论</p>
            <p class="prompt-desc">
              想要参与讨论？
              <span @click="() => store.commit('showLogin')" class="login-link">
                登录
              </span>
              后发表你的看法
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 评论列表区域 -->
  <div v-if="data?.count" class="modern-comment-list">
    <!-- 评论标题 -->
    <div class="comment-header">
      <div class="header-content">
        <h2 class="comment-title">
          <MessageCircle :size="20" class="mr-2" />
          全部评论
        </h2>
        <div class="comment-count">{{ data.count }}</div>
      </div>
      <div class="header-divider"></div>
    </div>

    <!-- 评论列表 -->
    <List class="comment-items" :data-list="data.list" item-class="comment-item-wrapper">
      <template #default="{ item }">
        <div class="comment-item-container">
          <Item :data="{ ...item, article: data?.article }" type="comment">
            <template #replies>
              <Reply v-if="item.replies?.length" :data="{ ...item, article: data?.article }" />
              <div 
                v-if="item.replyCount > item.replies?.length" 
                @click="() => loadMoreReply(item.id)"
                class="load-more-replies"
              >
                <div class="load-more-content">
                  <ChevronDown :size="16" />
                  <span>查看更多回复 ({{ item.replyCount - 2 }})</span>
                </div>
              </div>
            </template>
          </Item>
        </div>
      </template>
    </List>
  </div>

  <!-- 空状态 -->
  <CommentEmpty v-else />
</template>

<style scoped>
.moment {
  background: var(--glass-bg, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.modern-comment-input {
  margin-top: 2.5rem;
  margin-bottom: 2rem;
}

.input-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.input-avatar {
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.modern-add-item {
  flex: 1;
  min-width: 0;
}

/* 🔐 未登录提示样式 */
.login-prompt {
  flex: 1;
  min-width: 0;
}

.prompt-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg,
      #fef2f2 0%,
      #fff1f2 50%,
      #fce7e7 100%);
  border: 2px solid #fecaca;
  border-radius: 20px;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  overflow: hidden;
}

.prompt-content:hover {
  background: linear-gradient(135deg,
      #fce7e7 0%,
      #fca5a5 50%,
      #f87171 100%);
  border-color: #f87171;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(248, 113, 113, 0.3);
}

.prompt-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  border-radius: 50%;
  color: white;
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.4);
}

.prompt-icon i {
  font-size: 24px;
}

.prompt-text {
  flex: 1;
}

.prompt-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--showmd-text-color-primary);
  margin-bottom: 0.375rem;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.prompt-desc {
  font-size: 0.9375rem;
  color: var(--showmd-text-color-weak);
  line-height: 1.5;
}

.login-link {
  color: #f87171;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  padding: 0.125rem 0.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.login-link:hover {
  color: #ef4444;
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%);
  transform: translateY(-1px);
}

/* ========================================
   📝 评论列表区域
   ======================================== */
.modern-comment-list {
  margin-top: 3rem;
}

.comment-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.comment-title {
  display: flex;
  align-items: center;
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--showmd-text-color-primary);
  background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.comment-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 1rem;
  background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
  color: white;
  font-size: 0.9375rem;
  font-weight: 700;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.4);
}

.header-divider {
  height: 3px;
  background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
  border-radius: 2px;
  opacity: 0.8;
}

/* 📋 评论项容器 */
.comment-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item-wrapper {
  margin-bottom: 0 !important;
}

.comment-item-container {
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(254, 242, 242, 0.3) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid rgba(248, 113, 113, 0.2);
  border-radius: 24px;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  overflow: hidden;
}

.comment-item-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(248, 113, 113, 0.2);
  border-color: rgba(248, 113, 113, 0.4);
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(254, 242, 242, 0.5) 100%);
}

/* 🔄 加载更多回复按钮 */
.load-more-replies {
  margin-top: 1.5rem;
  margin-left: 3rem;
  cursor: pointer;
}

.load-more-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg,
      #fef2f2 0%,
      #fff1f2 50%,
      #fce7e7 100%);
  border: 2px solid #fecaca;
  border-radius: 16px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #dc2626;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  overflow: hidden;
  max-width: fit-content;
}

.load-more-content:hover {
  background: linear-gradient(135deg,
      #fce7e7 0%,
      #fca5a5 50%,
      #f87171 100%);
  border-color: #f87171;
  color: #991b1b;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(248, 113, 113, 0.3);
}

/* ========================================
   🌙 暗色主题适配
   ======================================== */
.dark .input-container {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .prompt-content {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.15) 0%,
      rgba(239, 68, 68, 0.15) 50%,
      rgba(220, 38, 38, 0.15) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .prompt-content:hover {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.25) 0%,
      rgba(239, 68, 68, 0.25) 50%,
      rgba(220, 38, 38, 0.25) 100%);
  border-color: rgba(248, 113, 113, 0.5);
}

.dark .comment-item-container {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.6) 0%, 
    rgba(248, 113, 113, 0.1) 100%);
  border-color: rgba(248, 113, 113, 0.2);
}

.dark .comment-item-container:hover {
  border-color: rgba(248, 113, 113, 0.4);
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.7) 0%, 
    rgba(248, 113, 113, 0.15) 100%);
}

.dark .load-more-content {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.15) 0%,
      rgba(239, 68, 68, 0.15) 50%,
      rgba(220, 38, 38, 0.15) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .load-more-content:hover {
  background: linear-gradient(135deg,
      rgba(248, 113, 113, 0.25) 0%,
      rgba(239, 68, 68, 0.25) 50%,
      rgba(220, 38, 38, 0.25) 100%);
  border-color: rgba(248, 113, 113, 0.4);
}

/* ========================================
   📱 响应式适配
   ======================================== */
@media (max-width: 768px) {
  .input-container {
    padding: 1rem;
    border-radius: 16px;
    gap: 0.75rem;
  }

  .comment-item-container {
    padding: 1rem;
    border-radius: 12px;
  }

  .load-more-replies {
    margin-left: 2rem;
  }

  .load-more-content {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .comment-title {
    font-size: 1.125rem;
  }

  .prompt-icon {
    width: 40px;
    height: 40px;
  }

  .prompt-title {
    font-size: 0.9375rem;
  }

  .prompt-desc {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .modern-comment-input {
    margin-top: 2rem;
  }

  .input-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .input-avatar {
    align-self: flex-start;
    margin-top: 0;
  }

  .prompt-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .load-more-replies {
    margin-left: 1rem;
  }
}
</style>
