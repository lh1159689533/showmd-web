<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'AddItem',
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
    const dom = ref(null);
    // 当前值
    const value = ref('');
    // 是否显示操作栏
    const isShowAction = ref(false);
    // 评论发布中
    const isPublish = ref(false);

    onMounted(() => {
      props.autofocus && setRange();
    });

    /**
     * 输入值发生变化
     */
    const handleValueChange = (ele) => {
      value.value = ele.target?.innerText;
    };

    /**
     * 选中输入框
     */
    const handleFoucs = () => {
      isShowAction.value = true;
    };

    /**
     * 输入框失去焦点
     */
    const handleBlur = () => {
      if (value.value) return;
      isShowAction.value = false;
      emit('cancle');
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
    };

    /**
     * 发布
     */
    const addItem = () => {
      isPublish.value = true;
      emit('confirm', value.value);
    };

    const clearValue = () => {
      dom.value.innerText = '';
      value.value = '';
    };

    const success = () => {
      clearValue();
      isPublish.value = false;
    };

    const failed = () => {
      isPublish.value = false;
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
    };
  },
});
</script>

<template>
  <div class='add-item' :class='$attrs.class'>
    <div
      ref='dom'
      contenteditable
      :placeholder='placeholder'
      @input='handleValueChange'
      @focus='handleFoucs'
      @blur='handleBlur'
      class='textarea w-full p-2 text-sm rounded border-gray-300 border focus:border-indigo-500'
    ></div>
    <div v-show='isShowAction' class='action-box text-sm text-gray-500 mt-2 flex items-center'>
      <span class='flex-1'>表情</span>
      <span>⌘ + Enter</span>
      <button @click='addItem' :disabled='!value || isPublish' class='ml-2 bg-indigo-500 py-2 px-5 text-white rounded disabled:bg-indigo-300'>{{ isPublish ? '发布中' : '发布' }}</button>
    </div>
  </div>
</template>

<style scoped>
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
}
</style>
