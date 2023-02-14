<!-- 专栏添加文章 -->
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watchEffect } from 'vue';
import message from '@utils/message';
import { addArticle, findArticleListNotInColumn } from '@service/column';

const props = defineProps<{
  id?: number | null
}>();
const emit = defineEmits<{ (e: 'close'): void, (e: 'callback'): void }>();

const searchKey = ref('');
const searchTimer = ref();
const selectionArticle = ref([]);
const articleList = ref([]);
const articleTableRef = ref();

watchEffect(async () => {
  if (props.id) {
    articleList.value = await findArticleListNotInColumn();
  }
});

const selectionChange = (selection) => {
  selectionArticle.value = selection;
};

const add = async () => {
  const isSucc = await addArticle(props.id, selectionArticle.value.map(c => c.id));
  if (isSucc) {
    message.success('添加文章成功');
    emit('callback');
  } else {
    message.error('添加文章失败');
  }
};

const searchArtile = () => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value);
  }
  searchTimer.value = setTimeout(async () => {
    articleList.value = await findArticleListNotInColumn(searchKey.value);
  }, 500);
};
</script>

<template>
  <el-dialog :model-value='true' :close-on-click-modal='false' :show-close='false' :width='800'>
    <template #header>
      <div class='flex px-2'>
        <span class='flex-1'>将文章添加至此专栏</span>
        <div class='w-80'><el-input v-model='searchKey' @input='searchArtile' placeholder='请输入关键字搜索' clearable /></div>
      </div>
    </template>
    <el-table ref='articleTableRef' :data='articleList' style='width: 100%' @selection-change='selectionChange'
      :height='350' empty-text='暂无可收录文章' @row-click='(row) => articleTableRef.toggleRowSelection(row)'>
      <el-table-column type='selection' width='55' />
      <el-table-column property='name'>
        <template #header>
          <span class='tag text-xs text-indigo-600 border inline-flex justify-center items-center h-6'>已选择
            {{ selectionArticle?.length }} 项</span>
        </template>
      </el-table-column>
      <el-table-column property='updateTime' align='right' />
    </el-table>
    <template #footer>
      <el-button type='primary' @click='add' :disabled='selectionArticle?.length === 0'>添加</el-button>
      <el-button @click='() => $emit("close")'>取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tag {
  padding: 0 9px;
  border-radius: 4px;
  background-color: rgba(79, 70, 229, 0.1);
  border-color: rgba(79, 70, 229, 0.2);
}
</style>