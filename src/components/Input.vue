<script lang='ts'>
import { defineComponent } from 'vue';
import Icon from '@components/Icon.vue';

export default defineComponent({
  name: 'Input',
  props: {
    type: String, // 前缀图标类型
    modelValue: String,
  },
  emits: ['update:modelValue'],
  components: { Icon },
});
</script>

<template>
  <input
    type='text'
    :class='{ "pl-10": !!type }'
    class='border placeholder-gray-300 outline-none h-full bg-opacity-50 block shadow-sm rounded-md border-gray-300 focus:border-indigo-600'
    v-bind='$attrs'
    :value='modelValue'
    @input='(e) => $emit("update:modelValue", e.target.value)'
  />
  <div v-if='!!type' class='input-icon absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
    <Icon :type='type' style='color: inherit' />
  </div>
</template>

<style scoped>
input:focus + .input-icon {
  @apply text-indigo-500;
}
</style>
