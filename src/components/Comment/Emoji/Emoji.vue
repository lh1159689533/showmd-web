<script lang='ts' setup>
import { emojiConf } from './emoji.config';

const emit = defineEmits(['change']);
const handleEmojiClick = (emoji) => {
  emit('change', emoji);
};
</script>

<template>
  <div class='emoji' style='width: 308px'>
    <el-tabs tab-position='bottom' class='emoji-tabs' type='border-card'>
      <el-tab-pane v-for='emoji in emojiConf' :key='emoji.type'>
        <template #label>
          <div class='label flex items-center justify-center w-6 h-full'>
            <img :src='emoji.icon' />
          </div>
        </template>
        <List
          :data-list='emoji.list' @click='handleEmojiClick' class='p-2 h-56 grid justify-center'
          :style='`grid-template-columns:repeat(auto-fit, ${emoji.width});grid-template-rows:repeat(auto-fit, ${emoji.height})`'
          item-class='inline-flex p-1 cursor-pointer justify-center items-center'
        >
          <template #default='{ item }'>
            <img :src='item.path' :title='item.title' />
          </template>
        </List>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.emoji .emoji-tabs {
  border: none !important;
}

.emoji .emoji-tabs .el-tabs__content {
  padding: 0 !important;
}

.emoji .emoji-tabs ul>li:hover {
  transform: scale(1.3);
  transition: 300ms;
}

.emoji .emoji-tabs .el-tabs__header {
  border: none !important;
}

.emoji .emoji-tabs .el-tabs__item {
  border: none !important;
}
</style>
