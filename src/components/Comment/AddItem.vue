<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { Smile, Code, Send, Loader2 } from 'lucide-vue-next';
import Emoji from './Emoji/Emoji.vue';
import MyCode from './Code/Code.vue';

import { formatEmoji, formatCode } from './utils';

export default defineComponent({
  name: 'AddItem',
  components: { Emoji, MyCode, Smile, Code, Send, Loader2 },
  props: {
    placeholder: String,
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'cancle'],
  setup(props, { emit }) {
    // 添加条目textarea dom
    const dom = ref();
    // 当前值
    const value = ref('');
    // 是否显示操作栏
    const isShowAction = ref(false);
    // 评论发布中
    const isPublish = ref(false);

    const timer = ref();
    // 是否选择输入框
    let isFocus = false;

    onMounted(() => {
      props.autofocus && setRange();
    });

    onUnmounted(() => {
      clearTimer();
    });

    /**
     * 输入值发生变化
     */
    const handleValueChange = (ele) => {
      if (ele.target) {
        value.value = ele.target.innerText;
      }
    };

    /**
     * 选中输入框
     */
    const handleFoucs = () => {
      console.log('focus');
      isFocus = true;
      isShowAction.value = true;
      clearTimer();
    };

    const textareaBlur = () => {
      isShowAction.value = false;
      isFocus = false;
      emit('cancle');
      clearTimer();
    };

    /**
     * 输入框失去焦点
     */
    const handleBlur = () => {
      console.log('blur');
      if (value.value) return;
      timer.value = setTimeout(textareaBlur, 200);
    };

    /**
     * 输入框显示光标
     */
    const setRange = () => {
      const s = window.getSelection();
      const r = document.createRange();
      r.setStart(dom.value, 0);
      r.collapse(true);
      s.removeAllRanges();
      s.addRange(r);
      console.log('setRange');
    };

    /**
     * 发布
     */
    const addItem = () => {
      isPublish.value = true;
      emit('confirm', value.value);
    };

    /**
     * 清空输入
     */
    const clearValue = () => {
      dom.value.innerText = '';
      value.value = '';
    };

    /**
     * 发布成功回调
     */
    const success = () => {
      clearValue();
      isPublish.value = false;
    };

    /**
     * 发布失败回调
     */
    const failed = () => {
      isPublish.value = false;
    };

    /**
     * 清除timer
     */
    const clearTimer = () => {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
      }
    };

    /**
     * 表情的显隐
     */
    const handleIsShowEmoji = (isShow) => {
      if (isShow) {
        isFocus = false;
        clearTimer();
      } else {
        console.log('isFocus:', isFocus);
        !isFocus && handleBlur();
        // timer.value = setTimeout(textareaBlur, 200);
      }
    };

    const handleEmojiChange = (emoji) => {
      value.value += formatEmoji(emoji);
      dom.value.innerHTML = value.value;
      dom.value.focus();
    };

    const handleCodeChange = (lang) => {
      value.value += formatCode(lang);
      dom.value.innerHTML = value.value;
      dom.value.focus();
    };

    return {
      dom,
      value,
      isShowAction,
      isPublish,
      handleValueChange,
      handleFoucs,
      handleBlur,
      addItem,
      success,
      failed,
      handleIsShowEmoji,
      handleEmojiChange,
      handleCodeChange,
    };
  },
});
</script>

<template>
  <div class="modern-add-item" :class="$attrs.class">
    <!-- 输入框 -->
    <div
      ref="dom" 
      id="textareaBox" 
      contenteditable="true" 
      :placeholder="placeholder || '说点什么...'" 
      @input="handleValueChange"
      @focus="handleFoucs" 
      @blur="handleBlur"
      class="modern-textarea"
    ></div>
    
    <!-- 操作栏 -->
    <div v-show="isShowAction" class="modern-action-bar">
      <!-- 工具按钮组 -->
      <div class="action-tools">
        <!-- 表情选择器 -->
        <el-dropdown
          @visible-change="handleIsShowEmoji" 
          trigger="click" 
          placement="bottom-start"
          popper-class="modern-emoji-dropdown"
        >
          <div class="tool-button">
            <Smile :size="18" />
            <span>表情</span>
          </div>
          <template #dropdown>
            <Emoji @change="handleEmojiChange" />
          </template>
        </el-dropdown>

        <!-- 代码插入器 -->
        <el-dropdown
          @visible-change="handleIsShowEmoji" 
          trigger="click" 
          placement="bottom-start"
          popper-class="modern-emoji-dropdown"
        >
          <div class="tool-button">
            <Code :size="18" />
            <span>代码</span>
          </div>
          <template #dropdown>
            <MyCode @change="handleCodeChange" />
          </template>
        </el-dropdown>
      </div>

      <!-- 右侧操作区 -->
      <div class="action-right">
        <!-- 快捷键提示 -->
        <div class="shortcut-hint">
          <kbd>⌘</kbd> + <kbd>Enter</kbd>
        </div>
        
        <!-- 发布按钮 -->
        <button
          @click="addItem" 
          :disabled="!value || isPublish"
          class="publish-button"
          :class="{ 'is-publishing': isPublish }"
        >
          <span v-if="!isPublish" class="button-content">
            <Send :size="16" />
            发布
          </span>
          <span v-else class="button-content">
            <Loader2 :size="16" class="animate-spin" />
            发布中
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* 🎨 现代化评论输入组件样式 */

