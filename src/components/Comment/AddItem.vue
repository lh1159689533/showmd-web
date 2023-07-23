<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import Emoji from './Emoji/Emoji.vue';
import MyCode from './Code/Code.vue';

import { formatEmoji, formatCode } from './utils';

export default defineComponent({
  name: 'AddItem',
  components: { Emoji, MyCode },
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
  <div class="add-item" :class="$attrs.class">
    <div
      ref="dom" id="textareaBox" contenteditable="true" :placeholder="placeholder" @input="handleValueChange"
      @focus="handleFoucs" @blur="handleBlur"
      class="textarea w-full p-2 text-sm rounded border border-gray-300 focus:border-indigo-500 dark:border-zinc-800 dark:focus:border-indigo-500"
    >
    </div>
    <div v-show="isShowAction" class="action-box text-sm mt-2 flex items-center gap-4 text-gray-500 dark:text-zinc-500">
      <el-dropdown
        @visible-change="handleIsShowEmoji" trigger="click" placement="bottom-start"
        popper-class="emoji-dropdown"
      >
        <div class="flex items-center">
          <i class="iconfont icon-emoji text-xl mr-1"></i>
          <span>表情</span>
        </div>
        <template #dropdown>
          <Emoji @change="handleEmojiChange" />
        </template>
      </el-dropdown>
      <el-dropdown
        @visible-change="handleIsShowEmoji" trigger="click" class="flex-1" placement="bottom-start"
        popper-class="emoji-dropdown"
      >
        <div class="flex items-center">
          <i class="iconfont icon-code text-xl mr-1"></i>
          <span>代码</span>
        </div>
        <template #dropdown>
          <MyCode @change="handleCodeChange" />
        </template>
      </el-dropdown>
      <span>⌘ + Enter</span>
      <button
        @click="addItem" :disabled="!value || isPublish"
        class="ml-2 py-2 px-5 rounded text-white bg-indigo-500 disabled:bg-indigo-300 dark:text-zinc-300 dark:disabled:bg-zinc-500"
      >
        {{ isPublish ? '发布中' : '发布' }}
      </button>
    </div>
  </div>
</template>

<style>
.emoji-dropdown {
  border: none !important;
  box-shadow: 0 8px 24px rgb(0 0 0 / 16%) !important;
}

.textarea {
  min-width: 400px;
  min-height: 80px;
  margin-left: auto;
  margin-right: auto;
  outline: 0;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}

.textarea:empty::before {
  content: attr(placeholder);
  color: #6b7280;
  cursor: text;
}

.textarea-emoji {
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: default;
  margin: 0 2px;
}
</style>
