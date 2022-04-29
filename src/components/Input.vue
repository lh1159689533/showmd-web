<script lang='ts'>
import { defineComponent } from 'vue';
import Icon from '@components/Icon.vue';

export default defineComponent({
  name: 'Input',
  props: {
    type: String, // 前缀图标类型
  },
  components: { Icon },
  setup() {},
});
</script>

<template>
  <div v-if='!!type' class='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
    <Icon :type='type' style='color: rgb(129 140 248)' />
  </div>
  <input
    type='text'
    :class='{ "pl-10": !!type }'
    class='border placeholder-gray-300 outline-none p-2 bg-opacity-50 block shadow-sm sm:text-sm rounded-md border-gray-300 focus:border-indigo-600'
    v-bind='$attrs'
  />
</template>

<style scoped>
</style>
