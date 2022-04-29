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
    const { dataList } = toRefs(props);
    const hoverIndex = ref<number>(-1);

    return {
      dataList,
      hoverIndex,
    };
  },
});
</script>

<template>
  <ul id='list' v-bind='$attrs'>
    <li
      v-for='(item, index) in dataList'
      :key='item'
      @mouseenter='() => hoverIndex = index'
      @mouseleave='() => hoverIndex = -1'
      class='hover:bg-gray-100'
    >
      <slot :item='item' :index='index' :hoverIndex='hoverIndex'>
        <span>{{item}}</span>
      </slot>
    </li>
  </ul>
</template>

<style scoped>
</style>