<!-- 专栏移动文章 -->
<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';
import message from '@utils/message';
import { findListByUserId, moveArticle } from '@service/column';

const props = defineProps<{
  columnId: number | null;
  articleIds?: number[];
}>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'callback'): void }>();

const tableRef = ref();
const searchKey = ref('');
const searchTimer = ref();
const columnList = ref([]);

const findColumnList = async (searchKey = '') => {
  columnList.value = await findListByUserId(searchKey);
  columnList.value = columnList.value.filter((item) => item.id !== props.columnId);
};

const onSelect = (_, row) => {
  tableRef.value.clearSelection();
  tableRef.value.toggleRowSelection(row);
};

// 移动文章至专栏
const move = async () => {
  const currentColumn = tableRef.value.getSelectionRows()?.[0];

  if (currentColumn?.id) {
    const isSucc = await moveArticle(currentColumn.id, props.columnId, props.articleIds);
    if (isSucc) {
      message.success('移动文章成功');
      emit('callback');
    } else {
      message.error('移动文章失败');
    }
  }
};

const searchColumn = () => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value);
  }
  searchTimer.value = setTimeout(async () => {
    findColumnList(searchKey.value);
  }, 500);
};

// watchEffect(() => {
//   if (user.value?.id) {
//     findColumnList();
//   }
// });
findColumnList();
</script>

<template>
  <el-dialog :model-value="true" :close-on-click-modal="false" :show-close="false" :width="800">
    <template #header>
      <div class="flex px-3 items-center">
        <span>将文章移动至其他专栏</span>
        <span class="px-2 text-gray-400">|</span>
        <span class="flex-1 text-gray-500 text-sm">每次只能选择一个专栏</span>
        <div class="w-80"><el-input v-model="searchKey" @input="searchColumn" placeholder="请输入关键字搜索" clearable /></div>
      </div>
    </template>
    <el-table ref="tableRef" :data="columnList" style="width: 100%" :show-header="false" @select="onSelect" :height="350" empty-text="暂无其他专栏">
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" />
    </el-table>
    <template #footer>
      <el-button type="primary" @click="move" :disabled="tableRef?.getSelectionRows()?.length === 0">移动</el-button>
      <el-button @click="() => $emit('close')">取消</el-button>
    </template>
  </el-dialog>
</template>

<style></style>
