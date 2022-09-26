<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'List',
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['click'],
  setup() {
    const hoverIndex = ref<number>(-1);

    return {
      hoverIndex,
    };
  },
});
</script>

<template>
  <ul class='overflow-y-auto overflow-x-hidden'>
    <li
      v-for='(item, index) in dataList'
      :key='item.id || item.key || index'
      :class='$attrs["item-class"]'
      @click='(e) => $emit("click", item, e)'
      @mouseenter='() => hoverIndex = index'
      @mouseleave='() => hoverIndex = -1'
    >
      <slot :item='item' :index='index' :hover-index='hoverIndex'>
        <span>{{ item }}</span>
      </slot>
    </li>
  </ul>
</template>

<style scoped>
</style>