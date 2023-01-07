<script lang='ts' setup>
const languages = ['javascript', 'html', 'css'];

const emit = defineEmits(['change']);
const handleEmojiClick = (emoji) => {
  emit('change', emoji);
};
</script>

<template>
  <div class='code' style='width: 120px'>
    <List :data-list='languages' @click='handleEmojiClick' class='text-sm py-2' item-class='py-2 cursor-pointer text-center hover:bg-indigo-400 hover:text-white'>
    </List>
  </div>
</template>

<style>
</style>
