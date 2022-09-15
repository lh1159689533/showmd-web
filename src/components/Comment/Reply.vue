<script lang='ts'>
import { defineComponent } from 'vue';
import Item from './Item.vue';

export default defineComponent({
  name: 'Reply',
  components: { Item },
  props: {
    replies: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<template>
  <List :class='$attrs["class"]' class='reply-list' :data-list='replies' item-class='mt-8'>
    <template #default='{ item }'>
      <Item :data='item' type='reply' />
    </template>
  </List>
</template>

<style scoped>
</style>
