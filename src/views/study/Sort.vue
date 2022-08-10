<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Sort',
  setup() {
    const sortList = [
      { title: '推荐', key: 'recommend' },
      { title: '最新', key: 'latest' },
    ];
    const sort = ref(sortList[0].key);

    return {
      sortList,
      sort,
    };
  },
});
</script>

<template>
  <List :data-list='sortList' class='sort-list flex text-gray-800 p-3' style='font-size: 0.85rem'>
    <template #default='{ item }'>
      <span @click='() => sort = item.key' :class='[item.key === sort ? "text-indigo-500" : ""]' class='cursor-pointer hover:text-indigo-500 px-4'>{{ item.title }}</span>
    </template>
  </List>
</template>

<style scoped>
.sort-list > li:nth-child(odd) > span {
  border-right: 1px solid #bbb;
}
</style>