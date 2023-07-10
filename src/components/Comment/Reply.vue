<script lang="ts" setup>
import { defineProps } from 'vue';
import Item from './Item.vue';

defineProps<{ data: any }>();
</script>

<template>
  <List :class="$attrs['class']" class="reply-list" :data-list="data.replies" item-class="mt-8">
    <template #default="{ item }">
      <Item :data="{ ...item, article: data?.article }" type="reply" />
    </template>
  </List>
</template>

<style scoped></style>
