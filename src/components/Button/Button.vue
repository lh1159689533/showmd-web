<script lang='ts'>
import { defineComponent } from 'vue';
import Icon from '@components/Icon.vue';

export default defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    icon: String, // upload download new trash
  },
  components: { Icon },
});
</script>

<template>
  <button class='new-project flex flex-row justify-center items-center' :role='type'>
    <Icon v-if='icon' :type='icon' class='mr-2' />
    <slot></slot>
  </button>
</template>

<style scoped>
@import url('./button.css');
</style>
