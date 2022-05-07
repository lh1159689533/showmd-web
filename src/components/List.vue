<script lang="ts">
import { defineComponent, toRefs, ref } from 'vue';

export default defineComponent({
  name: 'List',
  props: {
    dataList: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    const { dataList }: any = toRefs(props);
    const hoverIndex = ref<number>(-1);

    return {
      dataList,
      hoverIndex,
    };
  },
});
</script>

<template>
  <ul v-bind='$attrs' class='overflow-auto'>
    <li
      v-for='(item, index) in dataList'
      :key='item.id || item.key'
      @mouseenter='() => hoverIndex = index'
      @mouseleave='() => hoverIndex = -1'
    >
      <slot :item='item' :index='index' :hoverIndex='hoverIndex'>
        <span>{{item}}</span>
      </slot>
    </li>
  </ul>
</template>

<style scoped>
</style>