/* ========================================
   🎪 下拉菜单全局样式
   ======================================== */
.modern-emoji-dropdown {
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  background: var(--glass-bg, rgba(255, 255, 255, 0.9)) !important;
  overflow: hidden !important;
}

.dark .modern-emoji-dropdown {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* ========================================
   📝 输入框样式
   ======================================== */
.modern-add-item {
  width: 100%;
}

.modern-textarea {
  width: 100%;
  min-height: 100px;
  max-height: 240px;
  padding: 1.25rem 1.5rem;
  border: 3px solid transparent;
  border-radius: 20px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(254, 242, 242, 0.3) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--showmd-text-color-primary);
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  resize: none;
  overflow-y: auto;
  word-wrap: break-word;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
}

.modern-textarea:focus {
  border-color: #f87171;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(254, 242, 242, 0.5) 100%);
  box-shadow: 
    0 0 0 6px rgba(248, 113, 113, 0.15),
    0 12px 40px rgba(248, 113, 113, 0.3);
  transform: translateY(-2px);
}

.modern-textarea:empty::before {
  content: attr(placeholder);
  color: var(--showmd-text-color-weak);
  pointer-events: none;
  opacity: 0.8;
  font-style: italic;
}

/* 表情样式 */
.modern-textarea .textarea-emoji {
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: default;
  margin: 0 2px;
  vertical-align: middle;
}

/* ========================================
   🛠️ 操作栏样式
   ======================================== */
.modern-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, 
    #fef2f2 0%, 
    #fff1f2 50%, 
    #fce7e7 100%);
  border: 2px solid #fecaca;
  border-radius: 16px;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-tools {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 242, 242, 0.4) 100%);
  border: 2px solid rgba(248, 113, 113, 0.3);
  border-radius: 12px;
  color: #dc2626;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  overflow: hidden;
}

.tool-button:hover {
  background: linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(252, 165, 165, 0.6) 100%);
  border-color: #f87171;
  color: #991b1b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.3);
}

.tool-button i {
  font-size: 1.125rem;
}

.action-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 🎹 快捷键提示 */
.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 600;
}

.shortcut-hint kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #fce7e7 100%);
  border: 2px solid #f87171;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #dc2626;
  box-shadow: 0 3px 8px rgba(248, 113, 113, 0.2);
}

/* 🚀 发布按钮 */
.publish-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 6rem;
  height: 3rem;
  padding: 0 1.5rem;
  background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.4);
}

.publish-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(248, 113, 113, 0.5);
  filter: brightness(1.1);
}

.publish-button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.4);
}

.publish-button:disabled {
  background: var(--showmd-text-color-disable, #9ca3af);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  filter: none;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

/* 🔄 加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.is-publishing {
  pointer-events: none;
}

/* ========================================
   🌙 暗色主题适配
   ======================================== */
.dark .modern-textarea {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.6) 0%, 
    rgba(248, 113, 113, 0.1) 100%);
  border-color: transparent;
}

.dark .modern-textarea:focus {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(248, 113, 113, 0.15) 100%);
  border-color: #f87171;
}

.dark .modern-action-bar {
  background: linear-gradient(135deg, 
    rgba(248, 113, 113, 0.15) 0%, 
    rgba(239, 68, 68, 0.15) 50%, 
    rgba(220, 38, 38, 0.15) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .tool-button {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(248, 113, 113, 0.1) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .tool-button:hover {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(248, 113, 113, 0.2) 100%);
  border-color: rgba(248, 113, 113, 0.4);
}

.dark .shortcut-hint kbd {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(248, 113, 113, 0.1) 100%);
  border-color: rgba(248, 113, 113, 0.3);
  color: var(--showmd-text-color-primary);
}

/* ========================================
   📱 响应式适配
   ======================================== */
@media (max-width: 768px) {
  .modern-textarea {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    min-height: 70px;
  }

  .modern-action-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .action-tools {
    justify-content: center;
  }

  .action-right {
    justify-content: space-between;
  }

  .tool-button {
    padding: 0.5rem;
    font-size: 0.8125rem;
  }

  .tool-button span {
    display: none;
  }

  .publish-button {
    min-width: 4rem;
    height: 2.25rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .modern-textarea {
    padding: 0.75rem;
    min-height: 60px;
  }

  .modern-action-bar {
    padding: 0.625rem;
  }

  .shortcut-hint {
    font-size: 0.75rem;
  }

  .shortcut-hint kbd {
    min-width: 1.25rem;
    height: 1.25rem;
    font-size: 0.6875rem;
  }
}
</style>
